import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...astroPlugin.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.astro/**'],
  },
);
