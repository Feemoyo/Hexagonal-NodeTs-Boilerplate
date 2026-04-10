import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infra': path.resolve(__dirname, './src/infra'),
      '@api': path.resolve(__dirname, './src/api'),
      '@main': path.resolve(__dirname, './src/main'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
});
