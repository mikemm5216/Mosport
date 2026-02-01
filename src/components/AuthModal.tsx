import { useState } from 'react';
import { UserRole } from '../types';
import { generateOAuthUrl } from '../config/oauth';
import { useAuthStore } from '../stores/useAuthStore';
import { User, ShieldCheck, Lock, ArrowRight } from 'lucide-react';

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

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    // Tab State: 'fan' (User), 'venue' (Business), or 'admin' (Platform Admin)
    const [activeTab, setActiveTab] = useState<TabMode>('fan');

    const [inviteCode, setInviteCode] = useState('');
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

    const handleVenueClaimSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!inviteCode) {
            setError('Please enter your invite code');
            return;
        }

        // Mock success for now
        setUser({
            id: `venue_${Date.now()}`,
            role: UserRole.VENUE,
            isAuthenticated: true,
            isGuest: false,
            provider: 'invite',
            profile: {
                name: `Venue ${inviteCode}`
            }
        });
        onClose();
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
                        </div>
                    )}

                    {/* --- SCENARIO C: VENUE PARTNER (Invite Code) --- */}
                    {activeTab === 'venue' && (
                        <form onSubmit={handleVenueClaimSubmit} className="space-y-4 animate-in fade-in duration-300">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-red-500">Venue Partner Program</h3>
                                <p className="text-sm text-gray-400">Enter your exclusive invite code to join.</p>
                            </div>

                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="MOSPORT-XXXX-XXXX"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    className="w-full h-12 px-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:border-red-500 focus:outline-none text-center tracking-widest font-mono text-lg uppercase placeholder:text-gray-600"
                                    maxLength={20}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                Verify & Claim Venue <ArrowRight size={18} />
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                Don't have a code? <a href="#" className="text-red-400 hover:underline">Contact Sales</a>
                            </p>
                        </form>
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
