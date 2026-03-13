const { Groq } = require('groq-sdk');
const { GROQ_API_KEY } = require('../config/env');
const axios = require('axios');
const { translateText, replaceNumbersWithWords, replaceEnglishNumberWords, replaceMedicalUnits, convertAsciiDigitsToNative } = require('../services/translate');
const groq = new Groq({ apiKey: GROQ_API_KEY });

async function getImagePrescriptionSummary(imageUrl) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'From this medical image, extract only the relevant prescription and rewrite it in plain English as simple, spoken patient instructions. Do NOT include headings, metadata, or explanations. No markdown. Only the final clean instructions.' },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    temperature: 0.3,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false
  });

  const summary = chatCompletion.choices[0].message.content
    .replace(/[\*\_\~\`]/g, '')
    .split('\n\n')
    .pop()
    .trim();

  let finalSummary = summary;
  try {
    console.log(summary);
    const medicalResponse = await axios.post(
      'https://medical-api-endpoints.onrender.com/summarize-prescription',
      {
        text: summary
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const structuredData = medicalResponse.data;

    // Send structured medical data to Groq to get a clean text summary
    const refinement = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'You are a medical assistant. Based on the following structured prescription data (JSON), produce a concise patient-facing summary with actionable instructions. Do NOT include headings, bullets, disclaimers, or formatting. No markdown. Only plain sentences. If dosages or timings are present, include them clearly.'
            },
            {
              type: 'text',
              text: `JSON:\n${JSON.stringify(structuredData)}`
            }
          ]
        }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.3,
      top_p: 1,
      stream: false,
      max_completion_tokens: 5000
    });

    finalSummary = refinement.choices[0].message.content
      .replace(/[\*\_\~\`]/g, '')
      .trim();
  } catch (error) {
    console.error(error.response?.data || error.message || error);
  }
  console.log(finalSummary);
  return finalSummary;
}

async function analyzeMedicineImage(prescriptionSummary, imageUrl, targetLanguage = 'en') {
  const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
  const prompt = `You are a pharmacist assistant.
Task:
- Look at the provided photo. First decide: is this clearly a photo of a medicine/package/blister/label? Answer strictly yes/no as is_medicine.
- If is_medicine is yes, read any visible brand/generic name and strength.
- Compare with the prescription summary provided. Determine if this medicine appears to match one item from the prescription (by name or reasonable generic equivalence). Answer strictly yes/no as matches_prescription.

CRITICAL RULES - FOLLOW EXACTLY:
- If medicine MATCHES prescription: Provide dosage instructions from prescription summary only
- If medicine does NOT match prescription: ONLY provide warning message "This medicine is not in your prescription. Please do not take this medicine." in target language: ${targetLanguage}. DO NOT provide any dosage instructions, timing, or usage information. DO NOT explain how to take the medicine.
- If not a medicine: Extract visible text from image

IMPORTANT: For non-prescription medicines, the instructions field should ONLY contain the warning message, nothing else.

Return a strict JSON object with keys: is_medicine (boolean), matches_prescription (boolean), medicine_name (string), instructions (string), warning (string).`;

  const chat = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'text', text: `Prescription summary:\n${sanitizePlainText(prescriptionSummary || '')}` },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    model: MODEL,
    temperature: 0.2,
    top_p: 1,
    max_completion_tokens: 800,
    stream: false
  });

  let raw = chat.choices[0].message.content || '';
  raw = sanitizePlainText(raw);
  console.log('AI Raw Response:', raw);
  // Try to extract JSON substring if the model added text
  const jsonMatch = raw.match(/\{[\s\S]*\}$/);
  const jsonText = jsonMatch ? jsonMatch[0] : raw;
  let parsed = {
    is_medicine: false,
    matches_prescription: false,
    medicine_name: '',
    instructions: '',
    warning: 'Unable to read the image. Please send a clear photo of the medicine front label.'
  };
  try {
    const obj = JSON.parse(jsonText);
    parsed.is_medicine = Boolean(obj.is_medicine);
    parsed.matches_prescription = Boolean(obj.matches_prescription);
    parsed.medicine_name = String(obj.medicine_name || '');
    parsed.instructions = sanitizePlainText(String(obj.instructions || ''));
    parsed.warning = sanitizePlainText(String(obj.warning || parsed.warning));
    console.log('AI Parsed Result:', parsed);
  } catch (e) {
    console.error('Failed to parse AI response:', e.message);
    console.error('Raw JSON text:', jsonText);
  }
  // if(parsed.matches_prescription==false){
  //   // Set warning message telling user not to take this medicine
  //   parsed.warning = "Do not take this medicine.";
  //   parsed.instructions = ""; // Clear any existing instructions
    
  //   // Translate warning to user's language
  //   if (parsed.warning && parsed.warning.trim()) {
  //     try {
  //       let translated = await translateText(parsed.warning, targetLanguage, 'auto');
  //       translated = replaceNumbersWithWords(translated, targetLanguage);
  //       translated = convertAsciiDigitsToNative(translated, targetLanguage);
  //       parsed.warning = sanitizePlainText(translated);
  //     } catch (e) {
  //       console.error('Translation error:', e.message);
  //     }
  //   }
  //   return parsed; // Return immediately without further processing
  // }
  // Fallback: if the first pass could not confidently read the image, try an OCR-style extraction and re-evaluate using text only
  if (!parsed.is_medicine || (!parsed.matches_prescription && !parsed.instructions)) {
    try {
      const ocrPrompt = 'Extract all legible text from this image as a single plain line without newlines. No extra words.';
      const ocr = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: ocrPrompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        model: MODEL,
        temperature: 0.1,
        top_p: 1,
        max_completion_tokens: 512,
        stream: false
      });

      const extracted = sanitizePlainText(ocr.choices[0].message.content || '');
      console.log('Extracted text from medicine image: ', extracted);
      console.log('Prescription summary: ', sanitizePlainText(prescriptionSummary || ''));
      if (extracted && extracted.length >= 3) {
        const textOnlyPrompt = `You are a pharmacist assistant.
Inputs:
- Prescription summary: ${sanitizePlainText(prescriptionSummary || '')}
- Text seen on package: ${extracted}

Decide: is the package text likely a medicine label? If yes, infer the probable medicine/brand name.
Compare name/strength with prescription summary and judge match.
If matched, produce plain spoken instructions from the prescription summary for that item.
If it's a medicine but doesn't match the prescription, provide ONLY practical dosage and timing instructions (e.g., "Take one tablet twice daily with food", "Take as needed for pain, maximum 3 times per day", "Take with a full glass of water"). Focus on HOW and WHEN to take, not safety warnings.
If not a medicine, use the extracted text as instructions.
Return strict JSON with keys: is_medicine (boolean), matches_prescription (boolean), medicine_name (string), instructions (string), warning (string). No extra text.`;

        const retry = await groq.chat.completions.create({
          messages: [
            { role: 'user', content: textOnlyPrompt }
          ],
          model: 'openai/gpt-oss-120b',
          temperature: 0.2,
          top_p: 1,
          max_tokens: 800
        });

        let second = sanitizePlainText(retry.choices[0].message.content || '');
        const jm = second.match(/\{[\s\S]*\}$/);
        const jt = jm ? jm[0] : second;
        try {
          const obj2 = JSON.parse(jt);
          parsed.is_medicine = Boolean(obj2.is_medicine);
          parsed.matches_prescription = Boolean(obj2.matches_prescription);
          parsed.medicine_name = String(obj2.medicine_name || parsed.medicine_name);
          parsed.instructions = sanitizePlainText(String(obj2.instructions || parsed.instructions));
          parsed.warning = sanitizePlainText(String(obj2.warning || parsed.warning));
          
          // If medicine doesn't match prescription, set warning message
          if(parsed.matches_prescription == false && parsed.is_medicine) {
            parsed.warning = "Do not take this medicine.";
            parsed.instructions = ""; // Clear any existing instructions
            
            // Translate warning to user's language
            if (parsed.warning && parsed.warning.trim()) {
              try {
                let translated = await translateText(parsed.warning, targetLanguage, 'auto');
                translated = replaceEnglishNumberWords(translated, targetLanguage);
                translated = replaceNumbersWithWords(translated, targetLanguage);
                translated = replaceMedicalUnits(translated, targetLanguage);
                translated = convertAsciiDigitsToNative(translated, targetLanguage);
                parsed.warning = sanitizePlainText(translated);
              } catch (e) {
                console.error('Translation error:', e.message);
              }
            }
            
            return parsed; // Return immediately without further processing
          }
        } catch (_) {}
      }
  } catch (e) {
    // keep parsed as-is
  }
}

// Translate and localize the response to target language (only for instructions, warnings are handled above)
if (parsed.instructions && parsed.instructions.trim()) {
  try {
    let translated = await translateText(parsed.instructions, targetLanguage, 'auto');
    translated = replaceEnglishNumberWords(translated, targetLanguage);
    translated = replaceNumbersWithWords(translated, targetLanguage);
    translated = replaceMedicalUnits(translated, targetLanguage);
    translated = convertAsciiDigitsToNative(translated, targetLanguage);
    parsed.instructions = sanitizePlainText(translated);
  } catch (e) {
    console.error('Translation error:', e.message);
  }
}

return parsed;
}

function sanitizePlainText(input) {
  if (!input) return '';
  // Remove common markdown/special formatting characters and table pipes
  let text = String(input).replace(/[\*\_\~\`\|]/g, '');
  // Remove bullet markers at line starts (e.g., '-', '*', '•') while keeping sentence content
  text = text.replace(/^[\-\*•]+\s+/gm, '');
  // Collapse multiple spaces and trim extraneous whitespace
  text = text.replace(/[\t ]+/g, ' ').replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').trim();
  return text;
}

async function answerQuestionWithContext(summary, question, targetLanguage = 'en') {
  // Choose an open-source model on Groq. If llama-3.1-70b-instruct isn’t enabled on your account,
  // swap to 'mixtral-8x7b-32768' as a fallback.
  const MODEL = 'openai/gpt-oss-120b';

  const languageNames = {
    hi: 'Hindi',
    en: 'English',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    ml: 'Malayalam',
    mr: 'Marathi',
    gu: 'Gujarati',
    pa: 'Punjabi',
    or: 'Odia'
  };
  const targetLangName = languageNames[targetLanguage] || targetLanguage;
  
  const languageDirective = `Answer ONLY in ${targetLanguage} (${targetLangName}). CRITICAL: Use ONLY ${targetLangName} words - do NOT mix any English words. Convert ALL numbers to ${targetLangName} words (e.g., "one" should be "एक" in Hindi, "two" should be "दो", etc.). Use natural, patient-friendly ${targetLanguage} with the appropriate script. No markdown or special characters like *, |, _, ~, or \`. Only plain sentences.`;

  const messages = [
    {
      role: 'system',
      content: `
You are a board-certified medical doctor answering patient questions.

Style & Safety:
- Give a clear, direct answer in the first 1–2 sentences.
- Keep the overall reply brief (around 4–6 sentences, roughly 60–120 words).
- Focus only on what is most relevant to the specific question, not the entire prescription.
- Be evidence-based and avoid definitive diagnosis without exam/testing; explain reasonable possibilities.
- Briefly mention when to seek urgent care only if clearly needed.
- Do not use alarmist language; be calm, supportive, and specific.
- Keep dosing generic (e.g., “follow label” or “your clinician’s instructions”) unless the question supplies exact weight/age/dose ranges.`
    },
    {
      role: 'user',
      content: `
Prescription summary (from the chart):
"${summary}"

Patient question:
"${question}"

Task:
- Answer the question in a short, patient-friendly way.
- Include only the key explanation and 1–3 practical steps the patient can follow.
- If there are important red-flag symptoms, mention them in 1–2 short sentences.
- Keep it kind, clear, and non-judgmental.
- Keep the answer concise (do not exceed about 120 words).
- ${languageDirective}`
    }
  ];

  const chatResponse = await groq.chat.completions.create({
    messages,
    model: MODEL,
    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 1024
  });

  const text = sanitizePlainText(chatResponse.choices[0].message.content);

  // Enforce target language and localize numerals/words
  let finalized = text;
  try {
    finalized = await translateText(finalized, targetLanguage, 'auto');
  } catch (_) {}
  finalized = replaceEnglishNumberWords(finalized, targetLanguage);
  finalized = replaceNumbersWithWords(finalized, targetLanguage);
  finalized = replaceMedicalUnits(finalized, targetLanguage);
  finalized = convertAsciiDigitsToNative(finalized, targetLanguage);
  return sanitizePlainText(finalized);
}

async function analyzeBpImage(imageUrl, targetLanguage = 'en') {
  const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
  const prompt = `You are a clinical assistant.
Task: From this photo of a blood pressure monitor/readout, extract:
- systolic (integer)
- diastolic (integer)
- pulse/heart rate if visible (integer or empty)

Then classify BP category using ACC/AHA:
- Normal: systolic < 120 AND diastolic < 80
- Elevated: systolic 120–129 AND diastolic < 80
- Hypertension Stage 1: systolic 130–139 OR diastolic 80–89
- Hypertension Stage 2: systolic ≥ 140 OR diastolic ≥ 90
- Hypertensive crisis: systolic ≥ 180 AND/OR diastolic ≥ 120

Return a patient-friendly explanation (2–5 short sentences) that says the numbers and category and gives 2–3 simple next steps (e.g., relax and recheck, lifestyle notes, when to seek care). Keep it calm and practical. No markdown, no bullets.
`; 

  const chat = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    model: MODEL,
    temperature: 0.3,
    top_p: 1,
    max_completion_tokens: 600,
    stream: false
  });

  let explanation = (chat.choices[0].message.content || '').replace(/[\*\_\~\`\|]/g, '').trim();

  try {
    let translated = await translateText(explanation, targetLanguage, 'auto');
    translated = replaceEnglishNumberWords(translated, targetLanguage);
    translated = replaceNumbersWithWords(translated, targetLanguage);
    translated = replaceMedicalUnits(translated, targetLanguage);
    translated = convertAsciiDigitsToNative(translated, targetLanguage);
    explanation = translated;
  } catch (_) {}

  return explanation;
}

module.exports = { getImagePrescriptionSummary, answerQuestionWithContext, analyzeMedicineImage, analyzeBpImage };


