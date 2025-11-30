import { VerseReference } from '../types';
import { StorageService } from './StorageService';

const HISTORY_KEY = 'bible_crentech_history';
const MAX_HISTORY_SIZE = 50;

export const HistoryService = {
    getHistory: (): VerseReference[] => {
        return StorageService.load<VerseReference[]>(HISTORY_KEY, []);
    },

    addToHistory: (history: VerseReference[], verse: VerseReference): VerseReference[] => {
        const newHistory = [...history, verse];
        if (newHistory.length > MAX_HISTORY_SIZE) {
            return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
        }
        return newHistory;
    },

    saveHistory: (history: VerseReference[]): void => {
        StorageService.save(HISTORY_KEY, history);
    }
};
