import prisma from "../../prisma/prisma";
import { GitHubService } from "./github.service";

export class SyncService {
  static async syncGoodFirstIssues(perPage: number = 50) {
    const searchResult = await GitHubService.searchGoodFirstIssues({ perPage, sortByStars: "asc" }); // Pass sortByStars: "asc"
    const issues = searchResult.items;

    const uniqueRepoUrls = Array.from(
      new Set(issues.map((i) => i.repository_url))
    );

    const repoMap = new Map<
      string,
      Awaited<ReturnType<typeof GitHubService.getRepo>>
    >();

    await Promise.all(
      uniqueRepoUrls.map(async (url) => {
        const repo = await GitHubService.getRepo(url);
        repoMap.set(url, repo);
      })
    );

    for (const ghIssue of issues) {
      const ghRepo = repoMap.get(ghIssue.repository_url);
      if (!ghRepo) continue;

      const langLower = ghRepo.language
        ? ghRepo.language.toLowerCase()
        : null;

      const repo = await prisma.repo.upsert({
        where: { githubId: BigInt((ghRepo as any).id) },
        update: {
          name: ghRepo.name,
          fullName: ghRepo.full_name,
          htmlUrl: ghRepo.html_url,
          language: langLower,
          stars: ghRepo.stargazers_count
        },
        create: {
          githubId: BigInt((ghRepo as any).id),
          name: ghRepo.name,
          fullName: ghRepo.full_name,
          htmlUrl: ghRepo.html_url,
          language: langLower,
          stars: ghRepo.stargazers_count
        }
      });

      await prisma.issue.upsert({
        where: { githubId: BigInt(ghIssue.id) },
        update: {
          repoId: repo.id,
          number: ghIssue.number,
          title: ghIssue.title,
          htmlUrl: ghIssue.html_url,
          state: ghIssue.state,
          comments: ghIssue.comments,
          labels: ghIssue.labels.map((l) => l.name),
          language: langLower,
          repoStars: ghRepo.stargazers_count,
          githubCreatedAt: new Date(ghIssue.created_at),
          githubUpdatedAt: new Date(ghIssue.updated_at)
        },
        create: {
          githubId: BigInt(ghIssue.id),
          repoId: repo.id,
          number: ghIssue.number,
          title: ghIssue.title,
          htmlUrl: ghIssue.html_url,
          state: ghIssue.state,
          comments: ghIssue.comments,
          labels: ghIssue.labels.map((l) => l.name),
          language: langLower,
          repoStars: ghRepo.stargazers_count,
          githubCreatedAt: new Date(ghIssue.created_at),
          githubUpdatedAt: new Date(ghIssue.updated_at)
        }
      });
    }

    return { syncedIssues: issues.length, syncedRepos: uniqueRepoUrls.length };
  }
}
