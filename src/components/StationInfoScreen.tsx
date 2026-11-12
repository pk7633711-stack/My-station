import React, { useState } from 'react';
import { Language, Station, LiveStationTrain } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_STATIONS, ALL_TRAINS } from '../data/railwayData';
import { TabType } from './BottomNav';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Layers,
  Clock,
  Radio,
  CheckCircle,
  Wifi,
  Droplets,
  Utensils,
  Bed,
  Briefcase,
  Accessibility,
  ArrowUpDown,
  Car,
  HeartPulse,
  CreditCard,
  Armchair,
  Coffee,
  Info,
  Download,
  Check,
  HardDriveDownload,
} from 'lucide-react';
import {
  downloadStation,
  isStationDownloaded,
  removeDownloadedStation,
} from '../utils/offlineStorage';

interface StationInfoScreenProps {
  language: Language;
  initialStationCode?: string;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const StationInfoScreen: React.FC<StationInfoScreenProps> = ({
  language,
  initialStationCode = 'NDLS',
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [selectedCode, setSelectedCode] = useState(initialStationCode);
  const [activeBoardTab, setActiveBoardTab] = useState<'departures' | 'arrivals'>('departures');
  const [searchTerm, setSearchTerm] = useState('');

  const currentStation = ALL_STATIONS.find(s => s.code === selectedCode) || ALL_STATIONS[0];

  const filteredStations = ALL_STATIONS.filter(s =>
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nameHi.includes(searchTerm)
  );

  // Generate simulated realistic Live LED Station Departure/Arrival Board
  const liveBoardTrains: LiveStationTrain[] = [
    {
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      trainNameHi: 'वंदे भारत एक्सप्रेस',
      type: 'Vande Bharat',
      platform: '16',
      scheduledTime: '06:00',
      expectedTime: '06:00',
      delayMinutes: 0,
      direction: 'Departure',
      origin: currentStation.code,
      destination: 'BSB',
      status: 'On Time',
    },
    {
      trainNumber: '12302',
      trainName: 'Howrah Rajdhani Express',
      trainNameHi: 'हावड़ा राजधानी एक्सप्रेस',
      type: 'Rajdhani',
      platform: '9',
      scheduledTime: '16:50',
      expectedTime: '17:02',
      delayMinutes: 12,
      direction: 'Departure',
      origin: currentStation.code,
      destination: 'HWH',
      status: 'Delayed',
    },
    {
      trainNumber: '12952',
      trainName: 'Mumbai Tejas Rajdhani',
      trainNameHi: 'तेजस राजधानी एक्सप्रेस',
      type: 'Tejas',
      platform: '2',
      scheduledTime: '17:00',
      expectedTime: '17:00',
      delayMinutes: 0,
      direction: 'Departure',
      origin: currentStation.code,
      destination: 'MMCT',
      status: 'On Time',
    },
    {
      trainNumber: '12394',
      trainName: 'Sampoorna Kranti Express',
      trainNameHi: 'सम्पूर्ण क्रांति एक्सप्रेस',
      type: 'Superfast',
      platform: '4',
      scheduledTime: '17:30',
      expectedTime: '17:35',
      delayMinutes: 5,
      direction: 'Departure',
      origin: currentStation.code,
      destination: 'PNBE',
      status: 'Delayed',
    },
    {
      trainNumber: '12002',
      trainName: 'Bhopal Shatabdi Express',
      trainNameHi: 'भोपाल शताब्दी एक्सप्रेस',
      type: 'Shatabdi',
      platform: '1',
      scheduledTime: '06:00',
      expectedTime: '06:00',
      delayMinutes: 0,
      direction: 'Departure',
      origin: currentStation.code,
      destination: 'BPL',
      status: 'On Time',
    },
  ];

  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wifi': return <Wifi className="w-4 h-4 text-emerald-600" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'Bed': return <Bed className="w-4 h-4 text-indigo-600" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'Accessibility': return <Accessibility className="w-4 h-4 text-teal-600" />;
      case 'ArrowUpDown': return <ArrowUpDown className="w-4 h-4 text-slate-600" />;
      case 'Car': return <Car className="w-4 h-4 text-cyan-600" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-red-600" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-amber-700" />;
      default: return <Armchair className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
          <Building2 className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {t('stationInfo')}
          </h1>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'स्टेशन कोड, सुविधाएं, लाइव डिस्प्ले बोर्ड व प्लेटफार्म' : 'Station code, amenities, live board & platform numbers'}
          </p>
        </div>
      </div>

      {/* Station Selector Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
        <label className="text-[11px] font-bold text-slate-500 block">
          {language === 'hi' ? 'भारतीय रेलवे स्टेशन चुनें:' : 'Select Railway Station:'}
        </label>
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 font-extrabold text-sm text-slate-900 bg-slate-50 focus:border-emerald-600 focus:bg-white"
        >
          {ALL_STATIONS.map(st => (
            <option key={st.code} value={st.code}>
              {st.code} - {st.name} ({st.city}, {st.state})
            </option>
          ))}
        </select>
      </div>

      {/* Selected Station Main Profile Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c4a34] via-[#093d2b] to-[#06241a] text-white shadow-md space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950">
                {currentStation.code}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-200 border border-emerald-600/50">
                {currentStation.category} Station
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
              {language === 'hi' ? currentStation.nameHi : currentStation.name}
            </h2>
            <p className="text-xs text-emerald-200">
              {currentStation.city}, {currentStation.state} • {currentStation.zone}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <button
              onClick={() => {
                if (isStationDownloaded(currentStation.code)) {
                  removeDownloadedStation(currentStation.code);
                } else {
                  downloadStation(currentStation);
                }
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                isStationDownloaded(currentStation.code)
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              {isStationDownloaded(currentStation.code) ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{language === 'hi' ? 'सहेजा गया' : 'Saved'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" />
                  <span>{language === 'hi' ? 'ऑफ़लाइन' : 'Save'}</span>
                </>
              )}
            </button>
            <div className="text-right">
              <div className="text-2xl font-black text-amber-300 font-mono leading-none">
                {currentStation.platforms}
              </div>
              <span className="text-[10px] text-emerald-200 font-bold block">
                {language === 'hi' ? 'प्लेटफार्म' : 'Platforms'}
              </span>
            </div>
          </div>
        </div>

        {/* Address and helpline */}
        <div className="p-3 rounded-xl bg-white/10 text-xs space-y-1.5">
          <div className="flex items-start gap-2 text-emerald-100">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-tight">{currentStation.address}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-800/60 text-emerald-200">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-amber-300" />
              <span>{language === 'hi' ? 'पूछताछ:' : 'Enquiry:'} {currentStation.helpline}</span>
            </div>
            <span className="text-amber-300 font-bold">Division: {currentStation.division}</span>
          </div>
        </div>
      </div>

      {/* Live Railway Station LED Display Board */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-lg space-y-3 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <h3 className="font-mono text-xs sm:text-sm font-black text-amber-300 tracking-wider uppercase">
              {t('liveBoard')} • {currentStation.code}
            </h3>
          </div>

          <div className="flex bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setActiveBoardTab('departures')}
              className={`px-2 py-1 rounded-md transition ${
                activeBoardTab === 'departures' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              {t('departures')}
            </button>
            <button
              onClick={() => setActiveBoardTab('arrivals')}
              className={`px-2 py-1 rounded-md transition ${
                activeBoardTab === 'arrivals' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              {t('arrivals')}
            </button>
          </div>
        </div>

        {/* LED Table Header */}
        <div className="grid grid-cols-12 text-[10px] font-mono font-bold text-slate-400 border-b border-slate-800 pb-1 px-1">
          <div className="col-span-2">TRAIN</div>
          <div className="col-span-5">NAME & DEST</div>
          <div className="col-span-2 text-center">SCH / EXP</div>
          <div className="col-span-1 text-center">PF</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        {/* LED Table Rows */}
        <div className="space-y-1.5 font-mono">
          {liveBoardTrains.map((tr) => (
            <div
              key={tr.trainNumber}
              onClick={() => onNavigate('live-status', { trainNumber: tr.trainNumber })}
              className="grid grid-cols-12 items-center text-xs p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/60 transition cursor-pointer"
            >
              <div className="col-span-2 font-black text-amber-400 text-[11px]">
                {tr.trainNumber}
              </div>
              <div className="col-span-5 pr-1 truncate">
                <span className="font-bold text-slate-100 text-[11px] block truncate">
                  {language === 'hi' ? tr.trainNameHi : tr.trainName}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  To {tr.destination}
                </span>
              </div>
              <div className="col-span-2 text-center text-[10px] text-slate-300">
                <div>{tr.scheduledTime}</div>
                <div className={tr.delayMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                  {tr.expectedTime}
                </div>
              </div>
              <div className="col-span-1 text-center font-black text-amber-300 text-xs">
                {tr.platform}
              </div>
              <div className="col-span-2 text-right text-[10px]">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    tr.status === 'On Time'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {tr.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Station Facilities & Amenities Checklist (Section 1 requirement) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-black uppercase tracking-tight text-slate-800 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{t('stationFacilities')}</span>
          </h3>
          <span className="text-[11px] text-emerald-700 font-bold">
            {language === 'hi' ? 'सत्यापित सुविधाएं' : 'Verified Amenities'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentStation.facilities.map((fac) => (
            <div
              key={fac.id}
              className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center gap-2.5"
            >
              <div className="p-1.5 rounded-lg bg-white shadow-xs border border-slate-200 shrink-0">
                {getFacilityIcon(fac.icon)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {language === 'hi' ? fac.nameHi : fac.name}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {language === 'hi' ? 'उपलब्ध (24x7)' : 'Available 24x7'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
