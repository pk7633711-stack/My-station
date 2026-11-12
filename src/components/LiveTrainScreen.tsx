import React, { useState, useEffect } from 'react';
import { Language, Train } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_TRAINS } from '../data/railwayData';
import { addRecentSearch } from '../utils/storage';
import {
  downloadTrain,
  isTrainDownloaded,
  removeDownloadedTrain,
} from '../utils/offlineStorage';
import {
  Radio,
  Search,
  RefreshCw,
  Clock,
  Compass,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Utensils,
  Share2,
  Calendar,
  Download,
  HardDriveDownload,
  Check,
} from 'lucide-react';

interface LiveTrainScreenProps {
  language: Language;
  initialTrainNumber?: string;
  isOnline?: boolean;
  onGoBack: () => void;
}

export const LiveTrainScreen: React.FC<LiveTrainScreenProps> = ({
  language,
  initialTrainNumber,
  isOnline = true,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState(initialTrainNumber || '22436');
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('Just now');
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  useEffect(() => {
    const defaultTrain = ALL_TRAINS.find(tr => tr.number === (initialTrainNumber || '22436')) || ALL_TRAINS[0];
    setSelectedTrain(defaultTrain);
    if (defaultTrain) {
      setIsDownloaded(isTrainDownloaded(defaultTrain.number));
    }
  }, [initialTrainNumber]);

  const handleSelectTrain = (tr: Train) => {
    setSelectedTrain(tr);
    setSearchQuery(tr.number);
    setIsDownloaded(isTrainDownloaded(tr.number));
    addRecentSearch({
      type: 'train',
      query: tr.number,
      title: `${tr.number} - ${tr.name}`,
    });
  };

  const handleToggleDownload = () => {
    if (!selectedTrain) return;
    if (isDownloaded) {
      removeDownloadedTrain(selectedTrain.number);
      setIsDownloaded(false);
    } else {
      downloadTrain(selectedTrain);
      setIsDownloaded(true);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const match = ALL_TRAINS.find(
      tr => tr.number === query || tr.name.toLowerCase().includes(query) || tr.nameHi.includes(query)
    );
    if (match) {
      handleSelectTrain(match);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-2xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
            <Radio className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {t('liveStatus')}
            </h1>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'रीयल-टाइम जीपीएस लोकेशन, गति व प्लेटफार्म' : 'Real-time GPS spot, speed, delay & platform'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          <span>{isRefreshing ? (language === 'hi' ? 'ताज़ा हो रहा...' : 'Refreshing...') : (language === 'hi' ? 'ताज़ा करें' : 'Refresh')}</span>
        </button>
      </div>

      {/* Train Search & Quick Select Chips */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchTrainPlaceholder')}
            className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-slate-900 placeholder-slate-400"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
          >
            {language === 'hi' ? 'खोजें' : 'Search'}
          </button>
        </form>

        {/* Quick Popular Trains */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px] scrollbar-none">
          <span className="text-slate-400 font-semibold shrink-0">
            {language === 'hi' ? 'लोकप्रिय:' : 'Popular:'}
          </span>
          {ALL_TRAINS.map((tr) => (
            <button
              key={tr.number}
              onClick={() => handleSelectTrain(tr)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer border ${
                selectedTrain?.number === tr.number
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
              }`}
            >
              {tr.number} {tr.type.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {selectedTrain && (
        <div className="space-y-3 animate-fade-in">
          {/* Main Train Info Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c4a34] via-[#093d2b] to-[#06241a] text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-xs">
                    {selectedTrain.number}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wide">
                    {selectedTrain.type}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
                  {language === 'hi' ? selectedTrain.nameHi : selectedTrain.name}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleToggleDownload}
                  className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                    isDownloaded
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                  title={isDownloaded ? 'Downloaded for offline' : 'Download train schedule'}
                >
                  {isDownloaded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Download className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">
                    {isDownloaded ? (language === 'hi' ? 'सहेजा गया' : 'Saved') : (language === 'hi' ? 'ऑफ़लाइन' : 'Save')}
                  </span>
                </button>

                {selectedTrain.pantryAvailable && (
                  <div className="flex items-center gap-1 text-[10px] bg-emerald-900/80 px-2 py-1.5 rounded-xl border border-emerald-700 text-emerald-200">
                    <Utensils className="w-3 h-3 text-amber-300" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'पैंट्री कार' : 'Pantry'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Offline notice if device is disconnected */}
            {!isOnline && (
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-100 flex items-center gap-2 text-xs">
                <HardDriveDownload className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-[11px] leading-tight">
                  {language === 'hi'
                    ? 'ऑफ़लाइन समय सारणी सक्रिय • सभी स्टेशन, प्लेटफार्म व ठहराव समय उपलब्ध (इंटरनेट पर लाइव जीपीएस पुनः शुरू होगा)।'
                    : 'Offline Timetable Mode • All halts, timings & platform numbers active from local storage.'}
                </span>
              </div>
            )}

            {/* From - To route summary */}
            <div className="flex items-center justify-between text-xs py-2 px-3 bg-white/10 rounded-xl">
              <div>
                <span className="font-mono font-extrabold text-sm text-white">
                  {selectedTrain.sourceStationCode}
                </span>
                <p className="text-[10px] text-emerald-200">
                  {selectedTrain.stops[0]?.departureTime} Dep
                </p>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-amber-300 font-bold">
                  {selectedTrain.durationHours} • {selectedTrain.totalDistanceKm} km
                </span>
                <div className="w-24 h-0.5 bg-emerald-400/40 relative my-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400 absolute left-1/2 -top-[3px] -translate-x-1/2"></div>
                </div>
                <span className="text-[10px] text-emerald-200">
                  Avg {selectedTrain.speedKmph} km/h
                </span>
              </div>

              <div className="text-right">
                <span className="font-mono font-extrabold text-sm text-white">
                  {selectedTrain.destinationStationCode}
                </span>
                <p className="text-[10px] text-emerald-200">
                  {selectedTrain.stops[selectedTrain.stops.length - 1]?.arrivalTime} Arr
                </p>
              </div>
            </div>

            {/* Live GPS / Location Banner */}
            {selectedTrain.currentLocationInfo ? (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-100 flex items-start gap-2.5">
                <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-spin-slow" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-300">
                    {language === 'hi' ? selectedTrain.currentLocationInfo.statusTextHi : selectedTrain.currentLocationInfo.statusText}
                  </div>
                  <div className="text-[10px] text-emerald-200 flex items-center gap-2">
                    <span>{language === 'hi' ? 'अपडेट:' : 'Updated:'} {selectedTrain.currentLocationInfo.updatedAt}</span>
                    <span>•</span>
                    <span className="text-emerald-300 font-semibold">
                      {selectedTrain.currentLocationInfo.delayMinutes === 0
                        ? (language === 'hi' ? 'समय पर' : 'Right On Time')
                        : `${selectedTrain.currentLocationInfo.delayMinutes} ${language === 'hi' ? 'मिनट विलंब' : 'mins late'}`}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-emerald-200">
                {language === 'hi' ? 'ट्रेन अपने प्रारंभिक स्टेशन से समय पर प्रस्थान करेगी।' : 'Train is scheduled to depart on time from source station.'}
              </div>
            )}

            {/* Running Days */}
            <div className="flex items-center gap-1.5 text-[10px] pt-1 border-t border-emerald-900/60">
              <Calendar className="w-3 h-3 text-emerald-300" />
              <span className="text-emerald-300">{language === 'hi' ? 'चलने के दिन:' : 'Runs On:'}</span>
              <div className="flex gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const runs = selectedTrain.runsOnDays.includes(day);
                  return (
                    <span
                      key={day}
                      className={`px-1 rounded text-[9px] font-bold ${
                        runs ? 'bg-emerald-600 text-white' : 'bg-emerald-950 text-emerald-700'
                      }`}
                    >
                      {day[0]}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Intermediate Stations Route Timeline */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-tight text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'hi' ? 'मार्ग व ठहराव विवरण' : 'Route & Station Halts'}</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedTrain.stops.length} {language === 'hi' ? 'स्टेशन' : 'Stops'}
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {selectedTrain.stops.map((stop, idx) => {
                const isPassed = stop.status === 'passed';
                const isCurrent = stop.status === 'current';
                const isUpcoming = stop.status === 'upcoming' || !stop.status;

                return (
                  <div key={stop.stationCode} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCurrent
                          ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-100 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-600 border-emerald-700'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {isPassed && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </div>

                    {/* Station Content Card */}
                    <div
                      className={`p-2.5 rounded-xl border transition ${
                        isCurrent
                          ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                          : isPassed
                          ? 'bg-slate-50/50 border-slate-200/70 text-slate-600'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {language === 'hi' ? stop.stationNameHi : stop.stationName}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {stop.stationCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {stop.distanceKm} km • Day {stop.day} • {stop.haltMinutes > 0 ? `${stop.haltMinutes} min halt` : 'No halt'}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-extrabold font-mono text-slate-800">
                            PF {stop.platform || '-'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {stop.arrivalTime === 'Source' ? `Dep: ${stop.departureTime}` : stop.departureTime === 'Destination' ? `Arr: ${stop.arrivalTime}` : `Arr: ${stop.arrivalTime} | Dep: ${stop.departureTime}`}
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      {isCurrent && (
                        <div className="mt-1.5 pt-1.5 border-t border-amber-200 flex items-center justify-between text-[10px] text-amber-900 font-bold">
                          <span>{language === 'hi' ? 'वर्तमान में यहाँ / निकट' : 'Currently Here / Approaching'}</span>
                          <span>PF #{stop.platform}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
