import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../utils/logout";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className={`text-2xl font-bold ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              QuickCourt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-yellow-500 font-semibold' 
                  : isScrolled ? 'text-gray-700 hover:text-yellow-500' : 'text-white hover:text-yellow-300'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/venues" 
              className={`transition-colors duration-200 ${
                isActive('/venues') 
                  ? 'text-yellow-500 font-semibold' 
                  : isScrolled ? 'text-gray-700 hover:text-yellow-500' : 'text-white hover:text-yellow-300'
              }`}
            >
              Venues
            </Link>
            
            {!user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-yellow-500' 
                      : 'text-white hover:text-yellow-300'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {user.role === "customer" && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isScrolled ? 'text-gray-700 hover:text-yellow-500' : 'text-white hover:text-yellow-300'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isScrolled ? 'text-gray-700 hover:text-yellow-500' : 'text-white hover:text-yellow-300'
                      }`}
                    >
                      My Bookings
                    </Link>
                  </>
                )}
                
                {user.role === "owner" && (
                  <>
                    <Link 
                      to="/owner/dashboard" 
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isScrolled ? 'text-gray-700 hover:text-yellow-500' : 'text-white hover:text-yellow-300'
                      }`}
                    >
                      Owner Panel
                    </Link>
                  </>
                )}
                
                {user.role === "admin" && (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isScrolled ? 'text-gray-700 hover:text-yellow-500' : 'text-white hover:text-yellow-300'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  </>
                )}
                
                <div className="relative group">
                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isScrolled 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}>
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {user.role === "customer" ? "U" : user.role === "owner" ? "O" : "A"}
                      </span>
                    </div>
                    <span className="hidden lg:block capitalize">{user.role}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right border border-gray-100">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{user.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
              isScrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden border-t shadow-lg ${
            isScrolled 
              ? 'bg-white border-gray-200' 
              : 'bg-white/95 backdrop-blur-md border-white/20'
          }`}>
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/" 
                className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive('/') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/venues" 
                className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive('/venues') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Venues
              </Link>
              
              {!user ? (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <Link 
                    to="/login" 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold text-center hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  {user.role === "customer" && (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/my-bookings" 
                        className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                    </>
                  )}
                  
                  {user.role === "owner" && (
                    <Link 
                      to="/owner/dashboard" 
                      className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Owner Panel
                    </Link>
                  )}
                  
                  {user.role === "admin" && (
                    <Link 
                      to="/admin/dashboard" 
                      className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
