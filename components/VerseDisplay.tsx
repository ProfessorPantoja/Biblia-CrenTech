
import React, { useState } from 'react';
import { VerseReference } from '../types';
import { Copy, Check, Volume2 } from 'lucide-react';

interface VerseDisplayProps {
  data: VerseReference | null;
  textColorClass?: string;
  accentColorClass?: string;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ 
  data, 
  textColorClass = "text-slate-100", 
  accentColorClass = "text-bible-gold" 
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    const textToCopy = `${data.text} - ${data.book} ${data.chapter}:${data.verse}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(`${data.book} capítulo ${data.chapter}, versículo ${data.verse}. ${data.text}`);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert("Seu navegador não suporta leitura de voz.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative group">
      <h2 className={`text-lg md:text-xl font-bold tracking-widest uppercase mb-4 ${accentColorClass} animate-in zoom-in duration-500`}>
        {data.book} {data.chapter}:{data.verse}
      </h2>
      
      <div className="relative py-6">
        <span className={`absolute -top-2 -left-2 text-6xl opacity-10 font-serif select-none ${accentColorClass}`}>“</span>
        <p className={`text-2xl md:text-4xl leading-relaxed font-serif ${textColorClass} drop-shadow-sm`}>
          {data.text}
        </p>
        <span className={`absolute -bottom-6 -right-2 text-6xl opacity-10 font-serif rotate-180 select-none ${accentColorClass}`}>“</span>
      </div>
      
      {/* Actions Row */}
      <div className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        <button 
          onClick={handleSpeak}
          className={`p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 ${isSpeaking ? 'bg-bible-accent text-white animate-pulse' : 'bg-slate-800/80 text-slate-300 hover:bg-bible-accent hover:text-white'}`}
          title="Ouvir Versículo"
        >
          <Volume2 size={20} />
        </button>

        <button 
          onClick={handleCopy}
          className={`p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 ${copied ? 'bg-green-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-green-600 hover:text-white'}`}
          title="Copiar versículo"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
    </div>
  );
};

export default VerseDisplay;
