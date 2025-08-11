import { useState, useEffect } from "react";

export default function ReportsModeration() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch from API
    setReports([
      { id: 1, user: "Jane", facility: "Court 1", reason: "Fake listing" },
      { id: 2, user: "Bob", facility: "Turf 2", reason: "Inappropriate photos" },
    ]);
  }, []);

  const handleAction = (id, action) => {
    alert(`Report ${id} marked as ${action}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Reports & Moderation</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Facility</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.user}</td>
              <td className="border p-2">{r.facility}</td>
              <td className="border p-2">{r.reason}</td>
              <td className="border p-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleAction(r.id, "resolved")}
                >
                  Resolve
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleAction(r.id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
    