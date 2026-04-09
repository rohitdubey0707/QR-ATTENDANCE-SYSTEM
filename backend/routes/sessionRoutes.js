import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roles.js";
import {
  createSession,
  getSessionQR,
  closeSession,
  listSessions,
} from "../controllers/sessionController.js";
import {
  createSessionRules,
  sessionIdParam,
} from "../validators/sessionValidators.js";

const router = Router();

router.use(protect);

// Teacher/Admin creates a session
router.post("/", allowRoles("teacher", "admin"), createSessionRules, createSession);

// Teacher/Admin lists sessions
router.get("/", allowRoles("teacher", "admin"), listSessions);

// Teacher/Admin gets QR for a session
router.get("/:id/qr", allowRoles("teacher", "admin"), sessionIdParam, getSessionQR);

// Teacher/Admin closes a session
router.patch("/:id/close", allowRoles("teacher", "admin"), sessionIdParam, closeSession);

export default router;
