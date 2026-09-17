import { validateObject } from "../../errors/validate-object";
import type { Document } from "../../modules/documents/documents.types";
import { DocumentRepo } from "./repo";
import { DocumentDTOSchema } from "../../modules/documents/documents.schema";
import { detectFileType } from "../../modules/documents/document.file-validator";
import { saveUploadedFile } from "../../modules/documents/document.storage";
import { ApiError } from "../../errors/api-error";
import {
  buildPaginationMeta,
  type PaginationQuery,
} from "../../modules/shared/pagination.schema";
import { getFromMinio, deleteFromMinio } from "../../services/minio";
import crypto from "crypto";
export const DocumentService = {
  create: async (
    data: Document.Create,
    file: Express.Multer.File,
    userId: string,
  ) => {
    const detectedType = detectFileType(file.buffer);

    if (!detectedType) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "File type not allowed",
      });
    }

    const extensionByMimeType: Record<string, string> = {
      "application/pdf": ".pdf",
      "image/png": ".png",
      "image/jpeg": ".jpg",
    };

    const extension = extensionByMimeType[detectedType];

    if (!extension) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "Unsupported file type",
      });
    }
    const storageKey = `documents/${crypto.randomUUID()}${extension}`;

    const document = await DocumentRepo.create(
      {
        title: data.title,
        description: data.description,
        originalName: file.originalname,
        storageKey,
        mimeType: detectedType,
        size: file.size,
      },
      userId,
    );

    try {
      await saveUploadedFile(file.buffer, detectedType, storageKey);

      const readyDocument = await DocumentRepo.markReady(document.id);

      return validateObject<Document.DTO>(DocumentDTOSchema, readyDocument);
    } catch (error) {
      // Keep the document PENDING.
      // It can be reconciled/cleaned later.
      throw error;
    }
  },
  getAll: async (userId: string, pagination: PaginationQuery) => {
    const data = await DocumentRepo.getAll(userId, pagination);
    return {
      data: data.documents.map((document) =>
        validateObject<Document.DTO>(DocumentDTOSchema, document),
      ),
      meta: buildPaginationMeta(data.total, pagination),
    };
  },
  update: async (id: string, data: Document.Update, userId: string) => {
    const update = await DocumentRepo.update(id, data, userId);
    return validateObject<Document.DTO>(DocumentDTOSchema, update);
  },

  // delete: async (id: string, userId: string) => {
  //   const document = await DocumentRepo.getById(id, userId);

  //   await deleteFromMinio(document.storageKey);

  //   await DocumentRepo.delete(id, userId);

  //   return { success: true };
  // },
  delete: async (id: string, userId: string) => {
    const document = await DocumentRepo.markDeleting(id, userId);

    try {
      await deleteFromMinio(document.storageKey);

      await DocumentRepo.remove(id);

      return { success: true };
    } catch (error) {
      // Keep the document DELETING.
      // It can be retried/reconciled later.
      throw error;
    }
  },
  getById: async (id: string, userId: string) => {
    const document = await DocumentRepo.getById(id, userId);
    return validateObject<Document.DTO>(DocumentDTOSchema, document);
  },
  download: async (id: string, userId: string) => {
    const document = await DocumentRepo.getById(id, userId);

    const object = await getFromMinio(document.storageKey);

    if (!object.Body) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "File not found in storage",
      });
    }

    return {
      body: object.Body,
      contentType: document.mimeType,
      fileName: document.originalName,
      size: document.size,
    };
  },
};
