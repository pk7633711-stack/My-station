import React, { useState } from 'react';
import { Language } from '../types/railway';
import { useTranslation } from '../utils/translations';
import {
  User,
  X,
  ShieldCheck,
  Ticket,
  Heart,
  Phone,
  Mail,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
} from 'lucide-react';

interface UserProfileModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPnr: (pnr: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  language,
  isOpen,
  onClose,
  onNavigateToPnr,
}) => {
  const t = useTranslation(language);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [passengerName, setPassengerName] = useState('Ranjan Prasad');
  const [irctcUsername, setIrctcUsername] = useState('ranjan_rail_7');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOtpSent(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a3828] to-[#0e533c] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {language === 'hi' ? 'यात्री प्रोफ़ाइल व लॉगिन' : 'Passenger Profile & Sign In'}
              </h3>
              <p className="text-[10px] text-emerald-200">
                {language === 'hi' ? 'आईआरसीटीसी अधिकृत यात्री खाता' : 'IRCTC Authorized Passenger Account'}
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

        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {isLoggedIn ? (
            <div className="space-y-4">
              {/* User Identity Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-base shadow-sm">
                      RP
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 leading-tight">
                        {passengerName}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        +91 {mobileNumber}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">IRCTC User ID</span>
                    <span className="font-mono font-extrabold text-slate-800">{irctcUsername}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Passenger Quota</span>
                    <span className="font-extrabold text-emerald-800">General (GN)</span>
                  </div>
                </div>
              </div>

              {/* Quick Booked Journeys */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'hi' ? 'आपकी आगामी यात्राएं' : 'Your Upcoming Journeys'}</span>
                </h4>

                <div
                  onClick={() => {
                    onNavigateToPnr('2458912340');
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 hover:border-blue-400 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-blue-900">PNR 2458912340</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900">
                        CNF
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-slate-900 mt-0.5">
                      22436 - Vande Bharat Express
                    </div>
                    <div className="text-[10px] text-slate-500">
                      NDLS ➔ BSB • Coach C4 / 28
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </div>
              </div>

              {/* Master Passenger List */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === 'hi' ? 'सहेजे गए सह-यात्री (Tatkal Fast-Fill)' : 'Saved Co-Passengers (Fast Tatkal Booking)'}
                </span>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                  <span className="font-bold text-slate-800">1. Ranjan Prasad (38, Male)</span>
                  <span className="text-[10px] font-mono text-slate-500">Berth: Lower</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                  <span className="font-bold text-slate-800">2. Priya Sharma (34, Female)</span>
                  <span className="text-[10px] font-mono text-slate-500">Berth: Window</span>
                </div>
              </div>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लॉगआउट करें' : 'Sign Out'}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {language === 'hi' ? 'सुरक्षित यात्री साइन-इन' : 'Secure Passenger Sign-In'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'hi' ? 'ओटीपी सत्यापन के माध्यम से तुरंत लॉगिन करें' : 'Sign in via Mobile OTP or IRCTC ID'}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-900"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Enter OTP (Sent via SMS)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono tracking-widest font-bold text-center text-sm text-slate-900"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>{otpSent ? (language === 'hi' ? 'सत्यापित करें' : 'Verify & Sign In') : (language === 'hi' ? 'ओटीपी भेजें' : 'Send OTP')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
