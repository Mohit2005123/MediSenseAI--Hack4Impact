import { useState, useEffect } from 'react';
import { MapPin, Phone, Globe, Navigation, Clock, Star, Mail, Star as StarIcon, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { enhanceHospitalWithDetails } from '@/lib/hospitalScraper';

interface Hospital {
    id: string;
    name?: string;
    nameKey?: string;
    originalName?: string;
    lat: number;
    lng: number;
    address?: string;
    addressKey?: string;
    originalAddress?: string;
    distanceKm: number;
    phone?: string;
    website?: string;
    email?: string;
    description?: string;
    specialties?: string[];
    services?: string[];
    timings?: string;
    real?: boolean;
    emergency?: string | boolean;
    openingHours?: string;
    healthcare?: string;
    operator?: string;
    amenity?: string;
    originalAmenity?: string;
    rating?: number;
    reviews?: number;
}

interface HospitalDetailsModalProps {
    hospital: Hospital | null;
    isOpen: boolean;
    onClose: () => void;
    strings: any;
}

const HospitalDetailsModal = ({ hospital, isOpen, onClose, strings }: HospitalDetailsModalProps) => {
    const [isNavigating, setIsNavigating] = useState(false);
    const [enhancedHospital, setEnhancedHospital] = useState<Hospital | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (hospital && isOpen) {
            setLoadingDetails(true);
            enhanceHospitalWithDetails(hospital).then(enhanced => {
                setEnhancedHospital(enhanced);
                setLoadingDetails(false);
            }).catch(() => {
                setEnhancedHospital(hospital);
                setLoadingDetails(false);
            });
        }
    }, [hospital, isOpen]);

    if (!hospital) return null;

    const displayHospital = enhancedHospital || hospital;

    const hospitalName = displayHospital.nameKey
        ? strings[displayHospital.nameKey as keyof typeof strings]
        : displayHospital.name || 'Hospital';

    const hospitalAddress = displayHospital.addressKey
        ? strings[displayHospital.addressKey as keyof typeof strings]
        : displayHospital.address;

    const openGoogleMaps = () => {
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
        window.open(mapsUrl, '_blank');
    };

    const openDirections = () => {
        setIsNavigating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const mapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${hospital.lat},${hospital.lng}`;
                    window.open(mapsUrl, '_blank');
                    setIsNavigating(false);
                },
                () => {
                    // Fallback to general directions
                    openGoogleMaps();
                    setIsNavigating(false);
                }
            );
        } else {
            openGoogleMaps();
            setIsNavigating(false);
        }
    };

    const callHospital = () => {
        if (displayHospital.phone) {
            window.open(`tel:${displayHospital.phone}`, '_self');
        }
    };

    const openWebsite = () => {
        if (displayHospital.website) {
            window.open(displayHospital.website, '_blank');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl [&>button]:hover:bg-blue-500 [&>button]:hover:text-white [&>button]:transition-colors [&>button]:duration-200">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                        {hospitalName}
                    </DialogTitle>
                    {hospital.real && (
                        <Badge variant="secondary" className="mb-2">
                            📍 Real-time data
                        </Badge>
                    )}
                </DialogHeader>

                <div className="space-y-6">
                    {/* Hospital Info Card */}
                    <Card className="p-6 rounded-xl">
                        <div className="space-y-4">
                            {/* Description */}
                            {displayHospital.description && (
                                <div className="mb-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {displayHospital.description}
                                    </p>
                                </div>
                            )}

                            {/* Rating and Reviews */}
                            {(displayHospital.rating || displayHospital.reviews) && (
                                <div className="flex items-center gap-4 mb-4">
                                    {displayHospital.rating && (
                                        <div className="flex items-center gap-1">
                                            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span className="text-sm font-medium">{displayHospital.rating}</span>
                                        </div>
                                    )}
                                    {displayHospital.reviews && (
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{displayHospital.reviews} reviews</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Address */}
                            {hospitalAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">{strings.address}</p>
                                        <p className="text-muted-foreground">{hospitalAddress}</p>
                                    </div>
                                </div>
                            )}

                            {/* Distance */}
                            <div className="flex items-start gap-3">
                                <Navigation className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">{strings.distance}</p>
                                    <p className="text-muted-foreground">
                                        {displayHospital.distanceKm} km {strings.distance}
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            {displayHospital.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">{strings.phone}</p>
                                        <p className="text-muted-foreground">{displayHospital.phone}</p>
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            {displayHospital.email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">Email</p>
                                        <p className="text-muted-foreground">{displayHospital.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Website */}
                            {displayHospital.website && (
                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">{strings.website}</p>
                                        <p className="text-muted-foreground break-all">{displayHospital.website}</p>
                                    </div>
                                </div>
                            )}

                            {/* Timings */}
                            {displayHospital.timings && (
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">{strings.openingHours}</p>
                                        <p className="text-muted-foreground">{displayHospital.timings}</p>
                                    </div>
                                </div>
                            )}

                            {/* Specialties */}
                            {displayHospital.specialties && displayHospital.specialties.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">Specialties</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {displayHospital.specialties.map((specialty, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {specialty}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Services */}
                            {displayHospital.services && displayHospital.services.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 flex items-center justify-center">
                                        🏥
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{strings.services}</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {displayHospital.services.map((service, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Emergency Services */}
                            {displayHospital.emergency && (
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0 flex items-center justify-center">
                                        🚨
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{strings.emergency}</p>
                                        <p className="text-muted-foreground">
                                            {typeof displayHospital.emergency === 'boolean'
                                                ? '24/7 Emergency Services Available'
                                                : displayHospital.emergency
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button
                            onClick={openDirections}
                            disabled={isNavigating}
                            className="w-full gap-2"
                        >
                            <Navigation className="h-4 w-4" />
                            {isNavigating ? strings.gettingDirections : strings.getDirections}
                        </Button>

                        {displayHospital.phone && (
                            <Button
                                onClick={callHospital}
                                variant="outline"
                                className="w-full gap-2"
                            >
                                <Phone className="h-4 w-4" />
                                {strings.callHospital}
                            </Button>
                        )}

                        {displayHospital.website && (
                            <Button
                                onClick={openWebsite}
                                variant="outline"
                                className="w-full gap-2"
                            >
                                <Globe className="h-4 w-4" />
                                {strings.visitWebsite}
                            </Button>
                        )}

                        <Button
                            onClick={openGoogleMaps}
                            variant="outline"
                            className="w-full gap-2"
                        >
                            <MapPin className="h-4 w-4" />
                            {strings.viewOnGoogleMaps}
                        </Button>
                    </div>


                    {/* Emergency Information */}
                    <Card className="p-6 bg-red-50 border-red-200 rounded-xl">
                        <h3 className="font-semibold text-red-800 mb-2">🚨 {strings.emergencyInformation}</h3>
                        <p className="text-sm text-red-700 mb-3">
                            {strings.emergencyDescription}
                        </p>
                        <div className="text-sm text-red-600">
                            <p><strong>{strings.emergencyIndia}</strong></p>
                            <p><strong>{strings.emergencyGeneral}</strong></p>
                        </div>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HospitalDetailsModal;
