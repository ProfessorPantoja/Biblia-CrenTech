
import React, { useState, useEffect, useRef } from 'react';
import { AppStatus, VerseReference, BibleVersion, AppTheme } from './types';
import { searchVerseByAudio, searchVerseByTheme } from './services/geminiService';
import RecorderButton from './components/RecorderButton';
import VerseDisplay from './components/VerseDisplay';
import Features from './components/Features';
import { searchBibleBooks, BibleBook } from './utils/bibleData'; // Offline Search
import { SoundEngine } from './utils/soundEngine'; // New Audio Engine
import { Book, Heart, CircleDollarSign, ChevronLeft, ChevronRight, History, X, Menu, Smile, Zap, Settings, Sparkles, Search, Copy, Check, Info, Palette, QrCode, Crown, Flame, MessageCircle, Volume2, VolumeX, Star, Mail } from 'lucide-react';

// Theme Configuration Map
const THEMES: Record<AppTheme, { 
  name: string; 
  bgClass: string; 
  textClass: string; 
  accentClass: string; 
  headerClass: string;
  cardClass: string;
  specialEffect?: string;
  icon?: React.ReactNode;
}> = {
  hitech: {
    name: 'Hi-Tech',
    bgClass: "bg-slate-900 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] text-slate-100",
    textClass: "text-slate-100",
    accentClass: "text-cyan-400",
    headerClass: "bg-slate-900/90 border-slate-800",
    cardClass: "bg-slate-800/50 border-cyan-900/50",
    icon: <Zap size={16} />
  },
  jesus: {
    name: 'Jesus',
    bgClass: "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-100 via-orange-50 to-white text-amber-950",
    textClass: "text-amber-950",
    accentClass: "text-amber-600",
    headerClass: "bg-white/80 border-amber-100 backdrop-blur-md",
    cardClass: "bg-white/60 border-amber-200/50 shadow-xl shadow-amber-500/10",
    icon: <Crown size={16} />
  },
  medieval: {
    name: 'Medieval',
    bgClass: "bg-[#d4c5a3] bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] text-slate-900 font-gothic",
    textClass: "text-slate-900",
    accentClass: "text-red-900",
    headerClass: "bg-[#bfa780]/95 border-amber-900/40 shadow-md",
    cardClass: "bg-[#eaddcf]/90 border-amber-900/30 shadow-2xl sepia-[.3]",
    icon: <Book size={16} />
  },
  kids: {
    name: 'Infantil',
    bgClass: "bg-sky-100 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] text-slate-800 font-hand",
    textClass: "text-slate-800",
    accentClass: "text-pink-500",
    headerClass: "bg-white/90 border-sky-200 shadow-sm",
    cardClass: "bg-white/80 border-sky-200 shadow-lg rounded-2xl",
    icon: <Smile size={16} />
  },
  catholic: {
    name: 'Católico',
    bgClass: "bg-stained-glass text-slate-100 bg-fixed",
    textClass: "text-slate-100",
    accentClass: "text-yellow-500",
    headerClass: "bg-slate-900/80 border-slate-700 shadow-lg backdrop-blur-md",
    cardClass: "bg-black/40 border-slate-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]",
    icon: <div className="w-4 h-4 border border-current rounded-full" />
  },
  pentecostal: {
    name: 'Fogo',
    bgClass: "bg-gradient-to-br from-orange-950 via-red-900 to-black text-white",
    textClass: "text-orange-50",
    accentClass: "text-yellow-400",
    headerClass: "bg-red-950/80 border-orange-800/50",
    cardClass: "bg-orange-900/30 border-orange-500/30 fire-border",
    icon: <Flame size={16} />
  }
};

const COMMON_THEMES = [
  "Ansiedade", "Depressão", "Medo", "Cura", "Libertação", 
  "Salvação", "Família", "Casamento", "Filhos", "Prosperidade",
  "Proteção", "Sabedoria", "Direção", "Propósito", "Milagres",
  "Fé", "Esperança", "Amor", "Perdão", "Gratidão",
  "Paz", "Alegria", "Força", "Coragem", "Vitória",
  "Jejum", "Oração", "Adoração", "Espírito Santo", "Batismo",
  "Arrependimento", "Santidade", "Humildade", "Obediência", "Serviço",
  "Dízimo", "Oferta", "Trabalho", "Descanso", "Justiça",
  "Misericórdia", "Graça", "Juízo", "Eternidade", "Céu",
  "Inferno", "Volta de Jesus", "Fim dos Tempos", "Profecia", "Revelação"
];

const App: React.FC = () => {
  // --- STATE ---
  const [showSplash, setShowSplash] = useState(true);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [history, setHistory] = useState<VerseReference[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>('ACF');
  const [appTheme, setAppTheme] = useState<AppTheme>('hitech');

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [showTicker, setShowTicker] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted to respect browser autoplay

  // Search & Autocomplete
  const [textSearch, setTextSearch] = useState('');
  const [showTextSearchInput, setShowTextSearchInput] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [suggestions, setSuggestions] = useState<BibleBook[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentTheme = THEMES[appTheme];
  const currentVerse = currentIndex >= 0 ? history[currentIndex] : null;

  // SPLASH SCREEN TIMER - 7 Seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      SoundEngine.playSuccess(); // Try to play if interacted, otherwise silent
    }, 7000); 
    return () => clearTimeout(timer);
  }, []);

  const dismissSplash = () => {
    setShowSplash(false);
    SoundEngine.playSuccess();
  };

  useEffect(() => {
    const savedData = localStorage.getItem('bible_crentech_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.history) {
           setHistory(parsed.history);
           setCurrentIndex(parsed.history.length > 0 ? parsed.history.length - 1 : -1);
        }
        if (parsed.theme) setAppTheme(parsed.theme);
        if (parsed.version) setBibleVersion(parsed.version);
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  // Donation Ticker Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setShowTicker(true);
      setTimeout(() => setShowTicker(false), 8000);
    }, 45000); 

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dataToSave = {
      history: history.slice(-50), 
      theme: appTheme,
      version: bibleVersion
    };
    localStorage.setItem('bible_crentech_data', JSON.stringify(dataToSave));
  }, [history, appTheme, bibleVersion]);

  // Handle Mute/Unmute Logic
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    SoundEngine.setMute(newMutedState);
    if (!newMutedState) {
        // User interacted, we can start audio
        SoundEngine.playClick();
        SoundEngine.startAmbient();
    }
  };

  useEffect(() => {
    if (showTextSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showTextSearchInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTextSearch(val);
    SoundEngine.playHover(); // Subtle sound on type
    
    if (val.length > 1) {
      const results = searchBibleBooks(val);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (bookName: string) => {
    setTextSearch(bookName + " ");
    setSuggestions([]);
    SoundEngine.playClick();
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const toggleSearch = () => {
    SoundEngine.playClick();
    setShowTextSearchInput(prev => !prev);
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    SoundEngine.playClick();
    setAppTheme(newTheme);
    setIsThemeOpen(false);
    // Removed forced version switching to respect user choice as requested
  };

  const handleRecordingComplete = async (base64Audio: string) => {
    SoundEngine.playPing();
    setStatus(AppStatus.PROCESSING);
    try {
      const verses = await searchVerseByAudio(base64Audio, bibleVersion);
      updateHistory(verses);
      setStatus(AppStatus.SUCCESS);
      SoundEngine.playSuccess();
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      SoundEngine.playError();
      setTimeout(() => setStatus(AppStatus.IDLE), 3000);
    }
  };

  const handleTextSearch = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    if (!textSearch.trim()) return;
    setSuggestions([]);
    setShowTextSearchInput(false); 
    SoundEngine.playClick();
    
    setStatus(AppStatus.PROCESSING);
    try {
      const verses = await searchVerseByTheme(textSearch, bibleVersion);
      updateHistory(verses);
      setStatus(AppStatus.SUCCESS);
      SoundEngine.playSuccess();
      setTextSearch('');
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      SoundEngine.playError();
      setTimeout(() => setStatus(AppStatus.IDLE), 3000);
    }
  };

  const handleThemeSearch = async (theme: string) => {
    SoundEngine.playClick();
    setStatus(AppStatus.PROCESSING);
    try {
      const verses = await searchVerseByTheme(theme, bibleVersion);
      updateHistory(verses);
      setStatus(AppStatus.SUCCESS);
      SoundEngine.playSuccess();
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      SoundEngine.playError();
      setTimeout(() => setStatus(AppStatus.IDLE), 3000);
    }
  };

  const updateHistory = (verses: VerseReference[]) => {
    setHistory(prev => {
      const newHistory = [...prev, ...verses];
      setCurrentIndex(newHistory.length - verses.length); 
      return newHistory;
    });
  };

  const navigateHistory = (direction: 'prev' | 'next') => {
    SoundEngine.playClick();
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCopyAll = () => {
    SoundEngine.playClick();
    if (history.length === 0) return;
    const allText = history.map(v => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`).join('\n\n');
    const header = `*Histórico de Pesquisa - Bíblia CrenTech (${bibleVersion})*\n\n`;
    navigator.clipboard.writeText(header + allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleFeedback = () => {
    window.location.href = "mailto:suporte@crentech.com.br?subject=Sugestão Bíblia CrenTech";
    SoundEngine.playClick();
  };

  if (showSplash) {
    return (
      <div 
        onClick={dismissSplash}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${currentTheme.bgClass} animate-out fade-out duration-1000 fill-mode-forwards cursor-pointer`}
      >
        <div className="animate-in zoom-in duration-1000 flex flex-col items-center">
            <div className={`w-32 h-32 mb-6 rounded-3xl flex items-center justify-center shadow-2xl ${currentTheme.headerClass}`}>
               <img src="/logo.png" alt="Logo CrenTech" className="w-24 h-24 object-contain" onError={(e) => {e.currentTarget.style.display='none'; e.currentTarget.parentElement?.classList.add('border-2');}} />
            </div>
            <h1 className="text-4xl font-bold font-serif mb-2 tracking-wide text-center">Bíblia CrenTech</h1>
            <p className="text-sm opacity-70 uppercase tracking-[0.2em] animate-pulse">Tecnologia para o Reino</p>
            <p className="text-xs opacity-50 mt-8">Toque para iniciar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 ease-in-out ${currentTheme.bgClass}`}>
      
      {/* DONATE MODAL */}
      {isDonateOpen && (
        <div onClick={() => setIsDonateOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div onClick={(e) => e.stopPropagation()} className={`${currentTheme.headerClass} w-full max-w-md p-6 rounded-2xl border relative text-center`}>
            <button onClick={() => setIsDonateOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X /></button>
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
      )}

      {/* ABOUT MODAL */}
      {isAboutOpen && (
        <div onClick={() => setIsAboutOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div onClick={(e) => e.stopPropagation()} className={`${currentTheme.headerClass} w-full max-w-2xl p-6 rounded-2xl border relative max-h-[80vh] overflow-y-auto custom-scrollbar`}>
            <button onClick={() => setIsAboutOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X /></button>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Sobre o Projeto</h2>
            
            <div className={`space-y-4 ${currentTheme.textClass}`}>
              <p>
                <strong>A Origem:</strong> Este aplicativo nasceu de um projeto pessoal. Eu sentia necessidade de encontrar versículos rapidamente durante meus estudos e pregações. Percebi que a tecnologia de IA que Deus permitiu chegar até mim poderia abençoar a vida de muitas outras pessoas.
              </p>
              <div className="bg-black/10 p-4 rounded-lg mt-4">
                <h3 className="font-bold mb-2 flex items-center gap-2"><Info size={16}/> Como Usar</h3>
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
      )}

      {/* THEME MODAL */}
      {isThemeOpen && (
        <div onClick={() => setIsThemeOpen(false)} className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <div onClick={(e) => e.stopPropagation()} className={`${currentTheme.headerClass} w-full max-w-lg p-6 rounded-t-3xl md:rounded-2xl shadow-2xl relative border`}>
             <button onClick={() => setIsThemeOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X /></button>
             <h2 className={`text-lg font-bold mb-6 ${currentTheme.accentClass} flex items-center gap-2`}><Palette size={18}/> Atmosfera</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.keys(THEMES) as AppTheme[]).map((t) => (
                  <button 
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-3 ${appTheme === t ? 'scale-105 shadow-lg ring-2' : 'opacity-80'}`}
                    style={{ backgroundColor: t === 'pentecostal' ? '#431407' : t === 'catholic' ? '#000' : '' }}
                  >
                    {THEMES[t].icon}
                    {THEMES[t].name}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`w-full py-4 px-4 md:px-6 flex justify-between items-center border-b backdrop-blur-md z-30 gap-2 transition-all duration-500 ${currentTheme.headerClass}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsAboutOpen(true)}>
          <div className={`w-10 h-10 p-1 rounded-xl border border-current transition-all group-hover:rotate-12 ${currentTheme.accentClass} flex items-center justify-center bg-black/10 overflow-hidden`}>
             <img src="/logo.png" alt="CrenTech" className="w-full h-full object-contain" onError={(e) => {e.currentTarget.style.display='none'}} />
             <div className="logo-fallback hidden">📖</div>
          </div>
          
          <div className="flex flex-col">
            <h1 className={`text-xl md:text-2xl font-serif font-bold tracking-tight leading-none ${currentTheme.textClass}`}>
              Bíblia CrenTech
            </h1>
            <span className={`text-[10px] md:text-xs font-sans opacity-70 uppercase tracking-wider ${currentTheme.textClass} mt-0.5`}>
              Consulta Rápida com IA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
           {/* BIBLE VERSION SELECTOR */}
           <select 
             value={bibleVersion} 
             onChange={(e) => {
                 setBibleVersion(e.target.value as BibleVersion);
                 SoundEngine.playClick();
             }}
             className={`bg-transparent text-xs font-bold border border-current rounded px-1 py-1 ${currentTheme.textClass} opacity-80 hover:opacity-100 cursor-pointer`}
           >
             <option value="ACF" className="text-black">ACF</option>
             <option value="NVI" className="text-black">NVI</option>
             <option value="ARC" className="text-black">ARC</option>
             <option value="NBV" className="text-black">NBV</option>
             <option value="NTLH" className="text-black">NTLH</option>
             <option value="BAM" className="text-black">Católica</option>
             <option value="TNM" className="text-black">TNM</option>
           </select>

           <button onClick={toggleSearch} className="p-2 hover:bg-black/10 rounded-full transition-colors"><Search size={22} className={currentTheme.textClass} /></button>
           <button onClick={() => setIsDonateOpen(true)} className="p-2 hover:scale-110 transition-transform hidden md:block" title="Doar"><CircleDollarSign className={currentTheme.textClass} size={22} /></button>
           <button onClick={() => setIsThemeOpen(true)} className="p-2 hover:scale-110 transition-transform" title="Temas"><Palette className={currentTheme.textClass} size={22} /></button>
        </div>
      </header>

      {/* NAV BAR */}
      {history.length > 0 && (
        <div className={`w-full py-3 px-4 z-20 flex items-center justify-center gap-4 backdrop-blur-md border-b animate-in slide-in-from-top ${currentTheme.headerClass}`}>
          <button onClick={() => navigateHistory('prev')} disabled={currentIndex <= 0} className={currentTheme.textClass}><ChevronLeft /></button>
          <input type="range" min="0" max={history.length - 1} value={currentIndex} onChange={(e) => setCurrentIndex(Number(e.target.value))} className="w-full max-w-xs accent-current" />
          <button onClick={() => navigateHistory('next')} disabled={currentIndex >= history.length - 1} className={currentTheme.textClass}><ChevronRight /></button>
          <button onClick={handleCopyAll} className={currentTheme.textClass}>{copiedAll ? <Check /> : <Copy />}</button>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      {showTextSearchInput && (
        <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" onClick={() => setShowTextSearchInput(false)}></div>
      )}

      {/* SEARCH INPUT */}
      <div className={`w-full px-4 overflow-visible transition-all duration-300 ease-in-out absolute top-[70px] left-0 right-0 z-50 ${showTextSearchInput ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="max-w-xl mx-auto relative shadow-2xl">
            <input 
                id="search-input"
                ref={searchInputRef}
                type="text" 
                value={textSearch}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSearch(null)}
                autoComplete="off"
                placeholder="Busca rápida... (ex: 'Ap 1')"
                className={`w-full pl-5 pr-12 py-4 rounded-xl border shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all ${currentTheme.cardClass} ${currentTheme.textClass}`}
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                {suggestions.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleSuggestionClick(s.name)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-800 text-slate-200 border-b border-slate-800/50 flex justify-between items-center group"
                  >
                    <span className="font-bold">{s.name}</span>
                    <span className="text-xs text-slate-500 uppercase group-hover:text-bible-gold transition-colors">{s.chapters} Caps.</span>
                  </button>
                ))}
              </div>
            )}
            <button 
                onClick={() => handleTextSearch(null)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-bible-accent text-white"
            >
                <Search size={20} />
            </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center p-6 relative w-full max-w-4xl mx-auto mb-32 pt-8">
        {status === AppStatus.IDLE && history.length === 0 && (
          <div className="w-full text-center mt-4 animate-in fade-in zoom-in duration-700 flex flex-col items-center max-w-lg mx-auto">
             <h2 className={`text-2xl font-serif font-bold ${currentTheme.textClass} mb-6 tracking-widest uppercase`}>Temas Frequentes</h2>
             
             {/* MAIN CATEGORIES */}
             <div className="flex flex-wrap justify-center gap-3 mb-8">
               <button onClick={() => handleThemeSearch("Amor")} className={`${currentTheme.cardClass} px-6 py-2 rounded-full border ${currentTheme.textClass} hover:scale-105 transition-transform`}>❤️ Amor</button>
               <button onClick={() => handleThemeSearch("Fé")} className={`${currentTheme.cardClass} px-6 py-2 rounded-full border ${currentTheme.textClass} hover:scale-105 transition-transform`}>🙏 Fé</button>
               <button onClick={() => handleThemeSearch("Paz")} className={`${currentTheme.cardClass} px-6 py-2 rounded-full border ${currentTheme.textClass} hover:scale-105 transition-transform`}>🕊️ Paz</button>
             </div>

             {/* CLOUD TAGS */}
             <div className="w-full flex flex-wrap justify-center gap-2.5 px-2">
                  {COMMON_THEMES.slice(0, 30).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleThemeSearch(theme)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-md ${currentTheme.textClass} border-current/20 hover:bg-current/10`}
                    >
                      {theme}
                    </button>
                  ))}
                  <button onClick={() => setIsThemeOpen(true)} className="text-xs italic opacity-60 px-3 py-1.5">+ mais temas</button>
             </div>
          </div>
        )}

        <VerseDisplay 
            data={currentVerse} 
            textColorClass={currentTheme.textClass}
            accentColorClass={currentTheme.accentClass}
        />
          
        {currentVerse && status === AppStatus.SUCCESS && (
            <Features key={currentVerse.text} reference={currentVerse} version={bibleVersion} />
        )}

        {/* RECORDER BUTTON with THEME PROP */}
        <div className="fixed bottom-10 left-0 right-0 flex flex-col items-center justify-end z-40 pointer-events-none gap-4">
          <div className="pointer-events-auto filter drop-shadow-2xl">
            <RecorderButton 
              onRecordingComplete={handleRecordingComplete}
              isProcessing={status === AppStatus.PROCESSING}
              theme={appTheme}
            />
          </div>
        </div>
      </main>

      {/* DONATION TICKER */}
      <div className={`fixed bottom-16 left-0 right-0 z-50 pointer-events-none transition-all duration-700 flex justify-center ${showTicker ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className={`mx-4 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-xl border ${currentTheme.headerClass}`}>
           <Heart size={16} className="text-red-500 fill-current animate-pulse" />
           <p className={`text-xs font-medium ${currentTheme.textClass}`}>
             Este projeto é mantido por fé. <button onClick={() => {setIsDonateOpen(true); setShowTicker(false)}} className="underline font-bold pointer-events-auto hover:text-green-500">Ajude o Canal CrenTech.</button>
           </p>
           <button onClick={() => setShowTicker(false)} className="pointer-events-auto opacity-50 hover:opacity-100"><X size={14}/></button>
        </div>
      </div>

      {/* FOOTER */}
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

    </div>
  );
};

export default App;
