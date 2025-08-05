import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clientApi } from '../../services/api'
import { Calendar, MapPin, Camera, DollarSign, FileText, Users } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const SubmitInquiryPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const eventType = watch('eventType')

  const submitInquiry = useMutation({
    mutationFn: clientApi.submitInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries(['client-inquiries'])
      toast.success('Inquiry submitted successfully!')
      navigate('/client')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry')
    }
  })

  const onSubmit = (data) => {
    // Map frontend fields to backend fields
    // Only allow backend category values
    const allowedCategories = ['wedding', 'maternity', 'portrait', 'event', 'commercial', 'fashion'];
    let category = data.eventType ? data.eventType.toLowerCase() : '';
    if (!allowedCategories.includes(category)) {
      // fallback or default to 'wedding' if not valid
      category = 'wedding';
    }

    // Convert budgetRange string to a representative decimal value (optional improvement)
    let budget = undefined;
    if (data.budgetRange) {
      // Example: '₹10,000 - ₹25,000' => 10000, 'Above ₹2,00,000' => 200000
      const match = data.budgetRange.match(/\d[\d,]*/g);
      if (match && match.length > 0) {
        budget = parseInt(match[0].replace(/,/g, ''));
      } else if (data.budgetRange.toLowerCase().includes('above')) {
        budget = 200000;
      } else {
        budget = 10000;
      }
    }

    const payload = {
      category,
      eventDate: data.eventDate,
      budget,
      city: data.location,
      description: data.description,
      referenceImageUrl: data.referenceImageUrl,
      // Add any other fields as needed
    };
    // Debug: log payload to console
    console.log('Submitting inquiry payload:', payload);
    submitInquiry.mutate(payload);
  }

  const eventTypes = [
    'Wedding',
    'Pre-Wedding',
    'Engagement',
    'Birthday',
    'Anniversary',
    'Corporate Event',
    'Product Photography',
    'Portrait',
    'Maternity',
    'Newborn',
    'Fashion',
    'Real Estate',
    'Other'
  ]

  const budgetRanges = [
    'Under ₹10,000',
    '₹10,000 - ₹25,000',
    '₹25,000 - ₹50,000',
    '₹50,000 - ₹1,00,000',
    '₹1,00,000 - ₹2,00,000',
    'Above ₹2,00,000'
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit Photography Inquiry</h1>
        <p className="text-gray-600 mt-2">
          Tell us about your event and we'll connect you with the perfect photographers
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Event Details */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-primary-600" />
            Event Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type */}
            <div>
              <label className="form-label">Event Type *</label>
              <select
                {...register('eventType', { required: 'Event type is required' })}
                className="form-input"
                disabled={submitInquiry.isPending}
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.eventType && <p className="form-error">{errors.eventType.message}</p>}
            </div>

            {/* Event Date */}
            <div>
              <label className="form-label">Event Date *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('eventDate', { required: 'Event date is required' })}
                  type="date"
                  className="form-input pl-10"
                  min={new Date().toISOString().split('T')[0]}
                  disabled={submitInquiry.isPending}
                />
              </div>
              {errors.eventDate && <p className="form-error">{errors.eventDate.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="form-label">Location *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('location', { required: 'Location is required' })}
                  type="text"
                  className="form-input pl-10"
                  placeholder="City, State"
                  disabled={submitInquiry.isPending}
                />
              </div>
              {errors.location && <p className="form-error">{errors.location.message}</p>}
            </div>

            {/* Budget Range */}
            <div>
              <label className="form-label">Budget Range *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register('budgetRange', { required: 'Budget range is required' })}
                  className="form-input pl-10"
                  disabled={submitInquiry.isPending}
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              {errors.budgetRange && <p className="form-error">{errors.budgetRange.message}</p>}
            </div>

            {/* Guest Count */}
            <div>
              <label className="form-label">Expected Guest Count</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('guestCount', { 
                    min: { value: 1, message: 'Guest count must be at least 1' }
                  })}
                  type="number"
                  className="form-input pl-10"
                  placeholder="Number of guests"
                  disabled={submitInquiry.isPending}
                />
              </div>
              {errors.guestCount && <p className="form-error">{errors.guestCount.message}</p>}
            </div>

            {/* Duration */}
            <div>
              <label className="form-label">Event Duration (hours)</label>
              <input
                {...register('duration', { 
                  min: { value: 1, message: 'Duration must be at least 1 hour' }
                })}
                type="number"
                className="form-input"
                placeholder="Duration in hours"
                disabled={submitInquiry.isPending}
              />
              {errors.duration && <p className="form-error">{errors.duration.message}</p>}
            </div>
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary-600" />
            Additional Requirements
          </h2>

          {/* Description */}
          <div className="mb-6">
            <label className="form-label">Event Description *</label>
            <textarea
              {...register('description', { 
                required: 'Event description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters' }
              })}
              rows={4}
              className="form-input"
              placeholder="Tell us more about your event, style preferences, specific requirements, etc."
              disabled={submitInquiry.isPending}
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          {/* Special Requirements */}
          <div className="mb-6">
            <label className="form-label">Special Requirements</label>
            <textarea
              {...register('specialRequirements')}
              rows={3}
              className="form-input"
              placeholder="Any special equipment, shots, or arrangements needed?"
              disabled={submitInquiry.isPending}
            />
          </div>

          {/* Photography Style Preferences */}
          <div>
            <label className="form-label">Photography Style Preferences</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {[
                'Traditional',
                'Candid',
                'Artistic',
                'Documentary',
                'Fashion',
                'Vintage',
                'Modern',
                'Black & White',
                'Cinematic'
              ].map((style) => (
                <label key={style} className="flex items-center">
                  <input
                    {...register('stylePreferences')}
                    type="checkbox"
                    value={style}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={submitInquiry.isPending}
                  />
                  <span className="ml-2 text-sm text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Preferences</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Contact Method */}
            <div>
              <label className="form-label">Preferred Contact Method</label>
              <div className="space-y-2">
                {['Email', 'Phone', 'WhatsApp'].map((method) => (
                  <label key={method} className="flex items-center">
                    <input
                      {...register('preferredContact')}
                      type="radio"
                      value={method}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      disabled={submitInquiry.isPending}
                    />
                    <span className="ml-2 text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="form-label">How urgent is this request?</label>
              <select
                {...register('urgency')}
                className="form-input"
                disabled={submitInquiry.isPending}
              >
                <option value="low">Not urgent - I have plenty of time</option>
                <option value="medium">Moderate - Within a few weeks</option>
                <option value="high">Urgent - Need response within a few days</option>
                <option value="critical">Critical - Event is very soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/client')}
            className="btn-secondary"
            disabled={submitInquiry.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitInquiry.isPending}
            className="btn-primary btn-lg flex items-center"
          >
            {submitInquiry.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Inquiry'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubmitInquiryPage
