import React, { useState, useRef } from 'react';
import { Building2, MapPin, ArrowRight, Clock, X, Loader2, Navigation2 } from 'lucide-react';
import { fetchStationBoard, searchStations } from '../api/railRadar';
import LiveLocationModal from './LiveLocationModal';

export default function StationBoard({ onSelectTrainToTrack }) {
  const [stationInput, setStationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [boardData, setBoardData] = useState(null);

  // Live Location Modal State
  const [selectedTrainNum, setSelectedTrainNum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debounceSearch = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setStationInput(val);

    if (debounceSearch.current) clearTimeout(debounceSearch.current);

    if (val.trim().length > 0) {
      setLoadingSuggestions(true);
      debounceSearch.current = setTimeout(async () => {
        try {
          const res = await searchStations(val.trim());
          if (res && res.data && Array.isArray(res.data)) {
            setSuggestions(res.data);
          } else {
            setSuggestions([]);
          }
        } catch (err) {
          console.warn('Station lookup failed:', err);
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

  const selectStation = (st) => {
    const formatted = `${st.name} (${st.code})`;
    setStationInput(formatted);
    setSuggestions([]);
    handleSearch(st.code);
  };

  const extractStationCode = (text) => {
    if (!text) return '';
    const match = text.match(/\(([^)]+)\)/);
    if (match && match[1]) return match[1].trim().toUpperCase();
    return text.split(' ')[0].trim().toUpperCase();
  };

  const handleSearch = async (codeToSearch) => {
    const target = (codeToSearch || extractStationCode(stationInput)).toUpperCase();
    if (!target) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const res = await fetchStationBoard(target);
      if (res && res.success && res.data) {
        setBoardData(res.data);
      } else {
        throw new Error(res?.error?.message || 'Station code not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch station board.');
      setBoardData(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleTrainClick = (trainNum) => {
    setSelectedTrainNum(trainNum);
    setIsModalOpen(true);
  };

  const formatTime = (timeVal) => {
    if (!timeVal) return '--:--';
    if (typeof timeVal === 'string' && timeVal.includes('T')) {
      const parts = timeVal.split('T')[1];
      return parts ? parts.substring(0, 5) : timeVal;
    }
    return timeVal;
  };

  const stationDisplayName = boardData?.station?.name || boardData?.stationName || extractStationCode(stationInput);
  const stationDisplayCode = boardData?.station?.code || boardData?.stationCode || extractStationCode(stationInput);

  return (
    <div className="tab-pane active">
      <div className="search-card shadow-glass">
        <div className="search-title">
          <h2><Building2 /> Live Station Timetable Board</h2>
          <p>Search any station code or name for live arrival & departure feed</p>
        </div>

        <form onSubmit={onSubmit} className="search-form">
          <div className="input-group-wrapper">
            <div className="input-group">
              <MapPin className="input-icon" />
              <input
                type="text"
                value={stationInput}
                onChange={handleInputChange}
                placeholder="Station Code or Name"
                autoComplete="off"
                required
              />
              {loadingSuggestions && <Loader2 className="input-icon spin-icon" size={16} />}
              {stationInput && !loadingSuggestions && (
                <button type="button" onClick={() => { setStationInput(''); setSuggestions([]); }} className="clear-btn">
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="primary-btn">
                <span>View Station</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Floating Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="suggestions-dropdown shadow-glass">
                {suggestions.map((st, idx) => (
                  <div
                    key={st.code || idx}
                    className="suggestion-item"
                    onClick={() => selectStation(st)}
                  >
                    <div className="st-item-main">
                      <span className="st-item-name">{st.name}</span>
                      {st.city && st.city !== st.name && <span className="st-item-city">({st.city})</span>}
                    </div>
                    <span className="st-item-code">({st.code})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        <div className="quick-chips">
          <span className="chips-label">Major Hubs:</span>
          {['NDLS', 'BCT', 'BPL', 'HWH', 'MAS'].map((code) => (
            <button
              key={code}
              className="chip"
              onClick={() => {
                setStationInput(code);
                handleSearch(code);
              }}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>Retrieving Station Board Telemetry...</p>
        </div>
      )}

      {error && <div className="alert-box alert-error">{error}</div>}

      {boardData && !loading && (
        <div className="results-container">
          <div className="station-hero">
            <div>
              <h2>{stationDisplayName} ({stationDisplayCode})</h2>
              <p>Live Departures & Arrivals Feed • Click train row to view live location</p>
            </div>
            <div className="st-clock">
              <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Live Feed
            </div>
          </div>

          <div className="station-table-wrapper shadow-glass">
            <table className="station-table">
              <thead>
                <tr>
                  <th>Train</th>
                  <th>Scheduled</th>
                  <th>Expected</th>
                  <th>Status / Delay</th>
                  <th>Platform</th>
                  <th>Live Track</th>
                </tr>
              </thead>
              <tbody>
                {boardData.trains?.map((item, idx) => {
                  const num = item.train?.number || item.trainNumber || '12555';
                  const name = item.train?.name || item.trainName || 'Express';
                  const sch = formatTime(item.stop?.departure || item.stop?.arrival || item.scheduledTime);
                  const exp = formatTime(item.live?.expectedDepartureTime || item.live?.expectedArrivalTime || item.expectedTime || sch);
                  const delayMins = item.live?.delayMinutes !== undefined ? item.live.delayMinutes : (item.delay || 0);
                  const pf = item.stop?.platform || item.platform || '1';

                  return (
                    <tr
                      key={idx}
                      onClick={() => handleTrainClick(num)}
                      style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                      className="table-row-hover"
                      title="Click to track live location"
                    >
                      <td>
                        <strong>{num}</strong> - {name}
                      </td>
                      <td>{sch}</td>
                      <td>{exp}</td>
                      <td>
                        <span className={`delay-tag ${delayMins > 0 ? 'late' : 'ontime'}`}>
                          {delayMins > 0 ? `Late ${delayMins}m` : 'On Time'}
                        </span>
                      </td>
                      <td>PF #{pf}</td>
                      <td>
                        <button
                          type="button"
                          className="chip"
                          style={{ fontSize: '0.75rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', borderColor: 'var(--border-glow)' }}
                          onClick={(e) => { e.stopPropagation(); handleTrainClick(num); }}
                        >
                          <Navigation2 size={12} />
                          <span>Track Live</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Location Modal Popup */}
      <LiveLocationModal
        trainNumber={selectedTrainNum}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpenFullTracker={(tNum) => {
          if (onSelectTrainToTrack) onSelectTrainToTrack(tNum);
        }}
      />
    </div>
  );
}
