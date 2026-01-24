import path from "path";
import fs from "fs";
import User from "../models/user.model.js";
import { throwError } from "../utils/errorHandler.js";
import { safeDelete } from "../utils/file.util.js";
import { getUploadPath } from "../utils/uploadPath.js";
import {
  changePasswordService,
  deactivateAccountService,
  deleteAccountService,
  profileService,
  updateProfileService,
} from "../services/user.service.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await profileService(userId);

    res.status(200).json({
      message: "Profile retrieved successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { firstName, lastName } = req.body;

    const user = await updateProfileService({ userId, firstName, lastName });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    await changePasswordService({
      userId,
      currentPassword,
      newPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePic = async (req, res, next) => {
  let uploadedFilePath;

  try {
    if (!req.file) {
      throwError("No file uploaded", 400);
    }

    uploadedFilePath = getUploadPath(req.file.filename);

    const user = await User.findById(req.user._id).select("avatar");
    if (!user) {
      throwError("User not found", 404);
    }

    const oldAvatar = user.avatar;
    user.avatar = req.file.filename;

    await user.save();

    if (oldAvatar) {
      await safeDelete(getUploadPath(oldAvatar));
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    if (uploadedFilePath) {
      await safeDelete(uploadedFilePath);
    }
    next(error);
  }
};

export const deactivateAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const deactivatedAt = await deactivateAccountService(userId);

    res.status(200).json({
      success: true,
      deactivatedAt,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { password } = req.body;

    await deleteAccountService({ userId, password });

    res.status(200).json({
      success: true,
      message: "Your account has been permanently deleted",
    });
  } catch (error) {
    next(error);
  }
};
