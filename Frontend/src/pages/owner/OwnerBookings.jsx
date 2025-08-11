import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`/api/owner/bookings?status=${filter}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(data);
    } catch (err) {
      setError("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading bookings...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Facility Bookings</h1>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="Booked">Booked</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Court</th>
              <th className="p-3 text-left">Sport</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b">
                <td className="p-3">{b.userName}</td>
                <td className="p-3">{b.courtName}</td>
                <td className="p-3">{b.sportType}</td>
                <td className="p-3">{new Date(b.date).toLocaleDateString()}</td>
                <td className="p-3">{b.time}</td>
                <td
                  className={`p-3 font-medium ${
                    b.status === "Cancelled"
                      ? "text-red-500"
                      : b.status === "Completed"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  {b.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
