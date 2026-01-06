
import React from 'react';
import { 
  Flame, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  ArrowUpRight, 
  Zap,
  Target,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Deal, Task } from '../types.ts';

interface DashboardProps {
  hotLeads: Deal[];
  upcomingCalls: Deal[];
  openOffers: Deal[];
  blockers: Task[];
  onSelectDeal: (dealId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ hotLeads, upcomingCalls, openOffers, blockers, onSelectDeal }) => {
  // Stats for the "1000 Leads" Goal
  const annualGoal = 1000;
  const currentTotal = 142; // Mock value
  const dailyProgress = 1; // Mock value

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10">
      {/* High Performance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30 w-fit">
            <Target size={14} className="animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">Mission: 1000 Deals / Year</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Focus on the Next <span className="text-indigo-500">Big Win.</span></h2>
          <p className="text-slate-400 max-w-md text-lg">Du hast heute bereits 1/3 Leads kontaktiert. Bleib dran, Cedric.</p>
        </div>

        <div className="relative z-10 flex gap-8">
           <div className="text-center space-y-2">
             <div className="text-5xl font-black text-white">{currentTotal}</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Total 2024</div>
           </div>
           <div className="w-px h-16 bg-white/10 my-auto"></div>
           <div className="text-center space-y-2">
             <div className="text-5xl font-black text-indigo-500">{Math.round((currentTotal/annualGoal)*100)}%</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Goal Reach</div>
           </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/20 to-transparent"></div>
      </div>

      {/* Grid: Intelligence & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Hot Leads Intelligence */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Flame size={24} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-slate-900">{hotLeads.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urgent</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-4">Hot Opportunities</h3>
          <div className="space-y-3">
            {hotLeads.slice(0, 3).map(lead => (
              <div key={lead.id} onClick={() => onSelectDeal(lead.id)} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-100">
                <span className="text-sm font-semibold text-slate-700 truncate mr-2">{lead.name}</span>
                <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg text-[10px] font-black">{lead.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Calls Intelligence */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calendar size={24} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-slate-900">{upcomingCalls.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next 7d</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-4">Upcoming Briefings</h3>
          <div className="space-y-3">
            {upcomingCalls.slice(0, 3).map(call => (
              <div key={call.id} onClick={() => onSelectDeal(call.id)} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">
                  {new Date(call.nextStepDate).getDate()}
                </div>
                <span className="text-sm font-semibold text-slate-700 truncate">{call.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Offers Value Intelligence */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp size={24} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-slate-900">€{openOffers.reduce((acc, curr) => acc + (curr.value || 0), 0) / 1000}k</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pipeline Value</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-4">Open Offers</h3>
          <div className="space-y-3">
            {openOffers.slice(0, 3).map(offer => (
              <div key={offer.id} onClick={() => onSelectDeal(offer.id)} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-100">
                <span className="text-sm font-semibold text-slate-700 truncate">{offer.name}</span>
                <span className="text-emerald-600 font-black text-[10px]">€{offer.value ? offer.value/1000 : 0}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blockers & Speed */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Zap size={24} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-slate-900">{blockers.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blockers</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-4">Speed Killers</h3>
          <div className="space-y-3">
            {blockers.slice(0, 3).map(blocker => (
              <div key={blocker.id} className="flex items-center gap-2 p-3 bg-rose-50/50 rounded-2xl border border-rose-100">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                <span className="text-xs font-bold text-rose-700 truncate">{blocker.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Recent Pulse</h3>
              <button className="text-indigo-600 text-sm font-black hover:underline flex items-center gap-1 uppercase tracking-widest">
                Full Pipeline <ChevronRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                    <th className="px-8 py-4">Deal & Intelligence</th>
                    <th className="px-8 py-4">Current Flow</th>
                    <th className="px-8 py-4 text-right">Potential</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hotLeads.map(deal => (
                    <tr key={deal.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{deal.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Acme Corp • {deal.tags[0]}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-base font-black text-slate-900">€{deal.value?.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => onSelectDeal(deal.id)}
                          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                        >
                          <ArrowUpRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-6">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                 <Zap size={24} fill="white" />
               </div>
               <div>
                 <h3 className="text-2xl font-black mb-2">Magic Outreach</h3>
                 <p className="text-indigo-100/70 text-sm leading-relaxed">Wähle einen Deal und lass die KI die perfekte personalisierte Nachricht schreiben.</p>
               </div>
               <button className="w-full bg-white text-indigo-600 font-black py-4 rounded-[1.5rem] shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                 Generate Outreach
               </button>
             </div>
             <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8">
             <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">Market Status</h3>
             <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">AI</div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">LLM Efficiency Trend</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+12.4% this week</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black">€</div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">Audit Market Size</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Demand</p>
                  </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
