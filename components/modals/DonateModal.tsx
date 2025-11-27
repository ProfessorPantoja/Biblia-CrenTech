import React from 'react';
import { X, Heart, QrCode, Copy } from 'lucide-react';
import { ThemeConfig } from '../../config/constants';
import { SoundEngine } from '../../utils/soundEngine';

interface DonateModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTheme: ThemeConfig;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose, currentTheme }) => {
    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
            <div onClick={(e) => e.stopPropagation()} className={`${currentTheme.headerClass} w-full max-w-md p-6 rounded-2xl border relative text-center`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X /></button>
                <h2 className={`text-xl font-bold mb-4 flex items-center justify-center gap-2 ${currentTheme.textClass}`}>
                    <Heart className="text-red-500 fill-current animate-pulse" /> Apoie o Projeto
                </h2>
                <p className={`text-sm mb-6 ${currentTheme.textClass} opacity-80`}>
                    Ajude a manter este projeto de tecnologia para o Reino.
                </p>

                <div className="bg-white p-6 rounded-xl flex flex-col items-center gap-4 shadow-inner">
                    <QrCode className="w-40 h-40 text-black" />
                    <p className="text-slate-500 font-mono text-[10px] break-all text-center border p-2 rounded bg-slate-50">
                        00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000
                    </p>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000");
                            alert("Chave PIX copiada!");
                            SoundEngine.playSuccess();
                        }}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-green-500 hover:scale-105 transition-all shadow-lg"
                    >
                        <Copy size={16} /> Copiar Chave PIX
                    </button>
                </div>
                <p className={`text-xs mt-4 opacity-50 ${currentTheme.textClass}`}>Fabio Pantoja - Canal CrenTech</p>
            </div>
        </div>
    );
};

export default DonateModal;
