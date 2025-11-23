import dotenv from "dotenv";
dotenv.config();

import { GitHubService } from "../services/github.service";
import prisma from "../db/prisma";

const seedDatabase = async () => {
  console.log("Seeding database...");

  const languages = ["JavaScript", "Python", "Java", "TypeScript", "Go", "Rust", "C++", "C#"];

  for (const language of languages) {
    console.log(`Fetching issues for ${language}...`);
    const searchResult = await GitHubService.searchGoodFirstIssues({
      language,
      perPage: 100,
    });

    for (const issue of searchResult.items) {
      const repoDetails = await GitHubService.getRepo(issue.repository_url);

      const repoRecord = await prisma.repo.upsert({
        where: { githubId: repoDetails.id },
        update: {
          name: repoDetails.name,
          fullName: repoDetails.full_name,
          htmlUrl: repoDetails.html_url,
          language: repoDetails.language,
          stars: repoDetails.stargazers_count,
        },
        create: {
          githubId: repoDetails.id,
          name: repoDetails.name,
          fullName: repoDetails.full_name,
          htmlUrl: repoDetails.html_url,
          language: repoDetails.language,
          stars: repoDetails.stargazers_count,
        },
      });

      await prisma.issue.upsert({
        where: { githubId: issue.id },
        update: {
          repoId: repoRecord.id,
          number: issue.number,
          title: issue.title,
          author: issue.user.login,
          authorUrl: issue.user.html_url,
          authorAvatarUrl: issue.user.avatar_url,
          htmlUrl: issue.html_url,
          state: issue.state,
          comments: issue.comments,
          labels: issue.labels.map((l) => l.name),
          language: repoDetails.language?.toLowerCase(),
          repoStars: repoDetails.stargazers_count,
          githubCreatedAt: issue.created_at,
          githubUpdatedAt: issue.updated_at,
        },
        create: {
          githubId: issue.id,
          repoId: repoRecord.id,
          number: issue.number,
          title: issue.title,
          author: issue.user.login,
          authorUrl: issue.user.html_url,
          authorAvatarUrl: issue.user.avatar_url,
          htmlUrl: issue.html_url,
          state: issue.state,
          comments: issue.comments,
          labels: issue.labels.map((l) => l.name),
          language: repoDetails.language?.toLowerCase(),
          repoStars: repoDetails.stargazers_count,
          githubCreatedAt: issue.created_at,
          githubUpdatedAt: issue.updated_at,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
};

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
