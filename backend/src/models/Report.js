import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["user", "venue"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "resolved", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
