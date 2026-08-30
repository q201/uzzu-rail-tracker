import React from 'react';
import { TrainFront, Moon, Sun } from 'lucide-react';

export default function Header({ isDark, setIsDark }) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* App Logo & Custom Brand */}
        <div className="brand-box">
          <div className="logo-icon">
            <TrainFront size={26} />
          </div>
          <div className="brand-text">
            <h1 className="brand-name">
              Uzzu <span className="brand-accent">Rail Tracker</span>
            </h1>
            <span className="brand-badge">
              <span className="pulse-dot"></span> LIVE TELEMETRY
            </span>
          </div>
        </div>

        {/* Theme Control */}
        <div className="header-controls">
          <button
            className="icon-btn"
            onClick={() => setIsDark(!isDark)}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="btn-label">{isDark ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
