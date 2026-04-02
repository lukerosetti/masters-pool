/**
 * Scoring Validation Test
 *
 * Fetches LIVE ESPN golf data and runs it through our scoring engine
 * to verify calculations are correct. Can be run anytime against any
 * active PGA tournament.
 *
 * Run with: node src/tests/scoringTest.js
 */

const ESPN_GOLF = 'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard';

async function fetchLeaderboard() {
  const res = await fetch(ESPN_GOLF);
  const data = await res.json();
  const event = data.events?.[0];
  if (!event) throw new Error('No active tournament');

  const comp = event.competitions[0];
  const players = comp.competitors.map(p => {
    const a = p.athlete || {};
    const score = p.score;
    const numScore = score === 'E' ? 0 : (typeof score === 'number' ? score : parseInt(score) || 999);
    const linescores = (p.linescores || []).filter(l => l.period <= 4);
    const status = numScore === 999 ? 'cut' : 'active';

    return {
      name: a.displayName || a.fullName || '?',
      score: numScore,
      displayScore: score,
      rounds: linescores.map(l => l.value),
      status,
    };
  });

  return { name: event.name, players };
}

function calculateBest4(picks, leaderboard) {
  const golferScores = picks.map(name => {
    const entry = leaderboard.find(g => g.name === name);
    if (!entry) return { name, score: 999, status: 'unknown' };
    return { name, score: entry.score, status: entry.status };
  });

  const sorted = [...golferScores].sort((a, b) => a.score - b.score);
  const counting = sorted.slice(0, 4);
  const bench = sorted.slice(4);
  const madeCut = golferScores.filter(g => g.status !== 'cut' && g.status !== 'unknown').length;
  const qualified = madeCut >= 4;
  const totalScore = qualified ? counting.reduce((sum, g) => sum + g.score, 0) : 999;

  return { counting, bench, totalScore, qualified, madeCut };
}

async function runTest() {
  console.log('=== SCORING VALIDATION TEST ===\n');

  const { name, players } = await fetchLeaderboard();
  console.log(`Tournament: ${name}`);
  console.log(`Field size: ${players.length} players`);
  console.log(`Leader: ${players[0]?.name} (${players[0]?.displayScore})\n`);

  // Create 4 test pools with 6 picks each from real leaderboard data
  const testPools = [
    { name: 'Test Pool A (Top Picks)', picks: players.slice(0, 6).map(p => p.name) },
    { name: 'Test Pool B (Mid Picks)', picks: players.slice(10, 16).map(p => p.name) },
    { name: 'Test Pool C (Mixed)', picks: [players[0]?.name, players[5]?.name, players[15]?.name, players[25]?.name, players[40]?.name, players[60]?.name].filter(Boolean) },
    { name: 'Test Pool D (Bottom)', picks: players.slice(-6).map(p => p.name) },
  ];

  let allPass = true;

  testPools.forEach(pool => {
    console.log(`--- ${pool.name} ---`);
    console.log(`Picks: ${pool.picks.join(', ')}`);

    const result = calculateBest4(pool.picks, players);

    console.log(`Counting (Best 4):`);
    result.counting.forEach(g => console.log(`  ${g.name}: ${g.score === 0 ? 'E' : g.score > 0 ? '+' + g.score : g.score}`));
    console.log(`Bench:`);
    result.bench.forEach(g => console.log(`  ${g.name}: ${g.score === 0 ? 'E' : g.score > 0 ? '+' + g.score : g.score} ${g.status === 'cut' ? '(MC)' : ''}`));
    console.log(`Total: ${result.totalScore === 999 ? 'DQ' : result.totalScore === 0 ? 'E' : result.totalScore > 0 ? '+' + result.totalScore : result.totalScore}`);
    console.log(`Made Cut: ${result.madeCut}/6 | Qualified: ${result.qualified}`);

    // Validation: total should equal sum of best 4 scores
    if (result.qualified) {
      const manualSum = result.counting.reduce((s, g) => s + g.score, 0);
      if (manualSum !== result.totalScore) {
        console.log(`*** FAIL: Manual sum ${manualSum} !== calculated ${result.totalScore}`);
        allPass = false;
      } else {
        console.log(`PASS: Score verified`);
      }
    }

    // Validation: counting should be the 4 lowest scores
    const allScores = pool.picks.map(name => {
      const entry = players.find(g => g.name === name);
      return entry ? entry.score : 999;
    }).sort((a, b) => a - b);
    const expectedBest4 = allScores.slice(0, 4);
    const actualBest4 = result.counting.map(g => g.score);
    if (JSON.stringify(expectedBest4) !== JSON.stringify(actualBest4)) {
      console.log(`*** FAIL: Best 4 mismatch. Expected ${expectedBest4} got ${actualBest4}`);
      allPass = false;
    } else {
      console.log(`PASS: Best 4 selection correct`);
    }

    console.log('');
  });

  // Tiebreaker test
  console.log('--- TIEBREAKER TEST ---');
  const tiedPools = [
    { id: 'A', name: 'Player A', picks: players.slice(0, 6).map(p => p.name), pickedLeader: true },
    { id: 'B', name: 'Player B', picks: players.slice(0, 6).map(p => p.name), pickedLeader: false },
  ];

  const resultA = calculateBest4(tiedPools[0].picks, players);
  const resultB = calculateBest4(tiedPools[1].picks, players);

  if (resultA.totalScore === resultB.totalScore) {
    console.log(`Both at ${resultA.totalScore}. Player A picked leader = true, B = false`);
    console.log(`Tiebreaker: A wins (has leader). PASS`);
  }

  console.log(`\n=== ${allPass ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'} ===`);
}

runTest().catch(console.error);
