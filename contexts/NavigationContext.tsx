import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { AppView } from '../types';
import { SoundEngine } from '../utils/soundEngine';
import { useApp } from './AppContext';
import { BIBLE_BOOKS } from '../utils/bibleData';

interface NavigationContextType {
    currentView: AppView;
    navigate: (view: AppView) => void;
    finishSplash: () => void;
}

// A URL espelha a navegação (#/home, #/leitor/João/3/16...): permite
// compartilhar links e faz o botão voltar do navegador/Android funcionar.
const HASH_BY_VIEW: Partial<Record<AppView, string>> = {
    home: '#/home',
    search: '#/busca',
    reader: '#/leitor',
    history: '#/historico',
    quiz: '#/quiz'
};

interface ParsedHash {
    view: AppView;
    reader?: { book: string; chapter: number; verse?: number };
}

// "#/leitor/João/3/16" -> leitor em João 3, com destaque no versículo 16
const parseHash = (hash: string): ParsedHash | null => {
    const segments = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    if (segments.length === 0) return null;

    switch (segments[0]) {
        case 'home': return { view: 'home' };
        case 'busca': return { view: 'search' };
        case 'historico': return { view: 'history' };
        case 'quiz': return { view: 'quiz' };
        case 'leitor': {
            const book = BIBLE_BOOKS.find(b => b.name.toLowerCase() === (segments[1] ?? '').toLowerCase());
            if (!book) return { view: 'reader' };
            const chapter = Math.min(Math.max(parseInt(segments[2], 10) || 1, 1), book.chapters);
            const verse = parseInt(segments[3], 10);
            return {
                view: 'reader',
                reader: { book: book.name, chapter, ...(verse > 0 ? { verse } : {}) }
            };
        }
        default: return null;
    }
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<AppView>('splash');
    const { setReaderState } = useApp();

    const viewRef = useRef(currentView);
    viewRef.current = currentView;

    const navigate = useCallback((view: AppView) => {
        SoundEngine.playClick();
        setCurrentView(view);
        const target = HASH_BY_VIEW[view];
        // Registra no histórico do navegador. O leitor mantém livro/capítulo
        // no hash (#/leitor/...), então não sobrescrever se já estamos nele.
        if (target && !window.location.hash.startsWith(target)) {
            window.location.hash = target;
        }
    }, []);

    // Ao sair do splash: respeita um deep link, senão vai para a home
    const finishSplash = useCallback(() => {
        const parsed = parseHash(window.location.hash);
        if (parsed) {
            if (parsed.reader) setReaderState(parsed.reader);
            setCurrentView(parsed.view);
        } else {
            setCurrentView('home');
            window.history.replaceState(null, '', '#/home');
        }
    }, [setReaderState]);

    // Botão voltar/avançar do navegador (e do Android quando instalado)
    useEffect(() => {
        const onHashChange = () => {
            if (viewRef.current === 'splash') return;
            const parsed = parseHash(window.location.hash);
            if (!parsed) return;
            if (parsed.reader) setReaderState(parsed.reader);
            setCurrentView(parsed.view);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [setReaderState]);

    return (
        <NavigationContext.Provider value={{ currentView, navigate, finishSplash }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
