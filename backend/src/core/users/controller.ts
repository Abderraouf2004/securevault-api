import type { Request, Response } from "express";
import { tryCatch } from "../../errors/try-catch";
import { UsersService } from "./service";

export const UsersController = {
  getMe: tryCatch(async (req: Request, res: Response) => {
    const data = await UsersService.getMe(req.user?.id as string);

    res.status(200).json({
      data,
      message: "Current user retrieved successfully",
    });
  }),
  getAll: tryCatch(async (req: Request, res: Response) => {
    const data = await UsersService.getAll();
    res.status(200).json({ data });
  }),
  getUserById: tryCatch(async (req: Request, res: Response) => {
    const data = await UsersService.getUserById(req.params.id as string);
    res.status(200).json({ data });
  }),
  updateUserRole: tryCatch(async (req: Request, res: Response) => {
    const data = await UsersService.updateUserRole(
      req.params.id as string,
      req.body.role as string,
    );
    res.status(200).json({ data });
  }),
  updateUserprofile: tryCatch(async (req: Request, res: Response) => {
    const data = await UsersService.updateUserprofile(
      req.user?.id as string,
      req.body,
      req.file,
    );
    res.status(200).json({ data });
  }),
  updateUserpassword: tryCatch(async (req: Request, res: Response) => {
    const data = await UsersService.updateUserpassword(
      req.user?.id as string,
      req.body,
    );
    res.status(200).json({ data });
  }),
  deleteUser: tryCatch(async (req: Request, res: Response) => {
    const data = await UsersService.deleteUser(req.params.id as string);
    res.status(200).json({ data });
  }),
};
