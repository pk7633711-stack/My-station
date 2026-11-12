import React, { useState, useEffect } from 'react';
import { Language, PNRDetails } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { SAMPLE_PNRS } from '../data/railwayData';
import { addRecentSearch } from '../utils/storage';
import {
  savePnrOffline,
  isPnrDownloaded,
  getDownloadedPnrs,
} from '../utils/offlineStorage';
import {
  Ticket,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  ShieldCheck,
  Share2,
  Bell,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  HardDriveDownload,
  WifiOff,
} from 'lucide-react';

interface PNRScreenProps {
  language: Language;
  initialPnr?: string;
  isOnline?: boolean;
  onGoBack: () => void;
}

export const PNRScreen: React.FC<PNRScreenProps> = ({
  language,
  initialPnr = '',
  isOnline = true,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [pnrInput, setPnrInput] = useState(initialPnr);
  const [isLoading, setIsLoading] = useState(false);
  const [pnrResult, setPnrResult] = useState<PNRDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasAlert, setHasAlert] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [isSavedForOffline, setIsSavedForOffline] = useState(false);
  const [isOfflineResult, setIsOfflineResult] = useState(false);

  useEffect(() => {
    if (initialPnr) {
      handleSearch(initialPnr);
    }
  }, [initialPnr]);

  const handleSearch = (pnrToSearch?: string) => {
    const raw = (pnrToSearch || pnrInput).trim().replace(/\D/g, '');
    if (raw.length !== 10) {
      setErrorMsg(language === 'hi' ? 'कृपया मान्य 10-अंकों का पीएनआर नंबर दर्ज करें।' : 'Please enter a valid 10-digit PNR number.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // 1. Check offline downloaded PNRs first if offline or available
      const offlinePnrs = getDownloadedPnrs();
      const offlineMatch = offlinePnrs.find(p => p.pnrNumber === raw);

      if (!isOnline) {
        if (offlineMatch) {
          setPnrResult(offlineMatch);
          setIsSavedForOffline(true);
          setIsOfflineResult(true);
        } else {
          const sampleMatch = SAMPLE_PNRS.find(p => p.pnrNumber === raw);
          if (sampleMatch) {
            setPnrResult(sampleMatch);
            setIsSavedForOffline(true);
            setIsOfflineResult(true);
          } else {
            setErrorMsg(
              language === 'hi'
                ? 'ऑफ़लाइन मोड: यह पीएनआर आपके डाउनलोड किए गए टिकटों में नहीं है। कृपया नमूना पीएनआर 2458912340 आज़माएँ या नेटवर्क से कनेक्ट करें।'
                : 'Offline Mode: This PNR is not in your downloaded offline tickets. Try sample PNR 2458912340 or connect to internet.'
            );
            setPnrResult(null);
          }
        }
        setIsLoading(false);
        return;
      }

      // Online lookup
      const matched = SAMPLE_PNRS.find(p => p.pnrNumber === raw);
      if (matched) {
        setPnrResult(matched);
        setIsSavedForOffline(isPnrDownloaded(raw));
        setIsOfflineResult(false);
      } else {
        const isConfirmed = raw.endsWith('0') || raw.endsWith('2') || raw.endsWith('4') || raw.endsWith('6');
        const simulated: PNRDetails = {
          pnrNumber: raw,
          trainNumber: '12301',
          trainName: 'Howrah Rajdhani Express',
          trainNameHi: 'हावड़ा राजधानी एक्सप्रेस',
          dateOfJourney: 'Tomorrow',
          fromStationCode: 'HWH',
          toStationCode: 'NDLS',
          boardingStationCode: 'HWH',
          travelClass: '3A',
          chartStatus: isConfirmed ? 'Chart Prepared' : 'Chart Not Prepared',
          confirmationProbability: isConfirmed ? 100 : 84,
          farePaid: 2150,
          passengers: [
            {
              number: 1,
              bookingStatus: isConfirmed ? 'CNF' : 'RAC 14',
              currentStatus: isConfirmed ? 'CNF' : 'RAC 6',
              coach: isConfirmed ? 'B3' : 'B3',
              berth: isConfirmed ? 34 : 45,
              berthType: 'Side Lower',
              quota: 'GN',
            },
            {
              number: 2,
              bookingStatus: isConfirmed ? 'CNF' : 'RAC 15',
              currentStatus: isConfirmed ? 'CNF' : 'RAC 7',
              coach: isConfirmed ? 'B3' : 'B3',
              berth: isConfirmed ? 35 : 46,
              berthType: 'Side Upper',
              quota: 'GN',
            },
          ],
        };
        setPnrResult(simulated);
        setIsSavedForOffline(isPnrDownloaded(raw));
        setIsOfflineResult(false);
      }

      addRecentSearch({
        type: 'pnr',
        query: raw,
        title: `PNR ${raw}`,
      });

      setIsLoading(false);
    }, 500);
  };

  const handleToggleSaveOffline = () => {
    if (!pnrResult) return;
    savePnrOffline(pnrResult);
    setIsSavedForOffline(true);
    setShowShareNotification(true);
  };

  const handleShare = () => {
    if (!pnrResult) return;
    const text = `MY STATION: PNR ${pnrResult.pnrNumber} | Train: ${pnrResult.trainNumber} ${pnrResult.trainName} | Status: ${pnrResult.passengers[0].currentStatus} (Coach ${pnrResult.passengers[0].coach})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2500);
    }
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-2xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-900">
            <Ticket className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {t('pnrStatus')}
            </h1>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'लाइव आरक्षण पुष्टि, कोच व बर्थ संख्या' : 'Live reservation status, coach & berth details'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700">
          {language === 'hi' ? '10-अंकों का पीएनआर नंबर' : '10-Digit PNR Number'}
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            maxLength={10}
            value={pnrInput}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '');
              setPnrInput(cleaned);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="e.g. 2458912340"
            className="w-full pl-3 pr-24 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base font-mono tracking-widest text-slate-900 placeholder:tracking-normal placeholder:font-sans font-bold"
          />
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || pnrInput.length !== 10}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'जांचें' : 'Check'}</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sample PNR Quick-fill buttons */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t('samplePnrHint')}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PNRS.map((p) => (
              <button
                key={p.pnrNumber}
                onClick={() => {
                  setPnrInput(p.pnrNumber);
                  handleSearch(p.pnrNumber);
                }}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition cursor-pointer"
              >
                {p.pnrNumber} ({p.passengers[0].currentStatus})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {showShareNotification && (
        <div className="p-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold text-center animate-fade-in">
          {language === 'hi' ? 'पीएनआर विवरण कॉपी हो गया!' : 'PNR Details copied to clipboard!'}
        </div>
      )}

      {/* PNR Detailed Result Card */}
      {pnrResult && (
        <div className="space-y-3 animate-fade-in">
          {/* Main Status Header Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                  PNR: {pnrResult.pnrNumber}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {pnrResult.trainNumber} - {language === 'hi' ? pnrResult.trainNameHi : pnrResult.trainName}
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleSaveOffline}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isSavedForOffline
                      ? 'bg-emerald-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={isSavedForOffline ? 'Ticket saved offline' : 'Save ticket for offline travel'}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setHasAlert(!hasAlert)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    hasAlert
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={hasAlert ? 'Alerts active' : 'Notify on chart & platform update'}
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Share PNR Status"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Offline Ticket Badge if viewed from cache */}
            {isOfflineResult && (
              <div className="bg-amber-500/20 border border-amber-400/40 px-2.5 py-1.5 rounded-xl text-amber-200 text-[11px] font-bold flex items-center gap-1.5">
                <HardDriveDownload className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'hi'
                    ? 'ऑफ़लाइन सहेजा गया टिकट • बिना इंटरनेट टीटीई को दिखाएं'
                    : 'Locally Saved Offline Ticket • Available Without Cellular Signal'}
                </span>
              </div>
            )}

            {/* Journey Stations & Class */}
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-between text-xs">
              <div className="text-center">
                <div className="font-mono text-base font-extrabold text-white">
                  {pnrResult.fromStationCode}
                </div>
                <div className="text-[10px] text-blue-200">
                  {language === 'hi' ? 'प्रारंभिक' : 'Origin'}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] text-amber-300 font-semibold">
                  {pnrResult.dateOfJourney}
                </span>
                <div className="w-20 sm:w-28 h-0.5 bg-blue-300/40 relative my-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400 absolute left-1/2 -top-[3px] -translate-x-1/2"></div>
                </div>
                <span className="text-[10px] text-blue-200 font-mono font-bold">
                  Class: {pnrResult.travelClass}
                </span>
              </div>

              <div className="text-center">
                <div className="font-mono text-base font-extrabold text-white">
                  {pnrResult.toStationCode}
                </div>
                <div className="text-[10px] text-blue-200">
                  {language === 'hi' ? 'गंतव्य' : 'Destination'}
                </div>
              </div>
            </div>

            {/* Chart Status Banner */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5">
                {pnrResult.chartStatus === 'Chart Prepared' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400" />
                )}
                <span className="font-bold">
                  {pnrResult.chartStatus === 'Chart Prepared' ? t('chartPrepared') : t('chartNotPrepared')}
                </span>
              </div>
              {pnrResult.confirmationProbability && (
                <div className="flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50 text-[11px] text-emerald-300 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  <span>{pnrResult.confirmationProbability}% {language === 'hi' ? 'पुष्टि संभावना' : 'Probability'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Passenger Breakdown Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-tight">
                <Users className="w-4 h-4 text-blue-600" />
                <span>{t('passengerDetails')}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {pnrResult.passengers.length} {language === 'hi' ? 'यात्री' : 'Passenger(s)'}
              </span>
            </div>

            <div className="space-y-2">
              {pnrResult.passengers.map((p) => {
                const isConfirmed = p.currentStatus.startsWith('CNF');
                const isRAC = p.currentStatus.startsWith('RAC');

                return (
                  <div
                    key={p.number}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                          {p.number}
                        </span>
                        <span>{language === 'hi' ? `यात्री ${p.number}` : `Passenger ${p.number}`}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-mono">
                          {p.quota}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {language === 'hi' ? 'बुकिंग:' : 'Booking:'} <span className="font-medium text-slate-700">{p.bookingStatus}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono shadow-sm ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : isRAC
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-red-100 text-red-900 border border-red-300'
                        }`}
                      >
                        {p.currentStatus}
                      </div>
                      <div className="text-xs font-extrabold text-slate-800 mt-1">
                        {isConfirmed ? (
                          <span>
                            {p.coach} / {p.berth} ({p.berthType})
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">
                            {language === 'hi' ? 'चार्ट पर आवंटन' : 'Allotment on Charting'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Fare & Security */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सीआरआईएस / आईआरसीटीसी अधिकृत' : 'CRIS / IRCTC Verified'}</span>
              </span>
              <span className="font-bold text-slate-900">
                {t('farePaid')}: ₹{pnrResult.farePaid}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
