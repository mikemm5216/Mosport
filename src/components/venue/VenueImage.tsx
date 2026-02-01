
// src/components/venue/VenueImage.tsx
import React, { useMemo } from 'react';
import { getVibeImage } from '../../lib/venue-images';
import { cn } from '../../lib/utils';
import { Venue } from '../../types';

interface VenueImageProps {
    venue: Venue;
    className?: string;
}

export const VenueImage: React.FC<VenueImageProps> = ({ venue, className }) => {

    // Logic: Determine which image source to use
    const { displayImage, isAiGenerated } = useMemo(() => {
        // 1. If Verified & Has Custom Photo (Not Google hosted), use it.
        // Note: You can adjust the check if you are now hosting Google photos yourself.
        if (venue.imageUrl && !venue.imageUrl.includes('ui-avatars.com')) {
            return { displayImage: venue.imageUrl, isAiGenerated: false };
        }

        // 2. Fallback: Use Antigravity's Vibe Assets
        return {
            displayImage: getVibeImage(venue.location),
            isAiGenerated: true
        };
    }, [venue]);

    // Mock live status for now, or check if it matches a live event time
    // For demo purposes, we can assume some are live
    const isLive = Math.random() > 0.8;

    return (
        <div className={cn("relative overflow-hidden rounded-md border border-white/10 bg-neutral-900", className)}>
            {/* Aspect Ratio: 7:4 (1.75) 
         Perfect for list density.
      */}
            <div className="aspect-[7/4] w-full relative group">
                <img
                    src={displayImage}
                    alt={venue.name}
                    loading="lazy"
                    className={cn(
                        "h-full w-full object-cover transition-transform duration-700 ease-out",
                        "group-hover:scale-105",
                        isAiGenerated && "brightness-[0.85] contrast-[1.1]" // Cinematic grading for AI images
                    )}
                />

                {/* === OVERLAYS === */}

                {/* A. LIVE Signal (Top Left) */}
                {isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-red-600/90 backdrop-blur-md rounded shadow-lg shadow-red-900/20 z-10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-[10px] font-bold text-white tracking-widest leading-none">LIVE</span>
                    </div>
                )}

                {/* B. Vibe Badge (Bottom Right - Subtle) */}
                {isAiGenerated && (
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded border border-white/5">
                        <p className="text-[9px] text-white/50 font-mono uppercase tracking-tighter flex items-center gap-1">
                            VIBE CONCEPT
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
