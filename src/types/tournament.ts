export type SportId = 'football' | 'basketball' | 'volleyball' | 'tennis' | 'athletics' | 'esports';

export type TournamentFormat = 
  | 'single_elimination' 
  | 'double_elimination' 
  | 'round_robin' 
  | 'double_round_robin' 
  | 'group_knockout' 
  | 'swiss' 
  | 'league';

export type TournamentStatus = 
  | 'draft' 
  | 'registration_open' 
  | 'ongoing' 
  | 'completed' 
  | 'archived';

export type MatchStatus = 
  | 'scheduled' 
  | 'in_progress' 
  | 'half_time' 
  | 'interval' 
  | 'completed' 
  | 'postponed' 
  | 'suspended' 
  | 'cancelled' 
  | 'awaiting_approval';

export type UserRole = 
  | 'super_admin' 
  | 'org_admin' 
  | 'tournament_manager' 
  | 'team_manager' 
  | 'referee' 
  | 'scorekeeper' 
  | 'player' 
  | 'spectator';

export type Language = 'en' | 'fr';

export interface SportConfig {
  id: SportId;
  name: string;
  category: 'team' | 'individual' | 'esports';
  icon: string;
  description: string;
  playersPerSide: number;
  periodName: string; // e.g., 'Half', 'Quarter', 'Set', 'Round'
  periodsCount: number;
  periodDurationMinutes: number;
  scoringType: 'goals' | 'points' | 'sets' | 'games' | 'time_distance';
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  allowDraws: boolean;
  eventTypes: string[]; // ['goal', 'yellow_card', 'red_card', 'substitution', etc.]
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  logo: string;
  country: string;
  city: string;
  contactEmail: string;
  verified: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  sportId: SportId;
  organizationId: string;
  category: string; // e.g. "U-20 Men's", "Premier Senior", "Open Mixed"
  description: string;
  format: TournamentFormat;
  status: TournamentStatus;
  organizer: string;
  country: string;
  city: string;
  venueIds: string[];
  bannerUrl: string;
  startDate: string;
  endDate: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
  registrationFee: number;
  currency: 'XAF' | 'USD' | 'EUR';
  maxTeams: number;
  registeredTeamIds: string[];
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  rulesText: string;
  isFeatured?: boolean;
}

export interface Team {
  id: string;
  tournamentId: string;
  name: string;
  shortName: string;
  logo: string;
  city: string;
  country: string;
  affiliation?: string; // School, Club, Academy
  coachName: string;
  managerName: string;
  contactEmail: string;
  contactPhone: string;
  homeVenue?: string;
  status: 'approved' | 'pending' | 'rejected';
  paymentStatus: 'verified' | 'pending' | 'exempt';
  paymentMethod?: string;
  paymentReference?: string;
  group?: string; // e.g. "Group A"
}

export interface Player {
  id: string;
  teamId: string;
  tournamentId: string;
  fullName: string;
  jerseyNumber: number;
  position: string;
  dob: string;
  nationality: string;
  photoUrl: string;
  goalsScored: number;
  assists: number;
  pointsScored: number;
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
  minutesPlayed: number;
  isCaptain?: boolean;
  status: 'eligible' | 'suspended' | 'pending_verification';
}

export interface MatchEvent {
  id: string;
  matchId: string;
  minute: number;
  period: string; // '1st Half', '2nd Half', 'Q1', 'Set 1'
  type: 'goal' | 'own_goal' | 'yellow_card' | 'red_card' | 'assist' | 'substitution' | '2pt' | '3pt' | 'freethrow' | 'foul' | 'ace' | 'block' | 'timeout';
  teamId: string;
  playerId?: string;
  playerName: string;
  notes?: string;
  timestamp: string;
}

export interface MatchScoreDetails {
  periodScores?: { [period: string]: { home: number; away: number } };
  sets?: { home: number; away: number }[]; // for tennis/volleyball: [{home: 25, away: 22}, ...]
  penalties?: { home: number; away: number };
}

export interface Match {
  id: string;
  tournamentId: string;
  stage: 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final' | 'third_place' | 'league_round';
  group?: string;
  roundNumber: number;
  matchNumber: number;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: MatchStatus;
  score: {
    home: number;
    away: number;
  };
  scoreDetails?: MatchScoreDetails;
  events: MatchEvent[];
  refereeId?: string;
  scorekeeperId?: string;
  currentMinute?: number;
  currentPeriod?: string;
  isProvisional: boolean; // true while live, false when confirmed
  attendance?: number;
  officialMatchReport?: string;
}

export interface StandingRow {
  position: number;
  teamId: string;
  teamName: string;
  teamShortName: string;
  teamLogo: string;
  group?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface Official {
  id: string;
  name: string;
  role: 'referee' | 'assistant_referee' | 'scorekeeper' | 'commissioner';
  certification: string;
  sportId: SportId;
  phone: string;
  email: string;
  photoUrl: string;
  matchesOfficiated: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  sportsSupported: SportId[];
  facilities: string[];
  imageUrl: string;
  contactPerson: string;
}

export interface DisciplinaryRecord {
  id: string;
  tournamentId: string;
  matchId: string;
  teamId: string;
  participantName: string;
  incidentType: 'red_card' | 'repeated_yellows' | 'violent_conduct' | 'protest' | 'technical_foul';
  incidentDate: string;
  description: string;
  decision: string;
  suspensionDurationMatches: number;
  status: 'active' | 'served' | 'appealed';
}

export interface FinancialRecord {
  id: string;
  tournamentId: string;
  teamId: string;
  teamName: string;
  amount: number;
  currency: 'XAF' | 'USD' | 'EUR';
  method: 'mtn_momo' | 'orange_money' | 'bank_transfer' | 'cash' | 'card';
  reference: string;
  date: string;
  status: 'verified' | 'pending' | 'refunded';
  verifiedBy?: string;
}

export interface Announcement {
  id: string;
  tournamentId?: string;
  title: string;
  content: string;
  date: string;
  category: 'fixture_change' | 'rules' | 'disciplinary' | 'awards' | 'general';
  author: string;
}

export interface TournamentAward {
  id: string;
  tournamentId: string;
  title: string;
  recipientName: string;
  teamName: string;
  description: string;
  sportId: SportId;
}
