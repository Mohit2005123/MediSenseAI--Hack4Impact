const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const {SarvamAIClient} = require('sarvamai');
const fs = require('fs');
const {SARVAM_API_KEY} = require('../config/env');

async function main() {
if (!SARVAM_API_KEY) {
  throw new Error('SARVAM_API_KEY is not set. Please check your .env file in the backend directory.');
}

const client = new SarvamAIClient({
apiSubscriptionKey: SARVAM_API_KEY,
});

const socket = await client.textToSpeechStreaming.connect({
model: "bulbul:v2",
});

let chunkCount = 0;
const outputStream = fs.createWriteStream("output.mp3");

let closeTimeout = null;

socket.on("open", () => {
console.log("Connection opened");

    socket.configureConnection({
      type: "config",
      data: {
        speaker: "anushka",
        target_language_code: "hi-IN",
      },
    });

    console.log("Configuration sent");

    // const longText =
    //   "भारत की संस्कृति विश्व की सबसे प्राचीन और समृद्ध संस्कृतियों में से एक है।"+
    //   "यह विविधता, सहिष्णुता और परंपराओं का अद्भुत संगम है, जिसमें विभिन्न धर्म, भाषाएं, त्योहार, संगीत, नृत्य, वास्तुकला और जीवनशैली शामिल हैं।";
    const longText =  `Zindagi ek ajeeb sa safar hai jisme hum har din kuch naya seekhte hain. Kabhi khushi milti hai, kabhi mushkilein aati hain, lekin har experience hume thoda aur strong banata hai. Jab cheezein plan ke according nahi hoti, tab sabse zyada patience ki zarurat hoti hai. Waqt ke saath samajh aata hai ki har cheez ka ek reason hota hai, bas us moment mein wo reason clear nahi hota.
Log aksar doosron se compare karke apni value kam samajhne lagte hain, lekin sach ye hai ki har insaan ka apna journey hota hai. Kisi ka success jaldi aa jata hai, kisi ka thoda late, par iska matlab ye nahi ki koi peeche reh gaya. Mehnat kabhi waste nahi jaati, bas uska result kab aur kaise milega, ye hum decide nahi kar sakte.`;

    socket.convert(longText);
    console.log("Text sent for conversion");


    closeTimeout = setTimeout(() => {
      console.log("Forcing socket close after timeout");
      socket.close();
    }, 10000);

});

socket.on("message", (message) => {
if (message.type === "audio") {
chunkCount++;
const audioBuffer = Buffer.from(message.data.audio, "base64");
outputStream.write(audioBuffer);
console.log(`Received and wrote chunk ${chunkCount}`);
} else {
console.log("Received message:", message);
}
});

socket.on("close", (event) => {
console.log("Connection closed:", event);
if (closeTimeout) clearTimeout(closeTimeout);
outputStream.end(() => {
console.log(`All ${chunkCount} chunks saved to output.mp3`);
});
});

socket.on("error", (error) => {
console.error("Error occurred:", error);
if (closeTimeout) clearTimeout(closeTimeout);
outputStream.end();
});

await socket.waitForOpen();
console.log("WebSocket is ready");
}

main().catch(console.error);
