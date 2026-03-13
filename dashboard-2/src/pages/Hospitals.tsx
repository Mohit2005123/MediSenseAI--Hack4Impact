import { useState, useEffect } from 'react';
import { MapPin, Navigation, List } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getNearbyHospitals } from '@/lib/queries';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import MapClient from '@/components/MapClient';
import HospitalDetailsModal from '@/components/HospitalDetailsModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Hospitals = () => {
  const { strings, lowDataMode, language } = useLanguage();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Try to get user location automatically on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      if (!navigator.geolocation) {
        // Fallback to default location
        loadDefaultHospitals();
        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Auto-location obtained:', position.coords);
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);

          try {
            toast.info('Searching for nearby hospitals...');
            const data = await getNearbyHospitals(location.lat, location.lng, language);
            setHospitals(data);
            setMapLoaded(true);

            if (data.length > 0 && data[0].real) {
              toast.success(`Found ${data.length} hospitals near you!`);
            } else {
              toast.success('Location found! Showing sample hospitals.');
            }
          } catch (error) {
            console.error('Error fetching hospitals:', error);
            toast.error('Error loading hospitals, using default data');
            loadDefaultHospitals();
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.log('Auto-location failed, using default:', error);
          let errorMessage = 'Location access denied. Using default location.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Using default location.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable. Using default location.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Using default location.';
              break;
          }

          toast.error(errorMessage);
          loadDefaultHospitals();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    };

    const loadDefaultHospitals = async () => {
      const defaultLocation = { lat: 28.6139, lng: 77.2090 };
      setUserLocation(defaultLocation);
      try {
        const data = await getNearbyHospitals(defaultLocation.lat, defaultLocation.lng, language);
        setHospitals(data);
        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading default hospitals:', error);
      }
    };

    initializeLocation();
  }, [language]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }

    setLoading(true);
    console.log('Requesting user location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Location obtained:', position.coords);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);

        try {
          toast.info('Searching for nearby hospitals...');
          // Fetch hospitals
          const data = await getNearbyHospitals(location.lat, location.lng, language);
          console.log('Hospitals loaded:', data);
          setHospitals(data);
          setMapLoaded(true);

          if (data.length > 0 && data[0].real) {
            toast.success(`Found ${data.length} hospitals near you!`);
          } else {
            toast.success('Location found! Showing sample hospitals.');
          }
        } catch (error) {
          console.error('Error fetching hospitals:', error);
          toast.error('Error loading hospitals');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Could not get your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Using default location.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Using default location.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Using default location.';
            break;
        }

        toast.error(errorMessage);

        // Load default hospitals anyway
        const defaultLocation = { lat: 28.6139, lng: 77.2090 };
        setUserLocation(defaultLocation);
        getNearbyHospitals(defaultLocation.lat, defaultLocation.lng, language)
          .then(data => {
            console.log('Default hospitals loaded:', data);
            setHospitals(data);
            setMapLoaded(true);
          })
          .catch(err => console.error('Error loading default hospitals:', err));

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleHospitalClick = (hospital: any) => {
    setSelectedHospital(hospital);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHospital(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {strings.nearbyHospitals}
          </h1>
          <p className="text-muted-foreground">{strings.findHospitals}</p>
        </div>

        {!mapLoaded ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <MapPin className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {strings.findHospitals}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Click the button below to find hospitals near you
            </p>
            <Button
              size="lg"
              onClick={requestLocation}
              disabled={loading}
              className="gap-2"
            >
              <Navigation className="h-5 w-5" />
              {loading ? 'Getting Location...' : strings.useMyLocation}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Map */}
            {!lowDataMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MapClient
                  hospitals={hospitals}
                  userLocation={userLocation}
                  lowDataMode={lowDataMode}
                  strings={strings}
                  onHospitalClick={handleHospitalClick}
                />
              </motion.div>
            )}

            {/* Hospital List */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <List className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  {hospitals.length} {strings.hospitals}
                </h2>
                {hospitals.length > 0 && hospitals[0].real && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    📍 Real-time data
                  </span>
                )}
              </div>

              {hospitals.length === 0 ? (
                <EmptyState
                  icon={MapPin}
                  title={strings.noHospitalsFound}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hospitals.map((hospital) => (
                    <motion.div
                      key={hospital.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary/40 hover:bg-primary/5 group"
                        onClick={() => handleHospitalClick(hospital)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {hospital.nameKey ? strings[hospital.nameKey as keyof typeof strings] : hospital.name || 'Hospital'}
                            </h3>
                            {(hospital.addressKey || hospital.address) && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {hospital.addressKey ? strings[hospital.addressKey as keyof typeof strings] : hospital.address}
                              </p>
                            )}
                            {hospital.phone && (
                              <p className="text-xs text-muted-foreground mb-1">
                                📞 {hospital.phone}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {hospital.distanceKm} km {strings.distance}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {strings.clickForDetails} →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Hospital Details Modal */}
      <HospitalDetailsModal
        hospital={selectedHospital}
        isOpen={isModalOpen}
        onClose={closeModal}
        strings={strings}
      />
    </div>
  );
};

export default Hospitals;
