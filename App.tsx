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
  const [splashPhase, setSplashPhase] = useState(0); // 0: Start, 1: Pulse/Text, 2: Exit

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

  // Splash Animation Sequence
  useEffect(() => {
    if (currentView === 'splash') {
      // Phase 1: Reveal Text (0.5s)
      setTimeout(() => setSplashPhase(1), 500);

      // Phase 2: Auto Dismiss (2.5s total)
      const timer = setTimeout(() => {
        setSplashPhase(2);
        setTimeout(() => {
          setCurrentView('home');
          SoundEngine.playSuccess();
        }, 500); // Wait for exit animation
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [currentView]);

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
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#450a0a] transition-opacity duration-500 ${splashPhase === 2 ? 'opacity-0' : 'opacity-100'}`}>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Container with Pulse */}
          <div className={`w-32 h-32 mb-6 rounded-3xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-slate-900 to-black border border-amber-500/30 transition-all duration-1000 ${splashPhase >= 1 ? 'scale-110 shadow-amber-500/40' : 'scale-50 opacity-0'}`}>
            <img src="/icons/android-launchericon-512-512.png" alt="Logo CrenTech" className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </div>

          {/* Text Reveal */}
          <div className={`text-center transition-all duration-1000 delay-300 ${splashPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl font-bold font-serif mb-2 tracking-wide text-white drop-shadow-lg">Bíblia CrenTech</h1>
            <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-3"></div>
            <p className="text-sm text-amber-400 font-medium uppercase tracking-[0.3em] animate-pulse">IA A SERVIÇO DO REINO</p>
          </div>
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
          setAppTheme={setAppTheme}
          onNavigate={handleNavigate}
          isInstallable={isInstallable}
          installPWA={installPWA}
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
