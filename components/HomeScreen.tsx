import React from 'react';
import { AppTheme } from '../types';
import { THEMES } from '../config/constants';
import { Mic, BookOpen, History, Gamepad2, Share2, ChevronRight } from 'lucide-react';

interface HomeScreenProps {
    appTheme: AppTheme;
    onNavigate: (view: 'search' | 'reader' | 'history' | 'quiz') => void;
    userName?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ appTheme, onNavigate, userName = "Visitante" }) => {
    const currentTheme = THEMES[appTheme];

    return (
        <div className={`min-h-screen w-full flex flex-col p-6 space-y-6 relative overflow-hidden ${currentTheme.bgClass} transition-colors duration-700`}>

            {/* Background Glow Effects */}
            <div className="absolute top-0 -left-20 w-72 h-72 bg-amber-500/10 rounded-full filter blur-3xl opacity-40 pointer-events-none"></div>
            <div className="absolute bottom-0 -right-20 w-72 h-72 bg-slate-400/10 rounded-full filter blur-3xl opacity-40 pointer-events-none"></div>

            {/* HEADER */}
            <header className="flex justify-between items-center z-10 pt-4">
                <div className="text-left">
                    <p className={`${currentTheme.textClass} opacity-60 text-base`}>Graça e Paz,</p>
                    <h1 className={`${currentTheme.textClass} text-2xl font-bold`}>{userName}</h1>
                </div>

                <div className="flex items-center gap-3">
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
                    <div className="w-12 h-12 rounded-full border-2 border-amber-400/80 p-0.5 shadow-lg shadow-amber-500/20">
                        {/* Placeholder Avatar - In real app could be user image */}
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-lg">
                            {userName.charAt(0)}
                        </div>
                    </div>
                </div>
            </header>

            {/* VERSE OF THE DAY CARD */}
            <div className={`relative rounded-2xl p-6 flex flex-col space-y-4 backdrop-blur-xl bg-white/5 border border-amber-400/20 shadow-xl z-10`}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Versículo do Dia</h2>
                <blockquote className="flex-grow">
                    <p className={`text-xl ${currentTheme.textClass} font-medium leading-relaxed`}>
                        "O Senhor é o meu pastor; de nada terei falta."
                    </p>
                    <cite className={`mt-3 block text-right ${currentTheme.textClass} opacity-60 text-sm font-serif italic`}>
                        Salmos 23:1
                    </cite>
                </blockquote>
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Versículo do Dia',
                                text: '"O Senhor é o meu pastor; de nada terei falta." - Salmos 23:1',
                            }).catch(console.error);
                        }
                    }}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                >
                    <Share2 size={20} />
                    <span>Compartilhar</span>
                </button>
            </div>

            {/* MAIN GRID */}
            <main className="grid grid-cols-2 gap-4 z-10 flex-grow content-start">

                {/* IA SEARCH CARD (Featured) */}
                <button
                    onClick={() => onNavigate('search')}
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
                    onClick={() => onNavigate('reader')}
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
                    onClick={() => onNavigate('history')}
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
                    onClick={() => onNavigate('quiz')}
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
                <button className="w-full rounded-2xl p-5 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 transition-all text-left group">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                            <h4 className={`font-semibold ${currentTheme.textClass} text-sm uppercase tracking-wide`}>Continuar lendo</h4>
                        </div>
                        <span className={`${currentTheme.textClass} opacity-50 text-xs flex items-center gap-1`}>
                            Gênesis 1 <ChevronRight size={14} />
                        </span>
                    </div>

                    <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full w-[10%]" />
                    </div>
                    <p className={`text-right text-[10px] ${currentTheme.textClass} opacity-40`}>10% do capítulo</p>
                </button>
            </footer>

        </div>
    );
};

export default HomeScreen;
