import { Calendar, Activity, Thermometer, Heart, Droplet, Weight, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface VitalsCardProps {
  imageUrl: string;
  type: string;
  readingText?: string;
  capturedAt: Date;
  onClick: () => void;
  lowDataMode?: boolean;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

const getVitalIcon = (type: string) => {
  switch (type) {
    case 'thermometer':
      return Thermometer;
    case 'bp':
      return Heart;
    case 'glucometer':
      return Droplet;
    case 'weight':
      return Weight;
    default:
      return Activity;
  }
};

const getVitalUnit = (type: string) => {
  switch (type) {
    case 'thermometer':
      return '°C';
    case 'bp':
      return 'mmHg';
    case 'glucometer':
      return 'mg/dL';
    case 'weight':
      return 'kg';
    default:
      return '';
  }
};

const parseVitalValue = (readingText: string, type: string): number | null => {
  if (!readingText) return null;
  
  // Extract numeric value from reading text
  const match = readingText.match(/(\d+\.?\d*)/);
  if (!match) return null;
  
  let value = parseFloat(match[1]);
  
  // Convert temperature from Fahrenheit to Celsius if needed
  if (type === 'thermometer' && value > 50) {
    value = (value - 32) * 5/9;
  }
  
  return value;
};

const VitalsCard = ({
  imageUrl,
  type,
  readingText,
  capturedAt,
  onClick,
  lowDataMode,
  trend = 'stable',
  change = 0
}: VitalsCardProps) => {
  const Icon = getVitalIcon(type);
  const unit = getVitalUnit(type);
  const value = parseVitalValue(readingText || '', type);
  
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: lowDataMode ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs capitalize">
                {type}
              </Badge>
            </div>
            {TrendIcon && (
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            )}
          </div>
          
          <div className="mb-3">
            {value !== null ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {value.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">{unit}</span>
                {change !== 0 && (
                  <Badge variant="outline" className={`text-xs ${trendColor}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)}
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-lg font-semibold text-foreground">
                {readingText}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(capturedAt, 'dd MMM yyyy, HH:mm')}</span>
          </div>
          
          {trend !== 'stable' && (
            <div className="mt-2 pt-2 border-t border-muted">
              <p className={`text-xs ${trendColor}`}>
                {trend === 'up' ? 'Trending up' : 'Trending down'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default VitalsCard;
