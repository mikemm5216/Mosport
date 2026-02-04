import React, { useState } from 'react';
import { VenueImage } from './VenueImage';
import { Button } from '../Button';
import { Badge } from '../ui/Badge';
import { MapPin, Tv, Flame, History, ExternalLink, ChevronDown, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useLoginModal } from '../../stores/useLoginModal';
import { apiClient } from '../../services/api';

// --- AI Match Data Interface ---
interface MatchScoop {
    eventName: string;       // "Man City vs Arsenal"
    hypeText: string;        // "Title decider! Top 2 clash..." (看點)
    h2hRecord: string;       // "Last 5: City 3W, Arsenal 1W..." (勝負紀錄)
    newsLink: string;        // URL to preview (新聞連結)
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
        fan_base?: string;
        // The venue now holds active match data if available
        matchData?: MatchScoop | null;
    };
}

export const VenueListRow: React.FC<VenueListRowProps> = ({ venue }) => {
    const { user } = useAuthStore();
    const { openLoginModal } = useLoginModal();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSaved, setIsSaved] = useState(venue.is_saved_by_user || false);
    const { matchData, is_live } = venue;

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!user || !user.isAuthenticated || user.isGuest) {
            // STRATEGY: Lazy Login - Open the modal
            openLoginModal({
                onSuccess: () => {
                    setIsSaved(true);
                }
            });
            return;
        }

        if (isSaved) {
            // Unsave
            // We need favoriteId to delete. If we don't have it (e.g. freshly toggled), we might have an issue.
            // For now, let's assume this component is used in a context where we might not have the ID immediately if just toggled
            // But if loaded from Favorites list, we should have it.
            // As a simplification for this 'Solo-Dev' stage, we might need a lookup or just handle 'create' efficiently.
            // Actually, best user experience: Optimistic UI update (already done via setIsSaved)
            // Then background call.
            // BUT delete requires ID. createFavorite returns ID.
            // To simplify: We will just support adding for now, or we need to manage the favorite ID state.
            // Let's rely on backend check logic if we really wanted to be robust, but here:
            // logic: createFavorite handles "already favorited" by error?
            // Let's implement create only for 'Save', and for 'Unsave'... we need the favorite ID.
            // If we lack the favorite ID, we can't delete easily without a "delete by target" endpoint.
            // Let's check api.ts... deleteFavorite takes ID.
            // OK, for this iteration, let's support SAVE (Create). Unsave from list might need ID.
            // Refactoring VenueListRow to accept favoriteId?
            try {
                // Check if favorited first? No, too slow.
                // We'll just try to create.
                if (!isSaved) { // User wants to save (currentState is !isSaved because we just toggled? No, logic above is inverted)
                    // Wait, lines 54 setIsSaved(!isSaved).
                    // So if it WAS saved, isSaved becomes false.
                }
            } catch (e) { }
        }

        // Improved Logic:
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);

        try {
            if (newSavedState) {
                await apiClient.createFavorite({
                    target_type: 'venue',
                    target_id: venue.id
                });
            } else {
                // To unsave, we need the favorite ID.
                // This is a limitation of the current row if it doesn't get the fav ID.
                // We can fetch it via checkIsFavorited
                const check = await apiClient.checkIsFavorited('venue', venue.id) as { is_favorited: boolean; favorite_id?: string };
                if (check.is_favorited && check.favorite_id) {
                    await apiClient.deleteFavorite(check.favorite_id);
                }
            }
        } catch (error) {
            console.error('Favorite toggle failed', error);
            // Revert state on error
            setIsSaved(!newSavedState);
        }
    };

    const handleRowClick = () => {
        // Only toggle if there's match data to show
        if (matchData) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div
            onClick={handleRowClick}
            className={`
        group relative flex flex-col gap-0 
        mb-3 rounded-xl border transition-all duration-300 overflow-hidden
        ${is_live
                    ? 'bg-neutral-900/90 border-red-500/40 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                    : 'bg-neutral-950 border-white/5 hover:border-white/20 hover:bg-neutral-900'}
        ${matchData ? 'cursor-pointer' : 'cursor-default'}
      `}
        >
            {/* === SAVE BUTTON (Absolute Position Top-Right) === */}
            <button
                onClick={handleToggleSave}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/40 transition-colors z-20 group/heart"
                aria-label={isSaved ? "Unsave venue" : "Save venue"}
            >
                <Heart
                    size={18}
                    className={`transition-all duration-300 ${isSaved
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-400 group-hover/heart:text-white group-hover/heart:scale-110"
                        }`}
                />
            </button>

            {/* === TOP ROW: COMPACT SUMMARY (Always Visible) === */}
            <div className="flex flex-row items-center gap-4 p-3 sm:p-4">

                {/* 1. Image (Thumbnail) */}
                <div className="w-[80px] sm:w-[100px] shrink-0">
                    <VenueImage venue={venue} className="h-14 sm:h-16 w-full rounded-md object-cover" />
                </div>

                {/* 2. Main Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white truncate leading-tight">
                            {venue.name}
                        </h3>
                        {venue.verified && (
                            <Badge variant="default" className="text-[10px] px-1 py-0 h-4 bg-blue-500/20 text-blue-200 border-blue-500/30">
                                VERIFIED
                            </Badge>
                        )}
                        {/* V6.2 Fan Base Badge */}
                        {venue.fan_base && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-yellow-500/50 text-yellow-400">
                                {venue.fan_base}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        {is_live ? (
                            <span className="flex items-center gap-1 text-red-400 font-medium animate-pulse">
                                <Tv size={12} /> {matchData?.eventName || "Live Sport"}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <MapPin size={12} /> {venue.city} • {venue.dist}
                            </span>
                        )}
                    </div>
                </div>

                {/* 3. Expand Trigger / Tags */}
                <div className="shrink-0 flex items-center gap-3 mr-8">
                    {/* Tags (Hidden on mobile) */}
                    <div className="hidden sm:flex gap-1">
                        {venue.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={`${tag}-${idx}`} variant="outline" className="text-[10px] border-white/10 text-gray-500 bg-black/20">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Chevron - only show if has match data */}
                    {matchData && (
                        <ChevronDown
                            size={20}
                            className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`}
                        />
                    )}
                </div>
            </div>

            {/* === EXPANDABLE CONTENT: THE AI SCOOP === */}
            <div className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isExpanded && matchData ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
                {matchData && (
                    <div className="p-4 pt-0 border-t border-white/5 bg-black/20">

                        {/* THE SCOOP GRID */}
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* A. HYPE (看點) */}
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1">
                                    <Flame size={12} className="text-orange-500" /> Match Hype
                                </span>
                                <p className="text-sm text-gray-200 leading-relaxed">
                                    {matchData.hypeText}
                                </p>
                            </div>

                            {/* B. H2H RECORD (對戰紀錄) */}
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1">
                                    <History size={12} className="text-purple-500" /> Head-to-Head
                                </span>
                                <p className="text-sm text-gray-300 font-mono">
                                    {matchData.h2hRecord}
                                </p>
                            </div>
                        </div>

                        {/* C. BOTTOM ACTIONS */}
                        <div className="mt-4 flex items-center justify-between">
                            {matchData.newsLink && (
                                <a
                                    href={matchData.newsLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Read Match Preview <ExternalLink size={12} />
                                </a>
                            )}

                            <Button
                                className={`font-bold text-sm ${is_live
                                    ? 'bg-red-600 hover:bg-red-500 text-white'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Navigate to venue details
                                }}
                            >
                                {is_live ? '📺 JOIN LIVE NOW' : 'View Venue Details'}
                            </Button>
                        </div>

                    </div>
                )}
            </div>

        </div>
    );
};
