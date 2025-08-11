import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookCourt() {
  const { id } = useParams(); // Court ID
  const navigate = useNavigate();

  const [court, setCourt] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourt = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/courts/${id}`);
      setCourt(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching court details", error);
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!date || !timeSlot) {
      alert("Please select a date and time slot.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        { courtId: id, date, timeSlot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking confirmed!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Booking error", error);
      alert("Booking failed. Try another slot.");
    }
  };

  useEffect(() => {
    fetchCourt();
  }, [id]);

  if (loading) return <p className="p-6">Loading court details...</p>;
  if (!court) return <p className="p-6">Court not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{court.name}</h1>
      <p className="text-gray-600">{court.sportType}</p>
      <p className="mt-1 font-semibold">₹{court.pricePerHour}/hr</p>

      {/* Date Picker */}
      <div className="mt-6">
        <label className="block text-sm font-medium">Select Date</label>
        <input
          type="date"
          className="border p-2 rounded w-full mt-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Time Slot Picker */}
      <div className="mt-6">
        <label className="block text-sm font-medium">Select Time Slot</label>
        <select
          className="border p-2 rounded w-full mt-1"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option value="">-- Choose a slot --</option>
          {court.availableSlots?.map((slot, idx) => (
            <option key={idx} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      {/* Confirm Booking Button */}
      <button
        onClick={handleBooking}
        className="mt-6 bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500"
      >
        Confirm Booking
      </button>
    </div>
  );
}
