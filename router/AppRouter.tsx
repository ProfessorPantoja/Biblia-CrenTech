import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import HomeScreen from '../components/HomeScreen';
import SearchMode from '../components/SearchMode';
import ReaderMode from '../components/ReaderMode';
import HistoryScreen from '../components/HistoryScreen';
import QuizScreen from '../components/QuizScreen';

const AppRouter: React.FC = () => {
    const { currentView, navigate } = useNavigation();

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

            {currentView === 'history' && <HistoryScreen />}

            {currentView === 'quiz' && <QuizScreen />}
        </>
    );
};

export default AppRouter;
