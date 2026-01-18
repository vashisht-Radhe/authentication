import { SALT_ROUNDS } from "../config/env.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { throwError } from "../utils/errorHandler.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      throwError("Unauthorized", 401);
    }

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
    const { userId } = req.user;
    const { firstName, lastName } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { firstName, lastName } },
      { new: true, runValidators: true },
    );

    if (!user) {
      throwError("User not found", 404);
    }

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
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throwError("Current password and new password are required", 400);
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      throwError("Unauthorized", 401);
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throwError("Current password is incorrect", 403);
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateAccount = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      throwError("Unauthorized", 401);
    }

    if (!user.isActive) {
      throwError("Account already deactivated", 400);
    }

    user.isActive = false;
    user.deactivatedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { password } = req.body;

    if (!password) {
      throwError("Password is required to delete account", 400);
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      throwError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throwError("Incorrect Password", 401);
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Your account has been permanently deleted",
    });
  } catch (error) {
    next(error);
  }
};
