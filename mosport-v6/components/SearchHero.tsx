import React from 'react';
import { Button } from './Button';

export const SearchHero: React.FC = () => {
  return (
    <div className="relative border-b border-gray-800 bg-mosport-card/50">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white tracking-tight">
          Find Your Game, <span className="text-gray-500">Anywhere.</span>
        </h1>

        {/* The Search Interaction - 5s mark */}
        <div className="max-w-4xl mx-auto bg-mosport-dark border border-gray-700 rounded-xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
          
          <div className="flex-[1.5] px-4 py-2 border-b md:border-b-0 md:border-r border-gray-700">
            <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">I want to watch</label>
            <input 
              type="text" 
              placeholder="Team or League?" 
              className="w-full bg-transparent text-white font-medium focus:outline-none placeholder-gray-600"
            />
          </div>

          <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-700">
            <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Date</label>
            <div className="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
                  <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
               </svg>
               <input 
                  type="text" 
                  defaultValue="2026/1/2 - 2026/1/30"
                  className="w-full bg-transparent text-white font-medium focus:outline-none cursor-pointer"
               />
            </div>
          </div>

          <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-700">
            <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</label>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <select className="bg-transparent text-white font-medium focus:outline-none w-full">
                <option>Near Current Loc</option>
                <option>Hoan Kiem</option>
                <option>Tay Ho</option>
              </select>
            </div>
          </div>

          <div className="p-1">
             <Button className="w-full md:w-auto h-full aspect-square" variant="primary">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
             </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {['V.League', 'Champions League', 'National Team', 'Premier League', 'La Liga'].map(tag => (
            <button key={tag} className="px-3 py-1 rounded-full border border-gray-700 bg-gray-900/50 text-xs text-gray-400 hover:border-blue-500 hover:text-white transition-all">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};