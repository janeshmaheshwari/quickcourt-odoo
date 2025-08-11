import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularVenues } from "../services/api";

export default function Home() {
  const [popularVenues, setPopularVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalBookings: 0,
    happyUsers: 0
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const data = await getPopularVenues(6);
        setPopularVenues(data.venues || []);
        
        // Update stats based on real data
        setStats({
          totalVenues: data.total || 0,
          totalBookings: data.venues?.reduce((sum, venue) => sum + (venue.bookingCount || 0), 0) || 0,
          happyUsers: Math.floor((data.venues?.reduce((sum, venue) => sum + (venue.bookingCount || 0), 0) || 0) * 0.8)
        });
      } catch (error) {
        console.error("Error fetching venues", error);
        setError("Failed to load popular venues");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenues();
  }, []);

  const features = [
    {
      icon: "🏟️",
      title: "Premium Courts",
      description: "Access to the best sports facilities in your area with professional-grade equipment and maintenance"
    },
    {
      icon: "⚡",
      title: "Instant Booking",
      description: "Book your preferred time slot in seconds with real-time availability and instant confirmation"
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Book on the go with our mobile-optimized platform that works seamlessly on all devices"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive rates and transparent pricing with no hidden fees or surprise charges"
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-red-500 text-6xl mb-4 animate-bounce-gentle">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-600 via-secondary-700 to-secondary-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-1000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 pb-24 lg:pb-32 pt-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-slide-up">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight font-display">
                Book Your Next
                <span className="block text-primary-400 animate-pulse-slow">Game Today</span>
              </h1>
            </div>
            
            <div className="animate-slide-up animation-delay-200">
              <p className="text-xl lg:text-2xl mb-8 text-secondary-100 leading-relaxed text-balance">
                Discover and book premium sports courts and facilities in your area. 
                From basketball to tennis, find the perfect venue for your game.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
              <Link
                to="/venues"
                className="btn-primary text-lg px-8 py-4 transform hover:scale-105"
              >
                Explore Venues
              </Link>
              <Link
                to="/signup"
                className="btn-secondary text-lg px-8 py-4 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: stats.totalVenues, label: "Premium Venues", color: "secondary", icon: "🏟️" },
              { number: stats.totalBookings, label: "Successful Bookings", color: "green", icon: "✅" },
              { number: stats.happyUsers, label: "Happy Users", color: "accent", icon: "😊" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`text-6xl mb-4 animate-bounce-gentle`}>{stat.icon}</div>
                <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>{stat.number}+</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-display">
              Why Choose <span className="gradient-text">QuickCourt</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              We've built the platform that makes booking sports facilities as easy as ordering food
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-hover p-8 text-center animate-slide-up group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-balance">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-display">
              Popular <span className="gradient-text">Venues</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              Discover the most loved sports facilities in your area
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 rounded-2xl p-6 animate-pulse"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : popularVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularVenues.map((venue, index) => (
                <div 
                  key={venue._id} 
                  className="card-hover overflow-hidden animate-slide-up group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={venue.images?.[0] || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                      alt={venue.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Popular
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {venue.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-primary-400">★</span>
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{venue.location || "City Center"}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary-600">
                        ₹{venue.pricePerHour || 500}
                        <span className="text-sm text-gray-500 font-normal">/hr</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {venue.bookingCount || 0} bookings
                      </div>
                    </div>
                    
                    <Link
                      to={`/venue/${venue._id}`}
                      className="w-full btn-primary py-3 px-6 transform hover:scale-105 block text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-slide-up">
              <div className="text-gray-400 text-6xl mb-4 animate-bounce-gentle">🏟️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No venues available yet</h3>
              <p className="text-gray-500">Check back soon for new sports facilities!</p>
            </div>
          )}
          
          <div className="text-center mt-16 animate-slide-up animation-delay-600">
            <Link
              to="/venues"
              className="btn-accent text-lg px-8 py-4 inline-flex items-center space-x-2 transform hover:scale-105"
            >
              <span>View All Venues</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-secondary-600 to-secondary-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <div className="animate-slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-display">
              Ready to Start <span className="text-primary-300">Playing</span>?
            </h2>
          </div>
          
          <div className="animate-slide-up animation-delay-200">
            <p className="text-xl mb-8 text-secondary-100 text-balance">
              Join thousands of sports enthusiasts who trust QuickCourt for your facility bookings
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105"
            >
              Create Account
            </Link>
            <Link
              to="/venues"
              className="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900 transform hover:scale-105"
            >
              Browse Venues
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
