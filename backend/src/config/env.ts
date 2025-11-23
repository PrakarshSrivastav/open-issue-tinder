export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  GITHUB_PAT: process.env.GITHUB_PAT || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
};

if (!ENV.GITHUB_PAT) {
  console.warn(
    "⚠️ No GITHUB_PAT set – GitHub API calls will be unauthenticated and rate-limited."
  );
}

if (!ENV.DATABASE_URL) {
  console.warn("⚠️ No DATABASE_URL set.");
}
