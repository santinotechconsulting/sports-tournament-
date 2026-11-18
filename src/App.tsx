import React, { useState, useEffect } from 'react';
import {
  Tournament,
  Team,
  Player,
  Match,
  Official,
  Venue,
  FinancialRecord,
  DisciplinaryRecord,
  Announcement,
  TournamentAward,
  Language,
  UserRole,
  SportId,
} from './types/tournament';
import {
  initialTournaments,
  initialTeams,
  initialPlayers,
  initialMatches,
  initialOfficials,
  initialVenues,
  initialFinancialRecords,
  initialDisciplinaryRecords,
  initialAnnouncements,
  initialAwards,
} from './data/mockData';
import { getTranslation } from './utils/translations';
import { LiveMatchTicker } from './components/LiveMatchTicker';
import { MatchDetailModal } from './components/MatchDetailModal';
import { ScorekeeperDesk } from './components/ScorekeeperDesk';
import { TournamentWizardModal } from './components/TournamentWizardModal';
import { TournamentPublicHub } from './components/TournamentPublicHub';
import { AdminDashboard } from './components/AdminDashboard';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { ContactUsModal } from './components/ContactUsModal';
import { TournamentCardSkeleton } from './components/LoadingStates';
import {
  Trophy,
  Activity,
  Calendar,
  Users,
  MapPin,
  Search,
  Globe,
  UserCheck,
  Shield,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  // Main Data States
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [officials, setOfficials] = useState<Official[]>(initialOfficials);
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [financials, setFinancials] = useState<FinancialRecord[]>(initialFinancialRecords);
  const [disciplinary, setDisciplinary] = useState<DisciplinaryRecord[]>(initialDisciplinaryRecords);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [awards, setAwards] = useState<TournamentAward[]>(initialAwards);

  // App UI Navigation
  const [view, setView] = useState<'portal' | 'tournament_hub' | 'admin'>('portal');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lang, setLang] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('spectator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<Match | null>(null);
  const [selectedMatchForScorekeeper, setSelectedMatchForScorekeeper] = useState<Match | null>(null);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Live timer tick simulation for in-progress match (ticks up minute every 8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setMatches((prev) =>
        prev.map((m) => {
          if (m.status === 'in_progress' && m.currentMinute) {
            const nextMin = m.currentMinute >= 90 ? 90 : m.currentMinute + 1;
            return { ...m, currentMinute: nextMin };
          }
          return m;
        })
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenTournament = (tourney: Tournament) => {
    setIsLoading(true);
    setSelectedTournament(tourney);
    setView('tournament_hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleCreateTournament = (newT: Tournament) => {
    setTournaments([newT, ...tournaments]);
    setSelectedTournament(newT);
    setView('tournament_hub');
  };

  const handleUpdateMatch = (updated: Match) => {
    setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    // If this match was open in detail, update it too
    if (selectedMatchForDetail?.id === updated.id) {
      setSelectedMatchForDetail(updated);
    }
  };

  // Filtered Tournaments
  const filteredTournaments = tournaments.filter((t) => {
    if (sportFilter !== 'all' && t.sportId !== sportFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchCity = t.city.toLowerCase().includes(q);
      const matchSport = t.sportId.toLowerCase().includes(q);
      return matchName || matchCity || matchSport;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Skip to Content for Web Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      {/* HEADER & TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 print:hidden no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              setView('portal');
              setSelectedTournament(null);
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                UTMS <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">SPORTS</span>
              </span>
              <p className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                Universal Tournament System
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={getTranslation(lang, 'searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Role Switcher, Language, Admin Dashboard & Contact */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Role Switcher */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-slate-400 hidden xl:inline">Role:</span>
              <select
                aria-label="Demo role selector"
                value={currentRole}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  setCurrentRole(role);
                  if (role === 'super_admin' || role === 'org_admin') {
                    setView('admin');
                  }
                }}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="spectator" className="bg-slate-900 text-white">Public Spectator</option>
                <option value="super_admin" className="bg-slate-900 text-white">Super Administrator</option>
                <option value="org_admin" className="bg-slate-900 text-white">Organization Admin</option>
                <option value="tournament_manager" className="bg-slate-900 text-white">Tournament Manager</option>
                <option value="referee" className="bg-slate-900 text-white">Match Referee</option>
                <option value="scorekeeper" className="bg-slate-900 text-white">Scorekeeper</option>
                <option value="team_manager" className="bg-slate-900 text-white">Team Coach / Manager</option>
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs font-bold font-mono">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  lang === 'en' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  lang === 'fr' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                FR
              </button>
            </div>

            {/* Admin / Public Switch Button */}
            {view === 'admin' ? (
              <button
                onClick={() => setView('portal')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors border border-slate-700 flex items-center gap-1.5"
              >
                {getTranslation(lang, 'backToPublic')}
              </button>
            ) : (
              <button
                onClick={() => setView('admin')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                {getTranslation(lang, 'adminDashboard')}
              </button>
            )}

            {/* Contact Modal Button */}
            <button
              onClick={() => setIsContactModalOpen(true)}
              aria-label="Open contact secretariat dialog"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors hidden sm:flex items-center justify-center"
              title="Contact Tournament Committee"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={getTranslation(lang, 'searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <button
                onClick={() => {
                  setView('portal');
                  setSelectedTournament(null);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg bg-slate-900 text-white font-medium"
              >
                {getTranslation(lang, 'navHome')}
              </button>
              <button
                onClick={() => {
                  setView('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20"
              >
                {getTranslation(lang, 'adminDashboard')}
              </button>
              <button
                onClick={() => {
                  setIsContactModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-slate-300"
              >
                {getTranslation(lang, 'navContact')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: ADMIN DASHBOARD */}
        {view === 'admin' ? (
          <AdminDashboard
            tournaments={tournaments}
            teams={teams}
            players={players}
            matches={matches}
            officials={officials}
            venues={venues}
            financials={financials}
            disciplinary={disciplinary}
            lang={lang}
            currentRole={currentRole}
            onOpenCreateWizard={() => setIsCreateWizardOpen(true)}
            onOpenScorekeeper={(m) => setSelectedMatchForScorekeeper(m)}
            onUpdateTournaments={setTournaments}
            onUpdateTeams={setTeams}
            onUpdateMatches={setMatches}
            onUpdateFinancials={setFinancials}
            onUpdateDisciplinary={setDisciplinary}
          />
        ) : view === 'tournament_hub' && selectedTournament ? (
          /* VIEW 2: TOURNAMENT PUBLIC HUB */
          isLoading ? (
            <TournamentCardSkeleton />
          ) : (
            <TournamentPublicHub
              tournament={selectedTournament}
              teams={teams}
              players={players}
              matches={matches}
              venues={venues}
              announcements={announcements}
              awards={awards}
              lang={lang}
              currentRole={currentRole}
              onOpenMatchModal={(m) => setSelectedMatchForDetail(m)}
              onBack={() => {
                setView('portal');
                setSelectedTournament(null);
              }}
            />
          )
        ) : (
          /* VIEW 3: PUBLIC PORTAL HOME */
          <div className="space-y-10 animate-fade-in">
            {/* HERO BANNER */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 md:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" />
                  Enterprise Sports & Tournament Platform
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {getTranslation(lang, 'heroTitle')}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {getTranslation(lang, 'heroSubtitle')}
                </p>

                {/* Hero Fast Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {tournaments.length}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Competitions</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-white">
                      {teams.length}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Clubs & Teams</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-white">
                      {players.length * 3}+
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Athletes</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      100%
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Live Certified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE MATCH CENTER TICKER */}
            <LiveMatchTicker
              matches={matches}
              teams={teams}
              venues={venues}
              lang={lang}
              onOpenMatchModal={(m) => setSelectedMatchForDetail(m)}
            />

            {/* SPORT CATEGORY FILTER CHIPS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-400" />
                    {getTranslation(lang, 'exploreTournaments')}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Browse active championships, open registrations, and tournament archives.
                  </p>
                </div>

                {/* Sport Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto text-xs">
                  {[
                    { id: 'all', label: 'All Sports', icon: '🏆' },
                    { id: 'football', label: 'Football', icon: '⚽' },
                    { id: 'basketball', label: 'Basketball', icon: '🏀' },
                    { id: 'volleyball', label: 'Volleyball', icon: '🏐' },
                    { id: 'tennis', label: 'Tennis', icon: '🎾' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSportFilter(s.id)}
                      className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                        sportFilter === s.id
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tournament Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tourney) => {
                  const registeredTeamsCount = teams.filter((t) => t.tournamentId === tourney.id).length;
                  const tourneyVenuesNames = venues
                    .filter((v) => tourney.venueIds.includes(v.id))
                    .map((v) => v.name)
                    .join(', ');

                  return (
                    <div
                      key={tourney.id}
                      onClick={() => handleOpenTournament(tourney)}
                      className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Banner Image */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={tourney.bannerUrl}
                            alt={tourney.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 font-bold text-xs capitalize border border-slate-800">
                              {tourney.sportId}
                            </span>
                            {tourney.status === 'ongoing' ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 font-bold text-xs uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" /> Ongoing
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 font-bold text-xs uppercase">
                                Reg Open
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-5 space-y-3">
                          <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-400 transition-colors leading-snug">
                            {tourney.name}
                          </h3>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {tourney.description}
                          </p>

                          <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate">{tourney.city}, {tourney.country}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{tourney.startDate} to {tourney.endDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{registeredTeamsCount} / {tourney.maxTeams} Teams • {tourney.format.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Button */}
                      <div className="px-5 pb-5 pt-2">
                        <div className="w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5">
                          <span>{getTranslation(lang, 'viewTournament')}</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECENT ANNOUNCEMENTS TICKER */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Latest Federation Bulletins
              </h3>
              <div className="divide-y divide-slate-800 text-xs">
                {announcements.slice(0, 3).map((ann) => (
                  <div key={ann.id} className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-300 font-medium truncate pr-4">
                      • {ann.title}
                    </span>
                    <span className="text-slate-500 font-mono shrink-0">{ann.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER & ACCESSIBILITY / SEO LINKS */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400 print:hidden no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white font-bold">
              <Trophy className="w-4 h-4 text-emerald-400" />
              UTMS Universal Tournament Management System
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                Sitemap.xml <ExternalLink className="w-3 h-3" />
              </a>
              <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                Robots.txt <ExternalLink className="w-3 h-3" />
              </a>
              <button onClick={() => setIsContactModalOpen(true)} className="hover:text-emerald-400">
                Contact Federation
              </button>
              <span className="text-emerald-400">SSL / HTTPS Enforced</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Universal multi-sport tournament administration platform supporting football, basketball, volleyball, tennis, athletics, and esports. Compliant with international competition protocols, real-time live scoring, and W3C WCAG accessibility standards.
          </p>
        </div>
      </footer>

      {/* POPUP MODALS */}
      {/* 1. Match Detail Modal */}
      <MatchDetailModal
        match={selectedMatchForDetail}
        onClose={() => setSelectedMatchForDetail(null)}
        teams={teams}
        venues={venues}
        officials={officials}
        lang={lang}
        currentRole={currentRole}
        onOpenScorekeeper={(m) => {
          setSelectedMatchForDetail(null);
          setSelectedMatchForScorekeeper(m);
        }}
      />

      {/* 2. Scorekeeper Live Desk Modal */}
      <ScorekeeperDesk
        match={selectedMatchForScorekeeper}
        teams={teams}
        players={players}
        lang={lang}
        onClose={() => setSelectedMatchForScorekeeper(null)}
        onUpdateMatch={handleUpdateMatch}
      />

      {/* 3. Tournament Creation Wizard */}
      <TournamentWizardModal
        isOpen={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        venues={venues}
        lang={lang}
        onSaveTournament={handleCreateTournament}
      />

      {/* 4. Contact Us Modal */}
      <ContactUsModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        lang={lang}
      />

      {/* 5. Cookie Consent Banner */}
      <CookieConsentBanner lang={lang} />
    </div>
  );
}
