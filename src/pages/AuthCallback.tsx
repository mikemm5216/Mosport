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

            // 取得儲存的角色
            const pendingRole = sessionStorage.getItem('mosport_pending_role') as any;
            if (!pendingRole) {
                setError('Missing role information');
                setStatus('error');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // TODO: 呼叫後端 API 交換 token
            // const response = await fetch('/api/auth/callback', {
            //   method: 'POST',
            //   body: JSON.stringify({ code, state })
            // });

            // 暫時模擬成功
            setTimeout(() => {
                const provider = state?.split('_')[0] as 'google' | 'facebook' | 'zalo';

                setUser({
                    role: pendingRole,
                    isAuthenticated: true,
                    isGuest: false,
                    provider,
                    profile: {
                        name: 'Demo User',
                        email: 'demo@mosport.app',
                    },
                });

                sessionStorage.removeItem('mosport_pending_role');
                setStatus('success');

                setTimeout(() => navigate('/dashboard'), 1000);
            }, 2000);
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
