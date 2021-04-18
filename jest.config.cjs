const config = require('@tearust/cli/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    'tearust_utils(.*)$': '<rootDir>/packages/utils/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/*/build',

    // '<rootDir>/packages/layer1/*',
    '<rootDir>/packages/utils/*',
  ],
  transformIgnorePatterns: [],
  verbose: true,
});
