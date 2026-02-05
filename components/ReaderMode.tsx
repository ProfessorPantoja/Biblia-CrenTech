import React, { useState, useEffect } from 'react';
import { AppTheme, BibleVersion } from '../types';
import { THEMES } from '../config/constants';
import { ChevronLeft, Type, Share2, Menu, Home, User, ChevronRight, ChevronDown, Moon } from 'lucide-react';
import { BIBLE_BOOKS, BibleBook } from '../utils/bibleData';
import { useBible } from '../hooks/useBible';
import { useApp } from '../contexts/AppContext';
import { useNavigation } from '../contexts/NavigationContext';

const ReaderMode: React.FC = () => {
    const { appTheme, bibleVersion, setLastReading } = useApp();
    const { navigate } = useNavigation();
    const currentTheme = THEMES[appTheme];
    const { getVerses } = useBible();

    // State
    const [currentBook, setCurrentBook] = useState<BibleBook>(BIBLE_BOOKS[0]); // Default Genesis
    const [currentChapter, setCurrentChapter] = useState(1);
    const [chapterContent, setChapterContent] = useState<{ reference: string; text: string }[]>([]);
    const [scrollVerse, setScrollVerse] = useState<number | null>(null);
    const [highlightVerse, setHighlightVerse] = useState<number | null>(null);
    const [isHighlightPinned, setIsHighlightPinned] = useState(false);
    const [lastTargetVerse, setLastTargetVerse] = useState<number | null>(null);
    const pendingVerseScrollRef = React.useRef(false);
    const scrollRetryRef = React.useRef(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showBookSelector, setShowBookSelector] = useState(false);
    const [showChapterSelector, setShowChapterSelector] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [showFontControl, setShowFontControl] = useState(false);
    const [isNightMode, setIsNightMode] = useState(false);

    // Fetch Chapter Content
    useEffect(() => {
        const fetchChapter = async () => {
            setIsLoading(true);
            try {
                const query = `${currentBook.name} ${currentChapter}`;
                const verses = await getVerses(query);
                if (verses) {
                    setChapterContent(verses);
                }
            } catch (error) {
                console.error("Failed to fetch chapter", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChapter();
        setLastReading({ book: currentBook.name, chapter: currentChapter });
        // Scroll to top on change (but not when jumping to a specific verse)
        if (!pendingVerseScrollRef.current) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentBook, currentChapter, getVerses, setLastReading]);

    // Check for navigation state from SearchMode
    const { readerState, setReaderState } = useApp();

    useEffect(() => {
        if (readerState) {
            const book = BIBLE_BOOKS.find(b => b.name === readerState.book);
            if (book) {
                setCurrentBook(book);
                setCurrentChapter(readerState.chapter);
                setScrollVerse(readerState.verse ?? null);
                pendingVerseScrollRef.current = Boolean(readerState.verse);
            }
            // Clear state after consuming
            setReaderState(null);
        }
    }, [readerState, setReaderState]);

    useEffect(() => {
        if (!scrollVerse || isLoading || chapterContent.length === 0) return;

        const tryScroll = () => {
            const verseElement = document.getElementById(`verse-${scrollVerse}`);
            if (!verseElement) return false;

            verseElement.scrollIntoView({ behavior: 'auto', block: 'start' });
            requestAnimationFrame(() => {
                window.scrollBy({ top: -96, behavior: 'auto' });
            });
            return true;
        };

        const didScroll = tryScroll();
        if (!didScroll && scrollRetryRef.current < 3) {
            scrollRetryRef.current += 1;
            const timer = window.setTimeout(() => {
                tryScroll();
            }, 80);
            return () => window.clearTimeout(timer);
        }

        scrollRetryRef.current = 0;
        setHighlightVerse(scrollVerse);
        setLastTargetVerse(scrollVerse);
        setScrollVerse(null);
        pendingVerseScrollRef.current = false;
    }, [scrollVerse, isLoading, chapterContent.length]);

    useEffect(() => {
        if (!highlightVerse || isHighlightPinned) return;
        const timer = window.setTimeout(() => {
            setHighlightVerse(null);
        }, 3500);
        return () => window.clearTimeout(timer);
    }, [highlightVerse, isHighlightPinned]);

    const handleHighlightAgain = () => {
        if (!lastTargetVerse) return;
        setHighlightVerse(lastTargetVerse);
        const verseElement = document.getElementById(`verse-${lastTargetVerse}`);
        if (verseElement) {
            verseElement.scrollIntoView({ behavior: 'auto', block: 'start' });
            requestAnimationFrame(() => {
                window.scrollBy({ top: -96, behavior: 'auto' });
            });
        }
    };

    // Handlers
    const handleBookSelect = (book: BibleBook) => {
        setCurrentBook(book);
        // Don't force chapter 1 - let user select the chapter
        setShowBookSelector(false);
        setShowChapterSelector(true); // Auto-open chapter selector
    };

    const handleChapterSelect = (chapter: number) => {
        setCurrentChapter(chapter);
        setShowChapterSelector(false);
    };

    const handleNextChapter = () => {
        if (currentChapter < currentBook.chapters) {
            setCurrentChapter(prev => prev + 1);
        } else {
            // Try next book
            const currentIndex = BIBLE_BOOKS.findIndex(b => b.name === currentBook.name);
            if (currentIndex < BIBLE_BOOKS.length - 1) {
                setCurrentBook(BIBLE_BOOKS[currentIndex + 1]);
                setCurrentChapter(1);
            }
        }
    };

    const handlePrevChapter = () => {
        if (currentChapter > 1) {
            setCurrentChapter(prev => prev - 1);
        } else {
            // Try prev book
            const currentIndex = BIBLE_BOOKS.findIndex(b => b.name === currentBook.name);
            if (currentIndex > 0) {
                const prevBook = BIBLE_BOOKS[currentIndex - 1];
                setCurrentBook(prevBook);
                setCurrentChapter(prevBook.chapters); // Go to last chapter
            }
        }
    };

    const handleShareChapter = () => {
        if (navigator.share) {
            const text = chapterContent.map(v => `${v.reference.split(':')[1]} ${v.text}`).join('\n');
            navigator.share({
                title: `${currentBook.name} ${currentChapter}`,
                text: `${currentBook.name} ${currentChapter} (${bibleVersion})\n\n${text}`,
            }).catch(console.error);
        }
    };

    const readerBgClass = isNightMode ? 'bg-black text-slate-100' : currentTheme.bgClass;
    const headerBgClass = isNightMode ? 'bg-black/90 border-slate-800' : currentTheme.bgClass;

    return (
        <div className={`min-h-screen w-full flex flex-col relative ${readerBgClass} transition-colors duration-500`}>

            {/* HEADER */}
            <header className={`sticky top-0 z-30 p-4 pt-6 backdrop-blur-xl bg-opacity-80 border-b border-white/5 flex justify-between items-center shadow-sm ${headerBgClass}`}>
                <button
                    onClick={() => navigate('home')}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={24} className={currentTheme.textClass} />
                </button>

                <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowBookSelector(!showBookSelector)}>
                    <div className="flex items-center gap-1">
                        <h1 className={`font-bold text-lg ${currentTheme.textClass}`}>{currentBook.name} {currentChapter}</h1>
                        <ChevronDown size={14} className="opacity-50" />
                    </div>
                    <span className="text-xs opacity-50 uppercase tracking-widest">{bibleVersion}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFontControl(!showFontControl)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Type size={24} className={currentTheme.textClass} />
                    </button>
                    <button
                        onClick={() => setIsNightMode(prev => !prev)}
                        className={`p-2 rounded-full transition-colors ${isNightMode ? 'bg-amber-400/20 text-amber-300' : 'hover:bg-white/10'}`}
                        title="Modo Noturno"
                    >
                        <Moon size={20} />
                    </button>
                </div>
            </header>

            {/* FONT CONTROL OVERLAY */}
            {showFontControl && (
                <div className="absolute top-20 right-4 z-40 p-4 rounded-xl bg-slate-800 border border-slate-700 shadow-xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="p-2 bg-slate-700 rounded-lg">A-</button>
                        <span className="font-bold w-8 text-center">{fontSize}</span>
                        <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-2 bg-slate-700 rounded-lg">A+</button>
                    </div>
                </div>
            )}

            {/* BOOK SELECTOR MODAL */}
            {showBookSelector && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col p-6 animate-in fade-in slide-in-from-bottom-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-amber-400">Livros</h2>
                        <button onClick={() => setShowBookSelector(false)} className="p-2 bg-white/10 rounded-full">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pb-20">
                        {BIBLE_BOOKS.map(book => (
                            <button
                                key={book.name}
                                onClick={() => handleBookSelect(book)}
                                className={`p-4 rounded-xl text-left transition-all ${currentBook.name === book.name ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                {book.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* CHAPTER SELECTOR MODAL */}
            {showChapterSelector && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col p-6 animate-in fade-in slide-in-from-bottom-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-amber-400">{currentBook.name}</h2>
                        <button onClick={() => setShowChapterSelector(false)} className="p-2 bg-white/10 rounded-full">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-3 pb-20 content-start">
                        {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map(chapter => (
                            <button
                                key={chapter}
                                onClick={() => handleChapterSelect(chapter)}
                                className={`aspect-square rounded-xl flex items-center justify-center text-lg font-bold transition-all ${currentChapter === chapter ? 'bg-amber-500 text-black' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                {chapter}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* MAIN CONTENT */}
            <main className={`flex-1 overflow-y-auto px-6 py-6 pb-32 ${isNightMode ? 'bg-black/40' : ''}`}>
                <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between gap-3">
                    <button
                        onClick={handleHighlightAgain}
                        disabled={!lastTargetVerse}
                        className="px-3 py-2 rounded-lg text-xs font-semibold border border-amber-400/40 text-amber-200 hover:bg-amber-400/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Destacar Novamente
                    </button>
                    <button
                        onClick={() => setIsHighlightPinned(prev => !prev)}
                        className="px-3 py-2 rounded-lg text-xs font-semibold border border-white/10 text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <span>DESTAQUE PERMANENTE</span>
                        <span
                            className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${isHighlightPinned ? 'bg-amber-400' : 'bg-white/15'}`}
                        >
                            <span
                                className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isHighlightPinned ? 'translate-x-4' : 'translate-x-0'}`}
                            />
                        </span>
                    </button>
                </div>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="opacity-50 animate-pulse">Carregando palavra...</p>
                    </div>
                ) : (
                    <div className="font-serif leading-loose space-y-6 max-w-2xl mx-auto" style={{ fontSize: `${fontSize}px` }}>
                        {chapterContent.map((verse, idx) => (
                            <p
                                key={idx}
                                id={`verse-${idx + 1}`}
                                className={`relative pl-2 rounded-lg transition-colors duration-700 ${highlightVerse === idx + 1 ? 'bg-amber-400/15 ring-1 ring-amber-400/40' : ''}`}
                            >
                                <sup className={`font-bold ${currentTheme.accentClass} mr-2 text-xs opacity-80 select-none`}>{idx + 1}</sup>
                                <span className={`${currentTheme.textClass} opacity-90`}>{verse.text}</span>
                            </p>
                        ))}
                    </div>
                )}
            </main>

            {/* NAVIGATION FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 backdrop-blur-xl bg-black/40 border-t border-white/5 flex justify-between items-center z-20">
                <button
                    onClick={handlePrevChapter}
                    disabled={currentBook.name === "Gênesis" && currentChapter === 1}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                    <ChevronLeft />
                </button>

                <span className="text-xs opacity-40 uppercase tracking-widest">Capítulo {currentChapter}</span>

                <button
                    onClick={handleNextChapter}
                    disabled={currentBook.name === "Apocalipse" && currentChapter === 22}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                    <ChevronRight />
                </button>
            </div>

            {/* FAB SHARE */}
            <button
                onClick={handleShareChapter}
                className="fixed bottom-24 right-6 bg-amber-500 hover:bg-amber-400 text-slate-900 w-14 h-14 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center transform hover:scale-105 transition-all z-20"
            >
                <Share2 size={24} />
            </button>

        </div>
    );
};

export default ReaderMode;
