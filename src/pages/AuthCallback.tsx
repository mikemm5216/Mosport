import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';


export const AuthCallback = () => {
    const navigate = useNavigate();
    const { setUser, setError, setLoading } = useAuthStore();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

    useEffect(() => {
        const handleCallback = async () => {
            setLoading(true);

            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const state = params.get('state');
            const error = params.get('error');

            // 錯誤處理
            if (error) {
                setError(`OAuth Error: ${error}`);
                setStatus('error');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            if (!code) {
                setError('No authorization code received');
                setStatus('error');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // Parse provider and role from state
            const provider = state?.split('_')[0] || 'google';
            let role = state?.split('_')[1] || 'FAN';

            // 🔧 DEV MODE: Allow admin testing via URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('admin') === 'true') {
                role = 'ADMIN';
            }

            try {
                // TODO: Replace with real backend authentication later
                // For now, use client-side mock authentication
                console.log('OAuth callback received:', { provider, role, code });

                // 🛡️ SECURITY: Strict Admin Lock
                let userEmail = 'user@example.com';
                let userName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;

                // If attempting to login as ADMIN, we strictly enforce/simulate the specific email
                if (role === 'ADMIN') {
                    // 🚨 CRITICAL: Mocking strictly requires "Proof"
                    // In real life, Google/FB gives us this verified email.
                    // Here, we force the user to type it to "Simulate" they are that person.
                    const mockInputEmail = prompt("🔐 SECURITY CHECK\n\nSimulating Google Verification.\nPlease enter your authorized Admin email:");

                    if (mockInputEmail !== 'mikemm5216@gmail.com') {
                        const failedAttempt = mockInputEmail || 'No input';
                        throw new Error(`⛔ ACCESS DENIED: '${failedAttempt}' is not authorized.`);
                    }
                    userEmail = mockInputEmail;
                    userName = 'Mike MM';
                }

                // Create user session
                setUser({
                    id: `${provider}_${Date.now()}`,
                    role: role as any,
                    isAuthenticated: true,
                    isGuest: false,
                    provider: provider,
                    profile: {
                        name: userName,
                        email: userEmail,
                        picture: `https://api.dicebear.com/7.x/avatars/svg?seed=${Date.now()}`
                    }
                });

                setStatus('success');

                // Redirect to dashboard
                setTimeout(() => navigate('/dashboard'), 500);
            } catch (err: any) {
                console.error('Auth Callback Failed:', err);
                setError(err.message || 'Authentication failed');
                setStatus('error');
                setTimeout(() => navigate('/'), 3000);
            } finally {
                setLoading(false);
            }
        };

        handleCallback();
    }, [navigate, setUser, setError, setLoading]);

    return (
        <div className="min-h-screen bg-mosport-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-mosport-card border border-gray-800 rounded-2xl p-8 text-center">
                {status === 'processing' && (
                    <>
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mosport-fan"></div>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Authenticating...</h2>
                        <p className="text-sm text-gray-400">Please wait while we verify your credentials.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                            <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Success!</h2>
                        <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                            <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Authentication Failed</h2>
                        <p className="text-sm text-gray-400">Redirecting to home page...</p>
                    </>
                )}
            </div>
        </div>
    );
};
