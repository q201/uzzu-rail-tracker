import React, { useState, useEffect } from 'react';
import { TramFront, MapPin, Clock } from 'lucide-react';
import { fetchSuburbanTrains } from '../api/railRadar';

const CITIES = ['MUMBAI', 'DELHI NCR', 'KOLKATA', 'CHENNAI'];

export default function SuburbanLocal() {
  const [selectedCity, setSelectedCity] = useState('MUMBAI');
  const [loading, setLoading] = useState(false);
  const [suburbanData, setSuburbanData] = useState(null);

  const loadCityData = async (city) => {
    setLoading(true);
    try {
      const res = await fetchSuburbanTrains(city);
      if (res && res.data) {
        setSuburbanData(res.data);
      }
    } catch (err) {
      console.warn('Suburban fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCityData('MUMBAI');
  }, []);

  return (
    <div className="tab-pane active">
      <div className="search-card">
        <div className="search-title">
          <h2><TramFront /> Suburban & Local Train Network</h2>
          <p>Real-time local train schedules, fast/slow line timetables, and platform numbers</p>
        </div>

        <div className="quick-chips">
          <span className="chips-label">Select Metro Region:</span>
          {CITIES.map((city) => (
            <button
              key={city}
              className={`chip ${selectedCity === city ? 'active' : ''}`}
              style={{
                borderColor: selectedCity === city ? 'var(--color-primary)' : 'var(--border-color)',
                color: selectedCity === city ? 'var(--color-primary)' : 'var(--text-main)'
              }}
              onClick={() => {
                setSelectedCity(city);
                loadCityData(city);
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>Fetching Suburban Network Live Feed...</p>
        </div>
      )}

      {suburbanData && !loading && (
        <div className="results-container">
          <div className="station-hero">
            <div>
              <h2>{suburbanData.city}</h2>
              <p>Live Suburban Local Train Board</p>
            </div>
            <div className="st-clock">
              <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
              13:22 IST
            </div>
          </div>

          <div className="station-table-wrapper shadow-glass">
            <table className="station-table">
              <thead>
                <tr>
                  <th>Train #</th>
                  <th>Route & Line Type</th>
                  <th>Departure Time</th>
                  <th>PF</th>
                </tr>
              </thead>
              <tbody>
                {suburbanData.locals?.map((local, i) => (
                  <tr key={i}>
                    <td><strong>{local.trainNo}</strong></td>
                    <td>{local.route}</td>
                    <td>{local.departure}</td>
                    <td>PF #{local.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
