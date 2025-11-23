import express from "express";
import cors from "cors";
import reposRouter from "./routes/repos.routes";
import { errorHandler } from "./middleware/errorHandler";
import githubRouter from "./routes/github.routes";
import issuesRouter from "./routes/issues.routes";
import adminRouter from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/repos", reposRouter);

app.use("/api/github", githubRouter);

app.use("/api/issues", issuesRouter);

app.use("/api/admin", adminRouter);

app.use(errorHandler);

export default app;
