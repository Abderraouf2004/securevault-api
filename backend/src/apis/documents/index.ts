import { Router } from "express";
import { validateRequestInput } from "../../errors/validate-request-input";
import {
  CreateDocumentSchema,
  IdParamSchema,
  UpdateDocumentSchema,
} from "../../modules/documents/documents.schema";
import { DocumentController } from "../../core/documents/controller";
import { upload } from "../../modules/documents/document.upload";
import { authMiddleware } from "../../middleware/auth";
import { PaginationQuerySchema } from "../../modules/shared/pagination.schema";

const document = Router();

document.post(
  "/",
  authMiddleware,
  upload.single("file"),
  validateRequestInput({ body: CreateDocumentSchema }),
  DocumentController.create,
);

document.get(
  "/",
  authMiddleware,
  validateRequestInput({ query: PaginationQuerySchema }),
  DocumentController.getAll,
);

document.get(
  "/:id/download",
  authMiddleware,
  validateRequestInput({ params: IdParamSchema }),
  DocumentController.download,
);

document.get(
  "/:id",
  authMiddleware,
  validateRequestInput({ params: IdParamSchema }),
  DocumentController.getById,
);

document.put(
  "/:id",
  authMiddleware,
  validateRequestInput({ params: IdParamSchema, body: UpdateDocumentSchema }),
  DocumentController.update,
);

document.delete(
  "/:id",
  authMiddleware,
  validateRequestInput({ params: IdParamSchema }),
  DocumentController.delete,
);

export default document;
