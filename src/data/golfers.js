// Masters 2026 field — OWGR-ranked, organized into pods
// Flag codes for emoji rendering
const f = (code) => String.fromCodePoint(...[...code].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));

export const GOLFERS = [
  // Pod A: OWGR 1-10
  { name: 'Scottie Scheffler', owgr: 1, country: 'US', flag: f('US'), majors: 2, mastersWins: 1 },
  { name: 'Xander Schauffele', owgr: 2, country: 'US', flag: f('US'), majors: 2, mastersWins: 0 },
  { name: 'Rory McIlroy', owgr: 3, country: 'GB', flag: f('GB'), majors: 4, mastersWins: 0 },
  { name: 'Collin Morikawa', owgr: 4, country: 'US', flag: f('US'), majors: 2, mastersWins: 0 },
  { name: 'Ludvig Aberg', owgr: 5, country: 'SE', flag: f('SE'), majors: 0, mastersWins: 0 },
  { name: 'Jon Rahm', owgr: 6, country: 'ES', flag: f('ES'), majors: 2, mastersWins: 1 },
  { name: 'Bryson DeChambeau', owgr: 7, country: 'US', flag: f('US'), majors: 2, mastersWins: 0 },
  { name: 'Viktor Hovland', owgr: 8, country: 'NO', flag: f('NO'), majors: 0, mastersWins: 0 },
  { name: 'Patrick Cantlay', owgr: 9, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Hideki Matsuyama', owgr: 10, country: 'JP', flag: f('JP'), majors: 1, mastersWins: 1 },

  // Pod B: OWGR 11-20
  { name: 'Tommy Fleetwood', owgr: 11, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Shane Lowry', owgr: 12, country: 'IE', flag: f('IE'), majors: 1, mastersWins: 0 },
  { name: 'Sam Burns', owgr: 13, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Sahith Theegala', owgr: 14, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Russell Henley', owgr: 15, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Wyndham Clark', owgr: 16, country: 'US', flag: f('US'), majors: 1, mastersWins: 0 },
  { name: 'Justin Thomas', owgr: 17, country: 'US', flag: f('US'), majors: 2, mastersWins: 0 },
  { name: 'Robert MacIntyre', owgr: 18, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Keegan Bradley', owgr: 19, country: 'US', flag: f('US'), majors: 1, mastersWins: 0 },
  { name: 'Matt Fitzpatrick', owgr: 20, country: 'GB', flag: f('GB'), majors: 1, mastersWins: 0 },

  // Pod C: OWGR 21-30
  { name: 'Akshay Bhatia', owgr: 21, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Min Woo Lee', owgr: 22, country: 'AU', flag: f('AU'), majors: 0, mastersWins: 0 },
  { name: 'Cameron Young', owgr: 23, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Sepp Straka', owgr: 24, country: 'AT', flag: f('AT'), majors: 0, mastersWins: 0 },
  { name: 'Corey Conners', owgr: 25, country: 'CA', flag: f('CA'), majors: 0, mastersWins: 0 },
  { name: 'Sungjae Im', owgr: 26, country: 'KR', flag: f('KR'), majors: 0, mastersWins: 0 },
  { name: 'Jason Day', owgr: 27, country: 'AU', flag: f('AU'), majors: 1, mastersWins: 0 },
  { name: 'Brian Harman', owgr: 28, country: 'US', flag: f('US'), majors: 1, mastersWins: 0 },
  { name: 'Tony Finau', owgr: 29, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Tyrrell Hatton', owgr: 30, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },

  // Pod D: OWGR 31-40
  { name: 'Aaron Rai', owgr: 31, country: 'GB', flag: f('GB'), majors: 0, mastersWins: 0 },
  { name: 'Denny McCarthy', owgr: 32, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Si Woo Kim', owgr: 33, country: 'KR', flag: f('KR'), majors: 0, mastersWins: 0 },
  { name: 'Cameron Smith', owgr: 34, country: 'AU', flag: f('AU'), majors: 1, mastersWins: 0 },
  { name: 'Dustin Johnson', owgr: 35, country: 'US', flag: f('US'), majors: 2, mastersWins: 1 },
  { name: 'Jordan Spieth', owgr: 36, country: 'US', flag: f('US'), majors: 3, mastersWins: 1 },
  { name: 'Brooks Koepka', owgr: 37, country: 'US', flag: f('US'), majors: 5, mastersWins: 0 },
  { name: 'Adam Scott', owgr: 38, country: 'AU', flag: f('AU'), majors: 1, mastersWins: 1 },
  { name: 'Justin Rose', owgr: 39, country: 'GB', flag: f('GB'), majors: 1, mastersWins: 0 },
  { name: 'Harris English', owgr: 40, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },

  // Pod E: OWGR 41-50
  { name: 'Kurt Kitayama', owgr: 41, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Ryan Fox', owgr: 42, country: 'NZ', flag: f('NZ'), majors: 0, mastersWins: 0 },
  { name: 'Chris Gotterup', owgr: 43, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Taylor Pendrith', owgr: 44, country: 'CA', flag: f('CA'), majors: 0, mastersWins: 0 },
  { name: 'Byeong Hun An', owgr: 45, country: 'KR', flag: f('KR'), majors: 0, mastersWins: 0 },
  { name: 'Davis Thompson', owgr: 46, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Tom Kim', owgr: 47, country: 'KR', flag: f('KR'), majors: 0, mastersWins: 0 },
  { name: 'Maverick McNealy', owgr: 48, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Ben Griffin', owgr: 49, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },
  { name: 'Nick Dunlap', owgr: 50, country: 'US', flag: f('US'), majors: 0, mastersWins: 0 },

  // Pod F: OWGR 51+
  { name: 'Tiger Woods', owgr: 51, country: 'US', flag: f('US'), majors: 15, mastersWins: 5 },
  { name: 'Phil Mickelson', owgr: 52, country: 'US', flag: f('US'), majors: 6, mastersWins: 3 },
  { name: 'Patrick Reed', owgr: 53, country: 'US', flag: f('US'), majors: 1, mastersWins: 1 },
  { name: 'Bubba Watson', owgr: 54, country: 'US', flag: f('US'), majors: 2, mastersWins: 2 },
  { name: 'Fred Couples', owgr: 55, country: 'US', flag: f('US'), majors: 1, mastersWins: 1 },
  { name: 'Zach Johnson', owgr: 56, country: 'US', flag: f('US'), majors: 2, mastersWins: 1 },
  { name: 'Larry Mize', owgr: 57, country: 'US', flag: f('US'), majors: 1, mastersWins: 1 },
  { name: 'Vijay Singh', owgr: 58, country: 'FJ', flag: f('FJ'), majors: 3, mastersWins: 1 },
  { name: 'Jose Maria Olazabal', owgr: 59, country: 'ES', flag: f('ES'), majors: 2, mastersWins: 2 },
  { name: 'Sandy Lyle', owgr: 60, country: 'GB', flag: f('GB'), majors: 2, mastersWins: 1 },
];

export const PODS = [
  { id: 'A', label: 'Pod A', subtitle: 'OWGR 1-10', range: [1, 10] },
  { id: 'B', label: 'Pod B', subtitle: 'OWGR 11-20', range: [11, 20] },
  { id: 'C', label: 'Pod C', subtitle: 'OWGR 21-30', range: [21, 30] },
  { id: 'D', label: 'Pod D', subtitle: 'OWGR 31-40', range: [31, 40] },
  { id: 'E', label: 'Pod E', subtitle: 'OWGR 41-50', range: [41, 50] },
  { id: 'F', label: 'Pod F', subtitle: 'OWGR 51+', range: [51, 999] },
];

export const getGolfersInPod = (pod) =>
  GOLFERS.filter(g => g.owgr >= pod.range[0] && g.owgr <= pod.range[1]);
