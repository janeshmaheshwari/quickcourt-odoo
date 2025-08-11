import { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/my", {
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

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.put(
        `/api/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "Cancelled" } : b
        )
      );
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  if (loading) return <div className="p-6">Loading your bookings...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{b.venueName}</h2>
                <p className="text-sm text-gray-600">
                  {b.courtName} • {b.sportType}
                </p>
                <p className="text-sm">
                  {new Date(b.date).toLocaleDateString()} • {b.time}
                </p>
                <span
                  className={`text-sm font-medium ${
                    b.status === "Cancelled"
                      ? "text-red-500"
                      : b.status === "Completed"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              {b.status === "Confirmed" && (
                <button
                  onClick={() => handleCancel(b._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
