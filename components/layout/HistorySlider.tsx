import React from 'react';
import { ChevronLeft, ChevronRight, Check, Copy } from 'lucide-react';
import { VerseReference } from '../../types';
import { ThemeConfig } from '../../config/constants';

interface HistorySliderProps {
    history: VerseReference[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    navigateHistory: (direction: 'prev' | 'next') => void;
    handleCopyAll: () => void;
    copiedAll: boolean;
    currentTheme: ThemeConfig;
}

const HistorySlider: React.FC<HistorySliderProps> = ({
    history,
    currentIndex,
    setCurrentIndex,
    navigateHistory,
    handleCopyAll,
    copiedAll,
    currentTheme
}) => {
    if (history.length === 0) return null;

    return (
        <div className={`w-full py-3 px-4 z-20 flex items-center justify-center gap-4 backdrop-blur-md border-b animate-in slide-in-from-top ${currentTheme.headerClass}`}>
            <button onClick={() => navigateHistory('prev')} disabled={currentIndex <= 0} className={currentTheme.textClass}><ChevronLeft /></button>
            <input type="range" min="0" max={history.length - 1} value={currentIndex} onChange={(e) => setCurrentIndex(Number(e.target.value))} className="w-full max-w-xs accent-current" />
            <button onClick={() => navigateHistory('next')} disabled={currentIndex >= history.length - 1} className={currentTheme.textClass}><ChevronRight /></button>
            <button onClick={handleCopyAll} className={currentTheme.textClass}>{copiedAll ? <Check /> : <Copy />}</button>
        </div>
    );
};

export default HistorySlider;
