module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  roots: [
    './highOrderComponents',
  ],
  collectCoverageFrom: [
    './highOrderComponents/**/*.ts',
    './highOrderComponents/**/*.tsx',
  ],
  coverageDirectory: './.build/coverage',
};
