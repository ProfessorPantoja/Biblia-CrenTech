import React, { useState, useEffect } from 'react';
import { VerseReference, BibleVersion, AppTheme } from './types';
import { SoundEngine } from './utils/soundEngine';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useWakeLock } from './hooks/useWakeLock';
import { THEMES } from './config/constants';

// Views
import SearchMode from './components/SearchMode';
import HomeScreen from './components/HomeScreen';
import ReaderMode from './components/ReaderMode';

// Types for Navigation
type AppView = 'splash' | 'home' | 'search' | 'reader' | 'history' | 'quiz';

const App: React.FC = () => {
  // --- GLOBAL STATE ---
  const [currentView, setCurrentView] = useState<AppView>('splash');

  const [bibleVersion, setBibleVersion] = useState<BibleVersion>('ACF');
  const [appTheme, setAppTheme] = useState<AppTheme>('hitech');
  const [history, setHistory] = useState<VerseReference[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isMuted, setIsMuted] = useState(true);

  const { isInstallable, install: installPWA } = usePWAInstall();
  useWakeLock();

  const currentTheme = THEMES[appTheme];

  // Load Data
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

  // Save Data
  useEffect(() => {
    const dataToSave = {
      history: history.slice(-50),
      theme: appTheme,
      version: bibleVersion
    };
    localStorage.setItem('bible_crentech_data', JSON.stringify(dataToSave));
  }, [history, appTheme, bibleVersion]);

  // Splash Timer
  useEffect(() => {
    if (currentView === 'splash') {
      const timer = setTimeout(() => {
        setCurrentView('home'); // Go to Home after splash
        SoundEngine.playSuccess();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const dismissSplash = () => {
    setCurrentView('home'); // Go to Home on click
    SoundEngine.playSuccess();
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    SoundEngine.setMute(newMutedState);
    if (!newMutedState) {
      SoundEngine.playClick();
      SoundEngine.startAmbient();
    }
  };

  // Navigation Handler
  const handleNavigate = (view: AppView) => {
    SoundEngine.playClick();
    setCurrentView(view);
  };

  // --- RENDER ---

  if (currentView === 'splash') {
    return (
      <div
        onClick={dismissSplash}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${currentTheme.bgClass} animate-out fade-out duration-1000 fill-mode-forwards cursor-pointer`}
      >
        <div className="animate-in zoom-in duration-1000 flex flex-col items-center">
          <div className={`w-32 h-32 mb-6 rounded-3xl flex items-center justify-center shadow-2xl ${currentTheme.headerClass}`}>
            <img src="/icons/android-launchericon-512-512.png" alt="Logo CrenTech" className="w-24 h-24 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('border-2'); }} />
          </div>
          <h1 className="text-4xl font-bold font-serif mb-2 tracking-wide text-center">Bíblia CrenTech</h1>
          <p className="text-sm opacity-70 uppercase tracking-[0.2em] animate-pulse">IA A SERVIÇO DO REINO</p>

          {isInstallable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                installPWA();
              }}
              className="mt-8 px-6 py-3 bg-bible-gold text-bible-dark font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 animate-bounce"
            >
              <span className="text-xl">📲</span> Instalar App
            </button>
          )}

          <p className="text-xs opacity-50 mt-8">Toque para iniciar</p>
        </div>
      </div>
    );
  }

  // Router Logic
  return (
    <>
      {currentView === 'home' && (
        <HomeScreen
          appTheme={appTheme}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'search' && (
        <div className="relative">
          {/* Back Button for Search Mode */}
          <button
            onClick={() => handleNavigate('home')}
            className="fixed top-4 left-4 z-[60] p-2 rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:bg-black/40 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>

          <SearchMode
            bibleVersion={bibleVersion}
            setBibleVersion={setBibleVersion}
            appTheme={appTheme}
            setAppTheme={setAppTheme}
            currentTheme={currentTheme}
            history={history}
            setHistory={setHistory}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            isMuted={isMuted}
            toggleMute={toggleMute}
          />
        </div>
      )}

      {currentView === 'reader' && (
        <ReaderMode
          appTheme={appTheme}
          bibleVersion={bibleVersion}
          onNavigate={handleNavigate}
        />
      )}

      {/* Placeholders for other views */}
      {(currentView === 'history' || currentView === 'quiz') && (
        <div className={`min-h-screen flex items-center justify-center ${currentTheme.bgClass} text-white`}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Em Construção 🚧</h2>
            <p className="opacity-70 mb-6">Esta funcionalidade está sendo implementada.</p>
            <button
              onClick={() => handleNavigate('home')}
              className="px-6 py-2 bg-amber-500 text-black font-bold rounded-full"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
