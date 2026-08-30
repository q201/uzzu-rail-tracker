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

  return (
    <div className="live-sprite-tracker-card shadow-glass" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', margin: '20px 0' }}>
      
      {/* Top Banner: Where Is My Train Satellite Progress Bar */}
      <div style={{ marginBottom: '28px', background: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot"></span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              LIVE TRAIN LOCATION: {currentStop.stationName || telemetry.currentLocation?.stationName || 'En-route'}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="badge badge-train-type" style={{ margin: 0, fontSize: '0.8rem', padding: '4px 10px' }}>
              <Navigation2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {telemetry.currentLocation?.speedKmph || currentStop.speedToNextStationKmph || 88} km/h
            </span>
            <span className="pf-tag" style={{ background: 'rgba(0, 242, 254, 0.15)', color: 'var(--color-primary)', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
              Platform #{currentStop.platform || telemetry.currentLocation?.platform || 1}
            </span>
          </div>
        </div>

        {/* Rail Track Progress Bar with Animated Moving Train Sprite */}
        <div style={{ position: 'relative', height: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'visible', border: '1px solid var(--border-color)', margin: '18px 0 10px 0' }}>
          {/* Active Completed Railway Line */}
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-success), var(--color-primary))', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>

          {/* Animated Glowing Train Engine Sprite */}
          <div
            style={{
              position: 'absolute',
              top: '-13px',
              left: `calc(${progressPercent}% - 20px)`,
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #00C6FF, #00F2FE)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#090E1A',
              boxShadow: '0 0 20px #00F2FE, 0 0 35px rgba(0, 242, 254, 0.6)',
              zIndex: 10,
              transition: 'left 0.5s ease',
              animation: 'train-bounce 1.5s ease-in-out infinite'
            }}
            title={`Live Train Position: ${currentStop.stationName}`}
          >
            <TrainFront size={22} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          <span>Source: {stops[0]?.stationName} ({stops[0]?.stationCode})</span>
          <span>Station {currentIndex + 1} of {stops.length} ({progressPercent}%)</span>
          <span>Destination: {stops[stops.length - 1]?.stationName} ({stops[stops.length - 1]?.stationCode})</span>
        </div>
      </div>

      {/* Sequential Stations List Timeline (Where Is My Train Style) */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} style={{ color: 'var(--color-primary)' }} />
          Sequential Route Stations ({stops.length} Stations Listed)
        </h4>

        <div className="route-timeline" style={{ position: 'relative', paddingLeft: '32px' }}>
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
                style={{ paddingBottom: idx === stops.length - 1 ? '0' : '22px' }}
              >
                {/* Station Node Icon / Train Sprite Badge */}
                <div
                  className="node-dot"
                  style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '2px',
                    width: isCurrent ? '26px' : '18px',
                    height: isCurrent ? '26px' : '18px',
                    borderRadius: '50%',
                    background: isCurrent ? 'var(--color-primary)' : isDeparted ? 'var(--color-success)' : 'var(--bg-card)',
                    border: `3px solid ${isCurrent ? '#090E1A' : isDeparted ? 'var(--color-success)' : 'var(--text-dim)'}`,
                    boxShadow: isCurrent ? '0 0 18px var(--color-primary)' : 'none',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isDeparted && <CheckCircle2 size={12} color="#090E1A" />}
                  {isCurrent && <TrainFront size={14} color="#090E1A" />}
                </div>

                {/* Station Item Card */}
                <div
                  className="node-body"
                  style={{
                    background: isCurrent ? 'rgba(0, 242, 254, 0.12)' : 'var(--bg-card)',
                    border: `1px solid ${isCurrent ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                        {stop.sequence ? `${stop.sequence}. ` : `${idx + 1}. `}
                        {stop.stationName}
                      </span>
                      <span className="st-item-code">({stop.stationCode})</span>
                      {isCurrent && (
                        <span className="badge badge-train-type" style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'var(--color-primary)', color: '#090E1A', fontWeight: 800 }}>
                          TRAIN HERE
                        </span>
                      )}
                    </div>
                    
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {stop.distance !== undefined && <span>Distance: <strong>{stop.distance} km</strong></span>}
                      {stop.isHalt ? <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Station Halt</span> : <span>Passing Station</span>}
                    </div>
                  </div>

                  <div className="st-details" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="time-box" style={{ textAlign: 'right' }}>
                      <span className="time-sch" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Scheduled: {schDep}
                      </span>
                      <span className="time-act" style={{ fontWeight: 800, fontSize: '1rem', color: isDeparted ? 'var(--color-success)' : 'var(--text-main)' }}>
                        Actual: {actDep}
                      </span>
                    </div>

                    {delay > 0 && (
                      <span className="delay-tag late" style={{ fontSize: '0.78rem' }}>
                        +{delay}m Late
                      </span>
                    )}

                    <span className="pf-tag" style={{ fontSize: '0.8rem' }}>
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
