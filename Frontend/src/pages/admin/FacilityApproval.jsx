import { useEffect, useState } from "react";
import axios from "axios";

export default function FacilityApproval() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const { data } = await axios.get("/api/admin/facility-approvals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFacilities(data);
    } catch (err) {
      setError("Error fetching facility approvals");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      await axios.post(
        `/api/admin/facility-approvals/${id}`,
        { decision },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFacilities((prev) => prev.filter((f) => f._id !== id));
    } catch {
      alert("Error updating facility status");
    }
  };

  if (loading) return <div className="p-6">Loading pending facilities...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Facility Approval Requests</h1>

      {facilities.length === 0 ? (
        <div>No pending facilities.</div>
      ) : (
        <div className="space-y-4">
          {facilities.map((facility) => (
            <div key={facility._id} className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">{facility.name}</h2>
                <p className="text-gray-600">{facility.location}</p>
                <p className="text-sm mt-1">{facility.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Sports: {facility.sports?.join(", ")}
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => handleDecision(facility._id, "approve")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => handleDecision(facility._id, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
