import express from "express";
import {
  addFacility,
  getOwnerFacilities,
  getOwnerFacilityById,
  updateFacility,
  deleteFacility,
  addCourt,
  getOwnerCourts,
  getOwnerCourtById,
  updateCourt,
  deleteCourt,
  setCourtAvailability,
  getOwnerBookings,
  updateBookingStatus,
  getOwnerDashboard
} from "../controllers/ownerController.js";
import { protect, ownerOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, ownerOnly, getOwnerDashboard);

// Facility Management
router.route("/facilities")
  .post(protect, ownerOnly, addFacility)
  .get(protect, ownerOnly, getOwnerFacilities);

router.route("/facilities/:id")
  .get(protect, ownerOnly, getOwnerFacilityById)
  .put(protect, ownerOnly, updateFacility)
  .delete(protect, ownerOnly, deleteFacility);

// Court Management
router.route("/courts")
  .post(protect, ownerOnly, addCourt)
  .get(protect, ownerOnly, getOwnerCourts);

router.route("/courts/:id")
  .get(protect, ownerOnly, getOwnerCourtById)
  .put(protect, ownerOnly, updateCourt)
  .delete(protect, ownerOnly, deleteCourt);

// Court Availability
router.put("/courts/:id/availability", protect, ownerOnly, setCourtAvailability);

// Booking Management
router.route("/bookings")
  .get(protect, ownerOnly, getOwnerBookings);

router.put("/bookings/:id/status", protect, ownerOnly, updateBookingStatus);

export default router;
