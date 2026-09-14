import { validateObject } from "../../errors/validate-object";
import { User } from "../../modules/auth/auth.types";
import {
  UserDTOSchema,
  UserDTOSchemaUpdate,
} from "../../modules/users/users.schema";
import { UsersRepo } from "./repo";
import { saveAvatar } from "../../modules/documents/document.storage";
import { ApiError } from "../../errors/api-error";
import { detectFileType } from "../../modules/documents/document.file-validator";
export const UsersService = {
  getMe: async (id: string) => {
    const user = await UsersRepo.getMe(id);

    return validateObject(UserDTOSchema, {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  },
  getAll: async () => {
    const users = await UsersRepo.getAll();
    return users.map((user) => validateObject<User.DTO>(UserDTOSchema, user));
  },
  getUserById: async (id: string) => {
    const user = await UsersRepo.getUserById(id);
    return validateObject<User.DTO>(UserDTOSchema, user);
  },
  updateUserRole: async (id: string, role: string) => {
    const user = await UsersRepo.updateUserRole(id, role);
    return validateObject<User.DTO>(UserDTOSchema, user);
  },
  // updateUserprofile: async (
  //   userId: string,
  //   data: User.UpdateProfile,
  //   file?: Express.Multer.File,
  // ) => {
  //   const user = await UsersRepo.updateUserprofile(userId, data);
  //   return validateObject<User.DTO>(UserDTOSchemaUpdate, user);
  // },
  updateUserprofile: async (
    userId: string,
    data: User.UpdateProfile,
    file?: Express.Multer.File,
  ) => {
    let avatar: string | undefined;

    if (file) {
      const detectedType = detectFileType(file.buffer);

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!detectedType || !allowedTypes.includes(detectedType)) {
        throw new ApiError({
          code: "BAD_REQUEST",
          message: "Avatar must be JPEG, PNG or WebP.",
        });
      }

      avatar = await saveAvatar(file.buffer, detectedType);
    }

    const user = await UsersRepo.updateUserprofile(userId, {
      ...data,
      ...(avatar && { avatar }),
    });

    return validateObject<User.DTO>(UserDTOSchemaUpdate, user);
  },
  updateUserpassword: async (userId: string, data: User.UpdatePassword) => {
    const user = await UsersRepo.updateUserpassword(userId, data);
    return { success: true };
  },
  deleteUser: async (id: string) => {
    const user = await UsersRepo.deleteUser(id);
    return { success: true };
  },
};
