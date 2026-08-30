/* ==========================================================================
   UZZU RAIL TRACKER - HYBRID APPLICATION STATE STATION STORE
   Caches all searched & fetched stations into App State & LocalStorage.
   Dynamically auto-expands memory whenever new small stations are searched.
   ========================================================================== */

import { searchStations } from '../api/railRadar';
import { ALL_INDIAN_STATIONS } from './stations';

const CACHE_KEY = 'uzzu_state_stations';

// Load stored station database from LocalStorage + base index
export const getAppStationState = () => {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge unique stations by station code
      const map = new Map();
      ALL_INDIAN_STATIONS.forEach(s => map.set(s.code.toUpperCase(), s));
      parsed.forEach(s => map.set(s.code.toUpperCase(), s));
      return Array.from(map.values());
    }
  } catch (e) {
    console.warn('Failed to load local station cache:', e);
  }
  return [...ALL_INDIAN_STATIONS];
};

// Save newly discovered stations into persistent state store
export const saveStationsToState = (newStations) => {
  if (!Array.isArray(newStations) || newStations.length === 0) return;
  const current = getAppStationState();
  const map = new Map();

  current.forEach(s => map.set(s.code.toUpperCase(), s));
  newStations.forEach(s => {
    if (s && s.code) {
      map.set(s.code.toUpperCase(), {
        code: s.code,
        name: s.name || s.code,
        city: s.city || s.name || 'India',
        state: s.state || 'India'
      });
    }
  });

  const updated = Array.from(map.values());
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage save quota exceeded:', e);
  }
  return updated;
};

/**
 * Filter stations from Application State Store (<1ms).
 * If fewer than 3 matches found in state, queries RailRadar API in background and
 * automatically saves new small stations directly into Application State!
 */
export async function searchAndSyncStationState(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  const stateStations = getAppStationState();

  // 1. Search in local Application State
  const localMatches = stateStations.filter(
    st =>
      st.code.toLowerCase().includes(q) ||
      st.name.toLowerCase().includes(q) ||
      (st.city && st.city.toLowerCase().includes(q)) ||
      (st.state && st.state.toLowerCase().includes(q))
  );

  // If local state has sufficient matches (3+), return immediately from memory (<1ms)
  if (localMatches.length >= 3) {
    return localMatches.slice(0, 8);
  }

  // 2. If small/rare station not in local state, fetch from RailRadar API & expand State Store!
  try {
    const apiRes = await searchStations(q);
    if (apiRes && apiRes.data && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
      saveStationsToState(apiRes.data);
      // Re-read updated state
      const updatedState = getAppStationState();
      return updatedState.filter(
        st =>
          st.code.toLowerCase().includes(q) ||
          st.name.toLowerCase().includes(q) ||
          (st.city && st.city.toLowerCase().includes(q))
      ).slice(0, 8);
    }
  } catch (err) {
    console.warn('Background station expansion failed:', err);
  }

  return localMatches.slice(0, 8);
}
