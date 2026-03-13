from typing import List
INDIAN_MEDS = [
    {"name": "Dolo 650", "generic": "Paracetamol", "use": "Fever/Pain", "dose": "650 mg every 6–8 hours (max 3 g/day)"},
    {"name": "Azithral 500", "generic": "Azithromycin", "use": "Bacterial infections", "dose": "As prescribed; common: 500 mg OD for 3 days"},
    {"name": "Allegra 120", "generic": "Fexofenadine", "use": "Allergic rhinitis", "dose": "120 mg once daily"},
    {"name": "Omez 20", "generic": "Omeprazole", "use": "Acidity/GERD", "dose": "20 mg once daily before food"},
    {"name": "ORS Powder", "generic": "ORS", "use": "Dehydration", "dose": "As per sachet instructions with safe water"},
]
def search(text: str, k: int = 5) -> List[str]:
    q = text.lower()
    hits = []
    for r in INDIAN_MEDS:
        if r["name"].lower() in q or r["generic"].lower() in q:
            hits.append(f"{r['name']} ({r['generic']}) – {r['use']}; typical: {r['dose']}")
    return hits[:k]
