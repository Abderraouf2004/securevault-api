import { Router } from "express";
import { validateRequestInput } from "../../errors/validate-request-input";
import {CreateDocumentSchema, documentIdParamSchema, UpdateDocumentSchema} from "../../modules/documents/documents.schema";
import { DocumentController } from "../../core/documents/controller";

const document = Router();

document.post("/", 
    validateRequestInput({ body: CreateDocumentSchema }),
    DocumentController.create,

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