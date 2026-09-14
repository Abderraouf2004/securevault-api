import { Router } from "express";
import { validateRequestInput } from "../../errors/validate-request-input";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { UsersController } from "../../core/users/controller";
import { IdParamSchema } from "../../modules/documents/documents.schema";
import {
  UpdateUserRoleSchema,
  UpdateProfileSchema,
  UpdatePasswordSchema,
} from "../../modules/users/users.schema";
import { avatarUpload } from "../../modules/documents/document.upload";
const users = Router();
users.get("/me", authMiddleware, UsersController.getMe);

users.get("/", authMiddleware, requireAdmin, UsersController.getAll);

users.put(
  "/profile",
  authMiddleware,
  avatarUpload.single("avatar"),
  validateRequestInput({ body: UpdateProfileSchema }),
  UsersController.updateUserprofile,
);

users.put(
  "/password",
  authMiddleware,
  validateRequestInput({ body: UpdatePasswordSchema }),
  UsersController.updateUserpassword,
);

users.get(
  "/:id",
  authMiddleware,
  requireAdmin,
  validateRequestInput({ params: IdParamSchema }),
  UsersController.getUserById,
);

users.put(
  "/:id/role",
  authMiddleware,
  requireAdmin,
  validateRequestInput({ params: IdParamSchema, body: UpdateUserRoleSchema }),
  UsersController.updateUserRole,
);

users.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  validateRequestInput({ params: IdParamSchema }),
  UsersController.deleteUser,
);

export default users;
