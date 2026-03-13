from typing import List, Tuple, Dict, Any

def flatten_prescription_context(prescription: Dict[str, Any]) -> Tuple[str, List[str]]:
    """
    Accepts either:
      - {"summary": { ...PrescriptionSummary... }}  OR
      - { ...PrescriptionSummary... } directly

    Returns:
      - context_str: multi-line text usable in the LLM prompt
      - sources: short source strings that we also return in API response
    """
    data = prescription.get("summary", prescription)

    pt = data.get("patient_name")
    dx = data.get("diagnosis_or_complaints")
    meds = data.get("medicines", []) or []
    tests = data.get("tests_or_followup")
    red = data.get("red_flags")
    adv = data.get("generic_advice")

    lines: List[str] = []
    srcs: List[str] = []

    if pt:
        lines.append(f"Patient: {pt}")
    if dx:
        lines.append(f"Diagnosis/Complaints: {dx}")

    if meds:
        lines.append("Medicines:")
        for m in meds:
            name = m.get("name")
            dosage = m.get("dosage")
            freq = m.get("frequency")
            dur = m.get("duration")
            instr = m.get("instructions")
            snippet = f"- {name}"
            detail = []
            if dosage: detail.append(str(dosage))
            if freq: detail.append(freq)
            if dur: detail.append(dur)
            if detail:
                snippet += f" ({', '.join(detail)})"
            if instr:
                snippet += f" — {instr}"
            lines.append(snippet)
            srcs.append(snippet.replace("- ", ""))  # short source line

    if tests:
        lines.append(f"Tests/Follow-up: {tests}")
    if red:
        lines.append(f"Red flags: {red}")
    if adv:
        lines.append(f"Advice: {adv}")

    context_str = "\n".join(lines) if lines else ""
    return context_str, srcs
