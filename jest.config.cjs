const config = require('@tearust/cli/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@tearust/utils(.*)$': '<rootDir>/packages/utils/src/$1',
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/*/build',
  ],
  transformIgnorePatterns: []
});