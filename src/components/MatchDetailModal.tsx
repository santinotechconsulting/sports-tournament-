import React from 'react';
import { Match, Team, Venue, Official, Language, UserRole } from '../types/tournament';
import { getTranslation } from '../utils/translations';
import { X, MapPin, Calendar, Clock, UserCheck, Shield, Award, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  teams: Team[];
  venues: Venue[];
  officials: Official[];
  lang: Language;
  currentRole: UserRole;
  onOpenScorekeeper: (match: Match) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  teams,
  venues,
  officials,
  lang,
  currentRole,
  onOpenScorekeeper,
}) => {
  if (!match) return null;

  const home = teams.find((t) => t.id === match.homeTeamId);
  const away = teams.find((t) => t.id === match.awayTeamId);
  const venue = venues.find((v) => v.id === match.venueId);
  const referee = officials.find((o) => o.id === match.refereeId);
  const scorekeeper = officials.find((o) => o.id === match.scorekeeperId);

  const canEditScore =
    currentRole === 'super_admin' ||
    currentRole === 'org_admin' ||
    currentRole === 'tournament_manager' ||
    currentRole === 'referee' ||
    currentRole === 'scorekeeper';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto max-h-[94dvh] flex flex-col">
        {/* Header bar */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 border-b border-slate-800 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <span>Match #{match.matchNumber}</span>
            <span>•</span>
            <span>{match.stage.replace('_', ' ')}</span>
            {match.group && (
              <>
                <span>•</span>
                <span>{match.group}</span>
              </>
            )}
          </div>

          {/* Big Scoreboard */}
          <div className="grid grid-cols-3 items-center gap-2 py-3 sm:py-4">
            {/* Home Team */}
            <div className="text-center space-y-1.5 sm:space-y-2 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
                {home?.logo || '🛡️'}
              </div>
              <h3 className="font-bold text-xs sm:text-base md:text-lg text-white leading-tight break-words">
                {home?.name || 'Home Team'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">{home?.city}, {home?.country}</p>
            </div>

            {/* Score in middle */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-emerald-400">
                  {match.score.home}
                </span>
                <span className="text-xl sm:text-2xl font-light text-slate-500">:</span>
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-emerald-400">
                  {match.score.away}
                </span>
              </div>

              <div className="mt-3">
                {match.status === 'in_progress' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {match.currentMinute ? `${match.currentMinute}'` : 'LIVE'} ({match.currentPeriod || '2nd Half'})
                  </span>
                ) : match.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> FULL TIME
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono text-xs font-semibold border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" /> {match.scheduledDate} • {match.scheduledTime}
                  </span>
                )}
              </div>

              {match.isProvisional && (
                <p className="text-[11px] text-amber-400 mt-2 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Provisional
                </p>
              )}
            </div>

            {/* Away Team */}
            <div className="text-center space-y-1.5 sm:space-y-2 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
                {away?.logo || '🛡️'}
              </div>
              <h3 className="font-bold text-xs sm:text-base md:text-lg text-white leading-tight break-words">
                {away?.name || 'Away Team'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">{away?.city}, {away?.country}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">
          {/* Match events timeline */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              {getTranslation(lang, 'liveEventsTimeline')}
            </h4>

            {match.events.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                No goals or card events recorded yet for this fixture.
              </div>
            ) : (
              <div className="space-y-2.5">
                {match.events.map((evt) => {
                  const isHome = evt.teamId === match.homeTeamId;
                  return (
                    <div
                      key={evt.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${
                        evt.type === 'goal'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : evt.type === 'red_card'
                          ? 'bg-red-500/10 border-red-500/30 text-red-200'
                          : evt.type === 'yellow_card'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-mono font-bold text-sm text-emerald-400 w-10 shrink-0">
                        {evt.minute}'
                      </span>
                      <span className="text-base shrink-0">
                        {evt.type === 'goal'
                          ? '⚽'
                          : evt.type === 'yellow_card'
                          ? '🟨'
                          : evt.type === 'red_card'
                          ? '🟥'
                          : evt.type === '3pt'
                          ? '🎯'
                          : '⏱️'}
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-white">{evt.playerName}</span>
                        <span className="text-slate-400 ml-2">({isHome ? home?.shortName : away?.shortName})</span>
                        {evt.notes && <p className="text-[11px] text-slate-300 mt-0.5">{evt.notes}</p>}
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">{evt.period}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Match Details & Officials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] font-bold block mb-1">
                Facility & Match Info
              </span>
              <p className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{venue?.name || 'Japoma Stadium'}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{match.scheduledDate} at {match.scheduledTime}</span>
              </p>
              {match.attendance && (
                <p className="text-slate-400">
                  Official Attendance: <strong className="text-slate-200">{match.attendance.toLocaleString()} spectators</strong>
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] font-bold block mb-1">
                Match Officials
              </span>
              <p className="text-slate-200">
                Main Referee: <strong className="text-emerald-400">{referee?.name || 'Sidi Alioum (FIFA)'}</strong>
              </p>
              {scorekeeper && (
                <p className="text-slate-300">
                  Official Scorekeeper: <span>{scorekeeper.name}</span>
                </p>
              )}
              {match.officialMatchReport && (
                <p className="text-slate-400 text-[11px] italic mt-1">
                  Report: "{match.officialMatchReport}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Close
          </button>

          {canEditScore && (
            <button
              onClick={() => {
                onClose();
                onOpenScorekeeper(match);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Live Scorekeeper Desk
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
