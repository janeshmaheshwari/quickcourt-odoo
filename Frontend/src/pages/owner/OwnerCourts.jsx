import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OwnerCourts() {
  const { facilityId } = useParams();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    pricePerHour: "",
    availability: true,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const { data } = await axios.get(`/api/owner/facilities/${facilityId}/courts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourts(data);
    } catch (error) {
      console.error("Error fetching courts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `/api/owner/facilities/${facilityId}/courts/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        await axios.post(
          `/api/owner/facilities/${facilityId}/courts`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
      setFormData({ name: "", sport: "", pricePerHour: "", availability: true });
      setEditingId(null);
      fetchCourts();
    } catch (error) {
      console.error("Error saving court:", error);
    }
  };

  const handleEdit = (court) => {
    setFormData({
      name: court.name,
      sport: court.sport,
      pricePerHour: court.pricePerHour,
      availability: court.availability,
    });
    setEditingId(court._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this court?")) return;
    try {
      await axios.delete(
        `/api/owner/facilities/${facilityId}/courts/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCourts((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting court:", error);
    }
  };

  if (loading) return <div className="p-6">Loading courts...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Courts for Facility</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          type="text"
          placeholder="Court Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Sport Type"
          value={formData.sport}
          onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Price Per Hour"
          value={formData.pricePerHour}
          onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <select
          value={formData.availability}
          onChange={(e) =>
            setFormData({ ...formData, availability: e.target.value === "true" })
          }
          className="border p-2 w-full rounded"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Court" : "Add Court"}
        </button>
      </form>

      {/* Courts List */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Sport</th>
              <th className="p-3">Price</th>
              <th className="p-3">Availability</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No courts found
                </td>
              </tr>
            ) : (
              courts.map((court) => (
                <tr key={court._id} className="border-b">
                  <td className="p-3">{court.name}</td>
                  <td className="p-3">{court.sport}</td>
                  <td className="p-3">₹{court.pricePerHour}</td>
                  <td className="p-3">
                    {court.availability ? (
                      <span className="text-green-600">Available</span>
                    ) : (
                      <span className="text-red-600">Unavailable</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(court)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(court._id)}
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
