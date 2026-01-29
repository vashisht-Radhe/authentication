import {
  getUsersService,
  getUserByIdService,
  updateUserRoleService,
  deactivateUserService,
  deleteUserService,
  reactivateUserService,
} from "../services/admin.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res, next) => {
  const { includeDelete } = req.query;

  const { users, totalUsers } = await getUsersService(includeDelete);

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
    totalUser: totalUsers,
  });
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const user = await getUserByIdService(id);

  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  const { _id: adminId } = req.user;

  const user = await updateUserRoleService({ id, role, adminId });

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
    data: user,
  });
});

export const deactivateUser = asyncHandler(async (req, res, next) => {
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
});

export const reactivateUser = asyncHandler(async (req, res, next) => {
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
});

export const deleteUser = asyncHandler(async (req, res, next) => {
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
});
