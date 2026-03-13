// Sample medical store data for Swaasthya-Saathi dashboard
export const sampleStores = [
  {
    id: '1',
    name: 'Apollo Pharmacy',
    address: 'Main Road, City Center',
    phone: '+91 98765 43210',
    latitude: 28.6139,
    longitude: 77.2090,
    distance: 0.8,
    isOpen: true,
    openTime: '08:00',
    closeTime: '22:00',
    rating: 4.5,
    services: ['Prescription', 'OTC', 'Home Delivery'],
    emoji: '💊'
  },
  {
    id: '2',
    name: 'MedPlus Mart',
    address: 'Near Railway Station',
    phone: '+91 98765 43211',
    latitude: 28.6149,
    longitude: 77.2100,
    distance: 1.2,
    isOpen: true,
    openTime: '09:00',
    closeTime: '21:00',
    rating: 4.2,
    services: ['Prescription', 'OTC', 'Lab Tests'],
    emoji: '🏥'
  },
  {
    id: '3',
    name: 'Wellness Forever',
    address: 'Market Area, Sector 15',
    phone: '+91 98765 43212',
    latitude: 28.6129,
    longitude: 77.2080,
    distance: 1.5,
    isOpen: false,
    openTime: '10:00',
    closeTime: '20:00',
    rating: 4.0,
    services: ['Prescription', 'OTC', 'Health Checkup'],
    emoji: '💊'
  },
  {
    id: '4',
    name: 'City Medical Store',
    address: 'Bus Stand Road',
    phone: '+91 98765 43213',
    latitude: 28.6159,
    longitude: 77.2110,
    distance: 2.1,
    isOpen: true,
    openTime: '08:30',
    closeTime: '21:30',
    rating: 4.3,
    services: ['Prescription', 'OTC'],
    emoji: '🏪'
  },
  {
    id: '5',
    name: 'Health Plus Pharmacy',
    address: 'Near Hospital Gate',
    phone: '+91 98765 43214',
    latitude: 28.6119,
    longitude: 77.2070,
    distance: 2.8,
    isOpen: true,
    openTime: '24/7',
    closeTime: '24/7',
    rating: 4.7,
    services: ['Prescription', 'OTC', 'Emergency', 'Home Delivery'],
    emoji: '🚨'
  },
  {
    id: '6',
    name: 'Village Medical Store',
    address: 'Rural Area, Block A',
    phone: '+91 98765 43215',
    latitude: 28.6109,
    longitude: 77.2060,
    distance: 3.5,
    isOpen: false,
    openTime: '09:00',
    closeTime: '19:00',
    rating: 3.8,
    services: ['Prescription', 'OTC'],
    emoji: '🏘️'
  },
  {
    id: '7',
    name: 'Family Care Pharmacy',
    address: 'Residential Colony',
    phone: '+91 98765 43216',
    latitude: 28.6169,
    longitude: 77.2120,
    distance: 4.2,
    isOpen: true,
    openTime: '08:00',
    closeTime: '20:00',
    rating: 4.1,
    services: ['Prescription', 'OTC', 'Home Delivery'],
    emoji: '👨‍👩‍👧‍👦'
  },
  {
    id: '8',
    name: 'Quick Med Store',
    address: 'Highway Road',
    phone: '+91 98765 43217',
    latitude: 28.6099,
    longitude: 77.2050,
    distance: 5.1,
    isOpen: true,
    openTime: '07:00',
    closeTime: '23:00',
    rating: 4.4,
    services: ['Prescription', 'OTC', 'Emergency'],
    emoji: '⚡'
  }
];

// Helper function to get stores by status
export const getStoresByStatus = (isOpen) => {
  return sampleStores.filter(store => store.isOpen === isOpen);
};

// Helper function to get open stores
export const getOpenStores = () => {
  return getStoresByStatus(true);
};

// Helper function to get closed stores
export const getClosedStores = () => {
  return getStoresByStatus(false);
};

// Helper function to get stores within distance
export const getStoresWithinDistance = (maxDistance) => {
  return sampleStores.filter(store => store.distance <= maxDistance);
};

// Helper function to get nearby stores (within 5km)
export const getNearbyStores = () => {
  return getStoresWithinDistance(5);
};

// Helper function to sort stores by distance
export const sortStoresByDistance = (stores) => {
  return [...stores].sort((a, b) => a.distance - b.distance);
};

// Helper function to sort stores by rating
export const sortStoresByRating = (stores) => {
  return [...stores].sort((a, b) => b.rating - a.rating);
};
