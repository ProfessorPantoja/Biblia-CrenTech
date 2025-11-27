import React from 'react';
import { X, Palette } from 'lucide-react';
import { THEMES, ThemeConfig } from '../../config/constants';
import { AppTheme } from '../../types';

interface ThemeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTheme: ThemeConfig;
    appTheme: AppTheme;
    handleThemeChange: (theme: AppTheme) => void;
}

const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose, currentTheme, appTheme, handleThemeChange }) => {
    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
            <div onClick={(e) => e.stopPropagation()} className={`${currentTheme.headerClass} w-full max-w-lg p-6 rounded-t-3xl md:rounded-2xl shadow-2xl relative border`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X /></button>
                <h2 className={`text-lg font-bold mb-6 ${currentTheme.accentClass} flex items-center gap-2`}><Palette size={18} /> Atmosfera</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(Object.keys(THEMES) as AppTheme[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => handleThemeChange(t)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-3 ${appTheme === t ? 'scale-105 shadow-lg ring-2' : 'opacity-80'}`}
                            style={{ backgroundColor: t === 'pentecostal' ? '#431407' : t === 'catholic' ? '#000' : '' }}
                        >
                            {THEMES[t].icon}
                            {THEMES[t].name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeModal;
