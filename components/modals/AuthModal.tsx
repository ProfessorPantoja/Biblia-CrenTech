import React, { useState } from 'react';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const { user, loading, signInWithGoogle, signOut } = useAuth();
    const [busy, setBusy] = useState(false);

    const handleLogin = async () => {
        setBusy(true);
        try {
            await signInWithGoogle();
            // Redireciona para o Google; o retorno é tratado pelo AuthContext.
        } catch {
            setBusy(false);
        }
    };

    const handleLogout = async () => {
        setBusy(true);
        await signOut();
        setBusy(false);
        onClose();
    };

    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Usuário';
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    return (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <X size={18} />
                </button>

                {user ? (
                    // --- LOGADO: perfil ---
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full border-2 border-amber-400/80 p-1 shadow-lg shadow-amber-500/20 mb-4">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-2xl">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-white">{name}</h2>
                        {user.email && <p className="text-sm text-slate-400 mb-6">{user.email}</p>}
                        <button
                            onClick={handleLogout}
                            disabled={busy}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors disabled:opacity-50"
                        >
                            <LogOut size={18} /> Sair da conta
                        </button>
                    </div>
                ) : (
                    // --- DESLOGADO: entrar ---
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-3">📖</div>
                        <h2 className="text-xl font-bold text-white mb-2">Entrar na Bíblia CrenTech</h2>
                        <p className="text-sm text-slate-400 mb-6">
                            Entre com sua conta Google para salvar seus favoritos, histórico e preferências, e acessá-los em qualquer aparelho.
                        </p>
                        <button
                            onClick={handleLogin}
                            disabled={busy || loading}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors disabled:opacity-60"
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
                                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18z" />
                                <path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34z" />
                                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
                            </svg>
                            {busy ? 'Conectando...' : 'Entrar com Google'}
                        </button>
                        <button onClick={onClose} className="mt-3 text-xs text-slate-500 hover:text-slate-300">
                            Continuar sem entrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
