/* eslint-disable import/no-default-export */
const config = {
  moduleDirectories: ["node_modules", "src"],
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|e2e-spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^#tests($|/.*)$": "<rootDir>/tests/$1",
    "^#modules($|/.*)$": "<rootDir>/src/modules/$1",
    "^#main($|/.*)$": "<rootDir>/src/main/$1",
    "^#utils($|/.*)$": "<rootDir>/src/utils/$1",
  },
  setupFiles: ["./jest.setup.ts"],
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
};

export default config;
