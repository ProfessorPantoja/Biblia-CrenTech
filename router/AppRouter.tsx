import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useApp } from '../contexts/AppContext';
import { THEMES } from '../config/constants';
import HomeScreen from '../components/HomeScreen';
import SearchMode from '../components/SearchMode';
import ReaderMode from '../components/ReaderMode';

const AppRouter: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { appTheme } = useApp();
    const currentTheme = THEMES[appTheme];

    return (
        <>
            {currentView === 'home' && <HomeScreen />}

            {currentView === 'search' && (
                <div className="relative">
                    {/* Back Button for Search Mode */}
                    <button
                        onClick={() => navigate('home')}
                        className="fixed top-4 left-4 z-[60] p-2 rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:bg-black/40 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>

                    <SearchMode />
                </div>
            )}

            {currentView === 'reader' && <ReaderMode />}

            {/* Placeholders for other views */}
            {(currentView === 'history' || currentView === 'quiz') && (
                <div className={`min-h-screen flex items-center justify-center ${currentTheme.bgClass} text-white`}>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Em Construção 🚧</h2>
                        <p className="opacity-70 mb-6">Esta funcionalidade está sendo implementada.</p>
                        <button
                            onClick={() => navigate('home')}
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

export default AppRouter;
