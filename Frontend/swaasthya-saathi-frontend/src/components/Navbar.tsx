import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  HeartPulse,
  Stethoscope,
  Cpu,
  Languages,
  MessageCircle,
  Rocket,
  Phone,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", id: "hero", icon: Rocket },
    { name: "How it Works", id: "journey", icon: Stethoscope },
    { name: "Technology", id: "tech", icon: Cpu },
    { name: "Languages", id: "bharat", icon: Languages },
    { name: "Get Started", id: "cta", icon: MessageCircle },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/60 backdrop-blur-md border-b border-border/50"
          : "bg-green-400"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            aria-label="Go to Home"
            onClick={() => scrollToSection("hero")}
            className="group flex items-center gap-3 cursor-pointer"
          >
            {/* Animated heart pulse icon */}
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-sm">
              <HeartPulse className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse" />
            </span>

            <div className="flex flex-col items-start leading-none">
              <span className="text-xl font-bold font-poppins text-foreground">
                <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-black">
                  Swaasthya Saathi
                </span>
              </span>

              {/* Creative pill under/near the brand */}
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Stethoscope className="h-3 w-3" />
                AI Doctor
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
              >
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </button>
            ))}

            {/* Desktop CTA: WhatsApp */}
            
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="flex w-full items-center gap-3 text-left px-3 py-2 text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </button>
              ))}

              <Button
                onClick={() =>
                  window.open(
                    "https://wa.me/14155238886?text=join%20from-are",
                    "_blank"
                  )
                }
                variant="secondary"
                className="mt-2 w-full"
              >
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp: Try Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
