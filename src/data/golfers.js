// PGA Championship 2026 field — ranked by betting odds (best to worst)
// Aronimink Golf Club, May 14-17, 2026
const f = (code) => String.fromCodePoint(...[...code].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));

export const GOLFERS = [
  // Pod A: Rank 1-26 (Favorites — +450 to +8000)
  { name: 'Scottie Scheffler', rank: 1, country: 'US', flag: f('US'), odds: '+450', majors: 2 },
  { name: 'Rory McIlroy', rank: 2, country: 'GB', flag: f('GB'), odds: '+850', majors: 4 },
  { name: 'Cameron Young', rank: 3, country: 'US', flag: f('US'), odds: '+1100', majors: 0 },
  { name: 'Jon Rahm', rank: 4, country: 'ES', flag: f('ES'), odds: '+1400', majors: 2 },
  { name: 'Xander Schauffele', rank: 5, country: 'US', flag: f('US'), odds: '+1800', majors: 2 },
  { name: 'Bryson DeChambeau', rank: 6, country: 'US', flag: f('US'), odds: '+2000', majors: 2 },
  { name: 'Ludvig Aberg', rank: 7, country: 'SE', flag: f('SE'), odds: '+2000', majors: 0 },
  { name: 'Matt Fitzpatrick', rank: 8, country: 'GB', flag: f('GB'), odds: '+2200', majors: 1 },
  { name: 'Tommy Fleetwood', rank: 9, country: 'GB', flag: f('GB'), odds: '+2500', majors: 0 },
  { name: 'Brooks Koepka', rank: 10, country: 'US', flag: f('US'), odds: '+3300', majors: 5 },
  { name: 'Patrick Cantlay', rank: 11, country: 'US', flag: f('US'), odds: '+3500', majors: 0 },
  { name: 'Collin Morikawa', rank: 12, country: 'US', flag: f('US'), odds: '+4000', majors: 2 },
  { name: 'Justin Thomas', rank: 13, country: 'US', flag: f('US'), odds: '+4500', majors: 2 },
  { name: 'Justin Rose', rank: 14, country: 'GB', flag: f('GB'), odds: '+5000', majors: 1 },
  { name: 'Russell Henley', rank: 15, country: 'US', flag: f('US'), odds: '+5000', majors: 0 },
  { name: 'Min Woo Lee', rank: 16, country: 'AU', flag: f('AU'), odds: '+5000', majors: 0 },
  { name: 'Nicolai Hojgaard', rank: 17, country: 'DK', flag: f('DK'), odds: '+5000', majors: 0 },
  { name: 'Tyrrell Hatton', rank: 18, country: 'GB', flag: f('GB'), odds: '+5000', majors: 0 },
  { name: 'Si Woo Kim', rank: 19, country: 'KR', flag: f('KR'), odds: '+5500', majors: 0 },
  { name: 'Viktor Hovland', rank: 20, country: 'NO', flag: f('NO'), odds: '+5500', majors: 0 },
  { name: 'Sam Burns', rank: 21, country: 'US', flag: f('US'), odds: '+5500', majors: 0 },
  { name: 'Rickie Fowler', rank: 22, country: 'US', flag: f('US'), odds: '+5500', majors: 0 },
  { name: 'Chris Gotterup', rank: 23, country: 'US', flag: f('US'), odds: '+6000', majors: 0 },
  { name: 'Robert MacIntyre', rank: 24, country: 'GB', flag: f('GB'), odds: '+6500', majors: 0 },
  { name: 'Adam Scott', rank: 25, country: 'AU', flag: f('AU'), odds: '+6500', majors: 1 },
  { name: 'J.J. Spaun', rank: 26, country: 'US', flag: f('US'), odds: '+6500', majors: 0 },

  // Pod B: Rank 27-52 (Contenders — +7000 to +12500)
  { name: 'Patrick Reed', rank: 27, country: 'US', flag: f('US'), odds: '+7000', majors: 1 },
  { name: 'Maverick McNealy', rank: 28, country: 'US', flag: f('US'), odds: '+7000', majors: 0 },
  { name: 'Joaquin Niemann', rank: 29, country: 'CL', flag: f('CL'), odds: '+8000', majors: 0 },
  { name: 'Kurt Kitayama', rank: 30, country: 'US', flag: f('US'), odds: '+8000', majors: 0 },
  { name: 'Jordan Spieth', rank: 31, country: 'US', flag: f('US'), odds: '+8000', majors: 3 },
  { name: 'Shane Lowry', rank: 32, country: 'IE', flag: f('IE'), odds: '+8000', majors: 1 },
  { name: 'Sepp Straka', rank: 33, country: 'AT', flag: f('AT'), odds: '+8000', majors: 0 },
  { name: 'Hideki Matsuyama', rank: 34, country: 'JP', flag: f('JP'), odds: '+10000', majors: 1 },
  { name: 'Keegan Bradley', rank: 35, country: 'US', flag: f('US'), odds: '+10000', majors: 1 },
  { name: 'Sahith Theegala', rank: 36, country: 'US', flag: f('US'), odds: '+10000', majors: 0 },
  { name: 'Ben Griffin', rank: 37, country: 'US', flag: f('US'), odds: '+10000', majors: 0 },
  { name: 'Harris English', rank: 38, country: 'US', flag: f('US'), odds: '+10000', majors: 0 },
  { name: 'Akshay Bhatia', rank: 39, country: 'US', flag: f('US'), odds: '+10000', majors: 0 },
  { name: 'Jacob Bridgeman', rank: 40, country: 'US', flag: f('US'), odds: '+10000', majors: 0 },
  { name: 'Jason Day', rank: 41, country: 'AU', flag: f('AU'), odds: '+12500', majors: 1 },
  { name: 'Sungjae Im', rank: 42, country: 'KR', flag: f('KR'), odds: '+12500', majors: 0 },
  { name: 'Corey Conners', rank: 43, country: 'CA', flag: f('CA'), odds: '+12500', majors: 0 },
  { name: 'Michael Thorbjornsen', rank: 44, country: 'US', flag: f('US'), odds: '+12500', majors: 0 },
  { name: 'Aaron Rai', rank: 45, country: 'GB', flag: f('GB'), odds: '+12500', majors: 0 },
  { name: 'Ryan Fox', rank: 46, country: 'NZ', flag: f('NZ'), odds: '+12500', majors: 0 },
  { name: 'Marco Penge', rank: 47, country: 'GB', flag: f('GB'), odds: '+12500', majors: 0 },
  { name: 'Ryan Gerard', rank: 48, country: 'US', flag: f('US'), odds: '+12500', majors: 0 },
  { name: 'Alex Noren', rank: 49, country: 'SE', flag: f('SE'), odds: '+12500', majors: 0 },
  { name: 'Rasmus Hojgaard', rank: 50, country: 'DK', flag: f('DK'), odds: '+12500', majors: 0 },
  { name: 'Cameron Smith', rank: 51, country: 'AU', flag: f('AU'), odds: '+12500', majors: 1 },
  { name: 'Denny McCarthy', rank: 52, country: 'US', flag: f('US'), odds: '+12500', majors: 0 },

  // Pod C: Rank 53-78 (Mid-pack — +15000 to +25000)
  { name: 'Wyndham Clark', rank: 53, country: 'US', flag: f('US'), odds: '+15000', majors: 1 },
  { name: 'Brian Harman', rank: 54, country: 'US', flag: f('US'), odds: '+15000', majors: 1 },
  { name: 'Emiliano Grillo', rank: 55, country: 'AR', flag: f('AR'), odds: '+15000', majors: 0 },
  { name: 'Davis Riley', rank: 56, country: 'US', flag: f('US'), odds: '+15000', majors: 0 },
  { name: 'Taylor Pendrith', rank: 57, country: 'CA', flag: f('CA'), odds: '+15000', majors: 0 },
  { name: 'Tom McKibbin', rank: 58, country: 'GB', flag: f('GB'), odds: '+15000', majors: 0 },
  { name: 'Matt McCarty', rank: 59, country: 'US', flag: f('US'), odds: '+15000', majors: 0 },
  { name: 'Michael Brennan', rank: 60, country: 'US', flag: f('US'), odds: '+15000', majors: 0 },
  { name: 'Alex Smalley', rank: 61, country: 'US', flag: f('US'), odds: '+15000', majors: 0 },
  { name: 'Christiaan Bezuidenhout', rank: 62, country: 'ZA', flag: f('ZA'), odds: '+15000', majors: 0 },
  { name: 'Thomas Detry', rank: 63, country: 'BE', flag: f('BE'), odds: '+15000', majors: 0 },
  { name: 'Nick Taylor', rank: 64, country: 'CA', flag: f('CA'), odds: '+17500', majors: 0 },
  { name: 'Max Greyserman', rank: 65, country: 'US', flag: f('US'), odds: '+17500', majors: 0 },
  { name: 'Daniel Berger', rank: 66, country: 'US', flag: f('US'), odds: '+17500', majors: 0 },
  { name: 'Nico Echavarria', rank: 67, country: 'CO', flag: f('CO'), odds: '+17500', majors: 0 },
  { name: 'Chris Kirk', rank: 68, country: 'US', flag: f('US'), odds: '+17500', majors: 0 },
  { name: 'Keith Mitchell', rank: 69, country: 'US', flag: f('US'), odds: '+17500', majors: 0 },
  { name: 'Andrew Novak', rank: 70, country: 'US', flag: f('US'), odds: '+17500', majors: 0 },
  { name: 'Kristoffer Reitan', rank: 71, country: 'NO', flag: f('NO'), odds: '+20000', majors: 0 },
  { name: 'Sam Stevens', rank: 72, country: 'US', flag: f('US'), odds: '+20000', majors: 0 },
  { name: 'Max Homa', rank: 73, country: 'US', flag: f('US'), odds: '+20000', majors: 0 },
  { name: 'Pierceson Coody', rank: 74, country: 'US', flag: f('US'), odds: '+20000', majors: 0 },
  { name: 'Jake Knapp', rank: 75, country: 'US', flag: f('US'), odds: '+20000', majors: 0 },
  { name: 'Aldrich Potgieter', rank: 76, country: 'ZA', flag: f('ZA'), odds: '+20000', majors: 0 },
  { name: 'David Puig', rank: 77, country: 'ES', flag: f('ES'), odds: '+20000', majors: 0 },
  { name: 'Garrick Higgo', rank: 78, country: 'ZA', flag: f('ZA'), odds: '+25000', majors: 0 },

  // Pod D: Rank 79-104 (Longshots — +25000 to +40000)
  { name: 'Dustin Johnson', rank: 79, country: 'US', flag: f('US'), odds: '+25000', majors: 2 },
  { name: 'Ryo Hisatsune', rank: 80, country: 'JP', flag: f('JP'), odds: '+25000', majors: 0 },
  { name: 'J.T. Poston', rank: 81, country: 'US', flag: f('US'), odds: '+25000', majors: 0 },
  { name: 'Patrick Rodgers', rank: 82, country: 'US', flag: f('US'), odds: '+25000', majors: 0 },
  { name: 'Adam Schenk', rank: 83, country: 'US', flag: f('US'), odds: '+25000', majors: 0 },
  { name: 'David Lipsky', rank: 84, country: 'US', flag: f('US'), odds: '+25000', majors: 0 },
  { name: 'Billy Horschel', rank: 85, country: 'US', flag: f('US'), odds: '+25000', majors: 0 },
  { name: 'Dan Brown', rank: 86, country: 'GB', flag: f('GB'), odds: '+25000', majors: 0 },
  { name: 'Haotong Li', rank: 87, country: 'CN', flag: f('CN'), odds: '+25000', majors: 0 },
  { name: 'Casey Jarvis', rank: 88, country: 'ZA', flag: f('ZA'), odds: '+25000', majors: 0 },
  { name: 'Tom Hoge', rank: 89, country: 'US', flag: f('US'), odds: '+25000', majors: 0 },
  { name: 'Stephan Jaeger', rank: 90, country: 'DE', flag: f('DE'), odds: '+30000', majors: 0 },
  { name: 'Lucas Glover', rank: 91, country: 'US', flag: f('US'), odds: '+30000', majors: 1 },
  { name: 'Brian Campbell', rank: 92, country: 'US', flag: f('US'), odds: '+30000', majors: 0 },
  { name: 'Michael Kim', rank: 93, country: 'US', flag: f('US'), odds: '+30000', majors: 0 },
  { name: 'Harry Hall', rank: 94, country: 'GB', flag: f('GB'), odds: '+30000', majors: 0 },
  { name: 'Sami Valimaki', rank: 95, country: 'FI', flag: f('FI'), odds: '+30000', majors: 0 },
  { name: 'Steven Fisk', rank: 96, country: 'US', flag: f('US'), odds: '+30000', majors: 0 },
  { name: 'Austin Smotherman', rank: 97, country: 'US', flag: f('US'), odds: '+30000', majors: 0 },
  { name: 'Rasmus Neergaard-Petersen', rank: 98, country: 'DK', flag: f('DK'), odds: '+30000', majors: 0 },
  { name: 'Kazuki Higa', rank: 99, country: 'JP', flag: f('JP'), odds: '+30000', majors: 0 },
  { name: 'Elvis Smylie', rank: 100, country: 'AU', flag: f('AU'), odds: '+30000', majors: 0 },
  { name: 'Jordan Smith', rank: 101, country: 'GB', flag: f('GB'), odds: '+30000', majors: 0 },
  { name: 'Jayden Schaper', rank: 102, country: 'ZA', flag: f('ZA'), odds: '+35000', majors: 0 },
  { name: 'Matt Wallace', rank: 103, country: 'GB', flag: f('GB'), odds: '+35000', majors: 0 },
  { name: 'Ricky Castillo', rank: 104, country: 'US', flag: f('US'), odds: '+35000', majors: 0 },

  // Pod E: Rank 105-130 (Deep longshots — +35000 to +50000)
  { name: 'Kota Kaneko', rank: 105, country: 'JP', flag: f('JP'), odds: '+35000', majors: 0 },
  { name: 'Mikael Lindberg', rank: 106, country: 'SE', flag: f('SE'), odds: '+35000', majors: 0 },
  { name: 'Daniel Hillier', rank: 107, country: 'NZ', flag: f('NZ'), odds: '+35000', majors: 0 },
  { name: 'Andrew Putnam', rank: 108, country: 'US', flag: f('US'), odds: '+35000', majors: 0 },
  { name: 'Bud Cauley', rank: 109, country: 'US', flag: f('US'), odds: '+35000', majors: 0 },
  { name: 'Jhonattan Vegas', rank: 110, country: 'VE', flag: f('VE'), odds: '+35000', majors: 0 },
  { name: 'Ben Kern', rank: 111, country: 'US', flag: f('US'), odds: '+40000', majors: 0 },
  { name: 'Adrien Saddier', rank: 112, country: 'FR', flag: f('FR'), odds: '+40000', majors: 0 },
  { name: 'Travis Smyth', rank: 113, country: 'AU', flag: f('AU'), odds: '+40000', majors: 0 },
  { name: 'Matti Schmid', rank: 114, country: 'DE', flag: f('DE'), odds: '+40000', majors: 0 },
  { name: 'Alex Fitzpatrick', rank: 115, country: 'GB', flag: f('GB'), odds: '+40000', majors: 0 },
  { name: 'Joe Highsmith', rank: 116, country: 'US', flag: f('US'), odds: '+40000', majors: 0 },
  { name: 'Derek Berg', rank: 117, country: 'US', flag: f('US'), odds: '+40000', majors: 0 },
  { name: 'Bernd Wiesberger', rank: 118, country: 'AT', flag: f('AT'), odds: '+40000', majors: 0 },
  { name: 'Rico Hoey', rank: 119, country: 'PH', flag: f('PH'), odds: '+40000', majors: 0 },
  { name: 'Bryce Fisher', rank: 120, country: 'US', flag: f('US'), odds: '+40000', majors: 0 },
  { name: 'Ben Polland', rank: 121, country: 'US', flag: f('US'), odds: '+40000', majors: 0 },
  { name: 'Jared Jones', rank: 122, country: 'US', flag: f('US'), odds: '+40000', majors: 0 },
  { name: 'Max McGreevy', rank: 123, country: 'US', flag: f('US'), odds: '+50000', majors: 0 },
  { name: 'Tyler Collet', rank: 124, country: 'US', flag: f('US'), odds: '+50000', majors: 0 },
  { name: 'Ian Holt', rank: 125, country: 'US', flag: f('US'), odds: '+50000', majors: 0 },
  { name: 'Austin Hurt', rank: 126, country: 'US', flag: f('US'), odds: '+50000', majors: 0 },
  { name: 'Ryan Lenahan', rank: 127, country: 'US', flag: f('US'), odds: '+50000', majors: 0 },
  { name: 'Braden Shattuck', rank: 128, country: 'US', flag: f('US'), odds: '+50000', majors: 0 },
  { name: 'Mark Geddes', rank: 129, country: 'GB', flag: f('GB'), odds: '+50000', majors: 0 },
  { name: 'Angel Ayora', rank: 130, country: 'ES', flag: f('ES'), odds: '+50000', majors: 0 },

  // Pod F: Rank 131+ (Past champs, long shots, PGA pros)
  { name: 'Gary Woodland', rank: 131, country: 'US', flag: f('US'), odds: '+50000', majors: 1 },
  { name: 'Martin Kaymer', rank: 132, country: 'DE', flag: f('DE'), odds: '+50000', majors: 2 },
  { name: 'Luke Donald', rank: 133, country: 'GB', flag: f('GB'), odds: '+100000', majors: 0 },
  { name: 'Stewart Cink', rank: 134, country: 'US', flag: f('US'), odds: '+100000', majors: 1 },
  { name: 'Padraig Harrington', rank: 135, country: 'IE', flag: f('IE'), odds: '+100000', majors: 3 },
  { name: 'Y.E. Yang', rank: 136, country: 'KR', flag: f('KR'), odds: '+100000', majors: 1 },
  { name: 'Jason Dufner', rank: 137, country: 'US', flag: f('US'), odds: '+100000', majors: 1 },
  { name: 'Jimmy Walker', rank: 138, country: 'US', flag: f('US'), odds: '+100000', majors: 1 },
  { name: 'Shaun Micheel', rank: 139, country: 'US', flag: f('US'), odds: '+100000', majors: 1 },
  { name: 'Brandt Snedeker', rank: 140, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Michael Block', rank: 141, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Francisco Bide', rank: 142, country: 'AR', flag: f('AR'), odds: '+100000', majors: 0 },
  { name: 'William Mouw', rank: 143, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Chris Gabriele', rank: 144, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Johnny Keefer', rank: 145, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'John Parry', rank: 146, country: 'GB', flag: f('GB'), odds: '+100000', majors: 0 },
  { name: 'Jordan Gumberg', rank: 147, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Ryan Vermeer', rank: 148, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Paul McClure', rank: 149, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Michael Kartrude', rank: 150, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Jesse Droemer', rank: 151, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Garrett Sapp', rank: 152, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Chandler Blanchet', rank: 153, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Zach Haynes', rank: 154, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Timothy Wiseman', rank: 155, country: 'US', flag: f('US'), odds: '+100000', majors: 0 },
  { name: 'Sudarshan Yellamaraju', rank: 156, country: 'CA', flag: f('CA'), odds: '+100000', majors: 0 },
  { name: 'Andy Sullivan', rank: 157, country: 'GB', flag: f('GB'), odds: '+100000', majors: 0 },
];

// ESPN name -> our name mapping (for accent normalization during live tournament)
export const ESPN_NAME_MAP = {
  'Ludvig Åberg': 'Ludvig Aberg',
  'Nicolai Højgaard': 'Nicolai Hojgaard',
  'Rasmus Højgaard': 'Rasmus Hojgaard',
  'Sami Välimäki': 'Sami Valimaki',
  'Nico Echavarría': 'Nico Echavarria',
  'Joaquín Niemann': 'Joaquin Niemann',
  'Pádraig Harrington': 'Padraig Harrington',
  'Francisco Bidé': 'Francisco Bide',
};

// Normalize ESPN name to match our golfer list
export const normalizeESPNName = (espnName) => {
  if (!espnName) return '';
  if (ESPN_NAME_MAP[espnName]) return ESPN_NAME_MAP[espnName];
  return espnName
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ø/g, 'o').replace(/Ø/g, 'O')
    .replace(/æ/g, 'ae').replace(/Æ/g, 'Ae')
    .replace(/ð/g, 'd').replace(/Ð/g, 'D')
    .replace(/þ/g, 'th').replace(/Þ/g, 'Th');
};

// Pod definitions — 10 per pod (A-E), all remaining in F
export const PODS = [
  { id: 'A', label: 'Pod A', subtitle: 'Favorites', range: [1, 10] },
  { id: 'B', label: 'Pod B', subtitle: 'Contenders', range: [11, 20] },
  { id: 'C', label: 'Pod C', subtitle: 'Mid-Pack', range: [21, 30] },
  { id: 'D', label: 'Pod D', subtitle: 'Longshots', range: [31, 40] },
  { id: 'E', label: 'Pod E', subtitle: 'Deep Field', range: [41, 50] },
  { id: 'F', label: 'Pod F', subtitle: 'The Field', range: [51, 999] },
];

export const getGolfersInPod = (podOrIndex) => {
  const pod = typeof podOrIndex === 'number' ? PODS[podOrIndex] : podOrIndex;
  if (!pod || !pod.range) return [];
  return GOLFERS.filter(g => g.rank >= pod.range[0] && g.rank <= pod.range[1]);
};
