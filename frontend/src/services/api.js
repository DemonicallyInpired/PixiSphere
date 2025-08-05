import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pixisphere_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('pixisphere_token')
      localStorage.removeItem('pixisphere_user')
      window.location.href = '/auth/login'
    }
    
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.')
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/auth/profile'),
  requestOTP: (data) => api.post('/auth/request-otp', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
}

// Client API
export const clientApi = {
  submitInquiry: (inquiryData) => api.post('/inquiry', inquiryData),
  getInquiries: async () => {
    const res = await api.get('/client/inquiries');
    // Return only the array for useQuery consumers
    return res.data.data.inquiries;
  },
  getMyInquiries: (params) => api.get('/client/inquiries', { params }),
  getInquiryResponses: (inquiryId) => api.get(`/client/inquiries/${inquiryId}/responses`),
  browsePartners: (params) => api.get('/partners', { params }),
  getPartnerDetails: (partnerId) => api.get(`/partners/${partnerId}`),
}

// Partner API
export const partnerApi = {
  createProfile: (profileData) => api.post('/partner/profile', profileData),
  getProfile: () => api.get('/partner/profile'),
  updateProfile: (profileData) => api.put('/partner/profile', profileData),
  getLeads: (params) => api.get('/partner/leads', { params }),
  respondToLead: (leadId, responseData) => api.put(`/partner/leads/${leadId}/respond`, responseData),
  addPortfolioItem: (itemData) => api.post('/partner/portfolio', itemData),
  getPortfolio: () => api.get('/partner/portfolio'),
  updatePortfolioItem: (itemId, itemData) => api.put(`/partner/portfolio/${itemId}`, itemData),
  deletePortfolioItem: (itemId) => api.delete(`/partner/portfolio/${itemId}`),
}

// Admin API
export const adminApi = {
  getDashboardKPIs: () => api.get('/admin/dashboard'),
  getPendingVerifications: (params) => api.get('/admin/verifications', { params }),
  verifyPartner: (partnerId, verificationData) => api.put(`/admin/verify/${partnerId}`, verificationData),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  moderateReview: (reviewId, moderationData) => api.put(`/admin/reviews/${reviewId}/moderate`, moderationData),
  deleteReview: (reviewId) => api.delete(`/admin/reviews/${reviewId}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (categoryData) => api.post('/admin/categories', categoryData),
  updateCategory: (categoryId, categoryData) => api.put(`/admin/categories/${categoryId}`, categoryData),
  deleteCategory: (categoryId) => api.delete(`/admin/categories/${categoryId}`),
  getLocations: () => api.get('/admin/locations'),
  createLocation: (locationData) => api.post('/admin/locations', locationData),
  updateLocation: (locationId, locationData) => api.put(`/admin/locations/${locationId}`, locationData),
  deleteLocation: (locationId) => api.delete(`/admin/locations/${locationId}`),
  promotePartner: (partnerId, promotionData) => api.put(`/admin/partners/${partnerId}/promote`, promotionData),
}

// File upload API (mock implementation)
export const uploadApi = {
  uploadImage: async (file) => {
    // Mock implementation - in real app, this would upload to cloud storage
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://picsum.photos/800/600?random=${Date.now()}`
        resolve({ data: { imageUrl: mockUrl } })
      }, 1000)
    })
  },
}

export default api
