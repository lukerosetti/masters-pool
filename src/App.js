import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GOLFERS, PODS, getGolfersInPod } from './data/golfers';
import { subscribeToPool, submitPicks, joinPool, createPool, getPool, setPoolDeadline, removePlayer, lockPool, linkPoolToAccount, getAccountPools } from './firebase';
import { TOURNAMENT_STATUS, MOCK_LEADERBOARD, MOCK_POOL_PLAYERS, MOCK_SCORECARD, COURSE_HOLES, COURSE_PAR, getGolferScore, formatScore, calculateStandings, calculateLiveStandings, getPickedBy, calcRoundScore, calcNines } from './data/mockTournament';
import { useGolfScores } from './data/useGolfScores';
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
  const [poolId, setPoolId] = useState(() => localStorage.getItem('pgaPoolId') || '');
  const [playerId, setPlayerId] = useState(() => localStorage.getItem('pgaPlayerId') || '');
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('pgaPlayerName') || '');
  const [poolData, setPoolData] = useState(null);
  const [myPicks, setMyPicks] = useState({});
  const [currentPod, setCurrentPod] = useState(0);
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [createName, setCreateName] = useState('');
  const [commName, setCommName] = useState('');
  const [rejoinPlayers, setRejoinPlayers] = useState(null); // array of existing players when pool is found
  const [rejoinPoolData, setRejoinPoolData] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('picks');
  const [selectedGolfer, setSelectedGolfer] = useState(null);
  const [boardView, setBoardView] = useState('modern'); // 'modern' | 'classic'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCommTools, setShowCommTools] = useState(false);
  const [expandedStanding, setExpandedStanding] = useState(null);
  const [deadlineInput, setDeadlineInput] = useState('');
  const [deadlineCountdown, setDeadlineCountdown] = useState(null);
  const [knownPools, setKnownPools] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pgaPools') || '[]'); } catch { return []; }
  });
  const [savedEmail, setSavedEmail] = useState(() => localStorage.getItem('pgaEmail') || '');
  const [emailInput, setEmailInput] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverError, setRecoverError] = useState('');

  // Commissioner check
  const isCommissioner = poolData?.players?.[playerId]?.isCommissioner === true;
  const poolDeadline = poolData?.deadline || null;
  const isPoolLocked = poolData?.locked === true;

  // Deadline countdown timer
  useEffect(() => {
    if (!poolDeadline) { setDeadlineCountdown(null); return; }
    const tick = () => {
      const remaining = Math.max(0, poolDeadline - Date.now());
      setDeadlineCountdown(remaining);
      // Auto-lock when deadline hits (commissioner's browser triggers it)
      if (remaining <= 0 && isCommissioner && !isPoolLocked) {
        lockPool(poolId);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [poolDeadline, isCommissioner, isPoolLocked, poolId]);

  const formatDeadlineCountdown = (ms) => {
    if (!ms || ms <= 0) return 'Picks locked';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const handleSetDeadline = async () => {
    if (!deadlineInput) return;
    const ts = new Date(deadlineInput).getTime();
    if (ts <= Date.now()) { setError('Deadline must be in the future'); return; }
    await setPoolDeadline(poolId, ts);
    setDeadlineInput('');
  };

  const handleRemovePlayer = async (pid) => {
    if (!window.confirm('Remove this player from the pool?')) return;
    await removePlayer(poolId, pid);
    haptic('medium');
  };

  const handleLockPoolEarly = async () => {
    if (!window.confirm('Lock the pool now? All unlocked players will be removed.')) return;
    await lockPool(poolId);
    haptic('medium');
  };

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

  // ESPN live golf scores
  const { leaderboard: liveLeaderboard, tournamentStatus: liveStatus, scorecards: liveScorecards, isLoading: scoresLoading } = useGolfScores();

  // Use mock data for preview, or live ESPN data
  const useMockData = false; // Set true to preview tournament views with fake data
  const tournamentActive = useMockData
    ? TOURNAMENT_STATUS.status !== 'pre_tournament'
    : liveStatus.status !== 'pre_tournament';
  const leaderboard = useMockData ? MOCK_LEADERBOARD : liveLeaderboard;
  const activeTournamentStatus = useMockData ? TOURNAMENT_STATUS : liveStatus;
  const activeScorecards = useMockData ? MOCK_SCORECARD : liveScorecards;
  const mockStandings = useMockData ? calculateStandings(MOCK_POOL_PLAYERS) : [];

  // Flat array of current user's pick names (for highlighting on leaderboard)
  const myPicksList = useMemo(() => Object.values(myPicks).filter(Boolean), [myPicks]);

  // Look up golfer from active leaderboard (live or mock)
  const getActiveGolferScore = useCallback((name) => {
    return leaderboard.find(g => g.name === name) || null;
  }, [leaderboard]);

  // Live standings: Firebase pool players + live leaderboard
  const liveStandings = useMemo(() => {
    if (!tournamentActive || useMockData || leaderboard.length === 0) return [];
    const poolEntries = poolData?.players ? Object.entries(poolData.players) : [];
    if (poolEntries.length === 0) return [];
    const poolPlayers = poolEntries.map(([id, data]) => ({
      id, name: data.name, picks: data.picks || [], isCommissioner: data.isCommissioner, locked: data.locked,
    })).filter(p => p.locked && p.picks.length > 0);
    const leaderName = leaderboard[0]?.name || '';
    // Once the official cut is made, stop projecting — actual STATUS_CUT takes over
    const projectedCutArg = liveStatus?.cutLine ? null : (liveStatus?.projectedCutLine ?? null);
    return calculateLiveStandings(poolPlayers, leaderboard, leaderName, projectedCutArg);
  }, [tournamentActive, useMockData, leaderboard, poolData, liveStatus?.projectedCutLine]);

  const activeStandings = useMockData ? mockStandings : liveStandings;

  useEffect(() => {
    if (!poolId) return;
    const unsub = subscribeToPool(poolId, (data) => {
      setPoolData(data);
      if (data?.players?.[playerId]?.picks && Object.keys(myPicks).length === 0) {
        const savedPicks = {};
        data.players[playerId].picks.forEach(p => {
          const golfer = GOLFERS.find(g => g.name === p);
          if (golfer) {
            const pod = PODS.find(pd => golfer.rank >= pd.range[0] && golfer.rank <= pd.range[1]);
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

  const addKnownPool = useCallback((poolCode, pid, pname, pPoolName) => {
    setKnownPools(prev => {
      const filtered = prev.filter(p => !(p.poolId === poolCode && p.playerId === pid));
      const updated = [...filtered, { poolId: poolCode, playerId: pid, playerName: pname, poolName: pPoolName }];
      localStorage.setItem('pgaPools', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeKnownPool = (poolCode, pid) => {
    setKnownPools(prev => {
      const updated = prev.filter(p => !(p.poolId === poolCode && p.playerId === pid));
      localStorage.setItem('pgaPools', JSON.stringify(updated));
      return updated;
    });
  };

  const enterPool = (poolCode, pid, pname) => {
    setPoolId(poolCode); setPlayerId(pid); setPlayerName(pname);
    localStorage.setItem('pgaPoolId', poolCode);
    localStorage.setItem('pgaPlayerId', pid);
    localStorage.setItem('pgaPlayerName', pname);
    setScreen('picks');
  };

  const handleSaveEmail = async (onDone) => {
    const email = emailInput.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    setSavedEmail(email);
    localStorage.setItem('pgaEmail', email);
    setEmailInput('');
    setKnownPools(current => {
      linkPoolToAccount && current.forEach(p =>
        linkPoolToAccount(email, p.poolId, p.playerId, p.playerName, p.poolName).catch(() => {})
      );
      return current;
    });
    if (onDone) onDone();
  };

  const handleRecoverPools = async () => {
    const email = recoverEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) { setRecoverError('Enter a valid email'); return; }
    setRecoverLoading(true);
    setRecoverError('');
    try {
      const pools = await getAccountPools(email);
      if (!pools || pools.length === 0) {
        setRecoverError('No pools found for that email. Check the address and try again.');
        setRecoverLoading(false);
        return;
      }
      setSavedEmail(email);
      localStorage.setItem('pgaEmail', email);
      pools.forEach(p => addKnownPool(p.poolId, p.playerId, p.playerName, p.poolName || p.poolId));
      setRecoverEmail('');
      setRecoverError('');
      setScreen('home');
    } catch { setRecoverError('Something went wrong. Try again.'); }
    setRecoverLoading(false);
  };

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
      localStorage.setItem('pgaPoolId', code);
      localStorage.setItem('pgaPlayerId', 'player_1');
      localStorage.setItem('pgaPlayerName', commName.trim());
      addKnownPool(code, 'player_1', commName.trim(), createName.trim());
      if (savedEmail) linkPoolToAccount(savedEmail, code, 'player_1', commName.trim(), createName.trim()).catch(() => {});
      if (!savedEmail) { setScreen('email-prompt'); } else { setScreen('picks'); }
    } catch (err) { setError('Error: ' + err.message); }
  };

  // Step 1: Look up pool by code
  const handleLookupPool = async () => {
    if (!joinCode.trim()) { setError('Enter a pool code'); return; }
    setError('');
    try {
      const data = await getPool(joinCode.trim().toUpperCase());
      if (!data) { setError('Pool not found. Check the code and try again.'); return; }
      const players = data.players ? Object.entries(data.players).map(([id, p]) => ({ id, ...p })) : [];
      setRejoinPoolData(data);
      setRejoinPlayers(players);
    } catch (err) { setError('Error: ' + err.message); }
  };

  // Step 2a: Reclaim an existing player
  const handleReclaim = (pid, pname) => {
    const code = joinCode.trim().toUpperCase();
    const poolName = rejoinPoolData?.name || code;
    setPoolId(code); setPlayerId(pid); setPlayerName(pname);
    localStorage.setItem('pgaPoolId', code);
    localStorage.setItem('pgaPlayerId', pid);
    localStorage.setItem('pgaPlayerName', pname);
    haptic('medium');
    setRejoinPlayers(null); setRejoinPoolData(null);
    addKnownPool(code, pid, pname, poolName);
    if (savedEmail) linkPoolToAccount(savedEmail, code, pid, pname, poolName).catch(() => {});
    if (!savedEmail) { setScreen('email-prompt'); } else { setScreen('picks'); }
  };

  // Step 2b: Join as a new player
  const handleJoinNew = async () => {
    if (!joinName.trim()) { setError('Enter your name'); return; }
    setError('');
    try {
      const code = joinCode.trim().toUpperCase();
      const poolName = rejoinPoolData?.name || code;
      const id = await joinPool(code, joinName.trim());
      setPoolId(code); setPlayerId(id); setPlayerName(joinName.trim());
      localStorage.setItem('pgaPoolId', code);
      localStorage.setItem('pgaPlayerId', id);
      localStorage.setItem('pgaPlayerName', joinName.trim());
      setRejoinPlayers(null); setRejoinPoolData(null);
      addKnownPool(code, id, joinName.trim(), poolName);
      if (savedEmail) linkPoolToAccount(savedEmail, code, id, joinName.trim(), poolName).catch(() => {});
      if (!savedEmail) { setScreen('email-prompt'); } else { setScreen('picks'); }
    } catch (err) { setError(err.message); }
  };

  const handleSelectGolfer = (podId, golferName) => {
    if (poolData?.players?.[playerId]?.locked) return;
    if (isPoolLocked) return;
    if (poolDeadline && Date.now() > poolDeadline) return;
    setMyPicks(prev => prev[podId] === golferName ? (() => { const n = {...prev}; delete n[podId]; return n; })() : { ...prev, [podId]: golferName });
  };

  const handleSubmitPicks = async () => {
    const picksList = PODS.map(pod => myPicks[pod.id]).filter(Boolean);
    if (picksList.length < 6) { setError('Select 1 golfer from each pod'); return; }
    setError('');
    try { await submitPicks(poolId, playerId, picksList); } catch (err) { setError('Error: ' + err.message); }
  };

  const handleLeave = () => {
    localStorage.removeItem('pgaPoolId');
    localStorage.removeItem('pgaPlayerId');
    localStorage.removeItem('pgaPlayerName');
    setPoolId(''); setPlayerId(''); setPlayerName(''); setPoolData(null); setMyPicks({}); setScreen('home');
  };

  const handleShare = () => {
    const url = 'https://masters-yaz3.onrender.com';
    const text = `Join my PGA Championship Pool!\n\nPool Code: ${poolId}\n\nOpen the link, tap "Join a Pool", and enter the code.`;
    if (navigator.share) navigator.share({ text, url }).catch(() => {});
    else navigator.clipboard?.writeText(`${text}\n${url}`);
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
        <div className="home-logo">
          <svg className="masters-logo-svg" viewBox="0 0 140 140" width="120" height="120">
            <g transform="translate(70,70)">
              <ellipse cx="-38" cy="-28" rx="6" ry="12" transform="rotate(30, -38, -28)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="-44" cy="-14" rx="6" ry="11" transform="rotate(15, -44, -14)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="-46" cy="2" rx="5.5" ry="11" transform="rotate(0, -46, 2)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="-44" cy="18" rx="6" ry="11" transform="rotate(-15, -44, 18)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="-38" cy="32" rx="6" ry="12" transform="rotate(-30, -38, 32)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="-28" cy="42" rx="5.5" ry="10" transform="rotate(-50, -28, 42)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="38" cy="-28" rx="6" ry="12" transform="rotate(-30, 38, -28)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="44" cy="-14" rx="6" ry="11" transform="rotate(-15, 44, -14)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="46" cy="2" rx="5.5" ry="11" transform="rotate(0, 46, 2)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="44" cy="18" rx="6" ry="11" transform="rotate(15, 44, 18)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="38" cy="32" rx="6" ry="12" transform="rotate(30, 38, 32)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <ellipse cx="28" cy="42" rx="5.5" ry="10" transform="rotate(50, 28, 42)" fill="none" stroke="#C6A34E" strokeWidth="1.2" opacity="0.7"/>
              <path d="M-16 50 Q-30 40 -40 20 Q-48 0 -42 -30 Q-38 -42 -30 -42" fill="none" stroke="#C6A34E" strokeWidth="1" opacity="0.4"/>
              <path d="M16 50 Q30 40 40 20 Q48 0 42 -30 Q38 -42 30 -42" fill="none" stroke="#C6A34E" strokeWidth="1" opacity="0.4"/>
            </g>
            <path d="M58 38 L82 38 L79 60 Q77 72 70 76 Q63 72 61 60 Z" fill="none" stroke="#C6A34E" strokeWidth="1.8"/>
            <line x1="70" y1="76" x2="70" y2="86" stroke="#C6A34E" strokeWidth="1.8"/>
            <line x1="60" y1="86" x2="80" y2="86" stroke="#C6A34E" strokeWidth="1.8"/>
            <path d="M58 44 Q47 46 47 53 Q47 60 56 58" fill="none" stroke="rgba(198,163,78,0.5)" strokeWidth="1.2"/>
            <path d="M82 44 Q93 46 93 53 Q93 60 84 58" fill="none" stroke="rgba(198,163,78,0.5)" strokeWidth="1.2"/>
            <circle cx="70" cy="54" r="2" fill="#C6A34E" opacity="0.5"/>
          </svg>
        </div>
        <h1 className="home-title">PGA Championship 2026</h1>
        <p className="home-subtitle">Aronimink Golf Club</p>

        {knownPools.length > 0 ? (
          <div className="pool-switcher">
            <p className="switcher-label">MY POOLS</p>
            {knownPools.map(p => (
              <div key={`${p.poolId}-${p.playerId}`} className="switcher-card" onClick={() => enterPool(p.poolId, p.playerId, p.playerName)}>
                <div className="switcher-card-left">
                  <span className="switcher-pool-name">{p.poolName || p.poolId}</span>
                  <span className="switcher-pool-meta">{p.poolId} · {p.playerName}</span>
                </div>
                <div className="switcher-card-right">
                  <span className="switcher-arrow">›</span>
                  <button className="switcher-remove" onClick={e => { e.stopPropagation(); removeKnownPool(p.poolId, p.playerId); }}>×</button>
                </div>
              </div>
            ))}
            <div className="switcher-new-btns">
              <button className="btn-secondary" onClick={() => setScreen('create')}>+ Create</button>
              <button className="btn-secondary" onClick={() => setScreen('join')}>+ Join Another</button>
            </div>
            <button className="recover-link" onClick={() => setScreen('recover')}>↩ Recover my pools</button>
          </div>
        ) : (
          <>
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
            <button className="recover-link" onClick={() => setScreen('recover')}>↩ Recover my pools</button>
          </>
        )}
      </div>
    </div>
  );

  // ═══ EMAIL PROMPT ═══
  if (screen === 'email-prompt') return (
    <div className="app">
      <div className="form-screen email-prompt-screen">
        <div className="form-card email-prompt-card">
          <div className="email-prompt-icon">✉</div>
          <h2>Save your access</h2>
          <p className="form-subtitle">Add your email to recover your picks on any device or if your browser data is cleared.</p>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveEmail(() => setScreen('picks'))}
              autoFocus
            />
          </div>
          <button className="btn-primary" onClick={() => handleSaveEmail(() => setScreen('picks'))} disabled={!emailInput.trim().includes('@')}>Save & Continue</button>
          <button className="btn-ghost" onClick={() => { setEmailInput(''); setScreen('picks'); }}>Skip for now</button>
        </div>
      </div>
    </div>
  );

  // ═══ RECOVER ═══
  if (screen === 'recover') return (
    <div className="app">
      <div className="form-screen">
        <button className="back-btn" onClick={() => setScreen('home')}>← Back</button>
        <div className="form-card">
          <h2>Recover My Pools</h2>
          <p className="form-subtitle">Enter the email you used when you joined or created a pool.</p>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={recoverEmail}
              onChange={e => { setRecoverEmail(e.target.value); setRecoverError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleRecoverPools()}
              autoFocus
            />
          </div>
          {recoverError && <div className="error-msg">{recoverError}</div>}
          <button className="btn-primary" onClick={handleRecoverPools} disabled={recoverLoading || !recoverEmail.trim().includes('@')}>
            {recoverLoading ? 'Searching…' : 'Find My Pools'}
          </button>
        </div>
      </div>
    </div>
  );

  // ═══ CREATE ═══
  if (screen === 'create') return (
    <div className="app">
      <div className="form-screen">
        <button className="back-btn" onClick={() => setScreen('home')}>&larr; Back</button>
        <div className="form-card">
          <h2>Create Pool</h2>
          <p className="form-subtitle">Set up your PGA Championship pool</p>
          <div className="form-field"><label>Pool Name</label><input type="text" placeholder="e.g. The Boys PGA Pool" value={createName} onChange={e => setCreateName(e.target.value)} maxLength={30} /></div>
          <div className="form-field"><label>Your Name</label><input type="text" placeholder="e.g. Luke" value={commName} onChange={e => setCommName(e.target.value)} maxLength={20} /></div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn-primary" onClick={handleCreate} disabled={!createName.trim() || !commName.trim()}>Create Pool</button>
        </div>
      </div>
    </div>
  );

  // ═══ JOIN ═══
  if (screen === 'join') return (
    <div className="app">
      <div className="form-screen">
        <button className="back-btn" onClick={() => {
          if (rejoinPlayers) { setRejoinPlayers(null); setRejoinPoolData(null); setError(''); }
          else setScreen('home');
        }}>&larr; Back</button>

        <div className="form-card">
        {!rejoinPlayers ? (
          <>
            <h2>Join Pool</h2>
            <p className="form-subtitle">Enter your pool code</p>
            <div className="form-field"><label>Pool Code</label><input type="text" placeholder="XXXXX" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={6} className="code-input" onKeyDown={e => e.key === 'Enter' && handleLookupPool()} /></div>
            {error && <div className="error-msg">{error}</div>}
            <button className="btn-primary" onClick={handleLookupPool} disabled={!joinCode.trim()}>Find Pool</button>
          </>
        ) : (
          <>
            <h2>{rejoinPoolData?.name || 'Pool'}</h2>
            <p className="form-subtitle">{rejoinPlayers.length} player{rejoinPlayers.length !== 1 ? 's' : ''} in this pool</p>

            {rejoinPlayers.length > 0 && (
              <div className="rejoin-section">
                <label className="rejoin-label">Returning? Tap your name</label>
                <div className="rejoin-list">
                  {rejoinPlayers.map(p => (
                    <button key={p.id} className="rejoin-player" onClick={() => handleReclaim(p.id, p.name)}>
                      <span className="rejoin-name">{p.name}</span>
                      <span className="rejoin-status">{p.locked ? 'Locked' : p.picks?.length ? `${p.picks.length} picks` : 'No picks'}</span>
                      {p.isCommissioner && <span className="rejoin-comm">Comm</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rejoin-divider"><span>or join as new</span></div>
            <div className="form-field"><label>Your Name</label><input type="text" placeholder="e.g. Nick" value={joinName} onChange={e => setJoinName(e.target.value)} maxLength={20} onKeyDown={e => e.key === 'Enter' && handleJoinNew()} /></div>
            {error && <div className="error-msg">{error}</div>}
            <button className="btn-primary" onClick={handleJoinNew} disabled={!joinName.trim()}>Join as New Player</button>
          </>
        )}
        </div>
      </div>
    </div>
  );

  // ═══ MAIN POOL ═══
  const players = poolData?.players ? Object.entries(poolData.players) : [];
  const lockedCount = players.filter(([,p]) => p.locked).length;
  const pod = PODS[currentPod];
  const podGolfers = pod ? getGolfersInPod(pod) : [];

  // Get who picked a golfer — from live Firebase data or mock
  const getActivePickedBy = (golferName) => {
    if (useMockData) return getPickedBy(golferName);
    return players
      .filter(([, data]) => data.locked && (data.picks || []).includes(golferName))
      .map(([id, data]) => ({
        id,
        name: data.name,
        initials: (data.name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || id.slice(0, 2).toUpperCase(),
      }));
  };

  return (
    <div className="app">
      <header className="pool-header">
        <div className="header-top">
          <svg className="masters-badge-sm-svg" viewBox="0 0 40 40" width="36" height="36">
            <circle cx="20" cy="20" r="19" fill="#00205B" stroke="rgba(198,163,78,0.4)" strokeWidth="1"/>
            <path d="M16 12 L24 12 L23.5 20 Q23 25 20 27 Q17 25 16.5 20 Z" fill="none" stroke="#C6A34E" strokeWidth="1"/>
            <line x1="20" y1="27" x2="20" y2="31" stroke="#C6A34E" strokeWidth="1"/>
            <line x1="16" y1="31" x2="24" y2="31" stroke="#C6A34E" strokeWidth="1"/>
            <path d="M16 15 Q12 16 12 19 Q12 22 15.5 21" fill="none" stroke="rgba(198,163,78,0.5)" strokeWidth="0.7"/>
            <path d="M24 15 Q28 16 28 19 Q28 22 24.5 21" fill="none" stroke="rgba(198,163,78,0.5)" strokeWidth="0.7"/>
          </svg>
          <div className="header-info">
            <h1>{poolData?.name || 'PGA Championship Pool'}</h1>
            <p>{poolId} · {players.length} player{players.length !== 1 ? 's' : ''} · {lockedCount} locked</p>
          </div>
          <button className="share-btn" onClick={handleShare}>Share</button>
          {isCommissioner && <button className="comm-toggle" onClick={() => setShowCommTools(!showCommTools)}>{showCommTools ? '\u2715' : '\u2699'}</button>}
        </div>
      </header>

      {/* Deadline countdown banner */}
      {poolDeadline && deadlineCountdown !== null && !isPoolLocked && (
        <div className={`deadline-bar ${deadlineCountdown < 3600000 ? 'urgent' : ''}`}>
          <span className="deadline-icon">{deadlineCountdown < 3600000 ? '\u23F0' : '\u{1F4C5}'}</span>
          <span className="deadline-text">Picks lock in <strong>{formatDeadlineCountdown(deadlineCountdown)}</strong></span>
        </div>
      )}
      {isPoolLocked && !tournamentActive && (
        <div className="deadline-bar locked-bar">
          <span className="deadline-icon">{'\u{1F512}'}</span>
          <span className="deadline-text">Pool is locked. Picks are final.</span>
        </div>
      )}

      {/* Commissioner toolbar */}
      {showCommTools && isCommissioner && (
        <div className="comm-toolbar">
          <div className="comm-toolbar-header">Commissioner Tools</div>

          {/* Deadline setting */}
          <div className="comm-section">
            <label className="comm-label">Pick Deadline</label>
            {poolDeadline ? (
              <div className="comm-deadline-info">
                <span>{new Date(poolDeadline).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                <button className="comm-btn-sm" onClick={() => setPoolDeadline(poolId, null)}>Remove</button>
              </div>
            ) : (
              <div className="comm-deadline-set">
                <input type="datetime-local" className="comm-input" value={deadlineInput} onChange={e => setDeadlineInput(e.target.value)} min={new Date().toISOString().slice(0, 16)} />
                <button className="comm-btn" onClick={handleSetDeadline} disabled={!deadlineInput}>Set</button>
              </div>
            )}
          </div>

          {/* Player management */}
          <div className="comm-section">
            <label className="comm-label">Players ({players.length})</label>
            <div className="comm-player-list">
              {players.map(([id, data]) => (
                <div key={id} className="comm-player-row">
                  <span className={`comm-player-status ${data.locked ? 'locked' : 'pending'}`}>{data.locked ? '\u2713' : '\u25CB'}</span>
                  <span className="comm-player-name">{data.name}</span>
                  <span className="comm-player-info">{data.locked ? 'Locked' : 'Selecting'}</span>
                  {!data.isCommissioner && <button className="comm-btn-kick" onClick={() => handleRemovePlayer(id)}>Remove</button>}
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="comm-section">
            <button className="comm-btn-full warning" onClick={handleLockPoolEarly} disabled={isPoolLocked}>
              Lock Pool Now (Removes Unlocked Players)
            </button>
            <button className="comm-btn-full" onClick={() => {
              const url = 'https://masters-yaz3.onrender.com';
              const text = `Picks lock ${poolDeadline ? 'at ' + new Date(poolDeadline).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' }) : 'soon'}! Get your PGA Championship picks in.\n\nPool Code: ${poolId}`;
              if (navigator.share) { navigator.share({ text, url }); } else { navigator.clipboard?.writeText(`${text}\n${url}`); }
            }}>
              Send Reminder
            </button>
            <button className="comm-btn-full danger" onClick={() => {
              if (window.confirm('Delete this pool? This cannot be undone. All picks and players will be lost.')) {
                import('./firebase').then(({ deletePool }) => {
                  deletePool(poolId).then(() => {
                    localStorage.removeItem('pgaPoolId');
                    localStorage.removeItem('pgaPlayerId');
                    localStorage.removeItem('pgaPlayerName');
                    localStorage.removeItem('pgaPicks');
                    setPoolId('');
                    setPlayerId('');
                    setPlayerName('');
                    setPoolData(null);
                    setMyPicks({});
                    setScreen('home');
                  });
                });
              }
            }}>
              Delete Pool
            </button>
          </div>
        </div>
      )}

      {/* Tournament status bar */}
      {tournamentActive && (
        <div className="tourney-bar">
          <span className="tourney-live-dot"></span>
          <span className="tourney-round">{activeTournamentStatus.roundLabel}</span>
          <span className="tourney-cut">Cut: {activeTournamentStatus.cutLine}</span>
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
              const me = activeStandings.find(p => p.id === playerId) || activeStandings[0];
              if (!me) return null;
              const myRank = activeStandings.indexOf(me) + 1;
              return (
                <>
                  <div className="myteam-summary">
                    <div className="myteam-rank-box">
                      <span className="myteam-pos">{myRank}<span className="myteam-pos-of">/{activeStandings.length}</span></span>
                      <span className="myteam-pos-label">Your Rank</span>
                    </div>
                    <div className="myteam-leader-box">
                      <span className="myteam-leader-name">{activeStandings[0]?.name}</span>
                      <span className="myteam-leader-score">{formatScore(activeStandings[0]?.totalScore)}</span>
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
                    const entry = getActiveGolferScore(g.name);
                    const golferData = GOLFERS.find(gl => gl.name === g.name);
                    const others = getActivePickedBy(g.name).filter(o => o.id !== playerId);
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
                        const entry = getActiveGolferScore(g.name);
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
            {/* Classic / Modern toggle */}
            <div className="lb-view-toggle">
              <button className={boardView === 'modern' ? 'active' : ''} onClick={() => setBoardView('modern')}>Modern</button>
              <button className={boardView === 'classic' ? 'active' : ''} onClick={() => setBoardView('classic')}>Classic</button>
            </div>

            {boardView === 'modern' && (
              <>
                <div className="lb-header-row">
                  <span className="lb-h-pos">Pos</span>
                  <span className="lb-h-player">Player</span>
                  <span className="lb-h-today">Today</span>
                  <span className="lb-h-thru">Thru</span>
                  <span className="lb-h-total">Total</span>
                </div>
                {leaderboard.map((g, idx) => {
                  const golferData = GOLFERS.find(gl => gl.name === g.name);
                  const isMine = myPicksList.includes(g.name);
                  const pickedBy = tournamentActive ? getActivePickedBy(g.name) : [];
                  return (
                    <div key={g.name} className={`lb-row ${g.status === 'cut' ? 'cut-row' : ''} ${g.status === 'active' ? 'active-row' : ''} ${isMine ? 'my-pick' : ''}`} onClick={() => g.status !== 'cut' && openGolfer(g.name)}>
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
              </>
            )}

            {boardView === 'classic' && (
              <div className="classic-board">
                <div className="classic-header">LEADERS</div>
                <div className="classic-scroll">
                  <table className="classic-table">
                    <thead>
                      <tr className="classic-hole-row">
                        <th className="classic-pos-cell"></th>
                        <th className="classic-name-cell">PLAYER</th>
                        <th className="classic-total-cell">TO PAR</th>
                        <th className="classic-thru-cell">THRU</th>
                        {COURSE_HOLES.map(h => (
                          <th key={h.hole} className="classic-hole-cell">{h.hole}</th>
                        ))}
                      </tr>
                      <tr className="classic-par-row">
                        <td className="classic-pos-cell"></td>
                        <td className="classic-name-cell">PAR</td>
                        <td className="classic-total-cell"></td>
                        <td className="classic-thru-cell"></td>
                        {COURSE_HOLES.map(h => (
                          <td key={h.hole} className="classic-hole-cell classic-par-num">{h.par}</td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.filter(g => g.status !== 'cut').slice(0, 20).map(g => {
                        const sc = activeScorecards[g.name];
                        const currentRound = sc?.rounds ? sc.rounds.findIndex(r => r && r.some(h => h === null)) : -1;
                        const displayRound = currentRound >= 0 ? currentRound : (sc?.rounds ? sc.rounds.length - 1 : -1);
                        const holes = displayRound >= 0 && sc?.rounds?.[displayRound] ? sc.rounds[displayRound] : [];
                        const isMine = myPicksList.includes(g.name);

                        return (
                          <tr key={g.name} className={`classic-player-row ${isMine ? 'classic-mine' : ''}`} onClick={() => openGolfer(g.name)}>
                            <td className="classic-pos-cell">{g.pos}</td>
                            <td className="classic-name-cell">{g.name.split(' ').pop().toUpperCase()}</td>
                            <td className={`classic-total-cell ${typeof g.total === 'number' && g.total < 0 ? 'classic-under' : typeof g.total === 'number' && g.total > 0 ? 'classic-over' : ''}`}>
                              {formatScore(g.total)}
                            </td>
                            <td className="classic-thru-cell">{g.thru === 'F' ? 'F' : g.thru ?? '-'}</td>
                            {COURSE_HOLES.map((h, hi) => {
                              const score = holes[hi];
                              if (score == null) return <td key={h.hole} className="classic-hole-cell classic-empty"></td>;
                              const diff = score - h.par;
                              const cls = diff < -1 ? 'classic-eagle' : diff < 0 ? 'classic-birdie' : diff > 1 ? 'classic-dbl-bogey' : diff > 0 ? 'classic-bogey' : '';
                              return (
                                <td key={h.hole} className={`classic-hole-cell ${cls}`}>
                                  <span className={`classic-score ${cls}`}>{score}</span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ STANDINGS — Pool rankings with scoring ═══ */}
        {tab === 'standings' && (
          <div className="standings-tab">
            <h3>Pool Standings</h3>
            <p className="standings-sub">{tournamentActive ? 'Live scores · Best 4 of 6 count' : 'Scores update live during the tournament'}</p>
            {tournamentActive && liveStatus?.projectedCutLine != null && !liveStatus?.cutLine && (
              <div className="projection-banner">
                <span className="projection-label">Projected cut</span>
                <span className="projection-value">{liveStatus.projectedCutLine > 0 ? `+${liveStatus.projectedCutLine}` : liveStatus.projectedCutLine === 0 ? 'E' : String(liveStatus.projectedCutLine)}</span>
                <span className="projection-note">Top 65 + ties · unofficial</span>
              </div>
            )}
            {(tournamentActive ? activeStandings : standings).map((p, idx) => (
              <div key={p.id} className={`standing-card-wrap ${expandedStanding === p.id ? 'expanded' : ''}`}>
                <div className={`standing-row ${p.id === playerId ? 'me' : ''} ${!p.qualified && tournamentActive ? 'eliminated' : ''}`}
                  onClick={() => { setExpandedStanding(expandedStanding === p.id ? null : p.id); haptic(); }}>
                  <span className="standing-rank">{!p.qualified && tournamentActive ? '-' : idx + 1}</span>
                  <div className="standing-info">
                    <span className="standing-name">
                      {p.name}
                      {p.isCommissioner && <span className="tag">Comm</span>}
                      {p.id === playerId && <span className="tag me-tag">You</span>}
                    </span>
                    {tournamentActive ? (
                      <span className="standing-detail">
                        {p.qualified ? `${p.madeCut}/6 made cut` : `${p.madeCut}/6 made cut — Eliminated`}
                        {p.qualified && p.projectedQualified === false && liveStatus?.projectedCutLine != null && (
                          <span className="likely-dsq-badge" title={`Only ${p.projectedMadeCut}/6 golfers are at or below the projected cut line`}>Likely DSQ</span>
                        )}
                        {p.pickedLeader && <span className="leader-badge">Has leader</span>}
                      </span>
                    ) : (
                      <span className="standing-status">{p.locked ? `${p.picks?.length || 0} golfers` : 'Pending'}</span>
                    )}
                  </div>
                  <span className={`standing-score ${!p.qualified && tournamentActive ? 'elim-score' : ''}`}>
                    {!tournamentActive ? 'E' : !p.qualified ? 'DQ' : formatScore(p.totalScore)}
                  </span>
                  <span className={`standing-chevron ${expandedStanding === p.id ? 'open' : ''}`}>&#9662;</span>
                </div>
                {expandedStanding === p.id && (
                  <div className="standing-detail-card">
                    {(tournamentActive && p.golferScores ? p.golferScores : (p.picks || []).map(name => {
                      const g = GOLFERS.find(gl => gl.name === name);
                      return { name, score: null, pos: null, status: 'upcoming', today: null, thru: null, flag: g?.flag, pod: g ? PODS.find(pd => g.rank >= pd.range[0] && g.rank <= pd.range[1])?.id : null };
                    })).map((g, gi) => {
                      const golferInfo = GOLFERS.find(gl => gl.name === g.name);
                      const pod = golferInfo ? PODS.find(pd => golferInfo.rank >= pd.range[0] && golferInfo.rank <= pd.range[1]) : null;
                      const isCounting = tournamentActive && p.counting && p.counting.some(c => c.name === g.name);
                      const isBench = tournamentActive && p.bench && p.bench.some(b => b.name === g.name);
                      const isCut = g.status === 'cut';
                      return (
                        <div key={g.name} className={`standing-golfer-row ${isCut ? 'cut' : ''} ${isBench ? 'bench' : ''}`}>
                          <span className="standing-golfer-pod">{pod?.id || '?'}</span>
                          <span className="standing-golfer-flag">{golferInfo?.flag || ''}</span>
                          <span className="standing-golfer-name">{g.name}</span>
                          {tournamentActive && (
                            <>
                              <span className={`standing-golfer-thru ${g.thru === 'F' ? 'finished' : ''}`}>
                                {isCut ? 'MC' : g.thru === 'F' ? 'F' : g.thru ? g.thru : '-'}
                              </span>
                              <span className={`standing-golfer-score ${g.score < 0 ? 'under' : g.score > 0 ? 'over' : ''}`}>
                                {isCut ? 'MC' : formatScore(g.score)}
                              </span>
                            </>
                          )}
                          {tournamentActive && isCounting && <span className="counting-badge">&#10003;</span>}
                        </div>
                      );
                    })}
                    {tournamentActive && p.qualified && (
                      <div className="standing-detail-footer">
                        Best 4 total: <strong>{formatScore(p.totalScore)}</strong>
                      </div>
                    )}
                  </div>
                )}
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
                      <div className="golfer-rank">#{g.rank}</div>
                      <div className="golfer-flag">{g.flag}</div>
                      <div className="golfer-info">
                        <span className="golfer-name">{g.name}</span>
                        <span className="golfer-meta">
                          {g.odds && <span>{g.odds}</span>}
                          {g.majors > 0 && <span>{g.majors} major{g.majors > 1 ? 's' : ''}</span>}
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
            {(tournamentActive && activeStandings.length > 0 ? activeStandings : players.map(([id, data]) => ({ id, ...data }))).map(p => {
              const data = tournamentActive ? p : p;
              return (
              <div key={data.id || data.name} className="member-card">
                <div className="member-top"><span className="member-name">{data.name}{data.isCommissioner && <span className="tag">Comm</span>}</span><span className={`member-status ${data.locked ? 'locked' : ''}`}>{data.locked ? 'Locked' : 'Selecting'}</span></div>
                {data.locked && isPoolLocked && <div className="member-picks">{(data.picks||[]).map(pick => { const g = GOLFERS.find(gl => gl.name === pick); const score = tournamentActive ? getActiveGolferScore(pick) : null; return <span key={pick} className={`pick-chip ${score?.status === 'cut' ? 'cut-chip' : ''}`}>{g?.flag} {pick.split(' ')[0]?.[0]}. {pick.split(' ').pop()}{tournamentActive && score ? ` (${formatScore(score.total)})` : ''}</span>; })}</div>}
                {data.locked && !isPoolLocked && <div className="member-picks"><span className="pick-chip hidden-chip">Picks hidden until pool locks</span></div>}
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
        const sc = tournamentActive ? activeScorecards[selectedGolfer] : null;
        const entry = tournamentActive ? getActiveGolferScore(selectedGolfer) : null;
        const golferData = GOLFERS.find(gl => gl.name === selectedGolfer);
        const pickedBy = tournamentActive ? getActivePickedBy(selectedGolfer) : [];
        if (!tournamentActive && !entry) {
          // Pre-tournament: show basic golfer info without scores
          return (
            <div className="sc-overlay" onClick={() => setSelectedGolfer(null)}>
              <div className="sc-modal" onClick={e => e.stopPropagation()}>
                <div className="sc-drag-handle"><div className="sc-drag-bar"></div></div>
                <button className="sc-close" onClick={() => setSelectedGolfer(null)}>&times;</button>
                <div className="sc-header">
                  <span className="sc-flag">{golferData?.flag}</span>
                  <div className="sc-info">
                    <span className="sc-name">{selectedGolfer}</span>
                    <span className="sc-pos-line">{golferData?.odds}{golferData?.majors > 0 ? ` · ${golferData.majors} major${golferData.majors > 1 ? 's' : ''}` : ''}</span>
                  </div>
                </div>
                <p style={{ textAlign: 'center', color: 'var(--masters-text2)', padding: '40px 0', fontStyle: 'italic' }}>Scores available when the tournament starts</p>
              </div>
            </div>
          );
        }
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
                    {entry.status === 'finished' && ` · R${activeTournamentStatus.round} Complete`}
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
                        <span className="sc-round-complete">{roundTotal} ({roundTotal - COURSE_PAR.total >= 0 ? '+' : ''}{roundTotal - COURSE_PAR.total})</span>
                      ) : (
                        <span className="sc-round-thru">Thru {thruHole}</span>
                      )}
                    </div>

                    {/* Front 9 */}
                    <div className="sc-grid">
                      <div className="sc-grid-row sc-grid-header">
                        <span className="sc-grid-label">Hole</span>
                        {COURSE_HOLES.slice(0, 9).map(h => <span key={h.hole} className="sc-grid-cell">{h.hole}</span>)}
                        <span className="sc-grid-cell sc-grid-total">Out</span>
                      </div>
                      <div className="sc-grid-row sc-grid-par">
                        <span className="sc-grid-label">Par</span>
                        {COURSE_HOLES.slice(0, 9).map(h => <span key={h.hole} className="sc-grid-cell">{h.par}</span>)}
                        <span className="sc-grid-cell sc-grid-total">{COURSE_PAR.out}</span>
                      </div>
                      <div className="sc-grid-row sc-grid-scores">
                        <span className="sc-grid-label">Score</span>
                        {COURSE_HOLES.slice(0, 9).map((h, hi) => {
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
                        {COURSE_HOLES.slice(9).map(h => <span key={h.hole} className="sc-grid-cell">{h.hole}</span>)}
                        <span className="sc-grid-cell sc-grid-total">In</span>
                      </div>
                      <div className="sc-grid-row sc-grid-par">
                        <span className="sc-grid-label">Par</span>
                        {COURSE_HOLES.slice(9).map(h => <span key={h.hole} className="sc-grid-cell">{h.par}</span>)}
                        <span className="sc-grid-cell sc-grid-total">{COURSE_PAR.in}</span>
                      </div>
                      <div className="sc-grid-row sc-grid-scores">
                        <span className="sc-grid-label">Score</span>
                        {COURSE_HOLES.slice(9).map((h, hi) => {
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
