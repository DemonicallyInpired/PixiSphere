import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import { 
  Users, 
  Shield, 
  Star, 
  BarChart3, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Tag,
  FileText
} from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminDashboard = () => {
  const { user } = useAuthStore()
  
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['admin-kpis'],
    queryFn: adminApi.getKPIs
  })

  const { data: verifications, isLoading: verificationsLoading } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: adminApi.getVerifications
  })

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: adminApi.getReviews
  })

  const stats = kpis || {
    totalUsers: 0,
    totalPartners: 0,
    totalInquiries: 0,
    totalLeads: 0,
    pendingVerifications: 0,
    pendingReviews: 0
  }

  const pendingVerifications = verifications?.filter(v => v.status === 'pending') || []
  const pendingReviews = reviews?.filter(r => r.status === 'pending') || []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage platform operations and moderate content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Partners</p>
              <p className="text-2xl font-bold text-primary-600">{stats.totalPartners}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inquiries</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalInquiries}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Leads</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalLeads}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/verifications"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-yellow-100 rounded-lg mr-4">
              <Shield className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Verifications</h3>
              <p className="text-sm text-gray-600">Review partner applications</p>
            </div>
          </Link>

          <Link
            to="/admin/reviews"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-orange-100 rounded-lg mr-4">
              <Star className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Reviews</h3>
              <p className="text-sm text-gray-600">Moderate user reviews</p>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Categories</h3>
              <p className="text-sm text-gray-600">Manage service categories</p>
            </div>
          </Link>

          <Link
            to="/admin/locations"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Locations</h3>
              <p className="text-sm text-gray-600">Manage service locations</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Verifications */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Pending Verifications</h2>
              <Link
                to="/admin/verifications"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {verificationsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : pendingVerifications.length > 0 ? (
              <div className="space-y-4">
                {pendingVerifications.slice(0, 5).map((verification) => (
                  <div
                    key={verification.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{verification.businessName}</h3>
                        <p className="text-sm text-gray-600">{verification.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pending
                      </span>
                      <Link
                        to={`/admin/verifications/${verification.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending verifications</h3>
                <p className="text-gray-600">All partner applications have been reviewed</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Pending Reviews</h2>
              <Link
                to="/admin/reviews"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : pendingReviews.length > 0 ? (
              <div className="space-y-4">
                {pendingReviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">by {review.clientName}</span>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{review.comment}</p>
                    <Link
                      to={`/admin/reviews/${review.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending reviews</h3>
                <p className="text-gray-600">All reviews have been moderated</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Health */}
      <div className="mt-8 bg-white rounded-xl shadow-soft border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Platform Health</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">System Status</h3>
              <p className="text-green-600 font-medium">All Systems Operational</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-blue-600 font-medium">Excellent</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Growth</h3>
              <p className="text-purple-600 font-medium">+12% This Month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
