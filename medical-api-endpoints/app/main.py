from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.logging_conf import logger
from app.chains.schemas import (
    SummarizeRequest, SummarizeResponse, PrescriptionSummary,
    AnswerQueryRequest, AnswerQueryResponse
)
from app.chains.safety import prefilter, safety_footer
from app.chains.medical_model import run_summarize, run_qa
from app.chains.gpt_refiner import refine_prescription_to_json, refine_answer_to_json
from app.chains import retrieval as med_retrieval
from app.utils.json_extract import extract_first_json
from app.utils.prescription_context import flatten_prescription_context
import json

app = FastAPI(title="Medical Assistant API (LangChain via HF Endpoints)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/summarize-prescription", response_model=SummarizeResponse)
async def summarize_prescription(payload: SummarizeRequest):
    ok, msg = prefilter(payload.text)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)

    try:
        # 1) MEDICAL MODEL → paragraph draft
        draft_paragraph = run_summarize(payload.text)

        # 2) GPT-OSS REFINER → STRICT JSON
        json_str = refine_prescription_to_json(draft_paragraph)

        # 3) Parse/validate JSON
        try:
            data = extract_first_json(json_str)
        except Exception as e:
            logger.error(f"JSON parse failed: {e}; raw=\n{json_str}")
            raise HTTPException(status_code=502, detail="Refiner returned invalid JSON")

        data.setdefault("disclaimer", safety_footer()["disclaimer"])
        validated = PrescriptionSummary(**data)
        return SummarizeResponse(summary=validated)

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=500, detail="Internal error during summarization")

@app.post("/answer-query", response_model=AnswerQueryResponse)
async def answer_query(payload: AnswerQueryRequest):
    ok, msg = prefilter(payload.query)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)

    try:
        # (A) In-code Indian-meds context (as before)
        med_snippets = med_retrieval.search(payload.query)
        med_context = "\n".join(med_snippets)

        # (B) NEW: Context from the provided prescription summary (if any)
        presc_context_str = ""
        presc_sources: list[str] = []
        if payload.prescription_summary:
            try:
                presc_context_str, presc_sources = flatten_prescription_context(payload.prescription_summary)
            except Exception as e:
                logger.warning(f"Unable to parse prescription_summary; proceeding without it. err={e}")

        # (C) Merge contexts: prescription context first, then in-code meds hints
        merged_context = "\n".join([s for s in [presc_context_str, med_context] if s])

        # 1) MEDICAL MODEL → paragraph draft (now with merged context)
        draft_paragraph = run_qa(payload.query, context=merged_context)

        # 2) GPT-OSS REFINER → STRICT JSON (AnswerQueryResponse schema)
        #    Pass sources as text so refiner can return them; also backfill later if missing
        all_sources = presc_sources + med_snippets
        sources_text = "\n".join(all_sources)
        json_str = refine_answer_to_json(draft_paragraph, sources_text=sources_text)

        # 3) Parse JSON and finalize
        
        try:
            obj = extract_first_json(json_str)
        except Exception as e:
            logger.error(f"JSON parse failed: {e}; raw=\n{json_str}")
            raise HTTPException(status_code=502, detail="Refiner returned invalid JSON")

        # Ensure safety block presence/consistency

        if "safety" not in obj or not isinstance(obj["safety"], dict):
            obj["safety"] = safety_footer()
        else:
            sf = safety_footer()
            obj["safety"].setdefault("disclaimer", sf["disclaimer"])
            obj["safety"].setdefault("emergency", sf["emergency"])
            obj["safety"].setdefault("version", sf["version"])

        # Ensure sources array exists; if refiner omitted, use our merged sources
        if "sources" not in obj or not isinstance(obj["sources"], list):
            obj["sources"] = all_sources

        # Pydantic validation to guarantee contract
        validated = AnswerQueryResponse(**obj)
        return validated

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=500, detail="Internal error during Q&A")
