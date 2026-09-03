import { Router } from "express";
import { validateRequestInput } from "../../errors/validate-request-input";
import {CreateDocumentSchema, documentIdParamSchema, UpdateDocumentSchema} from "../../modules/documents/documents.schema";
import { DocumentController } from "../../core/documents/controller";
import { upload } from "../../modules/documents/document.upload";
import { detectFileType } from "../../modules/documents/document.file-validator";

const document = Router();

document.post("/", 
    validateRequestInput({ body: CreateDocumentSchema }),
    DocumentController.create,

);

document.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const detectedType = detectFileType(req.file.buffer);

    if (!detectedType) {
      return res.status(400).json({
        message: "File type not allowed",
      });
    }

    return res.status(201).json({
      message: "File validated successfully",
      originalName: req.file.originalname,
      detectedType,
      size: req.file.size,
    });
  }
);

document.get("/",
    DocumentController.getAll
);

document.put("/:id",
    validateRequestInput({ params: documentIdParamSchema ,body: UpdateDocumentSchema}),
    DocumentController.update
);

document.delete("/:id",
    validateRequestInput({ params: documentIdParamSchema }),
    DocumentController.delete
);

export default document;