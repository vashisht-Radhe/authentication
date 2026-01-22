import mongoose from "mongoose";
import User, { ROLES } from "../models/user.model.js";
import { throwError } from "../utils/errorHandler.js";

export const getUsers = async (req, res, next) => {
  try {
    const { includeDelete } = req.query;

    const filter = {};

    if (includeDelete !== "true") {
      filter.isDeleted = false;
    }

    const users = await User.find(filter);

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      totalUser: totalUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throwError("Invalid user ID", 400);
    }

    const user = await User.findById(id);

    if (!user) {
      throwError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const { _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throwError("Invalid user ID", 400);
    }

    if (!ROLES.includes(role)) {
      throwError("Invalid role value", 400);
    }

    if (userId === id) {
      throwError("You cannot change your own role", 403);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    );

    if (!user) {
      throwError("User not found", 404);
    }

    if (user.isDeleted) throwError("Cannot update role of deleted user", 403);

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throwError("Invalid user ID", 400);
    }

    const user = await User.findById(id);

    if (!user) {
      throwError("User not found", 404);
    }

    if (user.isDeleted) {
      throwError("User account is deleted", 403);
    }

    if (!user.isActive) {
      throwError("Account already deactivated", 403);
    }

    user.isActive = false;
    user.deactivatedAt = new Date();
    user.deactivatedBy = "admin";

    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const reactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throwError("Invalid user ID", 400);
    }

    const user = await User.findById(id);

    if (!user) {
      throwError("User not found", 404);
    }

    if (user.isDeleted) {
      throwError("User account is deleted", 410);
    }

    if (user.isActive) {
      throwError("Account already active", 409);
    }

    user.isActive = true;
    user.deactivatedAt = null;
    user.deactivatedBy = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User activated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throwError("Invalid user ID", 400);
    }

    const user = await User.findById(id);

    if (!user) {
      throwError("User not found", 404);
    }

    if (user.isDeleted) {
      throwError("User account already deleted", 403);
    }

    user.isDeleted = true;
    user.isActive = false;
    user.deletedAt = new Date();

    user.deactivatedAt = null;
    user.deactivatedBy = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
      data: {
        id: user._id,
        isDeleted: user.isDeleted,
      },
    });
  } catch (error) {
    next(error);
  }
};
