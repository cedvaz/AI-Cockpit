
import React from 'react';
import { Search, Filter, ArrowUpRight, ChevronRight, Briefcase } from 'lucide-react';
import { Deal, Company } from '../types.ts';

interface DealsListProps {
  deals: Deal[];
  companies: Company[];
  onSelectDeal: (id: string) => void;
  searchTerm: string;
}

const DealsList: React.FC<DealsListProps> = ({ deals, companies, onSelectDeal, searchTerm }) => {
  const filteredDeals = deals.filter(deal => {
    const company = companies.find(c => c.id === deal.companyId);
    const searchString = `${deal.title} ${company?.name} ${deal.stage}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Deals & Opportunities</h2>
          <p className="text-slate-500">Verwalte deine aktive Sales-Pipeline.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-indigo-600 transition-all">
            <Filter size={16} /> Filter
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Deal Name</th>
              <th className="px-6 py-4 font-semibold">Firma</th>
              <th className="px-6 py-4 font-semibold">Stage</th>
              <th className="px-6 py-4 font-semibold text-right">Value</th>
              <th className="px-6 py-4 font-semibold">Next Step</th>
              <th className="px-6 py-4 font-semibold text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDeals.length > 0 ? filteredDeals.map(deal => {
              const company = companies.find(c => c.id === deal.companyId);
              return (
                <tr
                  key={deal.id}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => onSelectDeal(deal.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Briefcase size={16} />
                      </div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{deal.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{company?.name || 'Unbekannt'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${deal.stage.includes('Won') ? 'bg-emerald-50 text-emerald-700' :
                        deal.stage.includes('Lost') ? 'bg-slate-100 text-slate-500' :
                          'bg-indigo-50 text-indigo-700'
                      }`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-slate-900">€{deal.value?.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500">{new Date(deal.nextStepDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Keine Deals gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealsList;

