import React, { useState } from 'react';
import { UserRole } from '../types';
import { generateOAuthUrl } from '../config/oauth';
import { useAuthStore } from '../stores/useAuthStore';
import { User, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

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

type TabMode = 'fan' | 'venue';
type VenueSubMode = 'claim' | 'login';

export const AuthModal = ({ isOpen, onClose, onLoginAs }: AuthModalProps) => {
    // Tab State: 'fan' (User) or 'venue' (Business)
    const [activeTab, setActiveTab] = useState<TabMode>('fan');

    // Venue Sub-State: 'login' or 'claim' (for invite codes)
    const [venueMode, setVenueMode] = useState<VenueSubMode>('claim');

    const [inviteCode, setInviteCode] = useState('');
    const [venueEmail, setVenueEmail] = useState('');
    const [venuePassword, setVenuePassword] = useState('');
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
                        role: activeTab === 'fan' ? UserRole.FAN : UserRole.VENUE,
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
        const role = activeTab === 'fan' ? UserRole.FAN : UserRole.VENUE;
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

        // TODO: Verify invite code with backend
        console.log('Claiming venue with code:', inviteCode);

        // Mock success
        setUser({
            id: 'venue_claimed',
            email: 'claimed@venue.com',
            role: UserRole.VENUE,
            isAuthenticated: true,
            isGuest: false,
        });
        onLoginAs(UserRole.VENUE);
        onClose();
    };

    const handleVenueLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!venueEmail || !venuePassword) {
            setError('Please enter email and password');
            return;
        }

        // Mock login validation (for testing only)
        const MOCK_CREDENTIALS = {
            email: 'mikemm5216@gmail.com',
            password: 'Mikemm26@'
        };


        // Case-insensitive email comparison
        if (venueEmail.toLowerCase().trim() !== MOCK_CREDENTIALS.email.toLowerCase()) {
            setError(`Email not found. Try: ${MOCK_CREDENTIALS.email}`);
            return;
        }

        if (venuePassword !== MOCK_CREDENTIALS.password) {
            setError('Incorrect password');
            return;
        }

        // TODO: Replace with real backend authentication
        console.log('Venue login successful:', venueEmail);

        setUser({
            id: 'venue_owner_001',
            email: venueEmail,
            role: UserRole.VENUE,
            isAuthenticated: true,
            isGuest: false,
            profile: {
                name: 'Venue Owner',
                email: venueEmail,
            }
        });
        onLoginAs(UserRole.VENUE);
        onClose();
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className={`
                w-full max-w-[400px] bg-neutral-900 border rounded-xl shadow-2xl overflow-hidden transition-all duration-300
                ${activeTab === 'fan' ? 'border-blue-500/30 shadow-blue-500/20' : 'border-red-500/30 shadow-red-500/20'}
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
                            ${activeTab === 'venue' ? 'text-red-500 bg-red-950/20' : 'text-gray-500 hover:text-gray-300'}
                        `}
                    >
                        <ShieldCheck size={16} /> VENUE PARTNER
                        {activeTab === 'venue' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500" />}
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

                    {/* --- SCENARIO B: VENUE PARTNER (Red Mode) --- */}
                    {activeTab === 'venue' && (
                        <div className="space-y-4 animate-in fade-in duration-300">

                            {/* Toggle: Login vs Claim */}
                            <div className="flex justify-center gap-4 text-xs mb-2">
                                <button
                                    onClick={() => setVenueMode('claim')}
                                    className={`${venueMode === 'claim' ? 'text-white underline' : 'text-gray-500 hover:text-gray-300'} transition-colors`}
                                >
                                    Have an Invite Code?
                                </button>
                                <span className="text-gray-700">|</span>
                                <button
                                    onClick={() => setVenueMode('login')}
                                    className={`${venueMode === 'login' ? 'text-white underline' : 'text-gray-500 hover:text-gray-300'} transition-colors`}
                                >
                                    Owner Login
                                </button>
                            </div>

                            {venueMode === 'claim' ? (
                                <form onSubmit={handleVenueClaimSubmit} className="space-y-4">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-red-500 flex items-center justify-center gap-2">
                                            <Lock size={18} /> Claim Venue
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">Enter the 6-digit code from your invitation card.</p>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. HAN-882"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                        className="w-full bg-red-950/30 border border-red-500/30 text-center text-xl tracking-widest font-mono h-12 text-white placeholder:text-red-900/50 focus:outline-none focus:border-red-500 rounded-md"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold h-11 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Verify Code <ArrowRight size={16} />
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVenueLoginSubmit} className="space-y-4">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white">Owner Access</h3>
                                        <p className="text-xs text-gray-400">Manage your live signals.</p>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Venue Email"
                                        value={venueEmail}
                                        onChange={(e) => setVenueEmail(e.target.value)}
                                        className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={venuePassword}
                                        onChange={(e) => setVenuePassword(e.target.value)}
                                        className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-bold h-11 rounded-lg transition-colors"
                                    >
                                        Enter Dashboard
                                    </button>
                                </form>
                            )}
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
