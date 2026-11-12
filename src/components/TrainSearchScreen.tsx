import React, { useState } from 'react';
import { Language, Train, TrainType } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_TRAINS } from '../data/railwayData';
import { TabType } from './BottomNav';
import {
  Search,
  TrainTrack,
  ArrowRight,
  Clock,
  Calendar,
  Utensils,
  Radio,
  Armchair,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface TrainSearchScreenProps {
  language: Language;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const TrainSearchScreen: React.FC<TrainSearchScreenProps> = ({
  language,
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);

  const trainTypes: string[] = ['All', 'Vande Bharat', 'Rajdhani', 'Shatabdi', 'Superfast', 'Tejas'];

  const filteredTrains = ALL_TRAINS.filter(tr => {
    const matchesSearch =
      tr.number.includes(searchTerm) ||
      tr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.nameHi.includes(searchTerm) ||
      tr.sourceStationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.destinationStationCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'All' || tr.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-cyan-100 text-cyan-900">
          <Search className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {t('trainSearch')}
          </h1>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'भारतीय रेल की सभी ट्रेनों की समय-सारिणी व मार्ग' : 'Schedules, route timetables & classes of all trains'}
          </p>
        </div>
      </div>

      {/* Search Input & Filter Pills */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchTrainPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 text-sm font-semibold text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Train Type Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {trainTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedType === type
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {type === 'All' ? (language === 'hi' ? 'सभी प्रकार' : 'All Types') : type}
            </button>
          ))}
        </div>
      </div>

      {/* Search Result List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>{filteredTrains.length} {language === 'hi' ? 'ट्रेनें मिलीं' : 'Trains found'}</span>
          <span>{language === 'hi' ? 'ट्रेन पर टैप करें' : 'Tap for schedule'}</span>
        </div>

        {filteredTrains.map((tr) => (
          <div
            key={tr.number}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-cyan-500 hover:shadow-md transition space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-900">
                    {tr.number}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {tr.type}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                  {language === 'hi' ? tr.nameHi : tr.name}
                </h3>
              </div>

              {/* Running Days */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-semibold mb-0.5">
                  {language === 'hi' ? 'संचालन' : 'Runs On'}
                </span>
                <div className="flex gap-0.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                    const fullDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const active = tr.runsOnDays.includes(fullDays[idx]);
                    return (
                      <span
                        key={idx}
                        className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                          active ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Route & Timing summary */}
            <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-left">
                <span className="font-mono font-bold text-slate-900">{tr.sourceStationCode}</span>
                <p className="text-[10px] text-slate-500">{tr.stops[0]?.departureTime} Dep</p>
              </div>

              <div className="text-center text-[10px] text-slate-500">
                <span className="font-semibold text-cyan-800">{tr.durationHours}</span>
                <div className="w-16 h-0.5 bg-slate-200 my-0.5 mx-auto"></div>
                <span>{tr.totalDistanceKm} km</span>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-slate-900">{tr.destinationStationCode}</span>
                <p className="text-[10px] text-slate-500">{tr.stops[tr.stops.length - 1]?.arrivalTime} Arr</p>
              </div>
            </div>

            {/* Classes pills & Action Buttons */}
            <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold mr-1">Classes:</span>
                {tr.classes.map(c => (
                  <span
                    key={c}
                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => onNavigate('live-status', { trainNumber: tr.number })}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition cursor-pointer"
                >
                  <Radio className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'hi' ? 'लाइव स्थिति' : 'Live Status'}</span>
                </button>
                <button
                  onClick={() => onNavigate('seat-availability', { trainNumber: tr.number, from: tr.sourceStationCode, to: tr.destinationStationCode })}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold transition cursor-pointer"
                >
                  <Armchair className="w-3 h-3 text-amber-700" />
                  <span>{language === 'hi' ? 'सीटें' : 'Seats'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTrains.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <TrainTrack className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">
              {language === 'hi' ? 'कोई ट्रेन नहीं मिली' : 'No matching trains found'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'कृपया ट्रेन नंबर (उदा. 22436, 12301) या नाम से पुनः खोजें।' : 'Try searching with train number (e.g. 22436, 12301) or station code.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
