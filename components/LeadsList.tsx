
import React from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  Zap, 
  MoreVertical, 
  ChevronRight,
  Flame,
  Globe,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { Deal, Account } from '../types.ts';

interface LeadsListProps {
  leads: Deal[];
  accounts: Account[];
  onSelectLead: (id: string) => void;
  searchTerm: string;
}

const LeadsList: React.FC<LeadsListProps> = ({ leads, accounts, onSelectLead, searchTerm }) => {
  const filteredLeads = leads.filter(lead => {
    const account = accounts.find(a => a.id === lead.accountId);
    const searchString = `${lead.name} ${account?.name}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Lead Inbox
            <span className="bg-indigo-100 text-indigo-600 text-xs px-2.5 py-1 rounded-lg">{filteredLeads.length}</span>
          </h2>
          <p className="text-slate-500 font-medium">Qualifiziere deine Neuzugänge und starte den Outreach.</p>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <th className="px-8 py-5">Person & Context</th>
              <th className="px-8 py-5">Intelligence</th>
              <th className="px-8 py-5 text-center">Score</th>
              <th className="px-8 py-5">Outreach</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.length > 0 ? filteredLeads.map(lead => {
              const account = accounts.find(a => a.id === lead.accountId);
              const initials = lead.name.split(' ').map(n => n[0]).join('').substring(0, 2);
              
              return (
                <tr key={lead.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => onSelectLead(lead.id)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 text-base leading-tight truncate">{lead.name}</p>
                        <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-widest mt-1">{account?.name || 'Unknown Co.'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Globe size={10} /> {account?.domain || 'N/A'}
                      </span>
                      <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Zap size={10} className="text-indigo-500" /> AI Hypo
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-black">
                      <Flame size={12} fill="currentColor" />
                      {lead.score}
                    </div>
                  </td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button title="E-Mail senden" className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm">
                        <Mail size={16} />
                      </button>
                      <button title="Anrufen" className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-all shadow-sm">
                        <Phone size={16} />
                      </button>
                      <button title="Quick Note" className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"
                      >
                        Qualify
                      </button>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 transition-all" />
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="max-w-xs mx-auto space-y-4 opacity-40">
                    <Users size={48} className="mx-auto text-slate-300" />
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Keine neuen Leads im Posteingang.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsList;
