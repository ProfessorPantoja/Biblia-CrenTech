import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VerseReference, BibleVersion, AppTheme } from '../types';
import { SoundEngine } from '../utils/soundEngine';
import { StorageService } from '../services/StorageService';

interface AppContextType {
    bibleVersion: BibleVersion;
    setBibleVersion: React.Dispatch<React.SetStateAction<BibleVersion>>;
    appTheme: AppTheme;
    setAppTheme: React.Dispatch<React.SetStateAction<AppTheme>>;
    history: VerseReference[];
    setHistory: React.Dispatch<React.SetStateAction<VerseReference[]>>;
    addToHistory: (verse: VerseReference) => void;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    isMuted: boolean;
    toggleMute: () => void;
    // Reader Navigation State
    readerState: { book: string; chapter: number } | null;
    setReaderState: React.Dispatch<React.SetStateAction<{ book: string; chapter: number } | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bibleVersion, setBibleVersion] = useState<BibleVersion>('ACF');
    const [appTheme, setAppTheme] = useState<AppTheme>('hitech');
    const [history, setHistory] = useState<VerseReference[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [isMuted, setIsMuted] = useState(true);
    const [readerState, setReaderState] = useState<{ book: string; chapter: number } | null>(null);

    // Load Data
    useEffect(() => {
        const savedData = StorageService.load('bible_crentech_data', {
            history: [] as VerseReference[],
            theme: 'hitech' as AppTheme,
            version: 'ACF' as BibleVersion
        });

        if (savedData.history && Array.isArray(savedData.history)) {
            setHistory(savedData.history);
            setCurrentIndex(savedData.history.length > 0 ? savedData.history.length - 1 : -1);
        }
        if (savedData.theme) setAppTheme(savedData.theme);
        if (savedData.version) setBibleVersion(savedData.version);
    }, []);

    // Save Data
    useEffect(() => {
        const dataToSave = {
            history: history.slice(-50),
            theme: appTheme,
            version: bibleVersion
        };
        StorageService.save('bible_crentech_data', dataToSave);
    }, [history, appTheme, bibleVersion]);

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        SoundEngine.setMute(newMutedState);
        if (!newMutedState) {
            SoundEngine.playClick();
            SoundEngine.startAmbient();
        }
    };

    const addToHistory = (verse: VerseReference) => {
        setHistory(prev => [...prev, verse]);
    };

    return (
        <AppContext.Provider value={{
            bibleVersion,
            setBibleVersion,
            appTheme,
            setAppTheme,
            history,
            setHistory,
            addToHistory,
            currentIndex,
            setCurrentIndex,
            isMuted,
            toggleMute,
            readerState,
            setReaderState
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
