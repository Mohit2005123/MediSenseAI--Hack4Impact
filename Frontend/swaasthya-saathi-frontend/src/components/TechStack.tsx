import { Brain, MessageSquare, Mic, Smartphone } from "lucide-react";

const TechStack = () => {
  const technologies =[
    {
      icon: Brain,
      name: "LLaMA-4-Scout",
      description: "Advanced OCR & Medical Text Summarization",
      feature: "Prescription Analysis",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: MessageSquare,
      name: "II-Medical-8B-1706",
      description: "Answers health questions with clinical reasoning",
      feature: "Health Guidance",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Mic,
      name: "Sarvam AI",
      description: "Handles Speech-to-Text (ASR) and Text-to-Speech",
      feature: "Voice in Your Language",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Smartphone,
      name: "Twilio API",
      description: "Enables WhatsApp messaging and voice interaction",
      feature: "Chat Interface",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ]
  

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-foreground mb-6">
            Powered by Advanced AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Our technology stack combines cutting-edge AI models to deliver accurate, 
            multilingual health assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className="group relative animate-fade-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-card rounded-2xl p-8 shadow-medical border border-border/50 hover:shadow-glow transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${tech.color} ${tech.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold font-poppins text-foreground mb-2">
                        {tech.name}
                      </h3>
                      <p className="text-muted-foreground font-inter">
                        {tech.description}
                      </p>
                    </div>
                    
                    {/* Feature badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tech.color} ${tech.bgColor}`}>
                      {tech.feature}
                    </div>
                  </div>

                  {/* Decorative gradient border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="bg-accent rounded-2xl p-8 max-w-4xl mx-auto border border-border/50">
            <h3 className="text-2xl font-semibold font-poppins text-foreground mb-4">
              ASHA Saathi: 1-Click Health Summary Generator
            </h3>
            <p className="text-muted-foreground font-inter leading-relaxed">
              ASHA workers often juggle multiple apps and complex reports, slowing down frontline care.
              Our solution simplifies this by scanning medical reports using OCR and fusing data from mock government APIs, then generating an easy-to-understand audio summary in the local language with clear action points.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TechStack;