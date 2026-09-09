import {  validateObject } from "../../errors/validate-object";
import type { Document } from "../../modules/documents/documents.types";
import {  DocumentRepo } from "./repo";
import { DocumentDTOSchema } from "../../modules/documents/documents.schema";

export const DocumentService = {

  create: async (data: Document.Create, userId: string) => {

   const create = await DocumentRepo.create(data, userId);
   return validateObject<Document.DTO>(DocumentDTOSchema, create);
  },
  getAll: async (userId: string) => {
    const documents = await DocumentRepo.getAll(userId);
    return documents.map((document) => validateObject<Document.DTO>(DocumentDTOSchema, document));
  },
  update: async (id: string, data: Document.Update, userId: string) => {
    const update = await DocumentRepo.update(id, data,userId);
    return validateObject<Document.DTO>(DocumentDTOSchema, update);
  },
  delete: async (id: string, userId: string) => {
    await DocumentRepo.delete(id,userId);
    return { success: true }; 
  },
  getById: async (id: string, userId: string) => {
    const document = await DocumentRepo.getById(id,userId);
    return validateObject<Document.DTO>(DocumentDTOSchema, document);
  }
};