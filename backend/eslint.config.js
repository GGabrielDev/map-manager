import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginImport from 'eslint-plugin-import'
import pluginNoRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import prettier from 'eslint-config-prettier'

export default tseslint.config([
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  {
    files: ['**/*.{ts,js}'],
    plugins: {
      'no-relative-import-paths': pluginNoRelativeImportPaths,
      'simple-import-sort': pluginSimpleImportSort,
      'import': pluginImport,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          extensions: ['.js', '.ts'],
        },
        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },
    rules: {
      // Import rules
      'import/no-relative-parent-imports': 'off',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      
      // No relative import paths
      'no-relative-import-paths/no-relative-import-paths': [
        'warn',
        { 
          allowSameFolder: true, 
          rootDir: 'src', 
          prefix: '@' 
        }
      ],
      
      // Simple import sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Node.js specific rules
      'no-console': 'warn',
      'no-process-exit': 'error',
    },
  },
  prettier,
])
