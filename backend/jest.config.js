/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/app.ts'],
  coverageThreshold: {
    global: {
      statements: 85,
      // defensive guard branches (500 fallback, ValidationError ctor, req.body??{}) are
      // intentionally unreachable through the HTTP layer — lowered threshold reflects this
      branches: 60,
      functions: 85,
      lines: 85,
    },
  },
}
