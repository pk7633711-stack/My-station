import React, { useState } from 'react';
import { Language, RailwayComplaint } from '../types/railway';
import { useTranslation } from '../utils/translations';
import { getComplaints, saveComplaint } from '../utils/storage';
import { TabType } from './BottomNav';
import {
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  AlertCircle,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  PackageSearch,
  Phone,
} from 'lucide-react';

interface EmergencyHelpScreenProps {
  language: Language;
  onNavigate: (tab: TabType, extraPayload?: any) => void;
  onGoBack: () => void;
}

export const EmergencyHelpScreen: React.FC<EmergencyHelpScreenProps> = ({
  language,
  onNavigate,
  onGoBack,
}) => {
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'helplines' | 'complaint' | 'lostfound'>('helplines');
  const [complaintsList, setComplaintsList] = useState<RailwayComplaint[]>(getComplaints());

  // Form states
  const [category, setCategory] = useState('Coach Cleanliness / Toilets');
  const [pnrOrTrain, setPnrOrTrain] = useState('');
  const [coachBerth, setCoachBerth] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<RailwayComplaint | null>(null);

  const emergencyContacts = [
    {
      number: '139',
      titleEn: 'RailMadad Integrated Helpline (24x7)',
      titleHi: 'रेलमदद एकीकृत हेल्पलाइन (24x7)',
      descEn: 'Single toll-free window for Security, Medical, Coach Maintenance, Catering & Enquiries',
      descHi: 'सुरक्षा, चिकित्सा, कोच रखरखाव, भोजन व सामान्य पूछताछ के लिए एकल नंबर',
      color: 'bg-red-600 hover:bg-red-700 text-white',
      badge: 'All-in-One SOS',
    },
    {
      number: '182',
      titleEn: 'RPF Railway Security Helpline',
      titleHi: 'रेलवे सुरक्षा बल (RPF)',
      descEn: 'Immediate security assistance against theft, harassment or onboard danger',
      descHi: 'चोरी, उत्पीड़न अथवा ट्रेन में असामाजिक तत्वों से त्वरित सुरक्षा',
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    {
      number: '112',
      titleEn: 'National Emergency Response (All India)',
      titleHi: 'राष्ट्रीय आपातकालीन सेवा (112)',
      descEn: 'Police, Ambulance and Disaster Management assistance',
      descHi: 'पुलिस, एम्बुलेंस व आपदा प्रबंधन सहायता',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      number: '1512',
      titleEn: 'GRP (Government Railway Police)',
      titleHi: 'जीआरपी (राजकीय रेलवे पुलिस)',
      descEn: 'FIR filing, station crime reporting and jurisdictional assistance',
      descHi: 'स्टेशन अपराध, प्राथमिकी दर्ज कराने व कानूनी सहायता',
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    {
      number: '1072',
      titleEn: 'Railway Accident / Disaster Enquiry',
      titleHi: 'रेल दुर्घटना / आपदा सूचना केंद्र',
      descEn: 'Special emergency line activated for train incident status and passenger care',
      descHi: 'रेल दुर्घटना राहत एवं यात्री स्थिति जानकारी',
      color: 'bg-slate-700 hover:bg-slate-800 text-white',
    },
  ];

  const handleRegisterComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const refId = `RM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const newRecord: RailwayComplaint = {
        id: String(Date.now()),
        referenceId: refId,
        category,
        pnrOrTrain: pnrOrTrain || '22436',
        coachBerth: coachBerth || 'B4 / 24',
        description,
        submittedAt: 'Just now',
        status: 'Registered',
        resolutionNote: 'Assigned to Divisional Onboard Housekeeping Staff (OBHS) / Control Office.',
      };

      saveComplaint(newRecord);
      setComplaintsList(getComplaints());
      setSubmittedComplaint(newRecord);
      setIsSubmitting(false);

      // Reset form
      setDescription('');
      setCoachBerth('');
    }, 700);
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-red-100 text-red-900">
          <PhoneCall className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {t('emergencyHelp')}
          </h1>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'रेलमदद 139, आरपीएफ 182, चिकित्सा व त्वरित शिकायत' : 'RailMadad 139, security, onboard medical assistance & grievance'}
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('helplines')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'helplines'
              ? 'bg-red-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'हेल्पलाइन नंबर' : 'Helplines'}</span>
        </button>
        <button
          onClick={() => setActiveTab('complaint')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'complaint'
              ? 'bg-red-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'शिकायत / मदद दर्ज करें' : 'File Complaint'}</span>
        </button>
        <button
          onClick={() => setActiveTab('lostfound')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'lostfound'
              ? 'bg-red-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PackageSearch className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'खोया-पाया' : 'Lost & Found'}</span>
        </button>
      </div>

      {/* Tab 1: Direct Dial Helplines */}
      {activeTab === 'helplines' && (
        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.number}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black px-2.5 py-0.5 rounded-lg bg-red-100 text-red-950 border border-red-200">
                    {contact.number}
                  </span>
                  {contact.badge && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {contact.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {language === 'hi' ? contact.titleHi : contact.titleEn}
                </h3>
                <p className="text-xs text-slate-500 leading-tight">
                  {language === 'hi' ? contact.descHi : contact.descEn}
                </p>
              </div>

              <a
                href={`tel:${contact.number}`}
                className={`px-4 py-2.5 rounded-xl font-black text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition ${contact.color}`}
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'hi' ? 'कॉल करें' : 'Call'}</span>
              </a>
            </div>
          ))}

          {/* Onboard Medical Care Protocol Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-300" />
              <h3 className="font-bold text-sm text-white">
                {language === 'hi' ? 'चलती ट्रेन में चिकित्सा आपातकाल प्रोटोकॉल' : 'Onboard Medical Emergency Guide'}
              </h3>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              {language === 'hi'
                ? 'यदि चलती ट्रेन में किसी सह-यात्री को तत्काल डॉक्टर की आवश्यकता हो, तो तुरंत 139 पर कॉल करें या ट्रेन टीटीई / गार्ड को सूचित करें। अगले प्रमुख स्टेशन पर रेलवे डॉक्टर व एम्बुलेंस तैयार रहेगी।'
                : 'Dial 139 or alert the Train Ticket Examiner (TTE) / Guard immediately. A railway doctor and ambulance will be stationed at the next upcoming halt.'}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: File Railway Grievance / Complaint Form */}
      {activeTab === 'complaint' && (
        <div className="space-y-4">
          <form
            onSubmit={handleRegisterComplaint}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-black uppercase tracking-tight text-slate-800">
                {language === 'hi' ? 'रेलमदद ऑनलाइन शिकायत पंजीकरण' : 'RailMadad Passenger Grievance Registration'}
              </h3>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {language === 'hi' ? 'समस्या की श्रेणी' : 'Issue Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50"
              >
                <option value="Coach Cleanliness / Toilets">Coach Cleanliness / Toilets (सफाई)</option>
                <option value="Water Availability">Water Shortage in Coach / Washroom (पानी की कमी)</option>
                <option value="AC Failure / Electrical">Air Conditioner / Fan / Charging Port Failure</option>
                <option value="Bedroll & Linen Quality">Bedroll & Linen Quality (चादर व कंबल)</option>
                <option value="Pantry / Catering Food Quality">Pantry & Food Quality (खान-पान)</option>
                <option value="Security Assistance">Security & Co-passenger Harassment (सुरक्षा)</option>
                <option value="Divyangjan Assistance">Wheelchair / Divyangjan Care</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {language === 'hi' ? 'पीएनआर या ट्रेन नंबर' : 'PNR or Train Number'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 22436 or 10-digit PNR"
                  value={pnrOrTrain}
                  onChange={(e) => setPnrOrTrain(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {language === 'hi' ? 'कोच व बर्थ संख्या' : 'Coach & Berth Number'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. B4 / 32"
                  value={coachBerth}
                  onChange={(e) => setCoachBerth(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {language === 'hi' ? 'समस्या का संक्षिप्त विवरण' : 'Description of Grievance'}
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'अपनी समस्या का विवरण यहाँ लिखें (जैसे: कोच बी4 के टॉयलेट में पानी नहीं आ रहा है)...'
                    : 'Describe the issue (e.g., No water in coach B4 toilet or charging socket loose)...'
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-red-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('fileComplaint')}</span>
                </>
              )}
            </button>
          </form>

          {/* Success Banner if complaint registered */}
          {submittedComplaint && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t('complaintSubmitted')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('trackComplaint')}:</span>
                  <span className="font-mono font-black text-emerald-800 text-sm">
                    {submittedComplaint.referenceId}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  {submittedComplaint.resolutionNote}
                </div>
              </div>
            </div>
          )}

          {/* Past Complaints History */}
          {complaintsList.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                {language === 'hi' ? 'आपकी हालिया शिकायतें' : 'Your Recent Grievances'}
              </h4>
              <div className="space-y-2">
                {complaintsList.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-slate-900 text-[11px]">
                        {c.referenceId}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {c.status}
                      </span>
                    </div>
                    <div className="font-bold text-slate-800">{c.category}</div>
                    <p className="text-[11px] text-slate-500">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Lost & Found Assistance */}
      {activeTab === 'lostfound' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <PackageSearch className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-800">
              {t('lostAndFound')}
            </h3>
          </div>

          <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
              <h4 className="font-bold text-purple-950 mb-1">
                {language === 'hi' ? 'ट्रेन में सामान छूट जाने पर तुरंत क्या करें?' : 'Lost Baggage on Train Protocol:'}
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-purple-900">
                <li>{language === 'hi' ? 'तुरंत 139 डायल करें और विकल्प 6 (खोया-पाया) चुनें।' : 'Call 139 immediately and select Lost & Found.'}</li>
                <li>{language === 'hi' ? 'अपना पीएनआर, कोच और बर्थ नंबर स्पष्ट बताएं।' : 'Provide your PNR, Coach number and Berth number.'}</li>
                <li>{language === 'hi' ? 'आरपीएफ अगले स्टेशन पर कोच अटेंडेंट से संपर्क कर सामान सुरक्षित करेगी।' : 'RPF escort staff at next station retrieves and secures the article.'}</li>
              </ol>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'स्टेशन मास्टर क्लॉक रूम से दावा:' : 'Claiming from Station Master Office:'}
              </h4>
              <p className="text-[11px] text-slate-600">
                {language === 'hi'
                  ? 'बरामद सामान स्टेशन मास्टर या आरपीएफ पोस्ट के सुरक्षित लॉकर में जमा होता है। वैध पहचान पत्र और टिकट दिखाकर सामान प्राप्त किया जा सकता है।'
                  : 'Retrieved items are deposited in the custody of the Station Director / RPF Post. Claim with valid Government Photo ID and journey ticket.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
