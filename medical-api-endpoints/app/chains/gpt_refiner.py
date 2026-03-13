# app/chains/gpt_refiner.py

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.models.gpt_ss_loader import build_gpt_ss_runnable
from app.chains.prompts import REFINER_SYSTEM, REFINER_TO_PRESCRIPTION_JSON, REFINER_TO_ANSWER_JSON

# Refine prescription DRAFT (paragraph) -> STRICT JSON (PrescriptionSummary)
prescription_refine_prompt = ChatPromptTemplate.from_messages([
    ("system", REFINER_SYSTEM),
    ("user", "{instructions}\n\nDRAFT_PARAGRAPH:\n{draft}")
])
prescription_refine_chain = prescription_refine_prompt | build_gpt_ss_runnable() | StrOutputParser()

# Refine Q&A DRAFT (paragraph) -> STRICT JSON (AnswerQueryResponse)
qa_refine_prompt = ChatPromptTemplate.from_messages([
    ("system", REFINER_SYSTEM),
    ("user", "{instructions}\n\nDRAFT_PARAGRAPH:\n{draft}\n\nSOURCES:\n{sources}")
])
qa_refine_chain = qa_refine_prompt | build_gpt_ss_runnable() | StrOutputParser()

def refine_prescription_to_json(draft_paragraph: str) -> str:
    return prescription_refine_chain.invoke({
        "instructions": REFINER_TO_PRESCRIPTION_JSON,
        "draft": draft_paragraph,
    })

def refine_answer_to_json(draft_paragraph: str, sources_text: str) -> str:
    # sources_text should be a short bullet/line list or empty string
    return qa_refine_chain.invoke({
        "instructions": REFINER_TO_ANSWER_JSON,
        "draft": draft_paragraph,
        "sources": sources_text or "",
    })
