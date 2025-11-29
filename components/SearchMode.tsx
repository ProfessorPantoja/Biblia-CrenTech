import React, { useState, useEffect, useRef } from 'react';
import { AppStatus, VerseReference, BibleVersion, AppTheme } from '../types';
import { searchVerseByAudio, searchVerseByTheme } from '../services/geminiService';
import RecorderButton from './RecorderButton';
import VerseDisplay from './VerseDisplay';
import Features from './Features';
import { searchBibleBooks, BibleBook } from '../utils/bibleData';
import { SoundEngine } from '../utils/soundEngine';
import { Search } from 'lucide-react';
import { useBible } from '../hooks/useBible';

// Configuration & Components
import { THEMES, COMMON_THEMES } from '../config/constants';
import Header from './layout/Header';
import HistorySlider from './layout/HistorySlider';
import Footer from './layout/Footer';
import DonationTicker from './layout/DonationTicker';
import AboutModal from './modals/AboutModal';
import DonateModal from './modals/DonateModal';
import ThemeModal from './modals/ThemeModal';

interface SearchModeProps {
    bibleVersion: BibleVersion;
    setBibleVersion: (version: BibleVersion) => void;
    appTheme: AppTheme;
    setAppTheme: (theme: AppTheme) => void;
    currentTheme: any;
    history: VerseReference[];
    setHistory: React.Dispatch<React.SetStateAction<VerseReference[]>>;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    isMuted: boolean;
    toggleMute: () => void;
}

const SearchMode: React.FC<SearchModeProps> = ({
    bibleVersion,
    setBibleVersion,
    appTheme,
    setAppTheme,
    currentTheme,
    history,
    setHistory,
    currentIndex,
    setCurrentIndex,
    isMuted,
    toggleMute
}) => {
    // --- STATE ---
    const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);

    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isDonateOpen, setIsDonateOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [showTicker, setShowTicker] = useState(false);

    // Search & Autocomplete
    const [textSearch, setTextSearch] = useState('');
    const [showTextSearchInput, setShowTextSearchInput] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);
    const [suggestions, setSuggestions] = useState<BibleBook[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { getVerses: getLocalVerses } = useBible();

    const currentVerse = currentIndex >= 0 ? history[currentIndex] : null;

    // Donation Ticker Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setShowTicker(true);
            setTimeout(() => setShowTicker(false), 8000);
        }, 45000);

        return () => clearInterval(timer);
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                if (e.key === 'Escape') {
                    (e.target as HTMLElement).blur(); // Remove focus on Esc
                    setShowTextSearchInput(false);
                }
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'p':
                    e.preventDefault();
                    setShowTextSearchInput(true);
                    // Small timeout to ensure render before focus
                    setTimeout(() => searchInputRef.current?.focus(), 50);
                    break;
                case 's':
                    e.preventDefault();
                    setIsAboutOpen(true);
                    break;
                case 'd':
                    e.preventDefault();
                    setIsDonateOpen(true);
                    break;
                case 't':
                    e.preventDefault();
                    setIsThemeOpen(true);
                    break;
                case 'escape':
                    setShowTextSearchInput(false);
                    setIsAboutOpen(false);
                    setIsDonateOpen(false);
                    setIsThemeOpen(false);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (showTextSearchInput && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showTextSearchInput]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTextSearch(val);
        SoundEngine.playHover(); // Subtle sound on type

        if (val.length > 1) {
            const results = searchBibleBooks(val);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (bookName: string) => {
        setTextSearch(bookName + " ");
        setSuggestions([]);
        SoundEngine.playClick();
        if (searchInputRef.current) searchInputRef.current.focus();
    };

    const toggleSearch = () => {
        SoundEngine.playClick();
        setShowTextSearchInput(prev => !prev);
    };

    const handleThemeChange = (newTheme: AppTheme) => {
        SoundEngine.playClick();
        setAppTheme(newTheme);
        setIsThemeOpen(false);
    };

    const handleRecordingComplete = async (base64Audio: string) => {
        SoundEngine.playPing();
        setStatus(AppStatus.PROCESSING);
        try {
            const verses = await searchVerseByAudio(base64Audio, bibleVersion);
            updateHistory(verses);
            setStatus(AppStatus.SUCCESS);
            SoundEngine.playSuccess();
        } catch (error) {
            console.error(error);
            setStatus(AppStatus.ERROR);
            SoundEngine.playError();
            setTimeout(() => setStatus(AppStatus.IDLE), 3000);
        }
    };


    const handleTextSearch = async (e: React.FormEvent | null) => {
        if (e) e.preventDefault();
        if (!textSearch.trim()) return;
        setSuggestions([]);
        setShowTextSearchInput(false);
        SoundEngine.playClick();

        setStatus(AppStatus.PROCESSING);

        try {
            // 1. Try Local Bible Search first
            const localResult = await getLocalVerses(textSearch);

            if (localResult && localResult.length > 0) {
                // Map to VerseReference format
                const verses: VerseReference[] = localResult.map(v => {
                    // Parse "Book Chapter:Verse" from reference string
                    // reference format from hook: "Gênesis 1:1"
                    const parts = v.reference.split(' ');
                    const lastPart = parts.pop()!; // "1:1"
                    const [chapter, verse] = lastPart.split(':').map(Number);
                    const book = parts.join(' ');

                    return {
                        book,
                        chapter,
                        verse,
                        text: v.text,
                        version: bibleVersion // Using current version context, though data is ACF
                    };
                });

                updateHistory(verses);
                setStatus(AppStatus.SUCCESS);
                SoundEngine.playSuccess();
                setTextSearch('');
                return;
            }

            // 2. Fallback to AI Theme Search
            const verses = await searchVerseByTheme(textSearch, bibleVersion);
            updateHistory(verses);
            setStatus(AppStatus.SUCCESS);
            SoundEngine.playSuccess();
            setTextSearch('');
        } catch (error) {
            console.error(error);
            setStatus(AppStatus.ERROR);
            SoundEngine.playError();
            setTimeout(() => setStatus(AppStatus.IDLE), 3000);
        }
    };

    const handleThemeSearch = async (theme: string) => {
        SoundEngine.playClick();
        setStatus(AppStatus.PROCESSING);
        try {
            const verses = await searchVerseByTheme(theme, bibleVersion);
            updateHistory(verses);
            setStatus(AppStatus.SUCCESS);
            SoundEngine.playSuccess();
        } catch (error) {
            console.error(error);
            setStatus(AppStatus.ERROR);
            SoundEngine.playError();
            setTimeout(() => setStatus(AppStatus.IDLE), 3000);
        }
    };

    const updateHistory = (verses: VerseReference[]) => {
        setHistory(prev => {
            const newHistory = [...prev, ...verses];
            setCurrentIndex(newHistory.length - verses.length);
            return newHistory;
        });
    };

    const navigateHistory = (direction: 'prev' | 'next') => {
        SoundEngine.playClick();
        if (direction === 'prev' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (direction === 'next' && currentIndex < history.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleCopyAll = () => {
        SoundEngine.playClick();
        if (history.length === 0) return;
        const allText = history.map(v => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`).join('\n\n');
        const header = `*Histórico de Pesquisa - Bíblia CrenTech (${bibleVersion})*\n\n`;
        navigator.clipboard.writeText(header + allText);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const handleFeedback = () => {
        window.location.href = "mailto:artpantoja@gmail.com?subject=Sugestão Bíblia CrenTech";
        SoundEngine.playClick();
    };

    return (
        <div className={`min-h-screen flex flex-col transition-all duration-700 ease-in-out ${currentTheme.bgClass}`}>

            <DonateModal
                isOpen={isDonateOpen}
                onClose={() => setIsDonateOpen(false)}
                currentTheme={currentTheme}
            />

            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
                currentTheme={currentTheme}
                handleFeedback={handleFeedback}
            />

            <ThemeModal
                isOpen={isThemeOpen}
                onClose={() => setIsThemeOpen(false)}
                currentTheme={currentTheme}
                appTheme={appTheme}
                handleThemeChange={handleThemeChange}
            />

            <Header
                currentTheme={currentTheme}
                bibleVersion={bibleVersion}
                setBibleVersion={setBibleVersion}
                toggleSearch={toggleSearch}
                setIsDonateOpen={setIsDonateOpen}
                setIsThemeOpen={setIsThemeOpen}
                setIsAboutOpen={setIsAboutOpen}
            />

            <HistorySlider
                history={history}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                navigateHistory={navigateHistory}
                handleCopyAll={handleCopyAll}
                copiedAll={copiedAll}
                currentTheme={currentTheme}
            />

            {/* SEARCH OVERLAY */}
            {showTextSearchInput && (
                <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" onClick={() => setShowTextSearchInput(false)}></div>
            )}

            {/* SEARCH INPUT */}
            <div className={`w-full px-4 overflow-visible transition-all duration-300 ease-in-out absolute top-[70px] left-0 right-0 z-50 ${showTextSearchInput ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className="max-w-xl mx-auto relative shadow-2xl">
                    <input
                        id="search-input"
                        ref={searchInputRef}
                        type="text"
                        value={textSearch}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleTextSearch(null)}
                        autoComplete="off"
                        placeholder="Busca rápida... (ex: 'Ap 1')"
                        className={`w-full pl-5 pr-12 py-4 rounded-xl border shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all ${currentTheme.cardClass} ${currentTheme.textClass}`}
                    />
                    {suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                            {suggestions.map((s) => (
                                <button
                                    key={s.name}
                                    onClick={() => handleSuggestionClick(s.name)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-800 text-slate-200 border-b border-slate-800/50 flex justify-between items-center group"
                                >
                                    <span className="font-bold">{s.name}</span>
                                    <span className="text-xs text-slate-500 uppercase group-hover:text-bible-gold transition-colors">{s.chapters} Caps.</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => handleTextSearch(null)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-bible-accent text-white"
                    >
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col items-center p-6 relative w-full max-w-4xl mx-auto mb-32 pt-8">
                {status === AppStatus.IDLE && history.length === 0 && (
                    <div className="w-full text-center mt-4 animate-in fade-in zoom-in duration-700 flex flex-col items-center max-w-lg mx-auto">
                        <h2 className={`text-2xl font-serif font-bold ${currentTheme.textClass} mb-6 tracking-widest uppercase`}>Temas Frequentes</h2>

                        {/* MAIN CATEGORIES */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            <button onClick={() => handleThemeSearch("Amor")} className={`${currentTheme.cardClass} px-6 py-2 rounded-full border ${currentTheme.textClass} hover:scale-105 transition-transform`}>❤️ Amor</button>
                            <button onClick={() => handleThemeSearch("Fé")} className={`${currentTheme.cardClass} px-6 py-2 rounded-full border ${currentTheme.textClass} hover:scale-105 transition-transform`}>🙏 Fé</button>
                            <button onClick={() => handleThemeSearch("Paz")} className={`${currentTheme.cardClass} px-6 py-2 rounded-full border ${currentTheme.textClass} hover:scale-105 transition-transform`}>🕊️ Paz</button>
                        </div>

                        {/* CLOUD TAGS */}
                        <div className="w-full flex flex-wrap justify-center gap-2.5 px-2">
                            {COMMON_THEMES.slice(0, 30).map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => handleThemeSearch(theme)}
                                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-md ${currentTheme.textClass} border-current/20 hover:bg-current/10`}
                                >
                                    {theme}
                                </button>
                            ))}
                            <button onClick={() => setIsThemeOpen(true)} className="text-xs italic opacity-60 px-3 py-1.5">+ mais temas</button>
                        </div>
                    </div>
                )}

                <VerseDisplay
                    data={currentVerse}
                    textColorClass={currentTheme.textClass}
                    accentColorClass={currentTheme.accentClass}
                />

                {currentVerse && status === AppStatus.SUCCESS && (
                    <Features key={currentVerse.text} reference={currentVerse} version={bibleVersion} />
                )}

                {/* RECORDER BUTTON with THEME PROP */}
                <div className="fixed bottom-10 left-0 right-0 flex flex-col items-center justify-end z-40 pointer-events-none gap-4">
                    <div className="pointer-events-auto filter drop-shadow-2xl">
                        <RecorderButton
                            onRecordingComplete={handleRecordingComplete}
                            isProcessing={status === AppStatus.PROCESSING}
                            theme={appTheme}
                        />
                    </div>
                </div>
            </main>

            <DonationTicker
                showTicker={showTicker}
                setShowTicker={setShowTicker}
                setIsDonateOpen={setIsDonateOpen}
                currentTheme={currentTheme}
            />

            <Footer
                currentTheme={currentTheme}
                handleFeedback={handleFeedback}
                setIsDonateOpen={setIsDonateOpen}
                toggleMute={toggleMute}
                isMuted={isMuted}
            />

        </div>
    );
};

export default SearchMode;
