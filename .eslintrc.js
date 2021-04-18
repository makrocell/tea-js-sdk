const base = require('@tearust/cli/config/eslint.cjs');

module.exports = {
  ...base,
  ignorePatterns: [
    '.eslintrc.js',
    '.github/**',
    '.vscode/**',
    '.yarn/**',
    '**/build/*',
    '**/__tests__/*',
    '**/coverage/*',
    '**/node_modules/*',
    'node_modules/*',
    '*.cjs',
    'packages/cli/*',
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.json'
    ]
  },
  rules: {
    ...base.rules,
    
    // this seems very broken atm, false positives
    '@typescript-eslint/unbound-method': 'off'
  }
};