module.exports = {
  setupFilesAfterEnv: ["./test/setup-env.ts"],
  modulePathIgnorePatterns: ["<rootDir>/build/"],
  moduleNameMapper: {
    "^src(.*)": "<rootDir>/src$1",
    "^tests(.*)": "<rootDir>/__tests__$1",
    "^test(.*)": "<rootDir>/test$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}"
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      // diagnostics: false,
    },
  },
};
