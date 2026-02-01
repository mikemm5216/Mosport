import { MouseEvent } from 'react';
import * as React from 'react';
import { Button as ButtonComp } from './Button';
import { DecisionSignal, UserRole } from '../types';
import { VLEAGUE_TEAM_LINKS } from '../constants';
import { MapPin, Coffee, Tv, ExternalLink } from 'lucide-react';
import { VenueImage } from './venue/VenueImage';

interface DecisionCardProps {
    signal: DecisionSignal;
    userRole: UserRole;
    compact?: boolean;
    // Add active sport filter prop to check context
    activeSport?: string;
}

export const DecisionCard = ({ signal, userRole }: DecisionCardProps) => {
    const isVenueRole = userRole === UserRole.VENUE;



    const handleBuyTicket = (e: MouseEvent) => {
        e.stopPropagation();
        const { league, title, teamA } = signal.event;
        let url = '';
        if (league.includes('V.League')) {
            const homeTeamUrl = VLEAGUE_TEAM_LINKS[teamA];
            url = homeTeamUrl || 'https://www.facebook.com/VPFProfessionalFootball';
        } else {
            url = `https://www.google.com/search?q=${encodeURIComponent(title + ' official tickets')}`;
        }
        window.open(url, '_blank');
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    return (
        <div className="bg-mosport-card rounded-xl border border-gray-800 overflow-hidden mb-6 transition-all hover:border-gray-700">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gradient-to-r from-gray-900 to-mosport-card">
                <div className="flex gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded">
                                {signal.event.league}
                            </span>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-900/20 px-2 py-0.5 rounded border border-blue-900/30 flex items-center gap-1 ml-2">
                                <span>📅</span> {formatDate(signal.event.startTime)}
                            </span>
                            {signal.event.isHot && (
                                <span className="flex items-center text-[10px] font-bold text-yellow-500 uppercase tracking-wider gap-1 animate-pulse ml-2">
                                    ★ Big Game
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            <span className={signal.event.isHot ? 'text-blue-200' : ''}>{signal.event.teamA}</span>
                            <span className="text-gray-500 mx-2">vs</span>
                            <span className={signal.event.isHot ? 'text-blue-200' : ''}>{signal.event.teamB}</span>
                        </h3>
                    </div>
                </div>
                <ButtonComp variant="outline" className="text-xs h-8 px-3 border-gray-600 hover:border-yellow-500 hover:text-yellow-500" onClick={handleBuyTicket}>
                    Buy Ticket
                </ButtonComp>
            </div>
            <div className="border-t border-gray-800">
                <div className="px-4 py-2 bg-gray-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                            {signal.matchedVenues.length} Verified Spots
                        </span>
                    </div>
                    {isVenueRole && <span className="text-[10px] font-bold text-mosport-venue">VENUE MODE: SHOWING RANKING</span>}
                </div>
                <div className="divide-y divide-gray-800">
                    {signal.matchedVenues.slice(0, 6).map((match) => {
                        const [isExpanded, setIsExpanded] = React.useState(false);

                        // Generate AI Match Intelligence from event data
                        const matchScoop = {
                            eventName: signal.event.title,
                            hypeText: signal.event.isHot
                                ? `🔥 Big Game Alert! ${signal.event.teamA} vs ${signal.event.teamB} - Don't miss this showdown!`
                                : `${signal.event.teamA} takes on ${signal.event.teamB} in ${signal.event.league}`,
                            h2hRecord: signal.event.isHot
                                ? "High-stakes matchup - Check live odds and stats"
                                : "Competitive fixture - Tune in for the action",
                            newsLink: `https://www.google.com/search?q=${encodeURIComponent(signal.event.title + ' preview')}`
                        };

                        return (
                            <div
                                key={match.venue.id}
                                className="flex flex-col overflow-hidden transition-all duration-300 cursor-pointer hover:bg-white/5"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {/* === COMPACT ROW (Always Visible) === */}
                                <div className="p-4 flex gap-4 group">
                                    {/* Updated to support 7:4 aspect ratio */}
                                    <div className="relative w-28 sm:w-36 flex-shrink-0">
                                        <VenueImage
                                            venue={match.venue}
                                            className="w-full shadow-lg"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                    {match.venue.name}
                                                    <span className="ml-2 text-xs font-normal text-gray-500">@{match.venue.location}</span>
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {match.verificationStatus === 'VERIFIED' && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                                                            <span>🤖</span> AI CONFIRMED
                                                        </span>
                                                    )}
                                                    {match.verificationStatus === 'ON_REQUEST' && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20">
                                                            <span>⏳</span> PENDING CHECK
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center text-xs text-gray-400">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {match.venue.location} • {match.venue.distance}
                                                        </div>

                                                        {/* V6.5 Feature: Breakfast Indicator */}
                                                        {match.venue.features?.broadcast_capabilities?.special_hours?.open_early_for_nba &&
                                                            match.venue.features?.broadcast_capabilities?.amenities?.breakfast_available && (
                                                                <div className="flex items-center gap-1 text-[10px] bg-amber-900/40 text-amber-200 px-1.5 py-0.5 rounded border border-amber-800/50">
                                                                    <Coffee className="w-3 h-3" />
                                                                    <span>Breakfast</span>
                                                                </div>
                                                            )}
                                                    </div>
                                                    <div className="flex gap-1 ml-2 flex-wrap">
                                                        {match.venue.tags.slice(0, 2).map(tag => {
                                                            let colorClass = "border-gray-700 text-gray-400";
                                                            if (tag.type === 'BROADCAST') colorClass = "border-pink-500/30 text-pink-400 bg-pink-500/10";
                                                            if (tag.type === 'VIBE') colorClass = "border-cyan-500/30 text-cyan-400 bg-cyan-500/10";
                                                            if (tag.type === 'SURVIVAL') colorClass = "border-green-500/30 text-green-400 bg-green-500/10";

                                                            return (
                                                                <span key={tag.id} className={`text-[9px] px-1.5 rounded border ${colorClass} flex items-center gap-1`}>
                                                                    {tag.label}
                                                                    {tag.confidence > 0.9 && <span className="text-[6px] opacity-70">★</span>}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1 text-yellow-500 text-xs font-bold">
                                                    <span>★</span><span>{match.venue.rating.toFixed(1)}</span>
                                                </div>
                                                {isVenueRole && (
                                                    <div className="mt-2 text-mosport-venue font-mono text-xs">
                                                        Prob: {(match.matchProbability * 100).toFixed(0)}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* === EXPANDABLE AI SCOOP (RemoteOK Style) === */}
                                <div className={`
                                    overflow-hidden transition-all duration-500 ease-in-out
                                    ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                    <div className="px-4 pb-4 border-t border-white/5 bg-black/20">
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Match Hype */}
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1">
                                                    <Tv size={12} className="text-blue-500" /> Match Preview
                                                </span>
                                                <p className="text-sm text-gray-200 leading-relaxed">
                                                    {matchScoop.hypeText}
                                                </p>
                                            </div>

                                            {/* Quick Info */}
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1">
                                                    📊 Quick Info
                                                </span>
                                                <p className="text-sm text-gray-300 font-mono">
                                                    {matchScoop.h2hRecord}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bottom Actions */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <a
                                                href={matchScoop.newsLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Search Match Info <ExternalLink size={12} />
                                            </a>

                                            <ButtonComp
                                                variant="primary"
                                                className="text-xs py-1 px-3 h-8"
                                                onClick={(e: any) => {
                                                    e.stopPropagation();
                                                    const { googleMapUrl, name, location, latitude, longitude } = match.venue;

                                                    if (googleMapUrl) {
                                                        window.open(googleMapUrl, '_blank');
                                                    } else if (latitude && longitude) {
                                                        const query = `${latitude},${longitude}`;
                                                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                                                    } else {
                                                        const query = encodeURIComponent(`${name} ${location}`);
                                                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                                                    }
                                                }}
                                            >
                                                Book Table
                                            </ButtonComp>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
