
# 🏥 Medical Assistant API

This project is a **microservice-based medical assistant API** built with **FastAPI**, **LangChain**, and **Hugging Face-hosted models**. It helps:

1. **Summarize prescriptions** into a clean structured JSON.
2. **Answer patient queries** in simple, safe, and patient-friendly language — with special focus on **Indian medicines** and **rural healthcare needs**.

---

## 🚀 Features

* **LangChain orchestration** with two models:

  * `Intelligent-Internet/II-Medical-8B` → medical reasoning (draft responses in paragraphs).
  * `gpt-oss` (configurable) → refines drafts into **structured JSON** for reliable output.
* **Two API endpoints**:

  * `/summarize-prescription`: Summarize OCR text of prescriptions into structured fields (medicines, dosage, frequency, instructions, advice).
  * `/answer-query`: Answer natural language queries, using the prescription summary (if provided) and Indian-medicine context.
* **Safety Layer**:

  * Prefilter unsafe queries.
  * Always append disclaimers and emergency contacts.
* **Rural-friendly context**:

  * Indian medicine database built-in.
  * Handles queries in simple English/Hinglish.

---

## 🌐 Base URL

The API is deployed and publicly available here:
 **[https://medical-api-endpoints.onrender.com/](https://medical-api-endpoints.onrender.com/)**

---

## 📂 Project Structure

```
app/
 ├─ chains/
 │   ├─ prompts.py             # Prompt templates for medical & refiner models
 │   ├─ schemas.py             # Pydantic models for requests/responses
 │   ├─ safety.py              # Prefilter and safety footer
 │   ├─ retrieval.py           # Indian medicine hints
 │   ├─ medical_model.py       # Medical model draft chains
 │   └─ gpt_refiner.py         # Refiner model JSON-output chains
 │
 ├─ models/
 │   ├─ ii_medical_loader.py   # Hugging Face II-Medical-8B loader
 │   └─ gpt_ss_loader.py       # Hugging Face GPT-OSS refiner loader
 │
 ├─ utils/
 │   ├─ json_extract.py        # Robust JSON extraction helper
 │   └─ prescription_context.py# Flattens prescription summary into context lines
 │
 ├─ config.py                  # Env config
 ├─ logging_conf.py            # Loguru logging
 └─ main.py                    # FastAPI endpoints
```

---

## ⚙️ Setup

### 1. Clone and create venv

```bash
git clone https://github.com/sparsh7637/medical-api-endpoints
cd medical-assistant-api
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Environment variables

Create `.env`:

```ini
HF_TOKEN=hf_xxx_your_token
CORS_ORIGINS=*
APP_HOST=127.0.0.1
APP_PORT=8080
```

### 4. Run locally

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
```


---

## 📡 API Endpoints

### `GET /health`

Quick liveness probe.
**Response**

```json
{"status":"ok"}
```

---

### `POST /summarize-prescription`

**Input**

```json
{
  "text": "Patient: Suresh Kumar. Dx: Acute Gastritis. Rx: Pantocid D 40 mg OD before breakfast x 7 days; Sucralfate syrup 2 tsp TID before meals x 10 days; ORS powder as needed for dehydration."
}
```

**Response**

```json
{
  "summary": {
    "patient_name": "Suresh Kumar",
    "diagnosis_or_complaints": "Acute Gastritis",
    "medicines": [
      {
        "name": "Pantocid D",
        "dosage": "40 mg",
        "frequency": "once daily",
        "duration": "7 days",
        "instructions": "before breakfast"
      },
      {
        "name": "Sucralfate syrup",
        "dosage": "2 tsp",
        "frequency": "three times daily",
        "duration": "10 days",
        "instructions": "before meals"
      },
      {
        "name": "ORS powder",
        "dosage": null,
        "frequency": "as needed",
        "duration": null,
        "instructions": "for dehydration"
      }
    ],
    "tests_or_followup": null,
    "red_flags": null,
    "generic_advice": "Avoid spicy food and maintain hydration.",
    "disclaimer": "This information is for general informational purposes only and does not constitute medical advice."
  }
}
```

---

### `POST /answer-query`

**Input**

```json
{
  "query": "Can I drink tea in the morning if I am taking Pantocid D before breakfast?",
  "prescription_summary": {
    "summary": {
      "patient_name": "Suresh Kumar",
      "diagnosis_or_complaints": "Acute Gastritis",
      "medicines": [
        {
          "name": "Pantocid D",
          "dosage": "40 mg",
          "frequency": "once daily",
          "duration": "7 days",
          "instructions": "before breakfast"
        },
        {
          "name": "Sucralfate syrup",
          "dosage": "2 tsp",
          "frequency": "three times daily",
          "duration": "10 days",
          "instructions": "before meals"
        },
        {
          "name": "ORS powder",
          "dosage": null,
          "frequency": "as needed",
          "duration": null,
          "instructions": "for dehydration"
        }
      ]
    }
  }
}
```

**Response**

```json
{
  "answer": "Pantocid D should be taken on an empty stomach. Wait about 30 minutes before tea or breakfast. If stomach burning continues, consult your doctor.",
  "safety": {
    "disclaimer": "Informational only; not a substitute for professional medical advice.",
    "emergency": "If this is an emergency in India, call 112 or visit the nearest emergency department.",
    "version": "v1"
  },
  "sources": [
    "Pantocid D (40 mg, once daily, 7 days, before breakfast)",
    "Sucralfate syrup (2 tsp, three times daily, 10 days, before meals)"
  ]
}
```


## 🔒 Safety Mechanisms

* **Prefilter**: Blocks unsafe queries (self-harm, overdose).
* **Refiner**: GPT-OSS ensures consistent JSON + patient-friendly tone.
* **Safety Footer**: Always appends disclaimers and India-specific emergency contact.


