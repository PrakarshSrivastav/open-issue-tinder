import { Request, Response, NextFunction } from "express";
import { SyncService } from "../services/sync.services";

export const syncIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const perPage = req.query.perPage ? Number(req.query.perPage) : 50;
    const result = await SyncService.syncGoodFirstIssues(perPage);
    res.json({ message: "Sync completed", ...result });
  } catch (err) {
    next(err);
  }
};
