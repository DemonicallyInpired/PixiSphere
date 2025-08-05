import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { 
  Camera, 
  Menu, 
  X, 
  Home, 
  User, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Users,
  Shield,
  BarChart3,
  MapPin,
  Tag,
  Star,
  Briefcase,
  Image
} from 'lucide-react'

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: `/${user.role}`, icon: Home },
    ]

    switch (user.role) {
      case 'client':
        return [
          ...baseItems,
          { name: 'Submit Inquiry', href: '/client/submit-inquiry', icon: FileText },
          { name: 'My Inquiries', href: '/client/inquiries', icon: MessageSquare },
        ]
      
      case 'partner':
        return [
          ...baseItems,
          { name: 'Profile', href: '/partner/profile', icon: User },
          { name: 'Portfolio', href: '/partner/portfolio', icon: Image },
          { name: 'Leads', href: '/partner/leads', icon: Briefcase },
        ]
      
      case 'admin':
        return [
          ...baseItems,
          { name: 'Verifications', href: '/admin/verifications', icon: Shield },
          { name: 'Reviews', href: '/admin/reviews', icon: Star },
          { name: 'Categories', href: '/admin/categories', icon: Tag },
          { name: 'Locations', href: '/admin/locations', icon: MapPin },
        ]
      
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  const isActive = (href) => {
    return location.pathname === href
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gradient-primary">Pixisphere</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName || user.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4 text-gray-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold text-gradient-primary">Pixisphere</span>
            </Link>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default DashboardLayout
