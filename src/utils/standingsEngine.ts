import { Match, StandingRow, Team, Tournament, SportId } from '../types/tournament';

export function calculateStandings(
  tournament: Tournament,
  teams: Team[],
  matches: Match[],
  groupId?: string
): StandingRow[] {
  // Filter teams for this tournament and optional group
  const tournamentTeams = teams.filter((t) => {
    if (t.tournamentId !== tournament.id) return false;
    if (groupId && t.group !== groupId) return false;
    return true;
  });

  const rowMap: Record<string, StandingRow> = {};

  // Initialize table rows
  tournamentTeams.forEach((t) => {
    rowMap[t.id] = {
      position: 1,
      teamId: t.id,
      teamName: t.name,
      teamShortName: t.shortName,
      teamLogo: t.logo,
      group: t.group,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
    };
  });

  // Calculate from completed matches or live matches with confirmed scores
  const relevantMatches = matches.filter(
    (m) =>
      m.tournamentId === tournament.id &&
      (m.status === 'completed' || m.status === 'in_progress') &&
      (!groupId || m.group === groupId)
  );

  // Sort matches chronologically to build accurate form
  relevantMatches.sort((a, b) => (a.scheduledDate + a.scheduledTime).localeCompare(b.scheduledDate + b.scheduledTime));

  relevantMatches.forEach((m) => {
    const homeRow = rowMap[m.homeTeamId];
    const awayRow = rowMap[m.awayTeamId];

    if (!homeRow || !awayRow) return;

    homeRow.played += 1;
    awayRow.played += 1;

    homeRow.goalsFor += m.score.home;
    homeRow.goalsAgainst += m.score.away;
    awayRow.goalsFor += m.score.away;
    awayRow.goalsAgainst += m.score.home;

    if (m.score.home > m.score.away) {
      homeRow.won += 1;
      homeRow.points += tournament.pointsWin;
      homeRow.form.push('W');

      awayRow.lost += 1;
      awayRow.points += tournament.pointsLoss;
      awayRow.form.push('L');
    } else if (m.score.home === m.score.away) {
      homeRow.drawn += 1;
      homeRow.points += tournament.pointsDraw;
      homeRow.form.push('D');

      awayRow.drawn += 1;
      awayRow.points += tournament.pointsDraw;
      awayRow.form.push('D');
    } else {
      homeRow.lost += 1;
      homeRow.points += tournament.pointsLoss;
      homeRow.form.push('L');

      awayRow.won += 1;
      awayRow.points += tournament.pointsWin;
      awayRow.form.push('W');
    }

    homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst;
    awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst;
  });

  // Convert to array and sort according to sport ranking criteria
  const standings = Object.values(rowMap);

  standings.sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;
    // 2. Goal difference
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    // 3. Goals scored
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    // 4. Alphabetical tiebreak
    return a.teamName.localeCompare(b.teamName);
  });

  // Assign positions and keep max 5 recent form indicators
  standings.forEach((row, idx) => {
    row.position = idx + 1;
    row.form = row.form.slice(-5);
  });

  return standings;
}
