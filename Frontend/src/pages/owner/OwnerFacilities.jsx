import { useEffect, useState } from "react";
import { 
  getOwnerFacilities, 
  createFacility, 
  updateFacility, 
  deleteFacility 
} from "../../services/api";

export default function OwnerFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    sports: "",
    amenities: "",
    pricePerHour: "",
    type: "outdoor",
    photos: []
  });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [courtModalOpen, setCourtModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [newCourt, setNewCourt] = useState({
    courtName: "",
    sportType: "",
    pricingPerHour: "",
    operatingHours: ""
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await getOwnerFacilities();

      // Dummy data fallback
      if (!data || !data.facilities || data.facilities.length === 0) {
        data = {
          facilities: [
            {
              _id: "1",
              name: "Sky Arena",
              location: "Mumbai",
              description: "Indoor multi-sports complex",
              sports: ["badminton", "table tennis"],
              amenities: ["parking", "showers"],
              pricePerHour: 500,
              type: "indoor",
              photos: ["https://via.placeholder.com/300", "https://via.placeholder.com/301"],
              courts: [
                { courtName: "Badminton Court 1", sportType: "badminton", pricingPerHour: 400, operatingHours: "6AM - 10PM" }
              ],
              isApproved: true
            }
          ]
        };
      }
      setFacilities(data.facilities || []);
    } catch (error) {
      setError(error.message || "Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setFormData({ ...formData, photos: previews });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const processedData = {
        ...formData,
        sports: formData.sports.split(",").map(s => s.trim()).filter(s => s),
        amenities: formData.amenities.split(",").map(a => a.trim()).filter(a => a),
        pricePerHour: parseFloat(formData.pricePerHour),
        courts: []
      };

      if (editingId) {
        await updateFacility(editingId, processedData);
      } else {
        await createFacility(processedData);
      }

      resetForm();
      await fetchFacilities();
    } catch (error) {
      setError(error.message || "Failed to save facility");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      location: facility.location,
      description: facility.description,
      sports: facility.sports?.join(", ") || "",
      amenities: facility.amenities?.join(", ") || "",
      pricePerHour: facility.pricePerHour?.toString() || "",
      type: facility.type || "outdoor",
      photos: facility.photos || []
    });
    setEditingId(facility._id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility?")) return;
    try {
      await deleteFacility(id);
      await fetchFacilities();
    } catch (error) {
      setError(error.message || "Failed to delete facility");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      description: "",
      sports: "",
      amenities: "",
      pricePerHour: "",
      type: "outdoor",
      photos: []
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const addCourt = () => {
    if (!selectedFacility) return;
    const updated = facilities.map(fac =>
      fac._id === selectedFacility._id
        ? { ...fac, courts: [...(fac.courts || []), newCourt] }
        : fac
    );
    setFacilities(updated);
    setNewCourt({ courtName: "", sportType: "", pricingPerHour: "", operatingHours: "" });
  };

  const deleteCourt = (facilityId, courtIndex) => {
    const updated = facilities.map(fac =>
      fac._id === facilityId
        ? { ...fac, courts: fac.courts.filter((_, idx) => idx !== courtIndex) }
        : fac
    );
    setFacilities(updated);
  };

  if (loading) return <p className="text-center py-6">Loading facilities...</p>;

  return (
    <div className="p-6">
      {/* Form */}
      {showForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Facility" : "Add New Facility"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="Facility Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input className="border p-2 rounded" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            <input className="border p-2 rounded" type="number" placeholder="Price per Hour" value={formData.pricePerHour} onChange={e => setFormData({...formData, pricePerHour: e.target.value})} required />
            <select className="border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="outdoor">Outdoor</option>
              <option value="indoor">Indoor</option>
            </select>
            <textarea className="border p-2 rounded col-span-2" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            <input className="border p-2 rounded" placeholder="Sports (comma separated)" value={formData.sports} onChange={e => setFormData({...formData, sports: e.target.value})} />
            <input className="border p-2 rounded" placeholder="Amenities (comma separated)" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} />
            <input className="border p-2 rounded col-span-2" type="file" multiple onChange={handlePhotoChange} />
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 col-span-2">
                {formData.photos.map((url, i) => (
                  <img key={i} src={url} className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            )}
            <div className="col-span-2 flex gap-3 mt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{isSubmitting ? "Saving..." : editingId ? "Update Facility" : "Create Facility"}</button>
              <button type="button" onClick={resetForm} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Facilities List */}
      <div className="grid md:grid-cols-2 gap-6">
        {facilities.map(facility => (
          <div key={facility._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {facility.photos?.length > 0 && (
              <div className="grid grid-cols-3 gap-1">
                {facility.photos.slice(0, 3).map((url, i) => (
                  <img key={i} src={url} className="h-28 w-full object-cover" />
                ))}
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{facility.name}</h3>
                <span className={`px-2 py-1 rounded text-sm ${facility.isApproved ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                  {facility.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-gray-600">{facility.location}</p>
              <p className="text-sm text-gray-500 mt-1">{facility.description}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleEdit(facility)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</button>
                <button onClick={() => handleDelete(facility._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                <button onClick={() => { setSelectedFacility(facility); setCourtModalOpen(true); }} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">Manage Courts</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Court Management Modal */}
      {courtModalOpen && selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Manage Courts - {selectedFacility.name}</h2>
            {(selectedFacility.courts || []).map((court, idx) => (
              <div key={idx} className="flex justify-between border-b py-1">
                <span>{court.courtName} - ₹{court.pricingPerHour}/hr</span>
                <button onClick={() => deleteCourt(selectedFacility._id, idx)} className="text-red-500 hover:underline">Delete</button>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <input className="border p-2 rounded w-full" placeholder="Court Name" value={newCourt.courtName} onChange={e => setNewCourt({...newCourt, courtName: e.target.value})} />
              <input className="border p-2 rounded w-full" placeholder="Sport Type" value={newCourt.sportType} onChange={e => setNewCourt({...newCourt, sportType: e.target.value})} />
              <input className="border p-2 rounded w-full" placeholder="Pricing per Hour" value={newCourt.pricingPerHour} onChange={e => setNewCourt({...newCourt, pricingPerHour: e.target.value})} />
              <input className="border p-2 rounded w-full" placeholder="Operating Hours" value={newCourt.operatingHours} onChange={e => setNewCourt({...newCourt, operatingHours: e.target.value})} />
              <button onClick={addCourt} className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded">Add Court</button>
            </div>
            <button onClick={() => setCourtModalOpen(false)} className="mt-4 w-full bg-gray-300 hover:bg-gray-400 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
