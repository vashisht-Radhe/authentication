import express from "express";
import {
  deactivateUser,
  getUserById,
  getUsers,
  reactivateUser,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { verified } from "../middlewares/verified.middleware.js";

const adminRoutes = express.Router();

adminRoutes.use(protect, verified, authorize("admin"));

adminRoutes.get("/", getUsers);
adminRoutes.get("/:id", getUserById);
adminRoutes.patch("/:id/role", updateUserRole);
adminRoutes.patch("/:id/deactivate", deactivateUser);
adminRoutes.patch("/:id/activate", reactivateUser);
adminRoutes.delete("/:id/soft-delete", deleteUser);

export default adminRoutes;
