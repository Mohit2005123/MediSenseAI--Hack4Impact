import { Calendar, FileText, Pill, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface PrescriptionCardProps {
  imageUrl: string;
  summaryText: string;
  createdAt: Date;
  language: string;
  onClick: () => void;
  lowDataMode?: boolean;
  dosagePlan?: Array<{
    med: string;
    dose: string;
    freq: string;
    duration: string;
  }>;
}

const PrescriptionCard = ({
  imageUrl,
  summaryText,
  createdAt,
  language,
  onClick,
  lowDataMode,
  dosagePlan = []
}: PrescriptionCardProps) => {
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
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <Badge variant="secondary" className="text-xs">
              {language.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Pill className="h-3 w-3" />
              <span>{dosagePlan.length} medicines</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2">
            {summaryText}
          </h3>
          
          {dosagePlan.length > 0 && (
            <div className="space-y-2 mb-3">
              {dosagePlan.slice(0, 2).map((medicine, idx) => (
                <div key={idx} className="bg-muted/50 p-2 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Pill className="h-3 w-3 text-primary" />
                    <span className="font-medium text-xs text-foreground">
                      {medicine.med}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{medicine.freq}</span>
                    <span>•</span>
                    <span>{medicine.duration}</span>
                  </div>
                </div>
              ))}
              {dosagePlan.length > 2 && (
                <div className="text-xs text-muted-foreground text-center py-1">
                  +{dosagePlan.length - 2} more medicines
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(createdAt, 'dd MMM yyyy')}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PrescriptionCard;
