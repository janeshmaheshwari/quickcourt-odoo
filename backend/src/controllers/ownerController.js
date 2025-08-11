import asyncHandler from "express-async-handler";
import Facility from "../models/Facility.js";
import Court from "../models/Court.js";
import Booking from "../models/Booking.js";

// Add facility
export const addFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.create({
    ...req.body,
    owner: req.user._id,
    isApproved: false
  });
  res.status(201).json(facility);
});

// Update facility
export const updateFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);
  if (!facility) {
    res.status(404);
    throw new Error("Facility not found");
  }
  if (facility.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  Object.assign(facility, req.body);
  await facility.save();
  res.json(facility);
});

// Add court
export const addCourt = asyncHandler(async (req, res) => {
  const court = await Court.create(req.body);
  res.status(201).json(court);
});

// Update court
export const updateCourt = asyncHandler(async (req, res) => {
  const court = await Court.findById(req.params.id);
  if (!court) {
    res.status(404);
    throw new Error("Court not found");
  }

  Object.assign(court, req.body);
  await court.save();
  res.json(court);
});

// Set court availability
export const setCourtAvailability = asyncHandler(async (req, res) => {
  const court = await Court.findById(req.params.id);
  court.availability = req.body.availability;
  await court.save();
  res.json({ message: "Availability updated" });
});

// Owner bookings
export const getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ owner: req.user._id }).populate("court");
  res.json(bookings);
});
