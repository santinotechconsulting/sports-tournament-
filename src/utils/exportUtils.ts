import { StandingRow, Match, Team, Player } from '../types/tournament';

export function exportStandingsToCSV(standings: StandingRow[], tournamentName: string) {
  const headers = ['Position', 'Team Name', 'Short Name', 'Group', 'Played', 'Won', 'Drawn', 'Lost', 'Goals For', 'Goals Against', 'Goal Difference', 'Points'];
  const rows = standings.map((s) => [
    s.position,
    `"${s.teamName}"`,
    s.teamShortName,
    s.group || 'N/A',
    s.played,
    s.won,
    s.drawn,
    s.lost,
    s.goalsFor,
    s.goalsAgainst,
    s.goalDifference,
    s.points,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csvContent, `${slugify(tournamentName)}_standings.csv`, 'text/csv;charset=utf-8;');
}

export function exportFixturesToCSV(matches: Match[], teams: Team[], tournamentName: string) {
  const teamMap = new Map(teams.map((t) => [t.id, t.name]));
  const headers = ['Match #', 'Round', 'Stage', 'Date', 'Time', 'Home Team', 'Away Team', 'Home Score', 'Away Score', 'Status'];
  const rows = matches.map((m) => [
    m.matchNumber,
    m.roundNumber,
    m.stage,
    m.scheduledDate,
    m.scheduledTime,
    `"${teamMap.get(m.homeTeamId) || m.homeTeamId}"`,
    `"${teamMap.get(m.awayTeamId) || m.awayTeamId}"`,
    m.score.home,
    m.score.away,
    m.status,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csvContent, `${slugify(tournamentName)}_fixtures.csv`, 'text/csv;charset=utf-8;');
}

export function exportPlayersToCSV(players: Player[], teams: Team[], tournamentName: string) {
  const teamMap = new Map(teams.map((t) => [t.id, t.name]));
  const headers = ['Player ID', 'Full Name', 'Team', 'Jersey #', 'Position', 'Nationality', 'Goals', 'Assists', 'Yellows', 'Reds', 'Eligibility'];
  const rows = players.map((p) => [
    p.id,
    `"${p.fullName}"`,
    `"${teamMap.get(p.teamId) || 'Free Agent'}"`,
    p.jerseyNumber,
    `"${p.position}"`,
    p.nationality,
    p.goalsScored,
    p.assists,
    p.yellowCards,
    p.redCards,
    p.status,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csvContent, `${slugify(tournamentName)}_players.csv`, 'text/csv;charset=utf-8;');
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
