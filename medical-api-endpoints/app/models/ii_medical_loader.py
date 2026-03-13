from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from app.config import settings

def build_ii_medical_runnable():
    """
    LangChain Runnable for II-Medical-8B hosted on Hugging Face by repo_id.
    Uses langchain-huggingface's HuggingFaceEndpoint + ChatHuggingFace.
    """
    llm = HuggingFaceEndpoint(
        repo_id="Intelligent-Internet/II-Medical-8B",
        task="text-generation",
        huggingfacehub_api_token=settings.HF_TOKEN,  # or env HUGGINGFACEHUB_API_TOKEN
        max_new_tokens=768,
        temperature=0.2,
        return_full_text=False,   # <-- pass explicitly (NOT inside model_kwargs)
        # If your endpoint supports it, you may also pass: top_p=0.9, top_k=50, repetition_penalty=1.1
        # Some installs support stop sequences via `stop_sequences=[...]`; if unsupported, omit.
    )
    return ChatHuggingFace(llm=llm)
