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
      const { data } = await axios.get(
        `/api/owner/facilities/${facilityId}/courts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const courtsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.courts)
        ? data.courts
        : [];

      // If API returns no data, use dummy data
      if (courtsArray.length === 0) {
        setCourts([
          {
            _id: "1",
            name: "Court A",
            sport: "Tennis",
            pricePerHour: 500,
            availability: true,
          },
          {
            _id: "2",
            name: "Court B",
            sport: "Basketball",
            pricePerHour: 700,
            availability: false,
          },
          {
            _id: "3",
            name: "Court C",
            sport: "Badminton",
            pricePerHour: 300,
            availability: true,
          },
        ]);
      } else {
        setCourts(courtsArray);
      }
    } catch (error) {
      console.error("Error fetching courts:", error);

      // If API fails, also load dummy data
      setCourts([
        {
          _id: "1",
          name: "Court A",
          sport: "Tennis",
          pricePerHour: 500,
          availability: true,
        },
        {
          _id: "2",
          name: "Court B",
          sport: "Basketball",
          pricePerHour: 700,
          availability: false,
        },
        {
          _id: "3",
          name: "Court C",
          sport: "Badminton",
          pricePerHour: 300,
          availability: true,
        },
      ]);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading courts...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Manage Courts</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Court" : "Add New Court"}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Court Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Sport Type
          </label>
          <input
            type="text"
            value={formData.sport}
            onChange={(e) =>
              setFormData({ ...formData, sport: e.target.value })
            }
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Price Per Hour (₹)
          </label>
          <input
            type="number"
            value={formData.pricePerHour}
            onChange={(e) =>
              setFormData({ ...formData, pricePerHour: e.target.value })
            }
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Availability
          </label>
          <select
            value={formData.availability}
            onChange={(e) =>
              setFormData({ ...formData, availability: e.target.value === "true" })
            }
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {editingId ? "Update Court" : "Add Court"}
        </button>
      </form>

      {/* Courts List */}
      {courts.length === 0 ? (
        <div className="text-center text-gray-500">No courts found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courts.map((court) => (
            <div
              key={court._id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold">{court.name}</h3>
                <p className="text-gray-500">{court.sport}</p>
                <p className="mt-2 font-semibold text-blue-600">
                  ₹{court.pricePerHour} / hr
                </p>
                <p
                  className={`mt-1 ${
                    court.availability ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {court.availability ? "Available" : "Unavailable"}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(court)}
                  className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(court._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
