const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { SarvamAIClient } = require('sarvamai');
const { SARVAM_API_KEY, NGROK_DOMAIN } = require('../config/env');
const { splitIntoChunks } = require('../utils/chunk');
const { convertAsciiDigitsToNative, replaceNumbersWithWords, replaceEnglishNumberWords, replaceMedicalUnits } = require('../services/translate');

const sarvamClient = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });

async function generateSpeechFromText(fullText, langCode, timestamp) {
  console.log('TTS Input - Text length:', fullText.length);
  console.log('TTS Input - Language:', langCode);
  
  // Extract 2-letter language code for number conversion
  const targetLang = (langCode || '').split('-')[0] || 'en';
  
  // First, replace English number words (one, two, three, etc.) with target language equivalents
  let localized = replaceEnglishNumberWords(fullText, targetLang);
  
  // Then, convert numeric digits to words for Hindi (better TTS pronunciation)
  localized = replaceNumbersWithWords(localized, targetLang);
  
  // Replace medical units with Hindi equivalents for better TTS pronunciation
  localized = replaceMedicalUnits(localized, targetLang);
  
  // Finally, ensure numerals are localized to native script for other languages
  localized = convertAsciiDigitsToNative(localized, targetLang);
  
  console.log('TTS Localized text length:', localized.length);
  console.log('TTS Target language:', targetLang);
  
  const chunks = splitIntoChunks(localized, 400).filter(chunk => chunk && chunk.trim());
  console.log('TTS Chunks count:', chunks.length);
  console.log('TTS Chunks lengths:', chunks.map(chunk => chunk.length));
  
  if (chunks.length === 0) {
    console.warn('No valid text chunks found for TTS generation');
    return null;
  }
  
  const mp3Files = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    if (!chunk) continue; // Skip empty chunks
    
    console.log(`TTS Processing chunk ${i + 1}/${chunks.length}, length: ${chunk.length}`);
    
    try {
      const audioRes = await sarvamClient.textToSpeech.convert({
        text: chunk,
        target_language_code: langCode,
        speaker: 'anushka',
        model: 'bulbul:v2',
        pitch: 0, pace: 1, loudness: 1, speech_sample_rate: 22050,
        enable_preprocessing: true
      });
      

      // Process all audio chunks returned by Sarvam
      if (audioRes.audios && audioRes.audios.length > 0) {
        for (let j = 0; j < audioRes.audios.length; j++) {
          const buffer = Buffer.from(audioRes.audios[j], 'base64');
          const rawPath = path.join(__dirname, '../../public', `chunk_${timestamp}_${i}_${j}.raw`);
          const mp3Path = path.join(__dirname, '../../public', `chunk_${timestamp}_${i}_${j}.mp3`);
          mp3Files.push(mp3Path);

          fs.writeFileSync(rawPath, buffer);

          await new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', [
              '-f', 's16le', '-ar', '22050', '-ac', '1',
              '-i', rawPath,
              '-acodec', 'libmp3lame', '-ab', '128k',
              mp3Path
            ]);
            ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error('ffmpeg failed')));
          });
          
        }
      } else {
        console.warn(`No audio data received for chunk ${i + 1}`);
      }
    } catch (error) {
      throw error;
    }
  }

  const concatList = path.join(__dirname, '../../public', `concat_${timestamp}.txt`);
  const concatContent = mp3Files.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(concatList, concatContent);
  
  console.log('TTS Concatenating', mp3Files.length, 'audio files');
  console.log('TTS MP3 files:', mp3Files);
  
  const finalPath = path.join(__dirname, '../../public', `answer_${timestamp}.mp3`);
  
  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'concat', '-safe', '0',
      '-i', concatList,
      '-c', 'copy',
      finalPath
    ]);
    
    ffmpeg.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('concat ffmpeg failed'));
      }
    });
  });

  const finalURL = `${NGROK_DOMAIN}/static/answer_${timestamp}.mp3`;
  
  // Check file size
  try {
    const stats = fs.statSync(finalPath);
    console.log('TTS Final audio file size:', stats.size, 'bytes');
    console.log('TTS Final audio file size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
  } catch (error) {
    console.log('TTS Could not get file stats:', error.message);
  }
  
  console.log('TTS Final URL:', finalURL);
  console.log('TTS Process completed successfully');
  return finalURL;
}

module.exports = { generateSpeechFromText };


