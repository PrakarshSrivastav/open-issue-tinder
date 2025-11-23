/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  moduleNameMapper: {
    '\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
  testMatch: ["**/__tests__/**/*.test.tsx"],
};
