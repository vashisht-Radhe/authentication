import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  changePassword,
  deactivateAccount,
  deleteAccount,
  getMyProfile,
  updateMyProfile,
  updateProfilePic,
} from "../controllers/user.controller.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import { verified } from "../middlewares/verified.middleware.js";

const userRouter = express.Router();

userRouter.use(protect);

userRouter.get("/me", getMyProfile);
userRouter.patch("/me", verified, updateMyProfile);
userRouter.patch("/change-password", verified, changePassword);
userRouter.put(
  "/me/avatar",
  verified,
  uploadSingle("avatar"),
  updateProfilePic,
);
userRouter.patch("/deactivate", verified, deactivateAccount);
userRouter.delete("/me", verified, deleteAccount);

export default userRouter;
