import typescriptEslint from '@typescript-eslint/eslint-plugin';
import stylisticJs from '@stylistic/eslint-plugin-js';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  {
    files: ['src/**/*.ts', '__tests__/**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@stylistic/js': stylisticJs,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
    },

    rules: {
      semi: ['error', 'always'],
      quotes: ['warn', 'single'],
      indent: ['warn', 2, { switchCase: 1 }],
      eqeqeq: 'warn',
      curly: ['error', 'all'],
      'prefer-const': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'prettier/prettier': 'warn',
    },
  },
];
