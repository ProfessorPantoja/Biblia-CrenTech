import React from 'react';
import { Zap, Crown, Book, Smile, Flame } from 'lucide-react';
import { AppTheme } from '../types';

export interface ThemeConfig {
    name: string;
    bgClass: string;
    textClass: string;
    accentClass: string;
    headerClass: string;
    cardClass: string;
    specialEffect?: string;
    icon?: React.ReactNode;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
    hitech: {
        name: 'Hi-Tech',
        bgClass: "bg-slate-900 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] text-slate-100",
        textClass: "text-slate-100",
        accentClass: "text-cyan-400",
        headerClass: "bg-slate-900/90 border-slate-800",
        cardClass: "bg-slate-800/50 border-cyan-900/50",
        icon: <Zap size={ 16} />
  },
jesus: {
    name: 'Jesus',
        bgClass: "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-100 via-orange-50 to-white text-amber-950",
            textClass: "text-amber-950",
                accentClass: "text-amber-600",
                    headerClass: "bg-white/80 border-amber-100 backdrop-blur-md",
                        cardClass: "bg-white/60 border-amber-200/50 shadow-xl shadow-amber-500/10",
                            icon: <Crown size={ 16 } />
},
medieval: {
    name: 'Medieval',
        bgClass: "bg-[#d4c5a3] bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] text-slate-900 font-gothic",
            textClass: "text-slate-900",
                accentClass: "text-red-900",
                    headerClass: "bg-[#bfa780]/95 border-amber-900/40 shadow-md",
                        cardClass: "bg-[#eaddcf]/90 border-amber-900/30 shadow-2xl sepia-[.3]",
                            icon: <Book size={ 16 } />
},
kids: {
    name: 'Infantil',
        bgClass: "bg-sky-100 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] text-slate-800 font-hand",
            textClass: "text-slate-800",
                accentClass: "text-pink-500",
                    headerClass: "bg-white/90 border-sky-200 shadow-sm",
                        cardClass: "bg-white/80 border-sky-200 shadow-lg rounded-2xl",
                            icon: <Smile size={ 16 } />
},
catholic: {
    name: 'Católico',
        bgClass: "bg-stained-glass text-slate-100 bg-fixed",
            textClass: "text-slate-100",
                accentClass: "text-yellow-500",
                    headerClass: "bg-slate-900/80 border-slate-700 shadow-lg backdrop-blur-md",
                        cardClass: "bg-black/40 border-slate-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                            icon: <div className="w-4 h-4 border border-current rounded-full" />
  },
pentecostal: {
    name: 'Fogo',
        bgClass: "bg-gradient-to-br from-orange-950 via-red-900 to-black text-white",
            textClass: "text-orange-50",
                accentClass: "text-yellow-400",
                    headerClass: "bg-red-950/80 border-orange-800/50",
                        cardClass: "bg-orange-900/30 border-orange-500/30 fire-border",
                            icon: <Flame size={ 16 } />
}
};

export const COMMON_THEMES = [
    "Ansiedade", "Depressão", "Medo", "Cura", "Libertação",
    "Salvação", "Família", "Casamento", "Filhos", "Prosperidade",
    "Proteção", "Sabedoria", "Direção", "Propósito", "Milagres",
    "Fé", "Esperança", "Amor", "Perdão", "Gratidão",
    "Paz", "Alegria", "Força", "Coragem", "Vitória",
    "Jejum", "Oração", "Adoração", "Espírito Santo", "Batismo",
    "Arrependimento", "Santidade", "Humildade", "Obediência", "Serviço",
    "Dízimo", "Oferta", "Trabalho", "Descanso", "Justiça",
    "Misericórdia", "Graça", "Juízo", "Eternidade", "Céu",
    "Inferno", "Volta de Jesus", "Fim dos Tempos", "Profecia", "Revelação"
];
