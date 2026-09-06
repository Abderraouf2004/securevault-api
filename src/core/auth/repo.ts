import { PrismaClient } from "@prisma/client";
import type { User } from "../../modules/auth/auth.types";


const prisma = new PrismaClient();

export const UserRepo = {
  signup: async (data: User.signup) => {
     const signup = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
   
    if (!signup) throw new Error("Failed to sign up user");
    return signup;

  },
  readByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return user;
  },




};