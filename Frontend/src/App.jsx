import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OTPVerification from "./pages/shared/OTPVerification";
import Venues from "./pages/Venues";
import VenueDetails from "./pages/VenueDetails";
import BookCourt from "./pages/BookCourt";
import MyBookings from "./pages/customer/MyBookings";
import UserDashboard from "./pages/UserDashboard";
import PaymentSimulation from "./pages/shared/PaymentSimulation";
import OwnerFacilities from "./pages/owner/OwnerFacilities";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerCourts from "./pages/owner/OwnerCourts";
import BookingCalendar from "./pages/owner/BookingCalendar";
import OwnerBookings from "./pages/OwnerBookings";
import OwnerProfile from "./pages/owner/OwnerProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacilityApproval from "./pages/admin/FacilityApproval";
import UserManagement from "./pages/admin/UserManagement";
import ReportsModeration from "./pages/admin/ReportsModeration";
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Check for existing user session
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUser({ token, role });
    }

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <LoadingSpinner 
            size="xl" 
            text="Preparing QuickCourt..." 
            variant="primary"
            showText={true}
          />
          <div className="mt-8 space-y-2">
            <h2 className="text-2xl font-bold text-gray-700 font-display">Welcome to QuickCourt</h2>
            <p className="text-gray-500">Your premier destination for booking sports courts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <Navbar user={user} setUser={setUser} />
          <main className="pt-16 lg:pt-20 pb-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venue/:id" element={<VenueDetails />} />

              {/* Customer Protected Routes */}
              <Route
                path="/book/:id"
                element={
                  <ProtectedRoute role="customer">
                    <BookCourt />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute role="customer">
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute role="customer">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute role="customer">
                    <PaymentSimulation />
                  </ProtectedRoute>
                }
              />

              {/* Owner Protected Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/facilities"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerFacilities />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/courts"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerCourts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/time-slots"
                element={
                  <ProtectedRoute role="owner">
                    <BookingCalendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/bookings"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/profile"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/facility-approvals"
                element={
                  <ProtectedRoute role="admin">
                    <FacilityApproval />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute role="admin">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute role="admin">
                    <ReportsModeration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute role="admin">
                    <AdminProfile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          
          {/* Enhanced Footer */}
          <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-2xl font-bold text-primary-400 font-display">QuickCourt</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Your premier destination for booking sports courts and facilities. 
                    Experience the future of sports facility management.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
                  <ul className="space-y-3">
                    <li>
                      <a href="/" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group">
                        <span className="w-1 h-1 bg-primary-400 rounded-full group-hover:w-2 transition-all duration-200"></span>
                        <span>Home</span>
                      </a>
                    </li>
                    <li>
                      <a href="/venues" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group">
                        <span className="w-1 h-1 bg-primary-400 rounded-full group-hover:w-2 transition-all duration-200"></span>
                        <span>Venues</span>
                      </a>
                    </li>
                    <li>
                      <a href="/login" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group">
                        <span className="w-1 h-1 bg-primary-400 rounded-full group-hover:w-2 transition-all duration-200"></span>
                        <span>Login</span>
                      </a>
                    </li>
                    <li>
                      <a href="/signup" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group">
                        <span className="w-1 h-1 bg-primary-400 rounded-full group-hover:w-2 transition-all duration-200"></span>
                        <span>Sign Up</span>
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group">
                        <span className="w-1 h-1 bg-primary-400 rounded-full group-hover:w-2 transition-all duration-200"></span>
                        <span>Help Center</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group">
                        <span className="w-1 h-1 bg-primary-400 rounded-full group-hover:w-2 transition-all duration-200"></span>
                        <span>Contact Us</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group">
                        <span className="w-1 h-1 bg-primary-400 rounded-full group-hover:w-2 transition-all duration-200"></span>
                        <span>Privacy Policy</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 group">
                        <span className="w-1 h-1 bg-primary-400 rounded-full group-hover:w-2 transition-all duration-200"></span>
                        <span>Terms of Service</span>
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">Connect</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-primary-400 hover:bg-gray-700 transition-all duration-200 transform hover:scale-110">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-primary-400 hover:bg-gray-700 transition-all duration-200 transform hover:scale-110">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-primary-400 hover:bg-gray-700 transition-all duration-200 transform hover:scale-110">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </a>
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Newsletter</h5>
                    <div className="flex space-x-2">
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors duration-200">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                <p className="text-gray-400 text-sm">
                  &copy; 2024 QuickCourt. All rights reserved. | Built with ❤️ for sports enthusiasts
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
