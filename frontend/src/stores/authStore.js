import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Initialize auth from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('pixisphere_token')
        const user = localStorage.getItem('pixisphere_user')
        
        if (token && user) {
          try {
            set({
              token,
              user: JSON.parse(user),
              isAuthenticated: true,
            })
          } catch (error) {
            // Clear invalid data
            localStorage.removeItem('pixisphere_token')
            localStorage.removeItem('pixisphere_user')
          }
        }
      },

      // Login action
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          console.log("credentials", credentials); 
          const response = await authApi.login(credentials)
          const { user, token } = response.data.data; // Extract from nested data
          console.log("login response", response.data);
          // Store in localStorage
          localStorage.setItem('pixisphere_token', token);
          localStorage.setItem('pixisphere_user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Login successful!');
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false });
          // Safely extract error message from Axios error
          let message = 'Login failed';
          if (error.response && error.response.data && typeof error.response.data.message === 'string') {
            message = error.response.data.message;
          } else if (typeof error.message === 'string') {
            message = error.message;
          } else {
            message = 'Login failed (unknown error)';
          }
          // Log only safe, non-cyclic parts
          console.error('Login error:', {
            message: error.message,
            response: error.response ? {
              status: error.response.status,
              data: error.response.data && typeof error.response.data === 'object'
                ? { ...error.response.data, message: error.response.data.message }
                : error.response.data
            } : undefined
          });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Signup action (OTP-gated, do NOT set localStorage/auth state)
      signup: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authApi.signup(userData)
          set({ isLoading: false })
          toast.success('OTP sent to your email!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Signup failed'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      // Logout action
      logout: () => {
        localStorage.removeItem('pixisphere_token')
        localStorage.removeItem('pixisphere_user')
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        
        toast.success('Logged out successfully')
      },

      // Update user profile
      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData }
        localStorage.setItem('pixisphere_user', JSON.stringify(updatedUser))
        set({ user: updatedUser })
      },

      // Check if user has specific role
      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const { user } = get()
        return roles.includes(user?.role)
      },

      // Get auth header for API requests
      getAuthHeader: () => {
        const { token } = get()
        return token ? { Authorization: `Bearer ${token}` } : {}
      },

      // Request OTP
      requestOTP: async (email) => {
        set({ isLoading: true })
        try {
          await authApi.requestOTP({ email })
          set({ isLoading: false })
          toast.success('OTP sent successfully!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Failed to send OTP'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      // Verify OTP (creates user, sets localStorage/auth state)
      verifyOTP: async ({ email, otp }) => {
        set({ isLoading: true })
        try {
          const response = await authApi.verifyOTP({ email, otp })
          const { user, token } = response.data.data
          // Store in localStorage
          localStorage.setItem('pixisphere_token', token)
          localStorage.setItem('pixisphere_user', JSON.stringify(user))
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          toast.success('OTP verified and account created!')
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Invalid OTP'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      // Get user profile
      fetchProfile: async () => {
        try {
          const response = await authApi.getProfile()
          const user = response.data.user
          
          localStorage.setItem('pixisphere_user', JSON.stringify(user))
          set({ user })
          
          return { success: true, user }
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to fetch profile'
          toast.error(message)
          return { success: false, error: message }
        }
      },
    }),
    {
      name: 'pixisphere-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
