import {  validateObject } from "../../errors/validate-object";
import type { Document } from "../../modules/documents/documents.types";
import {  DocumentRepo } from "./repo";
import { DocumentDTOSchema } from "../../modules/documents/documents.schema";

export const DocumentService = {

  create: async (data: Document.Create) => {
   const create = await DocumentRepo.create(data);
   return validateObject<Document.DTO>(DocumentDTOSchema, create);
  },
  getAll: async () => {
    const documents = await DocumentRepo.getAll();
    return documents.map((document) => validateObject<Document.DTO>(DocumentDTOSchema, document));
  },
  update: async (id: string, data: Document.Update) => {
    const update = await DocumentRepo.update(id, data);
    return validateObject<Document.DTO>(DocumentDTOSchema, update);
  },
  delete: async (id: string) => {
    await DocumentRepo.delete(id);
    return { success: true }; 
  }
};