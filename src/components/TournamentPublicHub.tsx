import React, { useState } from 'react';
import {
  Tournament,
  Team,
  Player,
  Match,
  Venue,
  Announcement,
  TournamentAward,
  Language,
  UserRole,
} from '../types/tournament';
import { getTranslation } from '../utils/translations';
import { calculateStandings } from '../utils/standingsEngine';
import { StandingsTable } from './StandingsTable';
import { KnockoutBracketView } from './KnockoutBracketView';
import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  FileText,
  Share2,
  Award,
  Check,
  ChevronRight,
  Shield,
  Activity,
  User,
  Star,
  ExternalLink,
  Printer,
} from 'lucide-react';

interface TournamentPublicHubProps {
  tournament: Tournament;
  teams: Team[];
  players: Player[];
  matches: Match[];
  venues: Venue[];
  announcements: Announcement[];
  awards: TournamentAward[];
  lang: Language;
  currentRole: UserRole;
  onOpenMatchModal: (match: Match) => void;
  onBack: () => void;
}

export const TournamentPublicHub: React.FC<TournamentPublicHubProps> = ({
  tournament,
  teams,
  players,
  matches,
  venues,
  announcements,
  awards,
  lang,
  currentRole,
  onOpenMatchModal,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'fixtures' | 'standings' | 'brackets' | 'teams' | 'scorers' | 'venues' | 'news'
  >('fixtures');

  const [copied, setCopied] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const tourneyTeams = teams.filter((t) => t.tournamentId === tournament.id);
  const tourneyMatches = matches.filter((m) => m.tournamentId === tournament.id);
  const tourneyPlayers = players.filter((p) => p.tournamentId === tournament.id);
  const tourneyVenues = venues.filter((v) => tournament.venueIds.includes(v.id));
  const tourneyAnnouncements = announcements.filter(
    (a) => !a.tournamentId || a.tournamentId === tournament.id
  );
  const tourneyAwards = awards.filter((a) => a.tournamentId === tournament.id);

  // Standings calculation
  const standings = calculateStandings(tournament, teams, matches);

  // Top scorers calculation
  const sortedScorers = [...tourneyPlayers]
    .filter((p) => p.goalsScored > 0 || p.pointsScored > 0)
    .sort((a, b) => b.goalsScored - a.goalsScored || b.pointsScored - a.pointsScored);

  const sortedTourneyMatches = [...tourneyMatches].sort((a, b) => {
    const dateCompare = `${a.scheduledDate} ${a.scheduledTime}`.localeCompare(
      `${b.scheduledDate} ${b.scheduledTime}`
    );
    return dateCompare !== 0 ? dateCompare : a.matchNumber - b.matchNumber;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-8 print:hidden no-print">
        {/* Back button & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
          >
            ← {getTranslation(lang, 'exploreTournaments')}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintSchedule}
              aria-label={getTranslation(lang, 'printSchedule')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-emerald-500/50 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              {getTranslation(lang, 'printSchedule')}
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  Share Tournament
                </>
              )}
            </button>
          </div>
        </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div
          className="h-48 sm:h-64 md:h-72 w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${tournament.bannerUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="relative -mt-16 sm:-mt-24 p-5 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider">
              {tournament.sportId}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/90 text-slate-200 font-medium text-xs border border-slate-700">
              {tournament.format.replace('_', ' ').toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/90 text-emerald-400 font-medium text-xs border border-slate-700">
              {tournament.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {tournament.name}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              {tournament.city}, {tournament.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {tournament.startDate} to {tournament.endDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              {tourneyTeams.length} / {tournament.maxTeams} Teams Registered
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Organizer: {tournament.organizer}
            </span>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="px-6 sm:px-8 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto">
          <div className="flex items-center gap-1 py-3 text-xs whitespace-nowrap">
            {[
              { id: 'fixtures', label: 'Fixtures & Live Results', icon: Calendar },
              { id: 'standings', label: 'Standings / Table', icon: Trophy },
              { id: 'brackets', label: 'Knockout Tree', icon: Award },
              { id: 'teams', label: 'Teams & Rosters', icon: Users },
              { id: 'scorers', label: 'Top Scorers / Performers', icon: Star },
              { id: 'overview', label: 'Overview & Rules', icon: FileText },
              { id: 'venues', label: 'Venues & Stadiums', icon: MapPin },
              { id: 'news', label: 'Announcements', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: FIXTURES & LIVE RESULTS */}
      {activeTab === 'fixtures' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Tournament Calendar & Matchday Results
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {tourneyMatches.length} Matches Scheduled
              </span>
              <button
                type="button"
                onClick={handlePrintSchedule}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                Print
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tourneyMatches.map((m) => {
              const home = teams.find((t) => t.id === m.homeTeamId);
              const away = teams.find((t) => t.id === m.awayTeamId);
              const venue = venues.find((v) => v.id === m.venueId);

              return (
                <div
                  key={m.id}
                  onClick={() => onOpenMatchModal(m)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    m.status === 'in_progress'
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20 hover:border-emerald-400'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5 font-mono">
                      {m.status === 'in_progress' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          LIVE {m.currentMinute ? `${m.currentMinute}'` : ''}
                        </span>
                      ) : m.status === 'completed' ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                          FULL TIME
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {m.scheduledDate} • {m.scheduledTime}
                        </span>
                      )}
                      <span>• Match #{m.matchNumber}</span>
                    </span>

                    <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                      {venue?.name}
                    </span>
                  </div>

                  <div className="space-y-2 py-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{home?.logo || '🛡️'}</span>
                        <span className="font-semibold text-white text-sm">{home?.name}</span>
                      </div>
                      <span className="text-xl font-black font-mono text-emerald-400">
                        {m.score.home}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{away?.logo || '🛡️'}</span>
                        <span className="font-semibold text-white text-sm">{away?.name}</span>
                      </div>
                      <span className="text-xl font-black font-mono text-emerald-400">
                        {m.score.away}
                      </span>
                    </div>
                  </div>

                  {m.events.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Latest: {m.events[m.events.length - 1].minute}' {m.events[m.events.length - 1].playerName}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: STANDINGS */}
      {activeTab === 'standings' && (
        <StandingsTable
          tournament={tournament}
          standings={standings}
          lang={lang}
          onSelectTeam={(teamId) => {
            const team = teams.find((t) => t.id === teamId);
            if (team) {
              setSelectedTeam(team);
              setActiveTab('teams');
            }
          }}
        />
      )}

      {/* TAB 3: BRACKETS */}
      {activeTab === 'brackets' && (
        <KnockoutBracketView
          matches={tourneyMatches}
          teams={teams}
          lang={lang}
          onSelectMatch={onOpenMatchModal}
        />
      )}

      {/* TAB 4: TEAMS & SQUAD ROSTERS */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Participating Teams & Squad Rosters
            </h3>
            <span className="text-xs text-slate-400">{tourneyTeams.length} Teams</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tourneyTeams.map((team) => {
              const teamSquad = players.filter((p) => p.teamId === team.id);
              const isSelected = selectedTeam?.id === team.id;

              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl mb-3 shadow-inner">
                    {team.logo || '🛡️'}
                  </div>
                  <h4 className="font-bold text-base text-white">{team.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{team.city}, {team.country}</p>
                  <p className="text-xs text-emerald-400 mt-2 font-medium">Coach: {team.coachName}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>{teamSquad.length} Players</span>
                    <span className="text-emerald-400 font-medium">View Squad →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Team Squad Details */}
          {selectedTeam && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedTeam.logo}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedTeam.name} Official Squad</h3>
                    <p className="text-xs text-slate-400">
                      Head Coach: {selectedTeam.coachName} • Team Manager: {selectedTeam.managerName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close Squad View
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {players
                  .filter((p) => p.teamId === selectedTeam.id)
                  .map((player) => (
                    <div
                      key={player.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs"
                    >
                      <img
                        src={player.photoUrl}
                        alt={player.fullName}
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <span className="text-emerald-400 font-mono">#{player.jerseyNumber}</span>
                          <span>{player.fullName}</span>
                          {player.isCaptain && (
                            <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300">C</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[11px]">{player.position}</p>
                        <p className="text-emerald-400 text-[11px] font-mono mt-0.5">
                          {player.goalsScored} Goals • {player.assists} Assists
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: TOP SCORERS */}
      {activeTab === 'scorers' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Golden Boot Leaderboard (Top Scorers & Performers)
          </h3>
          <p className="text-xs text-slate-400">
            Calculated strictly from certified matchday reports and official goal events.
          </p>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 text-xs">
            {sortedScorers.map((player, idx) => {
              const team = teams.find((t) => t.id === player.teamId);
              return (
                <div key={player.id} className="p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-sm w-6 text-center text-slate-400">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <img
                      src={player.photoUrl}
                      alt={player.fullName}
                      loading="lazy"
                      decoding="async"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{player.fullName}</h4>
                      <p className="text-slate-400 text-[11px]">
                        {team?.name} • #{player.jerseyNumber} ({player.position})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-xl text-emerald-400">
                      {player.goalsScored || player.pointsScored}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {tournament.sportId === 'basketball' ? 'Points' : 'Goals'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: OVERVIEW & RULES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Competition Regulations & Scoring
            </h3>
            <p className="text-slate-300 leading-relaxed">{tournament.rulesText}</p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Points Allocation Rules:</span>
              <p className="text-slate-400">Win: <strong className="text-emerald-400">{tournament.pointsWin} Points</strong></p>
              <p className="text-slate-400">Draw: <strong className="text-slate-300">{tournament.pointsDraw} Point</strong></p>
              <p className="text-slate-400">Loss: <strong className="text-red-400">{tournament.pointsLoss} Points</strong></p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Official Tournament Awards
            </h3>

            <div className="space-y-3">
              {tourneyAwards.map((awd) => (
                <div key={awd.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> {awd.title}
                  </h4>
                  <p className="text-white font-medium mt-1">Recipient: {awd.recipientName}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{awd.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: VENUES */}
      {activeTab === 'venues' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tourneyVenues.map((ven) => (
              <div key={ven.id} className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
                <img
                  src={ven.imageUrl}
                  alt={ven.name}
                  loading="lazy"
                  decoding="async"
                  className="h-44 w-full object-cover"
                />
                <div className="p-6 space-y-3 text-xs">
                  <h4 className="font-bold text-base text-white">{ven.name}</h4>
                  <p className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {ven.address}, {ven.city}, {ven.country}
                  </p>
                  <p className="text-slate-300">
                    Capacity: <strong className="text-emerald-400">{ven.capacity.toLocaleString()} seats</strong>
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {ven.facilities.map((fac, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: ANNOUNCEMENTS */}
      {activeTab === 'news' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Official Notices & Press Bulletins
          </h3>

          <div className="space-y-3 text-xs">
            {tourneyAnnouncements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{ann.title}</span>
                  <span className="text-[11px] font-mono text-slate-500">{ann.date}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{ann.content}</p>
                <span className="text-[11px] text-emerald-400 block pt-1">
                  Issued by: {ann.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* PRINTER-FRIENDLY TOURNAMENT MATCH SCHEDULE SHEET */}
      <section aria-label="Printable Match Schedule" className="hidden print:block print-schedule-sheet">
        <div className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                UTMS • {getTranslation(lang, 'officialMatchSchedule')}
              </p>
              <h1 className="text-2xl font-extrabold text-slate-950 mt-1">
                {tournament.name}
              </h1>
              <p className="text-sm text-slate-700 mt-1">
                {tournament.sportId.toUpperCase()} • {tournament.category} •{' '}
                {tournament.format.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="text-right text-xs text-slate-700 space-y-0.5">
              <p>
                <strong>Organizer:</strong> {tournament.organizer}
              </p>
              <p>
                <strong>Location:</strong> {tournament.city}, {tournament.country}
              </p>
              <p>
                <strong>Dates:</strong> {tournament.startDate} to {tournament.endDate}
              </p>
            </div>
          </div>
        </div>

        {sortedTourneyMatches.length === 0 ? (
          <p className="text-sm text-slate-700 py-6 border border-slate-300 rounded p-4 text-center">
            No fixtures have been scheduled for this tournament yet.
          </p>
        ) : (
          <table className="print-schedule-table text-xs text-slate-900">
            <thead>
              <tr>
                <th>Match #</th>
                <th>Date & Time</th>
                <th>Stage / Group</th>
                <th>Home</th>
                <th style={{ textAlign: 'center' }}>Score</th>
                <th>Away</th>
                <th>Venue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedTourneyMatches.map((m) => {
                const home = teams.find((t) => t.id === m.homeTeamId);
                const away = teams.find((t) => t.id === m.awayTeamId);
                const venue = venues.find((v) => v.id === m.venueId);
                const hasScore = m.status === 'completed' || m.status === 'in_progress';

                return (
                  <tr key={m.id}>
                    <td className="font-mono font-semibold">
                      #{m.matchNumber} (R{m.roundNumber})
                    </td>
                    <td className="font-mono">
                      <div>{m.scheduledDate}</div>
                      <div className="text-[10px] text-slate-600">{m.scheduledTime}</div>
                    </td>
                    <td>
                      <span className="capitalize">{m.stage.replace(/_/g, ' ')}</span>
                      {m.group ? ` • ${m.group}` : ''}
                    </td>
                    <td className="font-semibold">{home?.name || m.homeTeamId}</td>
                    <td style={{ textAlign: 'center' }} className="font-mono font-bold">
                      {hasScore ? `${m.score.home} - ${m.score.away}` : 'vs'}
                    </td>
                    <td className="font-semibold">{away?.name || m.awayTeamId}</td>
                    <td>{venue?.name || 'TBA'}</td>
                    <td className="uppercase text-[10px] font-semibold">
                      {m.status === 'in_progress'
                        ? `Live (${m.currentMinute || 0}')`
                        : m.status.replace(/_/g, ' ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="mt-6 pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-600">
          <span>
            Teams: {tourneyTeams.length} / {tournament.maxTeams} • Venues:{' '}
            {tourneyVenues.map((v) => v.name).join(', ') || 'TBA'}
          </span>
          <span>
            Printed via UTMS • {new Date().toLocaleDateString()}
          </span>
        </div>
      </section>
    </div>
  );
};
