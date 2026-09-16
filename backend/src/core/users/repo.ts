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

  getAll: async (pagination: PaginationQuery) => {
    const { skip, take } = toSkipTake(pagination);
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          role: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
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
  // updateUserRole: async (id: string, rolename: string) => {
  //   const role = await prisma.role.findUnique({ where: { name: rolename } });
  //   const user = await prisma.user.update({
  //     where: { id },
  //     data: { roleId: role?.id },
  //   });
  //   return user;
  // },
  updateUserRole: async (id: string, rolename: string) => {
    const role = await prisma.role.findUnique({ where: { name: rolename } });

    if (!role) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "Invalid role",
        details: `Role "${rolename}" does not exist.`,
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { roleId: role.id },
      include: { role: true },
    });

    return { ...user, roleName: user.role.name };
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
  // deleteUser: async (id: string) => {
  //   await prisma.user.delete({ where: { id } });
  //   return { success: true };
  // },
  deleteUser: async (id: string) => {
    try {
      await prisma.user.delete({ where: { id } });
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.toLowerCase().includes("foreign key constraint")) {
        throw new ApiError({
          code: "CONFLICT",
          message: "Cannot delete user",
          details:
            "This user still owns documents or secrets. Delete or reassign those first, then try again.",
        });
      }

      throw error;
    }
  },
};
