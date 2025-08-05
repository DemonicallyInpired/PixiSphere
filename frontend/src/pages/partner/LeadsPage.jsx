import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partnerApi } from '../../services/api'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Send, 
  X, 
  Check,
  Clock,
  TrendingUp
} from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const LeadsPage = () => {
  const queryClient = useQueryClient()
  const [selectedLead, setSelectedLead] = useState(null)
  const [isResponding, setIsResponding] = useState(false)
  
  const { data: leads, isLoading, isError } = useQuery({
    queryKey: ['partner-leads'],
    queryFn: partnerApi.getLeads
  })
  
  const { mutate: respondToLead, isPending: isRespondingToLead } = useMutation({
    mutationFn: ({ leadId, responseData }) => partnerApi.respondToLead(leadId, responseData),
    onSuccess: () => {
      queryClient.invalidateQueries(['partner-leads'])
      toast.success('Response sent successfully!')
      setIsResponding(false)
      setSelectedLead(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send response')
    }
  })
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  const onSubmitResponse = (data) => {
    if (!selectedLead) return
    
    respondToLead({
      leadId: selectedLead.id,
      responseData: data
    })
  }
  
  const handleRespond = (lead) => {
    setSelectedLead(lead)
    setIsResponding(true)
    reset({
      message: `Hi ${lead.clientName},\n\nThank you for your inquiry about ${lead.eventType}. I would love to help you with your event on ${new Date(lead.eventDate).toLocaleDateString()}.\n\nPlease let me know if you have any specific requirements or questions.\n\nBest regards,\n[Your Name]`
    })
  }
  
  const handleCancelResponse = () => {
    setIsResponding(false)
    setSelectedLead(null)
    reset()
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'assigned': return <Clock className="h-4 w-4" />
      case 'responded': return <Check className="h-4 w-4" />
      case 'completed': return <TrendingUp className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
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
        <p className="text-red-800">Failed to load leads. Please try again later.</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-2">Manage client inquiries and respond to leads</p>
      </div>
      
      {isResponding && selectedLead && (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Respond to Lead</h2>
              <button
                onClick={handleCancelResponse}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedLead.clientName}</h3>
                  <p className="text-sm text-gray-600">{selectedLead.eventType} - {new Date(selectedLead.eventDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(selectedLead.eventDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedLead.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {selectedLead.budget} budget
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                <p className="text-gray-600 text-sm">{selectedLead.description}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmitResponse)} className="space-y-6">
              <div>
                <label className="form-label">Your Response</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  className="form-textarea"
                  rows="6"
                  placeholder="Write your response to the client..."
                />
                {errors.message && (
                  <p className="form-error">{errors.message.message}</p>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isRespondingToLead}
                  className="btn-primary flex items-center"
                >
                  {isRespondingToLead ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isRespondingToLead ? 'Sending...' : 'Send Response'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancelResponse}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Client Leads</h2>
          <p className="text-gray-600 mt-1">{leads?.length || 0} leads available</p>
        </div>
        
        {leads && leads.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lead.clientName}</h3>
                        <p className="text-sm text-gray-600">{lead.eventType}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(lead.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {lead.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {lead.budget}
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {getStatusIcon(lead.status)}
                          <span className="ml-1 capitalize">{lead.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-600 text-sm line-clamp-2">{lead.description}</p>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    {lead.status === 'assigned' && (
                      <button
                        onClick={() => handleRespond(lead)}
                        className="btn-primary btn-sm flex items-center"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Respond
                      </button>
                    )}
                    
                    {lead.status === 'responded' && (
                      <span className="text-sm text-green-600 font-medium">Responded</span>
                    )}
                    
                    {lead.status === 'completed' && (
                      <span className="text-sm text-purple-600 font-medium">Completed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
            <p className="text-gray-600">Client inquiries will appear here once you receive them</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadsPage
