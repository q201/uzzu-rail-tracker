/* ==========================================================================
   UZZU RAIL TRACKER - HIGH AVAILABILITY RAILRADAR API CLIENT
   ========================================================================== */

// Read Environment Variables
const RENDER_BACKEND_URL = import.meta.env.VITE_RENDER_BACKEND_URL || '';
const ENV_KEY = import.meta.env.VITE_RAILRADAR_API_KEY || '';
const ENV_BASE_URL = import.meta.env.VITE_RAILRADAR_BASE_URL || 'https://api.railradar.in/v1';

export const getStoredApiKey = () => {
  return localStorage.getItem('uzzu_rail_key') || ENV_KEY;
};

export const setStoredApiKey = (key) => {
  const cleanKey = key.trim() || ENV_KEY;
  localStorage.setItem('uzzu_rail_key', cleanKey);
  return cleanKey;
};

// Base URL Routing:
// 1. If Render backend URL is configured, use Render Proxy (/api)
// 2. If running locally on dev server, use Vite Proxy (/rr-api)
// 3. Otherwise default to direct RailRadar URL
const BASE_URL = RENDER_BACKEND_URL
  ? `${RENDER_BACKEND_URL.replace(/\/$/, '')}/api`
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? '/rr-api'
    : ENV_BASE_URL;

async function request(endpoint, params = {}) {
  const apiKey = getStoredApiKey();
  const startTime = performance.now();
  const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);

  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });

  const headers = { 'Content-Type': 'application/json' };
  
  // Only send Authorization header if requesting directly (not through Render proxy)
  if (!RENDER_BACKEND_URL && apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
    headers['X-API-Key'] = apiKey;
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers
  });

  const latency = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  json._latency = latency;
  return json;
}

// 1. GET /v1/trains/{number}/live (Live Train Running Status)
export async function fetchLiveTrainStatus(trainNum, date = null) {
  return request(`/trains/${trainNum}/live`, { date, authoritative: 'true' });
}

// 2. GET /v1/trains/{number} (Train Schedule & Timetable)
export async function fetchTrainDetails(trainNum) {
  return request(`/trains/${trainNum}`);
}

// 3. GET /v1/trains/{number}/route (Route GIS Geometry)
export async function fetchRouteGeometry(trainNum) {
  return request(`/trains/${trainNum}/route`);
}

// 4. GET /v1/trains/{number}/coaches (Coach Composition Layout)
export async function fetchCoachComposition(trainNum) {
  return request(`/trains/${trainNum}/coaches`);
}

// 5. GET /v1/trains/{number}/availability (Seat Availability Forecast)
export async function fetchSeatAvailability(trainNum, from, to, date = null, trainClass = '3A') {
  return request(`/trains/${trainNum}/availability`, { from, to, date, class: trainClass });
}

// 6. GET /v1/trains/fare (Train Fare Calculator)
export async function fetchFareCalculator(trainNum, from, to) {
  return request(`/trains/fare`, { train: trainNum, from, to });
}

// 7. GET /v1/trains/between/{from}/{to} (Live Direct Trains Between Stations Path)
export async function fetchTrainsBetween(fromCode, toCode) {
  const cleanFrom = fromCode.trim().toUpperCase();
  const cleanTo = toCode.trim().toUpperCase();
  return request(`/trains/between/${cleanFrom}/${cleanTo}`);
}

// 8. GET /v1/pnr/{pnr} (10-Digit PNR Status)
export async function fetchPNRStatus(pnrNumber) {
  const cleanPnr = pnrNumber.replace(/[^0-9]/g, '');
  return request(`/pnr/${cleanPnr}`);
}

// 9. GET /v1/pnr/{pnr}/prediction (PNR Confirmation Prediction)
export async function fetchPNRPrediction(pnrNumber) {
  const cleanPnr = pnrNumber.replace(/[^0-9]/g, '');
  return request(`/pnr/${cleanPnr}/prediction`);
}

// 10. GET /v1/pnr/{pnr}/refund (Cancellation & Refund Rules)
export async function fetchPNRRefund(pnrNumber) {
  const cleanPnr = pnrNumber.replace(/[^0-9]/g, '');
  return request(`/pnr/${cleanPnr}/refund`);
}

// 11. GET /v1/stations/{code}/schedule (Station Timetable)
export async function fetchStationSchedule(stationCode) {
  return request(`/stations/${stationCode.toUpperCase()}/schedule`);
}

// 12. GET /v1/stations/{code}/live (Live Station Board)
export async function fetchStationBoard(stationCode) {
  return request(`/stations/${stationCode.toUpperCase()}/live`);
}

// 13. GET /v1/lookup/search/stations (Station Autocomplete API)
export async function searchStations(query) {
  return request(`/lookup/search/stations`, { q: query, limit: 10 });
}

// 14. GET /v1/lookup/search/trains (Train Autocomplete API)
export async function searchTrains(query) {
  return request(`/lookup/search/trains`, { q: query, limit: 10 });
}

// 15. GET /v1/suburban/local (Suburban Local Trains)
export async function fetchSuburbanTrains(city = 'MUMBAI') {
  return request(`/suburban/local`, { city });
}

// 16. GET /v1/suburban/cities (Local Train Cities)
export async function fetchSuburbanCities() {
  return request(`/suburban/cities`);
}
