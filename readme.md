# 🩺 Swaasthya-Saathi

This is a full-stack Node.js-based WhatsApp bot that helps users understand their prescriptions. It supports **OCR**, **voice interaction in Indian languages**, and **multilingual audio summaries**. Built for accessibility and simplicity, the bot extracts medical information from prescription images and allows voice-based follow-up questions — with replies in **regional Indian languages** using **Sarvam AI** and **LLaMA 4 Scout**.

---

## 🔍 Features

- 📸 **Prescription OCR** using LLaMA 4 Scout (`meta-llama/llama-4-scout-17b`)
- 🔊 **Voice-based Q&A** using SarvamAI's Automatic Speech Recognition and text-to-speech APIs
- 🌐 **Multilingual support** (Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, English)
- 🧠 **Medical question answering**  using II-Medical-8B-1706
- 🧾 **Simple, spoken prescription summaries**
- 📤 **WhatsApp integration** using Twilio
- 🪄 Automatic language selection via audio + user reply

---

## 🛠 Tech Stack & Dependencies

- **Node.js + Express**
- **llama-4-scout-17b-16e-instruct** for OCR extraction
- **Sarvam AI** for Text to Speech and Automatic Speech Recognition
- **Twilio WhatsApp API** for whatsapp conversation
- **FFmpeg** for audio conversion (OGG ↔ WAV ↔ MP3)
- **Ngrok** for exposing local server to public internet (Tunneling)

---

## 🚀 How to Run Locally

### 1. 📥 Clone the Repo

```bash
git clone https://github.com/Mohit2005123/SwaasthyaSaathi.git
cd backend
```

### 2. 📦 Install Dependencies

```bash
npm install
```

### 3. ⚙️ Set up Environment Variables

Create a `.env` file in the root directory:

```env
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
GROQ_API_KEY=your_groq_api_key
SARVAM_API_KEY=your_sarvam_api_key
NGROK_DOMAIN=https://your-ngrok-url.ngrok.io
```

### 4. ▶️ Run the App

```bash
node server.js
```

You should see:
```
📡 WhatsApp OCR + Voice Bot running on http://localhost:3000
```

### 5. 🌐 Start Ngrok

Open another terminal:

```bash
npx ngrok http 3000
```

Copy the `https://...ngrok.io` URL and paste it into your `.env` as `NGROK_DOMAIN`.

---

## How to use Swaasthya-Saathi (Deployed Version)
You can interact with the deployed bot via Twilio or our frontend:

#### 1. Join our WhatsApp sandbox:
   - Text **`join fat-welcome.`** to **`+14155238886`** on WhatsApp
#### 2. Send a **prescription image** to begin
#### 3. Select your preferred **language** via reply
#### 4. Ask follow-up **voice note questions**
#### 5. Visit our frontend portal here: [🌐 https://swaasthya-saathi-three.vercel.app/](https://swaasthya-saathi-three.vercel.app/)
---

## 📸 How It Works

1. **User sends a prescription image** 📷 via WhatsApp.
2. The bot:
   - Downloads the image
   - Uses OCR model to extract plain-English instructions
   - Saves the summary and sends a language selection audio
3. **User selects a language** by replying with a number.
4. The bot:
   - Translates the summary
   - Converts it to speech using Sarvam AI
   - Sends back the audio
5. **User sends voice note questions** 🎤
6. The bot:
   - Transcribes using Sarvam
   - Combines with original prescription
   - Sends the query to II-Medical-8B-1706
   - Speaks the answer back to the user
