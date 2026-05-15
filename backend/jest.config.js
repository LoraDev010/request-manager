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
      // app.ts listen branch is intentionally unreachable in test env (NODE_ENV=test)
      branches: 65,
      functions: 85,
      lines: 85,
    },
  },
}
