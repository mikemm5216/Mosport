import React, { useState } from 'react';
import { UserRole } from '../types';
import { generateOAuthUrl } from '../config/oauth';
import { useAuthStore } from '../stores/useAuthStore';
import { User, ShieldCheck, Lock } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginAs: (role: UserRole) => void;
}

declare global {
    interface Window {
        FB: any;
    }
}

type TabMode = 'fan' | 'venue' | 'admin';

export const AuthModal = ({ isOpen, onClose, onLoginAs }: AuthModalProps) => {
    // Tab State: 'fan' (User), 'venue' (Business), or 'admin' (Platform Admin)
    const [activeTab, setActiveTab] = useState<TabMode>('fan');

    const [error, setError] = useState('');

    const { setUser } = useAuthStore();

    if (!isOpen) return null;

    const handleFacebookLogin = () => {
        if (!window.FB) {
            setError('Facebook SDK not loaded.');
            return;
        }

        window.FB.login((response: any) => {
            if (response.authResponse) {
                window.FB.api('/me', { fields: 'name,email,picture' }, (profile: any) => {
                    setUser({
                        id: profile.id,
                        email: profile.email,
                        role: activeTab === 'fan' ? UserRole.FAN : activeTab === 'admin' ? UserRole.ADMIN : UserRole.VENUE,
                        isAuthenticated: true,
                        isGuest: false,
                        provider: 'facebook',
                        profile: {
                            name: profile.name,
                            email: profile.email,
                            picture: profile.picture?.data?.url
                        }
                    });
                    onClose();
                });
            } else {
                setError('Facebook login cancelled.');
            }
        }, { scope: 'public_profile,email' });
    };

    const handleOAuthLogin = (provider: 'google' | 'facebook' | 'zalo') => {
        if (provider === 'facebook') {
            handleFacebookLogin();
            return;
        }

        // Save the intended role to sessionStorage
        const role = activeTab === 'fan' ? UserRole.FAN : activeTab === 'admin' ? UserRole.ADMIN : UserRole.VENUE;
        sessionStorage.setItem('mosport_pending_role', role);

        const oauthUrl = generateOAuthUrl(provider, `${provider}_${role}_${Date.now()}`);

        if (oauthUrl === '#') {
            setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login not configured yet.`);
            return;
        }

        window.location.href = oauthUrl;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className={`
                w-full max-w-[400px] bg-neutral-900 border rounded-xl shadow-2xl overflow-hidden transition-all duration-300
                ${activeTab === 'fan' ? 'border-blue-500/30 shadow-blue-500/20' : activeTab === 'admin' ? 'border-purple-500/30 shadow-purple-500/20' : 'border-red-500/30 shadow-red-500/20'}
            `}>

                {/* === 1. TOP TOGGLE (The Identity Switcher) === */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('fan')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative
                            ${activeTab === 'fan' ? 'text-blue-400 bg-blue-950/20' : 'text-gray-500 hover:text-gray-300'}
                        `}
                    >
                        <User size={16} /> FAN ZONE
                        {activeTab === 'fan' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
                    </button>

                    <button
                        onClick={() => setActiveTab('venue')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative
                            ${activeTab === 'venue' ? 'text-red-400 bg-red-950/20' : 'text-gray-500 hover:text-gray-300'}
                        `}
                    >
                        <ShieldCheck size={16} /> VENUE PARTNER
                        {activeTab === 'venue' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500" />}
                    </button>

                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative
                            ${activeTab === 'admin' ? 'text-purple-400 bg-purple-950/20' : 'text-gray-500 hover:text-gray-300'}
                        `}
                    >
                        <Lock size={16} /> ADMIN
                        {activeTab === 'admin' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500" />}
                    </button>
                </div>

                {/* === 2. CONTENT AREA === */}
                <div className="p-6 min-h-[300px] flex flex-col justify-center">

                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-950/30 border border-red-500/30 rounded-md text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* --- SCENARIO A: FAN LOGIN (Standard) --- */}
                    {activeTab === 'fan' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-white">Join the Squad</h3>
                                <p className="text-sm text-gray-400">Save venues, track matches, and get notified.</p>
                            </div>

                            <button
                                onClick={() => handleOAuthLogin('google')}
                                className="w-full bg-white text-black hover:bg-gray-200 font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <span className="text-lg">G</span>
                                Continue with Google
                            </button>

                            <button
                                onClick={() => handleOAuthLogin('facebook')}
                                className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5] font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <span className="text-lg">f</span>
                                Continue with Facebook
                            </button>

                            <button
                                onClick={() => handleOAuthLogin('zalo')}
                                className="w-full bg-[#0068FF] text-white hover:bg-[#0058E0] font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <span className="text-lg">Z</span>
                                Continue with Zalo
                            </button>
                        </div>
                    )}

                    {/* --- SCENARIO B: ADMIN LOGIN --- */}
                    {activeTab === 'admin' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-purple-400">👑 Platform Admin</h3>
                                <p className="text-sm text-gray-400">Manage venues, users, and analytics</p>
                            </div>

                            <button
                                onClick={() => handleOAuthLogin('google')}
                                className="w-full bg-purple-600 text-white hover:bg-purple-700 font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <Lock size={18} />
                                Admin Login with Google
                            </button>

                            <button
                                onClick={() => handleOAuthLogin('facebook')}
                                className="w-full bg-purple-700 text-white hover:bg-purple-800 font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <Lock size={18} />
                                Admin Login with Facebook
                            </button>

                            <button
                                onClick={() => handleOAuthLogin('zalo')}
                                className="w-full bg-purple-800 text-white hover:bg-purple-900 font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <Lock size={18} />
                                Admin Login with Zalo
                            </button>
                        </div>
                    )}

                    {/* --- SCENARIO C: VENUE PARTNER --- */}
                    {activeTab === 'venue' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-red-400">🏪 Venue Partner</h3>
                                <p className="text-sm text-gray-400">Connect your venue and start broadcasting</p>
                            </div>

                            <button
                                onClick={() => handleOAuthLogin('google')}
                                className="w-full bg-white text-black hover:bg-gray-200 font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <span className="text-lg">G</span>
                                Continue with Google
                            </button>

                            <button
                                onClick={() => handleOAuthLogin('facebook')}
                                className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5] font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <span className="text-lg">f</span>
                                Continue with Facebook
                            </button>

                            <button
                                onClick={() => handleOAuthLogin('zalo')}
                                className="w-full bg-[#0068FF] text-white hover:bg-[#0058E0] font-bold h-11 rounded-lg flex items-center gap-2 justify-center transition-colors"
                            >
                                <span className="text-lg">Z</span>
                                Continue with Zalo
                            </button>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-3 bg-black/40 text-center border-t border-white/5">
                    <p className="text-[10px] text-gray-600">
                        By continuing, you agree to Mosport's Terms & Vibe Policy.
                    </p>
                </div>

            </div>
        </div>
    );
};
