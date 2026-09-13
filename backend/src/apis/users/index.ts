import { Router } from "express";
import { validateRequestInput } from "../../errors/validate-request-input";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { UsersController } from "../../core/users/controller";
import { IdParamSchema } from "../../modules/documents/documents.schema";
import { UpdateUserRoleSchema } from "../../modules/users/users.schema";
const users = Router();
users.get("/me", authMiddleware, UsersController.getMe);

users.get("/", authMiddleware, requireAdmin, UsersController.getAll);

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
