import React from 'react';
import { Language } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { Home, Radio, Ticket, Building2, LifeBuoy } from 'lucide-react';

export type TabType = 
  | 'home'
  | 'pnr'
  | 'live-status'
  | 'train-search'
  | 'seat-availability'
  | 'route-finder'
  | 'station-info'
  | 'ticket-booking'
  | 'fare-calculator'
  | 'railway-updates'
  | 'emergency-help'
  | 'offline-manager'
  | 'admin-dashboard';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  language,
}) => {
  const t = useTranslation(language);

  const navItems: { id: TabType; labelEn: string; labelHi: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', labelEn: 'Home', labelHi: 'मुख्य', icon: Home },
    { id: 'live-status', labelEn: 'Live Status', labelHi: 'लाइव ट्रेन', icon: Radio },
    { id: 'pnr', labelEn: 'PNR', labelHi: 'पीएनआर', icon: Ticket },
    { id: 'station-info', labelEn: 'Station', labelHi: 'स्टेशन', icon: Building2 },
    { id: 'emergency-help', labelEn: 'Help 139', labelHi: 'रेलमदद', icon: LifeBuoy },
  ];

  return (
    <nav className="bg-[#0b3b2b] text-white border-t border-emerald-900/60 shadow-2xl py-1.5 px-2 safe-area-bottom sticky bottom-0 z-40 select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const label = language === 'hi' ? item.labelHi : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition cursor-pointer relative ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-emerald-300/70 hover:text-emerald-100 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-full transition ${
                  isActive ? 'bg-emerald-950/80 text-amber-400 scale-110 shadow-sm' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                {label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
