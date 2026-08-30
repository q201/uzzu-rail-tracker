import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Clock, MapPin, Navigation2, Layers, Calendar, GitCommit, X, TrainFront, Loader2 } from 'lucide-react';
import { fetchLiveTrainStatus, searchTrains } from '../api/railRadar';
import LiveTrainSpriteTracker from './LiveTrainSpriteTracker';

const POPULAR_TRAINS = [
  { num: '12002', name: '12002 Bhopal Shatabdi' },
  { num: '12952', name: '12952 Mumbai Rajdhani' },
  { num: '22436', name: '22436 Vande Bharat' },
  { num: '12626', name: '12626 Kerala Express' },
  { num: '12259', name: '12259 Sealdah Duronto' }
];

export default function TrainTracker({ initialTrainNum }) {
  const [query, setQuery] = useState(initialTrainNum || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trainData, setTrainData] = useState(null);
  const [haltsOnly, setHaltsOnly] = useState(false);

  const debounceTrainSearch = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTrainSearch.current) clearTimeout(debounceTrainSearch.current);

    if (val.trim().length > 0) {
      setLoadingSuggestions(true);
      debounceTrainSearch.current = setTimeout(async () => {
        try {
          const res = await searchTrains(val.trim());
          if (res && res.data && Array.isArray(res.data)) {
            setSuggestions(res.data);
          } else {
            setSuggestions([]);
          }
        } catch (err) {
          console.warn('Train search failed:', err);
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      }, 150);
    } else {
      setSuggestions([]);
      setLoadingSuggestions(false);
    }
  };

  const selectTrainSuggestion = (train) => {
    setQuery(`${train.number} - ${train.name}`);
    setSuggestions([]);
    handleSearch(train.number);
  };

  const handleSearch = async (numToSearch) => {
    const target = (numToSearch || query).split(' ')[0].trim();
    if (!target) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const res = await fetchLiveTrainStatus(target);
      if (res && res.success && res.data) {
        setTrainData(res.data);
      } else {
        throw new Error(res?.error?.message || 'Train not found or inactive today.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch live status');
      setTrainData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrainNum) {
      setQuery(initialTrainNum);
      handleSearch(initialTrainNum);
    }
  }, [initialTrainNum]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const coachList = trainData?.coachPosition
    ? trainData.coachPosition.split('-')
    : ['ENG', 'LPR', 'E1', 'E2', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'LPR'];

  return (
    <div className="tab-pane active">
      {/* Search Input Box */}
      <div className="search-card shadow-glass">
        <div className="search-title">
          <h2><Search /> Track Live Train Status</h2>
          <p>Type any Indian Railways train number or name to track live telemetry</p>
        </div>

        <form onSubmit={onSubmit} className="search-form">
          <div className="input-group-wrapper">
            <div className="input-group">
              <Search className="input-icon" />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Enter train number or name e.g. 12952, 12002, Shatabdi"
                autoComplete="off"
                required
              />
              {loadingSuggestions && <Loader2 className="input-icon spin-icon" size={16} />}
              {query && !loadingSuggestions && (
                <button type="button" onClick={() => { setQuery(''); setSuggestions([]); }} className="clear-btn">
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="primary-btn">
                <span>Track Now</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Floating Dropdown Suggestions */}
            {suggestions.length > 0 && (
              <div className="suggestions-dropdown shadow-glass">
                {suggestions.map((t, idx) => (
                  <div
                    key={t.number || idx}
                    className="suggestion-item"
                    onClick={() => selectTrainSuggestion(t)}
                  >
                    <div className="st-item-main">
                      <span className="st-item-name">{t.name}</span>
                    </div>
                    <span className="st-item-code">({t.number})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Quick Chips */}
        <div className="quick-chips">
          <span className="chips-label">Popular Express Trains:</span>
          {POPULAR_TRAINS.map(t => (
            <button
              key={t.num}
              className="chip"
              onClick={() => {
                setQuery(t.num);
                handleSearch(t.num);
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>Fetching real-time train telemetry status...</p>
        </div>
      )}

      {/* Error Alert */}
      {error && <div className="alert-box alert-error">{error}</div>}

      {/* Results View */}
      {trainData && !loading && (
        <div className="results-container">
          {/* Hero Banner */}
          <div className="hero-card shadow-glass">
            <div className="hero-header">
              <div>
                <span className="badge badge-train-type">{trainData.trainNumber}</span>
                <h1 className="hero-title">{trainData.trainName}</h1>
                <div className="sub-info">
                  {trainData.stops?.[0]?.stationName} ➔ {trainData.stops?.[trainData.stops.length - 1]?.stationName}
                </div>
              </div>

              <div className={`hero-status-pill ${trainData.delayMinutes > 0 ? 'delayed' : 'ontime'}`}>
                <Clock size={18} />
                <span>
                  {trainData.delayMinutes > 0 ? `Late by ${trainData.delayMinutes} Mins` : 'Running On Time'}
                </span>
              </div>
            </div>

            <div className="telemetry-grid">
              <div className="tele-item">
                <span className="tele-label"><MapPin size={14} /> Current Station</span>
                <span className="tele-val highlight">
                  {trainData.currentLocation?.stationName || 'En-route'}
                </span>
              </div>
              <div className="tele-item">
                <span className="tele-label"><Navigation2 size={14} /> Speed & Heading</span>
                <span className="tele-val">
                  {trainData.currentLocation?.speedKmph || 88} km/h
                </span>
              </div>
              <div className="tele-item">
                <span className="tele-label"><Layers size={14} /> Platform</span>
                <span className="tele-val">
                  Platform #{trainData.currentLocation?.platform || 1}
                </span>
              </div>
              <div className="tele-item">
                <span className="tele-label"><Calendar size={14} /> Today's Journey</span>
                <span className="tele-val">Active Run</span>
              </div>
            </div>

            {/* Coach Composition */}
            <div className="coach-section">
              <div className="coach-label">
                <TrainFront size={16} /> Coach Composition & Layout:
              </div>
              <div className="coach-strip">
                {coachList.map((coach, i) => (
                  <div key={i} className={`coach-box ${coach.includes('ENG') ? 'engine' : ''}`}>
                    {coach}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Standard Stations List with Animated Train Sprite */}
          <div className="timeline-card shadow-glass">
            <div className="timeline-header">
              <h3><GitCommit size={20} /> Standard Stations List & Train Sprite Live Tracking</h3>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={haltsOnly}
                  onChange={(e) => setHaltsOnly(e.target.checked)}
                />
                <span className="slider"></span>
                <span className="switch-label">Halts Only</span>
              </label>
            </div>

            <LiveTrainSpriteTracker telemetry={trainData} haltsOnly={haltsOnly} />
          </div>
        </div>
      )}
    </div>
  );
}
