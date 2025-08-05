import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../stores/authStore'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data)
    console.log("Login result:", result);
    if (result.success && result.user) {
      // Redirect based on user role
      const redirectPath = result.user.role === 'admin' ? '/admin' : 
                          result.user.role === 'partner' ? '/partner' : 
                          result.user.role === 'client' ? '/client' : from
      navigate(redirectPath, { replace: true })
    } else {
      // Only show error if it's a string
      const errorMessage = typeof result.error === 'string' ? result.error : 'Login failed';
      setError('root', { message: errorMessage })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="form-label">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="form-input pl-10"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label className="form-label">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type={showPassword ? 'text' : 'password'}
              className="form-input pl-10 pr-10"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary btn-lg flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Demo Accounts */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Accounts</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Admin:</strong> admin@pixisphere.com / admin123</p>
          <p><strong>Client:</strong> client@example.com / password123</p>
          <p><strong>Partner:</strong> partner@example.com / password123</p>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-primary-600 hover:text-primary-500 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
