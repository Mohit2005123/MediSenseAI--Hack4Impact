import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardMetricProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
}

const CardMetric = ({ icon: Icon, label, value, className = '' }: CardMetricProps) => {
  return (
    <Card className={`glass-card p-5 flex items-center gap-4 shadow-premium hover:shadow-glow transition-all duration-300 border-2 border-white/50 overflow-hidden group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <motion.div 
        whileHover={{ scale: 1.15, rotate: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="p-4 bg-gradient-to-br from-primary to-primary-dark rounded-2xl text-white shadow-lg relative z-10"
      >
        <Icon className="h-6 w-6" />
      </motion.div>
      
      <div className="relative z-10">
        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {value}
        </p>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      </div>
    </Card>
  );
};

export default CardMetric;
