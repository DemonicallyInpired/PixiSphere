import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partnerApi } from '../../services/api'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { User, MapPin, Phone, Mail, Camera, Save, X } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const PartnerProfilePage = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['partner-profile'],
    queryFn: partnerApi.getProfile
  })
  
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: partnerApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['partner-profile'], data)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    if (profile) {
      reset({
        businessName: profile.businessName || '',
        location: profile.location || '',
        phone: profile.phone || '',
        email: profile.email || user.email || '',
        description: profile.description || '',
        specializations: profile.specializations?.join(', ') || '',
        experience: profile.experience || ''
      })
    }
  }, [profile, reset, user.email])
  
  const onSubmit = (data) => {
    // Convert specializations string to array
    const specializations = data.specializations 
      ? data.specializations.split(',').map(s => s.trim()).filter(s => s)
      : []
    
    updateProfile({
      ...data,
      specializations
    })
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    if (profile) {
      reset({
        businessName: profile.businessName || '',
        location: profile.location || '',
        phone: profile.phone || '',
        email: profile.email || user.email || '',
        description: profile.description || '',
        specializations: profile.specializations?.join(', ') || '',
        experience: profile.experience || ''
      })
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Failed to load profile. Please try again later.</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partner Profile</h1>
        <p className="text-gray-600 mt-2">Manage your business information and profile details</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Business Name</label>
                  <input
                    {...register('businessName', { required: 'Business name is required' })}
                    className="form-input"
                    placeholder="Your business name"
                  />
                  {errors.businessName && (
                    <p className="form-error">{errors.businessName.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      className="form-input pl-10"
                      placeholder="City, State"
                    />
                  </div>
                  {errors.location && (
                    <p className="form-error">{errors.location.message}</p>
                  )}
                </div>
                
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
                          value: /^[0-9]{10,15}$/,
                          message: 'Please enter a valid phone number'
                        }
                      })}
                      className="form-input pl-10"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="form-error">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email'
                        }
                      })}
                      className="form-input pl-10"
                      placeholder="your@email.com"
                      type="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="form-label">Specializations</label>
                  <input
                    {...register('specializations')}
                    className="form-input"
                    placeholder="Weddings, Portraits, Events (comma separated)"
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter specializations separated by commas</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="form-label">Years of Experience</label>
                  <input
                    {...register('experience', { 
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Please enter a valid number'
                      }
                    })}
                    className="form-input"
                    placeholder="5"
                    type="number"
                    min="0"
                  />
                  {errors.experience && (
                    <p className="form-error">{errors.experience.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="form-label">Business Description</label>
                  <textarea
                    {...register('description')}
                    className="form-textarea"
                    rows="4"
                    placeholder="Tell clients about your business and services..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary flex items-center"
                >
                  {isUpdating ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <Camera className="h-10 w-10 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profile?.businessName || 'Business Name'}
                  </h3>
                  <p className="text-gray-600">
                    {profile?.location || 'Location not set'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {profile?.phone || 'Not provided'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile?.email || user.email || 'Not provided'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {profile?.location || 'Not provided'}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Details</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="text-gray-900">
                        {profile?.experience ? `${profile.experience} years` : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Specializations</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile?.specializations && profile.specializations.length > 0 ? (
                          profile.specializations.map((spec, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                            >
                              {spec}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">
                    {profile?.description || 'No description provided'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PartnerProfilePage
