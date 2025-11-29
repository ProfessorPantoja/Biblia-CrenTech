import React, { useState } from 'react';
import { X, Copy, Check, Heart, ArrowLeft } from 'lucide-react';
import QRCode from 'react-qr-code'; // Biblioteca que gera o QR Real

interface DonateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Seu código PIX Fixo que funciona para qualquer valor
const FIXED_PIX_CODE = "00020126360014br.gov.bcb.pix0114+55279926819595204000053039865802BR5925Fabio Pantoja Mendes De O6009Sao Paulo62290525REC69279B4B1248B41122496963045A77";

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [selectedValue, setSelectedValue] = useState<number | null>(20); // Começa selecionado 20 pra incentivar

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(FIXED_PIX_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const donationValues = [5, 10, 20, 50, 100];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">

                {/* Botão Voltar */}
                <button
                    onClick={onClose}
                    className="absolute left-4 top-4 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Cabeçalho */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-3">
                        <Heart className="w-6 h-6 text-red-500 fill-current" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Apoie o Projeto</h2>
                    <p className="text-slate-400 text-sm">
                        Ajude a manter esta tecnologia para o Reino.
                        <br />Escolha um valor ou doe quanto sentir no coração.
                    </p>
                </div>

                {/* Botões de Valor (Apenas Visual) */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {donationValues.map((value) => (
                        <button
                            key={value}
                            onClick={() => setSelectedValue(value)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedValue === value
                                ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 ring-2 ring-green-500 ring-offset-2 ring-offset-slate-900'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                }`}
                        >
                            R$ {value}
                        </button>
                    ))}
                    <button
                        onClick={() => setSelectedValue(null)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedValue === null
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                            }`}
                    >
                        Outro
                    </button>
                </div>

                {/* Área do QR Code */}
                <div className="bg-white p-4 rounded-xl mb-6 flex justify-center items-center shadow-inner">
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: "100%", width: "100%" }}>
                        {/* Componente que gera o desenho do QR Code real baseado no texto */}
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={FIXED_PIX_CODE}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </div>

                {/* Código Copia e Cola */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4 font-mono text-[10px] text-slate-500 break-all select-all">
                    {FIXED_PIX_CODE}
                </div>

                {/* Botão Copiar */}
                <button
                    onClick={handleCopy}
                    className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${copied
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-100 text-slate-900 hover:bg-white'
                        }`}
                >
                    {copied ? (
                        <>
                            <Check size={20} />
                            Copiado! Abra seu banco
                        </>
                    ) : (
                        <>
                            <Copy size={20} />
                            Copiar Código Pix
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-slate-500 mt-4">
                    Escaneie o QR Code ou copie o código.<br />
                    Digite o valor desejado no app do seu banco.
                </p>
            </div>
        </div>
    );
};

export default DonateModal;
