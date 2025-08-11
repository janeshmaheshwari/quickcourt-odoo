import express from "express";
import {
  approveFacility,
  rejectFacility,
  getAllUsers,
  toggleBanUser,
  getStats
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Dashboard Stats
router.get("/stats", protect, adminOnly, getStats);

// Facility Approval
router.put("/facilities/:id/approve", protect, adminOnly, approveFacility);
router.put("/facilities/:id/reject", protect, adminOnly, rejectFacility);

// User Management
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/ban", protect, adminOnly, toggleBanUser);

export default router;
