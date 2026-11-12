import React from 'react';
import { Language } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { Smartphone, Monitor, Globe, Bell, PhoneCall, TrainTrack, HardDriveDownload, Star, User, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenNotifications: () => void;
  onOpenEmergency: () => void;
  onOpenOfflineManager: () => void;
  onOpenProfile: () => void;
  onOpenFavourites: () => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
  isOnline: boolean;
  unreadAlertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenNotifications,
  onOpenEmergency,
  onOpenOfflineManager,
  onOpenProfile,
  onOpenFavourites,
  onOpenAdmin,
  onGoHome,
  isOnline,
  unreadAlertsCount = 2,
}) => {
  const t = useTranslation(language);

  return (
    <header className="bg-gradient-to-r from-[#0a3828] via-[#0e533c] to-[#0a3828] text-white shadow-md border-b border-emerald-900/50 sticky top-0 z-40">
      {/* Top micro bar for emergency helpline & official compliance */}
      <div className="bg-[#06241a] px-3 py-1 flex items-center justify-between text-[11px] text-emerald-200/90 font-medium border-b border-emerald-950">
        <div className="flex items-center gap-1.5 truncate">
          <span className={`inline-block w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="truncate">
            {isOnline
              ? t('officialDisclaimer')
              : (language === 'hi' ? 'ऑफ़लाइन मोड सक्रिय • डाउनलोड किया डेटा उपयोग हो रहा है' : 'Offline Mode Active • Using Local Cached Railway Data')}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-emerald-200 hover:text-white font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 transition cursor-pointer text-[10px]"
            title="Railway Staff Admin & Operations Console"
          >
            <ShieldCheck className="w-3 h-3 text-amber-300" />
            <span className="hidden xs:inline">Admin</span>
          </button>
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold px-1.5 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/60 transition cursor-pointer"
            title="RailMadad 24x7 Helpline"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>139</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-950/40 text-emerald-950 font-black shrink-0 border border-amber-300">
            <TrainTrack className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white leading-tight">
                {t('appName')}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-emerald-700/80 text-emerald-100 rounded border border-emerald-600/60">
                IR
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/80 font-medium leading-none hidden sm:block">
              {language === 'hi' ? 'भारतीय रेल यात्रा सहायक' : 'Indian Railway Passenger Companion'}
            </p>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Offline Downloads Manager Button */}
          <button
            onClick={onOpenOfflineManager}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer shadow-xs ${
              !isOnline
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                : 'bg-emerald-800/70 hover:bg-emerald-700/70 text-emerald-100 border-emerald-600/50'
            }`}
            title="Manage Offline Downloads & Cache"
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {!isOnline ? (language === 'hi' ? 'ऑफ़लाइन' : 'Offline') : (language === 'hi' ? 'डाउनलोड' : 'Offline')}
            </span>
          </button>

          {/* Favourites Starred Trains & Stations */}
          <button
            onClick={onOpenFavourites}
            className="p-2 rounded-lg bg-emerald-800/40 hover:bg-emerald-700/50 border border-emerald-700/40 text-amber-300 transition cursor-pointer"
            title="Favourite Trains & Stations"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </button>

          {/* Passenger Profile */}
          <button
            onClick={onOpenProfile}
            className="p-2 rounded-lg bg-emerald-800/40 hover:bg-emerald-700/50 border border-emerald-700/40 text-emerald-100 transition cursor-pointer"
            title="Passenger Account & Upcoming Bookings"
          >
            <User className="w-4 h-4 text-emerald-200" />
          </button>

          {/* Notification Alerts */}
          <button
            onClick={onOpenNotifications}
            aria-label="Railway alerts"
            className="relative p-2 rounded-lg bg-emerald-800/40 hover:bg-emerald-700/50 border border-emerald-700/40 text-emerald-100 transition cursor-pointer"
            title="Train Running & Platform Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[9px] flex items-center justify-center animate-bounce">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Bilingual Toggle (EN / हिन्दी) */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/60 border border-emerald-600/40 text-emerald-100 font-semibold text-xs transition cursor-pointer shadow-sm"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold">{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Device Frame View Toggle (Mobile Frame vs Full Screen) */}
          <button
            onClick={onToggleMobileFrame}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/50 text-emerald-200 text-xs font-medium transition cursor-pointer"
            title={isMobileFrame ? t('viewModeDesktop') : t('viewModePhone')}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden lg:inline">{t('viewModeDesktop')}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">{t('viewModePhone')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
