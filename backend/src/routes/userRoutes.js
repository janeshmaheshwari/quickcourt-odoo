import express from "express";
import {
  getProfile,
  updateProfile,
  getMyBookings
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Profile
router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Bookings
router.get("/my-bookings", protect, getMyBookings);

export default router;
