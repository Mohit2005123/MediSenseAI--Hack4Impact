import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Clock, Globe } from "lucide-react";
import WhatsAppQRModal from "@/components/WhatsAppQRModal";

const CTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    { icon: Shield, text: "100% Secure" },
    { icon: Clock, text: "24/7 Available" },
    { icon: Globe, text: "8+ Languages" },
    { icon: MessageCircle, text: "Instant Response" }
  ];

  const handleWhatsAppClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl font-bold font-poppins text-white leading-tight">
            Start Your Health Journey
            <span className="block text-white/90">with AI Doctor</span>
          </h2>
          
          {/* Subtext */}
          <p className="text-xl md:text-2xl text-white/80 font-inter max-w-2xl mx-auto leading-relaxed">
            Join thousands of Indians getting personalized health guidance 
            in their preferred language
          </p>

          {/* Features grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto my-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium font-inter">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Main CTA */}
          <div className="space-y-6">
            <Button 
              onClick={handleWhatsAppClick}
              size="xl"
              className="bg-white text-primary hover:bg-white/90 shadow-glow font-semibold text-lg px-12 py-4 h-auto group transform hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start WhatsApp Chat with AI Doctor
            </Button>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/70 text-sm font-inter">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white/70 rounded-full"></span>
                No registration required
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white/70 rounded-full"></span>
                Completely free to use
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white/70 rounded-full"></span>
                HIPAA compliant
              </div>
            </div>
          </div>

          {/* Quote in multiple languages */}
          <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <blockquote className="text-white/90 font-inter text-lg italic mb-4">
                "स्वास्थ्य सेवा हर भाषा में, हर व्यक्ति के लिए"
              </blockquote>
              <p className="text-white/70 text-sm">
                Healthcare in every language, for every person
              </p>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppQRModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default CTASection;