const { generateSpeechFromText } = require('./src/services/tts');

async function testTTSFix() {
  const hindiText = `पाँच दिनों के लिए भोजन के बाद दिन में तीन बार एक Augmentin छह सौ पच्चीस मिलीग्राम टैबलेट लें। पलेंच दिनलें लें लिए भोजन लें बाद दिन लें तीन बार एक Enzoflem लेंबलेंट लें। पलेंच दिनलें लें लिए भोजन टै पहटै दिन टै तीन बार एक PanD चालीस मिलीटैराम टैबटैट टै। एक सटैताह टै लिए Hexigel गम टैट लगाटै और दिन टै एक बार मालिश कटै।`;
  
  console.log('Testing TTS fix with Hindi text...');
  console.log('Text length:', hindiText.length);
  console.log('Text:', hindiText);
  console.log('\n' + '='.repeat(80) + '\n');
  
  try {
    const audioURL = await generateSpeechFromText(hindiText, 'hi-IN', Date.now());
    
    if (audioURL) {
      console.log('✅ TTS generation successful!');
      console.log('Audio URL:', audioURL);
    } else {
      console.log('❌ TTS generation failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing TTS:', error.message);
    console.error('Full error:', error);
  }
}

testTTSFix();
