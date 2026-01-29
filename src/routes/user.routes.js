import express from "express";
import { userLimiter } from "../config/rateLimiter.js";
import {
  changePassword,
  deactivateAccount,
  deleteAccount,
  getMyProfile,
  updateMyProfile,
  updateProfilePic,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import validate from "../middlewares/validate.js";
import { verified } from "../middlewares/verified.middleware.js";
import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from "../validations/user/user.validate.js";

const userRouter = express.Router();

userRouter.use(protect);

userRouter.get("/", getMyProfile);

userRouter.use(verified, userLimiter);

userRouter.patch("/", validate(updateProfileSchema), updateMyProfile);
userRouter.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePassword,
);
userRouter.patch("/avatar", uploadSingle("avatar"), updateProfilePic);
userRouter.patch("/deactivate", deactivateAccount);
userRouter.delete("/", validate(deleteAccountSchema), deleteAccount);

export default userRouter;
