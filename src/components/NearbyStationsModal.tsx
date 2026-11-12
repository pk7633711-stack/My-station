import React, { useState } from 'react';
import { Language, Station } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_STATIONS } from '../data/railwayData';
import { TabType } from './BottomNav';
import {
  MapPin,
  X,
  Compass,
  Building2,
  ChevronRight,
  Navigation,
} from 'lucide-react';

interface NearbyStationsModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSelectStation: (stationCode: string) => void;
}

export const NearbyStationsModal: React.FC<NearbyStationsModalProps> = ({
  language,
  isOpen,
  onClose,
  onSelectStation,
}) => {
  const t = useTranslation(language);
  const [selectedCity, setSelectedCity] = useState<string>('Delhi');

  if (!isOpen) return null;

  const cityStations = ALL_STATIONS.filter(s =>
    s.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
    s.state.toLowerCase().includes(selectedCity.toLowerCase())
  );

  const majorCities = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru', 'Varanasi', 'Patna'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-800 text-amber-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {t('nearbyStations')}
              </h3>
              <p className="text-[10px] text-emerald-200">
                {language === 'hi' ? 'अपने निकटतम रेलवे स्टेशन खोजें' : 'Locate stations in your vicinity'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
            {language === 'hi' ? 'शहर चुनें:' : 'Select Metro City / Region:'}
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {majorCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                  selectedCity === city
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Station List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {cityStations.length > 0 ? (
            cityStations.map((st, idx) => (
              <button
                key={st.code}
                onClick={() => {
                  onSelectStation(st.code);
                  onClose();
                }}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition text-left cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-mono font-black text-xs shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition">
                    {st.code}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition">
                      {language === 'hi' ? st.nameHi : st.name}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {st.city} • {st.platforms} Platforms • {st.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-700 transition">
                  <span className="text-[10px] font-bold font-mono">
                    ~{(idx * 3.4 + 2.1).toFixed(1)} km
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              {language === 'hi' ? 'इस क्षेत्र में कोई स्टेशन सूचीबद्ध नहीं है।' : 'No stations listed in this selection.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-500">
            {language === 'hi' ? 'लाइव आगमन-प्रस्थान देखने हेतु स्टेशन पर टैप करें।' : 'Tap any station to view its live LED board & facilities.'}
          </p>
        </div>
      </div>
    </div>
  );
};
