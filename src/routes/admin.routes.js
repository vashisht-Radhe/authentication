import express from "express";
import {
  getUserById,
  getUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const adminRoutes = express.Router();

adminRoutes.use(protect, authorize("admin"));

adminRoutes.get("/", getUsers);
adminRoutes.get("/:id", getUserById);
adminRoutes.patch("/:id/role", updateUserRole);

export default adminRoutes;
