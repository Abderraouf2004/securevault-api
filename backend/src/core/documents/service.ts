import {  validateObject } from "../../errors/validate-object";
import type { Document } from "../../modules/documents/documents.types";
import {  DocumentRepo } from "./repo";
import { DocumentDTOSchema } from "../../modules/documents/documents.schema";
import { detectFileType } from "../../modules/documents/document.file-validator";
import { saveUploadedFile } from "../../modules/documents/document.storage";
import { ApiError } from "../../errors/api-error";
export const DocumentService = {

  create: async (data: Document.Create,file: Express.Multer.File,userId: string) => {
   const detectedType = detectFileType(file.buffer);

    if (!detectedType) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "File type not allowed",
      });
    }

    const savedFile = await saveUploadedFile(
      file.buffer,
      detectedType
    );

    const create = await DocumentRepo.create( 
      {
        title: data.title,
        description: data.description,
        originalName: file.originalname,
        storageKey: savedFile.storedName,
        mimeType: detectedType,
        size: file.size,
      },
    userId);
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