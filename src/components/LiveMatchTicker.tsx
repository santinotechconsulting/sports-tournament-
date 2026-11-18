import React, { useState } from 'react';
import { Match, Team, Venue, MatchEvent, Language } from '../types/tournament';
import { getTranslation } from '../utils/translations';
import { Activity, Clock, MapPin, ShieldAlert, Award, ChevronRight, X, AlertTriangle } from 'lucide-react';

interface LiveMatchTickerProps {
  matches: Match[];
  teams: Team[];
  venues: Venue[];
  lang: Language;
  onOpenMatchModal: (match: Match) => void;
}

export const LiveMatchTicker: React.FC<LiveMatchTickerProps> = ({
  matches,
  teams,
  venues,
  lang,
  onOpenMatchModal,
}) => {
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  const venueMap = new Map(venues.map((v) => [v.id, v]));

  const liveMatches = matches.filter((m) => m.status === 'in_progress');
  const recentCompleted = matches.filter((m) => m.status === 'completed').slice(-2);

  if (liveMatches.length === 0 && recentCompleted.length === 0) {
    return null;
  }

  return (
    <section aria-label="Live Match Center" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">
            {getTranslation(lang, 'liveScoresLive')}
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {liveMatches.length} Live Match{liveMatches.length > 1 ? 'es' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveMatches.map((match) => {
          const home = teamMap.get(match.homeTeamId);
          const away = teamMap.get(match.awayTeamId);
          const venue = venueMap.get(match.venueId);

          return (
            <div
              key={match.id}
              onClick={() => onOpenMatchModal(match)}
              className="group relative bg-gradient-to-br from-slate-900 to-slate-900/90 hover:from-slate-850 hover:to-slate-800 border border-emerald-500/40 rounded-2xl p-5 shadow-lg shadow-emerald-950/20 cursor-pointer transition-all hover:scale-[1.01] hover:border-emerald-400"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {match.currentMinute ? `${match.currentMinute}'` : 'LIVE'} • {match.currentPeriod || '2nd Half'}
                </span>
                <span className="flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  {venue?.name || 'Main Arena'}
                </span>
              </div>

              {/* Scoreboard */}
              <div className="space-y-3 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{home?.logo || '🛡️'}</span>
                    <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {home?.name || 'Home Team'}
                    </span>
                  </div>
                  <span className="text-2xl font-black font-mono text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-500/10">
                    {match.score.home}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{away?.logo || '🛡️'}</span>
                    <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {away?.name || 'Away Team'}
                    </span>
                  </div>
                  <span className="text-2xl font-black font-mono text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-500/10">
                    {match.score.away}
                  </span>
                </div>
              </div>

              {/* Latest Match Event Badge */}
              {match.events.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="truncate text-slate-400 text-[11px]">
                    <strong className="text-emerald-400">{match.events[match.events.length - 1].minute}'</strong>{' '}
                    {match.events[match.events.length - 1].type.toUpperCase()}: {match.events[match.events.length - 1].playerName}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          );
        })}

        {/* Recently completed matches for quick reference */}
        {recentCompleted.map((match) => {
          const home = teamMap.get(match.homeTeamId);
          const away = teamMap.get(match.awayTeamId);

          return (
            <div
              key={match.id}
              onClick={() => onOpenMatchModal(match)}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
                  FULL TIME (FT)
                </span>
                <span className="text-[11px] text-slate-500">{match.scheduledDate}</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200 truncate pr-2">
                    {home?.logo} {home?.name}
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-100">{match.score.home}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200 truncate pr-2">
                    {away?.logo} {away?.name}
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-100">{match.score.away}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Official & Confirmed Result</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
