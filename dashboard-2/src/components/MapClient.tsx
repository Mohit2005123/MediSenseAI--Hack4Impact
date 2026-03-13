import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

interface MapClientProps {
  hospitals: Hospital[];
  userLocation: { lat: number; lng: number } | null;
  lowDataMode?: boolean;
  onHospitalClick?: (hospital: Hospital) => void;
  strings?: any;
}

const MapClient = ({
  hospitals,
  userLocation,
  lowDataMode,
  onHospitalClick,
  strings
}: MapClientProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(
      userLocation ? [userLocation.lat, userLocation.lng] : [28.6139, 77.2090],
      13
    );

    // Add OpenStreetMap tiles
    const tileUrl = lowDataMode
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      minZoom: 10,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Initialize marker cluster group
    markersRef.current = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
    });
    map.addLayer(markersRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, lowDataMode]);

  // Update markers when hospitals change
  useEffect(() => {
    if (!markersRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    // Add user location marker
    if (userLocation && mapInstanceRef.current) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('<strong>Your Location</strong>');
    }

    // Add hospital markers
    hospitals.forEach((hospital) => {
      const marker = L.marker([hospital.lat, hospital.lng]);

      const hospitalName = strings && hospital.nameKey
        ? strings[hospital.nameKey]
        : hospital.name || 'Hospital';
      const hospitalAddress = strings && hospital.addressKey
        ? strings[hospital.addressKey]
        : hospital.address;

      const distanceText = strings ? `${hospital.distanceKm} km ${strings.distance}` : `${hospital.distanceKm} km away`;
      const realTimeText = strings ? strings.realTimeData : 'Real-time data';
      const websiteText = strings ? strings.website : 'Website';

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${hospitalName}</h3>
          ${hospitalAddress ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">${hospitalAddress}</p>` : ''}
          ${hospital.phone ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">📞 ${hospital.phone}</p>` : ''}
          ${hospital.website ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #2563eb;"><a href="${hospital.website}" target="_blank">🌐 ${websiteText}</a></p>` : ''}
          <p style="margin: 0; font-size: 14px; color: #059669;">
            <strong>${distanceText}</strong>
          </p>
          ${hospital.real ? `<p style="margin: 4px 0 0 0; font-size: 10px; color: #059669;">📍 ${realTimeText}</p>` : ''}
        </div>
      `);

      if (onHospitalClick) {
        marker.on('click', () => onHospitalClick(hospital));
      }

      markersRef.current?.addLayer(marker);
    });

    // Fit bounds to show all markers
    if (hospitals.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(hospitals.map(h => [h.lat, h.lng]));
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (userLocation && mapInstanceRef.current) {
      // If no hospitals but we have user location, center on user
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [hospitals, userLocation, onHospitalClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] md:h-[500px] rounded-lg border shadow-sm"
      style={{ zIndex: 1 }}
    />
  );
};

export default MapClient;
