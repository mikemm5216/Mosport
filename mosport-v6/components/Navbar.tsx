import React from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES } from '../constants';
import { Button } from './Button';

interface NavbarProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, setRole, onLoginClick }) => {
  const theme = ROLE_THEMES[currentRole];

  return (
    <nav className="sticky top-0 z-50 bg-mosport-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black tracking-tighter italic">
              <span className="text-mosport-fan">M</span>
              <span className="text-mosport-venue">S</span>
            </div>
            <span className="text-white font-bold tracking-wide hidden sm:block">MOSPORT</span>
            {/* HANOI badge removed */}
          </div>

          {/* Persona Switcher Removed */}
          <div></div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="hidden sm:flex text-right flex-col justify-center hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
            >
              <span className={`text-[10px] uppercase font-bold ${theme.primary} tracking-widest`}>
                {currentRole} MODE
              </span>
            </button>
            
            <button 
              onClick={onLoginClick}
              className="text-gray-300 hover:text-white transition-colors focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Persona Switcher */}
      <div className="md:hidden flex justify-center pb-3 border-b border-gray-800">
         <div className="flex gap-2">
            {(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((role) => (
              <button
                key={role}
                onClick={() => setRole(UserRole[role])}
                className={`w-2 h-2 rounded-full ${
                  currentRole === UserRole[role] ? ROLE_THEMES[UserRole[role]].bg : 'bg-gray-800'
                }`}
              />
            ))}
         </div>
      </div>
    </nav>
  );
};