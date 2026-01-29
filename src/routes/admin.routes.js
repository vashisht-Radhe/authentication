import express from "express";
import { adminLimiter } from "../config/rateLimiter.js";
import {
  deactivateUser,
  deleteUser,
  getUserById,
  getUsers,
  reactivateUser,
  updateUserRole,
} from "../controllers/admin.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.js";
import {
  deactivateUserSchema,
  deleteUserSchema,
  getUsersSchema,
  reactivateUserSchema,
  updateUserRoleSchema,
  userIdParamSchema,
} from "../validations/admin/admin.validation.js";

const adminRoutes = express.Router();

adminRoutes.use(protect, authorize("admin"));

adminRoutes.get("/", validate(getUsersSchema), getUsers);
adminRoutes.get("/:id", validate(userIdParamSchema), getUserById);
adminRoutes.patch(
  "/:id/role",
  adminLimiter,
  validate(updateUserRoleSchema),
  updateUserRole,
);
adminRoutes.patch(
  "/:id/deactivate",
  adminLimiter,
  validate(deactivateUserSchema),
  deactivateUser,
);
adminRoutes.patch(
  "/:id/activate",
  adminLimiter,
  validate(reactivateUserSchema),
  reactivateUser,
);
adminRoutes.delete(
  "/:id/soft-delete",
  adminLimiter,
  validate(deleteUserSchema),
  deleteUser,
);

export default adminRoutes;
