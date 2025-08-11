import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  slots: [{
    time: { type: String, required: true }, // "08:00-09:00"
    isAvailable: { type: Boolean, default: true }
  }]
}, { timestamps: true });

export default mongoose.model("TimeSlot", timeSlotSchema);
