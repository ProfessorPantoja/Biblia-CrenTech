import React from 'react';
import { ChevronLeft, ChevronRight, Search, Trash2, Copy, Check, History as HistoryIcon } from 'lucide-react';
import { VerseReference } from '../types';
import { THEMES } from '../config/constants';
import { useApp } from '../contexts/AppContext';
import { useNavigation } from '../contexts/NavigationContext';
import { SoundEngine } from '../utils/soundEngine';

const HistoryScreen: React.FC = () => {
    const { appTheme, bibleVersion, history, setHistory, setCurrentIndex, setReaderState } = useApp();
    const { navigate } = useNavigation();
    const currentTheme = THEMES[appTheme];

    const [copied, setCopied] = React.useState(false);

    // Mais recentes primeiro, guardando o índice original para remoção
    const items = React.useMemo(
        () => history.map((verse, index) => ({ verse, index })).reverse(),
        [history]
    );

    const openInReader = (verse: VerseReference) => {
        SoundEngine.playClick();
        setReaderState({ book: verse.book, chapter: verse.chapter, verse: verse.verse });
        navigate('reader');
    };

    const removeItem = (index: number) => {
        SoundEngine.playClick();
        const next = history.filter((_, i) => i !== index);
        setHistory(next);
        setCurrentIndex(next.length - 1);
    };

    const clearAll = () => {
        if (!window.confirm('Apagar todo o histórico de buscas?')) return;
        SoundEngine.playClick();
        setHistory([]);
        setCurrentIndex(-1);
    };

    const copyAll = () => {
        SoundEngine.playClick();
        const allText = history.map(v => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`).join('\n\n');
        const header = `*Histórico de Pesquisa - Bíblia CrenTech (${bibleVersion})*\n\n`;
        navigator.clipboard.writeText(header + allText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`min-h-screen w-full flex flex-col ${currentTheme.bgClass} transition-colors duration-700`}>

            {/* HEADER */}
            <header className={`sticky top-0 z-30 p-4 pt-6 backdrop-blur-xl bg-opacity-80 border-b border-white/5 flex items-center justify-between shadow-sm ${currentTheme.bgClass}`}>
                <button
                    onClick={() => navigate('home')}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={24} className={currentTheme.textClass} />
                </button>

                <div className="flex flex-col items-center">
                    <h1 className={`font-bold text-lg ${currentTheme.textClass}`}>Histórico</h1>
                    <span className="text-xs opacity-50 uppercase tracking-widest">
                        {history.length} {history.length === 1 ? 'versículo' : 'versículos'}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={copyAll}
                        disabled={history.length === 0}
                        className={`p-2 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors ${currentTheme.textClass}`}
                        title="Copiar tudo"
                    >
                        {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                    </button>
                    <button
                        onClick={clearAll}
                        disabled={history.length === 0}
                        className="p-2 rounded-full hover:bg-red-500/20 text-red-400 disabled:opacity-30 transition-colors"
                        title="Limpar histórico"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </header>

            {/* CONTENT */}
            <main className="flex-1 p-4 pb-10 w-full max-w-2xl mx-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center mt-24 space-y-5 px-6">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <HistoryIcon size={36} className="text-amber-400 opacity-80" />
                        </div>
                        <div className="space-y-2">
                            <h2 className={`text-xl font-bold ${currentTheme.textClass}`}>Nenhuma busca ainda</h2>
                            <p className={`${currentTheme.textClass} opacity-60 text-sm leading-relaxed`}>
                                Os versículos que você buscar por voz ou texto aparecem aqui para reler quando quiser.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('search')}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                        >
                            <Search size={18} />
                            <span>Fazer uma busca</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 animate-in fade-in duration-500">
                        {items.map(({ verse, index }) => (
                            <div
                                key={`${verse.book}-${verse.chapter}-${verse.verse}-${index}`}
                                className="rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 transition-all flex items-stretch overflow-hidden"
                            >
                                <button
                                    onClick={() => openInReader(verse)}
                                    className="flex-1 p-4 text-left min-w-0"
                                >
                                    <div className="flex items-center justify-between mb-1.5 gap-2">
                                        <span className="text-sm font-bold text-amber-400 truncate">
                                            {verse.book} {verse.chapter}:{verse.verse}
                                        </span>
                                        <span className={`${currentTheme.textClass} opacity-40 flex-shrink-0 flex items-center gap-0.5 text-[10px] uppercase tracking-wide`}>
                                            Abrir <ChevronRight size={12} />
                                        </span>
                                    </div>
                                    <p className={`${currentTheme.textClass} opacity-75 text-sm leading-relaxed line-clamp-2`}>
                                        {verse.text}
                                    </p>
                                </button>
                                <button
                                    onClick={() => removeItem(index)}
                                    className="px-3 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors border-l border-white/5"
                                    title="Remover do histórico"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HistoryScreen;
