import React from 'react';
import { X, Info, MessageCircle } from 'lucide-react';
import { ThemeConfig } from '../../config/constants';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTheme: ThemeConfig;
    handleFeedback: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, currentTheme, handleFeedback }) => {
    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
            <div onClick={(e) => e.stopPropagation()} className={`${currentTheme.headerClass} w-full max-w-2xl p-6 rounded-2xl border relative max-h-[80vh] overflow-y-auto custom-scrollbar`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X /></button>
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Sobre o Projeto</h2>

                <div className={`space-y-4 ${currentTheme.textClass}`}>
                    <p>
                        <strong>A Origem:</strong> Este aplicativo nasceu de um projeto pessoal. Eu sentia necessidade de encontrar versículos rapidamente durante meus estudos e pregações. Percebi que a tecnologia de IA que Deus permitiu chegar até mim poderia abençoar a vida de muitas outras pessoas.
                    </p>
                    <div className="bg-black/10 p-4 rounded-lg mt-4">
                        <h3 className="font-bold mb-2 flex items-center gap-2"><Info size={16} /> Como Usar</h3>
                        <ul className="list-disc list-inside text-sm space-y-1 opacity-90">
                            <li>Toque no botão do <strong>Microfone</strong> e fale "João 3:16" ou "Quero versículos sobre ansiedade".</li>
                            <li>Use a <strong>Busca de Texto</strong> digitando "Ap" para completar "Apocalipse".</li>
                            <li>Clique em <strong>Contexto</strong> para ver o que vem antes e depois.</li>
                            <li>Clique em <strong>Hermenêutica</strong> para uma análise profunda do texto.</li>
                        </ul>
                    </div>

                    <button
                        onClick={handleFeedback}
                        className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-600"
                    >
                        <MessageCircle size={18} />
                        Enviar Sugestão ou Reclamação
                    </button>

                    <p className="text-xs opacity-60 mt-4 text-center">Desenvolvido com carinho por Fabio Pantoja.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
