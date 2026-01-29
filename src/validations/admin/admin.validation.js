import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const getUsersSchema = z.object({
  query: z
    .object({
      includeDelete: z.enum(["true", "false"]).optional(),
    })
    .optional(),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    role: z.enum(["user", "admin"]),
  }),
});

export const deactivateUserSchema = userIdParamSchema;
export const reactivateUserSchema = userIdParamSchema;
export const deleteUserSchema = userIdParamSchema;
