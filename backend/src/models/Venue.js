import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  sports: [String],
  amenities: [String],
  photos: [String],
  courts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Court" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  adminComments: String
}, { timestamps: true });

export default mongoose.model("Venue", venueSchema);
