import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format time to readable string
export function formatTime(timeString) {
  if (timeString === '24/7') return '24/7';
  return timeString;
}

// Calculate days until refill
export function getDaysUntilRefill(refillDate) {
  const today = new Date();
  const refill = new Date(refillDate);
  const diffTime = refill - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Get status color for prescriptions
export function getPrescriptionStatusColor(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'completed':
      return 'default';
    case 'expired':
      return 'danger';
    default:
      return 'default';
  }
}

// Get status color for stores
export function getStoreStatusColor(isOpen) {
  return isOpen ? 'success' : 'danger';
}

// Get urgency level for refills
export function getRefillUrgency(daysUntilRefill) {
  if (daysUntilRefill <= 0) return 'critical';
  if (daysUntilRefill <= 2) return 'urgent';
  if (daysUntilRefill <= 7) return 'warning';
  return 'normal';
}

// Get urgency color
export function getUrgencyColor(urgency) {
  switch (urgency) {
    case 'critical':
      return 'danger';
    case 'urgent':
      return 'warning';
    case 'warning':
      return 'warning';
    default:
      return 'success';
  }
}

// Format distance
export function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

// Get greeting based on time
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
