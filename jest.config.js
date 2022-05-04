module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  roots: [
    './src',
  ],
  collectCoverageFrom: [
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  coverageDirectory: './.build/coverage',
};
