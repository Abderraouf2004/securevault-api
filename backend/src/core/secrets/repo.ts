import { ApiError } from "../../errors/api-error";
import { Secret } from "../../modules/secrets/secrets.types";
import { prisma } from "../../services/prisma";

export const SecretRepo = {
  create: async (data: Secret.Create, userId: string) => {
    const secret = await prisma.secret.create({
      data: { name: data.name, Value: data.Value, ownerId: userId },
    });

    return secret;
  },
  getAll: async (userId: string) => {
    const secrets = await prisma.secret.findMany({
      where: {
        ownerId: userId,
      },
    });
    return secrets;
  },
  update: async (id: string, data: Secret.Update, userId: string) => {
    const secret = await prisma.secret.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!secret) {
      throw new ApiError({
        code: "FORBIDDEN",
        message: "You do not have permission to update this secret.",
      });
    }
    const update = await prisma.secret.update({
      where: { id },
      data: { ...data },
    });
    return update;
  },
  getById: async (id: string, userId: string) => {
    const secret = await prisma.secret.findFirst({
      where: { id, ownerId: userId },
    });

    if (!secret) {
      throw new ApiError({
        code: "FORBIDDEN",
        message: "You do not have permission to get this secret.",
      });
    }
    return secret;
  },

  delete: async (id: string, userId: string) => {
    const secret = await prisma.secret.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!secret) {
      throw new ApiError({
        code: "FORBIDDEN",
        message: "You do not have permission to delete this secret.",
      });
    }
    const deleteSecret = await prisma.secret.delete({
      where: { id },
    });
    return deleteSecret;
  },
};
