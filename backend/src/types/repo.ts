export interface Repo {
  id: string;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string;
  language: "Java" | "Python" | "JavaScript" | string;
  stars: number;
}
