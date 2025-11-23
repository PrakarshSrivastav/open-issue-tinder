import { seedRepos } from "../data/seedRepos";
import { Repo } from "../types/repo";

export class ReposService {
  static getAll(language?: string): Repo[] {
    if (!language) return seedRepos;
    const langLower = language.toLowerCase();
    return seedRepos.filter(
      (repo) => repo.language.toLowerCase() === langLower
    );
  }
}
