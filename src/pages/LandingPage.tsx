import { LandingPage as LandingPageComponent } from '../components/LandingPage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthModal } from '../components/AuthModal';
import { UserRole } from '../types';
import { useAuthStore } from '../stores/useAuthStore';
import { SEO } from '../components/SEO';

export const LandingPage = () => {
    const navigate = useNavigate();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { setGuest } = useAuthStore();

    const handleLoginClick = () => {
        setIsAuthOpen(true);
    };

    const handleSkipLogin = (role: UserRole) => {
        setGuest(role);
        setIsAuthOpen(false);
        navigate('/dashboard');
    };

    return (
        <>
            <SEO
                title="Home"
                description="Find the best place to watch sports near you. Mosport connects fans with venues showing live matches."
            />
            <LandingPageComponent onLoginClick={handleLoginClick} />
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onLoginAs={handleSkipLogin}
            />
        </>
    );
};
