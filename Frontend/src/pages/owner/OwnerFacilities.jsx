import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    sports: "",
    amenities: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const { data } = await axios.get("/api/owner/facilities", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFacilities(data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/owner/facilities/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post("/api/owner/facilities", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      setFormData({
        name: "",
        location: "",
        description: "",
        sports: "",
        amenities: "",
      });
      setEditingId(null);
      fetchFacilities();
    } catch (error) {
      console.error("Error saving facility:", error);
    }
  };

  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      location: facility.location,
      description: facility.description,
      sports: facility.sports?.join(", "),
      amenities: facility.amenities?.join(", "),
    });
    setEditingId(facility._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this facility?")) return;
    try {
      await axios.delete(`/api/owner/facilities/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFacilities((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error("Error deleting facility:", error);
    }
  };

  if (loading) return <div className="p-6">Loading facilities...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Facilities</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          type="text"
          placeholder="Facility Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border p-2 w-full rounded"
          required
        ></textarea>
        <input
          type="text"
          placeholder="Sports (comma separated)"
          value={formData.sports}
          onChange={(e) => setFormData({ ...formData, sports: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Amenities (comma separated)"
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Facility" : "Add Facility"}
        </button>
      </form>

      {/* Facilities List */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">Sports</th>
              <th className="p-3">Amenities</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {facilities.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No facilities found
                </td>
              </tr>
            ) : (
              facilities.map((facility) => (
                <tr key={facility._id} className="border-b">
                  <td className="p-3">{facility.name}</td>
                  <td className="p-3">{facility.location}</td>
                  <td className="p-3">{facility.sports?.join(", ")}</td>
                  <td className="p-3">{facility.amenities?.join(", ")}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(facility)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(facility._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
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
