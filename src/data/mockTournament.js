// Mock tournament data simulating Round 3 Saturday afternoon at Augusta
// This will be replaced by ESPN live data during the actual tournament

export const TOURNAMENT_STATUS = {
  name: 'The Masters',
  venue: 'Augusta National Golf Club',
  round: 3,
  roundLabel: 'Round 3 — Moving Day',
  status: 'in_progress', // 'pre_tournament', 'in_progress', 'round_complete', 'cut', 'final'
  cutLine: '+4',
  lastUpdated: Date.now(),
};

// Simulated leaderboard — mix of on-course and finished for Round 3
export const MOCK_LEADERBOARD = [
  { name: 'Scottie Scheffler', pos: 1, total: -14, today: -5, thru: 14, r1: 66, r2: 67, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Collin Morikawa', pos: 2, total: -12, today: -4, thru: 16, r1: 68, r2: 68, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Rory McIlroy', pos: 3, total: -11, today: -3, thru: 'F', r1: 67, r2: 69, r3: 67, r4: null, status: 'finished', movement: 'same' },
  { name: 'Xander Schauffele', pos: 4, total: -10, today: -2, thru: 13, r1: 69, r2: 67, r3: null, r4: null, status: 'active', movement: 'down' },
  { name: 'Jon Rahm', pos: 5, total: -9, today: -1, thru: 'F', r1: 68, r2: 70, r3: 69, r4: null, status: 'finished', movement: 'up' },
  { name: 'Ludvig Aberg', pos: 6, total: -8, today: -3, thru: 11, r1: 70, r2: 69, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Hideki Matsuyama', pos: 7, total: -7, today: -2, thru: 'F', r1: 69, r2: 70, r3: 68, r4: null, status: 'finished', movement: 'up' },
  { name: 'Tommy Fleetwood', pos: 8, total: -6, today: -1, thru: 15, r1: 70, r2: 70, r3: null, r4: null, status: 'active', movement: 'same' },
  { name: 'Patrick Cantlay', pos: 9, total: -6, today: 'E', thru: 'F', r1: 69, r2: 69, r3: 70, r4: null, status: 'finished', movement: 'down' },
  { name: 'Viktor Hovland', pos: 10, total: -5, today: -2, thru: 12, r1: 71, r2: 70, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Shane Lowry', pos: 11, total: -5, today: -1, thru: 'F', r1: 70, r2: 70, r3: 69, r4: null, status: 'finished', movement: 'same' },
  { name: 'Sam Burns', pos: 12, total: -4, today: -2, thru: 14, r1: 71, r2: 71, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Wyndham Clark', pos: 13, total: -4, today: 'E', thru: 'F', r1: 70, r2: 70, r3: 72, r4: null, status: 'finished', movement: 'down' },
  { name: 'Sahith Theegala', pos: 14, total: -3, today: -1, thru: 10, r1: 72, r2: 69, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Justin Thomas', pos: 15, total: -3, today: +1, thru: 'F', r1: 69, r2: 71, r3: 73, r4: null, status: 'finished', movement: 'down' },
  { name: 'Russell Henley', pos: 16, total: -2, today: -1, thru: 8, r1: 72, r2: 70, r3: null, r4: null, status: 'active', movement: 'same' },
  { name: 'Keegan Bradley', pos: 17, total: -2, today: +1, thru: 'F', r1: 71, r2: 70, r3: 73, r4: null, status: 'finished', movement: 'down' },
  { name: 'Matt Fitzpatrick', pos: 18, total: -1, today: 'E', thru: 13, r1: 72, r2: 71, r3: null, r4: null, status: 'active', movement: 'same' },
  { name: 'Robert MacIntyre', pos: 19, total: -1, today: -2, thru: 7, r1: 73, r2: 70, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Akshay Bhatia', pos: 20, total: 'E', today: +1, thru: 'F', r1: 72, r2: 71, r3: 73, r4: null, status: 'finished', movement: 'down' },
  { name: 'Cameron Young', pos: 21, total: 'E', today: -1, thru: 9, r1: 73, r2: 71, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Sungjae Im', pos: 22, total: +1, today: +2, thru: 'F', r1: 72, r2: 71, r3: 74, r4: null, status: 'finished', movement: 'down' },
  { name: 'Corey Conners', pos: 23, total: +1, today: 'E', thru: 11, r1: 73, r2: 72, r3: null, r4: null, status: 'active', movement: 'same' },
  { name: 'Jason Day', pos: 24, total: +1, today: -1, thru: 6, r1: 74, r2: 71, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Brian Harman', pos: 25, total: +2, today: +1, thru: 'F', r1: 72, r2: 73, r3: 73, r4: null, status: 'finished', movement: 'down' },
  { name: 'Tony Finau', pos: 26, total: +2, today: -1, thru: 10, r1: 75, r2: 71, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Tyrrell Hatton', pos: 27, total: +2, today: +2, thru: 'F', r1: 72, r2: 72, r3: 74, r4: null, status: 'finished', movement: 'down' },
  { name: 'Sepp Straka', pos: 28, total: +3, today: 'E', thru: 8, r1: 74, r2: 73, r3: null, r4: null, status: 'active', movement: 'same' },
  { name: 'Min Woo Lee', pos: 29, total: +3, today: +1, thru: 'F', r1: 73, r2: 73, r3: 73, r4: null, status: 'active', movement: 'down' },
  { name: 'Aaron Rai', pos: 30, total: +3, today: -1, thru: 5, r1: 75, r2: 73, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Si Woo Kim', pos: 31, total: +4, today: +2, thru: 'F', r1: 73, r2: 73, r3: 74, r4: null, status: 'finished', movement: 'down' },
  { name: 'Dustin Johnson', pos: 32, total: +4, today: 'E', thru: 12, r1: 75, r2: 73, r3: null, r4: null, status: 'active', movement: 'same' },
  { name: 'Jordan Spieth', pos: 33, total: +4, today: -2, thru: 9, r1: 76, r2: 74, r3: null, r4: null, status: 'active', movement: 'up' },
  { name: 'Cameron Smith', pos: 34, total: +5, today: +1, thru: 'F', r1: 74, r2: 74, r3: 73, r4: null, status: 'finished', movement: 'down' },
  { name: 'Adam Scott', pos: 35, total: +5, today: +2, thru: 14, r1: 74, r2: 73, r3: null, r4: null, status: 'active', movement: 'down' },
  { name: 'Tiger Woods', pos: 36, total: +6, today: +3, thru: 'F', r1: 74, r2: 74, r3: 76, r4: null, status: 'finished', movement: 'down' },
  { name: 'Brooks Koepka', pos: 37, total: +6, today: 'E', thru: 7, r1: 76, r2: 74, r3: null, r4: null, status: 'active', movement: 'same' },
  { name: 'Phil Mickelson', pos: 38, total: +8, today: +4, thru: 'F', r1: 75, r2: 75, r3: 76, r4: null, status: 'finished', movement: 'down' },
  // Missed cut
  { name: 'Justin Rose', pos: 'MC', total: +7, today: null, thru: null, r1: 76, r2: 75, r3: null, r4: null, status: 'cut', movement: null },
  { name: 'Patrick Reed', pos: 'MC', total: +8, today: null, thru: null, r1: 77, r2: 75, r3: null, r4: null, status: 'cut', movement: null },
  { name: 'Bubba Watson', pos: 'MC', total: +9, today: null, thru: null, r1: 78, r2: 75, r3: null, r4: null, status: 'cut', movement: null },
  { name: 'Fred Couples', pos: 'MC', total: +12, today: null, thru: null, r1: 79, r2: 77, r3: null, r4: null, status: 'cut', movement: null },
  { name: 'Harris English', pos: 'MC', total: +7, today: null, thru: null, r1: 76, r2: 75, r3: null, r4: null, status: 'cut', movement: null },
  { name: 'Kurt Kitayama', pos: 'MC', total: +6, today: null, thru: null, r1: 75, r2: 75, r3: null, r4: null, status: 'cut', movement: null },
  { name: 'Nick Dunlap', pos: 'MC', total: +8, today: null, thru: null, r1: 77, r2: 75, r3: null, r4: null, status: 'cut', movement: null },
];

// Mock pool with 20 players and their picks (realistic overlap)
export const MOCK_POOL_PLAYERS = [
  { id: 'luke', name: 'Luke', initials: 'LK', isCommissioner: true, locked: true,
    picks: ['Scottie Scheffler', 'Tommy Fleetwood', 'Akshay Bhatia', 'Dustin Johnson', 'Kurt Kitayama', 'Tiger Woods'] },
  { id: 'nick', name: 'Nick', initials: 'NK', locked: true,
    picks: ['Xander Schauffele', 'Shane Lowry', 'Cameron Young', 'Jordan Spieth', 'Harris English', 'Phil Mickelson'] },
  { id: 'brooks', name: 'Brooks', initials: 'BK', locked: true,
    picks: ['Rory McIlroy', 'Sam Burns', 'Corey Conners', 'Adam Scott', 'Nick Dunlap', 'Tiger Woods'] },
  { id: 'james', name: 'James', initials: 'JM', locked: true,
    picks: ['Collin Morikawa', 'Justin Thomas', 'Jason Day', 'Cameron Smith', 'Justin Rose', 'Phil Mickelson'] },
  { id: 'matt', name: 'Matt', initials: 'MT', locked: true,
    picks: ['Scottie Scheffler', 'Hideki Matsuyama', 'Sahith Theegala', 'Jordan Spieth', 'Aaron Rai', 'Tiger Woods'] },
  { id: 'chris', name: 'Chris', initials: 'CK', locked: true,
    picks: ['Rory McIlroy', 'Patrick Cantlay', 'Matt Fitzpatrick', 'Dustin Johnson', 'Harris English', 'Phil Mickelson'] },
  { id: 'dan', name: 'Dan', initials: 'DN', locked: true,
    picks: ['Xander Schauffele', 'Viktor Hovland', 'Russell Henley', 'Adam Scott', 'Kurt Kitayama', 'Tiger Woods'] },
  { id: 'mike', name: 'Mike', initials: 'MK', locked: true,
    picks: ['Scottie Scheffler', 'Tommy Fleetwood', 'Keegan Bradley', 'Cameron Smith', 'Aaron Rai', 'Phil Mickelson'] },
  { id: 'ryan', name: 'Ryan', initials: 'RN', locked: true,
    picks: ['Collin Morikawa', 'Sam Burns', 'Wyndham Clark', 'Jordan Spieth', 'Nick Dunlap', 'Tiger Woods'] },
  { id: 'tom', name: 'Tom', initials: 'TM', locked: true,
    picks: ['Rory McIlroy', 'Shane Lowry', 'Robert MacIntyre', 'Dustin Johnson', 'Justin Rose', 'Phil Mickelson'] },
  { id: 'joe', name: 'Joe', initials: 'JE', locked: true,
    picks: ['Scottie Scheffler', 'Hideki Matsuyama', 'Akshay Bhatia', 'Adam Scott', 'Harris English', 'Tiger Woods'] },
  { id: 'ben', name: 'Ben', initials: 'BN', locked: true,
    picks: ['Xander Schauffele', 'Patrick Cantlay', 'Cameron Young', 'Cameron Smith', 'Kurt Kitayama', 'Phil Mickelson'] },
  { id: 'alex', name: 'Alex', initials: 'AX', locked: true,
    picks: ['Collin Morikawa', 'Viktor Hovland', 'Matt Fitzpatrick', 'Jordan Spieth', 'Aaron Rai', 'Tiger Woods'] },
  { id: 'pete', name: 'Pete', initials: 'PT', locked: true,
    picks: ['Rory McIlroy', 'Tommy Fleetwood', 'Sahith Theegala', 'Dustin Johnson', 'Nick Dunlap', 'Phil Mickelson'] },
  { id: 'dave', name: 'Dave', initials: 'DV', locked: true,
    picks: ['Scottie Scheffler', 'Sam Burns', 'Keegan Bradley', 'Adam Scott', 'Justin Rose', 'Tiger Woods'] },
  { id: 'kyle', name: 'Kyle', initials: 'KL', locked: true,
    picks: ['Xander Schauffele', 'Shane Lowry', 'Russell Henley', 'Cameron Smith', 'Harris English', 'Phil Mickelson'] },
  { id: 'sean', name: 'Sean', initials: 'SN', locked: true,
    picks: ['Collin Morikawa', 'Justin Thomas', 'Corey Conners', 'Jordan Spieth', 'Kurt Kitayama', 'Tiger Woods'] },
  { id: 'will', name: 'Will', initials: 'WL', locked: true,
    picks: ['Rory McIlroy', 'Patrick Cantlay', 'Wyndham Clark', 'Dustin Johnson', 'Aaron Rai', 'Phil Mickelson'] },
  { id: 'jack', name: 'Jack', initials: 'JK', locked: true,
    picks: ['Scottie Scheffler', 'Hideki Matsuyama', 'Robert MacIntyre', 'Adam Scott', 'Nick Dunlap', 'Tiger Woods'] },
  { id: 'zach', name: 'Zach', initials: 'ZH', locked: true,
    picks: ['Xander Schauffele', 'Viktor Hovland', 'Matt Fitzpatrick', 'Cameron Smith', 'Justin Rose', 'Phil Mickelson'] },
];

// Build a lookup: golfer name -> array of { id, initials } who picked them
export const getPickedBy = (golferName) => {
  return MOCK_POOL_PLAYERS.filter(p => p.picks.includes(golferName)).map(p => ({ id: p.id, initials: p.initials, name: p.name }));
};

// Helper: get leaderboard entry for a golfer
export const getGolferScore = (name) => MOCK_LEADERBOARD.find(g => g.name === name);

// Helper: format score to par
export const formatScore = (score) => {
  if (score === 'E' || score === 0) return 'E';
  if (score === 'MC') return 'MC';
  if (typeof score === 'number') return score > 0 ? `+${score}` : String(score);
  return String(score);
};

// Helper: calculate pool standings from picks + leaderboard
export const calculateStandings = (players) => {
  return players.map(player => {
    const golferScores = player.picks.map(name => {
      const entry = getGolferScore(name);
      if (!entry) return { name, score: 999, pos: 99, status: 'unknown' };
      const numScore = entry.total === 'E' ? 0 : (typeof entry.total === 'number' ? entry.total : 999);
      return { name, score: numScore, pos: entry.pos, status: entry.status, today: entry.today, thru: entry.thru };
    });

    // Sort by score (lowest first)
    const sorted = [...golferScores].sort((a, b) => a.score - b.score);
    const counting = sorted.slice(0, 4); // Best 4
    const bench = sorted.slice(4); // Worst 2

    const madeCut = golferScores.filter(g => g.status !== 'cut' && g.status !== 'unknown').length;
    const qualified = madeCut >= 4;
    const totalScore = qualified ? counting.reduce((sum, g) => sum + g.score, 0) : 999;

    // Check if player picked the tournament leader
    const leaderName = MOCK_LEADERBOARD[0]?.name;
    const pickedLeader = player.picks.includes(leaderName);

    // Best individual finish position
    const bestFinish = Math.min(...golferScores.filter(g => typeof g.pos === 'number').map(g => g.pos));

    return {
      ...player,
      golferScores: sorted,
      counting,
      bench,
      totalScore,
      qualified,
      madeCut,
      pickedLeader,
      bestFinish,
    };
  }).sort((a, b) => {
    if (a.totalScore !== b.totalScore) return a.totalScore - b.totalScore;
    // Tiebreaker 1: picked tournament leader
    if (a.pickedLeader !== b.pickedLeader) return a.pickedLeader ? -1 : 1;
    // Tiebreaker 2: best individual finish
    return a.bestFinish - b.bestFinish;
  });
};

// Augusta National hole data (par for each hole)
export const AUGUSTA_HOLES = [
  { hole: 1, par: 4, name: 'Tea Olive', yards: 445 },
  { hole: 2, par: 5, name: 'Pink Dogwood', yards: 575 },
  { hole: 3, par: 4, name: 'Flowering Peach', yards: 350 },
  { hole: 4, par: 3, name: 'Flowering Crab Apple', yards: 240 },
  { hole: 5, par: 4, name: 'Magnolia', yards: 495 },
  { hole: 6, par: 3, name: 'Juniper', yards: 180 },
  { hole: 7, par: 4, name: 'Pampas', yards: 450 },
  { hole: 8, par: 5, name: 'Yellow Jasmine', yards: 570 },
  { hole: 9, par: 4, name: 'Carolina Cherry', yards: 460 },
  { hole: 10, par: 4, name: 'Camellia', yards: 495 },
  { hole: 11, par: 4, name: 'White Dogwood', yards: 520 },
  { hole: 12, par: 3, name: 'Golden Bell', yards: 155 },
  { hole: 13, par: 5, name: 'Azalea', yards: 510 },
  { hole: 14, par: 4, name: 'Chinese Fir', yards: 440 },
  { hole: 15, par: 5, name: 'Firethorn', yards: 530 },
  { hole: 16, par: 3, name: 'Redbud', yards: 170 },
  { hole: 17, par: 4, name: 'Nandina', yards: 440 },
  { hole: 18, par: 4, name: 'Holly', yards: 465 },
];
export const AUGUSTA_PAR = { out: 36, in: 36, total: 72 };

// Multi-round scorecards (completed rounds have 18 holes, current round may be partial)
export const MOCK_SCORECARD = {
  'Scottie Scheffler': {
    rounds: [
      // R1: 66 (-6)
      [4,4,4,3,4,3,4,4,4, 3,4,3,4,3,5,3,3,4],
      // R2: 67 (-5)
      [4,4,3,3,4,3,4,5,4, 4,4,3,4,4,4,3,4,4],
      // R3: through 14 (-5 today)
      [4,4,3,3,4,3,4,4,4, 3,4,2,4,4,null,null,null,null],
      // R4: not started
      null,
    ]
  },
  'Tommy Fleetwood': {
    rounds: [
      [4,5,4,3,4,3,4,4,4, 4,4,3,4,4,5,3,4,5],
      [4,4,4,3,4,3,4,5,4, 3,4,3,5,4,5,3,4,4],
      [4,4,4,3,4,3,4,5,4, 3,4,3,4,4,null,null,null,null],
      null,
    ]
  },
  'Akshay Bhatia': {
    rounds: [
      [4,5,4,3,4,3,5,5,4, 4,4,3,5,4,5,3,4,4],
      [4,5,4,3,4,3,4,5,4, 4,4,3,5,4,5,3,4,4],
      [4,5,4,3,4,4,4,5,4, 4,4,3,5,4,5,3,4,3],
      null,
    ]
  },
  'Dustin Johnson': {
    rounds: [
      [5,5,4,3,5,3,4,5,4, 4,5,3,5,4,5,3,4,4],
      [4,5,4,3,5,3,4,5,4, 4,4,3,5,4,5,3,5,4],
      [4,5,4,3,4,3,4,5,4, 4,5,3,null,null,null,null,null,null],
      null,
    ]
  },
  'Tiger Woods': {
    rounds: [
      [4,5,4,4,4,3,5,5,4, 4,5,3,5,4,5,4,4,4],
      [4,5,4,3,5,4,5,5,4, 4,4,3,5,5,5,3,4,4],
      [5,5,4,4,5,3,5,5,4, 4,5,4,5,4,5,3,4,4],
      null,
    ]
  },
  'Kurt Kitayama': {
    rounds: [
      [5,5,4,3,5,3,5,5,4, 4,5,3,5,5,5,3,4,4],
      [4,5,5,3,5,4,4,5,4, 4,5,3,5,4,5,4,5,4],
      null, null, // missed cut
    ]
  },
};

// Helper to calculate round score from hole scores
export const calcRoundScore = (holes) => {
  if (!holes) return null;
  const played = holes.filter(h => h !== null);
  if (played.length === 0) return null;
  return played.reduce((sum, s) => sum + s, 0);
};

// Helper to get front 9 / back 9 scores
export const calcNines = (holes) => {
  if (!holes) return { out: null, in_: null };
  const front = holes.slice(0, 9).filter(h => h !== null);
  const back = holes.slice(9).filter(h => h !== null);
  return {
    out: front.length === 9 ? front.reduce((s, h) => s + h, 0) : (front.length > 0 ? front.reduce((s, h) => s + h, 0) : null),
    in_: back.length === 9 ? back.reduce((s, h) => s + h, 0) : (back.length > 0 ? back.reduce((s, h) => s + h, 0) : null),
  };
};
