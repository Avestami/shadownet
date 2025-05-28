module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_|^e$',
      'varsIgnorePattern': '^_|^[a-zA-Z]$',
      'ignoreRestSiblings': true
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    '@next/next/no-page-custom-font': 'off',
    'no-var': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  },
  ignorePatterns: [
    'app/generated/**/*',
    'node_modules/**/*',
    '.next/**/*',
    'dist/**/*',
    'prisma/**/*',
    'public/**/*'
  ]
} 