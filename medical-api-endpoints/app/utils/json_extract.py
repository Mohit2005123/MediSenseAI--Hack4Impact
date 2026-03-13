import json, re

def extract_first_json(text: str) -> dict:
    # 1) try direct
    s = (text or "").strip()
    try:
        return json.loads(s)
    except Exception:
        pass

    # 2) fenced ```json ... ```
    m = re.search(r"```json\\s*(\\{[\\s\\S]*?\\})\\s*```", s, re.IGNORECASE)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass

    # 3) any first {...} block
    start = s.find("{")
    end = s.rfind("}")
    if start != -1 and end != -1 and end > start:
        cand = s[start:end+1]
        try:
            return json.loads(cand)
        except Exception:
            pass

    # 4) <Answer>...</Answer> variant with optional fences
    m = re.search(r"<Answer>\\s*(?:```json)?\\s*(\\{[\\s\\S]*?\\})\\s*(?:```)?\\s*</Answer>", s, re.IGNORECASE)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass

    raise ValueError("No valid JSON object found in model output")
