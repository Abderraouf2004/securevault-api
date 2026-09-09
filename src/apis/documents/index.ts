import { Router } from "express";
import { validateRequestInput } from "../../errors/validate-request-input";
import {CreateDocumentSchema, IdParamSchema, UpdateDocumentSchema} from "../../modules/documents/documents.schema";
import { DocumentController } from "../../core/documents/controller";
import { upload } from "../../modules/documents/document.upload";
import { detectFileType } from "../../modules/documents/document.file-validator";
import { saveUploadedFile } from "../../modules/documents/document.storage";
import { authMiddleware } from "../../middleware/auth";

const document = Router();

document.post("/", 
     authMiddleware,
    validateRequestInput({ body: CreateDocumentSchema }),
    DocumentController.create,

);

document.post(
  "/upload",
  upload.single("file"),
  authMiddleware,
  async (req, res) => {
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

    const savedFile = await saveUploadedFile(
      req.file.buffer,
      detectedType
    );

    return res.status(201).json({
      message: "File uploaded successfully",
      file: {
        originalName: req.file.originalname,
        storedName: savedFile.storedName,
        mimeType: detectedType,
        size: req.file.size,
      },
    });
  }
);

document.get("/",
    authMiddleware,
    DocumentController.getAll
);

document.get("/:id",
    authMiddleware,
    validateRequestInput({ params: IdParamSchema }),
    DocumentController.getById
);

document.put("/:id",
    authMiddleware,
    validateRequestInput({ params: IdParamSchema ,body: UpdateDocumentSchema}),
    DocumentController.update
);



document.delete("/:id",
    authMiddleware,
    validateRequestInput({ params: IdParamSchema }),
    DocumentController.delete
);

export default document;