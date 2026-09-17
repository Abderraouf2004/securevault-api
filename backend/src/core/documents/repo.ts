import { prisma } from "../../services/prisma";
import type { Document } from "../../modules/documents/documents.types";
import { ApiError } from "../../errors/api-error";
import type { PaginationQuery } from "../../modules/shared/pagination.schema";
import { toSkipTake } from "../../modules/shared/pagination.schema";
export const DocumentRepo = {
  create: async (data: Document.Create, userId: string) => {
    const document = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        ownerId: userId,
        originalName: data.originalName,
        storageKey: data.storageKey,
        mimeType: data.mimeType,
        size: data.size,
        storageStatus: "PENDING",
      },
    });

    return document;
  },

  getAll: async (userId: string, pagination: PaginationQuery) => {
    const { skip, take } = toSkipTake(pagination);
    const [documents, total] = await prisma.$transaction([
      prisma.document.findMany({
        where: { ownerId: userId, storageStatus: "READY" },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.document.count({
        where: { ownerId: userId, storageStatus: "READY" },
      }),
    ]);
    return { documents, total };
  },
  update: async (id: string, data: Document.Update, userId: string) => {
    const document = await prisma.document.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!document) {
      throw new ApiError({
        code: "FORBIDDEN",
        message: "You do not have permission to update this document.",
      });
    }
    const update = await prisma.document.update({
      where: { id },
      data: { ...data },
    });
    return update;
  },

  getById: async (id: string, userId: string) => {
    const document = await prisma.document.findFirst({
      where: { id, ownerId: userId, storageStatus: "READY" },
    });

    if (!document) {
      throw new ApiError({
        code: "FORBIDDEN",
        message: "You do not have permission to get this document.",
      });
    }
    return document;
  },
  markReady: async (id: string) => {
    const result = await prisma.document.updateMany({
      where: {
        id,
        storageStatus: "PENDING",
      },
      data: {
        storageStatus: "READY",
      },
    });

    if (result.count !== 1) {
      throw new ApiError({
        code: "CONFLICT",
        message: "Document is not in a pending state.",
      });
    }

    return prisma.document.findUniqueOrThrow({
      where: { id },
    });
  },
  markDeleting: async (id: string, userId: string) => {
    const result = await prisma.document.updateMany({
      where: {
        id,
        ownerId: userId,
        storageStatus: "READY",
      },
      data: {
        storageStatus: "DELETING",
      },
    });

    if (result.count !== 1) {
      throw new ApiError({
        code: "FORBIDDEN",
        message: "You do not have permission to delete this document.",
      });
    }

    return prisma.document.findUniqueOrThrow({
      where: { id },
    });
  },
  remove: async (id: string) => {
    return prisma.document.delete({
      where: { id },
    });
  },
  reconcilePending: async () => {
    return prisma.document.findMany({
      where: {
        storageStatus: {
          in: ["PENDING", "DELETING"],
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
};
