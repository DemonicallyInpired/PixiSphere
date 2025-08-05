import { Link } from 'react-router-dom'
import { Camera, Search, Shield, Star, Users, ArrowRight, CheckCircle } from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Discovery',
      description: 'AI-powered matching connects you with the perfect photographers based on your needs and location.'
    },
    {
      icon: Shield,
      title: 'Verified Partners',
      description: 'All photographers go through rigorous verification to ensure quality and professionalism.'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Browse portfolios, read reviews, and choose from top-rated photographers in your area.'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of satisfied clients and professional photographers across India.'
    }
  ]

  const categories = [
    { name: 'Wedding', image: 'https://picsum.photos/400/300?random=1', count: '500+' },
    { name: 'Portrait', image: 'https://picsum.photos/400/300?random=2', count: '300+' },
    { name: 'Event', image: 'https://picsum.photos/400/300?random=3', count: '200+' },
    { name: 'Maternity', image: 'https://picsum.photos/400/300?random=4', count: '150+' },
    { name: 'Commercial', image: 'https://picsum.photos/400/300?random=5', count: '100+' },
    { name: 'Fashion', image: 'https://picsum.photos/400/300?random=6', count: '80+' }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Bride',
      content: 'Pixisphere helped us find the perfect wedding photographer. The entire process was seamless and the results were beyond our expectations!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Event Organizer',
      content: 'As an event planner, I rely on Pixisphere to connect with reliable photographers. The quality and professionalism are unmatched.',
      rating: 5
    },
    {
      name: 'Anita Desai',
      role: 'New Mother',
      content: 'The maternity shoot was beautiful. The photographer understood exactly what we wanted and delivered stunning photos.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Capture Your Perfect
              <span className="block text-accent-300">Moments</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
              Connect with India's top verified photographers and studios. From weddings to portraits, find the perfect match for your special moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/partners" className="btn-xl bg-white text-primary-700 hover:bg-gray-100 font-semibold">
                Browse Photographers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/auth/signup" className="btn-xl btn-outline border-white text-white hover:bg-white hover:text-primary-700">
                Join as Partner
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-400/20 rounded-full animate-bounce-subtle"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary-400/20 rounded-full animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Pixisphere?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and book the perfect photographer for any occasion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center group hover-lift">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Discover photographers specialized in your type of event
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/partners?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 hover-lift"
              >
                <div className="aspect-photo">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                  <p className="text-primary-200">{category.count} photographers</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of happy clients across India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover-lift">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Photographer?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied clients and start your photography journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/client/submit-inquiry" className="btn-xl bg-white text-primary-700 hover:bg-gray-100 font-semibold">
              Submit Your Inquiry
            </Link>
            <Link to="/partners" className="btn-xl btn-outline border-white text-white hover:bg-white hover:text-primary-700">
              Browse Photographers
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
