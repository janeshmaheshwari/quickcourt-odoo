import asyncHandler from "express-async-handler";
import Facility from "../models/Facility.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

// Approve facility
export const approveFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);
  facility.isApproved = true;
  await facility.save();
  res.json({ message: "Facility approved" });
});

// Reject facility
export const rejectFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);
  facility.isApproved = false;
  await facility.save();
  res.json({ message: "Facility rejected" });
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Ban/unban user
export const toggleBanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBanned = !user.isBanned;
  await user.save();
  res.json({ message: user.isBanned ? "User banned" : "User unbanned" });
});

// Stats
export const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalFacilities = await Facility.countDocuments();
  res.json({ totalUsers, totalBookings, totalFacilities });
});
