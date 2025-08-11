import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  deleteProfile,
  getMyBookings,
  getMyBookingById,
  cancelMyBooking
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Profile management
router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile)
  .delete(protect, deleteProfile);

// Password management
router.put("/password", protect, changePassword);

// Avatar management
router.put("/avatar", protect, updateAvatar);

// Bookings management
router.route("/my-bookings")
  .get(protect, getMyBookings);

router.route("/my-bookings/:id")
  .get(protect, getMyBookingById);

router.put("/my-bookings/:id/cancel", protect, cancelMyBooking);

export default router;
