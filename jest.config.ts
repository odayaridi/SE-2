import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ts'],
    coverageDirectory: 'coverage',
}

export default config;