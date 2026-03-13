# Design

FastAPI → (safety + validation) → LangChain summarize/Q&A prompts → HF endpoint calls → refiner → validated JSON/text → response.

Calls use HF Inference API payload:
{ "inputs": "<prompt>", "parameters": { "max_new_tokens": N, "temperature": T } }
