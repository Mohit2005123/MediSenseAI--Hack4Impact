from typing import Tuple, Dict

HARD_BLOCK_KEYWORDS = [
    "how to overdose",
    "abort at home",
    "fentanyl recreation",
    "suicide method",
    "self-harm instructions",
]

INDIA_CONTACT_HINT = (
    "If this is an emergency in India, call 112 or visit the nearest emergency department."
)

def prefilter(text: str) -> Tuple[bool, str | None]:
    lower = text.lower()
    for bad in HARD_BLOCK_KEYWORDS:
        if bad in lower:
            return False, "Request cannot be assisted due to safety policy."
    return True, None

def safety_footer() -> Dict:
    return {
        "disclaimer": "Informational only; not a substitute for professional medical advice.",
        "emergency": INDIA_CONTACT_HINT,
        "version": "v1"
    }
