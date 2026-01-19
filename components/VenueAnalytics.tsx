import React from 'react';

export const VenueAnalytics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fadeIn">
      {/* Metric 1: Real-time Traffic (The "Now") */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-mosport-venue">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Audience</h3>
           <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mosport-venue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mosport-venue"></span>
           </span>
        </div>
        <div className="flex items-baseline gap-2">
           <span className="text-3xl font-black text-white">124</span>
           <span className="text-xs font-medium text-green-500 flex items-center">
              <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              +12%
           </span>
        </div>
        <p className="text-[10px] text-gray-500 mt-2">Fans viewing your profile right now.</p>
        
        {/* Simple Bar Chart */}
        <div className="flex items-end gap-1 h-8 mt-4">
           {[40, 65, 45, 80, 55, 90, 60, 100].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gray-800 rounded-t-sm hover:bg-mosport-venue transition-colors"></div>
           ))}
        </div>
      </div>

      {/* Metric 2: Signal Health (The "Product") */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg relative group">
         <div className="flex justify-between items-start mb-2">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Signal Strength</h3>
           <span className="text-[10px] font-mono text-mosport-venue bg-mosport-venue/10 px-2 py-0.5 rounded border border-mosport-venue/20">OPTIMAL</span>
        </div>
        
        <div className="flex items-center gap-4 mt-3">
           <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-mosport-venue drop-shadow-[0_0_10px_rgba(214,36,112,0.5)]" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
              <span className="absolute text-sm font-bold text-white">92</span>
           </div>
           <div>
              <div className="text-sm text-white font-bold">Excellent Coverage</div>
              <div className="text-[10px] text-gray-400 mt-1">Your verified tags (Screen, Sound) are boosting visibility by 40%.</div>
           </div>
        </div>
        <button className="w-full mt-4 py-2 border border-dashed border-gray-600 rounded text-[10px] text-gray-400 hover:text-white hover:border-white transition-colors uppercase tracking-wide">
           Update QoE Tags
        </button>
      </div>

      {/* Metric 3: Conversion (The "ROI") */}
      <div className="bg-gradient-to-br from-mosport-venue/20 to-gray-900 border border-mosport-venue/30 p-5 rounded-xl shadow-lg relative">
         <div className="flex justify-between items-start mb-2">
           <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Projected Revenue</h3>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-mosport-venue">
             <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.324.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
             <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
           </svg>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
           <span className="text-2xl font-black text-white">4.2M</span>
           <span className="text-xs font-bold text-gray-400">VND</span>
        </div>
        <p className="text-[10px] text-gray-300 mt-2 mb-4">Estimated from 18 table intents for tonight's AFF Cup match.</p>

        <button className="w-full bg-white text-black font-bold text-xs py-2 rounded shadow hover:bg-gray-200 transition-colors">
            Boost Visibility
        </button>
      </div>
    </div>
  );
};
