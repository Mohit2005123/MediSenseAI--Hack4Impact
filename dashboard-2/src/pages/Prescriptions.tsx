import { useState, useEffect } from 'react';
import { FileText, Download, X, Pill, Clock, Calendar, AlertCircle, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { listPrescriptions } from '@/lib/queries';
import Header from '@/components/Header';
import PrescriptionCard from '@/components/PrescriptionCard';
import EmptyState from '@/components/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { isAuthorizedEmail } from '@/lib/auth';

const Prescriptions = () => {
  const { strings, lowDataMode } = useLanguage();
  const { user } = useAuth();
  const isAuthorized = isAuthorizedEmail(user?.email);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);
  const uid = user?.uid || localStorage.getItem('demo-uid') || 'demo-uid';

  useEffect(() => {
    if (isAuthorized) {
      const fetchData = async () => {
        setLoading(true);
        const data = await listPrescriptions(uid);
        setPrescriptions(data);
        setLoading(false);
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [uid, isAuthorized]);

  const handleDownload = (imageUrl: string) => {
    // In production, this would download the actual image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'prescription.jpg';
    link.click();
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
              <p className="mt-2">You do not have permission to view prescriptions. This feature is restricted to authorized users only.</p>
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
            {strings.prescriptionHistory}
          </h1>
          <p className="text-muted-foreground">{strings.viewAll}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={strings.empty}
            description="Upload prescriptions via WhatsApp to see them here"
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                imageUrl={prescription.imageUrl}
                summaryText={prescription.summaryText}
                createdAt={prescription.createdAt}
                language={prescription.language}
                onClick={() => setSelectedPrescription(prescription)}
                lowDataMode={lowDataMode}
                dosagePlan={prescription.dosagePlan}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* Prescription Detail Dialog */}
      <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Prescription Details
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedPrescription?.language?.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Pill className="h-3 w-3" />
                  {selectedPrescription?.dosagePlan?.length || 0} medicines
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {selectedPrescription && (
            <div className="space-y-6">
              {/* Prescription Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Prescription Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{selectedPrescription.summaryText}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Prescribed on {selectedPrescription.createdAt.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Medicine Details */}
              {selectedPrescription.dosagePlan && selectedPrescription.dosagePlan.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Medicine Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {selectedPrescription.dosagePlan.map((medicine: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Pill className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg text-foreground">
                                  {medicine.med}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {medicine.dose}
                                </p>
                              </div>
                            </div>
                            {medicine.duration === 'Ongoing' && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Ongoing
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Frequency</p>
                                <p className="text-sm text-muted-foreground">{medicine.freq}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Duration</p>
                                <p className="text-sm text-muted-foreground">{medicine.duration}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleDownload(selectedPrescription.imageUrl)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Prescription
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPrescription(null)}
                >
                  <X className="h-4 w-4 mr-2" />
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

export default Prescriptions;
