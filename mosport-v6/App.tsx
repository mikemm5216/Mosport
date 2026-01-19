import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { DecisionCard } from './components/DecisionCard';
import { AuthModal } from './components/AuthModal';
import { VenueAnalytics } from './components/VenueAnalytics'; // Import Analytics
import { UserRole, DecisionSignal } from './types';
import { getDecisionSignals } from './services/moEngine';
import { APP_VERSION } from './constants';

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.FAN);
  const [signals, setSignals] = useState<DecisionSignal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Initial Load - "30-Second Journey" (0s mark)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDecisionSignals();
      setSignals(data);
      setLoading(false);
    };

    fetchData();
  }, []); // Run once on mount

  const handleRoleLogin = (role: UserRole) => {
     setCurrentRole(role);
     setIsAuthOpen(false);
     // Simulate navigation effect
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic: Filter signals for Venue View
  // Simulate that the logged in venue is "Puku Cafe" (id: v1)
  const displayedSignals = currentRole === UserRole.VENUE 
    ? signals.map(s => ({
        ...s,
        matchedVenues: s.matchedVenues.filter(v => v.venue.id === 'v1') // Only show Puku Data
      })).filter(s => s.matchedVenues.length > 0) // Only show events where Puku is a match
    : signals;

  return (
    <div className="min-h-screen bg-mosport-black font-sans text-gray-200 pb-20 selection:bg-pink-500 selection:text-white">
      
      {/* Beta Banner - Tech/System Status Style */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-center py-2 px-4 border-b border-white/5 shadow-lg relative z-50">
         <div className="flex items-center justify-center gap-2 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <p className="text-[10px] font-mono font-medium tracking-widest text-gray-400 uppercase">
               SYSTEM STATUS: <span className="text-gray-200 font-bold">{APP_VERSION}</span> • SIMULATION MODE ACTIVE
            </p>
         </div>
      </div>

      <Navbar 
        currentRole={currentRole} 
        setRole={setCurrentRole}
        onLoginClick={() => setIsAuthOpen(true)}
      />

      {/* Conditional Search Hero: Fans need search, Venues need data immediately */}
      {currentRole === UserRole.FAN && <SearchHero />}

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Venue SaaS Dashboard Integration */}
        {currentRole === UserRole.VENUE && !loading && (
           <VenueAnalytics />
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
            {currentRole === UserRole.VENUE ? (
               <>
                 <span className="text-mosport-venue text-2xl">⚡</span>
                 <span>Matched Events (Your Schedule)</span>
               </>
            ) : (
               <>
                 <span className="text-yellow-500 text-2xl">🏆</span> 
                 <span>Upcoming Matches</span>
               </>
            )}
          </h2>
          {loading && (
             <span className="text-[10px] font-mono text-mosport-venue animate-pulse">
               CONNECTING TO MO-ENGINE...
             </span>
          )}
        </div>

        {loading ? (
          // Skeleton Loader
          <div className="space-y-4">
             {[1, 2].map(i => (
                <div key={i} className="h-48 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800"></div>
             ))}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedSignals.length > 0 ? displayedSignals.map(signal => (
              <DecisionCard 
                key={signal.eventId} 
                signal={signal} 
                userRole={currentRole} 
              />
            )) : (
              <div className="text-center py-10 text-gray-500 border border-gray-800 rounded-xl border-dashed">
                 No matched events found for your venue based on current signals.
              </div>
            )}
          </div>
        )}

        {/* Footer / Vision Statement (Commercialized) */}
        <div className="mt-16 text-center border-t border-gray-800 pt-10 pb-12">
           {/* Brand Lockup */}
           <h3 className="text-sm font-black text-gray-400 mb-3 tracking-[0.2em] uppercase flex items-center justify-center gap-2">
              Mosport Ecosystem <span className="text-mosport-venue">///</span> V6.6
           </h3>
           
           {/* Value Proposition */}
           <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed mb-6 font-medium">
             The Physical Decision Index™ is currently operating in <b className="text-gray-400">Public Beta</b>. 
             Real-time broadcast signals and venue telemetry are simulated for the Hanoi Pilot Program.
           </p>

           {/* Trust Signals / Architecture Specs */}
           <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-gray-600 font-bold tracking-wider uppercase">
              <span className="flex items-center gap-1 hover:text-gray-400 transition-colors cursor-help">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Privacy-First Architecture
              </span>
              <span className="hidden sm:inline text-gray-800">•</span>
              <span className="flex items-center gap-1 hover:text-gray-400 transition-colors cursor-help">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                Hanoi Pilot Program
              </span>
              <span className="hidden sm:inline text-gray-800">•</span>
              <span className="flex items-center gap-1 hover:text-gray-400 transition-colors cursor-help">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Real-Time Latency: 600ms
              </span>
           </div>
           
           <div className="mt-8 text-[9px] text-gray-700 font-mono">
              © 2024 MOSPORT INC. ALL RIGHTS RESERVED.
           </div>
        </div>

      </main>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginAs={handleRoleLogin}
      />
    </div>
  );
}

export default App;