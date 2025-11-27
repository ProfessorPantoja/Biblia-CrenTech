import React from 'react';
import { Search, CircleDollarSign, Palette } from 'lucide-react';
import { BibleVersion } from '../../types';
import { ThemeConfig } from '../../config/constants';
import { SoundEngine } from '../../utils/soundEngine';

interface HeaderProps {
    currentTheme: ThemeConfig;
    bibleVersion: BibleVersion;
    setBibleVersion: (version: BibleVersion) => void;
    toggleSearch: () => void;
    setIsDonateOpen: (isOpen: boolean) => void;
    setIsThemeOpen: (isOpen: boolean) => void;
    setIsAboutOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
    currentTheme,
    bibleVersion,
    setBibleVersion,
    toggleSearch,
    setIsDonateOpen,
    setIsThemeOpen,
    setIsAboutOpen
}) => {
    return (
        <header className={`w-full py-4 px-4 md:px-6 flex justify-between items-center border-b backdrop-blur-md z-30 gap-2 transition-all duration-500 ${currentTheme.headerClass}`}>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsAboutOpen(true)}>
                <div className="w-[45px] h-[45px] rounded-full transition-all group-hover:rotate-12 flex items-center justify-center overflow-hidden bg-black/5">
                    <img src="/logo.png" alt="CrenTech" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <div className="logo-fallback hidden">📖</div>
                </div>

                <div className="flex flex-col">
                    <h1 className={`text-xl md:text-2xl font-serif font-bold tracking-tight leading-none ${currentTheme.textClass}`}>
                        Bíblia CrenTech
                    </h1>
                    <span className={`text-[10px] md:text-xs font-sans opacity-70 uppercase tracking-wider ${currentTheme.textClass} mt-0.5`}>
                        Consulta Rápida com IA
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* BIBLE VERSION SELECTOR */}
                <select
                    value={bibleVersion}
                    onChange={(e) => {
                        setBibleVersion(e.target.value as BibleVersion);
                        SoundEngine.playClick();
                    }}
                    className={`bg-transparent text-xs font-bold border border-current rounded px-1 py-1 ${currentTheme.textClass} opacity-80 hover:opacity-100 cursor-pointer`}
                >
                    <option value="ACF" className="text-black">ACF</option>
                    <option value="NVI" className="text-black">NVI</option>
                    <option value="ARC" className="text-black">ARC</option>
                    <option value="NBV" className="text-black">NBV</option>
                    <option value="NTLH" className="text-black">NTLH</option>
                    <option value="BAM" className="text-black">Católica</option>
                    <option value="TNM" className="text-black">TNM</option>
                </select>

                <button onClick={toggleSearch} className="p-2 hover:bg-black/10 rounded-full transition-colors"><Search size={22} className={currentTheme.textClass} /></button>
                <button onClick={() => setIsDonateOpen(true)} className="p-2 hover:scale-110 transition-transform hidden md:block" title="Doar"><CircleDollarSign className={currentTheme.textClass} size={22} /></button>
                <button onClick={() => setIsThemeOpen(true)} className="p-2 hover:scale-110 transition-transform" title="Temas"><Palette className={currentTheme.textClass} size={22} /></button>
            </div>
        </header>
    );
};

export default Header;
