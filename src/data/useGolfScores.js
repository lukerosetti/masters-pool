import { useState, useEffect, useCallback, useRef } from 'react';
import { normalizeESPNName } from './golfers';

const ESPN_GOLF = 'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard';
const PGA_CHAMP_EVENT_ID = '401811947';
const POLL_INTERVAL = 30000; // 30 seconds

export function useGolfScores() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [tournamentStatus, setTournamentStatus] = useState({
    name: 'PGA Championship',
    venue: 'Aronimink Golf Club',
    round: 0,
    roundLabel: '',
    status: 'pre_tournament',
    cutLine: '',
    projectedCutLine: null,
    lastUpdated: null,
  });
  const [scorecards, setScorecards] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasInitialFetch = useRef(false);

  const fetchScores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${ESPN_GOLF}?dates=20260514-20260517`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      // Find PGA Championship event
      const event = data.events?.find(e => e.id === PGA_CHAMP_EVENT_ID) || data.events?.[0];
      if (!event) { setIsLoading(false); return; }

      const comp = event.competitions?.[0];
      if (!comp) { setIsLoading(false); return; }

      // Parse tournament status
      const eventStatus = event.status?.type?.name || '';
      const eventState = event.status?.type?.state || 'pre';
      let status = 'pre_tournament';
      let round = 0;
      let roundLabel = '';

      if (eventState === 'in') {
        status = 'in_progress';
        // Determine current round by counting rounds with actual hole data
        // ESPN pre-populates empty linescore entries, so count by played holes
        let maxRoundWithData = 0;
        comp.competitors.forEach(p => {
          (p.linescores || []).forEach((ls, idx) => {
            const holesPlayed = (ls.linescores || []).filter(h => h.value != null).length;
            if (holesPlayed > 0 && (idx + 1) > maxRoundWithData) {
              maxRoundWithData = idx + 1;
            }
          });
        });
        round = maxRoundWithData || 1;
        const roundNames = { 1: 'Round 1', 2: 'Round 2', 3: 'Round 3 — Moving Day', 4: 'Final Round' };
        roundLabel = roundNames[round] || `Round ${round}`;
      } else if (eventState === 'post') {
        status = 'final';
        round = 4;
        roundLabel = 'Final';
      }

      // Helper: parse ESPN score string ("-3", "E", "+1") to a number, or null if invalid
      const parseScoreString = (raw) => {
        if (raw == null) return null;
        if (raw === 'E') return 0;
        const n = parseInt(raw);
        return isNaN(n) ? null : n;
      };

      // Official cut line: worst score among players NOT marked STATUS_CUT by ESPN.
      // Only populated once ESPN has actually flagged cut players.
      let cutLine = '';
      if (round >= 2) {
        const cutPlayers = comp.competitors.filter(p => {
          const st = p.status?.type?.name || '';
          return st === 'STATUS_CUT';
        });
        if (cutPlayers.length > 0) {
          const madeIt = comp.competitors.filter(p => {
            const st = p.status?.type?.name || '';
            return st !== 'STATUS_CUT' && st !== 'STATUS_WITHDRAWN' && st !== 'STATUS_DISQUALIFIED';
          });
          const worstMade = madeIt.reduce((worst, p) => {
            const s = parseScoreString(p.score);
            return (s != null && s > worst) ? s : worst;
          }, -999);
          cutLine = worstMade > 0 ? `+${worstMade}` : worstMade === 0 ? 'E' : String(worstMade);
        }
      }

      // Projected cut line (PGA Championship: top 65 + ties).
      let projectedCutLine = null;
      if (round >= 2) {
        const validScores = comp.competitors
          .map(p => parseScoreString(p.score))
          .filter(s => s !== null)
          .sort((a, b) => a - b);
        if (validScores.length >= 60) {
          projectedCutLine = validScores[64];
        }
      }

      setTournamentStatus({
        name: event.name || 'PGA Championship',
        venue: 'Aronimink Golf Club',
        round,
        roundLabel,
        status,
        cutLine,
        projectedCutLine,
        lastUpdated: Date.now(),
      });

      // Parse leaderboard
      const players = comp.competitors || [];
      const board = [];
      const cards = {};

      players.forEach((p, idx) => {
        const athlete = p.athlete || {};
        const espnName = athlete.displayName || '';
        const name = normalizeESPNName(espnName);
        if (!name) return;

        const rawScore = p.score; // total to par (string like "-3", "E", "+1", or null)
        const score = rawScore === 'E' ? 0 : (rawScore != null ? parseInt(rawScore) : null);
        // score is now a number (or null/NaN for unstarted)
        const linescores = p.linescores || [];
        const playerStatus = p.status?.type?.name || '';

        // Determine position
        let pos = p.order || (idx + 1);
        let movement = 'same';
        let playerState = 'upcoming';

        if (playerStatus === 'STATUS_CUT') {
          pos = 'MC';
          playerState = 'cut';
        } else if (playerStatus === 'STATUS_WITHDRAWN') {
          pos = 'WD';
          playerState = 'cut';
        } else if (playerStatus === 'STATUS_DISQUALIFIED') {
          pos = 'DQ';
          playerState = 'cut';
        } else if (eventState === 'in' || eventState === 'post') {
          playerState = 'active';
        }

        // Parse today's score and thru
        // Find the latest round with actual hole data (not empty pre-populated rounds)
        let today = null;
        let thru = null;
        if (linescores.length > 0) {
          let currentRound = null;
          for (let ri = linescores.length - 1; ri >= 0; ri--) {
            const ls = linescores[ri];
            const played = (ls?.linescores || []).filter(h => h.value != null).length;
            if (played > 0) { currentRound = ls; break; }
          }
          if (!currentRound) currentRound = linescores[0]; // fallback
          if (currentRound) {
            today = currentRound.displayValue || null;
            if (today === 'E') today = 'E';
            else if (today) {
              const num = parseInt(today);
              if (!isNaN(num)) today = num;
            }

            const holeScores = currentRound.linescores || [];
            const holesPlayed = holeScores.filter(h => h.value != null).length;
            thru = holesPlayed >= 18 ? 'F' : holesPlayed > 0 ? holesPlayed : null;

            // If finished this round
            if (holesPlayed >= 18) {
              playerState = 'finished';
            }
          }
        }

        // Parse round scores for round pills
        const r1 = linescores[0]?.value || null;
        const r2 = linescores[1]?.value || null;
        const r3 = linescores[2]?.value || null;
        const r4 = linescores[3]?.value || null;

        board.push({
          name,
          pos,
          total: typeof score === 'number' && !isNaN(score) ? score : null,
          today,
          thru,
          r1, r2, r3, r4,
          status: playerState,
          movement,
        });

        // Build scorecard (hole-by-hole for each round)
        const rounds = [];
        const playoffHoles = [];
        linescores.forEach((ls, lsIdx) => {
          if (!ls) { rounds.push(null); return; }
          const holeScores = ls.linescores || [];
          if (holeScores.length === 0) { rounds.push(null); return; }

          // Regular rounds (1-4): holes 1-18
          if (lsIdx < 4) {
            const holes = new Array(18).fill(null);
            holeScores.forEach(h => {
              const holeNum = h.period;
              if (holeNum >= 1 && holeNum <= 18) {
                holes[holeNum - 1] = h.value != null ? h.value : null;
              }
            });
            rounds.push(holes);
          } else {
            // Playoff round (5+): collect all holes
            holeScores.forEach(h => {
              if (h.value != null) {
                playoffHoles.push({
                  hole: h.period,
                  score: h.value,
                  par: h.scoreType?.displayValue || null,
                });
              }
            });
          }
        });
        // Pad to 4 rounds
        while (rounds.length < 4) rounds.push(null);
        cards[name] = { rounds, playoff: playoffHoles.length > 0 ? playoffHoles : null };
      });

      // Sort by position/score
      board.sort((a, b) => {
        if (a.status === 'cut' && b.status !== 'cut') return 1;
        if (a.status !== 'cut' && b.status === 'cut') return -1;
        const aScore = typeof a.total === 'number' ? a.total : 999;
        const bScore = typeof b.total === 'number' ? b.total : 999;
        return aScore - bScore;
      });

      // Assign positions based on sort order (handle ties)
      let currentPos = 1;
      board.forEach((p, idx) => {
        if (p.status === 'cut' || p.pos === 'WD' || p.pos === 'DQ') return;
        if (idx > 0 && p.total === board[idx - 1].total) {
          p.pos = board[idx - 1].pos; // tied
        } else {
          p.pos = currentPos;
        }
        currentPos = idx + 2;
      });

      setLeaderboard(board);
      setScorecards(cards);
      hasInitialFetch.current = true;
    } catch (err) {
      console.error('Golf scores fetch error:', err);
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchScores]);

  return {
    leaderboard,
    tournamentStatus,
    scorecards,
    isLoading,
    error,
    refetch: fetchScores,
  };
}
