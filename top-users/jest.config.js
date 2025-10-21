module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/test/"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@domain/(.*)$": "<rootDir>/domain/$1",
    "^@application/(.*)$": "<rootDir>/application/$1",
    "^@infrastructure/(.*)$": "<rootDir>/infrastructure/$1",
    "^@presentation/(.*)$": "<rootDir>/presentation/$1",
  },
};
