import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@wild-bonds': resolve(__dirname, 'src'),
      '@wild-bonds/core': resolve(__dirname, 'src/core'),
      '@wild-bonds/scenes': resolve(__dirname, 'src/scenes'),
      '@wild-bonds/systems': resolve(__dirname, 'src/systems'),
      '@wild-bonds/entities': resolve(__dirname, 'src/entities'),
      '@wild-bonds/types': resolve(__dirname, 'src/types'),
      '@wild-bonds/utils': resolve(__dirname, 'src/utils')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});