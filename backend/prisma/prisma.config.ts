// backend/prisma/prisma.config.ts
import { defineConfig } from 'prisma/config'

export default defineConfig({
  engine: 'js',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
} as any)