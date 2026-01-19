
export const VenueAnalytics = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fadeIn">
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Audience</h3>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mosport-venue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-mosport-venue"></span>
                    </span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">124</span>
                    <span className="text-xs font-medium text-green-500 flex items-center">+12%</span>
                </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg relative group">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Signal Strength</h3>
                    <span className="text-[10px] font-mono text-mosport-venue bg-mosport-venue/10 px-2 py-0.5 rounded border border-mosport-venue/20">OPTIMAL</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <span className="absolute text-sm font-bold text-white">92</span>
                    </div>
                    <div>
                        <div className="text-sm text-white font-bold">Excellent Coverage</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
