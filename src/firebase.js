import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, get, push, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDGFoLFHUuK_FZQkvIlKJ_VMCnsQtUoK_4",
  authDomain: "draftpool-30e4a.firebaseapp.com",
  databaseURL: "https://draftpool-30e4a-default-rtdb.firebaseio.com",
  projectId: "draftpool-30e4a",
  storageBucket: "draftpool-30e4a.firebasestorage.app",
  messagingSenderId: "1051667041146",
  appId: "1:1051667041146:web:6b1766daa7009973f5a4c3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set, update, get, push };

// Pool operations
export async function createPool(poolId, data) {
  await set(ref(db, `golf-pools/${poolId}`), data);
}

export async function getPool(poolId) {
  const snapshot = await get(ref(db, `golf-pools/${poolId}`));
  return snapshot.val();
}

export function subscribeToPool(poolId, callback) {
  const poolRef = ref(db, `golf-pools/${poolId}`);
  return onValue(poolRef, (snapshot) => callback(snapshot.val()));
}

export async function submitPicks(poolId, playerId, picks) {
  await update(ref(db, `golf-pools/${poolId}/players/${playerId}`), {
    picks,
    submittedAt: Date.now(),
    locked: true
  });
}

export async function joinPool(poolId, playerName) {
  const pool = await getPool(poolId);
  if (!pool) throw new Error('Pool not found');

  // Check if deadline has passed
  if (pool.deadline && Date.now() > pool.deadline) {
    throw new Error('Pick deadline has passed. Pool is locked.');
  }

  const players = pool.players || {};

  // Check if this name already exists (rejoin)
  const existing = Object.entries(players).find(([_, p]) => p.name?.toLowerCase() === playerName.toLowerCase());
  if (existing) return existing[0]; // Return existing player ID

  const existingIds = Object.keys(players);
  const playerId = `player_${existingIds.length + 1}`;
  await update(ref(db, `golf-pools/${poolId}/players/${playerId}`), {
    name: playerName,
    picks: [],
    locked: false,
    joinedAt: Date.now()
  });
  return playerId;
}

// Commissioner functions
export async function setPoolDeadline(poolId, deadline) {
  await update(ref(db, `golf-pools/${poolId}`), { deadline });
}

export async function removePlayer(poolId, playerId) {
  await set(ref(db, `golf-pools/${poolId}/players/${playerId}`), null);
}

export async function lockPool(poolId) {
  // Remove all unlocked players and set pool as locked
  const pool = await getPool(poolId);
  if (!pool) return;
  const players = pool.players || {};
  const updates = {};
  Object.entries(players).forEach(([id, data]) => {
    if (!data.locked) {
      updates[`players/${id}`] = null; // Remove unlocked players
    }
  });
  updates['locked'] = true;
  updates['lockedAt'] = Date.now();
  await update(ref(db, `golf-pools/${poolId}`), updates);
}

export async function updatePoolSettings(poolId, settings) {
  await update(ref(db, `golf-pools/${poolId}`), settings);
}

export async function deletePool(poolId) {
  await remove(ref(db, `golf-pools/${poolId}`));
}
