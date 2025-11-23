import { Router } from "express";
import { getIssues } from "../controllers/issues.controller";

const router = Router();

// GET /api/issues?language=JavaScript&perPage=5
router.get("/", getIssues);

export default router;
