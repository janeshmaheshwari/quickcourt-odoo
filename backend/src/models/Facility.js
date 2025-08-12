import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    sports: [{ type: String }], // e.g., "tennis", "badminton"
    images: [{ type: String }],
    isApproved: { type: Boolean, default: false },
    pricePerHour: { type: Number, required: true },
    type: { type: String, }
  },
  { timestamps: true }
);

const Facility = mongoose.model("Facility", facilitySchema);
export default Facility;
