import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { clientApi } from '../../services/api'
import { 
  Search, 
  MapPin, 
  Star, 
  Camera, 
  Filter,
  Grid,
  List,
  ChevronDown
} from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const PartnersPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners', searchQuery, selectedCategory, selectedLocation],
    queryFn: () => clientApi.getPartners({
      search: searchQuery,
      category: selectedCategory,
      location: selectedLocation
    })
  })

  const categories = [
    'Wedding', 'Portrait', 'Event', 'Maternity', 'Commercial', 'Fashion',
    'Product', 'Real Estate', 'Corporate', 'Birthday', 'Anniversary'
  ]

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is handled by the query key dependency
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Photographer</h1>
            <p className="text-gray-600 mt-2">Browse through our verified network of professional photographers</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search photographers by name, location, or specialization..."
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 sticky top-4">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronDown className={`h-5 w-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full form-input"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full form-input"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(selectedCategory || selectedLocation || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setSelectedLocation('')
                      setSearchQuery('')
                    }}
                    className="w-full btn-secondary text-sm"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {partners ? `${partners.length} photographers found` : 'Loading...'}
                </h2>
                {(selectedCategory || selectedLocation || searchQuery) && (
                  <p className="text-gray-600 text-sm mt-1">
                    Filtered by: {[selectedCategory, selectedLocation, searchQuery].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Partners Grid/List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : partners && partners.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className={`bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden hover-lift ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Partner Image */}
                    <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-photo'}`}>
                      <img
                        src={partner.profileImage || `https://picsum.photos/400/300?random=${partner.id}`}
                        alt={partner.businessName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Partner Info */}
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{partner.businessName}</h3>
                        {partner.isPromoted && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {partner.location}
                        </div>
                        {partner.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                            {partner.rating} ({partner.reviewCount || 0})
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {partner.description || 'Professional photographer specializing in capturing your special moments.'}
                      </p>

                      {/* Specializations */}
                      {partner.specializations && partner.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {partner.specializations.slice(0, 3).map((spec, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                          {partner.specializations.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{partner.specializations.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Starting from <span className="font-semibold text-gray-900">₹{partner.startingPrice || '10,000'}</span>
                        </div>
                        <Link
                          to={`/partners/${partner.id}`}
                          className="btn-primary btn-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No photographers found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all photographers
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('')
                    setSelectedLocation('')
                    setSearchQuery('')
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnersPage
