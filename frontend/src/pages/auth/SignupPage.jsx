import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../stores/authStore'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signup, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm({
    defaultValues: {
      role: 'client'
    }
  })

  const password = watch('password')

  const onSubmit = async (data) => {
    const result = await signup(data)
    
    if (result.success) {
      // Redirect to OTP verification
      navigate('/auth/verify-otp', { 
        state: { 
          email: data.email,
          message: 'Please verify your email to complete registration'
        }
      })
    } else {
      setError('root', { message: result.error })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-gray-600">Join the Pixisphere community</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        {/* Role Selection */}
        <div>
          <label className="form-label">I want to join as</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative">
              <input
                {...register('role')}
                type="radio"
                value="client"
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:border-gray-300 transition-colors">
                <div className="text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-gray-600 peer-checked:text-primary-600" />
                  <h3 className="font-medium text-gray-900">Client</h3>
                  <p className="text-sm text-gray-600">Looking for photographers</p>
                </div>
              </div>
            </label>
            <label className="relative">
              <input
                {...register('role')}
                type="radio"
                value="partner"
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:border-gray-300 transition-colors">
                <div className="text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-gray-600 peer-checked:text-primary-600" />
                  <h3 className="font-medium text-gray-900">Partner</h3>
                  <p className="text-sm text-gray-600">Professional photographer</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
                type="text"
                className="form-input pl-10"
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="form-label">Last Name</label>
            <input
              {...register('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters'
                }
              })}
              type="text"
              className="form-input"
              placeholder="Last name"
              disabled={isLoading}
            />
            {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
          </div>
        </div>

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

        {/* Phone Field */}
        <div>
          <label className="form-label">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Invalid Indian phone number'
                }
              })}
              type="tel"
              className="form-input pl-10"
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}
        </div>

        {/* Location Field */}
        <div>
          <label className="form-label">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('location', {
                required: 'Location is required'
              })}
              type="text"
              className="form-input pl-10"
              placeholder="City, State"
              disabled={isLoading}
            />
          </div>
          {errors.location && <p className="form-error">{errors.location.message}</p>}
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Create password"
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

          <div>
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input pl-10 pr-10"
                placeholder="Confirm password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              {...register('agreeToTerms', {
                required: 'You must agree to the terms and conditions'
              })}
              id="agree-terms"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={isLoading}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agree-terms" className="text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>
        {errors.agreeToTerms && <p className="form-error">{errors.agreeToTerms.message}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary btn-lg flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
