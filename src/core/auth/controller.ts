import type { Request, Response } from "express";
import { tryCatch } from "../../errors/try-catch";
import { UserService } from "./service";


export const UserController = {
     signup: tryCatch(async (req: Request, res: Response) => {
          const data = await UserService.signup(req.body);
          res.status(201).json({ data, message: "signup successfully" });
     }),
     signin: tryCatch(async (req: Request, res: Response) => {
          const data = await UserService.signin(req.body);
          res.status(200).json({ data, message: "signin successfully" });
     }),
    

 
   
};


