import prisma from "../../prisma/prisma.config";
import { Issue as IssueType } from "../types/issue";

interface GetIssuesParams {
  language?: string;
  perPage?: number;
  sortByStars?: "asc" | "desc";
  page?: number;
}

export class IssuesService {
  static async getGoodFirstIssues(
    params: GetIssuesParams
  ): Promise<{ totalCount: number; items: IssueType[] }> {
    const { language, perPage, sortByStars, page } = params;
    const take = perPage ?? 10;
    const skip = page && page > 1 ? (page - 1) * take : 0;

    const where: any = {};

    if (language) {
      where.language = language.toLowerCase();
    } else {
      where.language = { in: ["javascript", "python", "java"] };
    }

    const orderBy = sortByStars
      ? { repoStars: sortByStars }
      : { githubUpdatedAt: "desc" as const };

    const [rows, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        orderBy,
        take,
        skip,
        include: { repo: true },
      }),
      prisma.issue.count({ where }),
    ]);

    const items: IssueType[] = rows.map((row) => ({
      id: Number(row.githubId),
      issueNumber: row.number,
      title: row.title,
      htmlUrl: row.htmlUrl,
      state: row.state === "open" ? "open" : "closed",
      createdAt: row.githubCreatedAt.toISOString(),
      updatedAt: row.githubUpdatedAt.toISOString(),
      comments: row.comments,
      labels: row.labels,
      author: {
        login: row.author,
        htmlUrl: row.authorUrl,
        avatarUrl: row.authorAvatarUrl,
      },
      repo: {
        name: row.repo.name,
        fullName: row.repo.fullName,
        htmlUrl: row.repo.htmlUrl,
        language: row.language ?? null,
        stars: row.repoStars,
      },
    }));

    return { totalCount: total, items };
  }
}
