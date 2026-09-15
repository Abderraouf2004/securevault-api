import { prisma } from "../../services/prisma";
export const AuthRepo = {
    signup: async (data) => {
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                roleId: data.roleId,
            },
        });
        if (!user)
            throw new Error("Failed to sign up user");
        return user;
    },
    readByEmail: async (email) => {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            return null;
        return user;
    },
    readById: async (id) => {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            return null;
        return user;
    },
    findRoleByName: async (name) => {
        return prisma.role.findUnique({
            where: { name },
        });
    },
};
