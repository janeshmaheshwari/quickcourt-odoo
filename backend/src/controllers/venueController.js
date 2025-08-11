import asyncHandler from "express-async-handler";
import Facility from "../models/Facility.js";

// List all venues
export const listVenues = asyncHandler(async (req, res) => {
  const venues = await Facility.find({ isApproved: true });
  res.json(venues);
});

// Search venues
export const searchVenues = asyncHandler(async (req, res) => {
  const { sport, price, type } = req.query;
  const query = {};

  if (sport) query.sports = sport;
  if (price) query.pricePerHour = { $lte: price };
  if (type) query.type = type;

  const venues = await Facility.find(query);
  res.json(venues);
});

// Get venue by ID
export const getVenueById = asyncHandler(async (req, res) => {
  const venue = await Facility.findById(req.params.id);
  res.json(venue);
});
