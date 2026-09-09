import { Router } from "express";
import auth  from './auth';
import documents from './documents';
import users from "./users";

const router = Router();

router.use("/auth", auth);
router.use("/documents", documents);
router.use("/users", users);

export default router;