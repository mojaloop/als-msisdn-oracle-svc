import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';
import globals from "globals";


export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        globals: {
            ...globals.node,
            ...globals.jest,
            structuredClone: 'readonly',
        }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jest: jestPlugin,
    },
    rules: {
        indent: ["error", 2, {
            SwitchCase: 1,
        }],

        "linebreak-style": [2, "unix"],
        quotes: [2, "single"],
        "no-console": 2,
        "no-prototype-builtins": "off",
    },
    ignores: ["node_modules/**/*.js", "coverage/*", ".circleci/*", "*.d.ts", "commitlint.config.js", "eslint.config.mjs"],
  },
];
