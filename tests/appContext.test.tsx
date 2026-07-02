import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider, useApp } from '../contexts/AppContext';
import { VerseReference } from '../types';

vi.mock('../utils/soundEngine', () => ({
    SoundEngine: {
        playClick: vi.fn(), playHover: vi.fn(), playSuccess: vi.fn(),
        playError: vi.fn(), playPing: vi.fn(), setMute: vi.fn(), startAmbient: vi.fn()
    }
}));

const STORAGE_KEY = 'bible_crentech_data';

const seedData = {
    history: [{ book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo...' }],
    theme: 'hitech',
    version: 'ACF',
    lastReading: { book: 'João', chapter: 12 },
    favorites: [{ book: 'Salmos', chapter: 23, verse: 1, text: 'O Senhor é o meu pastor...' }]
};

const Probe: React.FC = () => {
    const { history, favorites, lastReading } = useApp();
    return (
        <div data-testid="probe">
            {history.length}|{favorites.length}|{lastReading ? `${lastReading.book} ${lastReading.chapter}` : 'sem'}
        </div>
    );
};

describe('AppContext — persistência', () => {
    it('carrega os dados salvos e NÃO os apaga ao montar (regressão do bug do reload)', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));

        // StrictMode reproduz o duplo mount que disparava o bug original
        render(
            <React.StrictMode>
                <AppProvider>
                    <Probe />
                </AppProvider>
            </React.StrictMode>
        );

        expect(screen.getByTestId('probe')).toHaveTextContent('1|1|João 12');

        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored.history).toHaveLength(1); // antes da correção virava []
        expect(stored.favorites).toHaveLength(1);
        expect(stored.lastReading).toEqual({ book: 'João', chapter: 12 });
    });

    it('sobrevive a dados corrompidos no localStorage (usa padrões)', () => {
        localStorage.setItem(STORAGE_KEY, '{isso não é json válido');
        render(
            <AppProvider>
                <Probe />
            </AppProvider>
        );
        expect(screen.getByTestId('probe')).toHaveTextContent('0|0|sem');
    });
});

const FavoriteProbe: React.FC<{ verse: VerseReference }> = ({ verse }) => {
    const { favorites, toggleFavorite } = useApp();
    return (
        <>
            <span data-testid="fav-count">{favorites.length}</span>
            <button onClick={() => toggleFavorite(verse)}>alternar</button>
        </>
    );
};

describe('AppContext — favoritos', () => {
    it('toggleFavorite adiciona e depois remove o mesmo versículo', async () => {
        const user = userEvent.setup();
        const verse = { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo...' };
        render(
            <AppProvider>
                <FavoriteProbe verse={verse} />
            </AppProvider>
        );

        expect(screen.getByTestId('fav-count')).toHaveTextContent('0');
        await user.click(screen.getByText('alternar'));
        expect(screen.getByTestId('fav-count')).toHaveTextContent('1');
        await user.click(screen.getByText('alternar'));
        expect(screen.getByTestId('fav-count')).toHaveTextContent('0');
    });
});

const HistoryProbe: React.FC = () => {
    const { history, addToHistory } = useApp();
    return (
        <>
            <span data-testid="hist-count">{history.length}</span>
            <button
                onClick={() => addToHistory({ book: 'Gênesis', chapter: 1, verse: history.length + 1, text: 'x' })}
            >
                adicionar
            </button>
        </>
    );
};

describe('AppContext — histórico', () => {
    it('persiste no máximo 50 itens no localStorage', async () => {
        render(
            <AppProvider>
                <HistoryProbe />
            </AppProvider>
        );

        const button = screen.getByText('adicionar');
        await act(async () => {
            for (let i = 0; i < 55; i++) button.click();
        });

        expect(screen.getByTestId('hist-count')).toHaveTextContent('55');
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored.history).toHaveLength(50);
    });
});
