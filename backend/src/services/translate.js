const fetch = require('node-fetch');
const { Groq } = require('groq-sdk');
const { GROQ_API_KEY } = require('../config/env');

const groq = new Groq({ apiKey: GROQ_API_KEY });

// Map ASCII digits 0-9 to native numeral sets for selected languages
function convertAsciiDigitsToNative(input, targetLang) {
  if (!input) return input;
  const maps = {
    // Devanagari (Hindi, Marathi, Nepali)
    dev: ['०','१','२','३','४','५','६','७','८','९'],
    // Bengali
    ben: ['০','১','২','৩','৪','৫','৬','৭','৮','৯'],
    // Gujarati
    guj: ['૦','૧','૨','૩','૪','૫','૬','૭','૮','૯'],
    // Gurmukhi (Punjabi)
    guru: ['੦','੧','੨','੩','੪','੫','੬','੭','੮','੯'],
    // Oriya (Odia)
    ori: ['୦','୧','୨','୩','୪','୫','୬','୭','୮','୯'],
    // Tamil
    tam: ['௦','௧','௨','௩','௪','௫','௬','௭','௮','௯'],
    // Telugu
    tel: ['౦','౧','౨','౩','౪','౫','౬','౭','౮','౯'],
    // Kannada
    knd: ['೦','೧','೨','೩','೪','೫','೬','೭','೮','೯'],
    // Malayalam
    mal: ['൦','൧','൨','൩','൪','൫','൬','൭','൮','൯']
  };

  const lang = (targetLang || '').toLowerCase();
  let map = null;
  if (['hi','mr','ne'].includes(lang)) map = maps.dev;
  else if (lang === 'bn') map = maps.ben;
  else if (lang === 'gu') map = maps.guj;
  else if (lang === 'pa') map = maps.guru;
  else if (lang === 'or') map = maps.ori;
  else if (lang === 'ta') map = maps.tam;
  else if (lang === 'te') map = maps.tel;
  else if (lang === 'kn') map = maps.knd;
  else if (lang === 'ml') map = maps.mal;

  if (!map) return input;
  return input.replace(/[0-9]/g, d => map[Number(d)]);
}

// Convert integer to Hindi words (Indian numbering system)
function integerToHindiWords(num) {
  const units = [
    'शून्य','एक','दो','तीन','चार','पाँच','छह','सात','आठ','नौ','दस','ग्यारह','बारह','तेरह','चौदह','पंद्रह','सोलह','सत्रह','अठारह','उन्नीस'
  ];
  const tens = [
    '', '', 'बीस','तीस','चालीस','पचास','साठ','सत्तर','अस्सी','नब्बे'
  ];
  const irregular = {
    20: 'बीस',21: 'इक्कीस',22: 'बाईस',23: 'तेईस',24: 'चौबीस',25: 'पच्चीस',26: 'छब्बीस',27: 'सत्ताईस',28: 'अट्ठाईस',29: 'उनतीस',
    30: 'तीस',31: 'इकतीस',32: 'बत्तीस',33: 'तैंतीस',34: 'चौंतीस',35: 'पैंतीस',36: 'छत्तीस',37: 'सैंतीस',38: 'अड़तीस',39: 'उनतालीस',
    40: 'चालीस',41: 'इकतालीस',42: 'बयालीस',43: 'तैंतालीस',44: 'चवालीस',45: 'पैंतालीस',46: 'छियालिस',47: 'सैंतालीस',48: 'अड़तालीस',49: 'उन्चास',
    50: 'पचास',51: 'इक्यावन',52: 'बावन',53: 'तििरपन',54: 'चौवन',55: 'पचपन',56: 'छप्पन',57: 'सत्तावन',58: 'अट्ठावन',59: 'उनसाठ',
    60: 'साठ',61: 'इकसठ',62: 'बासठ',63: 'तििरसठ',64: 'चौंसठ',65: 'पैंसठ',66: 'छियासठ',67: 'सड़सठ',68: 'अड़सठ',69: 'उनहत्तर',
    70: 'सत्तर',71: 'इकहत्तर',72: 'बहत्तर',73: 'तिहत्तर',74: 'चौहत्तर',75: 'पचहत्तर',76: 'छिहत्तर',77: 'सतहत्तर',78: 'अठहत्तर',79: 'उन्यासी',
    80: 'अस्सी',81: 'इक्यासी',82: 'बयासी',83: 'तिरासी',84: 'चौरासी',85: 'पचासी',86: 'छियासी',87: 'सतासी',88: 'अठासी',89: 'नवासी',
    90: 'नब्बे',91: 'इक्यानवे',92: 'बानवे',93: 'तिरानवे',94: 'चौरानवे',95: 'पचानवे',96: 'छियानवे',97: 'सत्तानवे',98: 'अट्ठानवे',99: 'निन्यानवे'
  };
  if (num < 20) return units[num];
  if (num < 100) return irregular[num] || `${tens[Math.floor(num/10)]}`;
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const rem = num % 100;
    return rem ? `${units[hundreds]} सौ ${integerToHindiWords(rem)}` : `${units[hundreds]} सौ`;
  }
  const parts = [];
  const crore = Math.floor(num / 10000000);
  if (crore) {
    parts.push(`${integerToHindiWords(crore)} करोड़`);
    num = num % 10000000;
  }
  const lakh = Math.floor(num / 100000);
  if (lakh) {
    parts.push(`${integerToHindiWords(lakh)} लाख`);
    num = num % 100000;
  }
  const thousand = Math.floor(num / 1000);
  if (thousand) {
    parts.push(`${integerToHindiWords(thousand)} हज़ार`);
    num = num % 1000;
  }
  const hundred = Math.floor(num / 100);
  if (hundred) {
    parts.push(`${integerToHindiWords(hundred)} सौ`);
    num = num % 100;
  }
  if (num) parts.push(integerToHindiWords(num));
  return parts.join(' ');
}

function numberToHindiWords(value) {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  if (!str) return '';
  let negative = false;
  let s = str;
  if (s.startsWith('-')) { negative = true; s = s.slice(1); }
  const [intPart, fracPart] = s.split(/[\.]/);
  const intNum = Number(intPart.replace(/,/g, ''));
  if (!Number.isFinite(intNum)) return str;
  let words = integerToHindiWords(intNum);
  if (fracPart && /\d/.test(fracPart)) {
    const fracWords = fracPart.split('').map(d => integerToHindiWords(Number(d))).join(' ');
    words = `${words} दशमलव ${fracWords}`;
  }
  return negative ? `ऋण ${words}` : words;
}

// Map English number words to Hindi words
const englishToHindiNumbers = {
  'zero': 'शून्य', 'one': 'एक', 'two': 'दो', 'three': 'तीन', 'four': 'चार',
  'five': 'पाँच', 'six': 'छह', 'seven': 'सात', 'eight': 'आठ', 'nine': 'नौ',
  'ten': 'दस', 'eleven': 'ग्यारह', 'twelve': 'बारह', 'thirteen': 'तेरह',
  'fourteen': 'चौदह', 'fifteen': 'पंद्रह', 'sixteen': 'सोलह', 'seventeen': 'सत्रह',
  'eighteen': 'अठारह', 'nineteen': 'उन्नीस', 'twenty': 'बीस', 'thirty': 'तीस',
  'forty': 'चालीस', 'fifty': 'पचास', 'sixty': 'साठ', 'seventy': 'सत्तर',
  'eighty': 'अस्सी', 'ninety': 'नब्बे', 'hundred': 'सौ', 'thousand': 'हज़ार',
  'lakh': 'लाख', 'crore': 'करोड़'
};

// Map medical units to Hindi equivalents for better TTS pronunciation
const unitToHindi = {
  // Weight units
  'mg': 'मिलीग्राम',
  'milligram': 'मिलीग्राम',
  'milligrams': 'मिलीग्राम',
  'g': 'ग्राम',
  'gram': 'ग्राम',
  'grams': 'ग्राम',
  'kg': 'किलोग्राम',
  'kilogram': 'किलोग्राम',
  'kilograms': 'किलोग्राम',
  
  // Volume units
  'ml': 'मिलीलीटर',
  'mL': 'मिलीलीटर',
  'milliliter': 'मिलीलीटर',
  'milliliters': 'मिलीलीटर',
  'l': 'लीटर',
  'liter': 'लीटर',
  'liters': 'लीटर',
  'litre': 'लीटर',
  'litres': 'लीटर',
  
  // Medicine forms
  'tablet': 'गोली',
  'tablets': 'गोलियां',
  'tab': 'गोली',
  'tabs': 'गोलियां',
  'capsule': 'कैप्सूल',
  'capsules': 'कैप्सूल',
  'cap': 'कैप्सूल',
  'caps': 'कैप्सूल',
  'syrup': 'सिरप',
  'injection': 'इंजेक्शन',
  'injections': 'इंजेक्शन',
  'drops': 'बूंदें',
  'drop': 'बूंद',
  
  // Frequency abbreviations
  'od': 'दिन में एक बार',
  'OD': 'दिन में एक बार',
  'bid': 'दिन में दो बार',
  'BID': 'दिन में दो बार',
  'tid': 'दिन में तीन बार',
  'TID': 'दिन में तीन बार',
  'qid': 'दिन में चार बार',
  'QID': 'दिन में चार बार',
  'bd': 'दिन में दो बार',
  'BD': 'दिन में दो बार',
  'tds': 'दिन में तीन बार',
  'TDS': 'दिन में तीन बार',
  
  // Time units
  'daily': 'रोजाना',
  'once daily': 'दिन में एक बार',
  'twice daily': 'दिन में दो बार',
  'thrice daily': 'दिन में तीन बार',
  'times': 'बार',
  'time': 'बार',
  'day': 'दिन',
  'days': 'दिन',
  'week': 'सप्ताह',
  'weeks': 'सप्ताह',
  'month': 'महीना',
  'months': 'महीने',
  'hour': 'घंटा',
  'hours': 'घंटे',
  
  // Other common terms
  'before food': 'खाने से पहले',
  'after food': 'खाने के बाद',
  'with food': 'खाने के साथ',
  'empty stomach': 'खाली पेट',
  'with water': 'पानी के साथ',
  'with milk': 'दूध के साथ'
};

// Convert medical units to Hindi for better TTS pronunciation
function replaceMedicalUnits(input, targetLang) {
  if (!input) return input;
  const lang = (targetLang || '').toLowerCase();
  if (lang !== 'hi') return input;
  
  let result = input;
  
  // Replace units (case-insensitive, whole word match)
  // Sort by length (longest first) to avoid partial matches
  const sortedUnits = Object.keys(unitToHindi).sort((a, b) => b.length - a.length);
  
  sortedUnits.forEach(unit => {
    // Create regex for whole word match, case-insensitive
    const regex = new RegExp(`\\b${unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, unitToHindi[unit]);
  });
  
  return result;
}

// Convert English number words to Hindi words
function replaceEnglishNumberWords(input, targetLang) {
  if (!input) return input;
  const lang = (targetLang || '').toLowerCase();
  if (lang !== 'hi') return input;
  
  let result = input;
  
  // Replace English number words with Hindi equivalents (case-insensitive, whole word match)
  Object.keys(englishToHindiNumbers).forEach(englishWord => {
    const regex = new RegExp(`\\b${englishWord}\\b`, 'gi');
    result = result.replace(regex, englishToHindiNumbers[englishWord]);
  });
  
  return result;
}

function replaceNumbersWithWords(input, targetLang) {
  if (!input) return input;
  const lang = (targetLang || '').toLowerCase();
  if (lang !== 'hi') {
    console.log(`[replaceNumbersWithWords] Skipping - language is ${lang}, not Hindi`);
    return input;
  }
  
  console.log(`[replaceNumbersWithWords] Processing text for Hindi, length: ${input.length}`);
  console.log(`[replaceNumbersWithWords] Sample input: ${input.substring(0, 200)}`);
  
  // First, replace English number words (one, two, three, etc.)
  let result = replaceEnglishNumberWords(input, targetLang);
  
  // Helper function to convert a number string to Hindi words
  const convertNumber = (numStr) => {
    if (!numStr) return numStr;
    // Remove commas and normalize
    const normalized = numStr.replace(/,/g, '').trim();
    // Check if it's a valid number (integer or decimal)
    if (!/^\d+\.?\d*$/.test(normalized)) {
      console.log(`[convertNumber] Invalid number format: ${numStr}`);
      return numStr;
    }
    try {
      const converted = numberToHindiWords(normalized);
      console.log(`[convertNumber] ${numStr} -> ${converted}`);
      return converted || numStr;
    } catch (error) {
      console.error(`[convertNumber] Error converting ${numStr} to Hindi:`, error);
      return numStr;
    }
  };
  
  // Track which character positions have been processed to avoid double-processing
  const processedRanges = [];
  const isInProcessedRange = (index, length) => {
    const end = index + length;
    return processedRanges.some(range => {
      return (index >= range.start && index < range.end) ||
             (end > range.start && end <= range.end) ||
             (index <= range.start && end >= range.end);
    });
  };
  const markProcessed = (index, length) => {
    processedRanges.push({ start: index, end: index + length });
  };
  
  // Find ALL numbers in the text - use a simple, aggressive pattern
  // Pattern matches: one or more digits, optionally followed by commas and more digits, optionally followed by decimal point and digits
  // This will catch: 625, 40, 1.5, 1,000, 625.5, etc.
  const allNumberMatches = [];
  const numberPattern = /\d+(?:[,]\d+)*(?:\.\d+)?/g;
  let match;
  
  // Reset regex lastIndex to ensure we find all matches
  numberPattern.lastIndex = 0;
  let matchCount = 0;
  while ((match = numberPattern.exec(result)) !== null) {
    matchCount++;
    const numText = match[0];
    // Skip if already contains Hindi characters (already converted)
    if (/[\u0900-\u097F]/.test(numText)) {
      console.log(`[replaceNumbersWithWords] Skipping ${numText} - already contains Hindi`);
      continue;
    }
    allNumberMatches.push({
      fullMatch: numText,
      number: numText,
      index: match.index,
      length: numText.length
    });
  }
  
  console.log(`[replaceNumbersWithWords] Found ${allNumberMatches.length} number(s) to process (out of ${matchCount} total matches):`, 
    allNumberMatches.map(m => `"${m.number}" at index ${m.index}`).join(', '));
  
  // Process numbers from end to start to preserve indices
  for (let i = allNumberMatches.length - 1; i >= 0; i--) {
    const m = allNumberMatches[i];
    
    // Skip if already processed
    if (isInProcessedRange(m.index, m.length)) continue;
    
    // Skip if already contains Hindi (already converted)
    if (/[\u0900-\u097F]/.test(m.number)) continue;
    
    // Check context to handle special cases
    const before = result.substring(Math.max(0, m.index - 10), m.index);
    const after = result.substring(m.index + m.length, Math.min(result.length, m.index + m.length + 10));
    
    // Special case 1: Number before "mg"
    if (/mg/i.test(after.trim())) {
      const converted = convertNumber(m.number);
      if (converted !== m.number) {
        result = result.substring(0, m.index) + converted + result.substring(m.index + m.length);
        markProcessed(m.index, converted.length);
      }
      continue;
    }
    
    // Special case 2: Thousand separator (e.g., "1,000")
    if (/^\d{1,3}(?:,\d{3})+$/.test(m.number)) {
      const converted = convertNumber(m.number);
      if (converted !== m.number) {
        result = result.substring(0, m.index) + converted + result.substring(m.index + m.length);
        markProcessed(m.index, converted.length);
      }
      continue;
    }
    
    // Special case 3: Comma-separated list (e.g., "1,2" but not "1,000")
    if (/,/.test(m.number) && !/,\d{3}/.test(m.number)) {
      const numbers = m.number.split(',').map(n => n.trim());
      const converted = numbers.map(n => convertNumber(n)).join(', ');
      if (converted !== m.number) {
        result = result.substring(0, m.index) + converted + result.substring(m.index + m.length);
        markProcessed(m.index, converted.length);
      }
      continue;
    }
    
    // General case: Convert any remaining number
    const converted = convertNumber(m.number);
    if (converted !== m.number) {
      result = result.substring(0, m.index) + converted + result.substring(m.index + m.length);
      markProcessed(m.index, converted.length);
    }
  }
  
  // Finally, replace medical units with Hindi equivalents for better TTS
  result = replaceMedicalUnits(result, targetLang);
  
  console.log(`[replaceNumbersWithWords] Final result length: ${result.length}`);
  console.log(`[replaceNumbersWithWords] Sample output: ${result.substring(0, 200)}`);
  
  return result;
}

async function translateText(text, targetLang, sourceLang = 'auto') {
  if (!targetLang) {
    throw new Error('translateText requires both text and targetLang');
  }
  const input = typeof text === 'string' ? text : (text == null ? '' : String(text));
  if (!input || !input.trim()) {
    console.warn('translateText called with empty input, returning empty string');
    return '';
  }

  // Try Groq LLM first
  try {
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
    const targetLangName = languageNames[targetLang] || targetLang;
    
    const systemPrompt = `You are a professional translator. Translate the user's message from ${sourceLang} to ${targetLang} (${targetLangName}). 

CRITICAL REQUIREMENTS:
- Translate EVERY word to ${targetLangName}. Do NOT leave any English words untranslated.
- Convert ALL numbers to ${targetLangName} words or native script. For example, "one" should become "एक" in Hindi, "two" should become "दो", etc.
- If the target language uses a different script (like Devanagari for Hindi), use that script.
- Preserve meaning and tone.
- Respond with ONLY the translated text, no quotes, no extra words, no notes, no explanations.
- Ensure the entire response is in ${targetLangName} only - no mixing of languages.`;
    
    const chat = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.2,
      top_p: 1,
      max_completion_tokens: 5000,
      stream: false
    });

    let translated = chat.choices[0].message.content
      .replace(/[\*\_\~\`]/g, '')
      .trim();

    if (translated) {
      // Replace English number words first
      translated = replaceEnglishNumberWords(translated, targetLang);
      // Then replace numeric digits with words
      translated = replaceNumbersWithWords(translated, targetLang);
      // Replace medical units with Hindi equivalents
      translated = replaceMedicalUnits(translated, targetLang);
      // Finally convert to native script
      translated = convertAsciiDigitsToNative(translated, targetLang);
      console.log(translated);
      return translated;
    }
  } catch (err) {
    // Fall back to public translate endpoint if Groq is unavailable
    // console.warn('[translate] Groq translation failed, falling back:', err?.message || err);
  }

  // Fallback: Google public translate API (best-effort, not guaranteed for production)
  const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(input)}`);
  const data = await res.json();
  const fallback = data[0].map(part => part[0]).join('');
  // Replace English number words first
  let withWords = replaceEnglishNumberWords(fallback, targetLang);
  // Then replace numeric digits with words
  withWords = replaceNumbersWithWords(withWords, targetLang);
  // Replace medical units with Hindi equivalents
  withWords = replaceMedicalUnits(withWords, targetLang);
  // Finally convert to native script
  return convertAsciiDigitsToNative(withWords, targetLang);
}

module.exports = { translateText, replaceNumbersWithWords, replaceEnglishNumberWords, replaceMedicalUnits, convertAsciiDigitsToNative };


