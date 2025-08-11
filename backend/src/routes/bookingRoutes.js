import express from "express";
import {
  createBooking,
  cancelBooking,
  getBookingDetails
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Booking Actions
router.post("/", protect, createBooking);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id", protect, getBookingDetails);

export default router;
