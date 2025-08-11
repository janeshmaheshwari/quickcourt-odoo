import express from "express";
import {
  listVenues,
  searchVenues,
  getVenueById,
  getNearbyVenues,
  getPopularVenues,
  getTrendingVenues,
  getVenueCategories,
  getVenueAmenities
} from "../controllers/venueController.js";

const router = express.Router();

// Public venue browsing and search
router.get("/", listVenues);
router.get("/search", searchVenues);
router.get("/nearby", getNearbyVenues);
router.get("/popular", getPopularVenues);
router.get("/trending", getTrendingVenues);
router.get("/categories", getVenueCategories);
router.get("/amenities", getVenueAmenities);

// Get specific venue
router.get("/:id", getVenueById);

export default router;
