import { Router } from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roles.js";
import {
  markAttendance,
  attendanceReport,
} from "../controllers/attendanceController.js";
import {
  markRules,
  reportRules,
} from "../validators/attendanceValidators.js";

const router = Router();

// Prevent abuse of attendance marking
const markLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

// Student marks attendance
router.post(
  "/mark",
  protect,
  allowRoles("student"),
  markLimiter,
  markRules,
  markAttendance
);

// Teacher/Admin gets attendance report
router.get(
  "/report",
  protect,
  allowRoles("teacher", "admin"),
  reportRules,
  attendanceReport
);

export default router;
