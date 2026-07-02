import React, { useState, useEffect } from 'react';
import { SoundEngine } from './utils/soundEngine';
import { useWakeLock } from './hooks/useWakeLock';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';

// Components
import SplashScreen from './components/SplashScreen';
import AppRouter from './router/AppRouter';

const AppContent: React.FC = () => {
  const { currentView, finishSplash } = useNavigation();
  const [splashPhase, setSplashPhase] = useState(0); // 0: Start, 1: Pulse/Text, 2: Exit

  useWakeLock();

  // Splash Animation Sequence
  useEffect(() => {
    if (currentView === 'splash') {
      // Phase 1: Reveal Text (0.5s)
      setTimeout(() => setSplashPhase(1), 500);

      // Phase 2: Auto Dismiss (IMMEDIATE)
      const timer = setTimeout(() => {
        setSplashPhase(2);
        setTimeout(() => {
          finishSplash(); // Respeita deep link (#/leitor/João/3) ou vai para a home
          SoundEngine.playSuccess();
        }, 100); // Short exit animation
      }, 100); // Minimal delay

      return () => clearTimeout(timer);
    }
  }, [currentView, finishSplash]);

  // --- RENDER ---

  if (currentView === 'splash') {
    return <SplashScreen splashPhase={splashPhase} />;
  }

  // Router Logic
  return <AppRouter />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
