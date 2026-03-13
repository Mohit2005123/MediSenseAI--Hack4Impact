import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Activity, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { listPrescriptions, listVitals } from '@/lib/queries';
import Header from '@/components/Header';
import CardMetric from '@/components/CardMetric';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-health.jpg';
import prescriptionIcon from '@/assets/prescription-icon.jpg';
import hospitalIcon from '@/assets/hospital-icon.jpg';
import vitalsIcon from '@/assets/vitals-icon.jpg';
import { isAuthorizedEmail } from '@/lib/auth';

const Index = () => {
  const { strings } = useLanguage();
  const { user } = useAuth();
  const isAuthorized = isAuthorizedEmail(user?.email);
  const [stats, setStats] = useState({
    prescriptions: 0,
    vitals: 0,
  });
  const uid = user?.uid || localStorage.getItem('demo-uid') || 'demo-uid';

  useEffect(() => {
    if (isAuthorized) {
      const fetchStats = async () => {
        const [prescriptions, vitals] = await Promise.all([
          listPrescriptions(uid),
          listVitals(uid),
        ]);
        setStats({
          prescriptions: prescriptions.length,
          vitals: vitals.length,
        });
      };
      fetchStats();
    }
  }, [uid, isAuthorized]);

  const features = [
    ...(isAuthorized ? [{
      title: strings.prescriptionHistory,
      icon: prescriptionIcon,
      path: '/prescriptions',
      description: 'View all your medical prescriptions',
      color: 'from-blue-500 to-cyan-500',
    }] : []),
    {
      title: strings.nearbyHospitals,
      icon: hospitalIcon,
      path: '/hospitals',
      description: 'Find hospitals and clinics near you',
      color: 'from-green-500 to-emerald-500',
    },
    ...(isAuthorized ? [{
      title: strings.vitalsPhotos,
      icon: vitalsIcon,
      path: '/vitals',
      description: 'Track your health measurements',
      color: 'from-purple-500 to-pink-500',
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-accent-light/10">
      <Header />

      <main>
        {/* Hero Section - Premium Design */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-accent/90 to-secondary/95 z-0">
            <img src={heroImage} alt="Healthcare" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          </div>

          <div className="relative z-10 container px-4 py-20 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="text-white"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6"
                >
                  <Heart className="w-4 h-4" fill="currentColor" />
                  <span className="text-sm font-medium">Digital Health Companion</span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
                  {strings.title}
                </h1>
                <p className="text-2xl md:text-3xl mb-10 opacity-95 font-light">
                  {strings.subtitle}
                </p>

                {/* Stats */}
                {isAuthorized && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="glass-card p-5 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl">
                          <FileText className="w-6 h-6 text-gray-800" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-gray-800">{stats.prescriptions}</p>
                          <p className="text-sm text-gray-700 font-medium">{strings.totalPrescriptions}</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-card p-5 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl">
                          <Activity className="w-6 h-6 text-gray-800" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-gray-800">18</p>
                          <p className="text-sm text-gray-700 font-medium">{strings.recentVitals}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="glass-card p-8 rounded-3xl border-2 border-white/30 shadow-2xl">
                  <img
                    src={heroImage}
                    alt="Healthcare Dashboard"
                    className="rounded-2xl w-full shadow-xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />
        </section>

        {/* Features Grid - Enhanced Premium Design */}
        <section className="container px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              <span className="gradient-text">Explore Your Health Dashboard</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Access all your health information in one secure, easy-to-use platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <Link to={feature.path} className="block h-full">
                  <Card className="overflow-hidden group cursor-pointer h-full border-2 hover:border-primary/40 transition-all duration-300 shadow-premium hover:shadow-glow bg-gradient-to-br from-card to-primary-light/5">
                    <div className={`h-56 bg-gradient-to-br ${feature.color} p-8 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className="w-40 h-40 object-cover rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10 border-4 border-white/20"
                      />
                    </div>
                    <div className="p-8 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />

                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors relative z-10">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                        {feature.description}
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-primary-dark text-white shadow-md group-hover:shadow-xl transition-all duration-300 py-6 text-base font-semibold"
                      >
                        {strings.view}
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          →
                        </motion.span>
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action - Premium */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          <div className="container px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-white"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block mb-8"
              >
                <div className="p-6 bg-white/20 backdrop-blur-sm rounded-full">
                  <Heart className="h-20 w-20" fill="currentColor" />
                </div>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
                Your Health, Our Priority
              </h2>
              <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
                Connect with Swaasthya Saathi on WhatsApp to upload prescriptions and vitals instantly
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-glow transition-all duration-300 text-lg px-12 py-7 font-semibold"
              >
                <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                Connect on WhatsApp
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
