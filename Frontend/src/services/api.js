import config from "../config/config.js";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Helper function to make API calls with timeout
const apiCall = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return handleResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Auth endpoints
export const loginUser = async (credentials) => {
  return apiCall(`${config.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData) => {
  return apiCall(`${config.API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const verifyOtp = async (email, otp) => {
  return apiCall(`${config.API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
};

// User endpoints
export const getUserProfile = async () => {
  return apiCall(`${config.API_URL}/users/profile`, {
    headers: getAuthHeaders(),
  });
};

export const updateUserProfile = async (profileData) => {
  return apiCall(`${config.API_URL}/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
};

export const changePassword = async (passwordData) => {
  return apiCall(`${config.API_URL}/users/password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });
};

export const updateUserAvatar = async (avatarUrl) => {
  return apiCall(`${config.API_URL}/users/avatar`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ avatar: avatarUrl }),
  });
};

export const deleteUserAccount = async () => {
  return apiCall(`${config.API_URL}/users/profile`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const getUserBookings = async (page = 1, limit = config.DEFAULT_PAGE_SIZE, status = null) => {
  let url = `${config.API_URL}/users/my-bookings?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  
  return apiCall(url, {
    headers: getAuthHeaders(),
  });
};

export const cancelUserBooking = async (bookingId) => {
  return apiCall(`${config.API_URL}/users/my-bookings/${bookingId}/cancel`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
};

// Venue endpoints
export const getVenues = async (page = 1, limit = config.DEFAULT_PAGE_SIZE, sortBy = "createdAt", sortOrder = "desc") => {
  const url = `${config.API_URL}/venues?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  return apiCall(url);
};

export const searchVenues = async (filters = {}, page = 1, limit = config.DEFAULT_PAGE_SIZE) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  return apiCall(`${config.API_URL}/venues/search?${queryParams}`);
};

export const getVenueById = async (venueId) => {
  return apiCall(`${config.API_URL}/venues/${venueId}`);
};

export const getPopularVenues = async (limit = 6) => {
  return apiCall(`${config.API_URL}/venues/popular?limit=${limit}`);
};

export const getTrendingVenues = async (limit = 6, days = 7) => {
  return apiCall(`${config.API_URL}/venues/trending?limit=${limit}&days=${days}`);
};

export const getVenueCategories = async () => {
  return apiCall(`${config.API_URL}/venues/categories`);
};

export const getVenueAmenities = async () => {
  return apiCall(`${config.API_URL}/venues/amenities`);
};

// Owner endpoints
export const createFacility = async (facilityData) => {
  return apiCall(`${config.API_URL}/owner/facilities`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(facilityData),
  });
};

export const getOwnerFacilities = async (page = 1, limit = config.DEFAULT_PAGE_SIZE, status = null) => {
  let url = `${config.API_URL}/owner/facilities?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  
  return apiCall(url, {
    headers: getAuthHeaders(),
  });
};

export const updateFacility = async (facilityId, facilityData) => {
  return apiCall(`${config.API_URL}/owner/facilities/${facilityId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(facilityData),
  });
};

export const deleteFacility = async (facilityId) => {
  return apiCall(`${config.API_URL}/owner/facilities/${facilityId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const createCourt = async (courtData) => {
  return apiCall(`${config.API_URL}/owner/courts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(courtData),
  });
};

export const getOwnerCourts = async (page = 1, limit = config.DEFAULT_PAGE_SIZE, facilityId = null) => {
  let url = `${config.API_URL}/owner/courts?page=${page}&limit=${limit}`;
  if (facilityId) url += `&facility=${facilityId}`;
  
  return apiCall(url, {
    headers: getAuthHeaders(),
  });
};

export const updateCourt = async (courtId, courtData) => {
  return apiCall(`${config.API_URL}/owner/courts/${courtId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(courtData),
  });
};

export const deleteCourt = async (courtId) => {
  return apiCall(`${config.API_URL}/owner/courts/${courtId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const setCourtAvailability = async (courtId, availability) => {
  return apiCall(`${config.API_URL}/owner/courts/${courtId}/availability`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ availability }),
  });
};

export const getOwnerDashboard = async () => {
  return apiCall(`${config.API_URL}/owner/dashboard`, {
    headers: getAuthHeaders(),
  });
};

export const getOwnerBookings = async (page = 1, limit = config.DEFAULT_PAGE_SIZE, status = null, facilityId = null) => {
  let url = `${config.API_URL}/owner/bookings?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  if (facilityId) url += `&facility=${facilityId}`;
  
  return apiCall(url, {
    headers: getAuthHeaders(),
  });
};

export const updateBookingStatus = async (bookingId, status) => {
  return apiCall(`${config.API_URL}/owner/bookings/${bookingId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
};

// Booking endpoints
export const createBooking = async (bookingData) => {
  return apiCall(`${config.API_URL}/bookings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
};

export const getAllBookings = async (page = 1, limit = config.DEFAULT_PAGE_SIZE, status = null, facilityId = null, userId = null) => {
  let url = `${config.API_URL}/bookings?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  if (facilityId) url += `&facility=${facilityId}`;
  if (userId) url += `&user=${userId}`;
  
  return apiCall(url, {
    headers: getAuthHeaders(),
  });
};

export const getBookingById = async (bookingId) => {
  return apiCall(`${config.API_URL}/bookings/${bookingId}`, {
    headers: getAuthHeaders(),
  });
};

export const updateBooking = async (bookingId, bookingData) => {
  return apiCall(`${config.API_URL}/bookings/${bookingId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
};

export const cancelBooking = async (bookingId) => {
  return apiCall(`${config.API_URL}/bookings/${bookingId}/cancel`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
};

export const completeBooking = async (bookingId) => {
  return apiCall(`${config.API_URL}/bookings/${bookingId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
};

export const getBookingStats = async () => {
  return apiCall(`${config.API_URL}/bookings/stats`, {
    headers: getAuthHeaders(),
  });
};

export const checkCourtAvailability = async (courtId, date) => {
  return apiCall(`${config.API_URL}/bookings/availability/${courtId}?date=${date}`);
};
