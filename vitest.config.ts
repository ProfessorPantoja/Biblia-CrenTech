import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Config separada do vite.config.ts para não carregar o plugin de PWA
// (service worker) durante os testes.
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        include: ['tests/**/*.test.{ts,tsx}'],
        restoreMocks: true
    }
});
