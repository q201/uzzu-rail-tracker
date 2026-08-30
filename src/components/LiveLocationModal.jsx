import React, { useState, useEffect } from 'react';
import { X, Navigation2, Clock, MapPin, Layers, TrainFront, GitCommit, ArrowRight, Loader2 } from 'lucide-react';
import { fetchLiveTrainStatus } from '../api/railRadar';
import LiveTrainSpriteTracker from './LiveTrainSpriteTracker';

export default function LiveLocationModal({ trainNumber, isOpen, onClose, onOpenFullTracker }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    if (isOpen && trainNumber) {
      setLoading(true);
      setError(null);
      fetchLiveTrainStatus(trainNumber)
        .then(res => {
          if (res && res.success && res.data) {
            setTelemetry(res.data);
          } else {
            throw new Error(res?.error?.message || 'Live telemetry unavailable for this train.');
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to fetch live train location.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, trainNumber]);

  if (!isOpen || !trainNumber) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card shadow-glass" style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-train-type">{trainNumber}</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {telemetry?.trainName || `Train #${trainNumber}`}
            </h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {loading && (
          <div className="loader-box">
            <div className="spinner"></div>
            <p>Fetching Live Location & Satellite Telemetry...</p>
          </div>
        )}

        {error && <div className="alert-box alert-error">{error}</div>}

        {telemetry && !loading && (
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Status & Speed Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' }}>
              <div>
                <div className="sub-info" style={{ marginTop: 0 }}>Current Location</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  <MapPin size={18} style={{ display: 'inline', marginRight: '6px' }} />
                  {telemetry.currentLocation?.stationName || 'En-route'} ({telemetry.currentLocation?.stationCode || 'LOC'})
                </div>
              </div>

              <div className={`hero-status-pill ${telemetry.delayMinutes > 0 ? 'delayed' : 'ontime'}`}>
                <Clock size={16} />
                <span>{telemetry.delayMinutes > 0 ? `Late ${telemetry.delayMinutes} Mins` : 'On Time'}</span>
              </div>
            </div>

            {/* Standard Stations List & Train Sprite Live Tracking */}
            <LiveTrainSpriteTracker telemetry={telemetry} haltsOnly={false} />

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="secondary-btn" onClick={onClose}>Close</button>
              <button className="primary-btn" onClick={() => { onClose(); onOpenFullTracker(trainNumber); }}>
                <span>Open Full Live Tracker</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
