import { tryCatch } from "../../errors/try-catch";
import { DocumentService } from "./service";
export const DocumentController = {
    create: tryCatch(async (req, res) => {
        const data = await DocumentService.create(req.body, req.file, req.user?.id);
        res.status(201).json({ data, message: "Document created successfully" });
    }),
    getAll: tryCatch(async (req, res) => {
        //     const data = await DocumentService.getAll(req.user?.id as string);
        //     res.status(200).json({ data, message: "Documents retrieved successfully" });
        const pagination = req.query;
        const { data, meta } = await DocumentService.getAll(req.user?.id, pagination);
        res
            .status(200)
            .json({ data, meta, message: "Documents retrieved successfully" });
    }),
    update: tryCatch(async (req, res) => {
        const data = await DocumentService.update(req.params.id, req.body, req.user?.id);
        res.status(200).json({ data, message: "Document updated successfully" });
    }),
    delete: tryCatch(async (req, res) => {
        const data = await DocumentService.delete(req.params.id, req.user?.id);
        res.status(200).json({ data, message: "Document deleted successfully" });
    }),
    getById: tryCatch(async (req, res) => {
        const data = await DocumentService.getById(req.params.id, req.user?.id);
        res.status(200).json({ data, message: "Document retrieved successfully" });
    }),
};
