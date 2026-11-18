import React, { useState } from 'react';
import { Match, Team, Player, MatchEvent, Language } from '../types/tournament';
import { getTranslation } from '../utils/translations';
import { X, Plus, Minus, CheckCircle, AlertTriangle, ShieldCheck, Clock, User, Flag, Save } from 'lucide-react';

interface ScorekeeperDeskProps {
  match: Match | null;
  teams: Team[];
  players: Player[];
  lang: Language;
  onClose: () => void;
  onUpdateMatch: (updatedMatch: Match) => void;
}

export const ScorekeeperDesk: React.FC<ScorekeeperDeskProps> = ({
  match,
  teams,
  players,
  lang,
  onClose,
  onUpdateMatch,
}) => {
  if (!match) return null;

  const home = teams.find((t) => t.id === match.homeTeamId);
  const away = teams.find((t) => t.id === match.awayTeamId);

  const homePlayers = players.filter((p) => p.teamId === match.homeTeamId);
  const awayPlayers = players.filter((p) => p.teamId === match.awayTeamId);

  // Local state for desk
  const [homeScore, setHomeScore] = useState(match.score.home);
  const [awayScore, setAwayScore] = useState(match.score.away);
  const [currentMinute, setCurrentMinute] = useState(match.currentMinute || 45);
  const [currentPeriod, setCurrentPeriod] = useState(match.currentPeriod || '2nd Half');
  const [matchStatus, setMatchStatus] = useState(match.status);
  const [isProvisional, setIsProvisional] = useState(match.isProvisional);
  const [events, setEvents] = useState<MatchEvent[]>(match.events || []);

  // Event modal state
  const [eventTeamId, setEventTeamId] = useState(match.homeTeamId);
  const [eventType, setEventType] = useState<'goal' | 'yellow_card' | 'red_card' | 'substitution'>('goal');
  const [eventPlayerName, setEventPlayerName] = useState('');
  const [eventMinute, setEventMinute] = useState(currentMinute);
  const [eventNotes, setEventNotes] = useState('');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const playerName = eventPlayerName || (eventTeamId === match.homeTeamId ? homePlayers[0]?.fullName : awayPlayers[0]?.fullName) || 'Player';

    const newEvent: MatchEvent = {
      id: `evt_${Date.now()}`,
      matchId: match.id,
      minute: Number(eventMinute),
      period: currentPeriod,
      type: eventType,
      teamId: eventTeamId,
      playerName,
      notes: eventNotes || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextEvents = [...events, newEvent];
    setEvents(nextEvents);

    // Auto increment score if it was a goal
    if (eventType === 'goal') {
      if (eventTeamId === match.homeTeamId) setHomeScore((s) => s + 1);
      else setAwayScore((s) => s + 1);
    }

    setEventNotes('');
  };

  const handleSaveAndConfirm = (markAsOfficial: boolean = false) => {
    const updated: Match = {
      ...match,
      score: { home: homeScore, away: awayScore },
      currentMinute,
      currentPeriod,
      status: markAsOfficial ? 'completed' : matchStatus,
      isProvisional: !markAsOfficial,
      events,
    };
    onUpdateMatch(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scorekeeper-desk-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-slate-100 my-8">
        <button
          onClick={onClose}
          aria-label="Close scorekeeper dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Scorekeeper & Referee Terminal
          </div>
          <h3 id="scorekeeper-desk-title" className="text-xl md:text-2xl font-bold text-white">
            Live Match Control: {home?.shortName} vs {away?.shortName}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time score recording, disciplinary cards logging, and official result validation.
          </p>
        </div>

        {/* Score & Period Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Home Score */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">{home?.name}</span>
            <div className="text-4xl font-black font-mono text-emerald-400 my-2">{homeScore}</div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setHomeScore((s) => Math.max(0, s - 1))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setHomeScore((s) => s + 1)}
                className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clock & Period */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Match Clock & Period</span>
              <div className="flex items-center justify-center gap-2 my-2">
                <input
                  type="number"
                  min="0"
                  max="130"
                  value={currentMinute}
                  onChange={(e) => setCurrentMinute(Number(e.target.value))}
                  className="w-16 text-center font-mono text-2xl font-black bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 py-1"
                />
                <span className="text-lg font-mono text-slate-400">'</span>
              </div>
            </div>

            <select
              value={currentPeriod}
              onChange={(e) => setCurrentPeriod(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-750 rounded-lg p-2 text-white"
            >
              <option value="1st Half">1st Half</option>
              <option value="Half Time">Half Time</option>
              <option value="2nd Half">2nd Half</option>
              <option value="Extra Time 1">Extra Time 1</option>
              <option value="Extra Time 2">Extra Time 2</option>
              <option value="Penalties">Penalty Shootout</option>
            </select>
          </div>

          {/* Away Score */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">{away?.name}</span>
            <div className="text-4xl font-black font-mono text-emerald-400 my-2">{awayScore}</div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setAwayScore((s) => Math.max(0, s - 1))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setAwayScore((s) => s + 1)}
                className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Match Event Form */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Flag className="w-4 h-4 text-emerald-400" />
            Record Live Match Event (Goal, Card, Substitution)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-3">
            <div>
              <label className="block text-slate-400 mb-1">Team</label>
              <select
                value={eventTeamId}
                onChange={(e) => setEventTeamId(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
              >
                <option value={match.homeTeamId}>{home?.name}</option>
                <option value={match.awayTeamId}>{away?.name}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
              >
                <option value="goal">⚽ Goal Scored</option>
                <option value="yellow_card">🟨 Yellow Card</option>
                <option value="red_card">🟥 Red Card</option>
                <option value="substitution">🔄 Substitution</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Player</label>
              <select
                value={eventPlayerName}
                onChange={(e) => setEventPlayerName(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
              >
                <option value="">Select Squad Player...</option>
                {(eventTeamId === match.homeTeamId ? homePlayers : awayPlayers).map((p) => (
                  <option key={p.id} value={p.fullName}>
                    #{p.jerseyNumber} {p.fullName} ({p.position})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Minute</label>
              <input
                type="number"
                min="1"
                max="130"
                value={eventMinute}
                onChange={(e) => setEventMinute(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Incident notes (e.g. Header from corner kick / reckless tackle)..."
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
            />
            <button
              type="button"
              onClick={handleAddEvent}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Event
            </button>
          </div>
        </div>

        {/* Existing Events Feed */}
        <div className="mb-6 max-h-36 overflow-y-auto space-y-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Recorded Events ({events.length})
          </span>
          {events.map((evt) => (
            <div key={evt.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="flex items-center gap-2">
                <strong className="text-emerald-400 font-mono">{evt.minute}'</strong>
                <span>{evt.type === 'goal' ? '⚽' : evt.type === 'yellow_card' ? '🟨' : '🟥'}</span>
                <span className="text-white font-medium">{evt.playerName}</span>
                {evt.notes && <span className="text-slate-400 text-[11px]">({evt.notes})</span>}
              </span>
              <button
                type="button"
                onClick={() => setEvents(events.filter((e) => e.id !== evt.id))}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSaveAndConfirm(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Provisional Score
            </button>
            <button
              type="button"
              onClick={() => handleSaveAndConfirm(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {getTranslation(lang, 'approveResult')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
