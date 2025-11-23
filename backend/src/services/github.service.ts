import { ENV } from "../config/env";
import fetch from "node-fetch";
import { spawn } from "child_process";
import path from "path";

interface GitHubUser {
  login: string;
  html_url: string;
  avatar_url: string;
}

interface GitHubLabel {
  name: string;
  description: string | null;
  color: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  user: GitHubUser;
  labels: GitHubLabel[];
  created_at: string;
  updated_at: string;
  comments: number;
  body: string | null;
  repository_url: string;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
}

interface GitHubRepo {
  id: number;
  name:string;
  full_name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
}

// simple in-memory cache for repo metadata
const repoCache = new Map<string, GitHubRepo>();

export const getMergeRateFromPython = (owner: string, repo: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Assuming the process is started from the 'backend' directory
    const scriptPath = path.join(process.cwd(), 'src', 'scripts', 'calculate_merge_rate.py');
    const pythonProcess = spawn('python', [scriptPath, owner, repo]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    let error = '';
    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (error) {
        return reject(new Error(`Python script stderr: ${error}`));
      }
      try {
        const parsedResult = JSON.parse(result);
        if (parsedResult.error) {
            return reject(new Error(parsedResult.error));
        }
        resolve(parsedResult);
      } catch (e) {
        reject(new Error(`Failed to parse python script output: ${result}`));
      }
    });
  });
};

export class GitHubService {
  static async searchGoodFirstIssues(params?: {
    perPage?: number;
    language?: string;
    sortByStars?: "asc" | "desc"; // Added sortByStars parameter
  }): Promise<GitHubSearchResponse> {
    const perPage = params?.perPage ?? 10;

    const queryParts = [
      "is:issue",
      "is:open",
      'label:"good first issue"'
    ];

    if (params?.language) {
      queryParts.push(`language:${params.language}`);
    }

    const sortParam = params?.sortByStars ? `&sort=stars&order=${params.sortByStars}` : ''; // Add sort parameter

    const q = encodeURIComponent(queryParts.join(" "));
    const url = `https://api.github.com/search/issues?q=${q}&per_page=${perPage}${sortParam}`; // Include sortParam in URL

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "open-issue-tinder-api"
    };

    if (ENV.GITHUB_PAT) {
      headers.Authorization = `Bearer ${ENV.GITHUB_PAT}`;
    }

    // (optional) log query during debugging
    console.log("GitHub search URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("GitHub API error:", res.status, text);
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = (await res.json()) as GitHubSearchResponse;
    return data;
  }

  static async getRepo(repositoryUrl: string): Promise<GitHubRepo> {
    const cached = repoCache.get(repositoryUrl);
    if (cached) return cached;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "open-issue-tinder-api"
    };

    if (ENV.GITHUB_PAT) {
      headers.Authorization = `Bearer ${ENV.GITHUB_PAT}`;
    }

    const res = await fetch(repositoryUrl, {
      method: "GET",
      headers
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("GitHub Repo API error:", res.status, text);
      throw new Error(`GitHub Repo API error: ${res.status}`);
    }

    const repo = (await res.json()) as GitHubRepo;
    repoCache.set(repositoryUrl, repo);
    return repo;
  }
}
