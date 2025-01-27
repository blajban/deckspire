import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
export default [
  ...tseslint.configs.recommendedTypeChecked,
  {
  files: ['src/**/*.ts', '__tests__/**/*.ts'],

  plugins: {
    tsplugin: tseslint.plugin,
    prettier,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
    },
    parser: tseslint.parser,
    parserOptions: {
      project: ['tsconfig.json'],
    }
  },

  rules: {
    semi: ['error', 'always'],
    quotes: ['warn', 'single'],
    indent: ['warn', 2, { SwitchCase: 1 }],
    eqeqeq: 'warn',
    curly: ['error', 'all'],
    'prefer-const': 'warn',
    'no-unused-vars': 'off',
    'tsplugin/no-unused-vars': ['warn'],
    'tsplugin/explicit-function-return-type': 'error',
    'tsplugin/no-explicit-any': 'error',
    'tsplugin/naming-convention': [
      'error',
      {
        selector: ['default'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'import',
        format: [],
      },
      {
        selector: ['typeLike'],
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: ['class', 'interface'],
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['classMethod', 'function'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: ['classMethod'],
        modifiers: ['private'],
        format: ['camelCase'],
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
    'prettier/prettier': 'warn',
  },
}];
