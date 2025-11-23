import { Request, Response, NextFunction } from "express";
import { GitHubService, getMergeRateFromPython } from "../services/github.service";

export const getMergeStats = async (req: Request, res: Response) => {
  try {
    const { owner, repo } = req.params;
    const stats = await getMergeRateFromPython(owner, repo);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getGoodFirstIssues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { language, perPage } = req.query;

    const perPageNum =
      typeof perPage === "string" ? Number(perPage) : undefined;

    const result = await GitHubService.searchGoodFirstIssues({
      language: typeof language === "string" ? language : undefined,
      perPage: perPageNum
    });

    // Optionally map down to a smaller payload for frontend
    const simplified = result.items.map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      htmlUrl: issue.html_url,
      state: issue.state,
      repositoryUrl: issue.repository_url,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      comments: issue.comments,
      labels: issue.labels.map((l) => l.name),
      author: {
        login: issue.user.login,
        htmlUrl: issue.user.html_url
      }
    }));

    res.json({
      totalCount: result.total_count,
      count: simplified.length,
      items: simplified
    });
  } catch (err) {
    next(err);
  }
};
