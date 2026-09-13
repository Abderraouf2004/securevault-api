import type { Request, Response } from "express";
import { tryCatch } from "../../errors/try-catch";
import { UsersService } from "./service";


export const UsersController = {
     getAll: tryCatch(async (req: Request, res: Response) => {
          const data = await UsersService.getAll();
          res.status(200).json({ data });
     }),
     getUserById: tryCatch(async (req: Request, res: Response) => {
          const data = await UsersService.getUserById(req.params.id as string);
          res.status(200).json({ data });
     }),
     updateUserRole: tryCatch(async (req: Request, res: Response) => {
            const data = await UsersService.updateUserRole(req.params.id as string, req.body.role as string);
            res.status(200).json({ data });
     }),
     deleteUser: tryCatch(async (req: Request, res: Response) => {
            const data = await UsersService.deleteUser(req.params.id as string);
            res.status(200).json({ data });
     }),
    

 
   
};