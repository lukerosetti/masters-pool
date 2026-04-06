// Masters 2026 field — OWGR-ranked from Golf News Net, organized into pods
// Full 91-player field from ESPN
const f = (code) => String.fromCodePoint(...[...code].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));

export const GOLFERS = [
  // Pod A: OWGR 1-10
  { name: 'Scottie Scheffler', owgr: 1, country: 'US', flag: f('US'), majors: 2, mastersWins: 1 },
  { name: 'Rory McIlroy', owgr: 2, country: 'GB', flag: f('GB'), majors: 4, mastersWins: 0 },
  { name: 'Cameron Young', owgr: 3, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Tommy Fleetwood', owgr: 4, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Xander Schauffele', owgr: 5, country: 'US', flag: f('US'), majors: 2, mastersWins: 0 },
  { name: 'Matt Fitzpatrick', owgr: 6, country: 'GB', flag: f('GB'), majors: 1, mastersWins: 0 },
  { name: 'Justin Rose', owgr: 7, country: 'GB', flag: f('GB'), majors: 1, mastersWins: 0 },
  { name: 'Collin Morikawa', owgr: 8, country: 'US', flag: f('US'), majors: 2, mastersWins: 0 },
  { name: 'Russell Henley', owgr: 9, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Chris Gotterup', owgr: 10, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },

  // Pod B: OWGR 11-20
  { name: 'Robert MacIntyre', owgr: 11, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Sepp Straka', owgr: 12, country: 'AT', flag: f('AT'), majors: 0, mastersWins: 0 },
  { name: 'J.J. Spaun', owgr: 13, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Hideki Matsuyama', owgr: 14, country: 'JP', flag: f('JP'), majors: 1, mastersWins: 1 },
  { name: 'Justin Thomas', owgr: 15, country: 'US', flag: f('US'), majors: 2, mastersWins: 0 },
  { name: 'Ben Griffin', owgr: 16, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Jacob Bridgeman', owgr: 17, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Ludvig Aberg', owgr: 18, country: 'SE', flag: f('SE'), majors: 0, mastersWins: 0 },
  { name: 'Alex Noren', owgr: 19, country: 'SE', flag: f('SE'), majors: 0, mastersWins: 0 },
  { name: 'Harris English', owgr: 20, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },

  // Pod C: OWGR 21-30
  { name: 'Viktor Hovland', owgr: 21, country: 'NO', flag: f('NO'), majors: 0, mastersWins: 0 },
  { name: 'Akshay Bhatia', owgr: 22, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Patrick Reed', owgr: 23, country: 'US', flag: f('US'), majors: 1, mastersWins: 1 },
  { name: 'Bryson DeChambeau', owgr: 24, country: 'US', flag: f('US'), majors: 2, mastersWins: 0 },
  { name: 'Keegan Bradley', owgr: 25, country: 'US', flag: f('US'), majors: 1, mastersWins: 0 },
  { name: 'Maverick McNealy', owgr: 26, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Ryan Gerard', owgr: 27, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Jon Rahm', owgr: 28, country: 'ES', flag: f('ES'), majors: 2, mastersWins: 1 },
  { name: 'Si Woo Kim', owgr: 29, country: 'KR', flag: f('KR'), majors: 0, mastersWins: 0 },
  { name: 'Tyrrell Hatton', owgr: 30, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },

  // Pod D: OWGR 31-40
  { name: 'Min Woo Lee', owgr: 31, country: 'AU', flag: f('AU'), majors: 0, mastersWins: 0 },
  { name: 'Shane Lowry', owgr: 32, country: 'IE', flag: f('IE'), majors: 1, mastersWins: 0 },
  { name: 'Sam Burns', owgr: 33, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Patrick Cantlay', owgr: 34, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Kurt Kitayama', owgr: 35, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Marco Penge', owgr: 36, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Daniel Berger', owgr: 37, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Nico Echavarria', owgr: 38, country: 'CO', flag: f('CO'), majors: 0, mastersWins: 0 },
  { name: 'Aaron Rai', owgr: 39, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Corey Conners', owgr: 40, country: 'CA', flag: f('CA'), majors: 0, mastersWins: 0 },

  // Pod E: OWGR 41-50
  { name: 'Jason Day', owgr: 41, country: 'AU', flag: f('AU'), majors: 1, mastersWins: 0 },
  { name: 'Jake Knapp', owgr: 42, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Michael Brennan', owgr: 43, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Matt McCarty', owgr: 44, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Ryan Fox', owgr: 45, country: 'NZ', flag: f('NZ'), majors: 0, mastersWins: 0 },
  { name: 'Brian Harman', owgr: 46, country: 'US', flag: f('US'), majors: 1, mastersWins: 0 },
  { name: 'Nicolai Hojgaard', owgr: 47, country: 'DK', flag: f('DK'), majors: 0, mastersWins: 0 },
  { name: 'Kristoffer Reitan', owgr: 48, country: 'NO', flag: f('NO'), majors: 0, mastersWins: 0 },
  { name: 'Andrew Novak', owgr: 49, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Sam Stevens', owgr: 50, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },

  // Pod F: OWGR 51+ (Past champions, amateurs, special invites)
  { name: 'Sungjae Im', owgr: 51, country: 'KR', flag: f('KR'), majors: 0, mastersWins: 0 },
  { name: 'Wyndham Clark', owgr: 52, country: 'US', flag: f('US'), majors: 1, mastersWins: 0 },
  { name: 'Max Homa', owgr: 53, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Michael Kim', owgr: 54, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Davis Riley', owgr: 55, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Max Greyserman', owgr: 56, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Rasmus Hojgaard', owgr: 57, country: 'DK', flag: f('DK'), majors: 0, mastersWins: 0 },
  { name: 'Tom McKibbin', owgr: 58, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Brooks Koepka', owgr: 59, country: 'US', flag: f('US'), majors: 5, mastersWins: 0 },
  { name: 'Dustin Johnson', owgr: 60, country: 'US', flag: f('US'), majors: 2, mastersWins: 1 },
  { name: 'Jordan Spieth', owgr: 61, country: 'US', flag: f('US'), majors: 3, mastersWins: 1 },
  { name: 'Cameron Smith', owgr: 62, country: 'AU', flag: f('AU'), majors: 1, mastersWins: 0 },
  { name: 'Adam Scott', owgr: 63, country: 'AU', flag: f('AU'), majors: 1, mastersWins: 1 },
  { name: 'Haotong Li', owgr: 64, country: 'CN', flag: f('CN'), majors: 0, mastersWins: 0 },
  { name: 'Nick Taylor', owgr: 65, country: 'CA', flag: f('CA'), majors: 0, mastersWins: 0 },
  { name: 'Gary Woodland', owgr: 66, country: 'US', flag: f('US'), majors: 1, mastersWins: 0 },
  { name: 'Brian Campbell', owgr: 67, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Danny Willett', owgr: 68, country: 'GB', flag: f('GB'), majors: 1, mastersWins: 1 },
  { name: 'Charl Schwartzel', owgr: 69, country: 'ZA', flag: f('ZA'), majors: 1, mastersWins: 1 },
  { name: 'Carlos Ortiz', owgr: 70, country: 'MX', flag: f('MX'), majors: 0, mastersWins: 0 },
  { name: 'Sami Valimaki', owgr: 71, country: 'FI', flag: f('FI'), majors: 0, mastersWins: 0 },
  { name: 'Harry Hall', owgr: 72, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Casey Jarvis', owgr: 73, country: 'ZA', flag: f('ZA'), majors: 0, mastersWins: 0 },
  { name: 'Naoyuki Kataoka', owgr: 74, country: 'JP', flag: f('JP'), majors: 0, mastersWins: 0 },
  { name: 'Rasmus Neergaard-Petersen', owgr: 75, country: 'DK', flag: f('DK'), majors: 0, mastersWins: 0 },
  { name: 'Sergio Garcia', owgr: 76, country: 'ES', flag: f('ES'), majors: 1, mastersWins: 1 },
  { name: 'Brandon Holtz', owgr: 77, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Jackson Herrington', owgr: 78, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Bubba Watson', owgr: 79, country: 'US', flag: f('US'), majors: 2, mastersWins: 2 },
  { name: 'Vijay Singh', owgr: 80, country: 'FJ', flag: f('FJ'), majors: 3, mastersWins: 1 },
  { name: 'Angel Cabrera', owgr: 81, country: 'AR', flag: f('AR'), majors: 2, mastersWins: 1 },
  { name: 'Jose Maria Olazabal', owgr: 82, country: 'ES', flag: f('ES'), majors: 2, mastersWins: 2 },
  { name: 'Fred Couples', owgr: 83, country: 'US', flag: f('US'), majors: 1, mastersWins: 1 },
  { name: 'Mike Weir', owgr: 84, country: 'CA', flag: f('CA'), majors: 1, mastersWins: 1 },
  { name: 'Zach Johnson', owgr: 85, country: 'US', flag: f('US'), majors: 2, mastersWins: 1 },
  { name: 'Aldrich Potgieter', owgr: 86, country: 'ZA', flag: f('ZA'), majors: 0, mastersWins: 0 },
  { name: 'Johnny Keefer', owgr: 87, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Mason Howell', owgr: 88, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Ethan Fang', owgr: 89, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Fifa Laopakdee', owgr: 90, country: 'TH', flag: f('TH'), majors: 0, mastersWins: 0 },
  { name: 'Mateo Pulcini', owgr: 91, country: 'AR', flag: f('AR'), majors: 0, mastersWins: 0 },
];

// ESPN name -> our name mapping (for accent normalization during live tournament)
export const ESPN_NAME_MAP = {
  'Ludvig \u00C5berg': 'Ludvig Aberg',
  'Nicolai H\u00F8jgaard': 'Nicolai Hojgaard',
  'Rasmus H\u00F8jgaard': 'Rasmus Hojgaard',
  'Sami V\u00E4lim\u00E4ki': 'Sami Valimaki',
  '\u00C1ngel Cabrera': 'Angel Cabrera',
  'Sergio Garc\u00EDa': 'Sergio Garcia',
  'Jos\u00E9 Mar\u00EDa Olaz\u00E1bal': 'Jose Maria Olazabal',
  'Nico Echavarr\u00EDa': 'Nico Echavarria',
};

// Normalize ESPN name to match our golfer list
// Handles: NFD accents (á, é, etc.), Nordic chars (ø, å), and explicit map
export const normalizeESPNName = (espnName) => {
  if (!espnName) return '';
  // Check explicit map first
  if (ESPN_NAME_MAP[espnName]) return ESPN_NAME_MAP[espnName];
  // Strip accents via NFD + replace Nordic chars that don't decompose
  return espnName
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00F8/g, 'o').replace(/\u00D8/g, 'O')  // ø/Ø
    .replace(/\u00E6/g, 'ae').replace(/\u00C6/g, 'Ae') // æ/Æ
    .replace(/\u00F0/g, 'd').replace(/\u00D0/g, 'D')   // ð/Ð
    .replace(/\u00FE/g, 'th').replace(/\u00DE/g, 'Th'); // þ/Þ
};

// Pod definitions
export const PODS = [
  { id: 'A', label: 'Pod A', subtitle: 'OWGR 1-10', range: [1, 10] },
  { id: 'B', label: 'Pod B', subtitle: 'OWGR 11-20', range: [11, 20] },
  { id: 'C', label: 'Pod C', subtitle: 'OWGR 21-30', range: [21, 30] },
  { id: 'D', label: 'Pod D', subtitle: 'OWGR 31-40', range: [31, 40] },
  { id: 'E', label: 'Pod E', subtitle: 'OWGR 41-50', range: [41, 50] },
  { id: 'F', label: 'Pod F', subtitle: 'OWGR 51+', range: [51, 999] },
];

export const getGolfersInPod = (podOrIndex) => {
  const pod = typeof podOrIndex === 'number' ? PODS[podOrIndex] : podOrIndex;
  if (!pod || !pod.range) return [];
  return GOLFERS.filter(g => g.owgr >= pod.range[0] && g.owgr <= pod.range[1]);
};
