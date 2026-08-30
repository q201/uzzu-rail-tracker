import React from 'react';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div>
          Uzzu Rail Tracker v1.0 • Live Indian Railways Telemetry
        </div>
        <div className="footer-telemetry">
          <span className="status-dot online"></span>
          <Activity size={14} />
          <span>Live API Engine Active</span>
        </div>
      </div>
    </footer>
  );
}
