// backend/prisma/prisma.config.js
const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  engine: 'js', // or 'classic'
  datasource: {
    url: process.env.DATABASE_URL,
  },
});