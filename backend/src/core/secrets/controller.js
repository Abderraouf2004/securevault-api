import { tryCatch } from "../../errors/try-catch";
import { SecretService } from "./service";
export const SecretController = {
    create: tryCatch(async (req, res) => {
        const data = await SecretService.create(req.body, req.user?.id);
        res.status(200).json({ data, message: "Secrets created successfully" });
    }),
    // getAll: tryCatch(async (req: Request, res: Response) => {
    //   const data = await SecretService.getAll(req.user?.id as string);
    //   res.status(200).json({ data, message: "Secrets retrieved successfully" });
    // }),
    getAll: tryCatch(async (req, res) => {
        const pagination = req.query;
        const { data, meta } = await SecretService.getAll(req.user?.id, pagination);
        res
            .status(200)
            .json({ data, meta, message: "Secrets retrieved successfully" });
    }),
    update: tryCatch(async (req, res) => {
        const data = await SecretService.update(req.params.id, req.body, req.user?.id);
        res.status(200).json({ data, message: "Secrets updated successfully" });
    }),
    delete: tryCatch(async (req, res) => {
        const data = await SecretService.delete(req.params.id, req.user?.id);
        res.status(200).json({ data, message: "Secrets deleted successfully" });
    }),
    getById: tryCatch(async (req, res) => {
        const data = await SecretService.getById(req.params.id, req.user?.id);
        res.status(200).json({ data, message: "Secrets retrieved successfully" });
    }),
};
