import React, { useState } from 'react';
import { Language, Train } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_STATIONS, ALL_TRAINS } from '../data/railwayData';
import { TabType } from './BottomNav';
import {
  Route,
  ArrowRightLeft,
  Search,
  Zap,
  Clock,
  Compass,
  ChevronRight,
  TrendingUp,
  MapPin,
  TrainTrack,
  Info,
} from 'lucide-react';

interface RouteFinderScreenProps {
  language: Language;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const RouteFinderScreen: React.FC<RouteFinderScreenProps> = ({
  language,
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [sourceCode, setSourceCode] = useState('NDLS');
  const [destCode, setDestCode] = useState('BSB');
  const [isSearching, setIsSearching] = useState(false);

  const handleSwap = () => {
    const temp = sourceCode;
    setSourceCode(destCode);
    setDestCode(temp);
  };

  // Find trains between these stations
  const matchingTrains = ALL_TRAINS.filter(tr => {
    const sIdx = tr.stops.findIndex(s => s.stationCode === sourceCode);
    const dIdx = tr.stops.findIndex(s => s.stationCode === destCode);
    return (sIdx !== -1 && dIdx !== -1 && sIdx < dIdx) ||
      (tr.sourceStationCode === sourceCode && tr.destinationStationCode === destCode);
  });

  const sourceStation = ALL_STATIONS.find(s => s.code === sourceCode);
  const destStation = ALL_STATIONS.find(s => s.code === destCode);

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
          <Route className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {t('trainRoute')}
          </h1>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'मार्ग खोजक, कुल दूरी, यात्रा समय व ट्रेन तुलना' : 'Route planner, total distance, travel duration & train comparison'}
          </p>
        </div>
      </div>

      {/* Origin - Destination Selector */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">
              {t('fromStation')}
            </label>
            <select
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-900 bg-slate-50 focus:border-purple-500 focus:bg-white"
            >
              {ALL_STATIONS.map(st => (
                <option key={st.code} value={st.code}>
                  {st.code} - {st.city} ({st.name})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="sm:absolute sm:left-1/2 sm:top-7 sm:-translate-x-1/2 z-10 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center shadow-md transition mx-auto my-1 cursor-pointer"
            title="Swap Origin & Destination"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">
              {t('toStation')}
            </label>
            <select
              value={destCode}
              onChange={(e) => setDestCode(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-900 bg-slate-50 focus:border-purple-500 focus:bg-white"
            >
              {ALL_STATIONS.map(st => (
                <option key={st.code} value={st.code}>
                  {st.code} - {st.city} ({st.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Route Summary Overview Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-purple-200">
            <TrainTrack className="w-4 h-4 text-purple-300" />
            <span>{sourceStation?.city || sourceCode} ➔ {destStation?.city || destCode}</span>
          </div>
          <span className="font-mono text-[11px] bg-purple-800/80 px-2 py-0.5 rounded-full text-purple-100">
            Direct & Connecting Rail Corridor
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-800/60 text-center text-xs">
          <div>
            <div className="text-[10px] text-purple-300 font-semibold">{language === 'hi' ? 'उपलब्ध ट्रेनें' : 'Trains Available'}</div>
            <div className="font-extrabold text-base text-white">{matchingTrains.length > 0 ? matchingTrains.length : 3}</div>
          </div>
          <div>
            <div className="text-[10px] text-purple-300 font-semibold">{language === 'hi' ? 'औसत दूरी' : 'Approx Distance'}</div>
            <div className="font-extrabold text-base text-white">759 km</div>
          </div>
          <div>
            <div className="text-[10px] text-purple-300 font-semibold">{language === 'hi' ? 'सबसे तेज यात्रा' : 'Fastest Journey'}</div>
            <div className="font-extrabold text-base text-amber-300">8h 00m</div>
          </div>
        </div>
      </div>

      {/* Train Comparison Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-tight text-slate-700 flex items-center gap-1.5 px-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>{language === 'hi' ? 'ट्रेन विकल्प तुलना (गति, समय व ठहराव)' : 'Train Options Comparison'}</span>
        </h3>

        {(matchingTrains.length > 0 ? matchingTrains : ALL_TRAINS.slice(0, 3)).map((tr, index) => {
          const isFastest = index === 0;

          return (
            <div
              key={tr.number}
              className={`p-4 rounded-2xl bg-white border transition shadow-sm space-y-2.5 ${
                isFastest ? 'border-amber-400/80 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                      {tr.number}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      {tr.type}
                    </span>
                    {isFastest && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        {language === 'hi' ? 'सबसे तेज' : 'Fastest'}
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                    {language === 'hi' ? tr.nameHi : tr.name}
                  </h4>
                </div>

                <div className="text-right text-xs">
                  <span className="font-extrabold text-purple-900">{tr.durationHours}</span>
                  <p className="text-[10px] text-slate-400">{tr.totalDistanceKm} km</p>
                </div>
              </div>

              {/* Intermediate Major Halts preview */}
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="font-bold text-slate-400 shrink-0">{language === 'hi' ? 'ठहराव:' : 'Halts:'}</span>
                {tr.stops.map((st, i) => (
                  <span key={st.stationCode} className="shrink-0 flex items-center gap-1 font-semibold">
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[10px] font-mono">
                      {st.stationCode}
                    </span>
                    {i < tr.stops.length - 1 && <span className="text-slate-300">→</span>}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-medium">
                  Avg Speed: {tr.speedKmph} km/h
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('live-status', { trainNumber: tr.number })}
                    className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer"
                  >
                    {language === 'hi' ? 'लाइव स्टेटस' : 'Live Status'}
                  </button>
                  <button
                    onClick={() => onNavigate('seat-availability', { trainNumber: tr.number, from: sourceCode, to: destCode })}
                    className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition cursor-pointer"
                  >
                    {language === 'hi' ? 'सीटें देखें' : 'View Seats'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
