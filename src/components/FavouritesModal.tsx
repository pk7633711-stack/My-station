import React, { useState } from 'react';
import { Language, Train, Station } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_TRAINS, ALL_STATIONS } from '../data/railwayData';
import { getFavouriteTrains, getFavouriteStations, toggleFavouriteTrain, toggleFavouriteStation } from '../utils/storage';
import {
  Star,
  X,
  TrainTrack,
  Building2,
  Trash2,
  Radio,
  ArrowRight,
} from 'lucide-react';

interface FavouritesModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSelectTrain: (trainNumber: string) => void;
  onSelectStation: (stationCode: string) => void;
}

export const FavouritesModal: React.FC<FavouritesModalProps> = ({
  language,
  isOpen,
  onClose,
  onSelectTrain,
  onSelectStation,
}) => {
  const t = useTranslation(language);
  const [favTrains, setFavTrains] = useState<string[]>(getFavouriteTrains());
  const [favStations, setFavStations] = useState<string[]>(getFavouriteStations());
  const [activeTab, setActiveTab] = useState<'trains' | 'stations'>('trains');

  if (!isOpen) return null;

  const trainsList = ALL_TRAINS.filter(tr => favTrains.includes(tr.number));
  const stationsList = ALL_STATIONS.filter(st => favStations.includes(st.code));

  const handleRemoveTrain = (num: string) => {
    const updated = toggleFavouriteTrain(num);
    setFavTrains(updated);
  };

  const handleRemoveStation = (code: string) => {
    const updated = toggleFavouriteStation(code);
    setFavStations(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {t('favourites')}
              </h3>
              <p className="text-[10px] text-amber-200">
                {language === 'hi' ? 'आपकी पसंदीदा ट्रेनें व स्टेशन' : 'Your Starred Trains & Stations'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-amber-800 text-amber-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('trains')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'trains' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <TrainTrack className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पसंदीदा ट्रेनें' : 'Trains'} ({trainsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('stations')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'stations' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पसंदीदा स्टेशन' : 'Stations'} ({stationsList.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {activeTab === 'trains' && (
            <>
              {trainsList.length > 0 ? (
                trainsList.map(tr => (
                  <div
                    key={tr.number}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {tr.number}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {tr.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 mt-1">
                        {language === 'hi' ? tr.nameHi : tr.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {tr.sourceStationCode} ➔ {tr.destinationStationCode} • {tr.durationHours}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectTrain(tr.number);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        <Radio className="w-3 h-3 text-emerald-600" />
                        <span>Live</span>
                      </button>
                      <button
                        onClick={() => handleRemoveTrain(tr.number)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                  <Star className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>{language === 'hi' ? 'कोई पसंदीदा ट्रेन नहीं जोड़ी गई है।' : 'No favourite trains saved yet.'}</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'stations' && (
            <>
              {stationsList.length > 0 ? (
                stationsList.map(st => (
                  <div
                    key={st.code}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {st.code}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1">
                        {language === 'hi' ? st.nameHi : st.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {st.city} • {st.platforms} Platforms
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectStation(st.code);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        <span>Board</span>
                        <ArrowRight className="w-3 h-3 text-amber-700" />
                      </button>
                      <button
                        onClick={() => handleRemoveStation(st.code)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                  <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>{language === 'hi' ? 'कोई पसंदीदा स्टेशन नहीं जोड़ा गया है।' : 'No favourite stations saved yet.'}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
