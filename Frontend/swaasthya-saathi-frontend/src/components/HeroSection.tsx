import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mic, Globe, Brain } from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";
import WhatsAppQRModal from "@/components/WhatsAppQRModal";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWhatsAppClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/90" />
      
      {/* Floating medical icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Brain className="w-8 h-8 text-primary/20" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Mic className="w-6 h-6 text-secondary/20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Globe className="w-10 h-10 text-primary/20" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '0.5s' }}>
          <MessageCircle className="w-7 h-7 text-secondary/20" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {/* Main title */}
          <h1 className="text-5xl md:text-7xl font-bold font-poppins text-foreground leading-tight">
            
            <span className="block text-transparent mt-7 bg-gradient-hero bg-clip-text">
              Your AI Health Assistant
            </span>
            <span className="text-5xl md:text-7xl font-bold font-poppins text-foreground leading-tight">
              On WhatsApp
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground font-inter max-w-2xl mx-auto leading-relaxed">
            Send your prescription. Get instant spoken guidance in your language.
            <span className="block mt-2 text-primary font-medium">
              Supporting all major Indian languages
            </span>
          </p>

          {/* WhatsApp CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button 
              onClick={handleWhatsAppClick}
              variant="whatsapp" 
              size="xl"
              className="group"
            >
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Start Chat with AI Doctor
            </Button>
            
            {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Free • Instant • Multilingual
            </div> */}
          </div>

          {/* Language indicators */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-xl md:text-2xl text-muted-foreground font-inter max-w-2xl mx-auto leading-relaxed mb-4">Available in</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'हिंदी',
                'English',
                'বাংলা',
                'தமிழ்',
                'తెలుగు',
                'ಕನ್ನಡ',
                'മലയാളം',
                'मराठी',
                'ગુજરાતી',
              ].map((lang, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent rounded-full text-accent-foreground text-sm font-medium border border-border/50"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <WhatsAppQRModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default HeroSection;