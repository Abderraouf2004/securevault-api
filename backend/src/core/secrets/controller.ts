import { tryCatch } from "../../errors/try-catch";
import type { Request, Response } from "express";
import { SecretService } from "./service";

export const SecretController = {
  create: tryCatch(async (req: Request, res: Response) => {
    const data = await SecretService.create(req.body, req.user?.id as string);
    res.status(200).json({ data, message: "Secrets created successfully" });
  }),
  getAll: tryCatch(async (req: Request, res: Response) => {
    const data = await SecretService.getAll(req.user?.id as string);
    res.status(200).json({ data, message: "Secrets retrieved successfully" });
  }),
  update: tryCatch(async (req: Request, res: Response) => {
    const data = await SecretService.update(
      req.params.id as string,
      req.body,
      req.user?.id as string,
    );
    res.status(200).json({ data, message: "Secrets updated successfully" });
  }),
  delete: tryCatch(async (req: Request, res: Response) => {
    const data = await SecretService.delete(
      req.params.id as string,
      req.user?.id as string,
    );
    res.status(200).json({ data, message: "Secrets deleted successfully" });
  }),
  getById: tryCatch(async (req: Request, res: Response) => {
    const data = await SecretService.getById(
      req.params.id as string,
      req.user?.id as string,
    );
    res.status(200).json({ data, message: "Secrets retrieved successfully" });
  }),
};
