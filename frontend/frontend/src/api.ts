import type { IssueResponse } from "./types";

const BASE_URL = "http://localhost:4000/api";

export async function fetchIssues(params: {
  language?: string;
  sortByStars?: "asc" | "desc";
  perPage?: number;
  page?: number;
}): Promise<IssueResponse> {
  const query = new URLSearchParams();

  if (params.language) query.append("language", params.language);
  if (params.sortByStars) query.append("sortByStars", params.sortByStars);
  if (params.perPage) query.append("perPage", String(params.perPage));
  if (params.page) query.append("page", String(params.page));

  const res = await fetch(`${BASE_URL}/issues?${query.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorData.message || "Failed to fetch issues");
  }
  return await res.json();
}

export async function getMergeStats(owner: string, repo: string) {
  const response = await fetch(`${BASE_URL}/github/${owner}/${repo}/merge-stats`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch merge stats');
  }
  return response.json();
}
