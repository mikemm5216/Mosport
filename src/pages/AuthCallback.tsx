import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../stores/useAuthStore';
import { apiClient } from '../services/api';


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
                // Call backend for OAuth exchange
                const response = await apiClient.handleOAuthCallback({
                    code,
                    provider,
                    role
                }) as any;

                const { user, access_token } = response;

                // Create user session
                setUser({
                    id: user.id,
                    role: user.role,
                    isAuthenticated: true,
                    isGuest: user.is_guest,
                    provider: user.oauth_provider,
                    profile: {
                        name: user.name,
                        email: user.email,
                        picture: user.picture_url
                    }
                });

                // Store token (if you have a token store, otherwise just in memory/cookie)
                localStorage.setItem('auth_token', access_token);

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
