import { validateObject } from "../../errors/validate-object";
import { UserDTOSchema, UserDTOSchemaUpdate, } from "../../modules/users/users.schema";
import { UsersRepo } from "./repo";
import { saveAvatar } from "../../modules/documents/document.storage";
import { ApiError } from "../../errors/api-error";
import { detectFileType } from "../../modules/documents/document.file-validator";
import { buildPaginationMeta, } from "../../modules/shared/pagination.schema";
export const UsersService = {
    getMe: async (id) => {
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
    // getAll: async () => {
    //   const users = await UsersRepo.getAll();
    //   return users.map((user) => validateObject<User.DTO>(UserDTOSchema, user));
    // },
    getAll: async (pagination) => {
        const { users, total } = await UsersRepo.getAll(pagination);
        return {
            data: users.map((user) => validateObject(UserDTOSchema, user)),
            meta: buildPaginationMeta(total, pagination),
        };
    },
    getUserById: async (id) => {
        const user = await UsersRepo.getUserById(id);
        return validateObject(UserDTOSchema, user);
    },
    updateUserRole: async (id, role) => {
        const user = await UsersRepo.updateUserRole(id, role);
        return validateObject(UserDTOSchema, user);
    },
    // updateUserprofile: async (
    //   userId: string,
    //   data: User.UpdateProfile,
    //   file?: Express.Multer.File,
    // ) => {
    //   const user = await UsersRepo.updateUserprofile(userId, data);
    //   return validateObject<User.DTO>(UserDTOSchemaUpdate, user);
    // },
    updateUserprofile: async (userId, data, file) => {
        let avatar;
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
        return validateObject(UserDTOSchemaUpdate, user);
    },
    updateUserpassword: async (userId, data) => {
        const user = await UsersRepo.updateUserpassword(userId, data);
        return { success: true };
    },
    deleteUser: async (id) => {
        const user = await UsersRepo.deleteUser(id);
        return { success: true };
    },
};
