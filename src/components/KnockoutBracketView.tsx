import React, { useState } from 'react';
import { Match, Team, Language } from '../types/tournament';
import { getTranslation } from '../utils/translations';
import { Trophy, Award, Calendar, ChevronRight } from 'lucide-react';

interface KnockoutBracketViewProps {
  matches: Match[];
  teams: Team[];
  lang: Language;
  onSelectMatch: (match: Match) => void;
}

export const KnockoutBracketView: React.FC<KnockoutBracketViewProps> = ({
  matches,
  teams,
  lang,
  onSelectMatch,
}) => {
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  // Mock sample bracket nodes for championship demonstration
  // Quarters
  const qfMatches = [
    {
      id: 'qf_1',
      round: 'Quarter-Final 1',
      homeId: 'team_coton',
      awayId: 'team_dynamo',
      homeScore: 3,
      awayScore: 1,
      status: 'completed',
      winnerId: 'team_coton',
      date: '2026-11-20',
    },
    {
      id: 'qf_2',
      round: 'Quarter-Final 2',
      homeId: 'team_union',
      awayId: 'team_bamboutos',
      homeScore: 2,
      awayScore: 0,
      status: 'completed',
      winnerId: 'team_union',
      date: '2026-11-20',
    },
    {
      id: 'qf_3',
      round: 'Quarter-Final 3',
      homeId: 'team_canon',
      awayId: 'team_colombe',
      homeScore: 2,
      awayScore: 1,
      status: 'completed',
      winnerId: 'team_canon',
      date: '2026-11-21',
    },
    {
      id: 'qf_4',
      round: 'Quarter-Final 4',
      homeId: 'team_fovu',
      awayId: 'team_astres',
      homeScore: 1,
      awayScore: 2,
      status: 'completed',
      winnerId: 'team_astres',
      date: '2026-11-21',
    },
  ];

  // Semis
  const sfMatches = [
    {
      id: 'sf_1',
      round: 'Semi-Final 1',
      homeId: 'team_coton',
      awayId: 'team_union',
      homeScore: 2,
      awayScore: 1,
      status: 'completed',
      winnerId: 'team_coton',
      date: '2026-11-24',
    },
    {
      id: 'sf_2',
      round: 'Semi-Final 2',
      homeId: 'team_canon',
      awayId: 'team_astres',
      homeScore: 3,
      awayScore: 2,
      status: 'completed',
      winnerId: 'team_canon',
      date: '2026-11-25',
    },
  ];

  // Final
  const finalMatch = {
    id: 'fn_1',
    round: 'Grand Championship Final',
    homeId: 'team_coton',
    awayId: 'team_canon',
    homeScore: 2,
    awayScore: 1,
    status: 'in_progress', // Connected to our live match!
    winnerId: undefined,
    date: '2026-11-28',
  };

  const [activeStage, setActiveStage] = useState<'all' | 'qf' | 'sf' | 'fn'>('all');

  const renderMatchCard = (m: any) => {
    const home = teamMap.get(m.homeId);
    const away = teamMap.get(m.awayId);
    const homeWon = m.winnerId === m.homeId;
    const awayWon = m.winnerId === m.awayId;

    return (
      <div
        key={m.id}
        className="w-64 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg hover:border-emerald-500/50 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
          <span className="font-semibold text-slate-300">{m.round}</span>
          <span className="flex items-center gap-1 font-mono">{m.date}</span>
        </div>

        <div className="space-y-1.5 text-xs">
          {/* Home team */}
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              homeWon ? 'bg-emerald-500/15 border border-emerald-500/30 font-bold text-white' : 'bg-slate-950/70 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span>{home?.logo || '🛡️'}</span>
              <span className="truncate">{home?.name || 'TBD'}</span>
            </div>
            <span className="font-mono text-sm px-1.5 rounded bg-slate-900">{m.homeScore}</span>
          </div>

          {/* Away team */}
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              awayWon ? 'bg-emerald-500/15 border border-emerald-500/30 font-bold text-white' : 'bg-slate-950/70 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span>{away?.logo || '🛡️'}</span>
              <span className="truncate">{away?.name || 'TBD'}</span>
            </div>
            <span className="font-mono text-sm px-1.5 rounded bg-slate-900">{m.awayScore}</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            {m.status === 'in_progress' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE NOW
              </span>
            ) : m.winnerId ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Winner Advanced
              </span>
            ) : (
              'Scheduled'
            )}
          </span>
          <span className="text-slate-500 group-hover:text-emerald-400 flex items-center">
            Details <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-950/50 border border-slate-800/80 rounded-3xl p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            {getTranslation(lang, 'navBrackets')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatic single elimination knockout progression tree
          </p>
        </div>

        {/* Stage Tabs for mobile/desktop */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveStage('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeStage === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Stages
          </button>
          <button
            onClick={() => setActiveStage('qf')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeStage === 'qf' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quarters
          </button>
          <button
            onClick={() => setActiveStage('sf')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeStage === 'sf' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semis
          </button>
          <button
            onClick={() => setActiveStage('fn')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeStage === 'fn' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Final
          </button>
        </div>
      </div>

      {/* Bracket Tree View */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[850px] flex items-center justify-between gap-8 py-2">
          {/* Column 1: Quarter Finals */}
          {(activeStage === 'all' || activeStage === 'qf') && (
            <div className="space-y-6">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider text-center pb-1 border-b border-slate-800">
                Quarter-Finals (QF)
              </div>
              <div className="space-y-4">
                {qfMatches.map((m) => renderMatchCard(m))}
              </div>
            </div>
          )}

          {/* Column 2: Semi Finals */}
          {(activeStage === 'all' || activeStage === 'sf') && (
            <div className="space-y-16">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider text-center pb-1 border-b border-slate-800">
                Semi-Finals (SF)
              </div>
              <div className="space-y-12">
                {sfMatches.map((m) => renderMatchCard(m))}
              </div>
            </div>
          )}

          {/* Column 3: Grand Final & Champion Podium */}
          {(activeStage === 'all' || activeStage === 'fn') && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider text-center pb-1 border-b border-slate-800 w-full">
                Grand Championship Final 🏆
              </div>

              {renderMatchCard(finalMatch)}

              {/* Champion Trophy Showcase */}
              <div className="w-64 p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-500/30 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 shadow-lg shadow-amber-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-white">Championship Shield</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Winner receives 10,000,000 FCFA & Qualification to Youth Continental League
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
