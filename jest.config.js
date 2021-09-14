module.exports = {
  projects: [
    {
      verbose: true,
      expand: true,
      displayName: 'test',
      cacheDirectory: '<rootDir>/jest_cache/',
      coverageDirectory: '<rootDir>/coverage/',
      coverageReporters: ['text', 'lcov', 'html'],
      moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'less', 'css'],
      moduleNameMapper: {
        '\\.(svg)$': '<rootDir>/setup/fileMock.js',
        '\\.(less|css)$': 'identity-obj-proxy',
      },
      roots: ['<rootDir>/src'],
      setupFiles: ['<rootDir>/setup/setup.js'],
      setupFilesAfterEnv: ['<rootDir>/setup/setup-test-env.js'],
      testEnvironment: 'jsdom',
      testMatch: ['**/?(*.)+(spec).+(js|jsx|ts|tsx)'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest',
        '^.+.(css|less)$': 'jest-transform-stub',
      },
      transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*(nav).*).*$'],
      moduleDirectories: ['node_modules', 'src/client', 'src/client/app'],
    },
  ]
};
