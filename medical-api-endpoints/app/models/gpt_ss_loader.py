from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from app.config import settings

def build_gpt_ss_runnable():
    """
    LangChain Runnable for your GPT-SS refiner hosted on Hugging Face by repo_id.
    Replace repo_id with your actual GPT-SS model id.
    """
    llm = HuggingFaceEndpoint(
        repo_id="openai/gpt-oss-20b",   # TODO: replace with your GPT-SS repo_id
        task="text-generation",
        huggingfacehub_api_token=settings.HF_TOKEN,
        max_new_tokens=384,
        temperature=0.3,
        return_full_text=False,
    )
    return ChatHuggingFace(llm=llm)
