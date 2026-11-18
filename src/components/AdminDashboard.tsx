import React, { useState } from 'react';
import {
  Tournament,
  Team,
  Player,
  Match,
  Official,
  Venue,
  FinancialRecord,
  DisciplinaryRecord,
  Language,
  UserRole,
} from '../types/tournament';
import { getTranslation } from '../utils/translations';
import { generateRoundRobinFixtures } from '../utils/fixtureGenerator';
import { exportStandingsToCSV, exportFixturesToCSV, exportPlayersToCSV } from '../utils/exportUtils';
import { calculateStandings } from '../utils/standingsEngine';
import {
  Trophy,
  Calendar,
  Users,
  ShieldCheck,
  DollarSign,
  AlertOctagon,
  FileText,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  Activity,
  Edit,
  Clock,
} from 'lucide-react';

interface AdminDashboardProps {
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  officials: Official[];
  venues: Venue[];
  financials: FinancialRecord[];
  disciplinary: DisciplinaryRecord[];
  lang: Language;
  currentRole: UserRole;
  onOpenCreateWizard: () => void;
  onOpenScorekeeper: (match: Match) => void;
  onUpdateTournaments: (tournaments: Tournament[]) => void;
  onUpdateTeams: (teams: Team[]) => void;
  onUpdateMatches: (matches: Match[]) => void;
  onUpdateFinancials: (records: FinancialRecord[]) => void;
  onUpdateDisciplinary: (records: DisciplinaryRecord[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tournaments,
  teams,
  players,
  matches,
  officials,
  venues,
  financials,
  disciplinary,
  lang,
  currentRole,
  onOpenCreateWizard,
  onOpenScorekeeper,
  onUpdateTournaments,
  onUpdateTeams,
  onUpdateMatches,
  onUpdateFinancials,
  onUpdateDisciplinary,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tournaments' | 'fixtures' | 'scores' | 'teams' | 'officials' | 'finance' | 'discipline' | 'reports'
  >('overview');

  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    tournaments[0]?.id || ''
  );
  const [fixtureGenSuccess, setFixtureGenSuccess] = useState<string | null>(null);

  const currentTournament = tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];

  // Revenue calculation in FCFA
  const totalRevenue = financials
    .filter((f) => f.status === 'verified')
    .reduce((sum, f) => sum + f.amount, 0);

  const pendingApprovalsCount = teams.filter((t) => t.status === 'pending').length;
  const completedMatchesCount = matches.filter((m) => m.status === 'completed').length;
  const inProgressMatchesCount = matches.filter((m) => m.status === 'in_progress').length;

  const handleGenerateFixtures = () => {
    if (!currentTournament) return;
    const tourneyTeams = teams.filter((t) => t.tournamentId === currentTournament.id);
    if (tourneyTeams.length < 2) {
      alert('You need at least 2 registered teams in this tournament to generate fixtures.');
      return;
    }

    const generated = generateRoundRobinFixtures(
      currentTournament,
      tourneyTeams,
      venues,
      currentTournament.startDate,
      3
    );

    // Keep existing completed/live matches, add generated scheduled ones
    const filteredOld = matches.filter(
      (m) => m.tournamentId === currentTournament.id && (m.status === 'completed' || m.status === 'in_progress')
    );
    const updatedMatches = [...matches.filter((m) => m.tournamentId !== currentTournament.id), ...filteredOld, ...generated];

    onUpdateMatches(updatedMatches);
    setFixtureGenSuccess(`Successfully generated ${generated.length} round-robin fixtures with venue assignments!`);
    setTimeout(() => setFixtureGenSuccess(null), 4000);
  };

  const handleTeamStatusChange = (teamId: string, newStatus: 'approved' | 'rejected') => {
    const updated = teams.map((t) => (t.id === teamId ? { ...t, status: newStatus } : t));
    onUpdateTeams(updated);
  };

  const handleVerifyPayment = (recordId: string) => {
    const updated = financials.map((f) => (f.id === recordId ? { ...f, status: 'verified' as const } : f));
    onUpdateFinancials(updated);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Bar with Tournament Selector & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
            UTMS Tournament Administration Suite
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            Control Center: <span className="text-emerald-400">{currentTournament?.name}</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedTournamentId}
            onChange={(e) => setSelectedTournamentId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.sportId})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenCreateWizard}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {getTranslation(lang, 'createTournament')}
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 text-xs">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
          { id: 'tournaments', label: 'Tournaments', icon: Trophy },
          { id: 'fixtures', label: 'Fixture Generator', icon: Calendar },
          { id: 'scores', label: 'Live Scoring Desk', icon: Activity },
          { id: 'teams', label: 'Team Approvals', icon: Users },
          { id: 'officials', label: 'Officials & Referees', icon: ShieldCheck },
          { id: 'finance', label: 'Financial Ledger', icon: DollarSign },
          { id: 'discipline', label: 'Disciplinary Board', icon: AlertOctagon },
          { id: 'reports', label: 'Reports & Export', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Active Competitions</span>
              <div className="text-3xl font-black font-mono text-white">
                {tournaments.filter((t) => t.status === 'ongoing').length}
              </div>
              <span className="text-[11px] text-emerald-400 mt-2 block">
                {tournaments.length} Total Registered
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Registered Teams</span>
              <div className="text-3xl font-black font-mono text-emerald-400">{teams.length}</div>
              <span className="text-[11px] text-amber-400 mt-2 block">
                {pendingApprovalsCount} Pending Review
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Matches Completed</span>
              <div className="text-3xl font-black font-mono text-white">{completedMatchesCount}</div>
              <span className="text-[11px] text-emerald-400 mt-2 block flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {inProgressMatchesCount} Live Match Active
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Collected Revenue</span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {totalRevenue.toLocaleString()} FCFA
              </div>
              <span className="text-[11px] text-slate-400 mt-2 block">
                MTN MoMo, Orange Money & Cash
              </span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Quick Matchday Operation
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Automatically generate round-robin schedules with Berger circle pairing, venue capacity matching, and referee assignments.
              </p>
              <button
                onClick={handleGenerateFixtures}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                {getTranslation(lang, 'generateFixturesBtn')}
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Tournament Documents & CSV Export
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Export official tables, match schedules, and complete squad lists directly to CSV for federation records.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const st = calculateStandings(currentTournament, teams, matches);
                    exportStandingsToCSV(st, currentTournament.name);
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Standings CSV
                </button>
                <button
                  onClick={() => exportFixturesToCSV(matches, teams, currentTournament.name)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Fixtures CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOURNAMENTS */}
      {activeTab === 'tournaments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {t.sportId}
                  </span>
                  <span className="text-slate-400">{t.startDate}</span>
                </div>
                <h4 className="font-bold text-base text-white">{t.name}</h4>
                <p className="text-xs text-slate-400">{t.category} • {t.city}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-mono font-bold">
                    {t.registeredTeamIds.length} Teams
                  </span>
                  <button
                    onClick={() => setSelectedTournamentId(t.id)}
                    className="text-slate-300 hover:text-emerald-400 font-medium"
                  >
                    Select as Active
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FIXTURES & GENERATOR */}
      {activeTab === 'fixtures' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Automated Fixture Generation Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Generates balanced home & away fixtures, rotates through assigned venues, and detects scheduling overlaps.
              </p>
            </div>
            <button
              onClick={handleGenerateFixtures}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all shrink-0"
            >
              <Play className="w-4 h-4" />
              {getTranslation(lang, 'generateFixturesBtn')}
            </button>
          </div>

          {fixtureGenSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              {fixtureGenSuccess}
            </div>
          )}

          {/* List of Tournament Matches */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Current Fixtures ({matches.filter((m) => m.tournamentId === currentTournament.id).length})
            </span>
            <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
              {matches
                .filter((m) => m.tournamentId === currentTournament.id)
                .map((m) => {
                  const home = teams.find((t) => t.id === m.homeTeamId);
                  const away = teams.find((t) => t.id === m.awayTeamId);
                  return (
                    <div key={m.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs hover:bg-slate-900/60 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                        <span className="font-mono text-slate-400 shrink-0">
                          R{m.roundNumber} #{m.matchNumber}
                        </span>
                        <span className="font-semibold text-white truncate">
                          {home?.name} vs {away?.name}
                        </span>
                        {m.group && <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 shrink-0">{m.group}</span>}
                      </div>

                      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0">
                        <span className="font-mono text-slate-400">{m.scheduledDate} {m.scheduledTime}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded">
                            {m.score.home} - {m.score.away}
                          </span>
                          <button
                            onClick={() => onOpenScorekeeper(m)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-medium transition-colors"
                          >
                            Score Desk
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE SCORING DESK */}
      {activeTab === 'scores' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Live Scoring & Official Match Approvals
          </h3>
          <p className="text-xs text-slate-400">
            Select any fixture below to open the referee console, update score points, and officially certify the results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches
              .filter((m) => m.tournamentId === currentTournament.id)
              .map((m) => {
                const home = teams.find((t) => t.id === m.homeTeamId);
                const away = teams.find((t) => t.id === m.awayTeamId);
                return (
                  <div
                    key={m.id}
                    onClick={() => onOpenScorekeeper(m)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-mono">Match #{m.matchNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        m.status === 'in_progress' ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {m.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-white py-1">
                      <span>{home?.name}</span>
                      <span className="text-emerald-400 font-mono text-base">{m.score.home} - {m.score.away}</span>
                      <span>{away?.name}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 5: TEAMS & APPROVALS */}
      {activeTab === 'teams' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Team Roster & Application Approvals
            </h3>
            <span className="text-xs text-slate-400">
              {teams.filter((t) => t.tournamentId === currentTournament.id).length} Registered
            </span>
          </div>

          <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
            {teams
              .filter((t) => t.tournamentId === currentTournament.id)
              .map((team) => (
                <div key={team.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{team.logo || '🛡️'}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{team.name}</h4>
                      <p className="text-slate-400">Coach: {team.coachName} • Contact: {team.contactEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                      team.paymentStatus === 'verified'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {team.paymentStatus === 'verified' ? 'Fee Paid (Verified)' : 'Fee Pending'}
                    </span>

                    {team.status === 'approved' ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Approved
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTeamStatusChange(team.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleTeamStatusChange(team.id, 'rejected')}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 6: OFFICIALS */}
      {activeTab === 'officials' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Certified Referees & Match Officials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officials.map((off) => (
              <div key={off.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 sm:gap-4 text-xs">
                <img
                  src={off.photoUrl}
                  alt={off.name}
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">{off.name}</h4>
                  <p className="text-emerald-400 font-medium truncate">{off.certification}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5 truncate">{off.email} • {off.phone}</p>
                </div>
                <span className="font-mono text-xs px-2 py-1 bg-slate-900 rounded-lg text-slate-300 shrink-0">
                  {off.matchesOfficiated} matches
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FINANCIAL LEDGER */}
      {activeTab === 'finance' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Registration Fees & Mobile Money Ledger (FCFA)
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Total Verified: {totalRevenue.toLocaleString()} FCFA
            </span>
          </div>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 text-xs">
            {financials.map((rec) => (
              <div key={rec.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-white truncate">{rec.teamName}</h4>
                  <p className="text-slate-400 text-[11px] break-words">
                    Method: <strong className="text-slate-200 uppercase">{rec.method.replace('_', ' ')}</strong> • Ref: {rec.reference}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="font-mono font-bold text-sm text-emerald-400">
                    {rec.amount.toLocaleString()} {rec.currency}
                  </span>
                  {rec.status === 'verified' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleVerifyPayment(rec.id)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                    >
                      Confirm Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: DISCIPLINARY BOARD */}
      {activeTab === 'discipline' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            Disciplinary Committee & Card Sanctions
          </h3>

          <div className="space-y-3 text-xs">
            {disciplinary.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-950 border border-red-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{d.participantName}</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 uppercase font-mono font-bold text-[10px]">
                    {d.incidentType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-300">{d.description}</p>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                  <strong>Decision:</strong> {d.decision}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: REPORTS & DOCUMENT EXPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Federation Reports & Match Sheets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">League Standings Export</h4>
              <p className="text-xs text-slate-400">Complete CSV with points, GD, GF, GA and form records.</p>
              <button
                onClick={() => {
                  const st = calculateStandings(currentTournament, teams, matches);
                  exportStandingsToCSV(st, currentTournament.name);
                }}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Standings CSV
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Tournament Fixtures Export</h4>
              <p className="text-xs text-slate-400">All rounds, match times, venue locations, and scores.</p>
              <button
                onClick={() => exportFixturesToCSV(matches, teams, currentTournament.name)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> Download Fixtures CSV
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Squad Rosters & Players</h4>
              <p className="text-xs text-slate-400">Registered athlete identities, jersey numbers, and goals.</p>
              <button
                onClick={() => exportPlayersToCSV(players, teams, currentTournament.name)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> Download Players CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
