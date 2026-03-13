import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Thermometer, Heart, Droplet, Weight, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface VitalData {
  id: string;
  type: string;
  readingText: string;
  capturedAt: Date | string;
  value?: number;
}

interface VitalChartProps {
  vitals: VitalData[];
  type: string;
  className?: string;
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
      return Thermometer;
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

const calculateTrend = (data: any[]): 'up' | 'down' | 'stable' => {
  if (data.length < 2) return 'stable';
  
  const recent = data.slice(-3);
  const older = data.slice(-6, -3);
  
  if (recent.length === 0 || older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
  const olderAvg = older.reduce((sum, item) => sum + item.value, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'stable';
};

const VitalChart = ({ vitals, type, className = '' }: VitalChartProps) => {
  const Icon = getVitalIcon(type);
  const unit = getVitalUnit(type);
  
  // Process data for chart
  const chartData = vitals
    .map(vital => ({
      ...vital,
      value: parseVitalValue(vital.readingText, type),
      date: format(vital.capturedAt instanceof Date ? vital.capturedAt : new Date(vital.capturedAt), 'MMM dd'),
      fullDate: vital.capturedAt instanceof Date ? vital.capturedAt : new Date(vital.capturedAt)
    }))
    .filter(item => item.value !== null)
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())
    .slice(-10); // Show last 10 readings

  const trend = calculateTrend(chartData);
  const latestValue = chartData[chartData.length - 1]?.value;
  const previousValue = chartData[chartData.length - 2]?.value;
  const change = latestValue && previousValue ? latestValue - previousValue : 0;

  // Calculate proper domain for Y-axis
  const values = chartData.map(d => d.value).filter(v => v !== null) as number[];
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1; // 10% padding
  const yDomain = [Math.max(0, minValue - padding), maxValue + padding];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500';

  if (chartData.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold capitalize">{type}</h3>
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        </div>
        <div className="h-32 flex items-center justify-center text-muted-foreground">
          <p>No readings to display</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold capitalize">{type}</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{latestValue?.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
              {change !== 0 && (
                <Badge variant="outline" className={`text-xs ${trendColor}`}>
                  {change > 0 ? '+' : ''}{change.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {TrendIcon && (
          <TrendIcon className={`h-5 w-5 ${trendColor}`} />
        )}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'weight' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={yDomain}
                tickFormatter={(value) => `${value.toFixed(1)}`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">
                          {payload[0].value?.toFixed(1)} {unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={yDomain}
                tickFormatter={(value) => `${value.toFixed(1)}`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">
                          {payload[0].value?.toFixed(1)} {unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {chartData.length > 1 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Last {chartData.length} readings</span>
            <span className={trendColor}>
              {trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : 'Stable'}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VitalChart;
