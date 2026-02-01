import React from 'react';

interface EditVenueProfileProps {
    onClose: () => void;
}

export const EditVenueProfile = ({ onClose }: EditVenueProfileProps) => {
    // Mock Data (In real app, fetch from DB)
    const [tags, setTags] = React.useState(['Rooftop', 'Craft Beer', 'Projector']);
    const [venueName, setVenueName] = React.useState('Puku Bar');
    const [screenConfig, setScreenConfig] = React.useState('projector_plus');
    const [audioPolicy, setAudioPolicy] = React.useState('big_match');
    const [googleMapsLink, setGoogleMapsLink] = React.useState('https://goo.gl/maps/...');
    const [openingHours, setOpeningHours] = React.useState('Open 24/7');

    const handleSave = () => {
        // TODO: Call API to save venue data
        console.log('Saving venue profile...', {
            venueName,
            screenConfig,
            audioPolicy,
            tags,
            googleMapsLink,
            openingHours
        });
        onClose();
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-neutral-950">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            ⚙️ Venue Configuration
                        </h2>
                        <p className="text-xs text-gray-400">Update your static facility data.</p>
                    </div>
                    {/* Gamification: Profile Strength */}
                    <div className="text-right">
                        <div className="text-xs text-blue-400 font-mono mb-1">PROFILE STRENGTH: 85%</div>
                        <div className="h-1.5 w-24 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-blue-500"></div>
                        </div>
                    </div>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="overflow-y-auto p-6 space-y-8">

                    {/* SECTION 1: HARDWARE SPECS */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            📺 Hardware Capabilities
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Screen Configuration</label>
                                <select
                                    value={screenConfig}
                                    onChange={(e) => setScreenConfig(e.target.value)}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="single_tv">1-2 TV Screens</option>
                                    <option value="multi_tv">TV Wall (3+ Screens)</option>
                                    <option value="projector">Large Projector</option>
                                    <option value="projector_plus">Projector + Multiple TVs</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    🔊 Audio Policy
                                </label>
                                <select
                                    value={audioPolicy}
                                    onChange={(e) => setAudioPolicy(e.target.value)}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="always_on">🔊 Always Commentary ON</option>
                                    <option value="big_match">🔉 Big Matches Only</option>
                                    <option value="no_sound">🔇 Music Only (No Commentary)</option>
                                </select>
                                <p className="text-[10px] text-gray-500">This is the #1 filter used by fans.</p>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-white/5" />

                    {/* SECTION 2: VIBE & TAGS */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            ✨ Vibe & Atmosphere
                        </h3>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300">Active Tags (Max 5)</label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => removeTag(tag)}
                                        className="px-3 py-1 bg-blue-900/30 text-blue-200 border border-blue-500/30 rounded-full text-sm hover:bg-blue-900/50 transition-colors"
                                    >
                                        {tag} ×
                                    </button>
                                ))}
                                <button className="px-3 py-1 border border-dashed border-white/20 text-gray-400 rounded-full text-sm hover:text-white hover:border-white/50 transition-colors">
                                    + Add Tag
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500">
                                These tags influence your AI Vibe Image and search ranking.
                            </p>
                        </div>
                    </section>

                    <div className="h-px bg-white/5" />

                    {/* SECTION 3: LOGISTICS */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            📍 Logistics
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Venue Name</label>
                                <input
                                    type="text"
                                    value={venueName}
                                    onChange={(e) => setVenueName(e.target.value)}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Google Maps Link</label>
                                <input
                                    type="url"
                                    value={googleMapsLink}
                                    onChange={(e) => setGoogleMapsLink(e.target.value)}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 text-sm text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                🕒 Opening Hours Summary
                            </label>
                            <input
                                type="text"
                                value={openingHours}
                                onChange={(e) => setOpeningHours(e.target.value)}
                                className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </section>

                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-4 border-t border-white/10 bg-neutral-950 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md flex items-center gap-2 transition-colors"
                    >
                        💾 Save Configuration
                    </button>
                </div>

            </div>
        </div>
    );
};
