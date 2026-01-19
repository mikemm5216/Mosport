import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './Button';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginAs: (role: UserRole) => void;
}

export const AuthModal = ({ isOpen, onClose, onLoginAs }: AuthModalProps) => {
    const [view, setView] = useState<UserRole>(UserRole.FAN);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (view === UserRole.STAFF) {
            if (email === 'Mosport001' && pass === 'Mosport001') {
                onLoginAs(UserRole.STAFF);
            } else {
                setError('Invalid Staff Credentials. Try Mosport001.');
            }
            return;
        }
        onLoginAs(view);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-mosport-card border border-gray-800 rounded-2xl p-8 shadow-2xl animate-fadeIn">
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="text-3xl font-black italic tracking-tighter text-mosport-fan">MS</span>
                        <span className="text-xl font-bold text-white">MOSPORT</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                        {view === UserRole.FAN ? 'Welcome, Fan' : view === UserRole.VENUE ? 'Partner Login' : 'Staff Portal'}
                    </h2>
                </div>

                <div className="flex p-1 bg-gray-900 rounded-lg mb-6">
                    {[UserRole.FAN, UserRole.VENUE, UserRole.STAFF].map(role => (
                        <button
                            key={role}
                            onClick={() => { setView(role); setError(''); setEmail(''); setPass(''); }}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${view === role ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && <div className="text-xs text-red-500 font-bold bg-red-900/10 p-2 rounded text-center border border-red-900/30">{error}</div>}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            {view === UserRole.STAFF ? 'Agent ID' : 'Email Address'}
                        </label>
                        <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder={view === UserRole.STAFF ? "Enter Agent ID" : "name@example.com"}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                        <input
                            type="password"
                            required
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        className="mb-3"
                    >
                        {view === UserRole.STAFF ? 'Access Portal' : 'Sign In'}
                    </Button>

                    {(view === UserRole.FAN || view === UserRole.VENUE) && (
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => onLoginAs(view)}
                            className="bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-white"
                        >
                            Skip (Guest Mode)
                        </Button>
                    )}

                    {view === UserRole.FAN && (
                        <div className="space-y-3 pt-4 border-t border-gray-800">
                            <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">Or continue with</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className="flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                    Google
                                </button>
                                <button type="button" className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2 rounded-lg font-bold text-sm hover:bg-[#166FE5] transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
