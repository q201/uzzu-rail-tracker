import React, { useState, useEffect } from 'react';
import { X, Key, Check, Info } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../api/railRadar';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><Key size={20} /> API Key Configuration</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Configure your active API secret key to connect directly to live Indian Railways telemetry servers.
          </p>

          <form onSubmit={handleSave} style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block' }}>Production API Key</label>
            <div className="key-input-wrapper">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="rg_..."
                required
              />
              <button type="submit" className="secondary-btn">Save Key</button>
            </div>
            {savedMsg && <span className="key-status-msg"><Check size={14} style={{ display: 'inline', marginRight: '4px' }} /> API Key Saved Successfully!</span>}
          </form>

          <div className="info-box">
            <Info size={18} style={{ flexShrink: 0 }} />
            <span>Key is securely encrypted and stored locally in your browser's application storage.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
