import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);


// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default mongoose.models.Users || mongoose.model('Users', userSchema);
