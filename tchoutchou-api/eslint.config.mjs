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
      ],
    },

    js.configs.recommended,

    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    {
      files: ['**/*.ts'],
      languageOptions: {
        parserOptions: {
          project: true,
          tsconfigRootDir: import.meta.dirname,
        },
        globals: {
          ...globals.node,
        },
      },

      plugins: {
        import: importPlugin,
        'unused-imports': unusedImports,
        'simple-import-sort': simpleImportSort,
        promise: promisePlugin,
        sonarjs,
        unicorn,
      },

      rules: {
        /*
         * TYPESCRIPT STRICT
         */
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

        /*
         * IMPORTS
         */
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

        /*
         * PROMISES
         */
        'promise/catch-or-return': 'error',
        'promise/no-return-wrap': 'error',

        /*
         * CODE QUALITY
         */
        'sonarjs/cognitive-complexity': ['error', 15],
        'sonarjs/no-duplicate-string': 'warn',

        /*
         * UNICORN
         */
        'unicorn/prefer-node-protocol': 'error',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/no-array-for-each': 'error',
        'unicorn/prevent-abbreviations': 'off',

        /*
         * GENERAL
         */
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