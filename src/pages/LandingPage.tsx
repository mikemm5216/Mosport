import { useState } from 'react';
import { LandingPage as LandingPageComponent } from '../components/LandingPage';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../stores/useAuthStore';
import { SEO } from '../components/SEO';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartJourney = async () => {
        setIsLoading(true);

        try {
            // Try backend guest login first
            const { authService } = await import('../services/auth');
            const data = await authService.loginGuest();

            setUser({
                ...data.user,
                isAuthenticated: true,
                isGuest: true
            });

            sessionStorage.setItem('auth_token', data.access_token);
            navigate('/dashboard');
        } catch (error) {
            console.warn('Backend guest login failed, using local fallback:', error);

            // Fallback: Create local guest session
            const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            setUser({
                id: guestId,
                email: `${guestId}@mosport.local`,
                name: 'Guest User',
                role: 'FAN',
                isAuthenticated: true,
                isGuest: true,
                picture: `https://api.dicebear.com/7.x/shapes/svg?seed=${guestId}`
            });

            // Use local token
            sessionStorage.setItem('auth_token', `local_${guestId}`);

            // Still navigate to dashboard
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Home"
                description="Find the best place to watch sports near you. Mosport connects fans with venues showing live matches."
            />
            <LandingPageComponent onLoginClick={handleStartJourney} isLoading={isLoading} />

        </>
    );
};
