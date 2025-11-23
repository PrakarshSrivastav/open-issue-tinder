import { Request, Response, NextFunction } from "express";
import { IssuesService } from "../services/issues.service";

export const getIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { language, perPage, sortByStars, page } = req.query;

    const perPageNum = perPage ? Number(perPage) : undefined;
    const pageNum = page ? Number(page) : undefined;
    const sortDir =
      sortByStars === "asc" || sortByStars === "desc"
        ? (sortByStars as "asc" | "desc")
        : undefined;

    const result = await IssuesService.getGoodFirstIssues({
      language: typeof language === "string" ? language : undefined,
      perPage: perPageNum,
      sortByStars: sortDir,
      page: pageNum,
    });

    res.json({
      totalCount: result.totalCount,
      count: result.items.length,
      items: result.items,
    });
  } catch (err) {
    next(err);
  }
};
