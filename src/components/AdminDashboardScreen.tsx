import React, { useState } from 'react';
import { Language, RailwayComplaint, RailwayUpdate, Train } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { ALL_TRAINS, RAILWAY_UPDATES } from '../data/railwayData';
import { getComplaints, saveComplaint } from '../utils/storage';
import { TabType } from './BottomNav';
import {
  ShieldCheck,
  Radio,
  BellRing,
  FileText,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  TrainTrack,
  Users,
  Settings,
} from 'lucide-react';

interface AdminDashboardScreenProps {
  language: Language;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  language,
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [activeAdminTab, setActiveAdminTab] = useState<'grievances' | 'platform' | 'announcements'>('grievances');
  const [complaints, setComplaints] = useState<RailwayComplaint[]>(() => {
    const existing = getComplaints();
    if (existing.length > 0) return existing;
    return [
      {
        id: 'c-1',
        referenceId: 'RM-2026-441829',
        category: 'Coach Cleanliness / Toilets',
        pnrOrTrain: '22436',
        coachBerth: 'C4 / 28',
        description: 'Bio-toilet water pressure low near Kanpur section.',
        submittedAt: '25 mins ago',
        status: 'In Progress',
        resolutionNote: 'Onboard Housekeeping Staff (OBHS) notified. Attendant dispatched.',
      },
      {
        id: 'c-2',
        referenceId: 'RM-2026-918230',
        category: 'Air Conditioner / Electrical',
        pnrOrTrain: '12301',
        coachBerth: 'B3 / 14',
        description: 'AC cooling temperature high in coupe 2.',
        submittedAt: '40 mins ago',
        status: 'Resolved',
        resolutionNote: 'AC mechanic reset compressor at Mughalsarai (DDU) junction.',
      },
    ];
  });

  // Platform Change state
  const [selectedTrainNum, setSelectedTrainNum] = useState('12301');
  const [newPlatform, setNewPlatform] = useState('1');
  const [targetStation, setTargetStation] = useState('PRYJ');
  const [broadcastMsg, setBroadcastMsg] = useState<string | null>(null);

  // New Announcement state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Special Train' | 'Festival' | 'Mega Block'>('Festival');
  const [newSummary, setNewSummary] = useState('');
  const [announcementList, setAnnouncementList] = useState<RailwayUpdate[]>(RAILWAY_UPDATES);

  const handleUpdateComplaintStatus = (id: string, newStatus: 'In Progress' | 'Resolved') => {
    const updated = complaints.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          resolutionNote: newStatus === 'Resolved'
            ? 'Resolved and confirmed by Divisional Control Officer.'
            : 'OBHS team attending to grievance.',
        };
      }
      return c;
    });
    setComplaints(updated);
  };

  const handleBroadcastPlatformChange = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastMsg(
      language === 'hi'
        ? `प्लेटफार्म परिवर्तन अलर्ट प्रसारित: ट्रेन ${selectedTrainNum} अब ${targetStation} पर प्लेटफार्म ${newPlatform} पर आएगी!`
        : `Platform change broadcasted: Train ${selectedTrainNum} assigned to Platform ${newPlatform} at ${targetStation}!`
    );
    setTimeout(() => setBroadcastMsg(null), 3500);
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newUpd: RailwayUpdate = {
      id: `upd-${Date.now()}`,
      title: newTitle,
      titleHi: newTitle,
      category: newCategory,
      date: 'Just now',
      summary: newSummary || 'New railway advisory published by Northern Railway Operations.',
      summaryHi: newSummary || 'रेलवे संचालन मंडल द्वारा नया आधिकारिक नोटिस जारी।',
      details: 'Published through Indian Railway CRIS / RailMadad Administrative Portal.',
      detailsHi: 'भारतीय रेल परिचालन नियंत्रण केंद्र द्वारा अधिकृत सूचना।',
      isImportant: true,
    };

    setAnnouncementList([newUpd, ...announcementList]);
    setNewTitle('');
    setNewSummary('');
    setBroadcastMsg(language === 'hi' ? 'विशेष ट्रेन सूचना प्रकाशित हो गई!' : 'Special announcement published successfully!');
    setTimeout(() => setBroadcastMsg(null), 3000);
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Admin Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {language === 'hi' ? 'रेलवे प्रशासनिक नियंत्रण केंद्र (Admin)' : 'Railway Operations & Admin Console'}
              </h1>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono">
                STAFF SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi'
                ? 'रेलमदद शिकायत निवारण, लाइव प्लेटफार्म आवंटन व विशेष ट्रेनें'
                : 'RailMadad grievance resolution, live platform assignment & bulletins'}
            </p>
          </div>
        </div>
      </div>

      {/* Broadcast Toast Notification */}
      {broadcastMsg && (
        <div className="p-3 rounded-xl bg-emerald-800 text-white text-xs font-bold text-center animate-fade-in shadow-md flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{broadcastMsg}</span>
        </div>
      )}

      {/* Admin Stats Row */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            {language === 'hi' ? 'लंबित शिकायतें' : 'Open Grievances'}
          </span>
          <span className="text-xl font-black font-mono text-red-600">
            {complaints.filter(c => c.status !== 'Resolved').length}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            {language === 'hi' ? 'सक्रिय ट्रेनें' : 'Active Trains'}
          </span>
          <span className="text-xl font-black font-mono text-emerald-700">
            {ALL_TRAINS.length}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            {language === 'hi' ? 'सुलझाई गई' : 'Resolved Today'}
          </span>
          <span className="text-xl font-black font-mono text-blue-700">
            {complaints.filter(c => c.status === 'Resolved').length}
          </span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-extrabold">
        <button
          onClick={() => setActiveAdminTab('grievances')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeAdminTab === 'grievances' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'रेलमदद शिकायतें' : 'RailMadad Tickets'}</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('platform')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeAdminTab === 'platform' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'प्लेटफार्म ब्रॉडकास्ट' : 'Platform Alert'}</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('announcements')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeAdminTab === 'announcements' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'विशेष ट्रेन घोषणा' : 'Publish Specials'}</span>
        </button>
      </div>

      {/* Tab 1: RailMadad Grievances Management */}
      {activeAdminTab === 'grievances' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span>{language === 'hi' ? 'यात्री शिकायतें (डिवीजनल फीड)' : 'Passenger Grievances (Live Divisional Feed)'}</span>
            <span>{complaints.length} Total</span>
          </div>

          {complaints.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-900">
                      {c.referenceId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1">
                    {c.category}
                  </h4>
                </div>

                <span className="text-[10px] text-slate-400 font-semibold">{c.submittedAt}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-600">Train / PNR: {c.pnrOrTrain}</span>
                  <span className="font-mono font-bold text-slate-900">Coach: {c.coachBerth}</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">"{c.description}"</p>
                {c.resolutionNote && (
                  <div className="text-[10px] text-emerald-800 font-medium pt-1 border-t border-slate-200">
                    <span className="font-bold">Action Note:</span> {c.resolutionNote}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {c.status !== 'In Progress' && c.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdateComplaintStatus(c.id, 'In Progress')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    Assign OBHS Staff
                  </button>
                )}
                {c.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdateComplaintStatus(c.id, 'Resolved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Resolved</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Live Platform Assignment & Broadcast */}
      {activeAdminTab === 'platform' && (
        <form
          onSubmit={handleBroadcastPlatformChange}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Radio className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-800">
              {language === 'hi' ? 'लाइव प्लेटफार्म परिवर्तन प्रसारण' : 'Broadcast Live Platform Change'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {language === 'hi' ? 'ट्रेन चुनें' : 'Select Train'}
              </label>
              <select
                value={selectedTrainNum}
                onChange={(e) => setSelectedTrainNum(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-900 bg-slate-50"
              >
                {ALL_TRAINS.map(tr => (
                  <option key={tr.number} value={tr.number}>
                    {tr.number} - {tr.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {language === 'hi' ? 'स्टेशन कोड' : 'Station Code'}
              </label>
              <input
                type="text"
                value={targetStation}
                onChange={(e) => setTargetStation(e.target.value.toUpperCase())}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {language === 'hi' ? 'नया प्लेटफार्म नंबर' : 'New Platform #'}
              </label>
              <input
                type="text"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-black text-xs text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>{language === 'hi' ? 'यात्रियों को तत्काल अलर्ट भेजें' : 'Broadcast Platform Change Alert'}</span>
          </button>
        </form>
      )}

      {/* Tab 3: Publish Special Trains & Bulletins */}
      {activeAdminTab === 'announcements' && (
        <form
          onSubmit={handlePublishAnnouncement}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <BellRing className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-800">
              {language === 'hi' ? 'नई त्योहार स्पेशल ट्रेन या नोटिस जारी करें' : 'Publish Special Train or Mega Block Notice'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {language === 'hi' ? 'शीर्षक' : 'Announcement Title'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 100+ Diwali / Chhath Special Trains"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {language === 'hi' ? 'श्रेणी' : 'Category'}
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-900 bg-slate-50"
              >
                <option value="Festival">Festival Special (त्योहार स्पेशल)</option>
                <option value="Special Train">New Train Service</option>
                <option value="Mega Block">Mega Block / Route Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              {language === 'hi' ? 'विवरण' : 'Summary & Coach Details'}
            </label>
            <textarea
              rows={2}
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="e.g. Extra 3AC and Sleeper coaches attached. Advance booking starts tomorrow 08:00 AM."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'hi' ? 'नोटिस प्रकाशित करें' : 'Publish Advisory to Passenger Hub'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
