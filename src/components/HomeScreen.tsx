import React, { useState } from 'react';
import { Language, Station, Train } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { TabType } from './BottomNav';
import { ALL_STATIONS, ALL_TRAINS, SAMPLE_PNRS } from '../data/railwayData';
import { RecentSearch } from '../utils/storage';
import {
  Ticket,
  Radio,
  Search,
  Armchair,
  Route,
  Building2,
  CalendarCheck2,
  Calculator,
  BellRing,
  PhoneCall,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  ArrowRightLeft,
  MapPin,
  Star,
  ExternalLink,
  HardDriveDownload,
  WifiOff,
} from 'lucide-react';

interface HomeScreenProps {
  language: Language;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  recentSearches: RecentSearch[];
  onSelectSearch: (search: RecentSearch) => void;
  onOpenNearbyStations: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onNavigate,
  recentSearches,
  onSelectSearch,
  onOpenNearbyStations,
}) => {
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Quick universal station/train filtering
  const filteredStations = ALL_STATIONS.filter(
    s =>
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameHi.includes(searchQuery) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  const filteredTrains = ALL_TRAINS.filter(
    tr =>
      tr.number.includes(searchQuery) ||
      tr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.nameHi.includes(searchQuery)
  ).slice(0, 4);

  // 10 Main Grid Options strictly matching Section 10 of User Request
  const mainOptions = [
    {
      id: 'pnr' as TabType,
      num: 1,
      titleEn: 'PNR Status',
      titleHi: 'पीएनआर स्थिति',
      descEn: 'Live confirmation & coach/berth details',
      descHi: 'लाइव पुष्टि व कोच/बर्थ स्थिति',
      icon: Ticket,
      color: 'from-blue-600 to-indigo-700',
      badge: '10-Digit',
    },
    {
      id: 'live-status' as TabType,
      num: 2,
      titleEn: 'Live Train Status',
      titleHi: 'लाइव ट्रेन स्थिति',
      descEn: 'Spot train, delay & live platform',
      descHi: 'ट्रेन की लाइव लोकेशन व प्लेटफार्म',
      icon: Radio,
      color: 'from-emerald-600 to-teal-700',
      badge: 'Live GPS',
    },
    {
      id: 'train-search' as TabType,
      num: 3,
      titleEn: 'Train Search',
      titleHi: 'ट्रेन खोज व समय',
      descEn: 'Schedule, intermediate halts & timetable',
      descHi: 'समय सारिणी व सभी ठहराव',
      icon: Search,
      color: 'from-cyan-600 to-blue-700',
    },
    {
      id: 'seat-availability' as TabType,
      num: 4,
      titleEn: 'Seat Availability',
      titleHi: 'सीट उपलब्धता',
      descEn: 'Check 1A, 2A, 3A, SL & Tatkal seats',
      descHi: 'सभी श्रेणियों में खाली सीटें',
      icon: Armchair,
      color: 'from-amber-600 to-orange-700',
      badge: 'Real-Time',
    },
    {
      id: 'route-finder' as TabType,
      num: 5,
      titleEn: 'Train Route',
      titleHi: 'ट्रेन रूट खोजक',
      descEn: 'Find trains between stations & compare',
      descHi: 'दो स्टेशनों के बीच ट्रेनें व दूरी',
      icon: Route,
      color: 'from-purple-600 to-violet-700',
    },
    {
      id: 'station-info' as TabType,
      num: 6,
      titleEn: 'Station Information',
      titleHi: 'स्टेशन जानकारी',
      descEn: 'Live departures board & facilities',
      descHi: 'आगमन-प्रस्थान बोर्ड व सुविधाएं',
      icon: Building2,
      color: 'from-emerald-700 to-green-800',
    },
    {
      id: 'ticket-booking' as TabType,
      num: 7,
      titleEn: 'Ticket Booking',
      titleHi: 'टिकट बुकिंग',
      descEn: 'Official IRCTC & Tatkal timings',
      descHi: 'आईआरसीटीसी लिंक व तत्काल टाइमर',
      icon: CalendarCheck2,
      color: 'from-rose-600 to-red-700',
      badge: 'IRCTC Link',
    },
    {
      id: 'fare-calculator' as TabType,
      num: 8,
      titleEn: 'Fare Calculator',
      titleHi: 'किराया गणक',
      descEn: 'Calculate distance & class-wise fare',
      descHi: 'दूरी व श्रेणी के अनुसार किराया',
      icon: Calculator,
      color: 'from-sky-600 to-blue-800',
    },
    {
      id: 'railway-updates' as TabType,
      num: 9,
      titleEn: 'Railway Updates',
      titleHi: 'रेलवे अपडेट व ज़ोन',
      descEn: 'Festival specials & 18 Railway Zones',
      descHi: 'त्योहार स्पेशल ट्रेनें व 18 ज़ोन',
      icon: BellRing,
      color: 'from-teal-600 to-emerald-800',
    },
    {
      id: 'emergency-help' as TabType,
      num: 10,
      titleEn: 'Emergency Help',
      titleHi: 'आपातकालीन सहायता',
      descEn: 'RailMadad 139, RPF 182 & Grievance',
      descHi: 'रेलमदद 139 व शिकायत पंजीकरण',
      icon: PhoneCall,
      color: 'from-red-600 to-rose-800',
      badge: '24x7 SOS',
    },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Hero Banner with Quick Search */}
      <div className="bg-gradient-to-b from-[#0e533c] to-[#093d2b] p-4 text-white rounded-b-3xl shadow-lg border-b border-emerald-800/60 relative">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'भारतीय रेल अधिकृत सेवा' : 'Official Indian Railway Passenger Hub'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 tracking-tight">
              {language === 'hi' ? 'शुभ यात्रा! अपनी ट्रेन खोजें' : 'Where are you traveling?'}
            </h1>
          </div>
          <button
            onClick={onOpenNearbyStations}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-600/50 text-[11px] font-bold text-emerald-100 transition shadow-sm cursor-pointer shrink-0"
            title="Locate nearby stations"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'hi' ? 'निकटतम' : 'Nearby'}</span>
          </button>
        </div>

        {/* Universal Search Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim().length > 0);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSearchResults(true);
              }}
              placeholder={t('searchStationOrTrain')}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search Dropdown */}
          {showSearchResults && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
              {filteredStations.length > 0 && (
                <div className="p-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                    {language === 'hi' ? 'स्टेशन' : 'Stations'}
                  </div>
                  {filteredStations.map(st => (
                    <button
                      key={st.code}
                      onClick={() => {
                        setShowSearchResults(false);
                        onNavigate('station-info', { stationCode: st.code });
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {language === 'hi' ? st.nameHi : st.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{st.city}, {st.state}</div>
                        </div>
                      </div>
                      <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {st.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {filteredTrains.length > 0 && (
                <div className="p-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                    {language === 'hi' ? 'ट्रेनें' : 'Trains'}
                  </div>
                  {filteredTrains.map(tr => (
                    <button
                      key={tr.number}
                      onClick={() => {
                        setShowSearchResults(false);
                        onNavigate('live-status', { trainNumber: tr.number });
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {tr.number} - {language === 'hi' ? tr.nameHi : tr.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {tr.sourceStationCode} → {tr.destinationStationCode} • {tr.type}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {filteredStations.length === 0 && filteredTrains.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500">
                  {language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No matching stations or trains found'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Ticker: Tatkal & Festival Notice */}
        <div className="mt-3 flex items-center gap-2 text-[11px] bg-emerald-900/60 border border-emerald-700/50 rounded-xl px-2.5 py-1.5 text-emerald-100">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            {language === 'hi'
              ? 'तत्काल समय: एसी सुबह 10:00 बजे | स्लीपर सुबह 11:00 बजे खुलता है'
              : 'Tatkal Timings: AC opens 10:00 AM | Non-AC opens 11:00 AM'}
          </span>
          <button
            onClick={() => onNavigate('ticket-booking')}
            className="text-amber-300 font-bold ml-auto shrink-0 hover:underline"
          >
            {language === 'hi' ? 'गाइड' : 'Guide'}
          </button>
        </div>
      </div>

      {/* Main 10 Options Grid (Section 10 of User Brief) */}
      <div className="px-3 sm:px-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-black tracking-tight uppercase text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            {language === 'hi' ? 'मुख्य सेवाएं (10 मुख्य सुविधाएं)' : 'Key Railway Services'}
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            {language === 'hi' ? 'सभी 10 सुविधाएं' : '10 Core Features'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {mainOptions.map((opt) => {
            const Icon = opt.icon;
            const title = language === 'hi' ? opt.titleHi : opt.titleEn;
            const desc = language === 'hi' ? opt.descHi : opt.descEn;

            return (
              <button
                key={opt.id}
                onClick={() => onNavigate(opt.id)}
                className="group relative flex flex-col p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all text-left cursor-pointer overflow-hidden active:scale-[0.98]"
              >
                {/* Top Row with Icon & Badge */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${opt.color} text-white flex items-center justify-center shadow-md shadow-slate-200 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex items-center gap-1">
                    {opt.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/60 leading-none">
                        {opt.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-black text-slate-300 font-mono">
                      #{opt.num}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight leading-snug group-hover:text-emerald-700 transition-colors">
                  {title}
                </h3>
                <p className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-2">
                  {desc}
                </p>

                {/* Bottom Arrow Indicator */}
                <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-emerald-800">
                  <span>{language === 'hi' ? 'खोलें' : 'Open'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Offline Mode & Downloads Quick Banner */}
      <div className="px-3 sm:px-4">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-[#0c4a34] rounded-2xl p-3 text-white shadow-sm border border-emerald-700/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shrink-0 shadow-sm">
              <HardDriveDownload className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-extrabold text-white">
                  {language === 'hi' ? 'ऑफ़लाइन यात्रा मोड (बिना इंटरनेट)' : 'Offline Travel Mode & Downloads'}
                </h3>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                  Ready
                </span>
              </div>
              <p className="text-[10px] text-emerald-200">
                {language === 'hi'
                  ? 'ट्रेन समय सारणी, स्टेशन सुविधाएं व पीएनआर बिना नेटवर्क उपलब्ध'
                  : 'Schedules, station facilities & PNR available with zero cellular signal'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('offline-manager')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs shrink-0 transition shadow-sm cursor-pointer"
          >
            {language === 'hi' ? 'प्रबंधित करें' : 'Manage'}
          </button>
        </div>
      </div>

      {/* Quick PNR Lookup Card (Immediate utility) */}
      <div className="px-3 sm:px-4">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-3.5 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-300">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  {language === 'hi' ? 'त्वरित पीएनआर जांच (10 अंक)' : 'Quick PNR Verification'}
                </h3>
                <p className="text-[10px] text-blue-200/80">
                  {language === 'hi' ? 'सीट, कोच, आरएसी व पुष्टि संभावना' : 'Seat, coach, RAC & confirmation chance'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-800/80 text-blue-100 border border-blue-600/50">
              Live NTES
            </span>
          </div>

          {/* Quick test PNR chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px] scrollbar-none">
            <span className="text-[10px] text-blue-300 shrink-0">
              {language === 'hi' ? 'नमूना:' : 'Quick Pick:'}
            </span>
            {SAMPLE_PNRS.map(p => (
              <button
                key={p.pnrNumber}
                onClick={() => onNavigate('pnr', { pnr: p.pnrNumber })}
                className="px-2 py-1 rounded-lg bg-blue-800/50 hover:bg-blue-700/60 border border-blue-500/40 text-blue-100 font-mono text-[10px] shrink-0 transition cursor-pointer"
              >
                {p.pnrNumber} ({p.passengers[0].currentStatus})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured High-Speed Trains Live Tracker Bar */}
      <div className="px-3 sm:px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-black tracking-tight uppercase text-slate-700 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            {language === 'hi' ? 'प्रमुख ट्रेनें - लाइव रनिंग स्टेटस' : 'Popular Trains Live Status'}
          </h2>
          <button
            onClick={() => onNavigate('live-status')}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ALL_TRAINS.slice(0, 3).map(tr => (
            <button
              key={tr.number}
              onClick={() => onNavigate('live-status', { trainNumber: tr.number })}
              className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200/60">
                  {tr.number}
                </span>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 transition">
                  {tr.type}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 truncate">
                {language === 'hi' ? tr.nameHi : tr.name}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>{tr.sourceStationCode} → {tr.destinationStationCode}</span>
                <span className="font-semibold text-emerald-700">{tr.durationHours}</span>
              </div>
              {tr.currentLocationInfo && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="truncate">
                    {language === 'hi' ? tr.currentLocationInfo.statusTextHi : tr.currentLocationInfo.statusText}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Official Help & Passenger Care Highlights */}
      <div className="px-3 sm:px-4">
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-sm shrink-0">
              <PhoneCall className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {language === 'hi' ? 'रेलमदद 139 - 24x7 यात्री सुरक्षा व सहायता' : 'RailMadad 139 - 24x7 Assistance'}
              </h4>
              <p className="text-[10px] text-slate-600">
                {language === 'hi' ? 'चिकित्सा सहायता, सुरक्षा, कोच सफाई व शिकायत' : 'Security, onboard medical care, lost & found'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('emergency-help')}
            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 transition cursor-pointer shadow-sm"
          >
            {language === 'hi' ? 'सहायता लें' : 'Get Help'}
          </button>
        </div>
      </div>
    </div>
  );
};
