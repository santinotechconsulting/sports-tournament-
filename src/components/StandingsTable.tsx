import React, { useState } from 'react';
import { StandingRow, Tournament, Language } from '../types/tournament';
import { getTranslation } from '../utils/translations';
import { Download, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { exportStandingsToCSV } from '../utils/exportUtils';

interface StandingsTableProps {
  tournament: Tournament;
  standings: StandingRow[];
  lang: Language;
  onSelectTeam?: (teamId: string) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  tournament,
  standings,
  lang,
  onSelectTeam,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Find unique groups if available
  const availableGroups = Array.from(
    new Set(standings.map((s) => s.group).filter(Boolean) as string[])
  );

  const filteredStandings =
    selectedGroup === 'all'
      ? standings
      : standings.filter((s) => s.group === selectedGroup);

  const handleExport = () => {
    exportStandingsToCSV(filteredStandings, tournament.name);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {getTranslation(lang, 'navStandings')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {tournament.name} • {tournament.category}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Group Switcher Tabs */}
          {availableGroups.length > 0 && (
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedGroup('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedGroup === 'all'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Groups
              </button>
              {availableGroups.map((grp) => (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedGroup === grp
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          )}

          {/* Export to CSV */}
          <button
            onClick={handleExport}
            aria-label="Export standings to CSV file"
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            {getTranslation(lang, 'exportCSV')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3 px-3 text-center w-12">{getTranslation(lang, 'position')}</th>
              <th scope="col" className="py-3 px-4">{getTranslation(lang, 'team')}</th>
              <th scope="col" className="py-3 px-3 text-center">{getTranslation(lang, 'played')}</th>
              <th scope="col" className="py-3 px-3 text-center">{getTranslation(lang, 'won')}</th>
              <th scope="col" className="py-3 px-3 text-center">{getTranslation(lang, 'drawn')}</th>
              <th scope="col" className="py-3 px-3 text-center">{getTranslation(lang, 'lost')}</th>
              <th scope="col" className="py-3 px-3 text-center">{getTranslation(lang, 'goalsFor')}</th>
              <th scope="col" className="py-3 px-3 text-center">{getTranslation(lang, 'goalsAgainst')}</th>
              <th scope="col" className="py-3 px-3 text-center">{getTranslation(lang, 'goalDiff')}</th>
              <th scope="col" className="py-3 px-4 text-center font-bold text-emerald-400">{getTranslation(lang, 'points')}</th>
              <th scope="col" className="py-3 px-3 text-center hidden md:table-cell">{getTranslation(lang, 'form')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredStandings.map((row, idx) => {
              const isQualified = idx < 2; // Top 2 qualify for knockout
              return (
                <tr
                  key={row.teamId}
                  onClick={() => onSelectTeam && onSelectTeam(row.teamId)}
                  className={`hover:bg-slate-850/60 transition-colors cursor-pointer ${
                    isQualified ? 'bg-emerald-950/10' : ''
                  }`}
                >
                  {/* Position */}
                  <td className="py-3.5 px-3 text-center font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                        idx === 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isQualified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>

                  {/* Team */}
                  <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2.5">
                    <span className="text-lg">{row.teamLogo || '🛡️'}</span>
                    <span className="truncate max-w-[180px] sm:max-w-none hover:text-emerald-400 transition-colors">
                      {row.teamName}
                    </span>
                    {row.group && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {row.group}
                      </span>
                    )}
                  </td>

                  {/* Stats */}
                  <td className="py-3.5 px-3 text-center text-slate-300 font-mono">{row.played}</td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-mono font-semibold">{row.won}</td>
                  <td className="py-3.5 px-3 text-center text-slate-400 font-mono">{row.drawn}</td>
                  <td className="py-3.5 px-3 text-center text-red-400 font-mono">{row.lost}</td>
                  <td className="py-3.5 px-3 text-center text-slate-300 font-mono">{row.goalsFor}</td>
                  <td className="py-3.5 px-3 text-center text-slate-400 font-mono">{row.goalsAgainst}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold">
                    <span
                      className={
                        row.goalDifference > 0
                          ? 'text-emerald-400'
                          : row.goalDifference < 0
                          ? 'text-red-400'
                          : 'text-slate-400'
                      }
                    >
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-extrabold text-sm text-emerald-400 bg-emerald-500/5">
                    {row.points}
                  </td>

                  {/* Recent Form */}
                  <td className="py-3.5 px-3 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.length === 0 ? (
                        <span className="text-slate-600 font-mono">-</span>
                      ) : (
                        row.form.map((f, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                              f === 'W'
                                ? 'bg-emerald-500 text-slate-950'
                                : f === 'D'
                                ? 'bg-amber-500/80 text-slate-950'
                                : 'bg-red-500 text-white'
                            }`}
                          >
                            {f}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Qualification to Knockout Phase
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          First Place Seed
        </span>
      </div>
    </div>
  );
};
