import { Outlet } from 'react-router-dom'
import { Camera } from 'lucide-react'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <Camera className="h-12 w-12 text-primary-600" />
            <span className="text-3xl font-bold text-gradient-primary">Pixisphere</span>
          </div>
          <p className="text-gray-600">AI-Powered Photography Marketplace</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-soft p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Pixisphere. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
