import { ApiError } from "../../errors/api-error";
import type { User } from "../../modules/auth/auth.types";
import { hash } from "../../services/hash";
import { prisma } from "../../services/prisma";
import type { PaginationQuery } from "../../modules/shared/pagination.schema";
import { toSkipTake } from "../../modules/shared/pagination.schema";
export const UsersRepo = {
  getMe: async (id: string) => {
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
  getAll: async (pagination: PaginationQuery) => {
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
  getUserById: async (id: string) => {
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
  updateUserRole: async (id: string, rolename: string) => {
    const role = await prisma.role.findUnique({ where: { name: rolename } });
    const user = await prisma.user.update({
      where: { id },
      data: { roleId: role?.id },
    });
    return user;
  },
  updateUserprofile: async (userId: string, data: User.UpdateProfile) => {
    const update = await prisma.user.update({
      where: { id: userId },
      data: { ...data },
    });
    return update;
  },
  updateUserpassword: async (userId: string, data: User.UpdatePassword) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const isPasswordValid = await hash.comparePassword(
      data.Currentpassword,
      user?.password as string,
    );
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
  deleteUser: async (id: string) => {
    await prisma.user.delete({ where: { id } });
    return { success: true };
  },
};
