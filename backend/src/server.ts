import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { ENV } from "./config/env";

const port = ENV.PORT;

app.listen(port, () => {
  console.log(`OpenIssue Tinder API running on http://localhost:${port}`);
});
