import React from 'react';
import { AppTheme } from '../types';
import { THEMES } from '../config/constants';
import { Mic, BookOpen, History, Gamepad2, Share2, ChevronRight, Download, Palette } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigation } from '../contexts/NavigationContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useBible } from '../hooks/useBible';
import { FEATURED_VERSES } from '../data/featuredVerses';
import { StorageService } from '../services/StorageService';

const FALLBACK_DAILY_VERSE = {
    text: 'O Senhor é o meu pastor; de nada terei falta.',
    reference: 'Salmos 23:1'
};

const DAILY_VERSE_CACHE_KEY = 'bible_crentech_daily_verse';

const HomeScreen: React.FC = () => {
    const { appTheme, setAppTheme, lastReading, setReaderState } = useApp();
    const { navigate } = useNavigation();
    const { isInstallable, install: installPWA } = usePWAInstall();
    const { getVerses } = useBible();
    const userName = "Visitante";

    const currentTheme = THEMES[appTheme];

    const [dailyVerse, setDailyVerse] = React.useState(FALLBACK_DAILY_VERSE);
    const [isDailyVerseLoading, setIsDailyVerseLoading] = React.useState(true);
    const [lastRandomReference, setLastRandomReference] = React.useState<string | null>(null);

    const cycleTheme = () => {
        const themeKeys: AppTheme[] = ['hitech', 'jesus', 'medieval', 'kids', 'catholic', 'pentecostal'];
        const currentIndex = themeKeys.indexOf(appTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setAppTheme(themeKeys[nextIndex]);
    };

    const [showInstallInstructions, setShowInstallInstructions] = React.useState(false);

    const getDailyIndex = React.useCallback(() => {
        const now = new Date();
        const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayNumber = Math.floor(localMidnight.getTime() / 86400000);
        return dayNumber % FEATURED_VERSES.length;
    }, []);

    const getLocalDateKey = React.useCallback(() => {
        const now = new Date();
        const month = `${now.getMonth() + 1}`.padStart(2, '0');
        const day = `${now.getDate()}`.padStart(2, '0');
        return `${now.getFullYear()}-${month}-${day}`;
    }, []);

    const parseReferenceToReader = React.useCallback((reference: string) => {
        const match = reference.match(/^(.*)\s(\d+):(\d+)$/);
        if (!match) return null;
        const [, book, chapterStr] = match;
        return { book, chapter: parseInt(chapterStr, 10) };
    }, []);

    const extractBookName = React.useCallback((reference: string) => {
        const match = reference.match(/^(.*)\s(\d+):(\d+)$/);
        if (!match) return null;
        return match[1];
    }, []);

    const verseByBook = React.useMemo(() => {
        return FEATURED_VERSES.reduce<Record<string, string[]>>((acc, reference) => {
            const book = extractBookName(reference);
            if (!book) return acc;
            if (!acc[book]) acc[book] = [];
            acc[book].push(reference);
            return acc;
        }, {});
    }, [extractBookName]);

    React.useEffect(() => {
        let isActive = true;

        const loadDailyVerse = async () => {
            const dateKey = getLocalDateKey();
            const cached = StorageService.load<{
                dateKey: string;
                text: string;
                reference: string;
            } | null>(DAILY_VERSE_CACHE_KEY, null);

            if (cached && cached.dateKey === dateKey) {
                setDailyVerse({
                    text: cached.text,
                    reference: cached.reference
                });
                setIsDailyVerseLoading(false);
                return;
            }

            const index = getDailyIndex();
            const reference = FEATURED_VERSES[index];
            const result = await getVerses(reference);

            if (!isActive) return;

            if (result && result.length > 0) {
                const nextVerse = {
                    text: result[0].text,
                    reference: result[0].reference
                };
                setDailyVerse(nextVerse);
                StorageService.save(DAILY_VERSE_CACHE_KEY, { dateKey, ...nextVerse });
            } else {
                const nextVerse = {
                    text: FALLBACK_DAILY_VERSE.text,
                    reference
                };
                setDailyVerse(nextVerse);
                StorageService.save(DAILY_VERSE_CACHE_KEY, { dateKey, ...nextVerse });
            }

            setIsDailyVerseLoading(false);
        };

        loadDailyVerse();

        return () => {
            isActive = false;
        };
    }, [getDailyIndex, getLocalDateKey, getVerses]);

    const handleRandomVerse = () => {
        const books = Object.keys(verseByBook);
        if (books.length === 0) return;

        const pickRandomReference = () => {
            const randomBook = books[Math.floor(Math.random() * books.length)];
            const refs = verseByBook[randomBook];
            return refs[Math.floor(Math.random() * refs.length)];
        };

        let reference = pickRandomReference();
        let attempts = 0;
        while (attempts < 5 && reference === lastRandomReference) {
            reference = pickRandomReference();
            attempts += 1;
        }

        setLastRandomReference(reference);
        const target = parseReferenceToReader(reference);
        if (target) {
            setReaderState(target);
            navigate('reader');
        }
    };

    const handleInstallClick = async () => {
        const outcome = await installPWA();
        if (outcome === 'instructions_needed') {
            setShowInstallInstructions(true);
        }
    };

    return (
        <div className={`min-h-screen w-full flex flex-col p-6 space-y-6 relative overflow-hidden ${currentTheme.bgClass} transition-colors duration-700`}>

            {/* INSTALL INSTRUCTIONS MODAL */}
            {showInstallInstructions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setShowInstallInstructions(false)}>
                    <div className={`relative w-full max-w-sm p-6 rounded-2xl border border-amber-500/30 shadow-2xl ${currentTheme.cardClass}`} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowInstallInstructions(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-amber-500/50 flex items-center justify-center shadow-lg mb-2">
                                <img src="/icons/android-launchericon-192-192.png" alt="Icon" className="w-12 h-12" onError={(e) => e.currentTarget.style.display = 'none'} />
                                <span className="text-2xl logo-fallback" style={{ display: 'none' }}>📖</span>
                            </div>
                            <h3 className={`text-xl font-bold ${currentTheme.textClass}`}>Instalar Aplicativo</h3>
                            <p className={`${currentTheme.textClass} opacity-80 text-sm`}>
                                Para instalar no seu dispositivo iOS ou Navegador:
                            </p>
                            <ol className={`text-left text-sm space-y-3 ${currentTheme.textClass} opacity-90 bg-black/20 p-4 rounded-xl w-full`}>
                                <li className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-xs">1</span>
                                    <span>Toque no botão <strong>Compartilhar</strong> <Share2 size={14} className="inline" /></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-xs">2</span>
                                    <span>Selecione <strong>Adicionar à Tela de Início</strong> <span className="text-xs border border-current px-1 rounded">+</span></span>
                                </li>
                            </ol>
                            <button
                                onClick={() => setShowInstallInstructions(false)}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors"
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Glow Effects */}
            <div className="absolute top-0 -left-20 w-72 h-72 bg-amber-500/10 rounded-full filter blur-3xl opacity-40 pointer-events-none"></div>
            <div className="absolute bottom-0 -right-20 w-72 h-72 bg-slate-400/10 rounded-full filter blur-3xl opacity-40 pointer-events-none"></div>

            {/* HEADER */}
            <header className="flex justify-between items-center z-10 pt-4">
                <div className="text-left">
                    <p className={`${currentTheme.textClass} opacity-60 text-base`}>Graça e Paz,</p>
                    <h1 className={`${currentTheme.textClass} text-2xl font-bold`}>{userName}</h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Theme Switcher */}
                    <button
                        onClick={cycleTheme}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 active:scale-95 transition-transform"
                    >
                        <Palette size={18} />
                    </button>

                    {/* Install PWA Button */}
                    {isInstallable && (
                        <button
                            onClick={handleInstallClick}
                            className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/50 flex items-center justify-center text-green-400 active:scale-95 transition-transform animate-pulse"
                            title="Instalar App"
                        >
                            <Download size={18} />
                        </button>
                    )}

                    {/* Share Button */}
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Bíblia CrenTech',
                                    text: 'Baixe agora a Bíblia CrenTech: IA A SERVIÇO DO REINO! 📖✨',
                                    url: 'https://biblia-crentech.vercel.app/'
                                }).catch(console.error);
                            }
                        }}
                        className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/50 flex items-center justify-center text-amber-400 active:scale-95 transition-transform"
                    >
                        <Share2 size={18} />
                    </button>

                    <div className="w-12 h-12 rounded-full border-2 border-amber-400/80 p-0.5 shadow-lg shadow-amber-500/20 ml-1">
                        {/* Placeholder Avatar - In real app could be user image */}
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-lg">
                            {userName.charAt(0)}
                        </div>
                    </div>
                </div>
            </header>

            {/* VERSICLE OF THE DAY CARD */}
            <div className={`relative rounded-2xl p-6 flex flex-col space-y-4 backdrop-blur-xl bg-white/5 border border-amber-400/20 shadow-xl z-10`}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Versículo do Dia</h2>
                <blockquote className="flex-grow">
                    <p className={`text-xl ${currentTheme.textClass} font-medium leading-relaxed`}>
                        {isDailyVerseLoading ? 'Carregando versículo do dia...' : `"${dailyVerse.text}"`}
                    </p>
                    <cite className={`mt-3 block text-right ${currentTheme.textClass} opacity-60 text-sm font-serif italic`}>
                        {isDailyVerseLoading ? 'Carregando...' : dailyVerse.reference}
                    </cite>
                </blockquote>
                <button
                    onClick={() => {
                        if (navigator.share) {
                            if (isDailyVerseLoading) return;
                            navigator.share({
                                title: 'Versículo do Dia',
                                text: `"${dailyVerse.text}" - ${dailyVerse.reference}`,
                            }).catch(console.error);
                        }
                    }}
                    className={`w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20 ${isDailyVerseLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    <Share2 size={20} />
                    <span>Compartilhar</span>
                </button>
                <button
                    onClick={() => {
                        if (isDailyVerseLoading) return;
                        handleRandomVerse();
                    }}
                    className={`w-full border border-amber-400/40 text-amber-200 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 ${isDailyVerseLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-amber-400/10'}`}
                >
                    <span>Ir para Versículo Aleatório</span>
                </button>
                <button
                    onClick={() => {
                        if (isDailyVerseLoading) return;
                        const target = parseReferenceToReader(dailyVerse.reference);
                        if (target) {
                            setReaderState(target);
                            navigate('reader');
                        }
                    }}
                    className={`w-full border border-amber-400/50 text-amber-200 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 ${isDailyVerseLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-amber-400/10'}`}
                >
                    <BookOpen size={18} />
                    <span>Ler no Leitor</span>
                </button>
            </div>

            {/* MAIN GRID */}
            <main className="grid grid-cols-2 gap-4 z-10 flex-grow content-start">

                {/* IA SEARCH CARD (Featured) */}
                <button
                    onClick={() => navigate('search')}
                    className="col-span-1 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-xl bg-white/5 border border-amber-400/30 shadow-xl hover:bg-white/10 transition-all group text-left"
                >
                    <div className="w-14 h-14 rounded-full bg-amber-400/20 flex items-center justify-center border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-shadow">
                        <Mic className="text-amber-400" size={28} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${currentTheme.textClass}`}>Busca IA</h3>
                        <p className={`${currentTheme.textClass} opacity-50 text-xs`}>Tire suas dúvidas</p>
                    </div>
                </button>

                {/* READER CARD */}
                <button
                    onClick={() => navigate('reader')}
                    className="col-span-1 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 transition-all text-left"
                >
                    <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center">
                        <BookOpen className="text-amber-400" size={28} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${currentTheme.textClass}`}>Ler Bíblia</h3>
                        <p className={`${currentTheme.textClass} opacity-50 text-xs`}>Navegue</p>
                    </div>
                </button>

                {/* HISTORY CARD */}
                <button
                    onClick={() => navigate('history')}
                    className="col-span-1 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 transition-all text-left"
                >
                    <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center">
                        <History className="text-amber-400" size={28} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${currentTheme.textClass}`}>Histórico</h3>
                        <p className={`${currentTheme.textClass} opacity-50 text-xs`}>Salvos</p>
                    </div>
                </button>

                {/* QUIZ CARD */}
                <button
                    onClick={() => navigate('quiz')}
                    className="col-span-1 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 transition-all text-left"
                >
                    <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center">
                        <Gamepad2 className="text-amber-400" size={28} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${currentTheme.textClass}`}>Quiz</h3>
                        <p className={`${currentTheme.textClass} opacity-50 text-xs`}>Desafie-se</p>
                    </div>
                </button>

            </main>

            {/* CONTINUE READING FOOTER */}
            <footer className="z-10 pb-4">
                <button
                    onClick={() => {
                        if (lastReading) {
                            setReaderState(lastReading);
                        }
                        navigate('reader');
                    }}
                    className="w-full rounded-2xl p-5 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 transition-all text-left group"
                >
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                            <h4 className={`font-semibold ${currentTheme.textClass} text-sm uppercase tracking-wide`}>Continuar lendo</h4>
                        </div>
                        <span className={`${currentTheme.textClass} opacity-50 text-xs flex items-center gap-1`}>
                            {lastReading ? `${lastReading.book} ${lastReading.chapter}` : 'Gênesis 1'} <ChevronRight size={14} />
                        </span>
                    </div>

                    <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full w-full" />
                    </div>
                    <p className={`text-right text-[10px] ${currentTheme.textClass} opacity-40`}>{lastReading ? 'Capítulo salvo' : 'Capítulo inicial'}</p>
                </button>
            </footer>

        </div>
    );
};

export default HomeScreen;
