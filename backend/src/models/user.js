import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Users || mongoose.model('Users', userSchema);
