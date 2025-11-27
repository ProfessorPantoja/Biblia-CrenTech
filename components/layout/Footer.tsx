import React from 'react';
import { Star, CircleDollarSign, Volume2, VolumeX } from 'lucide-react';
import { ThemeConfig } from '../../config/constants';

interface FooterProps {
    currentTheme: ThemeConfig;
    handleFeedback: () => void;
    setIsDonateOpen: (isOpen: boolean) => void;
    toggleMute: () => void;
    isMuted: boolean;
}

const Footer: React.FC<FooterProps> = ({
    currentTheme,
    handleFeedback,
    setIsDonateOpen,
    toggleMute,
    isMuted
}) => {
    return (
        <div className={`fixed bottom-0 left-0 right-0 w-full flex items-center justify-between px-4 z-30 py-1.5 border-t backdrop-blur-md ${currentTheme.headerClass}`}>
            <div className="flex gap-4">
                <button onClick={handleFeedback} className={`opacity-60 hover:opacity-100 ${currentTheme.textClass}`} title="Sugestões">
                    <Star size={14} />
                </button>
                <button onClick={() => setIsDonateOpen(true)} className={`opacity-60 hover:opacity-100 md:hidden ${currentTheme.textClass}`}>
                    <CircleDollarSign size={14} />
                </button>
            </div>

            <p className={`text-[10px] opacity-70 font-bold uppercase ${currentTheme.textClass}`}>Desenvolvido por Fabio Pantoja - Canal CrenTech</p>

            {/* MUTE BUTTON */}
            <button onClick={toggleMute} className={`p-1 rounded-full ${currentTheme.textClass} opacity-60 hover:opacity-100`}>
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-green-500" />}
            </button>
        </div>
    );
};

export default Footer;
