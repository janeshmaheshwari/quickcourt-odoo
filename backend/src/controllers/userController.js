import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
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

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      message: "Profile updated successfully"
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current password and new password are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
});

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    res.status(400);
    throw new Error("Avatar URL is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.avatar = avatar;
  await user.save();

  res.json({
    message: "Avatar updated successfully",
    avatar: user.avatar
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if user has active bookings
  const activeBookings = await Booking.find({
    user: req.user._id,
    status: { $in: ["Confirmed", "Completed"] }
  });

  if (activeBookings.length > 0) {
    res.status(400);
    throw new Error("Cannot delete account with active bookings. Please cancel or complete all bookings first.");
  }

  await User.findByIdAndDelete(req.user._id);
  res.json({ message: "Account deleted successfully" });
});

// @desc    Get user bookings
// @route   GET /api/users/my-bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const query = { user: req.user._id };
  if (status) {
    query.status = status;
  }

  const totalBookings = await Booking.countDocuments(query);
  const totalPages = Math.ceil(totalBookings / limit);

  const bookings = await Booking.find(query)
    .populate("court")
    .populate("facility")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({
    bookings,
    pagination: {
      currentPage: page,
      totalPages,
      totalBookings,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get user booking by ID
// @route   GET /api/users/my-bookings/:id
// @access  Private
export const getMyBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate("court facility");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.json(booking);
});

// @desc    Cancel user booking
// @route   PUT /api/users/my-bookings/:id/cancel
// @access  Private
export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.status === "Cancelled") {
    res.status(400);
    throw new Error("Booking is already cancelled");
  }

  if (booking.status === "Completed") {
    res.status(400);
    throw new Error("Cannot cancel completed booking");
  }

  // Check if booking is within cancellation window (e.g., 24 hours before)
  const bookingDate = new Date(booking.date);
  const now = new Date();
  const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

  if (hoursUntilBooking < 24) {
    res.status(400);
    throw new Error("Cannot cancel booking within 24 hours of scheduled time");
  }

  booking.status = "Cancelled";
  await booking.save();

  res.json({ message: "Booking cancelled successfully" });
});
