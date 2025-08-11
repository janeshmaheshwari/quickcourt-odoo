import { useState, useEffect } from "react";

export default function AdminProfile() {
  const [admin, setAdmin] = useState({ name: "", email: "" });

  useEffect(() => {
    // Fetch admin profile from API (placeholder)
    setAdmin({ name: "John Admin", email: "admin@quickcourt.com" });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="w-full border rounded p-2"
          value={admin.name}
          onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
        />
        <input
          className="w-full border rounded p-2"
          value={admin.email}
          onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
