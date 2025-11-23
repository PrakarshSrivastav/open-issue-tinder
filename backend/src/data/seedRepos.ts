import { Repo } from "../types/repo";

export const seedRepos: Repo[] = [
  {
    id: "spring-projects/spring-boot",
    name: "spring-boot",
    fullName: "spring-projects/spring-boot",
    htmlUrl: "https://github.com/spring-projects/spring-boot",
    description:
      "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications.",
    language: "Java",
    stars: 72000
  },
  {
    id: "django/django",
    name: "django",
    fullName: "django/django",
    htmlUrl: "https://github.com/django/django",
    description: "The Web framework for perfectionists with deadlines.",
    language: "Python",
    stars: 78000
  },
  {
    id: "facebook/react",
    name: "react",
    fullName: "facebook/react",
    htmlUrl: "https://github.com/facebook/react",
    description: "The library for web and native user interfaces.",
    language: "JavaScript",
    stars: 220000
  }
];
