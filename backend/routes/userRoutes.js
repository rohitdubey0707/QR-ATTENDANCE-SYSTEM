import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roles.js";
import { listUsers } from "../controllers/userController.js";

const router = Router();

// Only Admin can manage users
router.use(protect, allowRoles("admin"));

// List all users
router.get("/", listUsers);

export default router;
