import React, { useState } from 'react';
import { Language, RailwayUpdate, RailwayZone } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { RAILWAY_UPDATES, RAILWAY_ZONES } from '../data/railwayData';
import { TabType } from './BottomNav';
import {
  BellRing,
  Sparkles,
  Map,
  AlertTriangle,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface RailwayUpdatesScreenProps {
  language: Language;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const RailwayUpdatesScreen: React.FC<RailwayUpdatesScreenProps> = ({
  language,
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [activeSection, setActiveSection] = useState<'updates' | 'zones'>('updates');
  const [expandedZone, setExpandedZone] = useState<string | null>('NR');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Festival', 'Vande Bharat', 'Policy', 'Mega Block'];

  const filteredUpdates = RAILWAY_UPDATES.filter(u =>
    filterCategory === 'All' || u.category === filterCategory
  );

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-teal-100 text-teal-900">
          <BellRing className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {t('railwayUpdates')}
          </h1>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'विशेष ट्रेनें, मेगा ब्लॉक, प्रेस विज्ञप्तियां व 18 रेलवे ज़ोन' : 'Special train bulletins, mega blocks, notices & 18 Railway Zones'}
          </p>
        </div>
      </div>

      {/* Segment Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveSection('updates')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSection === 'updates'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'समाचार व विशेष ट्रेनें' : 'News & Special Trains'}</span>
        </button>
        <button
          onClick={() => setActiveSection('zones')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSection === 'zones'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? '18 रेलवे ज़ोन व मंडल' : '18 Zones & Divisions'}</span>
        </button>
      </div>

      {/* Section 1: Bulletins and News */}
      {activeSection === 'updates' && (
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat === 'All' ? (language === 'hi' ? 'सभी अपडेट' : 'All Updates') : cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredUpdates.map((update) => (
              <div
                key={update.id}
                className={`p-4 rounded-2xl bg-white border shadow-sm transition space-y-2 ${
                  update.isImportant ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        update.category === 'Festival'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : update.category === 'Mega Block'
                          ? 'bg-rose-100 text-rose-900 border border-rose-200'
                          : 'bg-teal-100 text-teal-900 border border-teal-200'
                      }`}
                    >
                      {update.category}
                    </span>
                    {update.isImportant && (
                      <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 fill-amber-400" />
                        Important
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{update.date}</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {language === 'hi' ? update.titleHi : update.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi' ? update.summaryHi : update.summary}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                  {language === 'hi' ? update.detailsHi : update.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: 18 Zones and Divisions */}
      {activeSection === 'zones' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p>
              {language === 'hi'
                ? 'भारतीय रेल 18 ज़ोनों (मंडलों) और 70 डिवीजनों में विभाजित है। नीचे प्रत्येक ज़ोन का मुख्यालय व मंडल देखें।'
                : 'Indian Railways operates through 18 Administrative Zones spanning 68,000+ route km across 70 divisions.'}
            </p>
          </div>

          <div className="space-y-2">
            {RAILWAY_ZONES.map((zone) => {
              const isExpanded = expandedZone === zone.code;

              return (
                <div
                  key={zone.code}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedZone(isExpanded ? null : zone.code)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-xs px-2 py-1 rounded-lg bg-teal-100 text-teal-900 border border-teal-200">
                        {zone.code}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {language === 'hi' ? zone.nameHi : zone.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          HQ: <span className="font-semibold text-slate-800">{zone.headquarters}</span> • {zone.routeKm} km
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 pt-0 bg-slate-50/70 border-t border-slate-100 text-xs space-y-2">
                      <div className="text-[11px] font-bold text-slate-600">
                        {language === 'hi' ? 'इस ज़ोन के प्रमुख मंडल (Divisions):' : 'Railway Divisions in this Zone:'}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {zone.divisions.map((div) => (
                          <span
                            key={div}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium text-[11px] shadow-xs"
                          >
                            {div}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
