import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GOLFERS, PODS, getGolfersInPod } from './data/golfers';
import { subscribeToPool, submitPicks, joinPool, createPool, getPool } from './firebase';
import { TOURNAMENT_STATUS, MOCK_LEADERBOARD, MOCK_POOL_PLAYERS, MOCK_SCORECARD, AUGUSTA_HOLES, AUGUSTA_PAR, getGolferScore, formatScore, calculateStandings, getPickedBy, calcRoundScore, calcNines } from './data/mockTournament';
import './App.css';

// Haptic feedback utility
const haptic = (style = 'light') => {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(style === 'light' ? 10 : style === 'medium' ? 20 : 30);
    }
  } catch {}
};

function App() {
  const [screen, setScreen] = useState('home');
  const [poolId, setPoolId] = useState(() => localStorage.getItem('mastersPoolId') || '');
  const [playerId, setPlayerId] = useState(() => localStorage.getItem('mastersPlayerId') || '');
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('mastersPlayerName') || '');
  const [poolData, setPoolData] = useState(null);
  const [myPicks, setMyPicks] = useState({});
  const [currentPod, setCurrentPod] = useState(0);
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [createName, setCreateName] = useState('');
  const [commName, setCommName] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('picks');
  const [selectedGolfer, setSelectedGolfer] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pull-to-refresh
  const ptrRef = useRef(null);
  const ptrStartY = useRef(0);
  const [ptrPull, setPtrPull] = useState(0);
  const handlePtrStart = (e) => { ptrStartY.current = e.touches[0].clientY; };
  const handlePtrMove = (e) => {
    const el = ptrRef.current;
    if (!el || el.scrollTop > 0) return;
    const pull = Math.max(0, e.touches[0].clientY - ptrStartY.current);
    if (pull > 0) setPtrPull(Math.min(pull * 0.4, 60));
  };
  const handlePtrEnd = () => {
    if (ptrPull > 40) {
      setIsRefreshing(true);
      haptic('medium');
      // Simulate refresh (will be real ESPN fetch later)
      setTimeout(() => { setIsRefreshing(false); setPtrPull(0); }, 1200);
    } else {
      setPtrPull(0);
    }
  };

  // Tab switching with haptic
  const switchTab = (t) => { haptic('light'); setTab(t); };

  // Golfer card tap with haptic
  const openGolfer = (name) => { haptic('light'); setSelectedGolfer(name); };

  // Use mock data for tournament preview (will be replaced by ESPN live)
  const useMockData = true;
  const tournamentActive = useMockData && TOURNAMENT_STATUS.status !== 'pre_tournament';
  const leaderboard = useMockData ? MOCK_LEADERBOARD : [];
  const mockStandings = useMockData ? calculateStandings(MOCK_POOL_PLAYERS) : [];

  useEffect(() => {
    if (!poolId) return;
    const unsub = subscribeToPool(poolId, (data) => {
      setPoolData(data);
      if (data?.players?.[playerId]?.picks && Object.keys(myPicks).length === 0) {
        const savedPicks = {};
        data.players[playerId].picks.forEach(p => {
          const golfer = GOLFERS.find(g => g.name === p);
          if (golfer) {
            const pod = PODS.find(pd => golfer.owgr >= pd.range[0] && golfer.owgr <= pd.range[1]);
            if (pod) savedPicks[pod.id] = golfer.name;
          }
        });
        if (Object.keys(savedPicks).length > 0) setMyPicks(savedPicks);
      }
    });
    return () => unsub();
  }, [poolId, playerId]);

  useEffect(() => {
    if (poolId && playerId) setScreen('picks');
  }, []);

  const handleCreate = async () => {
    if (!createName.trim() || !commName.trim()) { setError('Enter pool name and your name'); return; }
    setError('');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    try {
      await createPool(code, {
        name: createName.trim(),
        createdAt: Date.now(),
        players: {
          player_1: { name: commName.trim(), picks: [], locked: false, joinedAt: Date.now(), isCommissioner: true }
        }
      });
      setPoolId(code);
      setPlayerId('player_1');
      setPlayerName(commName.trim());
      localStorage.setItem('mastersPoolId', code);
      localStorage.setItem('mastersPlayerId', 'player_1');
      localStorage.setItem('mastersPlayerName', commName.trim());
      setScreen('picks');
    } catch (err) { setError('Error: ' + err.message); }
  };

  const handleJoin = async () => {
    if (!joinCode.trim() || !joinName.trim()) { setError('Enter pool code and your name'); return; }
    setError('');
    try {
      const id = await joinPool(joinCode.trim().toUpperCase(), joinName.trim());
      setPoolId(joinCode.trim().toUpperCase());
      setPlayerId(id);
      setPlayerName(joinName.trim());
      localStorage.setItem('mastersPoolId', joinCode.trim().toUpperCase());
      localStorage.setItem('mastersPlayerId', id);
      localStorage.setItem('mastersPlayerName', joinName.trim());
      setScreen('picks');
    } catch (err) { setError(err.message); }
  };

  const handleSelectGolfer = (podId, golferName) => {
    if (poolData?.players?.[playerId]?.locked) return;
    setMyPicks(prev => prev[podId] === golferName ? (() => { const n = {...prev}; delete n[podId]; return n; })() : { ...prev, [podId]: golferName });
  };

  const handleSubmitPicks = async () => {
    const picksList = PODS.map(pod => myPicks[pod.id]).filter(Boolean);
    if (picksList.length < 6) { setError('Select 1 golfer from each pod'); return; }
    setError('');
    try { await submitPicks(poolId, playerId, picksList); } catch (err) { setError('Error: ' + err.message); }
  };

  const handleLeave = () => {
    localStorage.removeItem('mastersPoolId');
    localStorage.removeItem('mastersPlayerId');
    localStorage.removeItem('mastersPlayerName');
    setPoolId(''); setPlayerId(''); setPlayerName(''); setPoolData(null); setMyPicks({}); setScreen('home');
  };

  const handleShare = () => {
    const text = `Join my Masters Pool!\n\nPool Code: ${poolId}\n\nOpen the app and enter the code to join.`;
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  const isLocked = poolData?.players?.[playerId]?.locked;
  const allPicks = Object.keys(myPicks).length;

  const standings = useMemo(() => {
    if (!poolData?.players) return [];
    return Object.entries(poolData.players).map(([id, data]) => ({
      id, name: data.name, picks: data.picks || [], locked: data.locked,
      isCommissioner: data.isCommissioner, totalScore: 0, qualified: (data.picks || []).length >= 4,
    })).sort((a, b) => a.totalScore - b.totalScore);
  }, [poolData]);

  // ═══ HOME ═══
  if (screen === 'home') return (
    <div className="app">
      <div className="home-screen">
        <div className="home-logo"><div className="masters-badge">M</div></div>
        <h1 className="home-title">Masters Pool</h1>
        <p className="home-subtitle">Augusta National · April 2026</p>
        <div className="home-actions">
          <button className="btn-primary" onClick={() => setScreen('create')}>Create a Pool</button>
          <button className="btn-secondary" onClick={() => setScreen('join')}>Join a Pool</button>
        </div>
        <div className="home-info">
          <h3>How it works</h3>
          <div className="info-steps">
            <div className="info-step"><span className="step-num">1</span><span>Pick 6 golfers from ranked pods</span></div>
            <div className="info-step"><span className="step-num">2</span><span>Best 4 scores count after the cut</span></div>
            <div className="info-step"><span className="step-num">3</span><span>Lowest combined score wins</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══ CREATE ═══
  if (screen === 'create') return (
    <div className="app">
      <div className="form-screen">
        <button className="back-btn" onClick={() => setScreen('home')}>&larr; Back</button>
        <h2>Create Pool</h2>
        <div className="form-field"><label>Pool Name</label><input type="text" placeholder="e.g. The Boys Masters Pool" value={createName} onChange={e => setCreateName(e.target.value)} maxLength={30} /></div>
        <div className="form-field"><label>Your Name</label><input type="text" placeholder="e.g. Luke" value={commName} onChange={e => setCommName(e.target.value)} maxLength={20} /></div>
        {error && <div className="error-msg">{error}</div>}
        <button className="btn-primary" onClick={handleCreate} disabled={!createName.trim() || !commName.trim()}>Create Pool</button>
      </div>
    </div>
  );

  // ═══ JOIN ═══
  if (screen === 'join') return (
    <div className="app">
      <div className="form-screen">
        <button className="back-btn" onClick={() => setScreen('home')}>&larr; Back</button>
        <h2>Join Pool</h2>
        <div className="form-field"><label>Pool Code</label><input type="text" placeholder="XXXXX" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={6} className="code-input" /></div>
        <div className="form-field"><label>Your Name</label><input type="text" placeholder="e.g. Nick" value={joinName} onChange={e => setJoinName(e.target.value)} maxLength={20} /></div>
        {error && <div className="error-msg">{error}</div>}
        <button className="btn-primary" onClick={handleJoin} disabled={!joinCode.trim() || !joinName.trim()}>Join Pool</button>
      </div>
    </div>
  );

  // ═══ MAIN POOL ═══
  const players = poolData?.players ? Object.entries(poolData.players) : [];
  const lockedCount = players.filter(([,p]) => p.locked).length;
  const pod = PODS[currentPod];
  const podGolfers = pod ? getGolfersInPod(pod) : [];

  return (
    <div className="app">
      <header className="pool-header">
        <div className="header-top">
          <div className="masters-badge-sm">M</div>
          <div className="header-info">
            <h1>{poolData?.name || 'Masters Pool'}</h1>
            <p>{poolId} · {players.length} player{players.length !== 1 ? 's' : ''} · {lockedCount} locked</p>
          </div>
          <button className="share-btn" onClick={handleShare}>Share</button>
        </div>
      </header>

      {/* Tournament status bar */}
      {tournamentActive && (
        <div className="tourney-bar">
          <span className="tourney-live-dot"></span>
          <span className="tourney-round">{TOURNAMENT_STATUS.roundLabel}</span>
          <span className="tourney-cut">Cut: {TOURNAMENT_STATUS.cutLine}</span>
        </div>
      )}

      <nav className="pool-tabs">
        {tournamentActive && <button className={tab === 'myteam' ? 'active' : ''} onClick={() => switchTab('myteam')}>My Team</button>}
        {tournamentActive && <button className={tab === 'leaderboard' ? 'active' : ''} onClick={() => switchTab('leaderboard')}>Board</button>}
        <button className={tab === 'standings' ? 'active' : ''} onClick={() => switchTab('standings')}>Standings</button>
        {!tournamentActive && <button className={tab === 'picks' ? 'active' : ''} onClick={() => switchTab('picks')}>Picks</button>}
        <button className={tab === 'players' ? 'active' : ''} onClick={() => switchTab('players')}>Players</button>
        <button className={tab === 'rules' ? 'active' : ''} onClick={() => switchTab('rules')}>Rules</button>
      </nav>

      <main
        className="pool-content"
        ref={ptrRef}
        onTouchStart={handlePtrStart}
        onTouchMove={handlePtrMove}
        onTouchEnd={handlePtrEnd}
      >
        {/* Pull-to-refresh indicator */}
        <div className={`ptr-indicator ${ptrPull > 0 || isRefreshing ? 'visible' : ''}`} style={{ height: isRefreshing ? 40 : ptrPull }}>
          <div className={`ptr-spinner ${isRefreshing ? 'spinning' : ''}`}>{isRefreshing ? '↻' : '↓'}</div>
        </div>

        {/* ═══ MY TEAM — Live tracker ═══ */}
        {tab === 'myteam' && tournamentActive && (
          <div className="myteam-tab">
            {(() => {
              const me = mockStandings.find(p => p.id === 'luke') || mockStandings[0];
              if (!me) return null;
              const myRank = mockStandings.indexOf(me) + 1;
              return (
                <>
                  <div className="myteam-summary">
                    <div className="myteam-rank-box">
                      <span className="myteam-pos">{myRank}<span className="myteam-pos-of">/{mockStandings.length}</span></span>
                      <span className="myteam-pos-label">Your Rank</span>
                    </div>
                    <div className="myteam-leader-box">
                      <span className="myteam-leader-name">{mockStandings[0]?.name}</span>
                      <span className="myteam-leader-score">{formatScore(mockStandings[0]?.totalScore)}</span>
                      <span className="myteam-pos-label">Pool Leader</span>
                    </div>
                  </div>
                  <div className="myteam-stats-row">
                    <div className="myteam-stat"><span className="myteam-stat-val">{formatScore(me.totalScore)}</span><span className="myteam-stat-label">Best 4</span></div>
                    <div className="myteam-stat"><span className="myteam-stat-val">{me.madeCut}/6</span><span className="myteam-stat-label">Made Cut</span></div>
                    <div className="myteam-stat"><span className="myteam-stat-val">{me.pickedLeader ? 'Yes' : 'No'}</span><span className="myteam-stat-label">Has Leader</span></div>
                  </div>

                  <h3 className="section-title">Counting (Best 4)</h3>
                  {me.counting.map(g => {
                    const entry = getGolferScore(g.name);
                    const golferData = GOLFERS.find(gl => gl.name === g.name);
                    const others = getPickedBy(g.name).filter(o => o.id !== 'luke');
                    return (
                      <div key={g.name} className={`live-golfer-card ${g.status === 'active' ? 'on-course' : ''}`} onClick={() => openGolfer(g.name)}>
                        <div className="live-golfer-pos">{typeof entry?.pos === 'number' ? `T${entry.pos}` : entry?.pos}</div>
                        <div className="live-golfer-flag">{golferData?.flag}</div>
                        <div className="live-golfer-info">
                          <span className="live-golfer-name">{g.name}</span>
                          <span className="live-golfer-round">
                            {g.status === 'active' ? `R3 · Thru ${g.thru}` : g.status === 'finished' ? 'R3 Complete' : g.status === 'cut' ? 'Missed Cut' : ''}
                          </span>
                          {others.length > 0 && (
                            <div className="lb-owners mt-also">
                              <span className="also-label">Also:</span>
                              {others.slice(0, 5).map(o => <span key={o.id} className="lb-owner-chip">{o.initials}</span>)}
                              {others.length > 5 && <span className="lb-owner-chip more">+{others.length - 5}</span>}
                            </div>
                          )}
                        </div>
                        <div className="live-golfer-scores">
                          <span className={`live-today ${typeof g.today === 'number' && g.today < 0 ? 'under' : typeof g.today === 'number' && g.today > 0 ? 'over' : ''}`}>
                            {g.today === 'E' ? 'E' : typeof g.today === 'number' ? (g.today > 0 ? `+${g.today}` : g.today) : '-'}
                          </span>
                          <span className={`live-total ${g.score < 0 ? 'under' : g.score > 0 ? 'over' : ''}`}>{formatScore(g.score)}</span>
                        </div>
                      </div>
                    );
                  })}

                  {me.bench.length > 0 && (
                    <>
                      <h3 className="section-title bench-title">Bench</h3>
                      {me.bench.map(g => {
                        const entry = getGolferScore(g.name);
                        const golferData = GOLFERS.find(gl => gl.name === g.name);
                        return (
                          <div key={g.name} className={`live-golfer-card bench ${g.status === 'cut' ? 'cut' : ''}`} onClick={() => openGolfer(g.name)}>
                            <div className="live-golfer-pos">{g.status === 'cut' ? 'MC' : typeof entry?.pos === 'number' ? `T${entry.pos}` : entry?.pos}</div>
                            <div className="live-golfer-flag">{golferData?.flag}</div>
                            <div className="live-golfer-info">
                              <span className="live-golfer-name">{g.name}</span>
                              <span className="live-golfer-round">{g.status === 'cut' ? 'Missed Cut' : g.status === 'active' ? `R3 · Thru ${g.thru}` : 'R3 Complete'}</span>
                            </div>
                            <div className="live-golfer-scores">
                              <span className="live-total dim">{formatScore(g.score)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* ═══ LEADERBOARD ═══ */}
        {tab === 'leaderboard' && tournamentActive && (
          <div className="leaderboard-tab">
            <div className="lb-header-row">
              <span className="lb-h-pos">Pos</span>
              <span className="lb-h-player">Player</span>
              <span className="lb-h-today">Today</span>
              <span className="lb-h-thru">Thru</span>
              <span className="lb-h-total">Total</span>
            </div>
            {leaderboard.map((g, idx) => {
              const golferData = GOLFERS.find(gl => gl.name === g.name);
              const isMine = MOCK_POOL_PLAYERS[0]?.picks.includes(g.name);
              const pickedBy = tournamentActive ? getPickedBy(g.name) : [];
              return (
                <div key={g.name} className={`lb-row ${g.status === 'cut' ? 'cut-row' : ''} ${g.status === 'active' ? 'active-row' : ''} ${isMine ? 'my-pick' : ''}`} onClick={() => g.status !== 'cut' && setSelectedGolfer(g.name)}>
                  <span className={`lb-pos ${g.movement === 'up' ? 'mov-up' : g.movement === 'down' ? 'mov-down' : ''}`}>
                    {g.status === 'cut' ? 'MC' : g.pos}
                  </span>
                  <div className="lb-player-col">
                    <span className="lb-player">
                      <span className="lb-flag">{golferData?.flag}</span>
                      <span className="lb-name">{g.name}</span>
                    </span>
                    {pickedBy.length > 0 && (
                      <div className="lb-owners">
                        {pickedBy.map(o => (
                          <span key={o.id} className={`lb-owner-chip ${o.id === 'luke' ? 'me' : ''}`} title={o.name}>{o.initials}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`lb-today ${typeof g.today === 'number' && g.today < 0 ? 'under' : typeof g.today === 'number' && g.today > 0 ? 'over' : ''}`}>
                    {g.today == null ? '-' : g.today === 'E' ? 'E' : typeof g.today === 'number' ? (g.today > 0 ? `+${g.today}` : g.today) : g.today}
                  </span>
                  <span className="lb-thru">{g.thru ?? '-'}</span>
                  <span className={`lb-total ${typeof g.total === 'number' && g.total < 0 ? 'under' : typeof g.total === 'number' && g.total > 0 ? 'over' : ''}`}>
                    {formatScore(g.total)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ STANDINGS — Pool rankings with scoring ═══ */}
        {tab === 'standings' && (
          <div className="standings-tab">
            <h3>Pool Standings</h3>
            <p className="standings-sub">{tournamentActive ? 'Live scores · Best 4 of 6 count' : 'Scores update live during the tournament'}</p>
            {(tournamentActive ? mockStandings : standings).map((p, idx) => (
              <div key={p.id} className={`standing-row ${p.id === 'luke' ? 'me' : ''} ${!p.qualified && tournamentActive ? 'eliminated' : ''}`}>
                <span className="standing-rank">{!p.qualified && tournamentActive ? '-' : idx + 1}</span>
                <div className="standing-info">
                  <span className="standing-name">
                    {p.name}
                    {p.isCommissioner && <span className="tag">Comm</span>}
                    {p.id === 'luke' && <span className="tag me-tag">You</span>}
                  </span>
                  {tournamentActive ? (
                    <span className="standing-detail">
                      {p.qualified ? `${p.madeCut}/6 made cut` : `${p.madeCut}/6 made cut — Eliminated`}
                      {p.pickedLeader && <span className="leader-badge">Has leader</span>}
                    </span>
                  ) : (
                    <span className="standing-status">{p.locked ? `${p.picks?.length || 0} golfers` : 'Pending'}</span>
                  )}
                </div>
                <span className={`standing-score ${!p.qualified && tournamentActive ? 'elim-score' : ''}`}>
                  {!tournamentActive ? 'E' : !p.qualified ? 'DQ' : formatScore(p.totalScore)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ═══ PICKS — Pre-tournament selection ═══ */}
        {tab === 'picks' && (
          <div className="picks-tab">
            <div className="my-team-card">
              <div className="my-team-header"><h3>My Team</h3>{isLocked && <span className="locked-badge">Locked</span>}</div>
              <div className="my-team-grid">
                {PODS.map(p => (
                  <div key={p.id} className={`my-team-slot ${myPicks[p.id] ? 'filled' : ''}`}>
                    <span className="slot-pod">{p.id}</span>
                    {myPicks[p.id] ? <span className="slot-name">{myPicks[p.id].split(' ').pop()}</span> : <span className="slot-empty">-</span>}
                  </div>
                ))}
              </div>
              {!isLocked && allPicks === 6 && <button className="btn-lock" onClick={handleSubmitPicks}>Lock In Picks</button>}
              {isLocked && <p className="locked-msg">Picks are locked. Good luck!</p>}
            </div>
            {!isLocked && (
              <>
                <div className="pod-tabs">
                  {PODS.map((p, idx) => (
                    <button key={p.id} className={`pod-tab ${currentPod === idx ? 'active' : ''} ${myPicks[p.id] ? 'picked' : ''}`} onClick={() => setCurrentPod(idx)}>
                      <span className="pod-letter">{p.id}</span>
                      {myPicks[p.id] && <span className="pod-check">&#10003;</span>}
                    </button>
                  ))}
                </div>
                <div className="pod-info"><h3>{pod.label}</h3><span>{pod.subtitle}</span></div>
                <div className="golfer-list">
                  {podGolfers.map(g => (
                    <div key={g.name} className={`golfer-card ${myPicks[pod.id] === g.name ? 'selected' : ''}`} onClick={() => handleSelectGolfer(pod.id, g.name)}>
                      <div className="golfer-rank">#{g.owgr}</div>
                      <div className="golfer-flag">{g.flag}</div>
                      <div className="golfer-info">
                        <span className="golfer-name">{g.name}</span>
                        <span className="golfer-meta">
                          {g.majors > 0 && <span>{g.majors} major{g.majors > 1 ? 's' : ''}</span>}
                          {g.mastersWins > 0 && <span className="mw">{g.mastersWins}x Masters</span>}
                        </span>
                      </div>
                      {myPicks[pod.id] === g.name && <div className="golfer-check">&#10003;</div>}
                    </div>
                  ))}
                </div>
              </>
            )}
            {error && <div className="error-msg">{error}</div>}
          </div>
        )}

        {tab === 'players' && (
          <div className="players-tab">
            <h3>Pool Members</h3>
            {(tournamentActive ? MOCK_POOL_PLAYERS : players.map(([id, data]) => ({ id, ...data }))).map(p => {
              const data = tournamentActive ? p : p;
              return (
              <div key={data.id || data.name} className="member-card">
                <div className="member-top"><span className="member-name">{data.name}{data.isCommissioner && <span className="tag">Comm</span>}</span><span className={`member-status ${data.locked ? 'locked' : ''}`}>{data.locked ? 'Locked' : 'Selecting'}</span></div>
                {data.locked && <div className="member-picks">{(data.picks||[]).map(pick => { const g = GOLFERS.find(gl => gl.name === pick); const score = getGolferScore(pick); return <span key={pick} className={`pick-chip ${score?.status === 'cut' ? 'cut-chip' : ''}`}>{g?.flag} {pick.split(' ').pop()}{tournamentActive && score ? ` (${formatScore(score.total)})` : ''}</span>; })}</div>}
              </div>
              );
            })}
          </div>
        )}

        {tab === 'rules' && (
          <div className="rules-tab">
            <h3>Pool Rules</h3>
            <div className="rule-block"><h4>Selection</h4><ul><li>Pick 6 golfers — one from each pod (A-F)</li><li>Pods based on FedEx Cup / World Ranking</li><li>Multiple players can pick same golfer</li><li>Picks lock before Round 1 Thursday AM</li></ul></div>
            <div className="rule-block"><h4>Scoring</h4><ul><li>Best 4 of your 6 golfers count</li><li>Lowest combined score to par wins</li><li>Must have 4+ golfers make the cut to qualify</li><li>Fewer than 4 = eliminated</li></ul></div>
            <div className="rule-block"><h4>Tiebreaker</h4><ol><li>Picked the tournament winner</li><li>Best individual golfer finish</li><li>Then 2nd best, 3rd best, etc.</li></ol></div>
            <button className="btn-leave" onClick={handleLeave}>Leave Pool</button>
          </div>
        )}
      </main>

      {/* ═══ SCORECARD MODAL ═══ */}
      {selectedGolfer && (() => {
        const sc = MOCK_SCORECARD[selectedGolfer];
        const entry = getGolferScore(selectedGolfer);
        const golferData = GOLFERS.find(gl => gl.name === selectedGolfer);
        const pickedBy = getPickedBy(selectedGolfer);
        if (!entry) return null;

        const roundLabels = ['R1', 'R2', 'R3', 'R4'];
        const activeRound = sc?.rounds ? sc.rounds.findIndex(r => r && r.some(h => h === null)) : -1;

        return (
          <div className="sc-overlay" onClick={() => setSelectedGolfer(null)}>
            <div className="sc-modal" onClick={e => e.stopPropagation()}>
              <div className="sc-drag-handle" onTouchStart={e => {
                const startY = e.touches[0].clientY;
                const modal = e.currentTarget.parentElement;
                const handleMove = (ev) => {
                  const dy = ev.touches[0].clientY - startY;
                  if (dy > 0) modal.style.transform = `translateY(${dy}px)`;
                };
                const handleEnd = (ev) => {
                  const dy = ev.changedTouches[0].clientY - startY;
                  modal.style.transform = '';
                  if (dy > 100) setSelectedGolfer(null);
                  document.removeEventListener('touchmove', handleMove);
                  document.removeEventListener('touchend', handleEnd);
                };
                document.addEventListener('touchmove', handleMove, { passive: true });
                document.addEventListener('touchend', handleEnd);
              }}><div className="sc-drag-bar"></div></div>
              <button className="sc-close" onClick={() => setSelectedGolfer(null)}>&times;</button>

              <div className="sc-header">
                <span className="sc-flag">{golferData?.flag}</span>
                <div className="sc-header-info">
                  <h2 className="sc-name">{selectedGolfer}</h2>
                  <span className="sc-pos-line">
                    {entry.status === 'cut' ? 'Missed Cut' : `T${entry.pos}`}
                    {entry.status === 'active' && ` · Thru ${entry.thru}`}
                    {entry.status === 'finished' && ` · R${TOURNAMENT_STATUS.round} Complete`}
                  </span>
                </div>
                <div className="sc-total-box">
                  <span className={`sc-total ${typeof entry.total === 'number' && entry.total < 0 ? 'under' : ''}`}>{formatScore(entry.total)}</span>
                </div>
              </div>

              {pickedBy.length > 0 && (
                <div className="sc-picked-by">
                  <span className="sc-picked-label">Picked by:</span>
                  {pickedBy.map(o => <span key={o.id} className={`lb-owner-chip ${o.id === 'luke' ? 'me' : ''}`}>{o.initials}</span>)}
                </div>
              )}

              {/* Round scores summary */}
              <div className="sc-rounds-summary">
                {roundLabels.map((label, ri) => {
                  const roundHoles = sc?.rounds?.[ri];
                  const roundScore = roundHoles ? calcRoundScore(roundHoles) : null;
                  const isActive = ri === activeRound;
                  return (
                    <div key={ri} className={`sc-round-pill ${roundScore !== null ? 'has-score' : ''} ${isActive ? 'active' : ''}`}>
                      <span className="sc-round-label">{label}</span>
                      <span className="sc-round-score">{roundScore !== null ? roundScore : '-'}</span>
                    </div>
                  );
                })}
              </div>

              {/* Hole-by-hole scorecards for each completed/active round */}
              {sc?.rounds?.map((roundHoles, ri) => {
                if (!roundHoles) return null;
                const nines = calcNines(roundHoles);
                const roundTotal = calcRoundScore(roundHoles);
                const thruHole = roundHoles.filter(h => h !== null).length;

                return (
                  <div key={ri} className="sc-round-card">
                    <div className="sc-round-title">
                      <span>Round {ri + 1}</span>
                      {thruHole === 18 ? (
                        <span className="sc-round-complete">{roundTotal} ({roundTotal - AUGUSTA_PAR.total >= 0 ? '+' : ''}{roundTotal - AUGUSTA_PAR.total})</span>
                      ) : (
                        <span className="sc-round-thru">Thru {thruHole}</span>
                      )}
                    </div>

                    {/* Front 9 */}
                    <div className="sc-grid">
                      <div className="sc-grid-row sc-grid-header">
                        <span className="sc-grid-label">Hole</span>
                        {AUGUSTA_HOLES.slice(0, 9).map(h => <span key={h.hole} className="sc-grid-cell">{h.hole}</span>)}
                        <span className="sc-grid-cell sc-grid-total">Out</span>
                      </div>
                      <div className="sc-grid-row sc-grid-par">
                        <span className="sc-grid-label">Par</span>
                        {AUGUSTA_HOLES.slice(0, 9).map(h => <span key={h.hole} className="sc-grid-cell">{h.par}</span>)}
                        <span className="sc-grid-cell sc-grid-total">{AUGUSTA_PAR.out}</span>
                      </div>
                      <div className="sc-grid-row sc-grid-scores">
                        <span className="sc-grid-label">Score</span>
                        {AUGUSTA_HOLES.slice(0, 9).map((h, hi) => {
                          const s = roundHoles[hi];
                          const diff = s !== null ? s - h.par : null;
                          return (
                            <span key={h.hole} className={`sc-grid-cell ${diff !== null ? (diff < -1 ? 'eagle' : diff < 0 ? 'birdie' : diff > 1 ? 'dbl-bogey' : diff > 0 ? 'bogey' : '') : ''}`}>
                              {s !== null ? s : ''}
                            </span>
                          );
                        })}
                        <span className="sc-grid-cell sc-grid-total">{nines.out ?? ''}</span>
                      </div>
                    </div>

                    {/* Back 9 */}
                    <div className="sc-grid">
                      <div className="sc-grid-row sc-grid-header">
                        <span className="sc-grid-label">Hole</span>
                        {AUGUSTA_HOLES.slice(9).map(h => <span key={h.hole} className="sc-grid-cell">{h.hole}</span>)}
                        <span className="sc-grid-cell sc-grid-total">In</span>
                      </div>
                      <div className="sc-grid-row sc-grid-par">
                        <span className="sc-grid-label">Par</span>
                        {AUGUSTA_HOLES.slice(9).map(h => <span key={h.hole} className="sc-grid-cell">{h.par}</span>)}
                        <span className="sc-grid-cell sc-grid-total">{AUGUSTA_PAR.in}</span>
                      </div>
                      <div className="sc-grid-row sc-grid-scores">
                        <span className="sc-grid-label">Score</span>
                        {AUGUSTA_HOLES.slice(9).map((h, hi) => {
                          const s = roundHoles[9 + hi];
                          const diff = s !== null ? s - h.par : null;
                          return (
                            <span key={h.hole} className={`sc-grid-cell ${diff !== null ? (diff < -1 ? 'eagle' : diff < 0 ? 'birdie' : diff > 1 ? 'dbl-bogey' : diff > 0 ? 'bogey' : '') : ''}`}>
                              {s !== null ? s : ''}
                            </span>
                          );
                        })}
                        <span className="sc-grid-cell sc-grid-total">{nines.in_ ?? ''}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default App;
