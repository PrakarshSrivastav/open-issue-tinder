import { PrismaClient } from "@prisma/client";
import { ENV } from "../src/config/env";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
export default prisma;
