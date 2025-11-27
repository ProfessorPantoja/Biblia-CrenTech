import React from 'react';
import { Heart, X } from 'lucide-react';
import { ThemeConfig } from '../../config/constants';

interface DonationTickerProps {
    showTicker: boolean;
    setShowTicker: (show: boolean) => void;
    setIsDonateOpen: (isOpen: boolean) => void;
    currentTheme: ThemeConfig;
}

const DonationTicker: React.FC<DonationTickerProps> = ({
    showTicker,
    setShowTicker,
    setIsDonateOpen,
    currentTheme
}) => {
    return (
        <div className={`fixed bottom-16 left-0 right-0 z-50 pointer-events-none transition-all duration-700 flex justify-center ${showTicker ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className={`mx-4 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-xl border ${currentTheme.headerClass}`}>
                <Heart size={16} className="text-red-500 fill-current animate-pulse" />
                <p className={`text-xs font-medium ${currentTheme.textClass}`}>
                    Este projeto é mantido por fé. <button onClick={() => { setIsDonateOpen(true); setShowTicker(false) }} className="underline font-bold pointer-events-auto hover:text-green-500">Ajude o Canal CrenTech.</button>
                </p>
                <button onClick={() => setShowTicker(false)} className="pointer-events-auto opacity-50 hover:opacity-100"><X size={14} /></button>
            </div>
        </div>
    );
};

export default DonationTicker;
