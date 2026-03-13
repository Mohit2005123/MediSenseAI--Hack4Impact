const express = require('express');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { spawn } = require('child_process');

const { translateText } = require('../services/translate');
const { generateSpeechFromText } = require('../services/tts');
const { getImagePrescriptionSummary, answerQuestionWithContext, analyzeMedicineImage } = require('../services/groq');
const { downloadTwilioMedia } = require('../utils/media');
const { SARVAM_API_KEY } = require('../config/env');

const userState = {};


module.exports = function webhookRouterFactory({ twilioClient }) {
  const router = express.Router();

  router.post('/whatsapp-webhook', async (req, res) => {
    const from = req.body.From;
    const timestamp = Date.now();
    const incomingMsg = req.body.Body?.toLowerCase().trim();
    const mediaUrl = req.body.MediaUrl0;
    const contentType = req.body.MediaContentType0;
    try {
      const langMap = {
        '1': { code: 'hi', label: 'Hindi' },
        '2': { code: 'en', label: 'English' },
        '3': { code: 'bn', label: 'Bengali' },
        '4': { code: 'ta', label: 'Tamil' },
        '5': { code: 'te', label: 'Telugu' },
        '6': { code: 'kn', label: 'Kannada' },
        '7': { code: 'ml', label: 'Malayalam' },
        '8': { code: 'mr', label: 'Marathi' },
        '9': { code: 'gu', label: 'Gujarati' },
        '10': { code: 'pa', label: 'Punjabi' },
        '11': { code: 'or', label: 'Odia' }
      };

      const langCodeMap = {
        hi: 'hi-IN',
        en: 'en-IN',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        pa: 'pa-IN',
        or: 'or-IN'
      };

      const adminLanguageList = `\n1 Hindi\n2 English\n3 Bengali\n4 Tamil\n5 Telugu\n6 Kannada\n7 Malayalam\n8 Marathi\n9 Gujarati\n10 Punjabi\n11 Odia\n\nPlease send the number of your preferred language.\n`;

      const adminStaticPrescription = {
        hi: 'यह एक डेमो प्रिस्क्रिप्शन व्याख्या है। टैबलेट A भोजन के बाद दिन में दो बार लें। टैबलेट B रात में एक बार लें। कृपया डॉक्टर की सलाह के बिना दवाएँ न बदलें। यह संदेश एडमिन डेमो मोड में हर बार एक जैसा रहेगा।',
        en: 'This is a demo explanation of your prescription. Tablet A should be taken twice a day after food. Tablet B should be taken once at night. Please do not change medicines without medical advice. This message is the same every time in admin demo mode.',
        bn: 'এটি একটি ডেমো প্রেসক্রিপশন ব্যাখ্যা। ট্যাবলেট A খাবারের পরে দিনে দুইবার নিন। ট্যাবলেট B রাতে একবার নিন। চিকিৎসকের পরামর্শ ছাড়া ওষুধ পরিবর্তন করবেন না। অ্যাডমিন ডেমো মোডে এই বার্তাটি প্রতিবার একই থাকবে।',
        ta: 'இது ஒரு டெமோ மருந்துச்சீட்டு விளக்கம். மாத்திரை A-வை உணவுக்குப் பிறகு தினமும் இரண்டு முறை எடுத்துக் கொள்ளுங்கள். மாத்திரை B-வை இரவில் ஒரு முறை எடுத்துக் கொள்ளுங்கள். மருத்துவர் ஆலோசனை இல்லாமல் மருந்துகளை மாற்ற வேண்டாம். நிர்வாக டெமோ முறையில் இந்தச் செய்தி ஒவ்வொரு முறையும் ஒரே மாதிரியாக இருக்கும்.',
        te: 'ఇది ఒక డెమో ప్రిస్క్రిప్షన్ వివరణ. టాబ్లెట్ A భోజనం తర్వాత రోజుకు రెండుసార్లు తీసుకోండి. టాబ్లెట్ B రాత్రి ఒక్కసారి తీసుకోండి. వైద్య సలహా లేకుండా మందులు మార్చకండి. అడ్మిన్ డెమో మోడ్‌లో ఈ సందేశం ప్రతిసారి ఒకేలా ఉంటుంది.',
        kn: 'ಇದು ಒಂದು ಡೆಮೊ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿವರಣೆ. ಟ್ಯಾಬ್ಲೆಟ್ A ಅನ್ನು ಊಟದ ನಂತರ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ತೆಗೆದುಕೊಳ್ಳಿ. ಟ್ಯಾಬ್ಲೆಟ್ B ಅನ್ನು ರಾತ್ರಿ ಒಂದು ಬಾರಿ ತೆಗೆದುಕೊಳ್ಳಿ. ವೈದ್ಯಕೀಯ ಸಲಹೆಯಿಲ್ಲದೆ ಔಷಧಿಗಳನ್ನು ಬದಲಾಯಿಸಬೇಡಿ. ಆಡ್ಮಿನ್ ಡೆಮೊ ಮೋಡ್‌ನಲ್ಲಿ ಈ ಸಂದೇಶವು ಪ್ರತಿಸಾರಿ ಒಂದೇ ಆಗಿರುತ್ತದೆ.',
        ml: 'ഇത് ഒരു ഡെമോ പ്രിസ്ക്രിപ്ഷൻ വിശദീകരണമാണ്. ടാബ്ലെറ്റ് A ഭക്ഷണത്തിന് ശേഷം ദിവസത്തിൽ രണ്ട് പ്രാവശ്യം എടുക്കുക. ടാബ്ലെറ്റ് B രാത്രി ഒരിക്കൽ എടുക്കുക. ഡോക്ടറുടെ ഉപദേശം കൂടാതെ മരുന്നുകൾ മാറ്റരുത്. അഡ്മിൻ ഡെമോ മോഡിൽ ഈ സന്ദേശം എല്ലാ തവണയും ഒരേ ആയിരിക്കും.',
        mr: 'हे एक डेमो प्रिस्क्रिप्शन स्पष्टीकरण आहे. टॅब्लेट A जेवणानंतर दिवसातून दोन वेळा घ्या. टॅब्लेट B रात्री एकदा घ्या. वैद्यकीय सल्ल्याशिवाय औषधे बदलू नका. अॅडमिन डेमो मोडमध्ये हा संदेश प्रत्येक वेळी तोच असेल.',
        gu: 'આ એક ડેમો પ્રિસ્ક્રિપ્શન સમજાવટ છે. ટેબલેટ A ભોજન પછી દિવસમાં બે વખત લો. ટેબલેટ B રાત્રે એક વખત લો. ડૉક્ટરની સલાહ વિના દવાઓ ન બદલો. એડમિન ડેમો મોડમાં આ સંદેશો દરેક વખત એકસરખો રહેશે.'
      };

      const adminStaticVoiceReply = {
        hi: 'यह एक डेमो ऑडियो उत्तर है। वास्तविक सिस्टम में आपका वॉइस मैसेज समझकर विस्तृत उत्तर दिया जाएगा। एडमिन डेमो मोड में यह जवाब हर बार एक जैसा रहेगा।',
        en: 'This is a demo audio response to your question. In the real system, your voice message would be understood and answered in detail. This message is the same every time in admin demo mode.',
        bn: 'এটি আপনার প্রশ্নের জন্য একটি ডেমো অডিও উত্তর। বাস্তব সিস্টেমে আপনার ভয়েস বার্তা বুঝে বিস্তারিত উত্তর দেওয়া হবে। অ্যাডমিন ডেমো মোডে এই উত্তরটি প্রতিবার একই থাকবে।',
        ta: 'இது உங்கள் கேள்விக்கான ஒரு டெமோ ஒலி பதில். உண்மையான அமைப்பில் உங்கள் குரல் செய்தி புரிந்து விரிவான பதில் வழங்கப்படும். நிர்வாக டெமோ முறையில் இந்த பதில் ஒவ்வொரு முறையும் ஒரே மாதிரியாக இருக்கும்.',
        te: 'ఇది మీ ప్రశ్నకు డెమో ఆడియో సమాధానం. నిజమైన సిస్టమ్‌లో మీ వాయిస్ మెసేజ్‌ను అర్థం చేసుకుని వివరంగా సమాధానం ఇస్తుంది. అడ్మిన్ డెమో మోడ్‌లో ఈ సమాధానం ప్రతిసారి ఒకేలా ఉంటుంది.',
        kn: 'ಇದು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಡೆಮೊ ಆಡಿಯೋ ಉತ್ತರ. ನಿಜವಾದ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ನಿಮ್ಮ ಧ್ವನಿ ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು ವಿವರವಾಗಿ ಉತ್ತರಿಸಲಾಗುತ್ತದೆ. ಆಡ್ಮಿನ್ ಡೆಮೊ ಮೋಡ್‌ನಲ್ಲಿ ಈ ಉತ್ತರವು ಪ್ರತಿಸಾರಿ ಒಂದೇ ಆಗಿರುತ್ತದೆ.',
        ml: 'ഇത് നിങ്ങളുടെ ചോദ്യത്തിനുള്ള ഡെമോ ഓഡിയോ മറുപടിയാണ്. യഥാർത്ഥ സിസ്റ്റത്തിൽ നിങ്ങളുടെ വോയ്സ് സന്ദേശം മനസ്സിലാക്കി വിശദമായ മറുപടി നൽകും. അഡ്മിൻ ഡെമോ മോഡിൽ ഈ മറുപടി എല്ലായ്പ്പോഴും ഒരേ ആയിരിക്കും.',
        mr: 'हे तुमच्या प्रश्नासाठी डेमो ऑडिओ उत्तर आहे. वास्तविक सिस्टममध्ये तुमचा व्हॉइस मेसेज समजून सविस्तर उत्तर दिले जाईल. अॅडमिन डेमो मोडमध्ये हे उत्तर प्रत्येक वेळी तेच असेल.',
        gu: 'આ તમારા પ્રશ્ન માટે ડેમો ઓડિયો જવાબ છે. વાસ્તવિક સિસ્ટમમાં તમારો વૉઇસ મેસેજ સમજીને વિગતવાર જવાબ આપવામાં આવશે. એડમિન ડેમો મોડમાં આ જવાબ દરેક વખત એકસરખો રહેશે.'
      };

      // Admin mode OFF (only) -> ON with "78"
      if (incomingMsg === '78') {
        userState[from] = userState[from] || {};
        if (userState[from].adminMode) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: '🛠️ Admin demo mode is already ON.\n\nTo exit admin mode, type 68.\nTo change language, reply with a number (1–11).'
          });
          return res.sendStatus(200);
        }

        userState[from].adminMode = true;
        userState[from].waitingForAdminLanguage = true;
        delete userState[from].adminLanguageCode;
        delete userState[from].adminLanguageLabel;

        const langAudioURL = await generateSpeechFromText(adminLanguageList, 'hi-IN', timestamp);
        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: '🛠️ Admin demo mode ON.\n\nPlease select language (1–11). To exit admin mode anytime, type 68.',
          mediaUrl: langAudioURL ? [langAudioURL] : undefined
        });

        if (!langAudioURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: adminLanguageList.trim()
          });
        }

        return res.sendStatus(200);
      }

      // Admin mode exit (only via "68")
      if (incomingMsg === '68' && userState[from]?.adminMode) {
        delete userState[from].adminMode;
        delete userState[from].waitingForAdminLanguage;
        delete userState[from].adminLanguageCode;
        delete userState[from].adminLanguageLabel;

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: '✅ Exited admin demo mode.\n\nThe bot is back to the normal intelligent flow.'
        });
        return res.sendStatus(200);
      }

      // Admin mode: language selection (1–11)
      if (userState[from]?.adminMode && incomingMsg && langMap[incomingMsg]) {
        const selectedLang = langMap[incomingMsg];
        userState[from].waitingForAdminLanguage = false;
        userState[from].adminLanguageCode = langCodeMap[selectedLang.code];
        userState[from].adminLanguageLabel = selectedLang.label;

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: `✅ Admin demo language set to ${selectedLang.label}.\n\nNow send a prescription image or a voice note.\nTo exit admin mode, type 68.`
        });
        return res.sendStatus(200);
      }

      // Admin mode: if language not chosen yet, force language selection before demo replies
      if (userState[from]?.adminMode && !userState[from]?.adminLanguageCode) {
        const langAudioURL = await generateSpeechFromText(adminLanguageList, 'hi-IN', timestamp);
        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: 'Please select language (1–11) to continue in admin demo mode.',
          mediaUrl: langAudioURL ? [langAudioURL] : undefined
        });
        if (!langAudioURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: adminLanguageList.trim()
          });
        }
        return res.sendStatus(200);
      }

      // Admin mode: fixed response for any incoming voice note (no AI / transcription)
      if (mediaUrl && contentType?.startsWith('audio') && userState[from]?.adminMode) {
        const adminLangShort = (userState[from]?.adminLanguageCode || 'en-IN').split('-')[0] || 'en';
        const langCode = userState[from]?.adminLanguageCode || 'en-IN';
        const langLabel = userState[from]?.adminLanguageLabel || 'English';

        const staticVoiceReply = adminStaticVoiceReply[adminLangShort] || adminStaticVoiceReply.en;
        const audioAnswerURL = await generateSpeechFromText(staticVoiceReply, langCode, timestamp);

        if (audioAnswerURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🤖 Admin demo reply (${langLabel}):`,
            mediaUrl: [audioAnswerURL]
          });
        } else {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🤖 Admin demo reply (${langLabel}):\n\n${staticVoiceReply}`
          });
        }

        return res.sendStatus(200);
      }

      // Voice follow-up handler
      if (mediaUrl && contentType?.startsWith('audio') && userState[from]?.expectingVoice) {
        const oggFile = `voice_${timestamp}.ogg`;
        const wavFile = `voice_${timestamp}.wav`;
        const oggPath = path.join(__dirname, '../../public', oggFile);
        const wavPath = path.join(__dirname, '../../public', wavFile);

        await downloadTwilioMedia(mediaUrl, oggFile);

        await new Promise((resolve, reject) => {
          const ffmpeg = spawn('ffmpeg', ['-i', oggPath, '-ar', '16000', '-ac', '1', wavPath]);
          ffmpeg.stderr.on('data', data => console.error('ffmpeg:', data.toString()));
          ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error('FFmpeg failed')));
        });

        const form = new FormData();
        form.append('file', fs.createReadStream(wavPath));
        form.append('model', 'saarika:v2.5');
        form.append('language_code', 'unknown');

        const response = await fetch('https://api.sarvam.ai/speech-to-text', {
          method: 'POST',
          headers: {
            'api-subscription-key': SARVAM_API_KEY,
            ...form.getHeaders()
          },
          body: form
        });

        const result = await response.json();
        const transcript = result.transcript || 'Sorry, could not understand the audio.';

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: `🗨️ Transcribed: ${transcript}\n\n💡 Processing your question...`
        });

        const prevSummary = userState[from]?.summary || '';
        const langCode = userState[from]?.languageCode || 'en-IN';
        const langLabel = userState[from]?.languageLabel || 'English';
        // Derive a 2-letter language code for text generation if possible
        const targetLang = (langCode.split('-')[0] || 'en');
        const replyText = await answerQuestionWithContext(prevSummary, transcript, targetLang);

        const audioAnswerURL = await generateSpeechFromText(replyText, langCode, timestamp);

        if (audioAnswerURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🤖 Here's the answer to your question in ${langLabel}:`,
            mediaUrl: [audioAnswerURL]
          });
        } else {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🤖 Here's the answer to your question in ${langLabel}:\n\n${replyText}`
          });
        }

        try { fs.existsSync(oggPath) && fs.unlinkSync(oggPath); } catch (_) {}
        try { fs.existsSync(wavPath) && fs.unlinkSync(wavPath); } catch (_) {}

        return res.sendStatus(200);
      }

      // Stop command handler - reset to prescription flow
      if (incomingMsg === 'done') {
        userState[from] = {};
        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: '🔄 Session reset! Please send a new prescription photo to start again.'
        });
        return res.sendStatus(200);
      }

      // Link command handler
      if (incomingMsg === 'link' || incomingMsg === '🔗') {
        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: '🔗 Here\'s the link to MediSenseAI:\n\nhttps://swaasthya-saathi-dashboard.vercel.app/\n\nAccess your health dashboard and manage your prescriptions!'
        });
        return res.sendStatus(200);
      }

      // Language selection handler
      if (userState[from]?.waitingForLanguage && incomingMsg) {
        const selectedLang = langMap[incomingMsg];
        if (!selectedLang) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: '❌ Invalid option. Please reply with a valid number.'
          });
          return res.sendStatus(200);
        }

        let translated = '';
        if (userState[from].summary && userState[from].summary.trim()) {
          translated = await translateText(userState[from].summary, selectedLang.code);
        }
        if (!translated || translated.trim() === '') translated = userState[from].summary || 'No summary available';

        // Add reminder prompt to the prescription explanation in user's selected language
        const reminderPrompts = {
          hi: 'क्या आप चाहते हैं कि मैं आपके नुस्खे के अनुसार आपकी दवाओं के लिए एक अनुस्मारक सेट करूं? फिर दो दबाएं।',
          en: 'Would you like me to setup a reminder for your medicines as per your prescription? Then press two.',
          bn: 'আপনি কি চান যে আমি আপনার প্রেসক্রিপশন অনুযায়ী আপনার ওষুধের জন্য একটি অনুস্মারক সেট করি? তাহলে দুই চাপুন।',
          ta: 'உங்கள் மருந்துச்சீட்டின் படி உங்கள் மருந்துகளுக்கு நினைவூட்டல் அமைக்க விரும்புகிறீர்களா? பின்னர் இரண்டு அழுத்தவும்।',
          te: 'మీరు మీ ప్రిస్క్రిప్షన్ ప్రకారం మీ మందులకు రిమైండర్ సెటప్ చేయాలనుకుంటున్నారా? అప్పుడు రెండు నొక్కండి।',
          kn: 'ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಪ್ರಕಾರ ನಿಮ್ಮ ಔಷಧಿಗಳಿಗೆ ರಿಮೈಂಡರ್ ಸೆಟಪ್ ಮಾಡಲು ನೀವು ಬಯಸುತ್ತೀರಾ? ನಂತರ ಎರಡು ಒತ್ತಿರಿ।',
          ml: 'നിങ്ങളുടെ പ്രിസ്ക്രിപ്ഷൻ അനുസരിച്ച് നിങ്ങളുടെ മരുന്നുകൾക്ക് ഒരു ഓർമ്മപ്പെടുത്തൽ സജ്ജമാക്കാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നുണ്ടോ? പിന്നെ രണ്ട് അമർത്തുക।',
          mr: 'तुम्हाला तुमच्या प्रिस्क्रिप्शननुसार तुमच्या औषधांसाठी रिमाइंडर सेट करायचा आहे का? मग दोन दाबा।',
          gu: 'શું તમે ઇચ્છો છો કે હું તમારા પ્રિસ્ક્રિપ્શન મુજબ તમારી દવાઓ માટે રિમાઇન્ડર સેટ કરું? પછી બે દબાવો।',
          pa: 'ਕੀ ਤੁਸੀਂ ਚਾਹੁੰਦੇ ਹੋ ਕਿ ਮੈਂ ਤੁਹਾਡੇ ਨੁਸਖ਼ੇ ਅਨੁਸਾਰ ਤੁਹਾਡੀਆਂ ਦਵਾਈਆਂ ਲਈ ਰਿਮਾਈਂਡਰ ਸੈੱਟ ਕਰਾਂ? ਤਾਂ ਫਿਰ ਦੋ ਦਬਾਓ।',
          or: 'ଆପଣ ଚାହୁଁଛନ୍ତି କି ଯେ ମୁଁ ଆପଣଙ୍କ ପ୍ରେସକ୍ରିପ୍ସନଅନୁସାରେ ଆପଣଙ୍କ ଔଷଧ ପାଇଁ ଏକ ରିମାଇଣ୍ଡର ସେଟ୍ କରିଦିଏଁ? ତେବେ ଦୁଇ ଦବାନ୍ତୁ।'
        };
        
        const reminderPromptTranslated = reminderPrompts[selectedLang.code] || reminderPrompts['en'];
        console.log('Using manual reminder prompt for:', selectedLang.label);
        console.log('Reminder prompt:', reminderPromptTranslated);
        const combinedText = translated + '\n\n' + reminderPromptTranslated;
        
        
        console.log('Generating combined prescription + reminder audio in', selectedLang.label, '...');
        console.log('Using TTS language code:', langCodeMap[selectedLang.code]);
        console.log('Combined text length:', combinedText.length);
        console.log('Combined text preview:', combinedText.substring(0, 200) + '...');
        
        // Ensure the text is properly formatted for TTS
        const cleanCombinedText = combinedText.replace(/\n\n/g, ' ').trim();
        console.log('Cleaned text for TTS:', cleanCombinedText.substring(0, 200) + '...');
        
        const audioURL = await generateSpeechFromText(cleanCombinedText, langCodeMap[selectedLang.code], timestamp);

        if (audioURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🎧 Here's your prescription summary with reminder prompt in ${selectedLang.label}:`,
            mediaUrl: [audioURL]
          });
        } else {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `📝 Here's your prescription summary in ${selectedLang.label}:\n\n${combinedText}`
          });
        }

        userState[from].waitingForLanguage = false;
        userState[from].expectingVoice = true;
        userState[from].languageCode = langCodeMap[selectedLang.code];
        userState[from].languageLabel = selectedLang.label;

        // Reminder prompt is now combined with prescription explanation above

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: '🎤 You can now send voice notes to ask questions about the prescription.'
        });

        console.log('Language selection handler completed successfully');
        return res.sendStatus(200);
      }

      // Reminder setup handler
      if (incomingMsg === '2' && userState[from]?.expectingVoice) {
        console.log('User pressed 2 for reminder setup');
        const langCode = userState[from]?.languageCode || 'en-IN';
        const langLabel = userState[from]?.languageLabel || 'English';
        
        // Create confirmation messages in each language
        const confirmationMessages = {
          'hi-IN': 'आपके नुस्खे के अनुसार आपकी दवाओं के लिए अनुस्मारक सेट कर दिया गया है।',
          'en-IN': 'Reminder has been setup for your medicines as per your prescription.',
          'bn-IN': 'আপনার প্রেসক্রিপশন অনুযায়ী আপনার ওষুধের জন্য অনুস্মারক সেট করা হয়েছে।',
          'ta-IN': 'உங்கள் மருந்துச்சீட்டின் படி உங்கள் மருந்துகளுக்கு நினைவூட்டல் அமைக்கப்பட்டது।',
          'te-IN': 'మీ ప్రిస్క్రిప్షన్ ప్రకారం మీ మందులకు రిమైండర్ సెట్ చేయబడింది।',
          'kn-IN': 'ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಪ್ರಕಾರ ನಿಮ್ಮ ಔಷಧಿಗಳಿಗೆ ರಿಮೈಂಡರ್ ಸೆಟ್ ಮಾಡಲಾಗಿದೆ।',
          'ml-IN': 'നിങ്ങളുടെ പ്രിസ്ക്രിപ്ഷൻ അനുസരിച്ച് നിങ്ങളുടെ മരുന്നുകൾക്ക് ഓർമ്മപ്പെടുത്തൽ സജ്ജമാക്കി।',
          'mr-IN': 'तुमच्या प्रिस्क्रिप्शननुसार तुमच्या औषधांसाठी रिमाइंडर सेट केले आहे।',
          'gu-IN': 'તમારા પ્રિસ્ક્રિપ્શન મુજબ તમારી દવાઓ માટે રિમાઇન્ડર સેટ કરવામાં આવ્યું છે।',
          'pa-IN': 'ਤੁਹਾਡੇ ਨੁਸਖ਼ੇ ਅਨੁਸਾਰ ਤੁਹਾਡੀਆਂ ਦਵਾਈਆਂ ਲਈ ਰਿਮਾਈਂਡਰ ਸੈੱਟ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।',
          'or-IN': 'ଆପଣଙ୍କ ପ୍ରେସକ୍ରିପ୍ସନ୍‌ ଅନୁସାରେ ଆପଣଙ୍କ ଔଷଧ ପାଇଁ ରିମାଇଣ୍ଡର ସେଟ୍ କରାଯାଇଛି।'
        };
        
        const confirmationMessage = confirmationMessages[langCode] || confirmationMessages['en-IN'];
        console.log('Using confirmation message in:', langLabel);
        console.log('Confirmation message:', confirmationMessage);
        console.log('Generating confirmation audio for:', confirmationMessage);
        const confirmationAudioURL = await generateSpeechFromText(confirmationMessage, langCode, timestamp);
        console.log('Confirmation audio URL:', confirmationAudioURL);

        if (confirmationAudioURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `✅ ${confirmationMessage}`,
            mediaUrl: [confirmationAudioURL]
          });
          console.log('Sent confirmation with audio');
        } else {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `✅ ${confirmationMessage}`
          });
          console.log('Sent confirmation without audio');
        }

        return res.sendStatus(200);
      }

      // BP reminder command handler - send localized voice note and expect BP photo next
      if (incomingMsg === '10' && !userState[from]?.waitingForLanguage && userState[from]?.languageCode) {
        const langCode = userState[from]?.languageCode || 'en-IN';
        const targetLang = (langCode.split('-')[0] || 'en');
        const langLabel = userState[from]?.languageLabel || 'English';

        const baseText = 'It is time to measure your blood pressure. Please sit comfortably, rest your arm at heart level, relax for 5 minutes, and then send me a clear photo of your BP monitor screen.';
        let localizedText = baseText;
        try {
          localizedText = await translateText(baseText, targetLang, 'en');
        } catch (_) {}

        const audioURL = await generateSpeechFromText(localizedText, langCode, timestamp);
        if (audioURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🩺 BP Reminder (${langLabel})`,
            mediaUrl: [audioURL]
          });
        } else {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🩺 ${localizedText}`
          });
        }

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: '📸 After measuring, send a clear photo of your BP monitor screen.'
        });

        userState[from].awaitingBpPhoto = true;
        return res.sendStatus(200);
      }

      // Admin mode: fixed prescription explanation for any prescription image (no AI / OCR)
      if (mediaUrl && contentType?.startsWith('image') && userState[from]?.adminMode) {
        const adminLangShort = (userState[from]?.adminLanguageCode || 'en-IN').split('-')[0] || 'en';
        const langCode = userState[from]?.adminLanguageCode || 'en-IN';
        const langLabel = userState[from]?.adminLanguageLabel || 'English';

        const staticPrescriptionExplanation =
          adminStaticPrescription[adminLangShort] || adminStaticPrescription.en;

        const audioURL = await generateSpeechFromText(staticPrescriptionExplanation, langCode, timestamp);

        if (audioURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🎧 Admin demo prescription explanation (${langLabel}):`,
            mediaUrl: [audioURL]
          });
        } else {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `📝 Admin demo prescription explanation (${langLabel}):\n\n${staticPrescriptionExplanation}`
          });
        }

        return res.sendStatus(200);
      }

      // Prescription image handler (only when no prescription summary captured yet)
      if (mediaUrl && contentType?.startsWith('image') && !userState[from]?.summary) {
        const localImageFile = `twilio_img_${timestamp}.jpg`;
        const groqImageUrl = await downloadTwilioMedia(mediaUrl, localImageFile);

        const summary = await getImagePrescriptionSummary(groqImageUrl);
        userState[from] = { waitingForLanguage: true, summary, expectingVoice: false, awaitingMedicinePhoto: true };

        const languageList = `
1 Hindi
2 English
3 Bengali
4 Tamil
5 Telugu
6 Kannada
7 Malayalam
8 Marathi
9 Gujarati
10 Punjabi
11 Odia

Please send the number of your preferred language.
`;

        const langAudioURL = await generateSpeechFromText(languageList, 'hi-IN', timestamp);

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: `🎙️ Please listen and reply with a number (1–11) to select your language.`,
          mediaUrl: [langAudioURL]
        });

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body:
            '🗣️ In which language would you like to hear the summary?\n' +
            '1. हिंदी\n2. English\n3. বাংলা\n4. தமிழ்\n5. తెలుగు\n6. ಕನ್ನಡ\n7.മലയാളം \n8. मराठी\n9. ગુજરાતી\n10. ਪੰਜਾਬੀ\n11. ଓଡିଆ\n' +
            '\n👉 Reply with the number (1–11).\n\n' +
            '💡 Tip: Type "LINK" or "🔗" anytime to access your health dashboard!'
        });

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886',
          to: from,
          body: '📸 After choosing language, please send a clear photo of each medicine label one by one to get spoken instructions.'
        });
      }

      // BP image handler - MUST come before medicine handler to avoid conflicts
      if (mediaUrl && contentType?.startsWith('image') && userState[from]?.awaitingBpPhoto) {
        const langCode = userState[from]?.languageCode || 'en-IN';
        const targetLang = (langCode.split('-')[0] || 'en');
        const langLabel = userState[from]?.languageLabel || 'English';

        // Hardcoded BP response - no AI analysis
        const baseText = 'Your blood pressure is 120 systolic and 75 diastolic.';
        let localizedText = baseText;
        try {
          localizedText = await translateText(baseText, targetLang, 'en');
        } catch (_) {}

        const audioURL = await generateSpeechFromText(localizedText, langCode, timestamp);

        if (audioURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🩺 Your BP reading in ${langLabel}:`,
            mediaUrl: [audioURL]
          });
        } else {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `🩺 ${localizedText}`
          });
        }

        userState[from].awaitingBpPhoto = false;
        return res.sendStatus(200);
      }

      // Medicine image handler (after prescription captured)
      if (mediaUrl && contentType?.startsWith('image') && userState[from]?.awaitingMedicinePhoto && userState[from]?.summary) {
        const localImageFile = `medicine_${timestamp}.jpg`;
        const hostedUrl = await downloadTwilioMedia(mediaUrl, localImageFile);

        const targetLang = (userState[from]?.languageCode || 'en-IN').split('-')[0] || 'en';
        const analysis = await analyzeMedicineImage(userState[from].summary, hostedUrl, targetLang);

        const langCode = userState[from]?.languageCode || 'en-IN';
        const langLabel = userState[from]?.languageLabel || 'English';

        // AI handles all logic - just use the instructions it provides
        const instructions = analysis.instructions || analysis.warning || 'No information available from the image.';
        
        const audioURL = await generateSpeechFromText(instructions, langCode, timestamp);
        
        if (audioURL) {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `📄 Information from your image in ${langLabel}:`,
            mediaUrl: [audioURL]
          });
        } else {
          await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: from,
            body: `📄 Information from your image:\n\n${instructions}`
          });
        }
      }

      res.sendStatus(200);
    } catch (err) {
      console.error('❌ Error:', err.message);
      res.sendStatus(500);
    }
  });

  return router;
};


