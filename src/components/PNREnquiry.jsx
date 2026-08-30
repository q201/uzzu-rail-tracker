import React, { useState } from 'react';
import { Ticket, CreditCard, ArrowRight, Sparkles, Users, X } from 'lucide-react';
import { fetchPNRStatus } from '../api/railRadar';

const SAMPLE_PNRS = [
  { pnr: '2819401928', label: '281-940-1928 (Confirmed)' },
  { pnr: '4521098234', label: '452-109-8234 (WL 12)' }
];

export default function PNREnquiry() {
  const [pnr, setPnr] = useState('2819401928');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pnrData, setPnrData] = useState(null);

  const handleSearch = async (numToSearch) => {
    const target = numToSearch || pnr;
    if (!target) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetchPNRStatus(target);
      if (res && res.success && res.data) {
        setPnrData(res.data);
      } else {
        throw new Error(res?.error?.message || 'Invalid or expired PNR number.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch PNR status.');
      setPnrData(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="tab-pane active">
      {/* Search Input Box */}
      <div className="search-card">
        <div className="search-title">
          <h2><Ticket /> Check 10-Digit PNR Status</h2>
          <p>Get real-time booking status, coach allotment, and confirmation odds</p>
        </div>

        <form onSubmit={onSubmit} className="search-form">
          <div className="input-group">
            <CreditCard className="input-icon" />
            <input
              type="text"
              value={pnr}
              onChange={(e) => setPnr(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter 10-digit PNR number"
              maxLength={10}
              inputMode="numeric"
              required
            />
            {pnr && (
              <button type="button" onClick={() => setPnr('')} className="clear-btn">
                <X size={16} />
              </button>
            )}
            <button type="submit" className="primary-btn">
              <span>Check PNR</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <div className="quick-chips">
          <span className="chips-label">Sample PNR Queries:</span>
          {SAMPLE_PNRS.map((item) => (
            <button
              key={item.pnr}
              className="chip"
              onClick={() => {
                setPnr(item.pnr);
                handleSearch(item.pnr);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>Querying IRCTC PNR Database...</p>
        </div>
      )}

      {error && <div className="alert-box alert-error">{error}</div>}

      {pnrData && !loading && (
        <div className="results-container">
          <div className="pnr-header-card">
            <div className="pnr-main-info">
              <div className="pnr-tag">PNR: <strong>{pnrData.pnr}</strong></div>
              <h2>{pnrData.trainNumber} - {pnrData.trainName}</h2>
              <p>{pnrData.fromStation} ➔ {pnrData.toStation} | Date: {pnrData.journeyDate} | Class: {pnrData.class}</p>
            </div>

            <div className="pnr-prediction-box">
              <div className="pred-title"><Sparkles size={14} /> Confirmation Odds</div>
              <div className="pred-percentage">{pnrData.confirmationProbability || 96}%</div>
              <div className="pred-badge high">HIGH CONFIRMATION</div>
            </div>
          </div>

          <div className="passengers-card">
            <h3><Users size={18} /> Passenger Details & Seat Allotment</h3>
            <div className="passengers-list">
              {pnrData.passengers?.map((pass, i) => (
                <div key={i} className="passenger-row">
                  <div className="pass-name">Passenger #{pass.passengerNo || i + 1}</div>
                  <div className="pass-status">
                    <div className="status-group">
                      <span className="status-lbl">Booking Status</span>
                      <span className="status-val">{pass.bookingStatus}</span>
                    </div>
                    <div className="status-group">
                      <span className="status-lbl">Current Status</span>
                      <span className="status-val cnf">{pass.currentStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
