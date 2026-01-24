import User from "../models/user.model.js";
import {
  getUsersService,
  getUserByIdService,
  updateUserRoleService,
  deactivateUserService,
  deleteUserService,
  reactivateUserService,
} from "../services/admin.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const { includeDelete } = req.query;

    const { users, totalUsers } = await getUsersService(includeDelete);

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
    const id = req.params.id;

    const user = await getUserByIdService(id);

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
    const { _id: adminId } = req.user;

    const user = await updateUserRoleService({ id, role, adminId });

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
    const { _id: adminId } = req.user;

    const user = await deactivateUserService({ id, adminId });

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: {
        id: user._id,
        isActive: user.isActive,
        deactivatedAt: user.deactivatedAt,
        deactivatedBy: user.deactivatedBy,
        deactivatedReason: user.deactivatedReason,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const reactivateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await reactivateUserService(id);

    res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: {
        id: user._id,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: adminId } = req.user;

    const user = await deleteUserService({ id, adminId });

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
      data: {
        id: user._id,
        isDeleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
