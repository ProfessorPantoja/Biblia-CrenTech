
import React, { useState } from 'react';
import { BookOpen, School, Loader2, ChevronDown, ChevronUp, User, Users, MapPin, Zap } from 'lucide-react';
import { ContextData, HermeneuticsData, VerseReference, BibleVersion } from '../types';
import { getVerseContext, getHermeneutics } from '../services/geminiService';

interface FeaturesProps {
  reference: VerseReference;
  version: BibleVersion; // Added version prop to fetch context in correct version
}

const Features: React.FC<FeaturesProps> = ({ reference, version }) => {
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
        const data = await getVerseContext(reference.book, reference.chapter, reference.verse, version);
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
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto mt-12 pb-32">
      {/* Buttons Row */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={toggleContext}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            showContext 
              ? 'bg-bible-gold text-bible-dark shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105'
          }`}
        >
          <BookOpen size={18} />
          Contexto
          {showContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <button
          onClick={toggleHermeneutics}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            showHermeneutics 
              ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] scale-105' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105'
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
          <div className="bg-black/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-500 shadow-xl">
            <h3 className="text-bible-gold font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={14} /> Contexto Imediato
            </h3>
            
            {loadingContext ? (
              <div className="flex justify-center py-8 text-bible-gold">
                <Loader2 className="animate-spin w-8 h-8" />
              </div>
            ) : contextData ? (
              <div className="space-y-3 font-serif text-slate-300 leading-relaxed max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {contextData.previous.map((v) => (
                   <p key={v.number} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                     <sup className="text-bible-gold mr-1 text-[10px]">{v.number}</sup>
                     {v.text}
                   </p>
                ))}
                
                <p id="current-verse" className="text-lg text-white font-medium pl-4 border-l-4 border-bible-gold py-3 bg-gradient-to-r from-bible-gold/10 to-transparent rounded-r my-2 shadow-inner">
                   <sup className="text-bible-gold mr-1 text-xs">{reference.verse}</sup>
                   {reference.text}
                </p>

                {contextData.next.map((v) => (
                   <p key={v.number} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                     <sup className="text-bible-gold mr-1 text-[10px]">{v.number}</sup>
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
          <div className="bg-black/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-500 shadow-xl">
            <h3 className="text-purple-400 font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
              <School size={14} /> Análise Profunda
            </h3>

            {loadingHermeneutics ? (
              <div className="flex justify-center py-8 text-purple-400">
                <Loader2 className="animate-spin w-8 h-8" />
              </div>
            ) : hermeneuticsData ? (
              <div className="space-y-6">
                
                {/* Quem fala e Para quem */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <User size={16} />
                        <span className="text-xs font-bold uppercase">Quem fala?</span>
                      </div>
                      <p className="text-slate-200 text-sm">{hermeneuticsData.speaker}</p>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <Users size={16} />
                        <span className="text-xs font-bold uppercase">Para quem?</span>
                      </div>
                      <p className="text-slate-200 text-sm">{hermeneuticsData.receiver}</p>
                  </div>
                </div>

                {/* Contexto Imediato */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 text-amber-400 mb-2">
                      <MapPin size={16} />
                      <span className="text-xs font-bold uppercase">A Cena (Antes/Depois)</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{hermeneuticsData.immediateContext}</p>
                </div>

                {/* Aplicação Prática (Destaque) */}
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-5 rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <div className="flex items-center gap-2 text-purple-300 mb-3">
                      <Zap size={18} className="animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider">Aplicação para Hoje</span>
                    </div>
                    <p className="text-white italic font-serif text-lg leading-relaxed">"{hermeneuticsData.application}"</p>
                </div>

                {/* Contexto Geral (Footer) */}
                <div className="pt-4 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Contexto Geral</span>
                  <p className="text-slate-400 text-xs mt-1">{hermeneuticsData.generalContext}</p>
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
