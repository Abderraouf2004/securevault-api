import { PrismaClient } from "@prisma/client";

import type { Document } from "../../modules/documents/documents.types";
import { ApiError } from "../../errors/api-error";


const prisma = new PrismaClient();

export const DocumentRepo = {
    create: async (data: Document.Create, userId: string) => {
     const create = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        ownerId: userId,
      },
     });
     return create;
    },
    getAll: async (userId: string) => {
      const documents = await prisma.document.findMany({
        where: {
          ownerId: userId,
        },
      });
      return documents;
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
        data: {...data},
      });
      return update;
    },
    delete: async (id: string, userId: string) => {
        const document = await prisma.document.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!document) {
    throw new ApiError({
      code: "FORBIDDEN",
      message: "You do not have permission to delete this document.",
    });
  }
      const deleteDocument = await prisma.document.delete({
        where: { id  },
      });
      return deleteDocument;
    },
    getById: async (id: string, userId: string) => {
        const document = await prisma.document.findFirst({
          where: {id,ownerId: userId,},
        });
           
  if (!document) {
    throw new ApiError({
      code: "FORBIDDEN",
      message: "You do not have permission to get this document.",
    });
  }
     return document;

    },

};