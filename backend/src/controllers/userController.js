import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    res.json({ message: "Profile updated" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user bookings
// @route   GET /api/users/my-bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("court");
  res.json(bookings);
});
