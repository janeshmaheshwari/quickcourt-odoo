import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    name: { type: String, required: true },
    sport: { type: String, required: true }, // e.g., tennis, football
    availability: [
      {
        day: { type: String }, // e.g., Monday
        startTime: { type: String }, // HH:mm
        endTime: { type: String },   // HH:mm
      },
    ],
    pricePerHour: { type: Number, required: true },
  },
  { timestamps: true }
);

const Court = mongoose.model("Court", courtSchema);
export default Court;
