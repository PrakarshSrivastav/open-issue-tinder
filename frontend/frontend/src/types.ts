export interface Issue {
  id: number;
  issueNumber: number;
  title: string;
  htmlUrl: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  labels: string[];

  user: {
    login: string;
    avatarUrl: string;
    htmlUrl: string;
  };

  repo: {
    name: string;
    fullName: string;
    htmlUrl: string;
    language: string | null;
    stars: number;
  };
}

export interface IssueResponse {
  totalCount: number;
  count: number;
  items: Issue[];
}
