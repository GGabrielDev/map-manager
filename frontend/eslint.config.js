import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import pluginImport from 'eslint-plugin-import'
import pluginNoRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import prettier from 'eslint-config-prettier/flat'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'no-relative-import-paths': pluginNoRelativeImportPaths,
      'simple-import-sort': pluginSimpleImportSort,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      pluginImport.flatConfigs.recommended,
      pluginImport.flatConfigs.typescript,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          // This option loads `tsconfig.json` and uses its paths
          project: './tsconfig.json', // Adjust the path if necessary
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add your extensions
        },
      },
    },
    rules: {
       'import/no-relative-parent-imports': 'off', // Temporarily disable this rule
       'import/named': 'error',
       'import/namespace': 'error',
       'import/default': 'error',
       'import/export': 'error',
       'import/no-unresolved': 'error', // Ensure unresolved imports are flagged
       'import/order': [
         'error',
         {
           groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
           'newlines-between': 'always',
         },
       ],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { "allowSameFolder": true, "rootDir": "src", "prefix": "@" }
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  prettier
])
