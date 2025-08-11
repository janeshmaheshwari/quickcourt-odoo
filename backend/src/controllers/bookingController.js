import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";

// Create booking
export const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    user: req.user._id,
    status: "Confirmed"
  });
  res.status(201).json(booking);
});

// Cancel booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  booking.status = "Cancelled";
  await booking.save();
  res.json({ message: "Booking cancelled" });
});

// Get booking details
export const getBookingDetails = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("court");
  res.json(booking);
});
