import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'

// Layout Components
import PublicLayout from './components/layouts/PublicLayout'
import DashboardLayout from './components/layouts/DashboardLayout'
import AuthLayout from './components/layouts/AuthLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import PartnersPage from './pages/public/PartnersPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import VerifyOTPPage from './pages/auth/VerifyOTPPage'

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard'
import SubmitInquiryPage from './pages/client/SubmitInquiryPage'
import ClientInquiriesPage from './pages/client/ClientInquiriesPage'
import ClientInquiryDetailsPage from './pages/client/ClientInquiryDetailsPage'

// Partner Pages
import PartnerDashboard from './pages/partner/PartnerDashboard'
import PartnerProfilePage from './pages/partner/PartnerProfilePage'
import PortfolioPage from './pages/partner/PortfolioPage'
import LeadsPage from './pages/partner/LeadsPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { user, token, initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="partners" element={<PartnersPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="verify-otp" element={<VerifyOTPPage />} />
        </Route>

        {/* Client Dashboard Routes */}
        <Route path="/client" element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ClientDashboard />} />
          <Route path="submit-inquiry" element={<SubmitInquiryPage />} />
          <Route path="inquiries" element={<ClientInquiriesPage />} />
          <Route path="inquiries/:id" element={<ClientInquiryDetailsPage />} />
        </Route>

        {/* Partner Dashboard Routes */}
        <Route path="/partner" element={
          <ProtectedRoute allowedRoles={['partner']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<PartnerDashboard />} />
          <Route path="profile" element={<PartnerProfilePage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="leads" element={<LeadsPage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Redirect authenticated users from auth pages */}
        <Route path="/auth/*" element={
          token ? <Navigate to={`/${user?.role || 'client'}`} replace /> : <AuthLayout />
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <a href="/" className="btn-primary btn-lg">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
