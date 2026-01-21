import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AuthCallback } from './pages/AuthCallback';
import { useAuthStore } from './stores/useAuthStore';

import { SEO } from './components/SEO';

function App() {
    const { user } = useAuthStore();

    return (
        <BrowserRouter>
            <SEO />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Protected/Guest Route */}
                <Route
                    path="/dashboard"
                    element={user ? <Dashboard /> : <Navigate to="/" replace />}
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
