export interface IssueAuthor {
  login: string;
  htmlUrl: string;
  avatarUrl: string;
}

export interface IssueRepo {
  name: string;
  fullName: string;
  htmlUrl: string;
  language: string | null;
  stars: number;
}

export interface Issue {
  id: number;
  issueNumber: number;
  title: string;
  htmlUrl: string;
  state: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  comments: number;
  labels: string[];
  author: IssueAuthor;
  repo: IssueRepo;
}
