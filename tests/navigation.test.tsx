import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useApp } from '../contexts/AppContext';
import { NavigationProvider, useNavigation } from '../contexts/NavigationContext';

vi.mock('../utils/soundEngine', () => ({
    SoundEngine: {
        playClick: vi.fn(), playHover: vi.fn(), playSuccess: vi.fn(),
        playError: vi.fn(), playPing: vi.fn(), setMute: vi.fn(), startAmbient: vi.fn()
    }
}));

const Probe: React.FC = () => {
    const { currentView, navigate, finishSplash } = useNavigation();
    const { readerState } = useApp();
    return (
        <div>
            <span data-testid="view">{currentView}</span>
            <span data-testid="reader-state">
                {readerState ? `${readerState.book} ${readerState.chapter}:${readerState.verse ?? '-'}` : 'vazio'}
            </span>
            <button onClick={finishSplash}>sair-do-splash</button>
            <button onClick={() => navigate('history')}>ir-historico</button>
        </div>
    );
};

const renderNav = () =>
    render(
        <AppProvider>
            <NavigationProvider>
                <Probe />
            </NavigationProvider>
        </AppProvider>
    );

describe('NavigationContext — rotas de URL', () => {
    it('sem hash, sair do splash leva à home e grava #/home', async () => {
        window.location.hash = '';
        renderNav();
        expect(screen.getByTestId('view')).toHaveTextContent('splash');
        await act(async () => screen.getByText('sair-do-splash').click());
        expect(screen.getByTestId('view')).toHaveTextContent('home');
        expect(window.location.hash).toBe('#/home');
    });

    it('deep link #/quiz abre direto o quiz após o splash', async () => {
        window.location.hash = '#/quiz';
        renderNav();
        await act(async () => screen.getByText('sair-do-splash').click());
        expect(screen.getByTestId('view')).toHaveTextContent('quiz');
    });

    it('deep link do leitor com versículo popula o readerState', async () => {
        window.location.hash = '#/leitor/João/3/16';
        renderNav();
        await act(async () => screen.getByText('sair-do-splash').click());
        expect(screen.getByTestId('view')).toHaveTextContent('reader');
        expect(screen.getByTestId('reader-state')).toHaveTextContent('João 3:16');
    });

    it('deep link com capítulo acima do limite é ajustado para o máximo do livro', async () => {
        window.location.hash = '#/leitor/Judas/99';
        renderNav();
        await act(async () => screen.getByText('sair-do-splash').click());
        expect(screen.getByTestId('reader-state')).toHaveTextContent('Judas 1');
    });

    it('navigate() atualiza a view e espelha o hash', async () => {
        window.location.hash = '';
        renderNav();
        await act(async () => screen.getByText('sair-do-splash').click());
        await act(async () => screen.getByText('ir-historico').click());
        expect(screen.getByTestId('view')).toHaveTextContent('history');
        expect(window.location.hash).toBe('#/historico');
    });

    it('botão voltar (hashchange) troca a view', async () => {
        window.location.hash = '';
        renderNav();
        await act(async () => screen.getByText('sair-do-splash').click());
        await act(async () => screen.getByText('ir-historico').click());

        // Simula o voltar do navegador: o hash muda e o evento dispara
        await act(async () => {
            window.location.hash = '#/home';
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
        expect(screen.getByTestId('view')).toHaveTextContent('home');
    });
});
