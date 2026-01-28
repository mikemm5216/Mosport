import { MouseEvent } from 'react';
import { Button as ButtonComp } from './Button';
import { DecisionSignal, UserRole } from '../types';
import { FALLBACK_VENUE_IMAGE, VLEAGUE_TEAM_LINKS } from '../constants';
import { MapPin, Star, Shield, Clock, Coffee } from 'lucide-react';

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
                    {signal.matchedVenues.slice(0, 6).map((match) => (
                        <div key={match.venue.id} className="p-4 flex gap-4 hover:bg-white/5 transition-colors group cursor-pointer">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                <img
                                    src={match.venue.imageUrl}
                                    alt={match.venue.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    onError={(e: any) => { e.currentTarget.src = FALLBACK_VENUE_IMAGE; }}
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
                                                {/* Logic: Show if venue opens early for NBA/NFL and breakfast is available */}
                                                {match.venue.features?.broadcast_capabilities?.special_hours?.open_early_for_nba &&
                                                    match.venue.features?.broadcast_capabilities?.amenities?.breakfast_available && (
                                                        <div className="flex items-center gap-1 text-[10px] bg-amber-900/40 text-amber-200 px-1.5 py-0.5 rounded border border-amber-800/50">
                                                            <Coffee className="w-3 h-3" />
                                                            <span>Breakfast</span>
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="flex gap-1 ml-2 flex-wrap">
                                                {match.venue.tags.map(tag => {
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
                                        {isVenueRole ? (
                                            <div className="mt-2 text-mosport-venue font-mono text-xs">
                                                Prob: {(match.matchProbability * 100).toFixed(0)}%
                                            </div>
                                        ) : (
                                            <ButtonComp variant="primary" className="mt-2 text-xs py-1 px-3 h-8" onClick={(e: any) => {
                                                e.stopPropagation();
                                                // Open Google Maps directly without login
                                                const { googleMapUrl, name, location } = match.venue;
                                                if (googleMapUrl) {
                                                    window.open(googleMapUrl, '_blank');
                                                } else {
                                                    const query = encodeURIComponent(`${name} ${location}`);
                                                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                                                }
                                            }}>
                                                Book Table
                                            </ButtonComp>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
