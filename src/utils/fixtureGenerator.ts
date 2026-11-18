import { Match, Team, Tournament, Venue } from '../types/tournament';

export function generateRoundRobinFixtures(
  tournament: Tournament,
  teams: Team[],
  venues: Venue[],
  startDate: string,
  intervalDays: number = 3
): Match[] {
  if (teams.length < 2) return [];

  const teamList = [...teams];
  // If odd number of teams, add a dummy team for byes
  const hasBye = teamList.length % 2 !== 0;
  if (hasBye) {
    teamList.push({
      id: 'BYE',
      tournamentId: tournament.id,
      name: 'BYE',
      shortName: 'BYE',
      logo: '',
      city: '',
      country: '',
      coachName: '',
      managerName: '',
      contactEmail: '',
      contactPhone: '',
      status: 'approved',
      paymentStatus: 'verified',
    });
  }

  const numTeams = teamList.length;
  const numRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;

  const newMatches: Match[] = [];
  let matchCounter = 1;
  const start = new Date(startDate);

  // Circle algorithm
  const indices = teamList.map((_, i) => i);

  for (let round = 0; round < numRounds; round++) {
    const roundDate = new Date(start);
    roundDate.setDate(roundDate.getDate() + round * intervalDays);
    const dateStr = roundDate.toISOString().split('T')[0];

    for (let m = 0; m < matchesPerRound; m++) {
      const homeIdx = indices[m];
      const awayIdx = indices[numTeams - 1 - m];

      const homeTeam = teamList[homeIdx];
      const awayTeam = teamList[awayIdx];

      // Skip bye matches
      if (homeTeam.id === 'BYE' || awayTeam.id === 'BYE') continue;

      // Pick venue round-robin
      const assignedVenue = venues.length > 0 ? venues[matchCounter % venues.length] : undefined;
      const scheduledTime = m % 2 === 0 ? '15:30' : '17:30';

      newMatches.push({
        id: `match_gen_${tournament.id}_r${round + 1}_m${matchCounter}`,
        tournamentId: tournament.id,
        stage: 'group',
        roundNumber: round + 1,
        matchNumber: matchCounter,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        venueId: assignedVenue ? assignedVenue.id : 'ven_japoma',
        scheduledDate: dateStr,
        scheduledTime,
        status: 'scheduled',
        score: { home: 0, away: 0 },
        isProvisional: false,
        events: [],
      });

      matchCounter++;
    }

    // Rotate array elements keeping the first element fixed
    const fixed = indices[0];
    const rest = indices.slice(1);
    const last = rest.pop()!;
    rest.unshift(last);
    indices.splice(0, indices.length, fixed, ...rest);
  }

  return newMatches;
}

export function generateKnockoutBracketFixtures(
  tournament: Tournament,
  advancingTeams: Team[],
  venues: Venue[],
  startDate: string
): Match[] {
  if (advancingTeams.length < 2) return [];

  const matches: Match[] = [];
  const start = new Date(startDate);
  let matchCounter = 1;

  if (advancingTeams.length >= 8) {
    // 4 Quarter Finals
    for (let i = 0; i < 4; i++) {
      const home = advancingTeams[i * 2];
      const away = advancingTeams[i * 2 + 1];
      const qfDate = new Date(start);
      qfDate.setDate(qfDate.getDate() + Math.floor(i / 2));

      matches.push({
        id: `match_qf_${i + 1}`,
        tournamentId: tournament.id,
        stage: 'quarter_final',
        roundNumber: 1,
        matchNumber: matchCounter++,
        homeTeamId: home.id,
        awayTeamId: away.id,
        venueId: venues[i % venues.length]?.id || 'ven_japoma',
        scheduledDate: qfDate.toISOString().split('T')[0],
        scheduledTime: i % 2 === 0 ? '15:00' : '17:30',
        status: 'scheduled',
        score: { home: 0, away: 0 },
        isProvisional: false,
        events: [],
      });
    }
  }

  return matches;
}
