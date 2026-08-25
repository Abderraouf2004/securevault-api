import { Router } from "express";
import { validateRequestInput } from "../errors/validate-request-input";
import {signupSchema} from "../modules/auth/auth.schema";
import { UserController } from "../core/controller";

const router = Router();

router.post("/register", 
    validateRequestInput({ body: signupSchema }),
    UserController.signup,

);

export default router;