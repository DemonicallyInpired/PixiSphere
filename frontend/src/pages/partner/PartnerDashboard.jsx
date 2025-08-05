import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { partnerApi } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import { 
  User, 
  Image, 
  Briefcase, 
  Star, 
  Eye, 
  MessageSquare,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const PartnerDashboard = () => {
  const { user } = useAuthStore()
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['partner-profile'],
    queryFn: partnerApi.getProfile
  })

  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['partner-portfolio'],
    queryFn: partnerApi.getPortfolio
  })

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ['partner-leads'],
    queryFn: partnerApi.getLeads
  })

  const getVerificationStatus = () => {
    if (!profile) return { status: 'pending', color: 'yellow', icon: Clock }
    
    switch (profile.verificationStatus) {
      case 'verified':
        return { status: 'Verified', color: 'green', icon: CheckCircle }
      case 'rejected':
        return { status: 'Rejected', color: 'red', icon: AlertCircle }
      case 'pending':
      default:
        return { status: 'Pending Review', color: 'yellow', icon: Clock }
    }
  }

  const verification = getVerificationStatus()
  const VerificationIcon = verification.icon

  const stats = {
    portfolioItems: portfolio?.length || 0,
    totalLeads: leads?.length || 0,
    activeLeads: leads?.filter(l => l.status === 'assigned').length || 0,
    completedLeads: leads?.filter(l => l.status === 'completed').length || 0
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.firstName || 'Partner'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your photography business and connect with clients
        </p>
      </div>

      {/* Verification Status Banner */}
      {profile && profile.verificationStatus !== 'verified' && (
        <div className={`mb-8 p-4 rounded-lg border ${
          verification.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            <VerificationIcon className={`h-5 w-5 mr-3 ${
              verification.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
            }`} />
            <div>
              <h3 className={`font-medium ${
                verification.color === 'yellow' ? 'text-yellow-800' : 'text-red-800'
              }`}>
                Account Verification: {verification.status}
              </h3>
              <p className={`text-sm ${
                verification.color === 'yellow' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {verification.color === 'yellow' 
                  ? 'Your profile is under review. You\'ll be notified once verified.'
                  : 'Your verification was rejected. Please update your profile and resubmit.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.portfolioItems}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Image className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalLeads}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Leads</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeLeads}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completedLeads}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/partner/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-primary-100 rounded-lg mr-4">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-600">Manage your business details</p>
            </div>
          </Link>

          <Link
            to="/partner/portfolio"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Image className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Portfolio</h3>
              <p className="text-sm text-gray-600">Showcase your best work</p>
            </div>
          </Link>

          <Link
            to="/partner/leads"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">View Leads</h3>
              <p className="text-sm text-gray-600">Respond to client inquiries</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Overview */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Profile Overview</h2>
          </div>
          <div className="p-6">
            {profileLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : profile ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.businessName}</h3>
                    <div className="flex items-center space-x-2">
                      <VerificationIcon className={`h-4 w-4 text-${verification.color}-600`} />
                      <span className={`text-sm text-${verification.color}-600`}>
                        {verification.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {profile.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {profile.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {profile.email}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations?.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    )) || <span className="text-sm text-gray-500">No specializations added</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Complete your profile</h3>
                <p className="text-gray-600 mb-4">
                  Add your business details to start receiving leads
                </p>
                <Link to="/partner/profile" className="btn-primary">
                  Setup Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
              <Link
                to="/partner/leads"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {leadsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : leads && leads.length > 0 ? (
              <div className="space-y-4">
                {leads.slice(0, 3).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{lead.eventType}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'responded' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(lead.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {lead.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                <p className="text-gray-600">
                  Complete your profile to start receiving client inquiries
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerDashboard
