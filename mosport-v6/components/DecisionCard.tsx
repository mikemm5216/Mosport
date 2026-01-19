import React from 'react';
import { DecisionSignal, UserRole, Venue } from '../types';
import { Button } from './Button';
import { VLEAGUE_TEAM_LINKS, FALLBACK_VENUE_IMAGE } from '../constants';

interface DecisionCardProps {
  signal: DecisionSignal;
  userRole: UserRole;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ signal, userRole }) => {
  // If VENUE role, we might want to show "Claim this event"
  const isVenueRole = userRole === UserRole.VENUE;

  // VC Feature: Mock "Live Interest" count based on probability to create Social Proof
  const liveInterestCount = Math.floor(signal.matchedVenues[0]?.matchProbability * 40) + 5;

  const handleBookTable = (e: React.MouseEvent, venue: Venue) => {
    e.stopPropagation();
    
    // Check for direct Google Map URL (e.g. for Puku)
    if (venue.googleMapUrl) {
        window.open(venue.googleMapUrl, '_blank');
        return;
    }

    const query = encodeURIComponent(`${venue.name} ${venue.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleBuyTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { league, title, teamA } = signal.event;
    let url = '';
    
    // Logic: V.League -> Check specific Team A (Home Team) Link -> Fallback to VPF -> FB Home Page
    if (league.includes('V.League')) {
       // Try to find the official page for the Home Team
       const homeTeamUrl = VLEAGUE_TEAM_LINKS[teamA];
       if (homeTeamUrl) {
          url = homeTeamUrl;
       } else {
          url = 'https://www.facebook.com/VPFProfessionalFootball'; 
       }
    } else {
       // Others -> Official Website (via Search)
       url = `https://www.google.com/search?q=${encodeURIComponent(title + ' official tickets')}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="bg-mosport-card rounded-xl border border-gray-800 overflow-hidden mb-6 transition-all hover:border-gray-700">
      
      {/* Header: Event Info */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gradient-to-r from-gray-900 to-mosport-card">
        <div className="flex gap-4">
           {/* Time Box Removed */}

           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded">
                   {signal.event.league}
                 </span>
                 {signal.event.isHot && (
                   <span className="flex items-center text-[10px] font-bold text-yellow-500 uppercase tracking-wider gap-1 animate-pulse">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                       <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                     </svg>
                     Big Game Alert
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

        <Button 
          variant="outline" 
          className="text-xs h-8 px-3 border-gray-600 hover:border-yellow-500 hover:text-yellow-500" 
          onClick={handleBuyTicket}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v9.651c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
            Buy Ticket
        </Button>
      </div>

      {/* Body: Matched Venues (Layer B Output) */}
      <div className="border-t border-gray-800">
        <div className="px-4 py-2 bg-gray-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-gray-500 uppercase">
                 {signal.matchedVenues.length} Verified Spots
               </span>
               {!isVenueRole && (
                 <span className="flex items-center gap-1 text-[9px] text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded-full border border-blue-900/30">
                   <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                   </span>
                   {liveInterestCount} fans looking
                 </span>
               )}
            </div>
            {isVenueRole && <span className="text-[10px] font-bold text-mosport-venue">VENUE MODE: SHOWING RANKING</span>}
        </div>

        <div className="divide-y divide-gray-800">
          {signal.matchedVenues.slice(0, 6).map((match, idx) => (
            <div key={match.venue.id} className="p-4 flex gap-4 hover:bg-white/5 transition-colors group cursor-pointer">
              {/* Venue Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                 <img 
                    src={match.venue.imageUrl} 
                    alt={match.venue.name} 
                    loading="lazy" // Performance optimization
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                    onError={(e) => {
                      // Logic Fix: Use centralized constant and avoid loop
                      e.currentTarget.src = FALLBACK_VENUE_IMAGE;
                      e.currentTarget.onerror = null; 
                    }}
                 />
              </div>

              {/* Venue Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                        {match.venue.name}
                        <span className="ml-2 text-xs font-normal text-gray-500">@{match.venue.location}</span>
                      </h4>
                      
                      {/* Verification Badge */}
                      <div className="flex items-center gap-2 mt-1">
                        {match.verificationStatus === 'VERIFIED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-mosport-success bg-mosport-success/10 px-1.5 py-0.5 rounded border border-mosport-success/20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            VERIFIED
                          </span>
                        )}
                        {match.verificationStatus === 'ON_REQUEST' && (
                           <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gray-700 px-1.5 py-0.5 rounded">
                             <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                             ON REQUEST
                           </span>
                        )}
                        
                        {/* QoE Tags (Quality of Experience) */}
                        <div className="flex gap-1 ml-2">
                          {match.venue.tags.map(tag => (
                             <span key={tag.id} className="text-[9px] px-1 rounded border border-gray-700 text-gray-400">
                               {tag.label}
                             </span>
                          ))}
                        </div>
                      </div>
                   </div>

                   <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-yellow-500 text-xs font-bold">
                        <span>★</span>
                        <span>{match.venue.rating}</span>
                      </div>
                      
                      {isVenueRole ? (
                        <div className="mt-2 text-mosport-venue font-mono text-xs">
                           Prob: {(match.matchProbability * 100).toFixed(0)}%
                        </div>
                      ) : (
                        <Button 
                           variant="primary"
                           className="mt-2 text-xs py-1 px-3 h-8"
                           onClick={(e) => handleBookTable(e, match.venue)}
                        >
                           Book Table
                        </Button>
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