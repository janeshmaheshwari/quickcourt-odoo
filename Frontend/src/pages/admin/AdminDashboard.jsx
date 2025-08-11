import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStats(data);
    } catch (err) {
      setError("Error fetching admin stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading admin dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard label="Facility Owners" value={stats.totalOwners} color="green" />
        <StatCard label="Total Bookings" value={stats.totalBookings} color="purple" />
        <StatCard label="Active Courts" value={stats.totalActiveCourts} color="orange" />
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Most Active Sports</h2>
        <ul className="list-disc pl-6">
          {stats.mostActiveSports?.length > 0 ? (
            stats.mostActiveSports.map((sport, idx) => (
              <li key={idx} className="capitalize">{sport}</li>
            ))
          ) : (
            <li>No data</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className={`rounded-lg p-4 shadow ${colorClasses[color] || ""}`}>
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}
