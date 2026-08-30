import React, { useState, useRef } from 'react';
import { ArrowRightLeft, CircleDot, MapPin, Search, Repeat, ArrowRight, X, Loader2, Clock, GitCommit, Navigation2 } from 'lucide-react';
import { fetchTrainsBetween, searchStations } from '../api/railRadar';
import LiveLocationModal from './LiveLocationModal';

export default function TrainsBetween({ onSelectTrainToTrack }) {
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trainsList, setTrainsList] = useState(null);

  // Live Location Modal State
  const [selectedTrainNum, setSelectedTrainNum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debounceFrom = useRef(null);
  const debounceTo = useRef(null);

  const handleFromChange = (e) => {
    const val = e.target.value;
    setFromInput(val);

    if (debounceFrom.current) clearTimeout(debounceFrom.current);

    if (val.trim().length > 0) {
      setLoadingFrom(true);
      debounceFrom.current = setTimeout(async () => {
        try {
          const res = await searchStations(val.trim());
          if (res && res.data && Array.isArray(res.data)) {
            setFromSuggestions(res.data);
          } else {
            setFromSuggestions([]);
          }
        } catch (err) {
          console.warn('Station search failed:', err);
          setFromSuggestions([]);
        } finally {
          setLoadingFrom(false);
        }
      }, 150);
    } else {
      setFromSuggestions([]);
      setLoadingFrom(false);
    }
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToInput(val);

    if (debounceTo.current) clearTimeout(debounceTo.current);

    if (val.trim().length > 0) {
      setLoadingTo(true);
      debounceTo.current = setTimeout(async () => {
        try {
          const res = await searchStations(val.trim());
          if (res && res.data && Array.isArray(res.data)) {
            setToSuggestions(res.data);
          } else {
            setToSuggestions([]);
          }
        } catch (err) {
          console.warn('Station search failed:', err);
          setToSuggestions([]);
        } finally {
          setLoadingTo(false);
        }
      }, 150);
    } else {
      setToSuggestions([]);
      setLoadingTo(false);
    }
  };

  const selectFromStation = (st) => {
    setFromInput(`${st.name} (${st.code})`);
    setFromSuggestions([]);
  };

  const selectToStation = (st) => {
    setToInput(`${st.name} (${st.code})`);
    setToSuggestions([]);
  };

  const swapStations = () => {
    const temp = fromInput;
    setFromInput(toInput);
    setToInput(temp);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const extractStationCode = (text) => {
    if (!text) return '';
    const match = text.match(/\(([^)]+)\)/);
    if (match && match[1]) return match[1].trim().toUpperCase();
    return text.split(' ')[0].trim().toUpperCase();
  };

  const formatDuration = (mins) => {
    if (!mins && mins !== 0) return 'N/A';
    if (typeof mins === 'string') return mins;
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  const handleSearch = async () => {
    const cleanFrom = extractStationCode(fromInput);
    const cleanTo = extractStationCode(toInput);
    
    if (!cleanFrom || !cleanTo) return;
    setLoading(true);
    setError(null);
    setFromSuggestions([]);
    setToSuggestions([]);

    try {
      const res = await fetchTrainsBetween(cleanFrom, cleanTo);
      if (res && res.success && res.data) {
        setTrainsList(res.data);
      } else {
        throw new Error(res?.error?.message || 'Failed to search direct trains.');
      }
    } catch (err) {
      setError(err.message || 'Failed to search trains between stations.');
      setTrainsList(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleTrainClick = (tNum) => {
    setSelectedTrainNum(tNum);
    setIsModalOpen(true);
  };

  return (
    <div className="tab-pane active">
      <div className="search-card shadow-glass">
        <div className="search-title">
          <h2><ArrowRightLeft /> Search Trains Between Stations</h2>
          <p>Find direct trains between any two stations across India</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-row">
            {/* From Station Input Wrapper */}
            <div className="input-group-wrapper">
              <div className="input-group">
                <CircleDot className="input-icon text-emerald" />
                <input
                  type="text"
                  value={fromInput}
                  onChange={handleFromChange}
                  placeholder="From Station"
                  autoComplete="off"
                  required
                />
                {loadingFrom && <Loader2 className="input-icon spin-icon" size={16} />}
                {fromInput && !loadingFrom && (
                  <button type="button" onClick={() => { setFromInput(''); setFromSuggestions([]); }} className="clear-btn">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {fromSuggestions.length > 0 && (
                <div className="suggestions-dropdown shadow-glass">
                  {fromSuggestions.map((st, idx) => (
                    <div
                      key={st.code || idx}
                      className="suggestion-item"
                      onClick={() => selectFromStation(st)}
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

            {/* Swap Button */}
            <button type="button" onClick={swapStations} className="swap-btn" title="Swap From and To Stations">
              <Repeat size={18} />
            </button>

            {/* To Station Input Wrapper */}
            <div className="input-group-wrapper">
              <div className="input-group">
                <MapPin className="input-icon text-rose" />
                <input
                  type="text"
                  value={toInput}
                  onChange={handleToChange}
                  placeholder="To Station"
                  autoComplete="off"
                  required
                />
                {loadingTo && <Loader2 className="input-icon spin-icon" size={16} />}
                {toInput && !loadingTo && (
                  <button type="button" onClick={() => { setToInput(''); setToSuggestions([]); }} className="clear-btn">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {toSuggestions.length > 0 && (
                <div className="suggestions-dropdown shadow-glass">
                  {toSuggestions.map((st, idx) => (
                    <div
                      key={st.code || idx}
                      className="suggestion-item"
                      onClick={() => selectToStation(st)}
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
          </div>

          <button type="submit" className="primary-btn full-width mt-3">
            <span>Find Direct Trains</span>
            <Search size={18} />
          </button>
        </form>
      </div>

      {loading && (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>Searching Direct Express Routes...</p>
        </div>
      )}

      {error && <div className="alert-box alert-error">{error}</div>}

      {trainsList && !loading && (
        <div className="results-container">
          <div className="results-meta-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              Direct Trains Found ({trainsList.trains?.length || trainsList.count || 0})
            </span>
            <span className="badge badge-train-type">
              {trainsList.from?.name || extractStationCode(fromInput)} ➔ {trainsList.to?.name || extractStationCode(toInput)}
            </span>
          </div>

          <div className="trains-cards-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {trainsList.trains?.map((item, idx) => {
              const trainNumber = item.train?.number || item.number || '14320';
              const trainName = item.train?.name || item.name || 'Express Route';
              const trainType = item.train?.type || 'Express';
              const depTime = item.from?.departure || item.departure || '--:--';
              const arrTime = item.to?.arrival || item.arrival || '--:--';
              const durText = formatDuration(item.duration);
              const halts = item.totalHaltsBetween !== undefined ? item.totalHaltsBetween : (item.halts || 0);

              return (
                <div
                  key={idx}
                  className="hero-card shadow-glass"
                  style={{ padding: '22px', cursor: 'pointer', transition: 'border-color 0.2s ease' }}
                  onClick={() => handleTrainClick(trainNumber)}
                  title="Click to track live satellite location"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="badge badge-train-type">{trainNumber}</span>
                        <span className="pf-tag">{trainType}</span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>{trainName}</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{depTime}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Departure</div>
                      </div>

                      <div style={{ textAlign: 'center', color: 'var(--color-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{durText}</span>
                        </div>
                        <ArrowRight size={18} style={{ margin: '2px auto' }} />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <GitCommit size={12} style={{ display: 'inline', marginRight: '3px' }} />
                          {halts} Halts
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{arrTime}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arrival</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Running Days:</span>
                      {item.train?.runDays ? (
                        item.train.runDays.map((day, di) => (
                          <span key={di} style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', background: 'rgba(0,242,254,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            {day}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-success)' }}>Daily Run</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="primary-btn"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      onClick={(e) => { e.stopPropagation(); handleTrainClick(trainNumber); }}
                    >
                      <Navigation2 size={14} />
                      <span>Track Live Location</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
