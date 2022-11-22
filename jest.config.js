module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  roots: ['<rootDir>/src/'],
  setupFiles: ['./src/jest/jest.setup.jsdom.ts'],
  setupFilesAfterEnv: [
    './src/jest/jest.setup-suite.jsdom.ts',
    './src/jest/jest.setup-suite.ts',
  ],
  displayName: 'dom',
  testEnvironment: 'jsdom',
  testMatch: null,
  testRegex: '(\\.|/)(test|spec)\\.[jt]sx?$',
  moduleNameMapper: {
    '/public/data/tokenlists/tokens-5.json':
      '<rootDir>/src/tests/tokenlists/tokens-5.json',
    '/public/data/tokenlists/tokens-42.json':
      '<rootDir>/src/tests/tokenlists/tokens-42.json',
  },
};
