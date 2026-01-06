
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Zap, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Account } from '../types.ts';
import { enrichLeadAI } from '../services/geminiService.ts';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onSubmit: (data: any) => void;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, accounts, onSubmit }) => {
  // Manual Fields
  const [personName, setPersonName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  
  // AI State
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);

  const handleManualEnrich = async () => {
    if (!companyInput || companyInput.length < 3) return;
    setIsEnriching(true);
    try {
      const data = await enrichLeadAI(companyInput);
      setEnrichedData(data);
    } catch (e) {
      console.error("Enrichment failed", e);
    } finally {
      setIsEnriching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name: `AI Workflow Audit: ${enrichedData?.name || companyInput || 'New Lead'}`,
      personName,
      email,
      phone,
      accountId: 'new',
      accountData: enrichedData || {
        name: companyInput,
        domain: companyInput.includes('.') ? companyInput : '',
        industry: 'TBD',
        painPoint: 'Manual entry'
      },
      value: enrichedData?.valueEstimate || 10000,
      tags: ['manual-entry', 'audit']
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4">
      <div className="bg-white rounded-[3.5rem] w-full max-w-5xl shadow-[0_0_120px_rgba(79,70,229,0.3)] overflow-hidden animate-in zoom-in-95 duration-500">
        
        <div className="flex flex-col md:flex-row h-[85vh] md:h-auto">
          {/* Left Side: Smart Form */}
          <div className="flex-1 p-12 space-y-10 border-r border-slate-100">
            <header className="space-y-2">
              <div className="flex items-center gap-3 text-indigo-700 mb-2">
                <Sparkles size={20} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Lead Accelerator v2.0</span>
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">New Lead.</h3>
              <p className="text-slate-600 font-medium">Füll die Basics aus, ich kümmere mich um die Strategie.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information Group */}
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Name der Person"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl text-lg font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    value={personName}
                    onChange={e => setPersonName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                      type="email" 
                      placeholder="E-Mail"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl text-sm font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                      type="tel" 
                      placeholder="Telefonnummer"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl text-sm font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Company Information Group */}
              <div className="pt-6 space-y-4">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Company Intelligence</label>
                <div className="relative group">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Firma oder URL..."
                    className="w-full pl-14 pr-24 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl text-lg font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    value={companyInput}
                    onChange={e => setCompanyInput(e.target.value)}
                    onBlur={handleManualEnrich}
                  />
                  <button 
                    type="button"
                    onClick={handleManualEnrich}
                    disabled={!companyInput || isEnriching}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-30 uppercase tracking-widest"
                  >
                    {isEnriching ? <Loader2 size={14} className="animate-spin" /> : 'Enrich'}
                  </button>
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-8 py-5 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-all"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-slate-900 text-white font-black rounded-[1.5rem] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Zap size={20} fill="white" />
                  <span className="uppercase tracking-widest text-xs">Deal Starten</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Preview & Intelligence */}
          <div className="w-full md:w-[400px] bg-slate-50 p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-8">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Preview</h4>
                  <div className={`w-3 h-3 rounded-full ${isEnriching ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
               </div>

               {enrichedData ? (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-xl mb-4">
                        {enrichedData.name.charAt(0)}
                      </div>
                      <p className="text-xl font-black text-slate-900">{enrichedData.name}</p>
                      <p className="text-xs font-bold text-slate-600 mb-4">{enrichedData.industry}</p>
                      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs font-semibold text-indigo-800 leading-relaxed">
                        "{enrichedData.painPoint}"
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white p-4 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Score</span>
                          <span className="text-lg font-black text-slate-900">85/100</span>
                       </div>
                       <div className="bg-white p-4 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Potential</span>
                          <span className="text-lg font-black text-emerald-700">€{enrichedData.valueEstimate/1000}k</span>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <Building2 size={48} className="text-slate-400" />
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Warte auf Firma...</p>
                 </div>
               )}

               <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Data Enrichment Active
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <Globe size={14} className="text-blue-600" />
                    Global Search Enabled
                  </div>
               </div>
            </div>

            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLeadModal;
