import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  completeBooking,
  getBookingStats,
  checkCourtAvailability
} from "../controllers/bookingController.js";
import { protect, adminOnly, ownerOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public endpoints
router.get("/availability/:courtId", checkCourtAvailability);

// Protected endpoints
router.use(protect);

// Booking CRUD operations
router.route("/")
  .post(createBooking)
  .get(getAllBookings); // Admin/Owner only

router.route("/:id")
  .get(getBookingById)
  .put(updateBooking); // Admin/Owner only

// Booking actions
router.put("/:id/cancel", cancelBooking);
router.put("/:id/complete", completeBooking); // Admin/Owner only

// Statistics
router.get("/stats", getBookingStats); // Admin/Owner only

export default router;
