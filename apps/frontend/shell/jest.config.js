// Path: apps/frontend/shell/jest.config.js
module.exports = {
    // ► Use the Angular preset so Jest can compile TS / HTML correctly
    preset: 'jest-preset-angular',
  
    // ► Where to look for tests
    roots: ['<rootDir>/src'],
  
    // ► Recognize .spec.ts and .test.ts files
    testMatch: ['**/+(*.)+(spec|test).[tj]s?(x)'],
  
    // ► Scripts to run after environment setup (e.g. TestBed init)
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  
    // ► One-time global setup before all tests (optional)
    globalSetup: 'jest-preset-angular/global-setup',
  
    // ► Path aliases to mirror your monorepo imports
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',                 // '@/...' → shell/src
      '^@vista/(.*)$': '<rootDir>/../../../libs/$1',  // '@vista/...' → libs/
    },
  
    // ► Skip scanning these folders
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  
    // ► File types Jest will process
    moduleFileExtensions: ['ts', 'js', 'html'],
  
    // ► Transform Angular + TS files via the preset
    transform: {
      '^.+\\.(ts|js|mjs|html|svg)$': [
        'jest-preset-angular',
        {
          tsconfig: '<rootDir>/tsconfig.json',
          stringifyContentPathRegex: '\\.html$',
        },
      ],
    },
  
    // ► Where coverage reports go
    coverageDirectory: '<rootDir>/coverage',
  
    // ► What to include/exclude in coverage
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.module.ts',
      '!src/**/*.array.ts',
      '!src/**/*.constant.ts',
      '!src/**/*.enum.ts',
      '!src/**/*.interface.ts',
      '!src/**/*.model.ts',
      '!src/**/*.spec.ts',
      '!src/**/*.test.ts',
      '!src/**/*.mock.ts',
      '!src/**/environment*.ts',
      '!src/main.ts'
    ],
  
    // ► Enforce minimum coverage thresholds (quality gate)
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
  
    // ► Show individual test results in CI logs
    verbose: true,
  
    transformIgnorePatterns: [
      'node_modules/(?!.*\\.mjs$)',
    ],
  };
  