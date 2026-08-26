import { PrismaClient } from "@prisma/client";

import type { Document } from "../../modules/documents/documents.types";


const prisma = new PrismaClient();

export const DocumentRepo = {
    create: async (data: Document.Create) => {
     const create = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        ownerId:"7dc14822-4640-47cf-b295-812a098e6db6"
      },
     });
     return create;
    },
    getAll: async () => {
      const documents = await prisma.document.findMany();
      return documents;
    },
    update: async (id: string, data: Document.Update) => {
      const update = await prisma.document.update({
        where: { id },
        data: {...data},
      });
      return update;
    },
    delete: async (id: string) => {
      const deleteDocument = await prisma.document.delete({
        where: { id },
      });
      return deleteDocument;
    }

};