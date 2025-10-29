import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// @ts-expect-error

// Load environment variables from .env file for tests
config();

export default defineConfig({
  plugins: [],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '**/*.feature'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.integration.test.*'],
    hookTimeout: 30000,
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
