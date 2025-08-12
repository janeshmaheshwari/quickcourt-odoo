import { useEffect, useState } from "react";

// Dummy data for pending facilities
const dummyFacilities = [
  {
    _id: "1",
    name: "Sunrise Sports Arena",
    location: "123 Main St, Cityville",
    description: "A modern sports facility with tennis and basketball courts.",
    sports: ["Tennis", "Basketball"],
    photos: [
      "https://via.placeholder.com/150?text=Photo+1",
      "https://via.placeholder.com/150?text=Photo+2",
    ],
    submittedBy: "John Doe",
    submittedAt: "2024-06-01",
  },
  {
    _id: "2",
    name: "Greenfield Grounds",
    location: "456 Park Ave, Townsville",
    description: "Spacious grounds for football and cricket.",
    sports: ["Football", "Cricket"],
    photos: [
      "https://via.placeholder.com/150?text=Photo+1",
      "https://via.placeholder.com/150?text=Photo+2",
    ],
    submittedBy: "Jane Smith",
    submittedAt: "2024-06-02",
  },
];

export default function FacilityApproval() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState("");
  const [comments, setComments] = useState({}); // { [facilityId]: comment }
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setFacilities(dummyFacilities);
      setLoading(false);
    }, 500);
  }, []);

  const handleDecision = (id, decision) => {
    // Simulate API call
    setFacilities((prev) => prev.filter((f) => f._id !== id));
    setComments((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setSelectedFacility(null);
    // Optionally, show a toast or alert
    // alert(`${decision === "approve" ? "Approved" : "Rejected"} facility with comment: ${comments[id] || ""}`);
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
            <div
              key={facility._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{facility.name}</h2>
                <p className="text-gray-600">{facility.location}</p>
                <p className="text-sm mt-1">{facility.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Sports: {facility.sports?.join(", ")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted by: {facility.submittedBy} on {facility.submittedAt}
                </p>
                <button
                  className="text-blue-600 underline mt-2"
                  onClick={() => setSelectedFacility(facility)}
                >
                  View Details & Photos
                </button>
              </div>
              <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-4">
                <textarea
                  className="border rounded p-2 text-sm"
                  rows={2}
                  placeholder="Optional comment"
                  value={comments[facility._id] || ""}
                  onChange={(e) =>
                    setComments((prev) => ({
                      ...prev,
                      [facility._id]: e.target.value,
                    }))
                  }
                />
                <div className="flex gap-2">
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
            </div>
          ))}
        </div>
      )}

      {/* Facility Details Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedFacility(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedFacility.name}</h2>
            <p className="text-gray-600">{selectedFacility.location}</p>
            <p className="mt-2">{selectedFacility.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Sports: {selectedFacility.sports?.join(", ")}
            </p>
            <div className="mt-4">
              <div className="font-semibold mb-1">Photos:</div>
              <div className="flex gap-2">
                {selectedFacility.photos?.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Facility photo ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Submitted by: {selectedFacility.submittedBy} on {selectedFacility.submittedAt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
