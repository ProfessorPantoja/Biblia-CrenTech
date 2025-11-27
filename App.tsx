import React, { useState, useEffect, useRef } from 'react';
import { AppStatus, VerseReference, BibleVersion } from './types';
import { searchVerseByAudio, searchVerseByTheme } from './services/geminiService';
import RecorderButton from './components/RecorderButton';
import VerseDisplay from './components/VerseDisplay';
import Features from './components/Features';
import { Book, Heart, CircleDollarSign, ChevronLeft, ChevronRight, History, X, Menu, Smile, Zap, Settings, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [history, setHistory] = useState<VerseReference[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>('NVI');

  const currentVerse = currentIndex >= 0 ? history[currentIndex] : null;

  const handleRecordingComplete = async (base64Audio: string) => {
    setStatus(AppStatus.PROCESSING);
    try {
      const verses = await searchVerseByAudio(base64Audio, bibleVersion);
      
      setHistory(prev => {
        const newHistory = [...prev, ...verses];
        // Move index to the start of the newly added batch
        setCurrentIndex(newHistory.length - verses.length);
        return newHistory;
      });
      
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setTimeout(() => setStatus(AppStatus.IDLE), 3000);
    }
  };

  const handleThemeSearch = async (theme: string) => {
    setStatus(AppStatus.PROCESSING);
    try {
      const verses = await searchVerseByTheme(theme, bibleVersion);
      setHistory(prev => {
        const newHistory = [...prev, ...verses];
        setCurrentIndex(newHistory.length - verses.length);
        return newHistory;
      });
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setTimeout(() => setStatus(AppStatus.IDLE), 3000);
    }
  };

  const navigateHistory = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(Number(e.target.value));
  };

  return (
    <div className="min-h-screen flex flex-col bg-bible-dark bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      
      {/* History Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-80 bg-slate-900 border-l border-slate-700 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
              <h2 className="text-bible-gold font-serif text-lg font-bold flex items-center gap-2">
                <History size={20} /> Histórico
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
              {history.length === 0 ? (
                <p className="text-slate-500 text-center mt-10">Nenhum versículo ainda.</p>
              ) : (
                history.map((verse, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all border ${
                      idx === currentIndex 
                        ? 'bg-bible-gold/20 border-bible-gold/50 text-bible-gold' 
                        : 'bg-slate-800/50 border-transparent hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </span>
                    <p className="text-sm truncate font-serif mt-1 opacity-90">"{verse.text}"</p>
                  </button>
                ))
              )}
            </div>
            {/* Drawer Footer Credit */}
            <div className="p-4 border-t border-slate-800 text-center">
               <p className="text-[10px] text-slate-600">Bíblia CrenTech © 2025</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full py-3 px-4 md:px-6 flex justify-between items-center bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 z-30 gap-2">
        <div className="flex items-center gap-2">
          <Book className="text-bible-gold" size={24} />
          <h1 className="text-xl font-serif font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <span>Bíblia <span className="text-bible-gold">CrenTech</span></span>
            <span className="hidden sm:inline-flex items-center justify-center bg-bible-gold/10 border border-bible-gold/30 text-bible-gold text-[9px] px-1.5 py-0.5 rounded font-sans font-bold tracking-tighter">AI</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Version Selector */}
          <div className="relative">
            <select
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value as BibleVersion)}
              className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-xs md:text-sm font-medium py-1.5 pl-3 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-bible-gold cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <option value="NVI">NVI (Inter)</option>
              <option value="ARC">ARC (Almeida)</option>
              <option value="NBV">NBV (Viva)</option>
              <option value="NTLH">NTLH (Hoje)</option>
              <option value="BAM">Ave Maria</option>
              <option value="TNM">Novo Mundo</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2 rounded-full hover:bg-slate-800 transition-colors group"
          >
            <History className="text-slate-400 group-hover:text-bible-gold transition-colors" size={24} />
            {history.length > 0 && (
              <span className="absolute top-0 right-0 bg-bible-gold text-bible-dark text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Navigation Control Bar (Fixed Top Position) */}
      {history.length > 0 && (
        <div className="w-full bg-slate-900/60 border-b border-slate-800 py-3 px-4 z-20 flex items-center justify-center gap-4 backdrop-blur-sm animate-in slide-in-from-top duration-500">
          
          <button 
            onClick={() => navigateHistory('prev')}
            disabled={currentIndex <= 0}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex-1 max-w-md flex flex-col items-center relative group">
            <input
              type="range"
              min="0"
              max={history.length - 1}
              value={currentIndex}
              onChange={handleSliderChange}
              className="w-full z-10 relative"
            />
            {/* Progress Indicator Text */}
            <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase tracking-widest text-bible-gold font-bold">
              Versículo {currentIndex + 1} de {history.length}
            </div>
          </div>

          <button 
            onClick={() => navigateHistory('next')}
            disabled={currentIndex >= history.length - 1}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6 relative w-full max-w-4xl mx-auto">
        
        {/* Initial State / Quick Actions */}
        {status === AppStatus.IDLE && history.length === 0 && (
          <div className="w-full text-center mb-8 animate-in fade-in duration-700 flex flex-col items-center">
            
            <div className="mb-8 flex flex-col items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[10px] md:text-xs font-bold border border-blue-500/20 uppercase tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    <Sparkles size={12} className="text-blue-400" />
                    Potencializado por Inteligência Artificial
                </span>
                <p className="text-slate-400 font-light text-sm">
                  Usando versão: <span className="text-bible-gold font-bold">{bibleVersion}</span>
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => handleThemeSearch('Amor de Deus')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm text-pink-400 border border-pink-500/20 flex items-center gap-2 transition-all">
                <Heart size={14} /> Amor
              </button>
              <button onClick={() => handleThemeSearch('Sabedoria e Direção')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm text-blue-400 border border-blue-500/20 flex items-center gap-2 transition-all">
                <Book size={14} /> Sabedoria
              </button>
              <button onClick={() => handleThemeSearch('Paz e Ansiedade')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm text-emerald-400 border border-emerald-500/20 flex items-center gap-2 transition-all">
                <Smile size={14} /> Paz
              </button>
              <button onClick={() => handleThemeSearch('Prosperidade')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm text-yellow-400 border border-yellow-500/20 flex items-center gap-2 transition-all">
                <CircleDollarSign size={14} /> Prosperidade
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 w-full flex flex-col justify-center items-center min-h-[400px]">
          {status === AppStatus.ERROR && (
            <div className="text-red-400 bg-red-900/20 px-6 py-4 rounded-lg border border-red-900/50 mb-8 animate-in shake">
              Não foi possível encontrar o versículo. Tente novamente.
            </div>
          )}

          <VerseDisplay data={currentVerse} />
          
          {currentVerse && status === AppStatus.SUCCESS && (
            <Features key={currentVerse.text} reference={currentVerse} />
          )}
        </div>

        {/* Fixed Bottom Recorder */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <RecorderButton 
              onRecordingComplete={handleRecordingComplete}
              isProcessing={status === AppStatus.PROCESSING}
            />
          </div>
        </div>
      </main>

      {/* Developer Footer Credits */}
      <div className="fixed bottom-1 left-0 right-0 w-full text-center z-0 pointer-events-none pb-1">
        <p className="text-[10px] text-slate-500/60 font-medium tracking-wide">
          Desenvolvido por Fabio Pantoja - canal CrenTech
        </p>
      </div>

    </div>
  );
};

export default App;