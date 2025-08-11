import express from "express";
import {
  addVenue,
  updateVenue,
  addCourt,
  updateCourt,
  setCourtAvailability
} from "../controllers/ownerVenueController.js";

import { protect, ownerOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication & owner role
router.post("/venues", protect, ownerOnly, addVenue);
router.put("/venues/:id", protect, ownerOnly, updateVenue);

router.post("/venues/:venueId/courts", protect, ownerOnly, addCourt);
router.put("/courts/:courtId", protect, ownerOnly, updateCourt);
router.put("/courts/:courtId/availability", protect, ownerOnly, setCourtAvailability);

export default router;
