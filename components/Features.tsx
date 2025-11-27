import React, { useState } from 'react';
import { BookOpen, School, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { ContextData, HermeneuticsData, VerseReference } from '../types';
import { getVerseContext, getHermeneutics } from '../services/geminiService';

interface FeaturesProps {
  reference: VerseReference;
}

const Features: React.FC<FeaturesProps> = ({ reference }) => {
  const [showContext, setShowContext] = useState(false);
  const [showHermeneutics, setShowHermeneutics] = useState(false);
  
  const [contextData, setContextData] = useState<ContextData | null>(null);
  const [hermeneuticsData, setHermeneuticsData] = useState<HermeneuticsData | null>(null);
  
  const [loadingContext, setLoadingContext] = useState(false);
  const [loadingHermeneutics, setLoadingHermeneutics] = useState(false);

  const toggleContext = async () => {
    if (showContext) {
      setShowContext(false);
      return;
    }
    
    setShowContext(true);
    if (!contextData) {
      setLoadingContext(true);
      try {
        const data = await getVerseContext(reference.book, reference.chapter, reference.verse);
        setContextData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingContext(false);
      }
    }
  };

  const toggleHermeneutics = async () => {
    if (showHermeneutics) {
      setShowHermeneutics(false);
      return;
    }

    setShowHermeneutics(true);
    if (!hermeneuticsData) {
      setLoadingHermeneutics(true);
      try {
        const data = await getHermeneutics(reference.book, reference.chapter, reference.verse, reference.text);
        setHermeneuticsData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingHermeneutics(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto mt-12 pb-20">
      {/* Buttons Row */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={toggleContext}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            showContext 
              ? 'bg-bible-gold text-bible-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BookOpen size={18} />
          Contexto
          {showContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <button
          onClick={toggleHermeneutics}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            showHermeneutics 
              ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <School size={18} />
          Hermenêutica
          {showHermeneutics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-4 px-4">
        {/* Context Card */}
        {showContext && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-in zoom-in-95 duration-300">
            <h3 className="text-bible-gold font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={14} /> Contexto Imediato
            </h3>
            
            {loadingContext ? (
              <div className="flex justify-center py-8 text-bible-gold">
                <Loader2 className="animate-spin" />
              </div>
            ) : contextData ? (
              <div className="space-y-4 font-serif text-slate-300 leading-relaxed max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {contextData.previous.map((v) => (
                   <p key={v.number} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                     <span className="text-bible-gold font-sans text-xs mr-2">{v.number}</span>
                     {v.text}
                   </p>
                ))}
                
                <p id="current-verse" className="text-lg text-white font-medium pl-4 border-l-2 border-bible-gold py-2 bg-bible-gold/5 rounded-r">
                   <span className="text-bible-gold font-sans text-xs mr-2">{reference.verse}</span>
                   {reference.text}
                </p>

                {contextData.next.map((v) => (
                   <p key={v.number} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                     <span className="text-bible-gold font-sans text-xs mr-2">{v.number}</span>
                     {v.text}
                   </p>
                ))}
              </div>
            ) : (
                <p className="text-red-400 text-sm">Falha ao carregar contexto.</p>
            )}
          </div>
        )}

        {/* Hermeneutics Card */}
        {showHermeneutics && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-in zoom-in-95 duration-300">
            <h3 className="text-purple-400 font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
              <School size={14} /> Análise Hermenêutica
            </h3>

            {loadingHermeneutics ? (
              <div className="flex justify-center py-8 text-purple-400">
                <Loader2 className="animate-spin" />
              </div>
            ) : hermeneuticsData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                    <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Autor</span>
                    <p className="text-slate-200">{hermeneuticsData.author}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                    <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Público-Alvo</span>
                    <p className="text-slate-200">{hermeneuticsData.audience}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg md:col-span-2">
                    <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Propósito</span>
                    <p className="text-slate-200">{hermeneuticsData.purpose}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg md:col-span-2 border border-purple-500/20">
                    <span className="block text-xs font-bold text-purple-400 uppercase mb-1">Sentido Teológico</span>
                    <p className="text-white italic font-serif">"{hermeneuticsData.meaning}"</p>
                </div>
              </div>
            ) : (
                <p className="text-red-400 text-sm">Falha ao carregar análise.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Features;
