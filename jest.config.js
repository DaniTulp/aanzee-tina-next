module.exports = {
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["./test/setup-env.ts"],
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
    "^tests/(.*)": "<rootDir>/__tests__/$1",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};
