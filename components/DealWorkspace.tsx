
import React, { useState } from 'react';
import {
  ArrowLeft,
  Zap,
  FilePlus,
  Clock,
  CheckCircle2,
  MoreVertical,
  RefreshCcw,
  Lock,
  TrendingUp,
  AlertTriangle,
  Plus,
  FileText,
  Upload,
  MessageSquare,
  Send,
  Copy,
  Linkedin,
  Mail
} from 'lucide-react';
import { Deal, Company, Interaction, Task, InteractionType } from '../types.ts';

interface DealWorkspaceProps {
  deal: Deal;
  company: Company;
  interactions: Interaction[];
  tasks: Task[];
  onBack: () => void;
  onPrepareCall: () => void;
  onCreateOffer: () => void;
}

const DealWorkspace: React.FC<DealWorkspaceProps> = ({ deal, company, interactions, tasks, onBack, onPrepareCall, onCreateOffer }) => {
  const [activeSection, setActiveSection] = useState<'timeline' | 'research' | 'outreach' | 'tasks' | 'files'>('timeline');

  return (
    <div className="flex flex-col h-full bg-white">
      {/* High-Tech Sticky Header */}
      <header className="px-10 py-8 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-6 mb-8">
          <button onClick={onBack} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{company.name}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{deal.tags[0]}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 truncate tracking-tight">{deal.title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onPrepareCall}
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-black rounded-[1.5rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
            >
              <Zap size={20} fill="white" />
              <span>Prepare Call</span>
            </button>
            <button
              onClick={onCreateOffer}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-black rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-xl shadow-slate-300"
            >
              <FilePlus size={20} />
              <span>Create Offer</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-10 overflow-x-auto no-scrollbar">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</span>
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              {deal.stage}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Potential</span>
            <span className="font-black text-slate-900 text-sm">€{deal.value?.toLocaleString()}</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Action</span>
            <span className="font-black text-slate-900 text-sm">{new Date(deal.nextStepDate).toLocaleDateString([], { month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Confidence</span>
            <div className="flex items-center gap-2 font-black text-indigo-600 text-sm">
              <Zap size={14} fill="currentColor" />
              88%
            </div>
          </div>
        </div>
      </header>

      {/* Modern Navigation */}
      <nav className="px-10 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        {(['timeline', 'research', 'outreach', 'tasks', 'files'] as const).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-5 text-xs font-black uppercase tracking-[0.2em] relative transition-all ${activeSection === section ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {section}
            {activeSection === section && (
              <div className="absolute bottom-0 left-6 right-6 h-1 bg-indigo-600 rounded-full shadow-[0_-2px_10px_rgba(79,70,229,0.4)]"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-10 max-w-[1200px]">
          {activeSection === 'timeline' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Activity Stream</h3>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-white shadow-sm text-indigo-600">All</button>
                  <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg text-slate-400 hover:text-slate-600">Sales</button>
                </div>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-1 before:bg-slate-100 before:rounded-full">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="relative pl-14 group">
                    <div className={`absolute left-0 top-1 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white z-10 transition-all group-hover:scale-110 shadow-sm ${interaction.type === InteractionType.SYSTEM ? 'bg-slate-900 text-white' :
                        interaction.type === InteractionType.RESEARCH ? 'bg-indigo-600 text-white' :
                          'bg-indigo-100 text-indigo-600'
                      }`}>
                      {interaction.type === InteractionType.SYSTEM ? <Zap size={16} /> :
                        interaction.type === InteractionType.RESEARCH ? <Zap size={16} fill="white" /> :
                          <CheckCircle2 size={16} />}
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:bg-white transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {new Date(interaction.timestamp).toLocaleString()}
                        </span>
                        <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed">{interaction.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'outreach' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <Send size={28} />
                    </div>
                    <h3 className="text-3xl font-black leading-tight">AI Outreach Generator</h3>
                    <p className="text-indigo-100/70 font-medium">Lass die KI basierend auf dem Research Memo die perfekte Nachricht für {company.name} schreiben.</p>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-white text-indigo-600 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all">
                        <Linkedin size={18} /> LinkedIn Msg
                      </button>
                      <button className="flex-1 bg-indigo-500 text-white font-black py-4 rounded-2xl border border-indigo-400/30 flex items-center justify-center gap-2 hover:bg-indigo-400 transition-all">
                        <Mail size={18} /> Cold Email
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-[2rem] p-6 backdrop-blur-sm border border-white/10 font-mono text-xs leading-relaxed text-indigo-100">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                      <span className="uppercase tracking-widest font-black text-[10px]">Preview: LinkedIn Hook</span>
                      <Copy size={14} className="cursor-pointer hover:text-white" />
                    </div>
                    "Hi [Name], habe gesehen dass ihr bei {company.name} gerade massiv in Supply Chain Tech investiert. Unser KI-Audit für VW hat dort 12% Opex gespart – hättest du 5 Min für einen kurzen Impuls?"
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Tone of Voice</h4>
                  <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-sm outline-none ring-1 ring-slate-200 focus:ring-indigo-600 transition-all">
                    <option>Bold & Direct</option>
                    <option>Professional & Data-driven</option>
                    <option>Casual & Friendly</option>
                  </select>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Main Trigger</h4>
                  <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-sm outline-none ring-1 ring-slate-200 focus:ring-indigo-600 transition-all">
                    <option>Recent Funding</option>
                    <option>New Role Hire</option>
                    <option>Market Trend</option>
                  </select>
                </div>
                <button className="bg-slate-900 text-white font-black rounded-[2rem] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                  <RefreshCcw size={18} /> Regenerate All
                </button>
              </div>
            </div>
          )}

          {activeSection === 'research' && (
            <div className="space-y-8">
              <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                      <Zap size={28} fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Sales Intelligence</h3>
                      <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Deep-Dive Analysis • v1.2</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <RefreshCcw size={16} /> Run Analysis
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={16} className="text-indigo-500" />
                        Strategic Snapshot
                      </h4>
                      <Lock size={14} className="text-slate-300" />
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-sm font-semibold text-slate-600 leading-relaxed">
                      Fokus auf Cloud-Migration abgeschlossen, jetzt starker Shift zu "Edge AI" in der Fertigung. Entscheidungsträger suchen nach Validierung für ROI von KI-Agenten.
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" />
                        Kill-the-Pain Hypotheses
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="text-sm font-bold text-slate-700 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-3 items-center">
                        <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] text-indigo-600">01</div>
                        Automatisiertes Vendor-Invoicing spart 15h/Woche.
                      </li>
                      <li className="text-sm font-bold text-slate-700 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-3 items-center">
                        <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] text-indigo-600">02</div>
                        Predictive Maintenance für Logistik-Fahrzeuge.
                      </li>
                    </ul>
                  </section>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl -z-10 group-hover:bg-indigo-100/40 transition-colors"></div>
              </div>
            </div>
          )}

          {activeSection === 'tasks' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(['To-Do', 'Doing', 'Done'] as const).map(status => (
                <div key={status} className="space-y-6">
                  <div className="flex items-center justify-between px-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{status}</h4>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.status === status).length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {tasks.filter(t => t.status === status).map(task => (
                      <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                        {task.isBlocker && (
                          <div className="mb-3 flex items-center gap-1.5 text-[10px] font-black text-rose-500 uppercase tracking-[0.1em]">
                            <AlertTriangle size={12} />
                            Blocker
                          </div>
                        )}
                        <h5 className="font-bold text-slate-900 text-sm mb-4 leading-snug">{task.title}</h5>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-white">CH</div>
                          <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-5 rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                      <Plus size={18} /> Add Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'files' && (
            <div className="bg-slate-50 rounded-[3rem] border border-slate-100 p-16 flex flex-col items-center justify-center text-center shadow-inner">
              <div className="w-24 h-24 bg-white text-slate-200 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl">
                <FileText size={48} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No assets linked yet</h4>
              <p className="text-slate-500 text-sm max-w-xs mb-10 font-medium">
                Drag & drop pitch decks, audits or contracts here to sync with the AI.
              </p>
              <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-2xl">
                <Upload size={20} />
                <span className="uppercase tracking-widest text-xs">Upload Assets</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealWorkspace;

