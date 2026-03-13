import { Camera, Brain, Globe, Volume2, MessageCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Variants, easeOut } from "framer-motion";

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.18,    // controls sequential timing of cards
      delayChildren: 0.1,
    },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
};

const headerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

const ctaItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut, delay: 0.2 },
  },
};

const UserJourney = () => {
  const steps = [
    { icon: Camera,       title: "Upload Prescription", description: "Take a photo of your prescription or medical document", color: "text-primary" },
    { icon: Brain,        title: "AI Analysis",         description: "Our AI reads and summarizes key medical instructions", color: "text-secondary" },
    { icon: Globe,        title: "Choose Language",     description: "Select your preferred Indian language for the response", color: "text-primary" },
    { icon: Volume2,      title: "Audio Response",      description: "Get spoken guidance in your chosen language",          color: "text-secondary" },
    { icon: MessageCircle, title: "Ask by Voice",       description: "Ask follow-up questions using your voice in your regional language", color: "text-primary" },
    { icon: Monitor,      title: "Web App Option",      description: "Also available on our comprehensive web platform",    color: "text-secondary" },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold font-poppins text-foreground mb-6"
            variants={headerItem}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-inter"
            variants={headerItem}
          >
            Simple steps to get personalized health guidance in your language
          </motion.p>
        </motion.div>

        {/* Steps Grid (staggered) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={cardItem}
                className="relative group hover:scale-105 transition-all duration-300"
              >
                <div className="bg-card rounded-2xl p-8 shadow-medical border border-border/50 hover:shadow-glow transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.color} bg-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold font-poppins text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground font-inter leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={ctaItem}>
            <Button
              onClick={() => window.open('https://wa.me/14155238886?text=join%20from-are', '_blank')}
              variant="hero"
              size="xl"
              className="group"
            >
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Try It Now - It's Free!
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default UserJourney;
