import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import promisePlugin from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';

import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
      ignores: [
        'dist',
        'node_modules',
        'coverage',
        'src/generated',
        'prisma.config.ts',
      ],
    },

    js.configs.recommended,

    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project: true,
          tsconfigRootDir: import.meta.dirname,
        },
        globals: {
          ...globals.node,
        },
      },

      plugins: {
        '@typescript-eslint': tseslint.plugin,
        import: importPlugin,
        'unused-imports': unusedImports,
        'simple-import-sort': simpleImportSort,
        promise: promisePlugin,
        sonarjs,
        unicorn,
      },

      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
                '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-unnecessary-type-constraint': 'error',
        '@typescript-eslint/unbound-method': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',

        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],

        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',

        'promise/catch-or-return': 'error',
        'promise/no-return-wrap': 'error',

        'sonarjs/cognitive-complexity': ['error', 15],
        'sonarjs/no-duplicate-string': 'warn',

        'unicorn/prefer-node-protocol': 'error',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/no-array-for-each': 'error',
        'unicorn/prevent-abbreviations': 'off',

        eqeqeq: ['error', 'always'],
        curly: ['error', 'all'],
        'no-console': [
          'warn',
          {
            allow: ['warn', 'error'],
          },
        ],
      },
    },

    eslintConfigPrettier,
);
