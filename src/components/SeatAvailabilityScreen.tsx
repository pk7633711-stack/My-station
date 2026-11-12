import React, { useState } from 'react';
import { Language, TravelClass, QuotaType, SeatAvailabilityResult } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_STATIONS, ALL_TRAINS } from '../data/railwayData';
import { TabType } from './BottomNav';
import {
  Armchair,
  ArrowRightLeft,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag,
} from 'lucide-react';

interface SeatAvailabilityScreenProps {
  language: Language;
  initialFrom?: string;
  initialTo?: string;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const SeatAvailabilityScreen: React.FC<SeatAvailabilityScreenProps> = ({
  language,
  initialFrom = 'NDLS',
  initialTo = 'BSB',
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [fromCode, setFromCode] = useState(initialFrom);
  const [toCode, setToCode] = useState(initialTo);
  const [journeyDate, setJourneyDate] = useState('Tomorrow');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedQuota, setSelectedQuota] = useState<QuotaType>('GN');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SeatAvailabilityResult[]>([]);
  const [hasSearched, setHasSearched] = useState(true);

  // Available classes
  const classesList: { code: string; name: string }[] = [
    { code: 'ALL', name: 'All Classes' },
    { code: '1A', name: 'First AC (1A)' },
    { code: '2A', name: '2 Tier AC (2A)' },
    { code: '3A', name: '3 Tier AC (3A)' },
    { code: '3E', name: '3 AC Economy (3E)' },
    { code: 'CC', name: 'AC Chair Car (CC)' },
    { code: 'EC', name: 'Exec Chair Car (EC)' },
    { code: 'SL', name: 'Sleeper (SL)' },
    { code: '2S', name: 'Second Sitting (2S)' },
  ];

  // Run initial search
  React.useEffect(() => {
    runSearch();
  }, [fromCode, toCode, journeyDate, selectedQuota]);

  const handleSwapStations = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const runSearch = () => {
    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      // Find trains that serve both stations
      const matches = ALL_TRAINS.filter(tr => {
        const fromIdx = tr.stops.findIndex(s => s.stationCode === fromCode);
        const toIdx = tr.stops.findIndex(s => s.stationCode === toCode);
        return (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) ||
          (tr.sourceStationCode === fromCode && tr.destinationStationCode === toCode);
      });

      // If no exact direct train in small seed, pick top available trains for demonstration
      const trainsToUse = matches.length > 0 ? matches : ALL_TRAINS.slice(0, 3);

      const generated: SeatAvailabilityResult[] = trainsToUse.map((tr) => {
        const availClasses = tr.classes.map(c => {
          let status = 'AVAILABLE 42';
          let fare = 1450;
          let prob = 100;

          if (c === '1A') {
            status = 'AVAILABLE 8';
            fare = 3280;
            prob = 100;
          } else if (c === '2A') {
            status = 'AVAILABLE 18';
            fare = 1960;
            prob = 100;
          } else if (c === '3A') {
            status = selectedQuota === 'TQ' ? 'WL 12' : 'AVAILABLE 34';
            fare = 1380;
            prob = selectedQuota === 'TQ' ? 75 : 100;
          } else if (c === '3E') {
            status = 'AVAILABLE 56';
            fare = 1190;
            prob = 100;
          } else if (c === 'CC') {
            status = 'AVAILABLE 64';
            fare = 1750;
            prob = 100;
          } else if (c === 'EC') {
            status = 'AVAILABLE 14';
            fare = 3300;
            prob = 100;
          } else if (c === 'SL') {
            status = 'RAC 22';
            fare = 480;
            prob = 89;
          } else if (c === '2S') {
            status = 'AVAILABLE 110';
            fare = 230;
            prob = 100;
          }

          return {
            travelClass: c,
            status,
            fare,
            probability: prob,
            updatedTime: '5 mins ago',
          };
        });

        return {
          trainNumber: tr.number,
          trainName: tr.name,
          trainNameHi: tr.nameHi,
          type: tr.type,
          departureTime: tr.stops[0]?.departureTime || '06:00',
          arrivalTime: tr.stops[tr.stops.length - 1]?.arrivalTime || '14:00',
          duration: tr.durationHours,
          fromStation: fromCode,
          toStation: toCode,
          classes: selectedClass === 'ALL' ? availClasses : availClasses.filter(cl => cl.travelClass === selectedClass),
        };
      });

      setSearchResults(generated);
      setIsSearching(false);
    }, 450);
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
          <Armchair className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {t('seatAvailability')}
          </h1>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'सीटों की स्थिति, किराया व पुष्टि संभावना' : 'Real-time seat count, fares & confirmation chances'}
          </p>
        </div>
      </div>

      {/* From / To & Options Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
          {/* From Station */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">
              {t('fromStation')}
            </label>
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-900 bg-slate-50 focus:border-amber-500 focus:bg-white"
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
            onClick={handleSwapStations}
            className="sm:absolute sm:left-1/2 sm:top-7 sm:-translate-x-1/2 z-10 w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center shadow-md transition mx-auto my-1 cursor-pointer"
            title="Swap Stations"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>

          {/* To Station */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">
              {t('toStation')}
            </label>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-900 bg-slate-50 focus:border-amber-500 focus:bg-white"
            >
              {ALL_STATIONS.map(st => (
                <option key={st.code} value={st.code}>
                  {st.code} - {st.city} ({st.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Quota Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">
              {t('journeyDate')}
            </label>
            <select
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900"
            >
              <option value="Today">Today (आज)</option>
              <option value="Tomorrow">Tomorrow (कल)</option>
              <option value="In 2 Days">In 2 Days</option>
              <option value="This Weekend">This Weekend</option>
              <option value="Next Week">Next Week</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">
              {t('quota')}
            </label>
            <select
              value={selectedQuota}
              onChange={(e) => setSelectedQuota(e.target.value as QuotaType)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900"
            >
              <option value="GN">{t('generalQuota')}</option>
              <option value="TQ">{t('tatkalQuota')}</option>
              <option value="LD">{t('ladiesQuota')}</option>
              <option value="SS">{t('srCitizenQuota')}</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-500 block mb-1">
              {t('travelClass')}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900"
            >
              {classesList.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Find Trains Button */}
        <button
          onClick={runSearch}
          disabled={isSearching}
          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
        >
          {isSearching ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{t('searchTrainsBtn')}</span>
            </>
          )}
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
          <span>{searchResults.length} {language === 'hi' ? 'ट्रेनें उपलब्ध' : 'Trains available'}</span>
          <span className="text-[11px] text-amber-700 font-bold">Quota: {selectedQuota}</span>
        </div>

        {searchResults.map((result) => (
          <div
            key={result.trainNumber}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            {/* Train Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    {result.trainNumber}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {result.type}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                  {language === 'hi' ? result.trainNameHi : result.trainName}
                </h3>
              </div>

              <div className="text-right text-xs">
                <span className="font-extrabold text-slate-900">
                  {result.departureTime} → {result.arrivalTime}
                </span>
                <p className="text-[10px] text-slate-400 font-semibold">{result.duration}</p>
              </div>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.classes.map((cl) => {
                const isAvailable = cl.status.startsWith('AVAILABLE');
                const isRAC = cl.status.startsWith('RAC');

                return (
                  <div
                    key={cl.travelClass}
                    className={`p-2.5 rounded-xl border transition ${
                      isAvailable
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : isRAC
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-red-50/70 border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-slate-900">
                        {cl.travelClass}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        ₹{cl.fare}
                      </span>
                    </div>

                    <div
                      className={`text-[11px] font-extrabold mt-1 truncate ${
                        isAvailable ? 'text-emerald-800' : isRAC ? 'text-amber-800' : 'text-red-800'
                      }`}
                    >
                      {cl.status}
                    </div>

                    {cl.probability && (
                      <div className="text-[9px] text-slate-500 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{cl.probability}% chance</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Official Booking CTA button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {language === 'hi' ? 'आईआरसीटीसी अधिकृत किराया' : 'IRCTC Official PRS Fare'}
              </span>
              <button
                onClick={() => onNavigate('ticket-booking', { trainNumber: result.trainNumber })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition cursor-pointer"
              >
                <span>{language === 'hi' ? 'आईआरसीटीसी पर बुक करें' : 'Book on IRCTC'}</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
