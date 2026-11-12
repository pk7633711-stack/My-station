/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from './types/railway';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { PNRScreen } from './components/PNRScreen';
import { LiveTrainScreen } from './components/LiveTrainScreen';
import { TrainSearchScreen } from './components/TrainSearchScreen';
import { SeatAvailabilityScreen } from './components/SeatAvailabilityScreen';
import { RouteFinderScreen } from './components/RouteFinderScreen';
import { StationInfoScreen } from './components/StationInfoScreen';
import { TicketBookingScreen } from './components/TicketBookingScreen';
import { FareCalculatorScreen } from './components/FareCalculatorScreen';
import { RailwayUpdatesScreen } from './components/RailwayUpdatesScreen';
import { EmergencyHelpScreen } from './components/EmergencyHelpScreen';
import { OfflineManagerScreen } from './components/OfflineManagerScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { UserProfileModal } from './components/UserProfileModal';
import { FavouritesModal } from './components/FavouritesModal';
import { NearbyStationsModal } from './components/NearbyStationsModal';
import { AlertsModal } from './components/AlertsModal';
import { getRecentSearches, RecentSearch } from './utils/storage';
import { initializeOfflineDefaults } from './utils/offlineStorage';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Wifi, BatteryMedium, Signal, ChevronLeft, WifiOff, HardDriveDownload } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [navPayload, setNavPayload] = useState<any>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isNearbyOpen, setIsNearbyOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(false);

  // Real-time network and simulated offline status
  const { isOnline, simulatedOffline, toggleSimulatedOffline } = useOnlineStatus();

  useEffect(() => {
    // Seed initial offline defaults for first-time offline capability
    initializeOfflineDefaults();
    setRecentSearches(getRecentSearches());
  }, []);

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleNavigate = (tab: TabType, payload?: any) => {
    setCurrentTab(tab);
    setNavPayload(payload || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setCurrentTab('home');
    setNavPayload(null);
  };

  const handleSelectRecentSearch = (search: RecentSearch) => {
    if (search.type === 'pnr') {
      handleNavigate('pnr', { pnr: search.query });
    } else if (search.type === 'train') {
      handleNavigate('live-status', { trainNumber: search.query });
    } else if (search.type === 'route') {
      handleNavigate('route-finder');
    } else if (search.type === 'station') {
      handleNavigate('station-info', { stationCode: search.query });
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            language={language}
            onNavigate={handleNavigate}
            recentSearches={recentSearches}
            onSelectSearch={handleSelectRecentSearch}
            onOpenNearbyStations={() => setIsNearbyOpen(true)}
          />
        );
      case 'pnr':
        return (
          <PNRScreen
            language={language}
            initialPnr={navPayload?.pnr}
            isOnline={isOnline}
            onGoBack={handleGoHome}
          />
        );
      case 'live-status':
        return (
          <LiveTrainScreen
            language={language}
            initialTrainNumber={navPayload?.trainNumber}
            isOnline={isOnline}
            onGoBack={handleGoHome}
          />
        );
      case 'train-search':
        return (
          <TrainSearchScreen
            language={language}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'seat-availability':
        return (
          <SeatAvailabilityScreen
            language={language}
            initialFrom={navPayload?.from || 'NDLS'}
            initialTo={navPayload?.to || 'BSB'}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'route-finder':
        return (
          <RouteFinderScreen
            language={language}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'station-info':
        return (
          <StationInfoScreen
            language={language}
            initialStationCode={navPayload?.stationCode || 'NDLS'}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'ticket-booking':
        return (
          <TicketBookingScreen
            language={language}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'fare-calculator':
        return (
          <FareCalculatorScreen
            language={language}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'railway-updates':
        return (
          <RailwayUpdatesScreen
            language={language}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'emergency-help':
        return (
          <EmergencyHelpScreen
            language={language}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'offline-manager':
        return (
          <OfflineManagerScreen
            language={language}
            isOnline={isOnline}
            simulatedOffline={simulatedOffline}
            onToggleSimulatedOffline={toggleSimulatedOffline}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboardScreen
            language={language}
            onNavigate={handleNavigate}
            onGoBack={handleGoHome}
          />
        );
      default:
        return (
          <HomeScreen
            language={language}
            onNavigate={handleNavigate}
            recentSearches={recentSearches}
            onSelectSearch={handleSelectRecentSearch}
            onOpenNearbyStations={() => setIsNearbyOpen(true)}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-900 flex justify-center selection:bg-emerald-700 selection:text-white font-sans ${isMobileFrame ? 'p-2 sm:p-6' : ''}`}>
      {/* Device frame container: if isMobileFrame is active, wrap in sleek Android phone mockup */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-slate-50 ${
          isMobileFrame
            ? 'max-w-[420px] rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[10px] border-slate-950 overflow-hidden min-h-[820px] max-h-[92vh] relative ring-1 ring-slate-800'
            : 'max-w-4xl min-h-screen shadow-xl'
        }`}
      >
        {/* Android Top Status Bar (Only visible in mobile frame or mobile screen) */}
        {isMobileFrame && (
          <div className="bg-[#06241a] text-slate-200 px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-mono select-none z-50 shrink-0">
            <span className="font-bold">09:41</span>
            {/* Camera punch-hole simulation */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800"></div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Global App Header */}
        <Header
          language={language}
          onToggleLanguage={handleToggleLanguage}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenNotifications={() => setIsAlertsOpen(true)}
          onOpenEmergency={() => handleNavigate('emergency-help')}
          onOpenOfflineManager={() => handleNavigate('offline-manager')}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenFavourites={() => setIsFavouritesOpen(true)}
          onOpenAdmin={() => handleNavigate('admin-dashboard')}
          onGoHome={handleGoHome}
          isOnline={isOnline}
        />

        {/* Offline Notice Banner if disconnected */}
        {!isOnline && currentTab !== 'offline-manager' && (
          <div
            onClick={() => handleNavigate('offline-manager')}
            className="bg-amber-500 text-slate-950 px-3.5 py-1.5 text-xs font-bold flex items-center justify-between shadow-sm cursor-pointer hover:bg-amber-400 transition"
          >
            <div className="flex items-center gap-1.5 truncate">
              <WifiOff className="w-3.5 h-3.5 animate-pulse shrink-0" />
              <span className="truncate">
                {language === 'hi'
                  ? 'ऑफ़लाइन मोड सक्रिय • डाउनलोड किया डेटा उपयोग हो रहा है'
                  : 'Offline Mode Active • Using Downloaded Train & Station Data'}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase underline shrink-0 ml-2">
              {language === 'hi' ? 'प्रबंधित करें' : 'Manage'}
            </span>
          </div>
        )}

        {/* Back navigation pill if deep in a screen */}
        {currentTab !== 'home' && (
          <div className="bg-emerald-900/10 px-3 py-1.5 border-b border-emerald-900/10 flex items-center justify-between text-xs">
            <button
              onClick={handleGoHome}
              className="flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'मुख्य पृष्ठ पर वापस' : 'Back to Home'}</span>
            </button>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              MY STATION IR
            </span>
          </div>
        )}

        {/* Scrollable Main Body */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>

        {/* Android Native Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={handleNavigate}
          language={language}
        />

        {/* Android Bottom Home Gesture Pill when in phone mockup */}
        {isMobileFrame && (
          <div className="bg-[#0b3b2b] pb-2 flex justify-center shrink-0">
            <div className="w-28 h-1 rounded-full bg-emerald-700/80"></div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserProfileModal
        language={language}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNavigateToPnr={(pnr) => handleNavigate('pnr', { pnr })}
      />

      <FavouritesModal
        language={language}
        isOpen={isFavouritesOpen}
        onClose={() => setIsFavouritesOpen(false)}
        onSelectTrain={(num) => handleNavigate('live-status', { trainNumber: num })}
        onSelectStation={(code) => handleNavigate('station-info', { stationCode: code })}
      />

      <NearbyStationsModal
        language={language}
        isOpen={isNearbyOpen}
        onClose={() => setIsNearbyOpen(false)}
        onSelectStation={(code) => handleNavigate('station-info', { stationCode: code })}
      />

      <AlertsModal
        language={language}
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectTrain={(trainNumber) => handleNavigate('live-status', { trainNumber })}
      />
    </div>
  );
}
