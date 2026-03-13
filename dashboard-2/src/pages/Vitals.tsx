import { useState, useEffect } from 'react';
import { Activity, BarChart3, TrendingUp, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { listVitals } from '@/lib/queries';
import Header from '@/components/Header';
import VitalsCard from '@/components/VitalsCard';
import VitalChart from '@/components/VitalChart';
import EmptyState from '@/components/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { isAuthorizedEmail } from '@/lib/auth';

const Vitals = () => {
  const { strings, lowDataMode } = useLanguage();
  const { user } = useAuth();
  const isAuthorized = isAuthorizedEmail(user?.email);
  const [allVitals, setAllVitals] = useState<any[]>([]);
  const [filteredVitals, setFilteredVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVital, setSelectedVital] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const uid = user?.uid || localStorage.getItem('demo-uid') || 'demo-uid';

  useEffect(() => {
    if (isAuthorized) {
      const fetchData = async () => {
        setLoading(true);
        const data = await listVitals(uid);
        setAllVitals(data);
        setFilteredVitals(data);
        setLoading(false);
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [uid, isAuthorized]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredVitals(allVitals);
    } else {
      setFilteredVitals(allVitals.filter((v) => v.type === activeTab));
    }
  }, [activeTab, allVitals]);

  const calculateTrend = (vitals: any[], type: string): 'up' | 'down' | 'stable' => {
    const typeVitals = vitals.filter(v => v.type === type);
    if (typeVitals.length < 2) return 'stable';
    
    const recent = typeVitals.slice(-3);
    const older = typeVitals.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    // Parse values for trend calculation
    const parseValue = (readingText: string, type: string): number | null => {
      if (!readingText) return null;
      const match = readingText.match(/(\d+\.?\d*)/);
      if (!match) return null;
      let value = parseFloat(match[1]);
      if (type === 'thermometer' && value > 50) {
        value = (value - 32) * 5/9;
      }
      return value;
    };
    
    const recentValues = recent.map(v => parseValue(v.readingText, type)).filter(v => v !== null);
    const olderValues = older.map(v => parseValue(v.readingText, type)).filter(v => v !== null);
    
    if (recentValues.length === 0 || olderValues.length === 0) return 'stable';
    
    const recentAvg = recentValues.reduce((sum, val) => sum + val!, 0) / recentValues.length;
    const olderAvg = olderValues.reduce((sum, val) => sum + val!, 0) / olderValues.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  };

  const calculateChange = (vitals: any[], type: string): number => {
    const typeVitals = vitals.filter(v => v.type === type);
    if (typeVitals.length < 2) return 0;
    
    const parseValue = (readingText: string, type: string): number | null => {
      if (!readingText) return null;
      const match = readingText.match(/(\d+\.?\d*)/);
      if (!match) return null;
      let value = parseFloat(match[1]);
      if (type === 'thermometer' && value > 50) {
        value = (value - 32) * 5/9;
      }
      return value;
    };
    
    const latest = parseValue(typeVitals[typeVitals.length - 1]?.readingText, type);
    const previous = parseValue(typeVitals[typeVitals.length - 2]?.readingText, type);
    
    if (latest === null || previous === null) return 0;
    return latest - previous;
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-lg">
              <strong>Access Denied</strong>
              <p className="mt-2">You do not have permission to view vitals. This feature is restricted to authorized users only.</p>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Health Vitals Dashboard
          </h1>
          <p className="text-muted-foreground">Track your health measurements and trends</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid bg-muted">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="thermometer">{strings.thermometer}</TabsTrigger>
            <TabsTrigger value="bp">{strings.bp}</TabsTrigger>
            <TabsTrigger value="glucometer">{strings.glucometer}</TabsTrigger>
            <TabsTrigger value="weight">{strings.weight}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
                  ))}
                </div>
              </div>
            ) : filteredVitals.length === 0 ? (
              <EmptyState
                icon={Activity}
                title={strings.empty}
                description="Upload vital readings via WhatsApp to see them here"
              />
            ) : (
              <div className="space-y-6">
                {/* Recent Readings Cards */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Readings
                  </h2>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {filteredVitals.slice(-8).map((vital) => (
                      <VitalsCard
                        key={vital.id}
                        imageUrl={vital.imageUrl}
                        type={vital.type}
                        readingText={vital.readingText}
                        capturedAt={vital.capturedAt}
                        onClick={() => setSelectedVital(vital)}
                        lowDataMode={lowDataMode}
                        trend={calculateTrend(allVitals, vital.type)}
                        change={calculateChange(allVitals, vital.type)}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Charts Section */}
                {activeTab === 'all' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Health Trends
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {['thermometer', 'bp', 'glucometer', 'weight'].map((type) => {
                        const typeVitals = allVitals.filter(v => v.type === type);
                        if (typeVitals.length === 0) return null;
                        
                        return (
                          <VitalChart
                            key={type}
                            vitals={typeVitals}
                            type={type}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Individual Chart for Selected Type */}
                {activeTab !== 'all' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      {strings[activeTab as keyof typeof strings]} Trends
                    </h2>
                    <VitalChart
                      vitals={filteredVitals}
                      type={activeTab}
                      className="max-w-4xl"
                    />
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Vital Detail Dialog */}
      <Dialog open={!!selectedVital} onOpenChange={() => setSelectedVital(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {selectedVital?.type && strings[selectedVital.type as keyof typeof strings]}
            </DialogTitle>
          </DialogHeader>

          {selectedVital && (
            <div className="space-y-6">
              {/* Reading Details */}
              <div className="text-center py-6 bg-muted/50 rounded-lg">
                <p className="text-4xl font-bold text-primary mb-2">
                  {selectedVital.readingText}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedVital.capturedAt).toLocaleString()}
                </p>
              </div>

              {/* Trend Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Trend</h3>
                  <p className={`text-sm ${
                    calculateTrend(allVitals, selectedVital.type) === 'up' ? 'text-red-500' :
                    calculateTrend(allVitals, selectedVital.type) === 'down' ? 'text-green-500' :
                    'text-gray-500'
                  }`}>
                    {calculateTrend(allVitals, selectedVital.type) === 'up' ? 'Trending Up' :
                     calculateTrend(allVitals, selectedVital.type) === 'down' ? 'Trending Down' :
                     'Stable'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Change</h3>
                  <p className={`text-sm ${
                    calculateChange(allVitals, selectedVital.type) > 0 ? 'text-red-500' :
                    calculateChange(allVitals, selectedVital.type) < 0 ? 'text-green-500' :
                    'text-gray-500'
                  }`}>
                    {calculateChange(allVitals, selectedVital.type) > 0 ? '+' : ''}
                    {calculateChange(allVitals, selectedVital.type).toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="h-48">
                <VitalChart
                  vitals={allVitals.filter(v => v.type === selectedVital.type)}
                  type={selectedVital.type}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedVital(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vitals;
