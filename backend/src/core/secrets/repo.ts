import { ApiError } from "../../errors/api-error";
import { Secret } from "../../modules/secrets/secrets.types";
import { prisma } from "../../services/prisma";
import type { PaginationQuery } from "../../modules/shared/pagination.schema";
import { toSkipTake } from "../../modules/shared/pagination.schema";
export const SecretRepo = {
  create: async (data: Secret.Create, userId: string) => {
    const secret = await prisma.secret.create({
      data: { name: data.name, Value: data.Value, ownerId: userId },
    });

    return secret;
  },
  // getAll: async (userId: string) => {
  //   const secrets = await prisma.secret.findMany({
  //     where: {
  //       ownerId: userId,
  //     },
  //   });
  //   return secrets;
  // },
  getAll: async (userId: string, pagination: PaginationQuery) => {
    const { skip, take } = toSkipTake(pagination);
    const [secrets, total] = await prisma.$transaction([
      prisma.secret.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.secret.count({ where: { ownerId: userId } }),
    ]);
    return { secrets, total };
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
