import { ApiError } from "../../errors/api-error";
import { hash } from "../../services/hash";
import { prisma } from "../../services/prisma";
import { toSkipTake } from "../../modules/shared/pagination.schema";
export const UsersRepo = {
    getMe: async (id) => {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
            },
        });
        if (!user) {
            throw new ApiError({
                code: "NOT_FOUND",
                message: "User not found.",
            });
        }
        return user;
    },
    // getAll: async () => {
    //   const users = await prisma.user.findMany({ include: { role: true } });
    //   return users.map((u) => ({ ...u, roleName: u.role.name }));
    // },
    getAll: async (pagination) => {
        const { skip, take } = toSkipTake(pagination);
        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                include: { role: true },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            prisma.user.count(),
        ]);
        return {
            users: users.map((u) => ({ ...u, roleName: u.role.name })),
            total,
        };
    },
    getUserById: async (id) => {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
        if (!user) {
            throw new ApiError({
                code: "FORBIDDEN",
                message: "user not found.",
            });
        }
        return { ...user, roleName: user.role.name };
    },
    updateUserRole: async (id, rolename) => {
        const role = await prisma.role.findUnique({ where: { name: rolename } });
        const user = await prisma.user.update({
            where: { id },
            data: { roleId: role?.id },
        });
        return user;
    },
    updateUserprofile: async (userId, data) => {
        const update = await prisma.user.update({
            where: { id: userId },
            data: { ...data },
        });
        return update;
    },
    updateUserpassword: async (userId, data) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const isPasswordValid = await hash.comparePassword(data.Currentpassword, user?.password);
        if (!isPasswordValid) {
            throw new ApiError({
                code: "BAD_REQUEST",
                message: "Invalid password",
                details: "The password provided is incorrect. Please try again.",
            });
        }
        const hashedPassword = await hash.hashPassword(data.Newpassword);
        const update = await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return user;
    },
    deleteUser: async (id) => {
        await prisma.user.delete({ where: { id } });
        return { success: true };
    },
};
