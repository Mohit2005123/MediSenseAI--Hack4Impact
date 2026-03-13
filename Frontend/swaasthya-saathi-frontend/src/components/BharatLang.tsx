// app/components/BharatLanguageMarquee.tsx
"use client";

import { InfiniteMovingCards } from "./ui/infinite-moving-cards"; // adjust import path

const flags: Record<string, string> = {
  Hinglish: "🇮🇳",
  "हिंदी": "🇮🇳",
  "தமிழ்": "🇮🇳",
  "বাংলা": "🇮🇳",
};

const languages = [
  { name: "Hinglish", example: "Doctor sahib, ye medicine kab leni hai?" },
  { name: "हिंदी", example: "डॉक्टर साहब, यह दवा कब लेनी है?" },
  { name: "தமிழ்", example: "டாக்டர், இந்த மருந்து எப்போது எடுக்க வேண்டும்?" },
  { name: "বাংলা", example: "ডাক্তার, এই ওষুধ কখন খেতে হবে?" },
  // Feel free to expand:
  { name: "मराठी", example: "डॉक्टर साहेब, ही औषधं कधी घ्यायची?" },
  { name: "ગુજરાતી", example: "ડોકટર સાહેબ, આ દવા ક્યારે લેવી?" },
  { name: "తెలుగు", example: "డాక్టర్ గారు, ఈ మందు ఎప్పుడు తినాలి?" },
  { name: "ಕನ್ನಡ", example: "ಡಾಕ್ಟರ್ ಸರ್, ಈ ಔಷಧಿಯನ್ನು ಯಾವಾಗ ತೆಗೆದುಕೊಳ್ಳಬೇಕು?" },
  { name: "മലയാളം", example: "ഡോക്ടർ സാർ, ഈ മരുന്നു എപ്പോൾ കഴിക്കണം?" },
];

const toItems = (arr: typeof languages) =>
  arr.map((l) => ({
    quote: `“${l.example}”`,
    name: `${flags[l.name] ?? "🌐"} ${l.name}`,
    title: "Example query",
  }));

export default function BharatLanguageMarquee() {
  // Split into rows so each row can scroll opposite directions
  const mid = Math.ceil(languages.length / 2);
  const rowA = toItems(languages.slice(0, mid));
  const rowB = toItems(languages.slice(mid));

  return (
    <section id="bharat-marquee" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins">
            Natural Conversation Examples
          </h2>
          <p className="text-muted-foreground mt-2">
            Code-switching & native language understanding—at your fingertips
          </p>
        </div>

        {/* Row 1: left & fast */}
        <InfiniteMovingCards
          items={rowA}
          direction="left"
          speed="fast"
          className="mb-6"
        />

        {/* Row 2: right & normal */}
        <InfiniteMovingCards
          items={rowB}
          direction="right"
          speed="normal"
          className="mb-6"
        />

        {/* Optional Row 3: re-use all items, slow & left for depth */}
        <InfiniteMovingCards
          items={toItems(languages)}
          direction="left"
          speed="slow"
        />
      </div>
    </section>
  );
}
