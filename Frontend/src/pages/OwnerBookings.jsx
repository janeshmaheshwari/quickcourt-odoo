import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyData = [
        {
          _id: "1",
          user: { name: "John Doe" },
          venue: { name: "Central Sports Complex" },
          court: { name: "Court A" },
          date: "2025-08-15T00:00:00.000Z",
          timeSlot: "10:00 AM - 11:00 AM",
          status: "Booked",
        },
        {
          _id: "2",
          user: { name: "Jane Smith" },
          venue: { name: "Downtown Arena" },
          court: { name: "Court B" },
          date: "2025-08-16T00:00:00.000Z",
          timeSlot: "3:00 PM - 4:00 PM",
          status: "Completed",
        },
        {
          _id: "3",
          user: { name: "Mike Johnson" },
          venue: { name: "Greenfield Stadium" },
          court: { name: "Court C" },
          date: "2025-08-17T00:00:00.000Z",
          timeSlot: "6:00 PM - 7:00 PM",
          status: "Cancelled",
        },
      ];
      setBookings(dummyData);
      setLoading(false);
    }, 1000);

    // Uncomment this when API is ready
    // fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/owner/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const bookingsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : [];
      setBookings(bookingsArray);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: "Cancelled" } : b
      )
    );
  };

  const statusColors = {
    Booked: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Owner Bookings</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 font-medium text-gray-600">User</th>
              <th className="p-3 font-medium text-gray-600">Venue</th>
              <th className="p-3 font-medium text-gray-600">Court</th>
              <th className="p-3 font-medium text-gray-600">Date</th>
              <th className="p-3 font-medium text-gray-600">Time</th>
              <th className="p-3 font-medium text-gray-600">Status</th>
              <th className="p-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{booking.user?.name || "N/A"}</td>
                  <td className="p-3">{booking.venue?.name || "N/A"}</td>
                  <td className="p-3">{booking.court?.name || "N/A"}</td>
                  <td className="p-3">
                    {booking.date
                      ? new Date(booking.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">{booking.timeSlot || "N/A"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[booking.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    {booking.status === "Booked" && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
