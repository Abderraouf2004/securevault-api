import { PrismaClient } from "@prisma/client";
import { ApiError } from "../../errors/api-error";


const prisma = new PrismaClient();

export const UsersRepo = {

    getAll: async () => {
      const users = await prisma.user.findMany();
      return users;
    },
    getUserById: async (id: string) => {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new ApiError({
      code: "FORBIDDEN",
      message: "user not found.",
    });
      }
      return user;
    },
    updateUserRole: async (id: string, rolename: string) => {
      const role = await prisma.role.findUnique({ where: { name: rolename } });
      const user = await prisma.user.update({ where: { id }, data: { roleId: role?.id } });
      return user;
    },
    deleteUser: async (id: string) => {
      await prisma.user.delete({ where: { id } });
      return { success: true };
    }

};