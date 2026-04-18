// MLB headshot URL helper
export function getHeadshotUrl(mlbId) {
  return `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${mlbId}/headshot/67/current`;
}

// Philadelphia Phillies all-time leaders by franchise WAR (bWAR per Baseball-Reference)
// Data current through 2025 season. mlbId is null for players without MLB.com headshots;
// createPlayerImg() in utils.js falls back to an SVG with the player's initials.
export const positionPlayers = [
  { rank: 1,  player: "Mike Schmidt",        position: "3B",    years: "1972-1989",              war: 106.9, g: 2404, pa: 10062, avg: .267, obp: .380, slg: .527, opsPlus: 147, hr: 548, rbi: 1595, sb: 174, allStar: 12, mlbId: 121836 },
  { rank: 2,  player: "Chase Utley",         position: "2B",    years: "2003-2015",              war: 61.8, g: 1551, pa: 6552, avg: .282, obp: .366, slg: .481, opsPlus: 124, hr: 233, rbi: 916, sb: 136, allStar: 6, mlbId: 400284 },
  { rank: 3,  player: "Ed Delahanty",        position: "LF",    years: "1888-1889, 1891-1901",  war: 60.2, g: 1544, pa: 6711, avg: .348, obp: .414, slg: .509, opsPlus: 155, hr: 87, rbi: 1288, sb: 411, allStar: 0, mlbId: null },
  { rank: 4,  player: "Richie Ashburn",      position: "CF",    years: "1948-1959",              war: 57.7, g: 1794, pa: 8223, avg: .311, obp: .394, slg: .388, opsPlus: 113, hr: 22, rbi: 499, sb: 199, allStar: 5, mlbId: 110349 },
  { rank: 5,  player: "Sherry Magee",        position: "LF",    years: "1904-1914",              war: 49.1, g: 1522, pa: 6213, avg: .299, obp: .366, slg: .447, opsPlus: 148, hr: 75, rbi: 886, sb: 387, allStar: 0, mlbId: null },
  { rank: 6,  player: "Bobby Abreu",         position: "RF",    years: "1998-2006",              war: 47.2, g: 1353, pa: 5998, avg: .303, obp: .416, slg: .513, opsPlus: 140, hr: 195, rbi: 814, sb: 254, allStar: 2, mlbId: 110029 },
  { rank: 7,  player: "Jimmy Rollins",       position: "SS",    years: "2000-2014",              war: 46.4, g: 2090, pa: 9095, avg: .267, obp: .327, slg: .424, opsPlus: 97, hr: 216, rbi: 887, sb: 453, allStar: 3, mlbId: 276519 },
  { rank: 8,  player: "Billy Hamilton",      position: "CF",    years: "1890-1895",              war: 42.1, g: 729, pa: 3470, avg: .361, obp: .468, slg: .468, opsPlus: 160, hr: 22, rbi: 367, sb: 508, allStar: 0, mlbId: null },
  { rank: 9,  player: "Johnny Callison",     position: "RF",    years: "1960-1969",              war: 39.5, g: 1432, pa: 6002, avg: .271, obp: .332, slg: .449, opsPlus: 119, hr: 185, rbi: 666, sb: 59, allStar: 3, mlbId: 111895 },
  { rank: 10, player: "Dick Allen",          position: "3B/1B", years: "1963-1969, 1975-1976",  war: 37.5, g: 1070, pa: 4495, avg: .290, obp: .371, slg: .530, opsPlus: 155, hr: 204, rbi: 655, sb: 86, allStar: 5, mlbId: 110157 },
  { rank: 11, player: "Chuck Klein",         position: "RF",    years: "1928-1933, 1936-1944",  war: 36.5, g: 1405, pa: 5704, avg: .326, obp: .382, slg: .553, opsPlus: 139, hr: 243, rbi: 983, sb: 71, allStar: 2, mlbId: null },
  { rank: 12, player: "Gavvy Cravath",       position: "RF",    years: "1912-1920",              war: 31.0, g: 1104, pa: 4436, avg: .291, obp: .380, slg: .486, opsPlus: 151, hr: 117, rbi: 676, sb: 88, allStar: 0, mlbId: null },
  { rank: 13, player: "Cy Williams",         position: "CF",    years: "1918-1930",              war: 30.3, g: 1463, pa: 5971, avg: .306, obp: .374, slg: .487, opsPlus: 131, hr: 217, rbi: 795, sb: 67, allStar: 0, mlbId: null },
  { rank: 14, player: "Sam Thompson",        position: "RF",    years: "1889-1898",              war: 28.8, g: 1036, pa: 4658, avg: .334, obp: .388, slg: .511, opsPlus: 146, hr: 95, rbi: 957, sb: 187, allStar: 0, mlbId: null },
  { rank: 15, player: "Scott Rolen",         position: "3B",    years: "1996-2002",              war: 28.3, g: 788, pa: 3389, avg: .282, obp: .373, slg: .504, opsPlus: 127, hr: 150, rbi: 559, sb: 59, allStar: 1, mlbId: 121409 },
  { rank: 16, player: "Bryce Harper",        position: "RF/1B", years: "2019-present",           war: 27.5, g: 855, pa: 3660, avg: .281, obp: .390, slg: .524, opsPlus: 146, hr: 196, rbi: 577, sb: 58, allStar: 3, mlbId: 547180 },
  { rank: 17, player: "Del Ennis",           position: "LF",    years: "1946-1956",              war: 26.4, g: 1630, pa: 6823, avg: .286, obp: .343, slg: .472, opsPlus: 121, hr: 259, rbi: 1124, sb: 41, allStar: 3, mlbId: null },
  { rank: 18, player: "Jack Clements",       position: "C",     years: "1884-1897",              war: 25.9, g: 1004, pa: 3867, avg: .289, obp: .352, slg: .426, opsPlus: 118, hr: 70, rbi: 619, sb: 57, allStar: 0, mlbId: null },
  { rank: 19, player: "Lenny Dykstra",       position: "CF",    years: "1989-1996",              war: 25.4, g: 723, pa: 3283, avg: .289, obp: .388, slg: .436, opsPlus: 122, hr: 51, rbi: 255, sb: 169, allStar: 2, mlbId: 113686 },
  { rank: 20, player: "Von Hayes",           position: "RF/1B", years: "1983-1991",              war: 25.3, g: 1225, pa: 4986, avg: .272, obp: .361, slg: .415, opsPlus: 117, hr: 124, rbi: 616, sb: 202, allStar: 1, mlbId: 115646 },
  { rank: 21, player: "Garry Maddox",        position: "CF",    years: "1975-1986",              war: 23.5, g: 1465, pa: 5771, avg: .284, obp: .317, slg: .418, opsPlus: 105, hr: 85, rbi: 566, sb: 189, allStar: 1, mlbId: 118117 },
  { rank: 22, player: "Nap Lajoie",          position: "2B",    years: "1896-1900",              war: 23.5, g: 479, pa: 2052, avg: .345, obp: .377, slg: .503, opsPlus: 142, hr: 32, rbi: 394, sb: 106, allStar: 0, mlbId: null },
  { rank: 23, player: "Roy Thomas",          position: "CF",    years: "1899-1908, 1910-1911",  war: 23.5, g: 1321, pa: 5943, avg: .296, obp: .415, slg: .335, opsPlus: 124, hr: 6, rbi: 268, sb: 228, allStar: 0, mlbId: null },
  { rank: 24, player: "John Kruk",           position: "1B",    years: "1989-1994",              war: 22.5, g: 737, pa: 2888, avg: .309, obp: .400, slg: .461, opsPlus: 133, hr: 62, rbi: 390, sb: 20, allStar: 3, mlbId: 117339 },
  { rank: 25, player: "Darren Daulton",      position: "C",     years: "1983-1997",              war: 22.4, g: 1109, pa: 4104, avg: .245, obp: .357, slg: .427, opsPlus: 110, hr: 134, rbi: 567, sb: 50, allStar: 3, mlbId: 113074 },
  { rank: 26, player: "Shane Victorino",     position: "CF",    years: "2005-2012",              war: 22.3, g: 987, pa: 4194, avg: .279, obp: .345, slg: .439, opsPlus: 110, hr: 88, rbi: 390, sb: 179, allStar: 2, mlbId: 425664 },
  { rank: 27, player: "J.T. Realmuto",       position: "C",     years: "2019-present",           war: 22.0, g: 865, pa: 3449, avg: .262, obp: .321, slg: .438, opsPlus: 109, hr: 131, rbi: 447, sb: 68, allStar: 2, mlbId: 592663 },
  { rank: 28, player: "Carlos Ruiz",         position: "C",     years: "2006-2016",              war: 21.8, g: 1070, pa: 3621, avg: .266, obp: .349, slg: .396, opsPlus: 101, hr: 68, rbi: 401, sb: 11, allStar: 1, mlbId: 434563 },
  { rank: 29, player: "Willie Jones",        position: "3B",    years: "1947-1959",              war: 21.1, g: 1520, pa: 5931, avg: .258, obp: .345, slg: .411, opsPlus: 103, hr: 180, rbi: 753, sb: 35, allStar: 2, mlbId: null },
  { rank: 30, player: "John Titus",          position: "RF",    years: "1903-1912",              war: 20.8, g: 1159, pa: 4604, avg: .278, obp: .372, slg: .383, opsPlus: 127, hr: 32, rbi: 461, sb: 115, allStar: 0, mlbId: null },
  { rank: 31, player: "Fred Luderus",        position: "1B",    years: "1910-1920",              war: 19.9, g: 1298, pa: 5115, avg: .278, obp: .346, slg: .411, opsPlus: 130, hr: 83, rbi: 642, sb: 67, allStar: 0, mlbId: null },
  { rank: 32, player: "Greg Luzinski",       position: "LF",    years: "1970-1980",              war: 19.2, g: 1289, pa: 5201, avg: .281, obp: .363, slg: .489, opsPlus: 131, hr: 223, rbi: 811, sb: 26, allStar: 4, mlbId: 118023 },
  { rank: 33, player: "Granny Hamner",       position: "SS/2B", years: "1944-1959",              war: 19.2, g: 1501, pa: 6068, avg: .263, obp: .305, slg: .385, opsPlus: 91, hr: 103, rbi: 708, sb: 27, allStar: 3, mlbId: null },
  { rank: 34, player: "Elmer Flick",         position: "RF",    years: "1898-1901",              war: 18.8, g: 527, pa: 2320, avg: .345, obp: .417, slg: .504, opsPlus: 150, hr: 27, rbi: 377, sb: 111, allStar: 0, mlbId: null },
  { rank: 35, player: "Larry Bowa",          position: "SS",    years: "1970-1981",              war: 18.7, g: 1739, pa: 7122, avg: .264, obp: .302, slg: .323, opsPlus: 72, hr: 13, rbi: 421, sb: 288, allStar: 5, mlbId: 111281 },
  { rank: 36, player: "Pat Burrell",         position: "LF",    years: "2000-2008",              war: 18.4, g: 1306, pa: 5325, avg: .257, obp: .367, slg: .485, opsPlus: 121, hr: 251, rbi: 827, sb: 5, allStar: 0, mlbId: 150100 },
  { rank: 37, player: "Tony Gonzalez",       position: "CF",    years: "1960-1968",              war: 18.3, g: 1118, pa: 4247, avg: .295, obp: .358, slg: .418, opsPlus: 115, hr: 68, rbi: 422, sb: 56, allStar: 0, mlbId: 114925 },
  { rank: 38, player: "Bob Boone",           position: "C",     years: "1972-1981",              war: 17.3, g: 1095, pa: 3940, avg: .259, obp: .321, slg: .374, opsPlus: 96, hr: 65, rbi: 456, sb: 29, allStar: 3, mlbId: 111221 },
  { rank: 39, player: "Ryan Howard",         position: "1B",    years: "2004-2016",              war: 16.4, g: 1572, pa: 6531, avg: .258, obp: .343, slg: .515, opsPlus: 128, hr: 382, rbi: 1194, sb: 8, allStar: 3, mlbId: 429667 },
  { rank: 40, player: "Mike Lieberthal",     position: "C",     years: "1994-2006",              war: 16.3, g: 1212, pa: 4657, avg: .275, obp: .337, slg: .446, opsPlus: 101, hr: 150, rbi: 609, sb: 10, allStar: 2, mlbId: 117759 },
  { rank: 41, player: "Jayson Werth",        position: "RF",    years: "2007-2010",              war: 15.7, g: 531, pa: 2178, avg: .282, obp: .380, slg: .506, opsPlus: 129, hr: 95, rbi: 300, sb: 49, allStar: 1, mlbId: 150029 },
  { rank: 42, player: "Placido Polanco",     position: "2B/3B", years: "2002-2005, 2010-2012",  war: 14.8, g: 808, pa: 3395, avg: .298, obp: .346, slg: .409, opsPlus: 99, hr: 41, rbi: 305, sb: 37, allStar: 1, mlbId: 135784 },
  { rank: 43, player: "Trea Turner",         position: "SS",    years: "2023-present",           war: 14.5, g: 452, pa: 1975, avg: .296, obp: .342, slg: .462, opsPlus: 118, hr: 65, rbi: 217, sb: 79, allStar: 1, mlbId: 607208 },
  { rank: 44, player: "Kyle Schwarber",      position: "LF",    years: "2022-present",           war: 14.0, g: 609, pa: 2731, avg: .230, obp: .345, slg: .495, opsPlus: 127, hr: 176, rbi: 405, sb: 21, allStar: 2, mlbId: 656941 },
  { rank: 45, player: "Rhys Hoskins",        position: "1B",    years: "2017-2022",              war: 13.3, g: 646, pa: 2782, avg: .242, obp: .353, slg: .492, opsPlus: 124, hr: 148, rbi: 405, sb: 12, allStar: 0, mlbId: 656555 },
  { rank: 46, player: "Pete Rose",           position: "1B",    years: "1979-1983",              war: 9.3, g: 745, pa: 3371, avg: .291, obp: .365, slg: .361, opsPlus: 103, hr: 15, rbi: 255, sb: 29, allStar: 2, mlbId: 121454 },
  { rank: 47, player: "Jim Thome",           position: "1B",    years: "2003-2005, 2012",        war: 9.0, g: 404, pa: 1660, avg: .260, obp: .396, slg: .541, opsPlus: 142, hr: 101, rbi: 281, sb: 1, allStar: 1, mlbId: 123272 },
  { rank: 48, player: "Raúl Ibañez",         position: "LF",    years: "2009-2011",              war: 5.9, g: 445, pa: 1834, avg: .264, obp: .329, slg: .469, opsPlus: 114, hr: 70, rbi: 260, sb: 10, allStar: 1, mlbId: 116380 },
  { rank: 49, player: "Hunter Pence",        position: "RF",    years: "2011-2012",              war: 4.8, g: 155, pa: 670, avg: .290, obp: .343, slg: .479, opsPlus: 123, hr: 28, rbi: 94, sb: 10, allStar: 0, mlbId: 452254 },
  { rank: 50, player: "Andrew McCutchen",    position: "LF",    years: "2019-2021",              war: 4.0, g: 302, pa: 1294, avg: .240, obp: .353, slg: .438, opsPlus: 110, hr: 55, rbi: 142, sb: 11, allStar: 0, mlbId: 457705 },
];

export const pitchers = [
  { rank: 1,  player: "Robin Roberts",             years: "1948-1961",               war: 69.8, w: 234, l: 199, era: 3.46, eraPlus: 111, g: 529, gs: 472, ip: 3739.1, so: 1871, whip: 1.18, allStar: 7, mlbId: 121283 },
  { rank: 2,  player: "Steve Carlton",             years: "1972-1986",               war: 64.6, w: 241, l: 161, era: 3.09, eraPlus: 118, g: 499, gs: 499, ip: 3697.1, so: 3031, whip: 1.20, allStar: 8, mlbId: 112008 },
  { rank: 3,  player: "Grover Cleveland Alexander", years: "1911-1917, 1930",        war: 60.9, w: 190, l: 91, era: 2.18, eraPlus: 147, g: 338, gs: 302, ip: 2513.2, so: 1409, whip: 1.08, allStar: 0, mlbId: null },
  { rank: 4,  player: "Cole Hamels",               years: "2006-2015",               war: 42.0, w: 114, l: 90, era: 3.30, eraPlus: 123, g: 294, gs: 294, ip: 1915.2, so: 1844, whip: 1.15, allStar: 3, mlbId: 430935 },
  { rank: 5,  player: "Curt Schilling",            years: "1992-2000",               war: 36.8, w: 101, l: 78, era: 3.35, eraPlus: 121, g: 242, gs: 226, ip: 1659.1, so: 1554, whip: 1.15, allStar: 3, mlbId: 121811 },
  { rank: 6,  player: "Aaron Nola",                years: "2015-present",            war: 36.3, w: 110, l: 90, era: 3.83, eraPlus: 110, g: 298, gs: 297, ip: 1770.1, so: 1895, whip: 1.15, allStar: 1, mlbId: 605400 },
  { rank: 7,  player: "Chris Short",               years: "1959-1972",               war: 32.1, w: 132, l: 127, era: 3.38, eraPlus: 104, g: 459, gs: 301, ip: 2253.0, so: 1585, whip: 1.28, allStar: 2, mlbId: null },
  { rank: 8,  player: "Jim Bunning",               years: "1964-1967, 1970-1971",   war: 31.4, w: 89, l: 73, era: 2.93, eraPlus: 115, g: 199, gs: 193, ip: 1520.2, so: 1197, whip: 1.11, allStar: 2, mlbId: 111691 },
  { rank: 9,  player: "Zack Wheeler",              years: "2020-present",            war: 30.8, w: 82, l: 44, era: 2.94, eraPlus: 141, g: 169, gs: 169, ip: 1038.1, so: 1117, whip: 1.06, allStar: 3, mlbId: 554430 },
  { rank: 10, player: "Charlie Ferguson",          years: "1884-1887",               war: 29.3, w: 99, l: 64, era: 2.67, eraPlus: 121, g: 183, gs: 170, ip: 1514.2, so: 728, whip: 1.12, allStar: 0, mlbId: null },
  { rank: 11, player: "Curt Simmons",              years: "1947-1950, 1952-1960",   war: 28.4, w: 115, l: 110, era: 3.66, eraPlus: 104, g: 325, gs: 263, ip: 1939.2, so: 1052, whip: 1.34, allStar: 3, mlbId: null },
  { rank: 12, player: "Charlie Buffinton",         years: "1887-1889",               war: 21.2, w: 79, l: 54, era: 2.96, eraPlus: 119, g: 135, gs: 130, ip: 1132.0, so: 472, whip: 1.17, allStar: 0, mlbId: null },
  { rank: 13, player: "Al Orth",                   years: "1895-1901",               war: 20.3, w: 100, l: 72, era: 3.49, eraPlus: 121, g: 200, gs: 175, ip: 1504.1, so: 299, whip: 1.30, allStar: 0, mlbId: null },
  { rank: 14, player: "Roy Halladay",              years: "2010-2013",               war: 20.2, w: 55, l: 29, era: 3.25, eraPlus: 123, g: 103, gs: 103, ip: 718.2, so: 622, whip: 1.09, allStar: 2, mlbId: 136880 },
  { rank: 15, player: "Cliff Lee",                 years: "2009, 2011-2014",        war: 19.5, w: 55, l: 37, era: 2.94, eraPlus: 136, g: 118, gs: 117, ip: 822.0, so: 820, whip: 1.07, allStar: 2, mlbId: 435261 },
  { rank: 16, player: "Tully Sparks",              years: "1903-1910",               war: 17.8, w: 95, l: 95, era: 2.48, eraPlus: 111, g: 253, gs: 211, ip: 1692.2, so: 475, whip: 1.18, allStar: 0, mlbId: null },
  { rank: 17, player: "Brett Myers",               years: "2002-2009",               war: 16.8, w: 73, l: 63, era: 4.40, eraPlus: 99, g: 234, gs: 165, ip: 1213.1, so: 1003, whip: 1.33, allStar: 0, mlbId: 425492 },
  { rank: 18, player: "Tug McGraw",                years: "1975-1984",               war: 14.6, w: 49, l: 37, era: 3.10, eraPlus: 122, g: 463, gs: 2, ip: 722.2, so: 488, whip: 1.23, allStar: 0, mlbId: null },
  { rank: 19, player: "Larry Jackson",             years: "1966-1968",               war: 13.7, w: 41, l: 45, era: 3.20, eraPlus: 105, g: 97, gs: 97, ip: 690.2, so: 294, whip: 1.18, allStar: 0, mlbId: null },
  { rank: 20, player: "Kid Carsey",                years: "1892-1897",               war: 13.2, w: 96, l: 89, era: 4.58, eraPlus: 94, g: 221, gs: 207, ip: 1687.2, so: 309, whip: 1.60, allStar: 0, mlbId: null },
];

// Combined list sorted by WAR
export const allPlayers = [
  ...positionPlayers.map(p => ({ ...p, type: "position" })),
  ...pitchers.map(p => ({ ...p, type: "pitcher" })),
].sort((a, b) => b.war - a.war);

// Best player at each position for the diamond
export const bestByPosition = {
  "P":  pitchers[0],                                                                              // Robin Roberts
  "C":  positionPlayers.find(p => p.position === "C"),                                            // Jack Clements (pre-modern) — swap to Daulton if preferred
  "1B": positionPlayers.filter(p => p.position.startsWith("1B")).sort((a,b) => b.war - a.war)[0], // Kruk
  "2B": positionPlayers.find(p => p.position.startsWith("2B")),                                   // Utley
  "SS": positionPlayers.find(p => p.position === "SS"),                                           // Rollins
  "3B": positionPlayers.find(p => p.position === "3B" || p.position.startsWith("3B")),            // Schmidt
  "LF": positionPlayers.find(p => p.position === "LF"),                                           // Delahanty
  "CF": positionPlayers.find(p => p.position.startsWith("CF")),                                   // Ashburn
  "RF": positionPlayers.find(p => p.position === "RF"),                                           // Abreu
};

// All pitchers for reference
export { pitchers as allPitchers };
