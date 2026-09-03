import React from 'react';
import { TrainFront, CheckCircle2, Navigation2, MapPin } from 'lucide-react';

export default function LiveTrainSpriteTracker({ telemetry, haltsOnly }) {
  if (!telemetry) return null;

  // Extract stops from any possible API response wrapper property
  const rawStops = telemetry.stops || telemetry.stations || telemetry.route || telemetry.data?.stops || telemetry.data?.stations || [];

  if (!Array.isArray(rawStops) || rawStops.length === 0) {
    return (
      <div className="alert-box alert-error mt-3">
        No station route timeline available for this train run.
      </div>
    );
  }

  const stops = haltsOnly
    ? rawStops.filter(s => s.isHalt || s.status === 'at-station' || s.status === 'current' || (s.delayMinutes && s.delayMinutes > 0))
    : rawStops;

  // Find current live station index
  let currentIndex = stops.findIndex(s => s.status === 'at-station' || s.status === 'current');
  if (currentIndex === -1) {
    const lastDepartedIndex = stops.findLastIndex(s => s.status === 'departed');
    currentIndex = lastDepartedIndex >= 0 ? lastDepartedIndex : 0;
  }

  const currentStop = stops[currentIndex] || stops[0];
  const progressPercent = Math.min(100, Math.max(0, Math.round(((currentIndex + 0.5) / stops.length) * 100)));

  const formatTimeStr = (tVal) => {
    if (!tVal) return '--:--';
    if (typeof tVal === 'string' && tVal.includes('T')) {
      const parts = tVal.split('T')[1];
      return parts ? parts.substring(0, 5) : tVal;
    }
    return tVal;
  };

  const spriteLeftPercent = Math.max(5, Math.min(progressPercent, 95));

  return (
    <div className="live-sprite-tracker-card shadow-glass">
      
      {/* Top Banner: Where Is My Train Satellite Progress Bar */}
      <div className="sprite-top-banner">
        <div className="sprite-banner-header">
          <div className="live-location-badge">
            <span className="pulse-dot"></span>
            <span className="live-location-text">
              LIVE TRAIN LOCATION: {currentStop.stationName || telemetry.currentLocation?.stationName || 'En-route'}
            </span>
          </div>
          
          <div className="sprite-header-tags">
            <span className="badge badge-train-type">
              <Navigation2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {telemetry.currentLocation?.speedKmph || currentStop.speedToNextStationKmph || 88} km/h
            </span>
            <span className="pf-tag">
              Platform #{currentStop.platform || telemetry.currentLocation?.platform || 1}
            </span>
          </div>
        </div>

        {/* Rail Track Progress Bar with Animated Moving Train Sprite */}
        <div className="rail-progress-track">
          {/* Active Completed Railway Line */}
          <div
            className="rail-progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>

          {/* Animated Glowing Train Engine Sprite */}
          <div
            className="animated-train-sprite"
            style={{
              left: `${spriteLeftPercent}%`,
              transform: 'translateX(-50%)'
            }}
            title={`Live Train Position: ${currentStop.stationName}`}
          >
            <TrainFront size={20} />
          </div>
        </div>

        <div className="sprite-track-meta">
          <span><strong>From:</strong> {stops[0]?.stationName} ({stops[0]?.stationCode})</span>
          <span className="sprite-mid-step">Station {currentIndex + 1} of {stops.length} ({progressPercent}%)</span>
          <span><strong>To:</strong> {stops[stops.length - 1]?.stationName} ({stops[stops.length - 1]?.stationCode})</span>
        </div>
      </div>

      {/* Sequential Stations List Timeline (Where Is My Train Style) */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} style={{ color: 'var(--color-primary)' }} />
          Sequential Route Stations ({stops.length} Stations Listed)
        </h4>

        <div className="route-timeline">
          {stops.map((stop, idx) => {
            const isCurrent = idx === currentIndex;
            const isDeparted = idx < currentIndex;
            const schDep = formatTimeStr(stop.scheduledDeparture || stop.scheduledArrival);
            const actDep = formatTimeStr(stop.actualDeparture || stop.actualArrival || schDep);
            const delay = stop.delayDeparture !== undefined ? stop.delayDeparture : (stop.delayArrival || 0);

            return (
              <div
                key={idx}
                className={`timeline-node ${isCurrent ? 'current' : isDeparted ? 'departed' : 'upcoming'}`}
              >
                {/* Station Node Icon / Train Sprite Badge */}
                <div className={`node-dot ${isCurrent ? 'node-current' : isDeparted ? 'node-departed' : 'node-upcoming'}`}>
                  {isDeparted && <CheckCircle2 size={12} color="#090E1A" />}
                  {isCurrent && <TrainFront size={14} color="#090E1A" />}
                </div>

                {/* Station Item Card */}
                <div className={`node-body ${isCurrent ? 'node-body-current' : ''}`}>
                  <div className="st-info-col">
                    <div className="st-title-row">
                      <span className="st-name-text">
                        {stop.sequence ? `${stop.sequence}. ` : `${idx + 1}. `}
                        {stop.stationName}
                      </span>
                      <span className="st-item-code">({stop.stationCode})</span>
                      {isCurrent && (
                        <span className="badge badge-train-here">
                          TRAIN HERE
                        </span>
                      )}
                    </div>
                    
                    <div className="st-sub-meta">
                      {stop.distance !== undefined && <span>Distance: <strong>{stop.distance} km</strong></span>}
                      {stop.isHalt ? <span className="halt-badge">Station Halt</span> : <span className="passing-badge">Passing Station</span>}
                    </div>
                  </div>

                  <div className="st-details">
                    <div className="time-box">
                      <span className="time-sch">Sch: {schDep}</span>
                      <span className={`time-act ${isDeparted ? 'text-success' : ''}`}>Act: {actDep}</span>
                    </div>

                    {delay > 0 && (
                      <span className="delay-tag late">
                        +{delay}m Late
                      </span>
                    )}

                    <span className="pf-tag">
                      PF #{stop.platform || '1'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
