import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { clientApi } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import { 
  FileText, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  Calendar,
  MapPin,
  Camera,
  Star
} from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const ClientDashboard = () => {
  const { user } = useAuthStore()
  
  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['client-inquiries'],
    queryFn: clientApi.getInquiries
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'assigned':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'responded':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      case 'responded':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = inquiries ? {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    assigned: inquiries.filter(i => i.status === 'assigned').length,
    responded: inquiries.filter(i => i.status === 'responded').length
  } : { total: 0, pending: 0, assigned: 0, responded: 0 }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.firstName || 'Client'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your photography inquiries and discover amazing photographers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/client/submit-inquiry"
            className="flex items-center p-4 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group"
          >
            <div className="p-2 bg-primary-100 rounded-lg mr-4 group-hover:bg-primary-200">
              <Plus className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Submit New Inquiry</h3>
              <p className="text-sm text-gray-600">Find photographers for your event</p>
            </div>
          </Link>

          <Link
            to="/partners"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-gray-100 rounded-lg mr-4">
              <Camera className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Browse Photographers</h3>
              <p className="text-sm text-gray-600">Explore our partner network</p>
            </div>
          </Link>

          <Link
            to="/client/inquiries"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-gray-100 rounded-lg mr-4">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">View All Inquiries</h3>
              <p className="text-sm text-gray-600">Manage your requests</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Inquiries</h2>
            <Link
              to="/client/inquiries"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : inquiries && inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.slice(0, 5).map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(inquiry.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{inquiry.eventType}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(inquiry.eventDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {inquiry.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/client/inquiries/${inquiry.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-600 mb-4">
                Submit your first inquiry to get started with finding photographers
              </p>
              <Link
                to="/client/submit-inquiry"
                className="btn-primary"
              >
                Submit Inquiry
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
