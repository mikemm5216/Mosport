import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './Button';
import { generateOAuthUrl } from '../config/oauth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginAs: (role: UserRole) => void;
}

export const AuthModal = ({ isOpen, onClose, onLoginAs }: AuthModalProps) => {
    const [view, setView] = useState<UserRole>(UserRole.FAN);
    const [staffToken, setStaffToken] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleStaffLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (staffToken === 'Mosport001') {
            onLoginAs(UserRole.STAFF);
        } else {
            setError('Invalid Staff Token. Try Mosport001.');
        }
    };

    const handleOAuthLogin = (provider: 'google' | 'facebook' | 'zalo' | 'instagram') => {
        // 暫時保持 Instagram 使用舊流程（因為沒有獨立 OAuth）
        if (provider === 'instagram') {
            console.log('Instagram login via Facebook OAuth');
            onLoginAs(view);
            return;
        }

        // 產生 OAuth URL 並跳轉
        const oauthUrl = generateOAuthUrl(provider, `${provider}_${view}_${Date.now()}`);

        if (oauthUrl === '#') {
            setError(`Missing ${provider} credentials. Please check .env file.`);
            return;
        }

        // 將當前角色存到 sessionStorage，callback 時會用到
        sessionStorage.setItem('mosport_pending_role', view);

        // 跳轉到 OAuth 授權頁面
        window.location.href = oauthUrl;
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
                    <p className="text-sm text-gray-400">
                        {view === UserRole.FAN ? 'Connect your social account to personalize your sports map' :
                            view === UserRole.VENUE ? 'Claim your venue and manage events' :
                                'Internal access only'}
                    </p>
                </div>

                <div className="flex p-1 bg-gray-900 rounded-lg mb-6">
                    {[UserRole.FAN, UserRole.VENUE, UserRole.STAFF].map(role => (
                        <button
                            key={role}
                            onClick={() => { setView(role); setError(''); setStaffToken(''); }}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${view === role ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                {error && <div className="text-xs text-red-500 font-bold bg-red-900/10 p-2 rounded text-center border border-red-900/30 mb-4">{error}</div>}

                {view === UserRole.STAFF ? (
                    // STAFF: Special Token Login
                    <form onSubmit={handleStaffLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Staff Access Token</label>
                            <input
                                type="password"
                                required
                                value={staffToken}
                                onChange={(e) => setStaffToken(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-mosport-staff focus:outline-none focus:ring-1 focus:ring-mosport-staff"
                                placeholder="Enter your staff token"
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            className="bg-mosport-staff text-black hover:bg-white"
                        >
                            Access Portal
                        </Button>
                    </form>
                ) : (
                    // FAN/VENUE: OAuth Flow
                    <div className="space-y-4">
                        <div className="space-y-3">
                            {/* Google OAuth */}
                            <button
                                type="button"
                                onClick={() => handleOAuthLogin('google')}
                                className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors shadow-md"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </button>

                            {/* Facebook OAuth */}
                            <button
                                type="button"
                                onClick={() => handleOAuthLogin('facebook')}
                                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#166FE5] transition-colors shadow-md"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Continue with Facebook
                            </button>

                            {/* Instagram OAuth - Recommended */}
                            <button
                                type="button"
                                onClick={() => handleOAuthLogin('instagram')}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#833AB4] text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-md relative"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                Log in with Instagram
                                <span className="absolute -top-2 -right-2 bg-mosport-venue text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                            </button>

                            {/* Zalo OAuth */}
                            <button
                                type="button"
                                onClick={() => handleOAuthLogin('zalo')}
                                className="w-full flex items-center justify-center gap-3 bg-[#0068FF] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#0052CC] transition-colors shadow-md"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652L4.4 24l4.8-2.4c.933.2 1.866.4 2.8.4 6.627 0 12-4.975 12-11.111S18.627 0 12 0z" />
                                </svg>
                                Login via Zalo
                            </button>
                        </div>

                        {/* Skip Button */}
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => onLoginAs(view)}
                            className="bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-white mt-2"
                        >
                            Skip (Guest Mode)
                        </Button>

                        {/* Authorization Disclaimer */}
                        <div className="pt-3 border-t border-gray-800">
                            <p className="text-[10px] text-center text-gray-500 leading-relaxed">
                                登入即代表同意 Mosport 存取您的公開社群資料以優化搜尋體驗。<br />
                                <span className="text-gray-600">By signing in, you authorize Mosport to access your public social data.</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
