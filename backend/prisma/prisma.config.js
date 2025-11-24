// backend/prisma.config.js
require("dotenv/config");
const { defineConfig, env } = require("prisma/config");

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // This reads DATABASE_URL from Render/Supabase env
    url: env("DATABASE_URL"),
  },
});
