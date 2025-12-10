const {defineConfig} = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-plugin-prettier');

module.exports = defineConfig([
  expoConfig,

  {
    ignores: ['dist/*'],
  },

  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/jest.setup.js',
      '**/jest.config.js',
    ],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },

  // ✅ Formatting + Windows-safe rules
  {
    plugins: {
      prettier,
    },
    rules: {
      quotes: ['error', 'single'],

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'auto', // ✅ Windows + Mac safe
        },
      ],
    },
  },
]);
