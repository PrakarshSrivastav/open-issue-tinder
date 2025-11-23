import { Request, Response, NextFunction } from "express";
import { ReposService } from "../services/repos.service";

export const getRepos = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { language } = req.query;
    const repos = ReposService.getAll(
      typeof language === "string" ? language : undefined
    );

    res.json({
      count: repos.length,
      data: repos
    });
  } catch (err) {
    next(err);
  }
};
