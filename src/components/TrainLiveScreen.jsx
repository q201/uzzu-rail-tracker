import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Clock, MapPin, Navigation2, Layers, Calendar, TrainFront, GitCommit, AlertCircle } from 'lucide-react';
import { fetchLiveTrainStatus } from '../api/railRadar';
import LiveTrainSpriteTracker from './LiveTrainSpriteTracker';

export default function TrainLiveScreen({ trainNumber, onBack }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [haltsOnly, setHaltsOnly] = useState(false);

  const loadStatus = useCallback(async (isRefresh = false) => {
    if (!trainNumber) return;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetchLiveTrainStatus(trainNumber);
      if (res && res.success && res.data) {
        setTelemetry(res.data);
      } else {
        throw new Error(res?.error?.message || 'Live telemetry unavailable for this train right now.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch live train location.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [trainNumber]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const coachList = telemetry?.coachPosition
    ? telemetry.coachPosition.split('-')
    : ['ENG', 'LPR', 'E1', 'E2', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'LPR'];

  return (
    <div className="tab-pane active live-screen-view">
      {/* Top Navigation Bar */}
      <div className="live-screen-nav shadow-glass">
        <button
          type="button"
          className="back-nav-btn"
          onClick={onBack}
          aria-label="Back to search results"
        >
          <ArrowLeft size={18} />
          <span>Back to Search Results</span>
        </button>

        <div className="nav-train-meta">
          <span className="badge badge-train-type">{trainNumber}</span>
          {telemetry?.trainName && (
            <span className="nav-train-title" title={telemetry.trainName}>
              {telemetry.trainName}
            </span>
          )}
        </div>

        <button
          type="button"
          className={`secondary-btn refresh-nav-btn ${refreshing ? 'spinning' : ''}`}
          onClick={() => loadStatus(true)}
          disabled={loading || refreshing}
          title="Refresh live status"
        >
          <RefreshCw size={15} className={refreshing ? 'spin-icon' : ''} />
          <span className="refresh-text">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loader-box my-4">
          <div className="spinner"></div>
          <p>Connecting to Indian Railways Satellite Telemetry...</p>
          <span className="sub-info">Tracking Train #{trainNumber} in real time</span>
        </div>
      )}

      {/* Error Alert */}
      {error && !loading && (
        <div className="alert-box alert-error my-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertCircle size={18} />
            <strong>Unable to Load Live Telemetry</strong>
          </div>
          <p>{error}</p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
            <button className="primary-btn" onClick={() => loadStatus(false)}>Try Again</button>
            <button className="secondary-btn" onClick={onBack}>Back to Results</button>
          </div>
        </div>
      )}

      {/* Live Tracking Content */}
      {telemetry && !loading && (
        <div className="results-container mt-3">
          {/* Main Train Status Card */}
          <div className="hero-card shadow-glass">
            <div className="hero-header">
              <div className="hero-train-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-train-type">{telemetry.trainNumber || trainNumber}</span>
                  <span className="pf-tag">{telemetry.trainType || 'Express'}</span>
                </div>
                <h1 className="hero-title">{telemetry.trainName || `Train #${trainNumber}`}</h1>
                <div className="sub-info">
                  {telemetry.stops?.[0]?.stationName || telemetry.sourceStation || 'Source'} ➔{' '}
                  {telemetry.stops?.[telemetry.stops.length - 1]?.stationName || telemetry.destStation || 'Destination'}
                </div>
              </div>

              <div className={`hero-status-pill ${telemetry.delayMinutes > 0 ? 'delayed' : 'ontime'}`}>
                <Clock size={16} />
                <span>
                  {telemetry.delayMinutes > 0 ? `Late by ${telemetry.delayMinutes} Mins` : 'Running On Time'}
                </span>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div className="telemetry-grid">
              <div className="tele-item">
                <span className="tele-label"><MapPin size={14} /> Current Station</span>
                <span className="tele-val highlight">
                  {telemetry.currentLocation?.stationName || 'En-route'}
                  {telemetry.currentLocation?.stationCode ? ` (${telemetry.currentLocation.stationCode})` : ''}
                </span>
              </div>
              <div className="tele-item">
                <span className="tele-label"><Navigation2 size={14} /> Live Speed</span>
                <span className="tele-val">
                  {telemetry.currentLocation?.speedKmph || 82} km/h
                </span>
              </div>
              <div className="tele-item">
                <span className="tele-label"><Layers size={14} /> Expected Platform</span>
                <span className="tele-val">
                  Platform #{telemetry.currentLocation?.platform || 1}
                </span>
              </div>
              <div className="tele-item">
                <span className="tele-label"><Calendar size={14} /> Service Status</span>
                <span className="tele-val">Active Journey</span>
              </div>
            </div>

            {/* Coach Composition */}
            <div className="coach-section">
              <div className="coach-label">
                <TrainFront size={15} /> Coach Composition:
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

          {/* Sequential Route Timeline with Sprite */}
          <div className="timeline-card shadow-glass mt-4">
            <div className="timeline-header">
              <h3><GitCommit size={18} /> Live Satellite Route Tracker</h3>
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

            <LiveTrainSpriteTracker telemetry={telemetry} haltsOnly={haltsOnly} />
          </div>
        </div>
      )}
    </div>
  );
}

