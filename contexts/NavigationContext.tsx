import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppView } from '../types';
import { SoundEngine } from '../utils/soundEngine';

interface NavigationContextType {
    currentView: AppView;
    navigate: (view: AppView) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<AppView>('splash');

    const navigate = (view: AppView) => {
        SoundEngine.playClick();
        setCurrentView(view);
    };

    return (
        <NavigationContext.Provider value={{ currentView, navigate }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
