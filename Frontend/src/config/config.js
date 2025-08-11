// Frontend Configuration
const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  
  // App Configuration
  APP_NAME: "QuickCourt",
  APP_VERSION: "1.0.0",
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  
  // Local Storage Keys
  STORAGE_KEYS: {
    TOKEN: "token",
    USER_ROLE: "role",
    USER_ID: "userId",
    USER_NAME: "userName",
    THEME: "theme",
    LANGUAGE: "language"
  },
  
  // Routes
  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    SIGNUP: "/signup",
    DASHBOARD: "/dashboard",
    VENUES: "/venues",
    BOOKINGS: "/my-bookings",
    OWNER_DASHBOARD: "/owner/dashboard",
    ADMIN_DASHBOARD: "/admin/dashboard"
  },
  
  // User Roles
  ROLES: {
    USER: "user",
    OWNER: "owner",
    ADMIN: "admin"
  },
  
  // Booking Statuses
  BOOKING_STATUSES: {
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed"
  },
  
  // Facility Types
  FACILITY_TYPES: {
    INDOOR: "indoor",
    OUTDOOR: "outdoor"
  }
};

export default config;
