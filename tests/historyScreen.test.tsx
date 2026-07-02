import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../contexts/AppContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import HistoryScreen from '../components/HistoryScreen';

vi.mock('../utils/soundEngine', () => ({
    SoundEngine: {
        playClick: vi.fn(), playHover: vi.fn(), playSuccess: vi.fn(),
        playError: vi.fn(), playPing: vi.fn(), setMute: vi.fn(), startAmbient: vi.fn()
    }
}));

const seed = (history: object[]) => {
    localStorage.setItem('bible_crentech_data', JSON.stringify({
        history, theme: 'hitech', version: 'ACF', lastReading: null, favorites: []
    }));
};

const renderHistory = () =>
    render(
        <AppProvider>
            <NavigationProvider>
                <HistoryScreen />
            </NavigationProvider>
        </AppProvider>
    );

describe('HistoryScreen', () => {
    it('vazio: mostra o convite para buscar', () => {
        renderHistory();
        expect(screen.getByText('Nenhuma busca ainda')).toBeInTheDocument();
        expect(screen.getByText('Fazer uma busca')).toBeInTheDocument();
    });

    it('lista os versículos salvos, mais recentes primeiro', () => {
        seed([
            { book: 'Gênesis', chapter: 1, verse: 1, text: 'No princípio...' },
            { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo...' }
        ]);
        renderHistory();
        expect(screen.getByText('2 versículos')).toBeInTheDocument();
        const refs = screen.getAllByText(/^(João|Gênesis)/).map(el => el.textContent);
        expect(refs[0]).toContain('João 3:16'); // mais recente no topo
        expect(refs[1]).toContain('Gênesis 1:1');
    });

    it('remove um item individual', async () => {
        const user = userEvent.setup();
        seed([
            { book: 'Gênesis', chapter: 1, verse: 1, text: 'No princípio...' },
            { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo...' }
        ]);
        renderHistory();

        await user.click(screen.getAllByTitle('Remover do histórico')[0]);
        expect(screen.getByText('1 versículo')).toBeInTheDocument();
        expect(screen.queryByText('João 3:16')).not.toBeInTheDocument();
        expect(screen.getByText('Gênesis 1:1')).toBeInTheDocument();
    });

    it('limpar tudo pede confirmação e esvazia a lista', async () => {
        const user = userEvent.setup();
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
        seed([{ book: 'Gênesis', chapter: 1, verse: 1, text: 'No princípio...' }]);
        renderHistory();

        await user.click(screen.getByTitle('Limpar histórico'));
        expect(confirmSpy).toHaveBeenCalledOnce();
        expect(screen.getByText('Nenhuma busca ainda')).toBeInTheDocument();
    });

    it('se o usuário cancelar a confirmação, nada é apagado', async () => {
        const user = userEvent.setup();
        vi.spyOn(window, 'confirm').mockReturnValue(false);
        seed([{ book: 'Gênesis', chapter: 1, verse: 1, text: 'No princípio...' }]);
        renderHistory();

        await user.click(screen.getByTitle('Limpar histórico'));
        expect(screen.getByText('Gênesis 1:1')).toBeInTheDocument();
    });
});
