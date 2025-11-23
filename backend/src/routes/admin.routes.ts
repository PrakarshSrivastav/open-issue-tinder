import { Router } from "express";
import { syncIssues } from "../controllers/admin.controller";

const router = Router();
router.post("/sync", syncIssues);
export default router;
