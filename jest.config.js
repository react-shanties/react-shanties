module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  roots: [
    './src',
  ],
  collectCoverageFrom: [
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  coverageDirectory: './.build/coverage',
  preset: 'ts-jest',
};
