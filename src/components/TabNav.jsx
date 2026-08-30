import React from 'react';
import { ArrowRightLeft, Navigation, Building2, Ticket, Armchair, TramFront } from 'lucide-react';

export default function TabNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'between', label: 'Trains Between', icon: ArrowRightLeft },
    { id: 'train', label: 'Live Train Tracker', icon: Navigation },
    { id: 'station', label: 'Station Live Board', icon: Building2 },
    { id: 'pnr', label: 'PNR Status & Odds', icon: Ticket },
    { id: 'fare', label: 'Seats & Fares', icon: Armchair },
    { id: 'suburban', label: 'Suburban Local', icon: TramFront }
  ];

  return (
    <nav className="nav-tabs-wrapper">
      <div className="nav-tabs">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
