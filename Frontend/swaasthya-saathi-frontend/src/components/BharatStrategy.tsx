"use client";
import React, { useEffect, useId, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";
import { Languages, Volume2, Users } from "lucide-react";
import indiaBackground from "@/assets/india-medical-bg.jpg";

/* ------------------------- Cover / Beam / CircleIcon ------------------------- */

export const Cover = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState<number[]>([]);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current?.clientWidth ?? 0);

      const height = ref.current?.clientHeight ?? 0;
      const numberOfBeams = Math.floor(height / 10);
      const positions = Array.from(
        { length: numberOfBeams },
        (_, i) => (i + 1) * (height / (numberOfBeams + 1))
      );
      setBeamPositions(positions);
    }
  }, [ref.current]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className={cn(
        "relative group/cover inline-block rounded-sm bg-neutral-100 px-2 py-2 transition duration-200 hover:bg-neutral-900 dark:bg-neutral-900",
        className
      )}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 h-full w-full overflow-hidden"
          >
            <motion.div
              animate={{ translateX: ["-50%", "0%"] }}
              transition={{
                translateX: { duration: 10, ease: "linear", repeat: Infinity },
              }}
              className="flex h-full w-[200%]"
            >
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="h-full w-full"
                particleColor="#FFFFFF"
              />
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="h-full w-full"
                particleColor="#FFFFFF"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {beamPositions.map((position, index) => (
        <Beam
          key={index}
          hovered={hovered}
          duration={Math.random() * 2 + 1}
          delay={Math.random() * 2 + 1}
          width={containerWidth}
          style={{ top: `${position}px` }}
        />
      ))}

      <motion.span
        key={String(hovered)}
        animate={{
          scale: hovered ? 0.8 : 1,
          x: hovered ? [0, -30, 30, -30, 30, 0] : 0,
          y: hovered ? [0, 30, -30, 30, -30, 0] : 0,
        }}
        exit={{ filter: "none", scale: 1, x: 0, y: 0 }}
        transition={{
          duration: 0.2,
          x: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
          y: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
          scale: { duration: 0.2 },
          filter: { duration: 0.2 },
        }}
        className={cn(
          "relative z-20 inline-block text-neutral-900 transition duration-200 group-hover/cover:text-white dark:text-white",
          className
        )}
      >
        {children}
      </motion.span>

      <CircleIcon className="absolute -right-[2px] -top-[2px]" />
      <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
      <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
      <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
    </div>
  );
};

export const Beam = ({
  className,
  delay,
  duration,
  hovered,
  width = 600,
  ...svgProps
}: {
  className?: string;
  delay?: number;
  duration?: number;
  hovered?: boolean;
  width?: number;
} & React.ComponentProps<typeof motion.svg>) => {
  const id = useId();

  return (
    <motion.svg
      width={width ?? "600"}
      height="1"
      viewBox={`0 0 ${width ?? "600"} 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-x-0 w-full", className)}
      {...svgProps}
    >
      <motion.path d={`M0 0.5H${width ?? "600"}`} stroke={`url(#svgGradient-${id})`} />
      <defs>
        <motion.linearGradient
          id={`svgGradient-${id}`}
          key={String(hovered)}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: hovered ? "-10%" : "-5%", y1: 0, y2: 0 }}
          animate={{ x1: "110%", x2: hovered ? "100%" : "105%", y1: 0, y2: 0 }}
          transition={{
            duration: hovered ? 0.5 : duration ?? 2,
            ease: "linear",
            repeat: Infinity,
            delay: hovered ? Math.random() * (1 - 0.2) + 0.2 : 0,
            repeatDelay: hovered ? Math.random() * (2 - 1) + 1 : delay ?? 1,
          }}
        >
          <stop stopColor="#2EB9DF" stopOpacity="0" />
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

export const CircleIcon = ({
  className,
  delay,
}: {
  className?: string;
  delay?: number;
}) => {
  return (
    <div
      className={cn(
        "group pointer-events-none h-2 w-2 rounded-full bg-neutral-600 opacity-20 animate-pulse group-hover/cover:hidden group-hover/cover:opacity-100 dark:bg-white group-hover/cover:bg-white",
        className
      )}
      style={{ animationDelay: delay ? `${delay}s` : undefined }}
    />
  );
};

/* ------------------------------- BharatStrategy ------------------------------ */

const BharatStrategy = () => {
 

  return (
    <section
      className="relative overflow-hidden py-20"
      style={{
        backgroundImage: `url(${indiaBackground ?? indiaBackground as unknown as string})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/95" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Heading with Cover effect on “Bharat-First” */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-foreground mb-6">
            <Cover className="align-middle">
              <span className="bg-gradient-hero bg-clip-text text-transparent">Bharat-First</span>
            </Cover>{" "}
            Strategy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Breaking language barriers in healthcare with intelligent code-switching
            and native language understanding
          </p>
        </div>

        {/* Main flow diagram */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1: User Input */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                1
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-8 text-center shadow-medical">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Languages className="h-8 w-8" />
                </div>
                <h3 className="font-poppins mb-4 text-xl font-semibold text-foreground">Your Input</h3>
                <p className="font-inter mb-4 text-muted-foreground">Speak or type in any Indian language or Hinglish</p>
                <div className="bg-accent text-accent-foreground rounded-lg p-3 text-sm font-medium">
                  "Doctor sahib, पेट में दर्द है"
                </div>
              </div>
            </div>

            {/* Step 2: Language Mapping */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                2
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-8 text-center shadow-medical">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
                  <Languages className="h-8 w-8" />
                </div>
                <h3 className="font-poppins mb-4 text-xl font-semibold text-foreground">Language Mapping</h3>
                <p className="font-inter mb-4 text-muted-foreground">
                  Translating Hinglish/native input to English for precision
                </p>
                <div className="bg-accent text-accent-foreground rounded-lg p-3 text-sm font-medium">
                  "I have stomach pain"
                </div>
              </div>
            </div>

            {/* Step 3: AI Processing */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                3
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-8 text-center shadow-medical">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-poppins mb-4 text-xl font-semibold text-foreground">AI Processing</h3>
                <p className="font-inter mb-4 text-muted-foreground">
                  Understanding context in English for medical accuracy
                </p>
                <div className="bg-accent text-accent-foreground rounded-lg p-3 text-sm font-medium">
                  Medical Analysis ⚡ Context Understanding
                </div>
              </div>
            </div>

            {/* Step 4: Audio Response */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                4
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-8 text-center shadow-medical">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Volume2 className="h-8 w-8" />
                </div>
                <h3 className="font-poppins mb-4 text-xl font-semibold text-foreground">Audio Response</h3>
                <p className="font-inter mb-4 text-muted-foreground">
                  Clear guidance in your preferred language with voice
                </p>
                <div className="bg-accent text-accent-foreground rounded-lg p-3 text-sm font-medium">
                  🔊 "पेट दर्द के लिए यह दवा..."
                </div>
              </div>
            </div>
          </div>
        </div>
{/* 
        Language examples
        <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
          <h3 className="text-center text-foreground mb-8 font-poppins text-2xl font-semibold">
            Natural Conversation Examples
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {languages.map((lang, index) => (
              <div
                key={index}
                className="bg-card hover:shadow-glow border border-border/50 rounded-xl p-6 shadow-medical transition-all duration-300"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {lang.name}
                  </span>
                </div>
                <p className="font-inter text-sm leading-relaxed text-foreground">"{lang.example}"</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Accessibility note */}
        <div className="animate-fade-in-up mt-16 text-center" style={{ animationDelay: "1.4s" }}>
          <div className="bg-gradient-subtle border border-border/50 mx-auto max-w-4xl rounded-2xl p-8">
            <h3 className="font-poppins mb-4 text-2xl font-semibold text-foreground">🇮🇳 Accessibility for Every Indian</h3>
            <p className="font-inter leading-relaxed text-muted-foreground">
              Supporting 8+ major Indian languages with code-switching capabilities, ensuring healthcare
              guidance is accessible to everyone, regardless of their linguistic preference or literacy level.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BharatStrategy;
