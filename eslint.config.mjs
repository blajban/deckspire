import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import PrettierConfig from './prettier.config.mjs';

export default [
  {
    files: ['src/**/*.ts', '__tests__/**/*.ts'],

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
      prettier: prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: ['tsconfig.json'],
      },
    },

    rules: {
      //semi: ['error', 'always'],
      //quotes: ['warn', 'single'],
      //indent: ['warn', 2, { SwitchCase: 1 }],
      eqeqeq: 'warn',
      curly: ['error', 'all'],
      'prefer-const': 'warn',
      'no-useless-assignment': ['warn'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': ['off'],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['default'],
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'import',
          format: [],
        },
        {
          selector: ['typeLike', 'class', 'interface', 'enumMember'],
          format: ['StrictPascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: ['classMethod', 'function'],
          format: ['strictCamelCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: ['classMethod'],
          modifiers: ['private'],
          format: ['strictCamelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: [
            'variable',
            'classProperty',
            'accessor',
            'parameter',
            'parameterProperty',
          ],
          format: ['snake_case'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: [
            'variable',
            'classProperty',
            'accessor',
            'parameter',
            'parameterProperty',
          ],
          modifiers: ['readonly'],
          format: ['UPPER_CASE'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: ['variable', 'parameter'],
          modifiers: ['unused'],
          format: ['snake_case'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['variable', 'classProperty', 'parameterProperty'],
          modifiers: ['private'],
          format: ['snake_case'],
          leadingUnderscore: 'require',
        },
        {
          selector: [
            'variable',
            'classProperty',
            'accessor',
            'parameter',
            'parameterProperty',
          ],
          types: ['boolean'],
          format: ['snake_case'],
          leadingUnderscore: 'forbid',
          prefix: ['is_', 'should_', 'has_', 'can_', 'did_', 'will_'],
        },
        {
          selector: ['variable', 'classProperty', 'parameterProperty'],
          modifiers: ['private'],
          types: ['boolean'],
          format: ['snake_case'],
          leadingUnderscore: 'require',
          prefix: ['is_', 'should_', 'has_', 'can_', 'did_', 'will_'],
        },
      ],
      'prettier/prettier': ['warn', PrettierConfig],
    },
  },
];
