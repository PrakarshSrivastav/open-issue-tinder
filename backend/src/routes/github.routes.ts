import { Router } from "express";
import { getGoodFirstIssues, getMergeStats } from "../controllers/github.controller";

const router = Router();

// GET /api/github/issues?language=JavaScript&perPage=5
router.get("/issues", getGoodFirstIssues);

router.get("/:owner/:repo/merge-stats", getMergeStats);

export default router;
