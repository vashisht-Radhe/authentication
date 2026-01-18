import mongoose from "mongoose";
import User, { ROLES } from "../models/user.model.js";
import { throwError } from "../utils/errorHandler.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
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
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throwError("Invalid user ID", 400);
    }

    if (!ROLES.includes(role)) {
      throwError("Invalid role value", 400);
    }

    // prevent admin from changing their own role
    if (userId === id) {
      throwError("You cannot change your own role", 403);
    }
    console.log(req.user);

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    );

    if (!user) {
      throwError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

