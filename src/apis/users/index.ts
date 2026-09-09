import { Router } from "express";
import { validateRequestInput } from "../../errors/validate-request-input";
import { authMiddleware } from "../../middleware/auth";
import { UsersController } from "../../core/users/controller";
import { IdParamSchema } from "../../modules/documents/documents.schema";
import { UpdateUserRoleSchema } from "../../modules/users/users.schema";
const users = Router();

users.get("/",
     authMiddleware,
     UsersController.getAll
)

users.get("/:id",
    authMiddleware,
    validateRequestInput({ params: IdParamSchema }),
    UsersController.getUserById
);

users.put("/:id/role",
    authMiddleware,
    validateRequestInput({ params: IdParamSchema, body: UpdateUserRoleSchema }),
    UsersController.updateUserRole
);


users.delete("/:id",
    authMiddleware,
    validateRequestInput({ params: IdParamSchema }),
    UsersController.deleteUser
);

export default users;