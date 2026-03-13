const { SarvamAIClient } = require('sarvamai');
const { SARVAM_API_KEY } = require('./src/config/env');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const sarvamClient = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });

async function testSarvamDirect() {
  const hindiText = `पाँच दिनों के लिए भोजन के बाद दिन में तीन बार एक Augmentin छह सौ पच्चीस मिलीग्राम टैबलेट लें। पलेंच दिनलें लें लिए भोजन लें बाद दिन लें तीन बार एक Enzoflem लेंबलेंट लें। पलेंच दिनलें लें लिए भोजन टै पहटै दिन टै तीन बार एक PanD चालीस मिलीटैराम टैबटैट टै। एक सटैताह टै लिए Hexigel गम टैट लगाटै और दिन टै एक बार मालिश कटै।`;
  
  console.log('Testing Sarvam TTS directly with Hindi text...');
  console.log('Text length:', hindiText.length);
  console.log('Text:', hindiText);
  console.log('\n' + '='.repeat(80) + '\n');
  
  try {
    const audioRes = await sarvamClient.textToSpeech.convert({
      text: hindiText,
      target_language_code: 'hi-IN',
      speaker: 'anushka',
      model: 'bulbul:v2',
      pitch: 0, 
      pace: 1, 
      loudness: 1, 
      speech_sample_rate: 22050,
      enable_preprocessing: true
    });

    console.log('Sarvam API Response:');
    console.log('- Has audio:', !!audioRes.audios);
    console.log('- Audio count:', audioRes.audios?.length || 0);
    console.log('- First audio length:', audioRes.audios?.[0]?.length || 0);
    
    if (audioRes.audios && audioRes.audios[0]) {
      const buffer = Buffer.from(audioRes.audios[0], 'base64');
      const rawPath = path.join(__dirname, 'test_audio.raw');
      const mp3Path = path.join(__dirname, 'test_audio.mp3');
      
      fs.writeFileSync(rawPath, buffer);
      console.log(`Raw audio saved: ${rawPath} (${buffer.length} bytes)`);
      
      // Convert to MP3
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
          '-f', 's16le', '-ar', '22050', '-ac', '1',
          '-i', rawPath,
          '-acodec', 'libmp3lame', '-ab', '128k',
          mp3Path
        ]);
        
        ffmpeg.stderr.on('data', (data) => {
          console.log('FFmpeg stderr:', data.toString());
        });
        
        ffmpeg.on('close', code => {
          if (code === 0) {
            console.log(`MP3 audio saved: ${mp3Path}`);
            resolve();
          } else {
            console.error(`FFmpeg failed with code: ${code}`);
            reject(new Error('ffmpeg failed'));
          }
        });
      });
      
      console.log('\n✅ Test completed successfully!');
      console.log('You can play the MP3 file to check if the last line is spoken.');
    } else {
      console.log('❌ No audio data received from Sarvam API');
    }
    
  } catch (error) {
    console.error('❌ Error testing Sarvam API:', error.message);
    console.error('Full error:', error);
  }
}

testSarvamDirect();
