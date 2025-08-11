import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../utils/logout";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-200' 
        : 'bg-gradient-to-r from-secondary-900/95 to-secondary-800/95 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMenu}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-110">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className={`text-2xl lg:text-3xl font-bold font-display transition-all duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              QuickCourt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative transition-all duration-300 group ${
                isActive('/') 
                  ? 'text-primary-500 font-semibold' 
                  : isScrolled ? 'text-gray-700 hover:text-primary-500' : 'text-white hover:text-primary-300'
              }`}
            >
              Home
              {isActive('/') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full animate-scale-in"></div>
              )}
            </Link>
            <Link 
              to="/venues" 
              className={`relative transition-all duration-300 group ${
                isActive('/venues') 
                  ? 'text-primary-500 font-semibold' 
                  : isScrolled ? 'text-gray-700 hover:text-primary-500' : 'text-white hover:text-primary-300'
              }`}
            >
              Venues
              {isActive('/venues') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full animate-scale-in"></div>
              )}
            </Link>
            
            {!user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-primary-500 hover:bg-gray-100' 
                      : 'text-white hover:text-primary-300 hover:bg-white/10'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-primary px-6 py-2 text-sm lg:text-base shadow-lg hover:shadow-glow-lg transform hover:scale-105"
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
                      className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                        isScrolled ? 'text-gray-700 hover:text-primary-500 hover:bg-gray-100' : 'text-white hover:text-primary-300 hover:bg-white/10'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                        isScrolled ? 'text-gray-700 hover:text-primary-500 hover:bg-gray-100' : 'text-white hover:text-primary-300 hover:bg-white/10'
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
                      className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                        isScrolled ? 'text-gray-700 hover:text-primary-500 hover:bg-gray-100' : 'text-white hover:text-primary-300 hover:bg-white/10'
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
                      className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                        isScrolled ? 'text-gray-700 hover:text-primary-500 hover:bg-gray-100' : 'text-white hover:text-primary-300 hover:bg-white/10'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  </>
                )}
                
                <div className="relative">
                  <button 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                      isScrolled 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-semibold text-white">
                        {user.role === "customer" ? "U" : user.role === "owner" ? "O" : "A"}
                      </span>
                    </div>
                    <span className="hidden xl:block capitalize">{user.role}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-large opacity-0 invisible transform scale-95 origin-top-right border border-gray-100 transition-all duration-200 ${
                    isDropdownOpen ? 'opacity-100 visible scale-100' : ''
                  }`}>
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{user.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg mx-2 mb-1"
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
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
              isScrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute inset-0 transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16" />
                </svg>
              </span>
              <span className={`absolute inset-0 transform transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                </svg>
              </span>
              <span className={`absolute inset-0 transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-0' : 'translate-y-1'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" />
                </svg>
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`py-6 space-y-4 transition-all duration-500 ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
            <Link 
              to="/" 
              className={`block py-3 px-4 rounded-xl transition-all duration-300 ${
                isActive('/') ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Home</span>
              </div>
            </Link>
            
            <Link 
              to="/venues" 
              className={`block py-3 px-4 rounded-xl transition-all duration-300 ${
                isActive('/venues') ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">Venues</span>
              </div>
            </Link>
            
            {!user ? (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Link 
                  to="/login" 
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  onClick={closeMenu}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 5v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Sign In</span>
                  </div>
                </Link>
                <Link 
                  to="/signup" 
                  className="block btn-primary py-3 px-4 text-center font-medium"
                  onClick={closeMenu}
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
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium">Dashboard</span>
                      </div>
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">My Bookings</span>
                      </div>
                    </Link>
                  </>
                )}
                
                {user.role === "owner" && (
                  <Link 
                    to="/owner/dashboard" 
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Owner Panel</span>
                    </div>
                  </Link>
                )}
                
                {user.role === "admin" && (
                  <Link 
                    to="/admin/dashboard" 
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="font-medium">Admin Panel</span>
                    </div>
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Sign Out</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
