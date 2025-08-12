import { useEffect, useState } from "react";
// import axios from "axios";

// Dummy data for users
const DUMMY_USERS = [
  {
    _id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    _id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    role: "owner",
    status: "active",
    createdAt: "2024-01-10T14:20:00Z"
  },
  {
    _id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    role: "user",
    status: "banned",
    createdAt: "2024-02-01T09:15:00Z"
  },
  {
    _id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    role: "owner",
    status: "active",
    createdAt: "2024-01-20T16:45:00Z"
  },
  {
    _id: "5",
    name: "David Brown",
    email: "david.brown@email.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-05T11:00:00Z"
  },
  {
    _id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    role: "user",
    status: "pending",
    createdAt: "2024-02-10T13:30:00Z"
  },
  {
    _id: "7",
    name: "James Miller",
    email: "james.miller@email.com",
    role: "owner",
    status: "banned",
    createdAt: "2024-01-25T08:20:00Z"
  },
  {
    _id: "8",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    role: "user",
    status: "active",
    createdAt: "2024-02-05T15:10:00Z"
  }
];

// Dummy booking data
const DUMMY_BOOKINGS = {
  "1": [
    {
      _id: "b1",
      facilityName: "Downtown Gym",
      bookingDate: "2024-02-08T10:00:00Z",
      duration: "2 hours",
      totalAmount: 50,
      status: "completed",
      paymentStatus: "paid",
      createdAt: "2024-02-07T14:30:00Z"
    },
    {
      _id: "b2",
      facilityName: "City Sports Complex",
      bookingDate: "2024-02-12T16:00:00Z",
      duration: "1 hour",
      totalAmount: 25,
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: "2024-02-10T09:15:00Z"
    }
  ],
  "2": [
    {
      _id: "b3",
      facilityName: "Elite Fitness Center",
      bookingDate: "2024-02-09T09:00:00Z",
      duration: "3 hours",
      totalAmount: 75,
      status: "completed",
      paymentStatus: "paid",
      createdAt: "2024-02-08T12:00:00Z"
    }
  ],
  "3": [
    {
      _id: "b4",
      facilityName: "Wellness Hub",
      bookingDate: "2024-01-30T14:00:00Z",
      duration: "1.5 hours",
      totalAmount: 40,
      status: "cancelled",
      paymentStatus: "refunded",
      createdAt: "2024-01-28T10:45:00Z"
    },
    {
      _id: "b5",
      facilityName: "Active Life Gym",
      bookingDate: "2024-01-25T11:00:00Z",
      duration: "2 hours",
      totalAmount: 60,
      status: "completed",
      paymentStatus: "paid",
      createdAt: "2024-01-23T16:20:00Z"
    }
  ],
  "4": [
    {
      _id: "b6",
      facilityName: "Premier Sports Club",
      bookingDate: "2024-02-11T18:00:00Z",
      duration: "2.5 hours",
      totalAmount: 80,
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: "2024-02-09T13:30:00Z"
    }
  ],
  "6": [
    {
      _id: "b7",
      facilityName: "Community Center",
      bookingDate: "2024-02-06T12:00:00Z",
      duration: "1 hour",
      totalAmount: 20,
      status: "pending",
      paymentStatus: "pending",
      createdAt: "2024-02-05T08:15:00Z"
    }
  ],
  "8": [
    {
      _id: "b8",
      facilityName: "Metro Fitness",
      bookingDate: "2024-02-13T07:00:00Z",
      duration: "1.5 hours",
      totalAmount: 35,
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: "2024-02-11T19:45:00Z"
    },
    {
      _id: "b9",
      facilityName: "Urban Wellness",
      bookingDate: "2024-02-07T20:00:00Z",
      duration: "1 hour",
      totalAmount: 30,
      status: "completed",
      paymentStatus: "paid",
      createdAt: "2024-02-06T11:30:00Z"
    }
  ]
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter dummy data based on search and filters
      let filteredUsers = DUMMY_USERS;
      
      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (roleFilter) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }
      
      if (statusFilter) {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
      }
      
      setUsers(filteredUsers);
    } catch (err) {
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    const confirmMessage = newStatus === "banned" 
      ? "Are you sure you want to ban this user?" 
      : "Are you sure you want to unban this user?";
    
    if (!window.confirm(confirmMessage)) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the user status in dummy data
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
      
      // Also update in DUMMY_USERS for persistence during session
      const userIndex = DUMMY_USERS.findIndex(user => user._id === id);
      if (userIndex !== -1) {
        DUMMY_USERS[userIndex].status = newStatus;
      }
    } catch {
      alert("Error updating user status");
    }
  };

  const fetchBookingHistory = async (userId, userName) => {
    try {
      setLoadingBookings(true);
      setSelectedUser(userName);
      setShowBookingModal(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Get dummy booking data for this user
      const userBookings = DUMMY_BOOKINGS[userId] || [];
      setBookingHistory(userBookings);
    } catch (err) {
      alert("Error fetching booking history");
      setBookingHistory([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedUser(null);
    setBookingHistory([]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'banned': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

      {/* Enhanced Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Users
          </label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="owner">Facility Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {/* Ban/Unban Button */}
                      {user.status === "active" ? (
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                          onClick={() => handleBanToggle(user._id, user.status)}
                        >
                          Ban User
                        </button>
                      ) : user.status === "banned" ? (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                          onClick={() => handleBanToggle(user._id, user.status)}
                        >
                          Unban User
                        </button>
                      ) : null}
                      
                      {/* View Booking History Button */}
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        onClick={() => fetchBookingHistory(user._id, user.name)}
                      >
                        View Bookings
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan="4">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking History Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Booking History - {selectedUser}
              </h2>
              <button
                onClick={closeBookingModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {loadingBookings ? (
                <div className="text-center py-8">Loading booking history...</div>
              ) : bookingHistory.length > 0 ? (
                <div className="space-y-4">
                  {bookingHistory.map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {booking.facilityName || booking.facility?.name || 'Facility Name Not Available'}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <strong>Booking Date:</strong> {formatDate(booking.bookingDate || booking.createdAt)}
                            </div>
                            <div>
                              <strong>Duration:</strong> {booking.duration || 'N/A'}
                            </div>
                            <div>
                              <strong>Total Amount:</strong> ${booking.totalAmount || booking.amount || 'N/A'}
                            </div>
                            <div>
                              <strong>Payment Status:</strong> {booking.paymentStatus || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getBookingStatusColor(booking.status)}`}>
                            {booking.status || 'Unknown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(booking.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No booking history found for this user.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}