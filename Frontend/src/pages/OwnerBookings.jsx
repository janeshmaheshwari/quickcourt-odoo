import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/owner/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.put(`/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedBookings.length === 0) return;
    
    try {
      if (bulkAction === "cancel") {
        if (!window.confirm(`Cancel ${selectedBookings.length} selected bookings?`)) return;
        
        await Promise.all(
          selectedBookings.map(id =>
            axios.put(`/api/bookings/${id}/cancel`, {}, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
          )
        );
        
        setBookings((prev) =>
          prev.map((b) => 
            selectedBookings.includes(b._id) ? { ...b, status: "Cancelled" } : b
          )
        );
      }
      
      setSelectedBookings([]);
      setBulkAction("");
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const toggleBookingSelection = (id) => {
    setSelectedBookings(prev => 
      prev.includes(id) 
        ? prev.filter(bookingId => bookingId !== id)
        : [...prev, id]
    );
  };

  const toggleAllBookings = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(b => b._id));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Booked: "bg-green-100 text-green-800 border-green-200",
      Completed: "bg-blue-100 text-blue-800 border-blue-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Booked: "✓",
      Completed: "🏆",
      Cancelled: "✕",
      Pending: "⏳",
    };
    return icons[status] || "?";
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.court?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      
      const matchesDate = dateFilter === "all" || 
        (dateFilter === "today" && new Date(booking.date).toDateString() === new Date().toDateString()) ||
        (dateFilter === "week" && new Date(booking.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === "month" && new Date(booking.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "user":
          comparison = (a.user?.name || "").localeCompare(b.user?.name || "");
          break;
        case "venue":
          comparison = (a.venue?.name || "").localeCompare(b.venue?.name || "");
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading bookings...</h2>
          <p className="text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
              <p className="text-gray-600">Manage and monitor all court bookings for your venues</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{filteredBookings.length}</div>
                <div className="text-sm text-gray-500">Total Bookings</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {filteredBookings.filter(b => b.status === "Completed").length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="form-label">Search Bookings</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by user, venue, or court..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="form-label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="Booked">Booked</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="form-label">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Sort and Bulk Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="date">Date</option>
                <option value="user">User</option>
                <option value="venue">Venue</option>
                <option value="status">Status</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sortOrder === "asc" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedBookings.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedBookings.length} selected
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Action</option>
                  <option value="cancel">Cancel Selected</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                      onChange={toggleAllBookings}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venue & Court
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-6xl mb-4">📅</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No bookings found</h3>
                      <p className="text-gray-500">Try adjusting your filters or search terms</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking._id)}
                          onChange={() => toggleBookingSelection(booking._id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {booking.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.venue?.name || "Unknown Venue"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.court?.name || "Unknown Court"}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.timeSlot || "No time specified"}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          <span className="mr-1">{getStatusIcon(booking.status)}</span>
                          {booking.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {booking.status === "Booked" && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === "Completed").length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === "Booked").length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === "Pending").length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === "Cancelled").length}
                </div>
                <div className="text-sm text-gray-500">Cancelled</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
