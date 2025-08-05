import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../stores/authStore'
import { Mail, ArrowLeft } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const VerifyOTPPage = () => {
  const [resendCooldown, setResendCooldown] = useState(0)
  const { verifyOTP, requestOTP, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  const email = location.state?.email
  const message = location.state?.message || 'Please enter the OTP sent to your email'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch
  } = useForm()

  const otpValue = watch('otp', '')

  useEffect(() => {
    if (!email) {
      navigate('/auth/login')
      return
    }

    // Start cooldown timer
    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, navigate])

  const onSubmit = async (data) => {
    // Concatenate OTP from individual inputs if needed
    let otp = data.otp
    if (!otp && typeof data === 'object') {
      otp = [0,1,2,3,4,5].map(i => data[`otp-${i}`] || '').join('')
    }
    if (!otp || otp.length !== 6) {
      setError('otp', { message: 'Please enter a valid 6-digit code' })
      return
    }
    const result = await verifyOTP({ email, otp })
    if (result.success) {
      // Redirect based on user role
      const redirectPath = result.user && result.user.role === 'admin' ? '/admin' : 
                          result.user && result.user.role === 'partner' ? '/partner' : 
                          result.user && result.user.role === 'client' ? '/client' : '/'
      navigate(redirectPath, { replace: true })
    } else {
      setError('otp', { message: result.error })
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    const result = await requestOTP({ email })
    
    if (result.success) {
      setResendCooldown(60)
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setError('root', { message: result.error })
    }
  }

  const handleOTPInput = (e, index) => {
    const value = e.target.value
    if (value.length > 1) {
      // Handle paste
      const pastedValue = value.slice(0, 6)
      setValue('otp', pastedValue)
      
      // Focus last input
      const inputs = document.querySelectorAll('.otp-input')
      const lastIndex = Math.min(pastedValue.length - 1, 5)
      inputs[lastIndex]?.focus()
    } else if (value && index < 5) {
      // Move to next input
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      // Move to previous input on backspace
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`)
      prevInput?.focus()
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        <p className="mt-1 text-sm text-gray-500">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        {/* OTP Input */}
        <div>
          <label className="form-label text-center block">Enter verification code</label>
          <div className="flex justify-center space-x-3 mt-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                {...register(`otp-${index}`, {
                  required: true,
                  pattern: /^[0-9]$/
                })}
                type="text"
                maxLength={6}
                className="otp-input w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  e.target.value = value
                  
                  // Update main OTP value
                  const inputs = document.querySelectorAll('.otp-input')
                  const otpArray = Array.from(inputs).map(input => input.value)
                  setValue('otp', otpArray.join(''))
                  
                  handleOTPInput(e, index)
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isLoading}
              />
            ))}
          </div>
          {errors.otp && <p className="form-error text-center mt-2">Please enter a valid 6-digit code</p>}
          
          {/* Hidden input for form submission */}
          <input
            {...register('otp', {
              required: 'Please enter the verification code',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Please enter a valid 6-digit code'
              }
            })}
            type="hidden"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || otpValue.length !== 6}
          className="w-full btn-primary btn-lg flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </button>
      </form>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
        {resendCooldown > 0 ? (
          <p className="text-sm text-gray-500">
            Resend in {resendCooldown} seconds
          </p>
        ) : (
          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-sm text-primary-600 hover:text-primary-500 font-medium disabled:opacity-50"
          >
            Resend verification code
          </button>
        )}
      </div>

      {/* Demo Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Demo Mode</h4>
        <p className="text-xs text-blue-700">
          Use any 6-digit code (e.g., 123456) for verification in demo mode.
        </p>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </Link>
      </div>
    </div>
  )
}

export default VerifyOTPPage
