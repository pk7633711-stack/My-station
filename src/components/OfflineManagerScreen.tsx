import React, { useState, useEffect } from 'react';
import { Language, Train, Station, PNRDetails } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_TRAINS, ALL_STATIONS, SAMPLE_PNRS } from '../data/railwayData';
import {
  getDownloadedTrains,
  getDownloadedStations,
  getDownloadedPnrs,
  isTrainDownloaded,
  isStationDownloaded,
  isPnrDownloaded,
  downloadTrain,
  removeDownloadedTrain,
  downloadStation,
  removeDownloadedStation,
  savePnrOffline,
  removeDownloadedPnr,
  getStorageStats,
  downloadCompleteOfflinePack,
  clearAllOfflineData,
  StorageStats,
} from '../utils/offlineStorage';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { TabType } from './BottomNav';
import {
  HardDriveDownload,
  WifiOff,
  Wifi,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Zap,
  ArrowRight,
  TrainTrack,
  Building2,
  Ticket,
  Calculator,
  Download,
  Smartphone,
  Info,
  ShieldCheck,
  AlertCircle,
  Database,
} from 'lucide-react';

interface OfflineManagerScreenProps {
  language: Language;
  isOnline: boolean;
  simulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const OfflineManagerScreen: React.FC<OfflineManagerScreenProps> = ({
  language,
  isOnline,
  simulatedOffline,
  onToggleSimulatedOffline,
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'trains' | 'stations' | 'pnrs' | 'fares'>('trains');
  const [stats, setStats] = useState<StorageStats>(getStorageStats());
  const [downloadedTrains, setDownloadedTrains] = useState<Train[]>(getDownloadedTrains());
  const [downloadedStations, setDownloadedStations] = useState<Station[]>(getDownloadedStations());
  const [downloadedPnrs, setDownloadedPnrs] = useState<PNRDetails[]>(getDownloadedPnrs());
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);

  const refreshAllState = () => {
    setStats(getStorageStats());
    setDownloadedTrains(getDownloadedTrains());
    setDownloadedStations(getDownloadedStations());
    setDownloadedPnrs(getDownloadedPnrs());
  };

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2500);
  };

  const handleDownloadTrain = (train: Train) => {
    downloadTrain(train);
    refreshAllState();
    showNotification(language === 'hi' ? `${train.number} ऑफ़लाइन सहेजा गया!` : `Train ${train.number} downloaded for offline!`);
  };

  const handleRemoveTrain = (trainNumber: string) => {
    removeDownloadedTrain(trainNumber);
    refreshAllState();
    showNotification(language === 'hi' ? `${trainNumber} ऑफ़लाइन से हटाया गया` : `Train ${trainNumber} removed from offline`);
  };

  const handleDownloadStation = (station: Station) => {
    downloadStation(station);
    refreshAllState();
    showNotification(language === 'hi' ? `${station.code} ऑफ़लाइन सहेजा गया!` : `Station ${station.code} downloaded for offline!`);
  };

  const handleRemoveStation = (stationCode: string) => {
    removeDownloadedStation(stationCode);
    refreshAllState();
    showNotification(language === 'hi' ? `${stationCode} ऑफ़लाइन से हटाया गया` : `Station ${stationCode} removed from offline`);
  };

  const handleRemovePnr = (pnrNumber: string) => {
    removeDownloadedPnr(pnrNumber);
    refreshAllState();
    showNotification(language === 'hi' ? `पीएनआर ${pnrNumber} हटाया गया` : `PNR ${pnrNumber} removed`);
  };

  const handleDownloadAllPack = () => {
    downloadCompleteOfflinePack();
    refreshAllState();
    showNotification(language === 'hi' ? 'संपूर्ण ऑफ़लाइन ट्रैवल पैक डाउनलोड हो गया!' : 'Complete Offline Travel Pack Downloaded!');
  };

  const handleClearCache = () => {
    if (window.confirm(language === 'hi' ? 'क्या आप सभी ऑफ़लाइन डेटा साफ़ करना चाहते हैं?' : 'Are you sure you want to clear all offline cached data?')) {
      clearAllOfflineData();
      refreshAllState();
      showNotification(language === 'hi' ? 'सभी ऑफ़लाइन कैश साफ़ कर दिया गया' : 'Offline cache cleared');
    }
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
            <HardDriveDownload className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {language === 'hi' ? 'ऑफ़लाइन मोड व डाउनलोड प्रबंधक' : 'Offline Mode & Download Manager'}
            </h1>
            <p className="text-[11px] text-slate-500">
              {language === 'hi'
                ? 'ट्रेन समय-सारिणी, स्टेशन व पीएनआर बिना इंटरनेट के उपयोग हेतु सहेजें'
                : 'Manage downloaded schedules, station data, travel cost & offline PNRs'}
            </p>
          </div>
        </div>

        {/* Network Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
            isOnline
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'ऑनलाइन' : 'Online'}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{language === 'hi' ? 'ऑफ़लाइन मोड' : 'Offline Mode'}</span>
            </>
          )}
        </div>
      </div>

      {/* Simulated In-Train No-Network Toggle */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <TrainTrack className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {language === 'hi' ? 'ट्रेन में यात्रा सिम्युलेटर (नो-सिग्नल मोड)' : 'Simulate In-Train Journey (No Network)'}
            </h3>
            <p className="text-[10px] text-slate-600">
              {language === 'hi'
                ? 'टनल या रिमोट ट्रैक पर ऑफ़लाइन अनुभव का परीक्षण करें'
                : 'Test how the app works inside trains with zero cellular coverage'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleSimulatedOffline}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition cursor-pointer shadow-sm ${
            simulatedOffline
              ? 'bg-amber-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          {simulatedOffline ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active</span>
            </span>
          ) : (
            <span>Simulate</span>
          )}
        </button>
      </div>

      {/* Storage Overview & Meter Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c4a34] via-[#093d2b] to-[#06241a] text-white shadow-md space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लोकल डिवाइस स्टोरेज' : 'Local Device Storage'}</span>
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">
              {stats.totalEstimatedKb} KB / <span className="text-xs text-emerald-200 font-normal">Offline Cache</span>
            </h2>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-900/60 px-2 py-1 rounded-lg border border-emerald-700">
            {language === 'hi' ? 'अंतिम सिंक:' : 'Synced:'} {stats.lastSyncTime}
          </span>
        </div>

        {/* Breakdown counters */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-emerald-800/60 text-center text-xs">
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[10px] text-emerald-200 block">{language === 'hi' ? 'ट्रेनें' : 'Trains'}</span>
            <span className="font-extrabold text-base text-amber-300 font-mono">{stats.trainCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[10px] text-emerald-200 block">{language === 'hi' ? 'स्टेशन' : 'Stations'}</span>
            <span className="font-extrabold text-base text-amber-300 font-mono">{stats.stationCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[10px] text-emerald-200 block">{language === 'hi' ? 'पीएनआर' : 'PNRs'}</span>
            <span className="font-extrabold text-base text-amber-300 font-mono">{stats.pnrCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[10px] text-emerald-200 block">{language === 'hi' ? 'किराया' : 'Fare Cost'}</span>
            <span className="font-extrabold text-base text-emerald-300">100%</span>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleDownloadAllPack}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'hi' ? '1-क्लिक पूर्ण ऑफ़लाइन पैक' : 'Download Complete Travel Pack'}</span>
          </button>
          <button
            onClick={handleClearCache}
            className="p-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/60 transition cursor-pointer"
            title="Clear Cache"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Notice Toast */}
      {actionNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold text-center animate-fade-in shadow-md">
          {actionNotice}
        </div>
      )}

      {/* In-App PWA Install Banner */}
      {!isInstalled && (isInstallable || isIOS) && (
        <div className="p-3.5 rounded-2xl bg-white border border-emerald-300 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {language === 'hi' ? 'माई स्टेशन ऐप इंस्टॉल करें (PWA)' : 'Install MY STATION App (PWA)'}
              </h4>
              <p className="text-[10px] text-slate-500">
                {language === 'hi' ? 'ट्रेनों में बिना नेटवर्क स्टैंडअलोन चलाएं' : 'Home screen install for true zero-network offline running'}
              </p>
            </div>
          </div>

          {isInstallable && (
            <button
              onClick={install}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 shadow-sm cursor-pointer"
            >
              {language === 'hi' ? 'इंस्टॉल' : 'Install'}
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs shrink-0 hover:bg-slate-50 cursor-pointer"
            >
              iOS Guide
            </button>
          )}
        </div>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Install on iPhone / iPad</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Tap the <strong>Share</strong> icon in the Safari navigation bar.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('trains')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'trains' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <TrainTrack className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'ट्रेनें' : 'Trains'} ({downloadedTrains.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('stations')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'stations' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'स्टेशन' : 'Stations'} ({downloadedStations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pnrs')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'pnrs' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'पीएनआर' : 'PNRs'} ({downloadedPnrs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('fares')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'fares' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'किराया' : 'Travel Cost'}</span>
        </button>
      </div>

      {/* Content for TAB 1: Trains */}
      {activeTab === 'trains' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>{ALL_TRAINS.length} {language === 'hi' ? 'ट्रेनें उपलब्ध' : 'Available Train Schedules'}</span>
            <span className="text-emerald-700">{downloadedTrains.length} {language === 'hi' ? 'ऑफ़लाइन सहेजे गए' : 'cached'}</span>
          </div>

          {ALL_TRAINS.map((tr) => {
            const isDownloaded = isTrainDownloaded(tr.number);

            return (
              <div
                key={tr.number}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                      {tr.number}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {tr.type}
                    </span>
                    {isDownloaded && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Offline Ready
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1">
                    {language === 'hi' ? tr.nameHi : tr.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {tr.sourceStationCode} → {tr.destinationStationCode} • {tr.stops.length} halts • {tr.totalDistanceKm} km
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onNavigate('live-status', { trainNumber: tr.number })}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    title="View Timetable"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {isDownloaded ? (
                    <button
                      onClick={() => handleRemoveTrain(tr.number)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition cursor-pointer"
                      title="Remove from offline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownloadTrain(tr)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer"
                      title="Download for offline access"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'सहेजें' : 'Save'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content for TAB 2: Stations */}
      {activeTab === 'stations' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>{ALL_STATIONS.length} {language === 'hi' ? 'स्टेशन उपलब्ध' : 'Stations Available'}</span>
            <span className="text-emerald-700">{downloadedStations.length} {language === 'hi' ? 'ऑफ़लाइन सहेजे गए' : 'cached'}</span>
          </div>

          {ALL_STATIONS.map((st) => {
            const isDownloaded = isStationDownloaded(st.code);

            return (
              <div
                key={st.code}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                      {st.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {st.category} • {st.platforms} Platforms
                    </span>
                    {isDownloaded && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Offline
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1">
                    {language === 'hi' ? st.nameHi : st.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {st.city}, {st.state} • {st.zone}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onNavigate('station-info', { stationCode: st.code })}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    title="View Station Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {isDownloaded ? (
                    <button
                      onClick={() => handleRemoveStation(st.code)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition cursor-pointer"
                      title="Remove from offline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownloadStation(st)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'सहेजें' : 'Save'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content for TAB 3: Saved Offline PNRs */}
      {activeTab === 'pnrs' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>{language === 'hi' ? 'ट्रेन में टीटीई को दिखाने हेतु सुरक्षित पीएनआर' : 'Pocket Offline PNR for In-Train Verification'}</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              {language === 'hi'
                ? 'अपने बुक किए गए पीएनआर को यहां ऑफ़लाइन सहेजें ताकि नेटवर्क न होने पर भी कोच, बर्थ और पुष्टि स्थिति तुरंत उपलब्ध रहे।'
                : 'Save your booked PNR status locally to show coach/seat details anytime without network coverage.'}
            </p>
          </div>

          {downloadedPnrs.length > 0 ? (
            downloadedPnrs.map((pnr) => (
              <div
                key={pnr.pnrNumber}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      PNR: <span className="font-mono text-slate-900 font-extrabold">{pnr.pnrNumber}</span>
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                      {pnr.trainNumber} - {pnr.trainName}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleRemovePnr(pnr.pnrNumber)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete offline PNR"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-800">{pnr.fromStationCode} ➔ {pnr.toStationCode}</span>
                    <p className="text-[10px] text-slate-500">Class: {pnr.travelClass} • {pnr.dateOfJourney}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-emerald-800 text-xs px-2 py-0.5 rounded bg-emerald-100">
                      {pnr.passengers[0]?.currentStatus}
                    </span>
                    <p className="text-[10px] font-bold text-slate-800 mt-1">
                      {pnr.passengers[0]?.coach} / {pnr.passengers[0]?.berth} ({pnr.passengers[0]?.berthType})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{language === 'hi' ? 'ऑफ़लाइन उपलब्ध' : 'Verified Offline Copy'}</span>
                  </span>
                  <button
                    onClick={() => onNavigate('pnr', { pnr: pnr.pnrNumber })}
                    className="text-xs font-bold text-blue-700 hover:underline"
                  >
                    {language === 'hi' ? 'पूर्ण विवरण देखें' : 'View Full Details'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">
                {language === 'hi' ? 'कोई ऑफ़लाइन पीएनआर सहेजा नहीं गया' : 'No offline PNR tickets saved yet'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'पीएनआर स्क्रीन पर जाकर अपने टिकट को "ऑफ़लाइन सहेजें" पर टैप करें।' : 'Check any PNR on the PNR Status screen and tap "Save Offline".'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Content for TAB 4: Travel Cost & Fare Cache */}
      {activeTab === 'fares' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs text-slate-700">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calculator className="w-4 h-4 text-emerald-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              {language === 'hi' ? 'यात्रा लागत व किराया दरें (ऑफ़लाइन सुरक्षित)' : 'Travel Cost & Fare Rates Cached Offline'}
            </h3>
          </div>

          <p className="text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'भारतीय रेल का आधिकारिक किराया गणना सूत्र (दूरी किमी, 1A, 2A, 3A, SL, 2S, CC श्रेणियां, सुपरफास्ट सरचार्ज, आरक्षण शुल्क व 5% जीएसटी) आपके डिवाइस पर पूरी तरह ऑफ़लाइन काम करता है।'
              : 'All base rates per km, reservation charges, superfast surcharges, train type multipliers, and 5% GST calculations are pre-cached locally for 100% offline accuracy.'}
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span>First AC (1A) / EC:</span>
              <span className="font-bold text-slate-900">₹2.45 / km + ₹60 Res + 5% GST</span>
            </div>
            <div className="flex justify-between">
              <span>Third AC (3A) / CC:</span>
              <span className="font-bold text-slate-900">₹1.05 / km + ₹40 Res + 5% GST</span>
            </div>
            <div className="flex justify-between">
              <span>Sleeper Class (SL):</span>
              <span className="font-bold text-slate-900">₹0.38 / km + ₹20 Res (No GST)</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('fare-calculator')}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>{language === 'hi' ? 'किराया गणक खोलें (ऑफ़लाइन उपलब्ध)' : 'Open Fare Calculator (Works Offline)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
