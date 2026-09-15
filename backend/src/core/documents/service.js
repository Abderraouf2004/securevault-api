import { validateObject } from "../../errors/validate-object";
import { DocumentRepo } from "./repo";
import { DocumentDTOSchema } from "../../modules/documents/documents.schema";
import { detectFileType } from "../../modules/documents/document.file-validator";
import { saveUploadedFile } from "../../modules/documents/document.storage";
import { ApiError } from "../../errors/api-error";
import { buildPaginationMeta, } from "../../modules/shared/pagination.schema";
export const DocumentService = {
    create: async (data, file, userId) => {
        const detectedType = detectFileType(file.buffer);
        if (!detectedType) {
            throw new ApiError({
                code: "BAD_REQUEST",
                message: "File type not allowed",
            });
        }
        const savedFile = await saveUploadedFile(file.buffer, detectedType);
        const create = await DocumentRepo.create({
            title: data.title,
            description: data.description,
            originalName: file.originalname,
            storageKey: savedFile.storedName,
            mimeType: detectedType,
            size: file.size,
        }, userId);
        return validateObject(DocumentDTOSchema, create);
    },
    getAll: async (userId, pagination) => {
        const data = await DocumentRepo.getAll(userId, pagination);
        return {
            data: data.documents.map((document) => validateObject(DocumentDTOSchema, document)),
            meta: buildPaginationMeta(data.total, pagination),
        };
    },
    update: async (id, data, userId) => {
        const update = await DocumentRepo.update(id, data, userId);
        return validateObject(DocumentDTOSchema, update);
    },
    delete: async (id, userId) => {
        await DocumentRepo.delete(id, userId);
        return { success: true };
    },
    getById: async (id, userId) => {
        const document = await DocumentRepo.getById(id, userId);
        return validateObject(DocumentDTOSchema, document);
    },
};
