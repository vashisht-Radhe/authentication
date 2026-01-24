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

userRouter.get("/", getMyProfile);

userRouter.use(verified);

userRouter.patch("/", updateMyProfile);
userRouter.patch("/change-password", changePassword);
userRouter.patch("/avatar", uploadSingle("avatar"), updateProfilePic);
userRouter.patch("/deactivate", deactivateAccount);
userRouter.delete("/", deleteAccount);

export default userRouter;
