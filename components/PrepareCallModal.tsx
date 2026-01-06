
import React, { useState } from 'react';
import { X, Zap, Loader2, CheckCircle2, Copy, Save, RefreshCw } from 'lucide-react';
import { Deal, Account } from '../types';

interface PrepareCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (depth: 'Quick' | 'Standard' | 'Deep') => Promise<any>;
  deal: Deal;
  account: Account;
}

const PrepareCallModal: React.FC<PrepareCallModalProps> = ({ isOpen, onClose, onGenerate, deal, account }) => {
  const [depth, setDepth] = useState<'Quick' | 'Standard' | 'Deep'>('Standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await onGenerate(depth);
      setResult(data);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Prepare Call: {account.name}</h3>
              <p className="text-slate-500 text-sm">AI-driven briefing & discovery package</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-xl transition-all">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {!result ? (
            <div className="max-w-xl mx-auto space-y-8">
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Select Research Depth</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(['Quick', 'Standard', 'Deep'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDepth(d)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${depth === d ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                    >
                      <span className="block font-bold mb-1">{d}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                        {d === 'Quick' ? '2 min' : d === 'Standard' ? '5 min' : '15 min'} research
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900">Context Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Deal Focus</span>
                    <span className="font-bold text-slate-700">{deal.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Last Note</span>
                    <span className="font-bold text-slate-700">Client interested in Audit</span>
                  </div>
                </div>
              </section>

              <button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating your Command Center...
                  </>
                ) : (
                  <>
                    <Zap size={20} fill="currentColor" />
                    Prepare Full Briefing
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                 <section className="space-y-4">
                   <h4 className="font-bold text-slate-900 flex items-center gap-2">
                     <CheckCircle2 size={18} className="text-emerald-500" />
                     Briefing Snapshot
                   </h4>
                   <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-slate-700 leading-relaxed italic">
                     "{result.snapshot}"
                   </div>
                 </section>

                 <section className="space-y-4">
                   <h4 className="font-bold text-slate-900">Recommended Agenda</h4>
                   <ul className="space-y-3">
                     {result.briefing.agenda.map((item: string, i: number) => (
                       <li key={i} className="flex gap-3 text-sm p-3 bg-white border border-slate-200 rounded-xl">
                         <span className="font-bold text-indigo-600">{i+1}.</span>
                         {item}
                       </li>
                     ))}
                   </ul>
                 </section>
              </div>

              <div className="space-y-6">
                <section className="space-y-4">
                   <h4 className="font-bold text-slate-900">Hypotheses & Discovery</h4>
                   <div className="space-y-2">
                     {result.hypotheses.map((h: string, i: number) => (
                       <div key={i} className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-medium text-indigo-700">
                         {h}
                       </div>
                     ))}
                   </div>
                 </section>

                 <section className="space-y-4">
                   <h4 className="font-bold text-slate-900">Key Questions to Ask</h4>
                   <div className="space-y-2">
                      {result.briefing.keyQuestions.map((q: string, i: number) => (
                        <div key={i} className="flex gap-2 text-sm text-slate-600 group">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0 group-hover:bg-indigo-500 transition-colors"></div>
                           {q}
                        </div>
                      ))}
                   </div>
                 </section>

                 <section className="space-y-4 p-5 bg-slate-900 text-slate-300 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-white text-xs uppercase tracking-widest">Follow-up Draft</h4>
                      <Copy size={14} className="cursor-pointer hover:text-white" />
                    </div>
                    <p className="text-[10px] leading-relaxed line-clamp-4 font-mono">
                      {result.followUpDraft}
                    </p>
                 </section>
              </div>
            </div>
          )}
        </div>

        {result && (
          <footer className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
             <button onClick={() => setResult(null)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-bold text-sm">
                <RefreshCw size={16} />
                Regenerate
             </button>
             <div className="flex gap-3">
               <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
               <button 
                 onClick={onClose}
                 className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm"
                >
                  <Save size={18} />
                  Approve & Save to Workspace
                </button>
             </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default PrepareCallModal;
