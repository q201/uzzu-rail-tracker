import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import TrainTracker from './components/TrainTracker';
import PNREnquiry from './components/PNREnquiry';
import StationBoard from './components/StationBoard';
import TrainsBetween from './components/TrainsBetween';
import SeatAndFare from './components/SeatAndFare';
import SuburbanLocal from './components/SuburbanLocal';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('between'); // Default to Trains Between as FIRST tab
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default to Light Mode
  const [selectedTrainNum, setSelectedTrainNum] = useState('');

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  const handleSelectTrainToTrack = (trainNum) => {
    setSelectedTrainNum(trainNum);
    setActiveTab('train');
  };

  return (
    <div className="app-wrapper">
      <Header
        isDark={isDarkTheme}
        setIsDark={setIsDarkTheme}
      />

      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'between' && <TrainsBetween onSelectTrainToTrack={handleSelectTrainToTrack} />}
        {activeTab === 'train' && <TrainTracker initialTrainNum={selectedTrainNum} />}
        {activeTab === 'station' && <StationBoard onSelectTrainToTrack={handleSelectTrainToTrack} />}
        {activeTab === 'pnr' && <PNREnquiry />}
        {activeTab === 'fare' && <SeatAndFare />}
        {activeTab === 'suburban' && <SuburbanLocal />}
      </main>

      <Footer />
    </div>
  );
}
