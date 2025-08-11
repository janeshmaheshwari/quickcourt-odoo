import Venue from "../models/Venue.model.js";
import Court from "../models/Court.model.js";
import asyncHandler from "express-async-handler";

// 🟢 Add a new venue (pending admin approval)
export const addVenue = asyncHandler(async (req, res) => {
  const { name, location, description, sports, amenities, startingPrice, images } = req.body;

  if (!name || !location || !sports || sports.length === 0) {
    res.status(400);
    throw new Error("Name, location, and sports are required");
  }

  const venue = new Venue({
    name,
    location,
    description,
    sports,
    amenities,
    startingPrice,
    images,
    owner: req.user._id,
    approved: false // admin must approve
  });

  const createdVenue = await venue.save();
  res.status(201).json(createdVenue);
});

// 🟢 Edit venue details
export const updateVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findOne({ _id: req.params.id, owner: req.user._id });

  if (!venue) {
    res.status(404);
    throw new Error("Venue not found or not owned by you");
  }

  const updates = req.body;
  Object.assign(venue, updates);

  const updatedVenue = await venue.save();
  res.json(updatedVenue);
});

// 🟢 Add a court to a venue
export const addCourt = asyncHandler(async (req, res) => {
  const { name, sportType, pricePerHour, operatingHours } = req.body;

  if (!name || !sportType || !pricePerHour) {
    res.status(400);
    throw new Error("Court name, sport type, and price are required");
  }

  const venue = await Venue.findOne({ _id: req.params.venueId, owner: req.user._id });
  if (!venue) {
    res.status(404);
    throw new Error("Venue not found or not owned by you");
  }

  const court = new Court({
    name,
    sportType,
    pricePerHour,
    operatingHours,
    venue: venue._id
  });

  const createdCourt = await court.save();

  venue.courts.push(createdCourt._id);
  await venue.save();

  res.status(201).json(createdCourt);
});

// 🟢 Update court details
export const updateCourt = asyncHandler(async (req, res) => {
  const court = await Court.findById(req.params.courtId).populate("venue");

  if (!court || court.venue.owner.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Court not found or not owned by you");
  }

  Object.assign(court, req.body);

  const updatedCourt = await court.save();
  res.json(updatedCourt);
});

// 🟢 Set availability / block time slots for maintenance
export const setCourtAvailability = asyncHandler(async (req, res) => {
  const { availableSlots, blockedSlots } = req.body; 
  const court = await Court.findById(req.params.courtId).populate("venue");

  if (!court || court.venue.owner.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Court not found or not owned by you");
  }

  if (availableSlots) court.availableSlots = availableSlots;
  if (blockedSlots) court.blockedSlots = blockedSlots;

  await court.save();
  res.json({ message: "Court availability updated" });
});
