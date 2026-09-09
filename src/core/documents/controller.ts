import type { Request, Response } from "express";
import { tryCatch } from "../../errors/try-catch";
import { DocumentService } from "./service";


export const DocumentController = {
     create: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.create(req.body, req.user?.id as string);
          res.status(201).json({ data, message: "Document created successfully" });
     }),
     getAll: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.getAll(req.user?.id as string);
          res.status(200).json({ data, message: "Documents retrieved successfully" });
     }),
     update: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.update(req.params.id as string, req.body,req.user?.id as string);
          res.status(200).json({ data, message: "Document updated successfully" });
     }),
     delete: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.delete(req.params.id as string,req.user?.id as string);
          res.status(200).json({ data, message: "Document deleted successfully" });
     }),
     getById: tryCatch(async (req: Request, res: Response) => {
          const data = await DocumentService.getById(req.params.id as string,req.user?.id as string);
          res.status(200).json({ data, message: "Document retrieved successfully" });
     }),

    

 
   
};