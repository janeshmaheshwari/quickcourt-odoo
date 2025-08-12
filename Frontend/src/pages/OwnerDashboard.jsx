import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Calendar, TrendingUp, Clock, Users } from "lucide-react";

// Dummy data for development
const dummyStats = {
  totalBookings: 1247,
  activeCourts: 12,
  earnings: 185000,
  monthlyGrowth: 15.3,
  todayBookings: 28
};

const bookingTrendsData = [
  { period: "Week 1", bookings: 45, earnings: 22500 },
  { period: "Week 2", bookings: 52, earnings: 28000 },
  { period: "Week 3", bookings: 38, earnings: 19000 },
  { period: "Week 4", bookings: 67, earnings: 35500 },
  { period: "Week 5", bookings: 59, earnings: 31000 },
  { period: "Week 6", bookings: 72, earnings: 42000 },
  { period: "Week 7", bookings: 68, earnings: 38500 }
];

const earningsSummaryData = [
  { name: "Court Bookings", value: 145000, color: "#3B82F6" },
  { name: "Equipment Rental", value: 25000, color: "#10B981" },
  { name: "Coaching Sessions", value: 15000, color: "#F59E0B" }
];

const peakHoursData = [
  { hour: "6 AM", bookings: 12 },
  { hour: "7 AM", bookings: 25 },
  { hour: "8 AM", bookings: 38 },
  { hour: "9 AM", bookings: 42 },
  { hour: "10 AM", bookings: 35 },
  { hour: "11 AM", bookings: 28 },
  { hour: "12 PM", bookings: 45 },
  { hour: "1 PM", bookings: 52 },
  { hour: "2 PM", bookings: 38 },
  { hour: "3 PM", bookings: 46 },
  { hour: "4 PM", bookings: 58 },
  { hour: "5 PM", bookings: 72 },
  { hour: "6 PM", bookings: 85 },
  { hour: "7 PM", bookings: 95 },
  { hour: "8 PM", bookings: 78 },
  { hour: "9 PM", bookings: 45 },
  { hour: "10 PM", bookings: 22 }
];

const upcomingBookings = [
  { time: "9:00 AM", court: "Court A", player: "Raj Patel", duration: "1 hour" },
  { time: "10:30 AM", court: "Court C", player: "Priya Sharma", duration: "1.5 hours" },
  { time: "2:00 PM", court: "Court B", player: "Amit Kumar", duration: "2 hours" },
  { time: "4:30 PM", court: "Court D", player: "Sneha Singh", duration: "1 hour" },
  { time: "6:00 PM", court: "Court A", player: "Vikram Joshi", duration: "1.5 hours" }
];

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('weekly'); // daily, weekly, monthly
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulate API call with dummy data
    setTimeout(() => {
      setStats(dummyStats);
      setLoading(false);
    }, 1000);

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Owner! 👋</h1>
              <p className="text-blue-100 text-lg">{formatDate(currentTime)}</p>
              <p className="text-blue-200">Current time: {formatTime(currentTime)}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100">Today's Bookings</p>
              <p className="text-4xl font-bold">{stats.todayBookings}</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.totalBookings.toLocaleString()}</h3>
              </div>
              <Calendar className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Courts</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.activeCourts}</h3>
              </div>
              <Users className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Monthly Earnings</p>
                <h3 className="text-3xl font-bold text-gray-800">₹{stats.earnings.toLocaleString()}</h3>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Growth Rate</p>
                <h3 className="text-3xl font-bold text-gray-800">+{stats.monthlyGrowth}%</h3>
              </div>
              <Clock className="h-12 w-12 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Booking Calendar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {upcomingBookings.map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-800">{booking.time}</p>
                      <p className="text-sm text-gray-500">{booking.court}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{booking.player}</p>
                    <p className="text-sm text-gray-500">{booking.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={earningsSummaryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {earningsSummaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Occupancy Rate</span>
                <span className="font-bold text-green-600">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Session</span>
                <span className="font-bold">1.5 hrs</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Rating</span>
                <span className="font-bold text-yellow-500">4.8 ⭐</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Peak Hour</span>
                <span className="font-bold">6-8 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Trends */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Booking Trends</h3>
              <div className="flex space-x-2">
                {['daily', 'weekly', 'monthly'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-lg text-sm capitalize ${
                      viewMode === mode 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Peak Hours Heatmap */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Peak Booking Hours</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#F59E0B" 
                  fill="url(#colorBookings)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

    
      </div>
    </div>
  );
}