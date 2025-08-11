import { useState, useEffect } from "react";

export default function BookingCalendar() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings([
      { id: 1, court: "Court 1", date: "2025-08-12", time: "10:00 AM" },
      { id: 2, court: "Court 2", date: "2025-08-13", time: "3:00 PM" },
    ]);
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Booking Calendar</h2>
      <ul className="space-y-3">
        {bookings.map((b) => (
          <li key={b.id} className="border p-3 rounded">
            <strong>{b.court}</strong> - {b.date} at {b.time}
          </li>
        ))}
      </ul>
    </div>
  );
}
