import { useState, useEffect } from "react";
import axios from "axios";

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/owner/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching owner stats", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Facility Owner Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="text-gray-500">Total Bookings</p>
          <h2 className="text-2xl font-bold">{stats.totalBookings}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="text-gray-500">Active Courts</p>
          <h2 className="text-2xl font-bold">{stats.activeCourts}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="text-gray-500">Earnings</p>
          <h2 className="text-2xl font-bold">₹{stats.earnings}</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <a
          href="/owner/bookings"
          className="bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600"
        >
          📅 View Bookings
        </a>
        <a
          href="/owner/courts"
          className="bg-green-500 text-white p-4 rounded-lg shadow hover:bg-green-600"
        >
          🏟 Manage Courts
        </a>
        <a
          href="/owner/availability"
          className="bg-yellow-500 text-white p-4 rounded-lg shadow hover:bg-yellow-600"
        >
          ⏱ Manage Availability
        </a>
      </div>
    </div>
  );
}
