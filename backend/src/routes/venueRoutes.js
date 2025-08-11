import express from "express";
import {
  listVenues,
  getVenueById,
  searchVenues
} from "../controllers/venueController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public browsing (can also require login if needed)
router.get("/", listVenues);
router.get("/search", searchVenues);
router.get("/:id", getVenueById);

export default router;
