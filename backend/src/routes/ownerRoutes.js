import express from "express";
import {
  addFacility,
  // updateFacility,
  addCourt,
  // updateCourt,
  getOwnerBookings,
  // setCourtAvailability
} from "../controllers/ownerController.js";
import { protect, ownerOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Facility Management
router.post("/facilities", protect, ownerOnly, addFacility);
// router.put("/facilities/:id", protect, ownerOnly, updateFacility);

// Court Management
router.post("/courts", protect, ownerOnly, addCourt);
// router.put("/courts/:id", protect, ownerOnly, updateCourt);

// Availability
// router.put("/courts/:id/availability", protect, ownerOnly, setCourtAvailability);

// Booking Overview
router.get("/bookings", protect, ownerOnly, getOwnerBookings);

export default router;
