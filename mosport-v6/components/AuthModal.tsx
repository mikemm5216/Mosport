import React, { useState } from 'react';
import { Button } from './Button';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAs: (role: UserRole) => void;
}

type AuthView = 'FAN' | 'VENUE' | 'STAFF';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginAs }) => {
  const [view, setView] = useState<AuthView>('FAN');

  if (!isOpen) return null;

  const handleBackToFan = () => setView('FAN');

  // Unified Form Handler
  const handleLoginSubmit = (e: React.FormEvent, role: UserRole) => {
    e.preventDefault(); // Stop page reload
    onLoginAs(role);
  };

  // Renders the Fan (Consumer) Login View
  const renderFanView = () => (
    <div className="animate-fadeIn">
        <div className="text-center mb-8">
           <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-3xl font-black italic tracking-tighter text-mosport-fan">MS</span>
              <span className="text-xl font-bold text-white">MOSPORT</span>
           </div>
           <h2 className="text-xl font-bold text-white mb-2">Welcome back to Mosport</h2>
           <p className="text-sm text-gray-500">Log in to save your favorite teams and get notified.</p>
        </div>

        <form onSubmit={(e) => handleLoginSubmit(e, UserRole.FAN)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="fan@mosport.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-600"
            />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
             <input 
               type="password" 
               required
               placeholder="••••••••"
               className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-600"
             />
          </div>
          
          <Button 
            fullWidth 
            type="submit"
            variant="primary" 
            className="py-3 mt-4"
          >
            Let's go Team!
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-mosport-card text-gray-500 uppercase font-bold">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
             <button type="button" className="flex items-center justify-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
             </button>
             <button type="button" className="flex items-center justify-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             </button>
              <button type="button" className="flex items-center justify-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.08-2.08 2.72-5.2 2.72-7.773 0-.773-.08-1.52-.213-2.267h-10.56z"/></svg>
             </button>
             <button type="button" className="flex items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white font-bold text-xs">
               Zalo
             </button>
          </div>
          
          {/* B2B / Admin Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-center gap-6">
            <button 
               type="button"
               onClick={() => setView('VENUE')}
               className="group flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-mosport-venue transition-colors tracking-wide"
            >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                  <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.158l-.106-.053a8.25 8.25 0 00-5.87-1.575l-1.838.46V21a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
               </svg>
               VENUE LOGIN
            </button>

            <span className="text-gray-800">|</span>

            <button 
               type="button"
               onClick={() => setView('STAFF')}
               className="group flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-white transition-colors tracking-wide"
            >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
               </svg>
               STAFF PORTAL
            </button>
          </div>
        </form>
    </div>
  );

  // Renders the Venue (Business) Login View
  const renderVenueView = () => (
    <div className="animate-fadeIn">
        <div className="text-center mb-8">
           <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-3xl font-black italic tracking-tighter text-mosport-venue">MS</span>
              <span className="text-xs font-bold bg-mosport-venue text-white px-2 py-0.5 rounded tracking-widest uppercase">PARTNER</span>
           </div>
           <h2 className="text-xl font-bold text-white mb-2">Venue Portal</h2>
           <p className="text-sm text-gray-500">Manage your venue profile, signals, and view real-time decision analytics.</p>
        </div>

        <form onSubmit={(e) => handleLoginSubmit(e, UserRole.VENUE)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-mosport-venue uppercase">Business Email</label>
            <input 
              type="email" 
              required
              placeholder="manager@pukucafe.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-mosport-venue focus:outline-none transition-colors placeholder-gray-600"
            />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-mosport-venue uppercase">Password</label>
             <input 
               type="password" 
               required
               placeholder="••••••••"
               className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-mosport-venue focus:outline-none transition-colors placeholder-gray-600"
             />
          </div>
          
          <Button 
            fullWidth 
            type="submit"
            variant="secondary" // Pink for Venue
            className="py-3 mt-4"
          >
            Access Dashboard
          </Button>

          <div className="mt-6 text-center">
             <button type="button" onClick={handleBackToFan} className="text-xs text-gray-500 hover:text-white transition-colors underline decoration-gray-700 underline-offset-4">
                Not a partner? Back to Fan Login
             </button>
          </div>
        </form>
    </div>
  );

  // Renders the Staff (Admin) Login View
  const renderStaffView = () => (
    <div className="animate-fadeIn font-mono">
        <div className="text-center mb-8 border-b border-gray-800 pb-4">
           <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-white tracking-[0.2em] uppercase">INTERNAL ACCESS</span>
           </div>
           <p className="text-[10px] text-gray-500 uppercase">Restricted Area • Authorized Personnel Only</p>
        </div>

        <form onSubmit={(e) => handleLoginSubmit(e, UserRole.STAFF)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white uppercase tracking-widest">Agent ID</label>
            <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">MS-</span>
                <input 
                type="text" 
                required
                placeholder="007"
                className="w-full bg-black border border-gray-600 rounded-none px-4 pl-12 py-3 text-white focus:border-white focus:outline-none transition-colors placeholder-gray-700 font-mono"
                />
            </div>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Key</label>
             <input 
               type="password" 
               required
               placeholder="••••••••••••"
               className="w-full bg-black border border-gray-600 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none transition-colors placeholder-gray-700 font-mono"
             />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 mt-4 hover:bg-gray-200 transition-colors border border-transparent hover:border-white"
          >
            Authenticate
          </button>

          <div className="mt-6 text-center">
             <button type="button" onClick={handleBackToFan} className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
                [ ESC ] RETURN TO PUBLIC NETWORK
             </button>
          </div>
        </form>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl transition-all duration-300 border ${
          view === 'VENUE' ? 'bg-gray-900 border-mosport-venue/30' : 
          view === 'STAFF' ? 'bg-black border-white/20' : 
          'bg-mosport-card border-gray-800'
      }`}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {view === 'FAN' && renderFanView()}
        {view === 'VENUE' && renderVenueView()}
        {view === 'STAFF' && renderStaffView()}
      </div>
    </div>
  );
};