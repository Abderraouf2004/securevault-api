import { Router } from "express";
import { validateRequestInput } from "../../errors/validate-request-input";
import {signinSchema, signupSchema} from "../../modules/auth/auth.schema";
import { AuthController } from "../../core/auth/controller";
import googleRouter from "./oauth";

const auth = Router();

auth.get("/verify", AuthController.verifyToken);

auth.get("/signout", AuthController.signOut);


auth.post("/signup", 
    validateRequestInput({ body: signupSchema }),
    AuthController.signup,

);

auth.post("/signin",
    validateRequestInput({ body: signinSchema }),
    AuthController.signin,
);


auth.use("/oauth",googleRouter);


export default auth;