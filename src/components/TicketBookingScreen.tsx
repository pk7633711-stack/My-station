import React, { useState, useEffect } from 'react';
import { Language, TravelClass } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { CANCELLATION_RULES } from '../data/railwayData';
import { TabType } from './BottomNav';
import {
  CalendarCheck2,
  ExternalLink,
  Clock,
  Calculator,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  RefreshCw,
  FileText,
} from 'lucide-react';

interface TicketBookingScreenProps {
  language: Language;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const TicketBookingScreen: React.FC<TicketBookingScreenProps> = ({
  language,
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [calculatorFare, setCalculatorFare] = useState<number>(1850);
  const [selectedClass, setSelectedClass] = useState<TravelClass>('3A');
  const [cancellationTimeframe, setCancellationTimeframe] = useState<string>('gt48');
  const [calculatedRefund, setCalculatedRefund] = useState<{ deduction: number; refund: number } | null>(null);

  // Tatkal Countdown Timer Calculation
  const [timeToAcTatkal, setTimeToAcTatkal] = useState<string>('');
  const [timeToNonAcTatkal, setTimeToNonAcTatkal] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Calculate next 10:00 AM (AC Tatkal)
      const acTarget = new Date();
      acTarget.setHours(10, 0, 0, 0);
      if (now.getTime() > acTarget.getTime()) {
        acTarget.setDate(acTarget.getDate() + 1);
      }
      const diffAc = Math.max(0, acTarget.getTime() - now.getTime());
      const hoursAc = Math.floor(diffAc / (1000 * 60 * 60));
      const minsAc = Math.floor((diffAc % (1000 * 60 * 60)) / (1000 * 60));
      const secsAc = Math.floor((diffAc % (1000 * 60)) / 1000);
      setTimeToAcTatkal(`${hoursAc}h ${minsAc}m ${secsAc}s`);

      // Calculate next 11:00 AM (Non-AC Tatkal)
      const nonAcTarget = new Date();
      nonAcTarget.setHours(11, 0, 0, 0);
      if (now.getTime() > nonAcTarget.getTime()) {
        nonAcTarget.setDate(nonAcTarget.getDate() + 1);
      }
      const diffNonAc = Math.max(0, nonAcTarget.getTime() - now.getTime());
      const hoursNonAc = Math.floor(diffNonAc / (1000 * 60 * 60));
      const minsNonAc = Math.floor((diffNonAc % (1000 * 60 * 60)) / (1000 * 60));
      const secsNonAc = Math.floor((diffNonAc % (1000 * 60)) / 1000);
      setTimeToNonAcTatkal(`${hoursNonAc}h ${minsNonAc}m ${secsNonAc}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateRefundAmount = () => {
    let deduction = 0;
    const flatRates: Record<TravelClass, number> = {
      '1A': 240,
      'EC': 240,
      'EA': 240,
      '2A': 200,
      '3A': 180,
      '3E': 180,
      'CC': 180,
      'SL': 120,
      '2S': 60,
    };

    const flatRate = flatRates[selectedClass] || 120;

    if (cancellationTimeframe === 'gt48') {
      deduction = flatRate;
    } else if (cancellationTimeframe === '48to12') {
      deduction = Math.max(flatRate, Math.round(calculatorFare * 0.25));
    } else if (cancellationTimeframe === '12to4') {
      deduction = Math.max(flatRate, Math.round(calculatorFare * 0.5));
    } else if (cancellationTimeframe === 'lt4') {
      deduction = calculatorFare;
    } else if (cancellationTimeframe === 'wl_rac') {
      deduction = 60;
    }

    const refund = Math.max(0, calculatorFare - deduction);
    setCalculatedRefund({ deduction, refund });
  };

  useEffect(() => {
    calculateRefundAmount();
  }, [calculatorFare, selectedClass, cancellationTimeframe]);

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-rose-100 text-rose-900">
          <CalendarCheck2 className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {t('ticketBooking')}
          </h1>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'आईआरसीटीसी अधिकृत बुकिंग, तत्काल टाइमर व रिफंड गणक' : 'IRCTC Authorized booking link, Tatkal countdown & refund calculator'}
          </p>
        </div>
      </div>

      {/* Official IRCTC Gateway Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-700 via-rose-800 to-red-900 text-white shadow-md space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/20 text-white border border-white/30 uppercase">
                Official IRCTC Portal
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
              {language === 'hi' ? 'भारतीय रेल अधिकृत टिकट बुकिंग' : 'Indian Railways Official Booking'}
            </h2>
            <p className="text-xs text-rose-100 mt-0.5 leading-relaxed">
              {language === 'hi'
                ? 'सुरक्षित व आधिकारिक टिकट आरक्षण केवल IRCTC की वेबसाइट व ऐप पर उपलब्ध है।'
                : 'Direct, secure booking with live zero-brokerage ticketing is authorized via IRCTC.'}
            </p>
          </div>
        </div>

        {/* CTA Launch Button */}
        <a
          href="https://www.irctc.co.in/nget/train-search"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white text-red-900 hover:bg-rose-50 font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
        >
          <span>{t('openOfficialIrctc')}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Live Tatkal Countdown Windows */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-tight">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{t('tatkalCounter')}</span>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            1 Day Prior to Journey
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* AC Tatkal */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-amber-950">
                AC Tatkal (1A, 2A, 3A, CC, EC)
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                10:00 AM IST
              </span>
            </div>
            <div className="text-lg font-mono font-black text-amber-900">
              {timeToAcTatkal || '10:00 AM'}
            </div>
            <p className="text-[10px] text-amber-800">
              {language === 'hi' ? 'अगली एसी तत्काल बुकिंग विंडो खुलने में शेष समय' : 'Time remaining until next AC Tatkal opens'}
            </p>
          </div>

          {/* Non-AC Tatkal */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-blue-950">
                Non-AC Tatkal (Sleeper & 2S)
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-900">
                11:00 AM IST
              </span>
            </div>
            <div className="text-lg font-mono font-black text-blue-900">
              {timeToNonAcTatkal || '11:00 AM'}
            </div>
            <p className="text-[10px] text-blue-800">
              {language === 'hi' ? 'स्लीपर तत्काल बुकिंग विंडो खुलने में शेष समय' : 'Time remaining until next Sleeper Tatkal opens'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Refund & Cancellation Calculator (Section 4 requirement) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-tight">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>{t('refundCalculator')}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            {language === 'hi' ? 'रेलवे बोर्ड नियम 2024' : 'Railway Board Rules'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Total Fare Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              {t('enterTicketFare')}
            </label>
            <input
              type="number"
              value={calculatorFare}
              onChange={(e) => setCalculatorFare(Math.max(0, Number(e.target.value)))}
              className="w-full p-2 rounded-xl border border-slate-200 font-bold text-sm text-slate-900"
            />
          </div>

          {/* Class Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              {t('travelClass')}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as TravelClass)}
              className="w-full p-2 rounded-xl border border-slate-200 font-semibold text-xs sm:text-sm text-slate-900 bg-slate-50"
            >
              <option value="1A">First AC (1A) / EC</option>
              <option value="2A">2 Tier AC (2A)</option>
              <option value="3A">3 Tier AC (3A) / CC</option>
              <option value="SL">Sleeper Class (SL)</option>
              <option value="2S">Second Sitting (2S)</option>
            </select>
          </div>

          {/* Timeframe of cancellation */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              {language === 'hi' ? 'रद्द करने का समय' : 'Cancellation Time'}
            </label>
            <select
              value={cancellationTimeframe}
              onChange={(e) => setCancellationTimeframe(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 bg-slate-50"
            >
              <option value="gt48">&gt; 48 hrs before departure</option>
              <option value="48to12">48 hrs to 12 hrs before</option>
              <option value="12to4">12 hrs to 4 hrs before</option>
              <option value="lt4">&lt; 4 hrs / Chart Prepared</option>
              <option value="wl_rac">Waitlisted / RAC Ticket</option>
            </select>
          </div>
        </div>

        {/* Calculation Result */}
        {calculatedRefund && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">
                {t('eligibleRefund')}:
              </span>
              <span className="text-xl font-mono font-black text-emerald-800">
                ₹{calculatedRefund.refund}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">
                {language === 'hi' ? 'कटौती शुल्क (क्लर्केज):' : 'Deduction / Clerkage:'}
              </span>
              <span className="text-sm font-mono font-bold text-rose-700">
                -₹{calculatedRefund.deduction}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Official Railway Refund Policy Chart */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-black uppercase tracking-tight text-slate-800 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-700" />
          <span>{t('cancellationRefundRules')}</span>
        </h3>

        <div className="space-y-2">
          {CANCELLATION_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1 text-xs"
            >
              <div className="font-bold text-slate-900">
                {language === 'hi' ? rule.timingHi : rule.timing}
              </div>
              <div className="text-[11px] text-slate-600">
                {language === 'hi' ? rule.clerkageHi : rule.clerkage}
              </div>
              <div className="text-[10px] font-extrabold text-emerald-700">
                {rule.refundPct}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
