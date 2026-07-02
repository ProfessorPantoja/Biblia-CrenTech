import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom não implementa APIs de layout/áudio usadas pelo app
window.scrollTo = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();

afterEach(() => {
    cleanup();
    localStorage.clear();
    window.location.hash = '';
});
