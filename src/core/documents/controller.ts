import type { Request, Response } from "express";
import { tryCatch } from "../../errors/try-catch";
import { DocumentService } from "./service";


export const DocumentController = {
     create: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.create(req.body);
          res.status(201).json({ data, message: "Document created successfully" });
     }),
     getAll: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.getAll();
          res.status(200).json({ data, message: "Documents retrieved successfully" });
     }),
     update: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.update(req.params.id as string, req.body);
          res.status(200).json({ data, message: "Document updated successfully" });
     }),
     delete: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.delete(req.params.id as string);
          res.status(200).json({ data, message: "Document deleted successfully" });
     }),

    

 
   
};