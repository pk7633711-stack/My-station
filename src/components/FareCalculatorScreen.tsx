import React, { useState } from 'react';
import { Language, TravelClass, TrainType } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_STATIONS } from '../data/railwayData';
import { TabType } from './BottomNav';
import {
  Calculator,
  TrainTrack,
  Tag,
  Info,
  CheckCircle2,
  Receipt,
  Sparkles,
} from 'lucide-react';

interface FareCalculatorScreenProps {
  language: Language;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const FareCalculatorScreen: React.FC<FareCalculatorScreenProps> = ({
  language,
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [distanceKm, setDistanceKm] = useState<number>(759);
  const [selectedClass, setSelectedClass] = useState<TravelClass>('3A');
  const [selectedType, setSelectedType] = useState<TrainType>('Superfast');
  const [passengerType, setPassengerType] = useState<'Adult' | 'Child' | 'Senior'>('Adult');

  // Quick corridor presets
  const presets = [
    { name: 'NDLS - BSB (Varanasi)', km: 759 },
    { name: 'HWH - NDLS (Kolkata-Delhi)', km: 1451 },
    { name: 'MMCT - NDLS (Mumbai-Delhi)', km: 1384 },
    { name: 'MAS - SBC (Chennai-Bengaluru)', km: 362 },
    { name: 'PNBE - NDLS (Patna-Delhi)', km: 1001 },
  ];

  // Station-to-station distance calculator state
  const [distFromStation, setDistFromStation] = useState('NDLS');
  const [distToStation, setDistToStation] = useState('BSB');

  // Calculate approximate rail distance using coordinates (Haversine * 1.25 railway curve factor)
  const calcStationDistance = (from: string, to: string) => {
    const s1 = ALL_STATIONS.find(s => s.code === from);
    const s2 = ALL_STATIONS.find(s => s.code === to);
    if (!s1 || !s2) return 759;
    if (from === to) return 0;
    const R = 6371; // Earth radius in km
    const dLat = (s2.latitude - s1.latitude) * Math.PI / 180;
    const dLon = (s2.longitude - s1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(s1.latitude * Math.PI / 180) * Math.cos(s2.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const aerialKm = R * c;
    return Math.round(aerialKm * 1.25); // 25% track winding factor
  };

  const calculatedDist = calcStationDistance(distFromStation, distToStation);

  // Base rate per km by class
  const classBaseRates: Record<TravelClass, number> = {
    '1A': 2.45,
    '2A': 1.45,
    '3A': 1.05,
    '3E': 0.92,
    'CC': 1.15,
    'EC': 2.30,
    'EA': 2.60,
    'SL': 0.38,
    '2S': 0.18,
  };

  const reservationFees: Record<TravelClass, number> = {
    '1A': 60,
    '2A': 50,
    '3A': 40,
    '3E': 40,
    'CC': 40,
    'EC': 60,
    'EA': 60,
    'SL': 20,
    '2S': 15,
  };

  const superfastCharges: Record<TravelClass, number> = {
    '1A': 75,
    '2A': 45,
    '3A': 45,
    '3E': 45,
    'CC': 45,
    'EC': 75,
    'EA': 75,
    'SL': 30,
    '2S': 15,
  };

  // Calculate fare breakdown
  const ratePerKm = classBaseRates[selectedClass] || 1.0;
  let baseFare = Math.round(distanceKm * ratePerKm);

  // Train type adjustments
  if (selectedType === 'Vande Bharat') baseFare = Math.round(baseFare * 1.35);
  else if (selectedType === 'Rajdhani') baseFare = Math.round(baseFare * 1.25);
  else if (selectedType === 'Shatabdi') baseFare = Math.round(baseFare * 1.2);
  else if (selectedType === 'Tejas') baseFare = Math.round(baseFare * 1.3);

  // Passenger age discount
  if (passengerType === 'Child') {
    baseFare = Math.round(baseFare * 0.5);
  }

  const reservationFee = reservationFees[selectedClass] || 40;
  const superfastCharge = selectedType === 'Passenger' ? 0 : superfastCharges[selectedClass] || 45;

  const isAC = ['1A', '2A', '3A', '3E', 'CC', 'EC', 'EA'].includes(selectedClass);
  const taxableAmount = baseFare + reservationFee + superfastCharge;
  const gstAmount = isAC ? Math.round(taxableAmount * 0.05) : 0;
  const totalFare = taxableAmount + gstAmount;

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-sky-100 text-sky-900">
          <Calculator className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {t('fareCalculator')}
          </h1>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'भारतीय रेल दूरी, श्रेणी व जीएसटी आधारित किराया गणना' : 'Official Indian Railway distance, class, surcharge & GST calculation'}
          </p>
        </div>
      </div>

      {/* Interactive Railway Distance Calculator (Section 8 requirement) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrainTrack className="w-4 h-4 text-sky-300" />
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-tight text-white">
              {language === 'hi' ? 'रेलवे दूरी गणक (Distance Calculator)' : 'Railway Distance Calculator'}
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-800 text-sky-200 border border-sky-600/50">
            Broad Gauge 1676mm
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-sky-200 block mb-1">
              {language === 'hi' ? 'प्रारंभिक स्टेशन' : 'From Station'}
            </label>
            <select
              value={distFromStation}
              onChange={(e) => setDistFromStation(e.target.value)}
              className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs focus:bg-slate-900"
            >
              {ALL_STATIONS.map(st => (
                <option key={st.code} value={st.code} className="text-slate-900">
                  {st.code} - {st.city} ({st.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-sky-200 block mb-1">
              {language === 'hi' ? 'गंतव्य स्टेशन' : 'To Station'}
            </label>
            <select
              value={distToStation}
              onChange={(e) => setDistToStation(e.target.value)}
              className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs focus:bg-slate-900"
            >
              {ALL_STATIONS.map(st => (
                <option key={st.code} value={st.code} className="text-slate-900">
                  {st.code} - {st.city} ({st.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated distance summary & Apply CTA */}
        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-sky-200 block">
              {distFromStation} ➔ {distToStation} Rail Route:
            </span>
            <span className="text-lg font-black font-mono text-amber-300">
              {calculatedDist} km
            </span>
          </div>

          <button
            onClick={() => setDistanceKm(calculatedDist)}
            className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-sm"
          >
            {language === 'hi' ? 'किराया गणक में लागू करें' : 'Apply to Fare'}
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        {/* Distance Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">
              {language === 'hi' ? 'यात्रा दूरी (किमी)' : 'Total Journey Distance (km)'}
            </label>
            <span className="font-mono font-bold text-sky-700 text-xs">
              {distanceKm} km
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={3500}
            step={10}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full accent-sky-700 cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
            <span>50 km</span>
            <span>1500 km</span>
            <span>3500 km</span>
          </div>
        </div>

        {/* Quick Corridor Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">Preset:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => setDistanceKm(p.km)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 text-slate-700 font-semibold text-[10px] shrink-0 transition cursor-pointer"
            >
              {p.name} ({p.km} km)
            </button>
          ))}
        </div>

        {/* Class and Train Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              {t('travelClass')}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as TravelClass)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50"
            >
              <option value="1A">First AC (1A)</option>
              <option value="2A">2 Tier AC (2A)</option>
              <option value="3A">3 Tier AC (3A)</option>
              <option value="3E">3 AC Economy (3E)</option>
              <option value="CC">AC Chair Car (CC)</option>
              <option value="EC">Executive Chair Car (EC)</option>
              <option value="SL">Sleeper Class (SL)</option>
              <option value="2S">Second Sitting (2S)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              {language === 'hi' ? 'ट्रेन का प्रकार' : 'Train Category'}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as TrainType)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50"
            >
              <option value="Vande Bharat">Vande Bharat Express</option>
              <option value="Rajdhani">Rajdhani Express</option>
              <option value="Shatabdi">Shatabdi Express</option>
              <option value="Superfast">Superfast Express</option>
              <option value="Express">Mail / Express</option>
              <option value="Passenger">Ordinary Passenger</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              {language === 'hi' ? 'यात्री श्रेणी' : 'Passenger'}
            </label>
            <select
              value={passengerType}
              onChange={(e) => setPassengerType(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50"
            >
              <option value="Adult">Adult (व्यस्क)</option>
              <option value="Child">Child (5-11 yrs - 50%)</option>
              <option value="Senior">Senior Citizen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Itemized Fare Receipt Breakdown */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-tight">
            <Receipt className="w-4 h-4 text-sky-700" />
            <span>{language === 'hi' ? 'किराया विवरण (मदवार)' : 'Itemized Fare Breakdown'}</span>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
            {selectedClass} • {selectedType}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>{language === 'hi' ? `मूल किराया (${distanceKm} किमी)` : `Base Fare (${distanceKm} km)`}</span>
            <span className="font-mono font-bold text-slate-900">₹{baseFare}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>{language === 'hi' ? 'आरक्षण शुल्क' : 'Reservation Charge'}</span>
            <span className="font-mono font-bold text-slate-900">₹{reservationFee}</span>
          </div>

          {superfastCharge > 0 && (
            <div className="flex items-center justify-between text-slate-600">
              <span>{language === 'hi' ? 'सुपरफास्ट सरचार्ज' : 'Superfast Surcharge'}</span>
              <span className="font-mono font-bold text-slate-900">₹{superfastCharge}</span>
            </div>
          )}

          {isAC && (
            <div className="flex items-center justify-between text-slate-600">
              <span>{language === 'hi' ? 'वस्तु एवं सेवा कर (जीएसटी 5%)' : 'Goods & Services Tax (GST 5%)'}</span>
              <span className="font-mono font-bold text-slate-900">₹{gstAmount}</span>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-2 border-t-2 border-dashed border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-slate-900 block uppercase tracking-wide">
                {language === 'hi' ? 'कुल देय किराया' : 'Total Fare Payable'}
              </span>
              <span className="text-[10px] text-slate-400">
                {language === 'hi' ? 'प्रति यात्री (कैटरिंग अतिरिक्त, यदि लागू हो)' : 'Per passenger (Catering extra if selected)'}
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-sky-900">
              ₹{totalFare}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => onNavigate('seat-availability')}
            className="w-full py-2.5 rounded-xl bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>{language === 'hi' ? 'इस श्रेणी में सीटें देखें' : 'Check Seats for this Class'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
