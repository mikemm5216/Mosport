import { LandingPage as LandingPageComponent } from '../components/LandingPage';
import { useNavigate } from 'react-router-dom';


import { UserRole } from '../types';
import { useAuthStore } from '../stores/useAuthStore';
import { SEO } from '../components/SEO';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { setGuest } = useAuthStore();

    const handleStartJourney = () => {
        // Default to Fan Guest Mode
        setGuest(UserRole.FAN);
        navigate('/dashboard');
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
