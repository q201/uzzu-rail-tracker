import React, { useState } from 'react';
import { Armchair, Calculator, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { fetchSeatAvailability, fetchFareCalculator } from '../api/railRadar';

export default function SeatAndFare() {
  const [trainNum, setTrainNum] = useState('12952');
  const [fromCode, setFromCode] = useState('NDLS');
  const [toCode, setToCode] = useState('MMCT');
  const [trainClass, setTrainClass] = useState('3A');
  const [loading, setLoading] = useState(false);
  const [availData, setAvailData] = useState(null);
  const [fareData, setFareData] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const [availRes, fareRes] = await Promise.all([
        fetchSeatAvailability(trainNum, fromCode, toCode, null, trainClass),
        fetchFareCalculator(trainNum, fromCode, toCode)
      ]);

      if (availRes && availRes.data) setAvailData(availRes.data);
      if (fareRes && fareRes.data) setFareData(fareRes.data);
    } catch (err) {
      console.warn('Seat/Fare query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane active">
      <div className="search-card">
        <div className="search-title">
          <h2><Armchair /> Seat Availability Forecast & Fare Calculator</h2>
          <p>Check quota availability forecasts and exact IRCTC fare breakdowns</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="form-row">
            <div className="input-group">
              <input
                type="text"
                value={trainNum}
                onChange={(e) => setTrainNum(e.target.value)}
                placeholder="Train Number e.g. 12952"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value.toUpperCase())}
                placeholder="From Code e.g. NDLS"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                value={toCode}
                onChange={(e) => setToCode(e.target.value.toUpperCase())}
                placeholder="To Code e.g. MMCT"
                required
              />
            </div>
          </div>

          <div className="quick-chips" style={{ marginTop: '12px' }}>
            <span className="chips-label">Select Class:</span>
            {['1A', '2A', '3A', 'SL', 'CC', 'EC'].map((cls) => (
              <button
                key={cls}
                type="button"
                className={`chip ${trainClass === cls ? 'active' : ''}`}
                style={{
                  borderColor: trainClass === cls ? 'var(--color-primary)' : 'var(--border-color)',
                  color: trainClass === cls ? 'var(--color-primary)' : 'var(--text-main)'
                }}
                onClick={() => setTrainClass(cls)}
              >
                {cls}
              </button>
            ))}
          </div>

          <button type="submit" className="primary-btn full-width mt-3">
            <span>Check Availability & Fares</span>
            <Search size={18} />
          </button>
        </form>
      </div>

      {loading && (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>Calculating Availability & Fares...</p>
        </div>
      )}

      {availData && !loading && (
        <div className="results-container">
          <div className="hero-card shadow-glass">
            <div className="hero-header">
              <div>
                <span className="badge badge-train-type">Class: {trainClass}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Seat Availability Forecast</h3>
                <p className="sub-info">{fromCode} ➔ {toCode} | Train #{trainNum}</p>
              </div>

              <div className="hero-status-pill ontime">
                <CheckCircle2 size={18} />
                <span>{availData.status || 'AVAILABLE - 42'}</span>
              </div>
            </div>

            <div className="telemetry-grid" style={{ marginTop: '16px' }}>
              <div className="tele-item">
                <span className="tele-label">Confirmation Odds</span>
                <span className="tele-val highlight">{availData.probability || '98% High'}</span>
              </div>
              <div className="tele-item">
                <span className="tele-label">Base Ticket Price</span>
                <span className="tele-val">{availData.fare || '₹ 2,450'}</span>
              </div>
            </div>
          </div>

          {fareData && (
            <div className="timeline-card">
              <h3><Calculator size={18} /> Complete Class Fare Breakdown</h3>
              <div className="station-table-wrapper shadow-glass" style={{ marginTop: '14px' }}>
                <table className="station-table">
                  <thead>
                    <tr>
                      <th>Class Code</th>
                      <th>Base Fare</th>
                      <th>Total Fare (incl. GST & Catering)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fareData.fares?.map((f, i) => (
                      <tr key={i}>
                        <td><strong>{f.class}</strong></td>
                        <td>₹ {f.baseFare}</td>
                        <td><strong style={{ color: 'var(--color-primary)' }}>₹ {f.totalFare}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
