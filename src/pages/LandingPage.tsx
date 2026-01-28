import { LandingPage as LandingPageComponent } from '../components/LandingPage';
import { useNavigate } from 'react-router-dom';


import { UserRole } from '../types';
import { useAuthStore } from '../stores/useAuthStore';
import { SEO } from '../components/SEO';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    const handleStartJourney = async () => {
        try {
            // Import dynamically to avoid circular dependencies if any, or just standard import
            const { authService } = await import('../services/auth');
            const data = await authService.loginGuest();

            setUser({
                ...data.user,
                isAuthenticated: true,
                isGuest: true
            });

            // Persist token for API requests
            sessionStorage.setItem('auth_token', data.access_token);

            navigate('/dashboard');
        } catch (error) {
            console.error('Guest login failed:', error);
            // Fallback to local guest mode if API fails?
            // For now, let's keep it strict as per spec (Hard Gate needs backend verification?)
            // Actually spec says "Assign a temporary guest_id", so we need the backend.
        }
    };

    return (
        <>
            <SEO
                title="Home"
                description="Find the best place to watch sports near you. Mosport connects fans with venues showing live matches."
            />
            <LandingPageComponent onLoginClick={handleStartJourney} />

        </>
    );
};
