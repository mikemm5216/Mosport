import { useState } from 'react';
import { VenueImage } from './VenueImage';
import { Button } from '../Button';
import { Badge } from '../ui/Badge';
import { MapPin, Tv, Flame, History, ExternalLink, Star, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useLoginModal } from '../../stores/useLoginModal';

// --- New Interface for AI Match Data ---
interface MatchScoop {
    eventName: string;       // e.g., "Man City vs Arsenal"
    hypeText: string;        // AI generated: "Title decider! Top 2 clash..."
    h2hRecord: string;       // AI generated: "Last 5: City 3W, Arsenal 1W, 1D"
    newsLink: string;        // URL to reputable source like BBC/ESPN
}

interface VenueListRowProps {
    venue: {
        id: string;
        name: string;
        city: string;
        dist: string;
        rating: number;
        tags: string[];
        is_live: boolean;
        verified: boolean;
        is_saved_by_user?: boolean;
        // The venue now holds active match data if available
        matchData?: MatchScoop | null;
    };
}

export const VenueListRow: React.FC<VenueListRowProps> = ({ venue }) => {
    const { user } = useAuthStore();
    const { openLoginModal } = useLoginModal();
    const { matchData, is_live } = venue;
    const [isSaved, setIsSaved] = useState(venue.is_saved_by_user || false);

    // Dynamic border color: Red if LIVE, Subtle Blue if just showing match info, neutral otherwise
    const borderColor = is_live
        ? 'border-red-500/50 hover:border-red-500 bg-red-950/10'
        : matchData
            ? 'border-blue-500/30 hover:border-blue-400 bg-blue-950/5'
            : 'border-white/5 hover:border-white/20 bg-neutral-950';

    const handleToggleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!user || !user.isAuthenticated) {
            // STRATEGY: Lazy Login - Open the modal
            openLoginModal({
                onSuccess: () => {
                    // Optimistically toggle save after login
                    setIsSaved(true);
                    // TODO: Call API to actually save
                }
            });
            return;
        }

        // If logged in, just toggle
        setIsSaved(!isSaved);
        // TODO: Call API to save/unsave
    };

    return (
        <div className={`
      group relative flex flex-col sm:flex-row items-stretch gap-4 
      p-3 sm:p-4 mb-3 rounded-xl border transition-all duration-300 cursor-pointer
      hover:shadow-lg hover:shadow-black/40
      ${borderColor}
    `}>

            {/* === SAVE BUTTON (Absolute Position Top-Right) === */}
            <button
                onClick={handleToggleSave}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/40 transition-colors z-20 group/heart"
                aria-label={isSaved ? "Unsave venue" : "Save venue"}
            >
                <Heart
                    size={20}
                    className={`transition-all duration-300 ${isSaved
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-400 group-hover/heart:text-white group-hover/heart:scale-110"
                        }`}
                />
            </button>

            {/* 1. LEFT: VIBE IMAGE (7:4 Aspect Ratio) */}
            <div className="w-full sm:w-[140px] shrink-0 self-start">
                <VenueImage venue={venue} className="rounded-lg shadow-sm" />
            </div>

            {/* 2. MIDDLE: MAIN CONTENT COLUMN */}
            <div className="flex-1 min-w-0 flex flex-col gap-3">

                {/* A. Venue Header (Name & Rating) */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-300 transition-colors leading-tight">
                            {venue.name}
                        </h3>
                        {venue.verified && (
                            <Badge variant="default" className="text-[10px] px-1 py-0 h-5 bg-blue-500/20 text-blue-200 border-blue-500/30">
                                VERIFIED
                            </Badge>
                        )}
                    </div>
                    {/* Rating moved to top right for cleaner look */}
                    <div className="flex items-center text-yellow-500 text-sm font-bold gap-1 mr-10">
                        <Star size={14} fill="currentColor" /> {venue.rating.toFixed(1)}
                    </div>
                </div>

                {/* === B. THE AI MATCH SCOOP (THE NEW CORE SECTION) === */}
                {/* Only render if match data exists */}
                {matchData && (
                    <div className={`
            flex flex-col gap-2 p-3 rounded-lg border
            ${is_live ? 'bg-red-500/10 border-red-500/20' : 'bg-neutral-900/60 border-white/10'}
          `}>
                        {/* Match Title & Status */}
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Tv size={16} className={is_live ? "text-red-500 animate-pulse" : "text-blue-400"} />
                            <span>{matchData.eventName}</span>
                            {is_live && <Badge className="bg-red-600 hover:bg-red-700 text-[10px] animate-pulse ml-auto">LIVE NOW</Badge>}
                        </div>

                        {/* The Hype & Data Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
                            {/* Hype Text */}
                            <div className="flex gap-2 text-gray-200 leading-snug">
                                <Flame size={16} className="text-orange-500 shrink-0 mt-0.5" />
                                <p>{matchData.hypeText}</p>
                            </div>

                            {/* H2H Record */}
                            <div className="flex gap-2 text-gray-300">
                                <History size={16} className="text-purple-400 shrink-0 mt-0.5" />
                                <p>{matchData.h2hRecord}</p>
                            </div>
                        </div>

                        {/* News Link */}
                        {matchData.newsLink && (
                            <a
                                href={matchData.newsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 w-fit mt-1 group/link"
                            >
                                Read Match Preview <ExternalLink size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                            </a>
                        )}
                    </div>
                )}
                {/* === END MATCH SCOOP === */}

                {/* C. Venue Footer (Location & Tags) */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={14} /> {venue.city} • {venue.dist}
                    </div>

                    {/* Tags - Compact View */}
                    <div className="flex flex-wrap gap-1.5">
                        {venue.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={`${tag}-${idx}`} variant="outline" className="bg-black/40 border-white/5 text-gray-400 text-[10px] px-1.5">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. RIGHT: ACTION BUTTON (Always visible on desktop, bottom on mobile) */}
            <div className="sm:self-center sm:shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                <Button
                    className={`w-full sm:w-[120px] font-bold shadow-md text-sm px-4 py-2
            ${is_live
                            ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border-0'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}
          `}
                >
                    {is_live ? '📺 JOIN LIVE' : 'VIEW SPOT'}
                </Button>
            </div>

        </div>
    );
};
