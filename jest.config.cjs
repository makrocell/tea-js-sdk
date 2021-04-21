const config = require('@tearust/cli/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/utils/build',
    '<rootDir>/packages/layer1/build',
    


    
    '<rootDir>/packages/layer1/*',
    // '<rootDir>/packages/utils/*',

  ],
  transformIgnorePatterns: [],
  verbose: true,
});
