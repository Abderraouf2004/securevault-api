import { Router } from "express";
import auth  from './auth';
import documents from './documents';

const router = Router();

router.use("/auth", auth);
router.use("/documents", documents);

export default router;