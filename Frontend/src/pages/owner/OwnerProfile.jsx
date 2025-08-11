import { useState, useEffect } from "react";

export default function OwnerProfile() {
  const [owner, setOwner] = useState({ name: "", email: "" });

  useEffect(() => {
    setOwner({ name: "Mike Owner", email: "owner@quickcourt.com" });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Owner Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          value={owner.name}
          onChange={(e) => setOwner({ ...owner, name: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded"
          value={owner.email}
          onChange={(e) => setOwner({ ...owner, email: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
