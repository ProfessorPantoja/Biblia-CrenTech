import React from 'react';

interface SplashScreenProps {
    splashPhase: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ splashPhase }) => {
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
};

export default SplashScreen;
