'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardBody, Button, Chip, Skeleton } from '@nextui-org/react';
import { MapPin, Phone, Clock, Star, Navigation } from 'lucide-react';
import { sampleStores, getOpenStores, sortStoresByDistance } from '@/lib/sampleStores';
import { formatDistance } from '@/lib/utils';

// Fix for Leaflet icons in Next.js
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-small text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Create a simple map fallback component
const SimpleMapFallback = ({ stores, userLocation }) => {
  return (
    <div className="h-[300px] bg-gradient-to-br from-blue-50 to-green-50 rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-800">Interactive Map</h3>
          <p className="text-sm text-gray-600">Location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Nearby Stores ({stores.length})</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {stores.slice(0, 6).map((store) => (
                <span key={store.id} className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">
                  {store.emoji} {store.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alternative map component using a different approach
const AlternativeMapComponent = memo(({ stores, userLocation }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        // Try to load the map with a different approach
        const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
        
        if (MapContainer && TileLayer && Marker && Popup) {
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load map components:', error);
        setMapError('Failed to load map components');
      }
    };

    loadMap();
  }, []);

  if (mapError) {
    return <SimpleMapFallback stores={stores} userLocation={userLocation} />;
  }

  if (!mapLoaded) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-small text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return <SimpleMapFallback stores={stores} userLocation={userLocation} />;
});

AlternativeMapComponent.displayName = 'AlternativeMapComponent';

// Remove clustering import as it's causing errors

// Memoized marker component to prevent unnecessary re-renders
const StoreMarker = memo(({ store }) => (
  <Marker position={[store.latitude, store.longitude]}>
    <Popup>
      <div className="min-w-[200px] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{store.emoji}</span>
          <h3 className="font-semibold text-gray-900">{store.name}</h3>
        </div>
        <p className="text-small text-gray-600">{store.address}</p>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-small">{store.rating}/5</span>
          <span className="text-small text-gray-500">
            • {formatDistance(store.distance)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-small">
            {store.isOpen ? 'Open now' : 'Closed'}
          </span>
        </div>
        <Button
          size="sm"
          color="primary"
          className="w-full mt-2"
          startContent={<Phone className="w-3 h-3" />}
        >
          Call
        </Button>
      </div>
    </Popup>
  </Marker>
));

StoreMarker.displayName = 'StoreMarker';

const MapComponent = memo(({ stores, userLocation }) => {
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isMapAvailable, setIsMapAvailable] = useState(false);

  // Memoize bounds calculation to prevent unnecessary recalculations
  const bounds = useMemo(() => {
    if (stores.length === 0) return null;
    return stores.map(store => [store.latitude, store.longitude]);
  }, [stores]);

  // Check if map libraries are available
  useEffect(() => {
    const checkMapAvailability = async () => {
      try {
        const { MapContainer } = await import('react-leaflet');
        if (MapContainer) {
          setIsMapAvailable(true);
          console.log('Map libraries are available');
        }
      } catch (error) {
        console.error('Map libraries not available:', error);
        setMapError('Map libraries not available');
        setIsMapLoading(false);
      }
    };

    checkMapAvailability();
  }, []);

  // Memoize the map creation callback
  const handleMapCreated = useCallback((mapInstance) => {
    console.log('Map created:', mapInstance);
    if (mapInstance) {
      setMap(mapInstance);
      setMapError(null);
      setIsMapLoading(false);
    }
  }, []);

  // Timeout to detect if map doesn't load
  useEffect(() => {
    if (!isMapAvailable) return;

    const timeout = setTimeout(() => {
      if (!map) {
        setMapError('Map failed to load within 10 seconds');
        setIsMapLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [map, isMapAvailable]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (map) {
        try {
          map.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
      }
    };
  }, [map]);

  // Optimize bounds fitting with debouncing
  useEffect(() => {
    if (map && bounds && bounds.length > 0) {
      // Use requestAnimationFrame to prevent blocking the UI
      const timeoutId = setTimeout(() => {
        try {
          map.fitBounds(bounds, { 
            padding: [20, 20],
            maxZoom: 15 // Prevent excessive zooming
          });
        } catch (error) {
          console.warn('Error fitting bounds:', error);
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [map, bounds]);

  // Memoize store markers to prevent unnecessary re-renders
  const storeMarkers = useMemo(() => {
    return stores.map((store) => (
      <StoreMarker key={store.id} store={store} />
    ));
  }, [stores]);

  // Show fallback map if map libraries are not available or if there's an error
  if (mapError || !isMapAvailable) {
    return <SimpleMapFallback stores={stores} userLocation={userLocation} />;
  }

  // Show loading state
  if (isMapLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-small text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
      whenCreated={handleMapCreated}
      className="rounded-xl"
      zoomSnap={0.5}
      zoomDelta={0.5}
      preferCanvas={true}
      zoomControl={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      touchZoom={true}
      boxZoom={true}
      keyboard={true}
      dragging={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
        minZoom={1}
      />
      
      {/* User Location Marker */}
      <Marker position={userLocation}>
        <Popup>
          <div className="text-center">
            <div className="text-lg">📍</div>
            <p className="font-semibold">Your Location</p>
          </div>
        </Popup>
      </Marker>

      {/* Store Markers - Memoized for better performance */}
      {storeMarkers}
    </MapContainer>
  );
});

MapComponent.displayName = 'MapComponent';

// Memoized store card component
const StoreCard = memo(({ store }) => (
  <Card className="card-mobile">
    <CardBody className="py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{store.emoji}</span>
          <div>
            <h5 className="font-semibold text-gray-900 text-sm">
              {store.name}
            </h5>
            <p className="text-xs text-gray-500">
              {formatDistance(store.distance)} • {store.address}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-medium">{store.rating}</span>
          </div>
          <Chip
            size="sm"
            color={store.isOpen ? "success" : "danger"}
            variant="flat"
            className="text-xs"
          >
            {store.isOpen ? 'Open' : 'Closed'}
          </Chip>
        </div>
      </div>
    </CardBody>
  </Card>
));

StoreCard.displayName = 'StoreCard';

// Error boundary component for map
const MapErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Map error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback || (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-gray-600">Map temporarily unavailable</p>
        </div>
      </div>
    );
  }

  return children;
};

export default function NearbyStoresMap() {
  const [stores, setStores] = useState([]);
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]); // Default to Delhi
  const [isLoading, setIsLoading] = useState(true);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  // Memoize filtered stores to prevent unnecessary recalculations
  const filteredStores = useMemo(() => {
    const storesToShow = showOpenOnly ? getOpenStores() : stores;
    // Limit to 20 stores for better performance
    return storesToShow.slice(0, 20);
  }, [showOpenOnly, stores]);

  // Memoize open stores count
  const openStoresCount = useMemo(() => {
    return getOpenStores().length;
  }, []);

  // Memoize the toggle function
  const toggleShowOpenOnly = useCallback(() => {
    setShowOpenOnly(prev => !prev);
  }, []);

  useEffect(() => {
    // Simulate loading and geolocation
    const loadStores = async () => {
      setIsLoading(true);
      
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.log('Geolocation error:', error);
            // Use default location
          }
        );
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nearbyStores = sortStoresByDistance(sampleStores);
      setStores(nearbyStores);
      setIsLoading(false);
    };

    loadStores();
  }, []);

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-500" />
          <span className="font-semibold text-gray-900">
            {stores.length} stores found
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Chip
            color="success"
            variant="flat"
            size="sm"
            className="flex items-center gap-1"
          >
            <span className="w-2 h-2 bg-success-500 rounded-full"></span>
            {openStoresCount} open
          </Chip>
          <Button
            size="sm"
            variant={showOpenOnly ? "solid" : "flat"}
            color={showOpenOnly ? "primary" : "default"}
            onPress={toggleShowOpenOnly}
          >
            {showOpenOnly ? 'Show All' : 'Open Only'}
          </Button>
        </div>
      </div>

      {/* Map */}
      <Card className="card-mobile p-0 overflow-hidden">
        <CardBody className="p-0">
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-small text-gray-500">Loading map...</p>
              </div>
            </div>
          ) : (
            <MapErrorBoundary>
              <AlternativeMapComponent stores={filteredStores} userLocation={userLocation} />
            </MapErrorBoundary>
          )}
        </CardBody>
      </Card>

      {/* Store List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-lg">🏪</span>
          Nearby Stores
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredStores.slice(0, 5).map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Button
        color="primary"
        size="lg"
        className="w-full font-semibold"
        startContent={<Navigation className="w-4 h-4" />}
      >
        Get Directions
      </Button>
    </div>
  );
}
