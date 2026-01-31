import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AuthCallback } from './pages/AuthCallback';


import { SEO } from './components/SEO';
import { Analytics } from '@vercel/analytics/react';

import { useAuthStore } from './stores/useAuthStore';

// Protected Route Wrapper
const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuthStore();

    // Check if user is authenticated (including Guest)
    if (!user || !user.isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <SEO />
            <Analytics />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Protected/Guest Route */}
                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
