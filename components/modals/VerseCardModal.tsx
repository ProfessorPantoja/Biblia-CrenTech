import React from 'react';
import { X, Share2, Download } from 'lucide-react';
import { generateVerseCard, VerseCardData } from '../../utils/verseCard';
import { SoundEngine } from '../../utils/soundEngine';

interface VerseCardModalProps {
    data: VerseCardData;
    onClose: () => void;
}

// Preview do card de versículo em imagem, com compartilhar/baixar
const VerseCardModal: React.FC<VerseCardModalProps> = ({ data, onClose }) => {
    const [blob, setBlob] = React.useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        let active = true;
        let url: string | null = null;

        generateVerseCard(data)
            .then(generated => {
                if (!active) return;
                url = URL.createObjectURL(generated);
                setBlob(generated);
                setPreviewUrl(url);
            })
            .catch(() => active && setError(true));

        return () => {
            active = false;
            if (url) URL.revokeObjectURL(url);
        };
    }, [data]);

    const makeFile = () =>
        blob ? new File([blob], 'versiculo-biblia-crentech.png', { type: 'image/png' }) : null;

    const canShareFile = React.useMemo(() => {
        const file = makeFile();
        return Boolean(file && navigator.share && navigator.canShare?.({ files: [file] }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blob]);

    const handleShare = async () => {
        const file = makeFile();
        if (!file) return;
        SoundEngine.playClick();
        try {
            await navigator.share({
                files: [file],
                title: 'Versículo - Bíblia CrenTech',
                text: `${data.reference} 📖✨`
            });
        } catch {
            // usuário cancelou o compartilhamento
        }
    };

    const handleDownload = () => {
        if (!previewUrl) return;
        SoundEngine.playClick();
        const link = document.createElement('a');
        link.href = previewUrl;
        link.download = 'versiculo-biblia-crentech.png';
        link.click();
    };

    return (
        <div
            className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/30 p-5 shadow-2xl animate-in zoom-in-95"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-4 text-center">
                    Card do Versículo
                </h3>

                {/* Preview */}
                <div className="flex items-center justify-center min-h-[300px] mb-5">
                    {error ? (
                        <p className="text-red-300 text-sm text-center px-4">
                            Não foi possível gerar a imagem neste aparelho.
                        </p>
                    ) : previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={`Card de ${data.reference}`}
                            className="max-h-[52vh] w-auto rounded-xl border border-white/10 shadow-2xl animate-in fade-in"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-white/60">
                            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Gerando imagem...</span>
                        </div>
                    )}
                </div>

                {/* Ações */}
                <div className="space-y-2.5">
                    {canShareFile && (
                        <button
                            onClick={handleShare}
                            disabled={!blob}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Share2 size={18} />
                            <span>Compartilhar imagem</span>
                        </button>
                    )}
                    <button
                        onClick={handleDownload}
                        disabled={!previewUrl}
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${canShareFile
                            ? 'border border-white/15 text-white hover:bg-white/5'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold shadow-lg shadow-amber-500/20'
                            }`}
                    >
                        <Download size={18} />
                        <span>Baixar imagem</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerseCardModal;
