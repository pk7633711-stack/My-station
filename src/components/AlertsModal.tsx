import React from 'react';
import { Language } from '../types/railway';
import { useTranslation } from '../utils/translations';
import {
  Bell,
  X,
  AlertTriangle,
  Radio,
  Clock,
  CheckCircle2,
  TrainTrack,
} from 'lucide-react';

interface AlertsModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSelectTrain: (trainNumber: string) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  language,
  isOpen,
  onClose,
  onSelectTrain,
}) => {
  const t = useTranslation(language);

  if (!isOpen) return null;

  const alerts = [
    {
      id: 'alt-1',
      type: 'platform',
      trainNumber: '12301',
      trainName: 'Howrah Rajdhani Express',
      trainNameHi: 'हावड़ा राजधानी एक्सप्रेस',
      stationCode: 'PRYJ',
      titleEn: 'Platform Change Alert at Prayagraj Jn (PRYJ)',
      titleHi: 'प्रयागराज जंक्शन पर प्लेटफार्म परिवर्तन अलर्ट',
      descEn: 'Train 12301 will now arrive on Platform 1 instead of Platform 4.',
      descHi: 'ट्रेन 12301 अब प्लेटफार्म 4 के स्थान पर प्लेटफार्म 1 पर आएगी।',
      time: '10 mins ago',
      isNew: true,
    },
    {
      id: 'alt-2',
      type: 'delay',
      trainNumber: '12393',
      trainName: 'Sampoorna Kranti Express',
      trainNameHi: 'सम्पूर्ण क्रांति एक्सप्रेस',
      stationCode: 'CNB',
      titleEn: 'Train Delay Alert',
      titleHi: 'ट्रेन विलंब सूचना',
      descEn: 'Running 8 mins late between DDU and Kanpur Central. Expected arrival 02:33 hrs.',
      descHi: 'दीनदयाल उपाध्याय व कानपुर के बीच 8 मिनट विलंब। संभावित आगमन 02:33 बजे।',
      time: '25 mins ago',
      isNew: false,
    },
    {
      id: 'alt-3',
      type: 'ontime',
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      trainNameHi: 'वंदे भारत एक्सप्रेस',
      stationCode: 'BSB',
      titleEn: 'Right On Time Notice',
      titleHi: 'समय पर संचालन सूचना',
      descEn: 'Approaching destination Varanasi Jn (BSB) at 128 km/h. Expected on Platform 1 on schedule.',
      descHi: 'वाराणसी जंक्शन की ओर समय पर अग्रसर। प्लेटफार्म 1 पर निर्धारित समय पर पहुंचेगी।',
      time: '1 hour ago',
      isNew: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {language === 'hi' ? 'रेलवे रनिंग अलर्ट व सूचनाएं' : 'Train Alerts & Notifications'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'hi' ? 'प्लेटफार्म परिवर्तन व विलंब सूचना' : 'Platform change and delay bulletins'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-3 overflow-y-auto space-y-2.5 flex-1">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              onClick={() => {
                onSelectTrain(alt.trainNumber);
                onClose();
              }}
              className={`p-3.5 rounded-2xl border transition text-left cursor-pointer space-y-1.5 ${
                alt.type === 'platform'
                  ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/60'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {alt.trainNumber}
                  </span>
                  {alt.type === 'platform' ? (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      Platform Change
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-900">
                      Live NTES
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{alt.time}</span>
              </div>

              <h4 className="font-bold text-xs text-slate-900 leading-snug">
                {language === 'hi' ? alt.titleHi : alt.titleEn}
              </h4>
              <p className="text-[11px] text-slate-600 leading-tight">
                {language === 'hi' ? alt.descHi : alt.descEn}
              </p>

              <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-emerald-700">
                <span>{language === 'hi' ? 'लाइव स्थिति ट्रैक करें' : 'Track Live Train'}</span>
                <span>➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
