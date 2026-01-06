
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Settings,
  PlusCircle,
  Bell,
  LogOut,
  Users,
  CheckSquare,
  MessageCircle,
  Building2,
  Zap,
  Command,
  Database
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onSearch: (term: string) => void;
  onQuickAdd: () => void;
  onImport: () => void;
  activeTab: 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks' | 'communication' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks' | 'communication' | 'settings') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch, onQuickAdd, onImport, activeTab, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  // Global keyboard shortcut for Quick Add
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onQuickAdd();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onQuickAdd]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl italic text-white shadow-lg shadow-indigo-600/20">C</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Cedric KI</h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">Ops Cockpit</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CRM</p>
          </div>

          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'companies' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Building2 size={20} />
            <span className="font-medium">Firmen</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contacts' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users size={20} />
            <span className="font-medium">Kontakte</span>
          </button>

          <button
            onClick={() => setActiveTab('deals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'deals' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Briefcase size={20} />
            <span className="font-medium">Pipeline (Deals)</span>
          </button>

          <button
            onClick={() => setActiveTab('communication')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'communication' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <MessageCircle size={20} />
            <span className="font-medium">Communication</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tasks' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <CheckSquare size={20} />
            <span className="font-medium">Tasks</span>
          </button>

          <button
            onClick={onImport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-400 hover:text-white hover:bg-indigo-500/10 transition-all mt-4"
          >
            <Database size={20} />
            <span className="font-medium">Batch Import</span>
          </button>

          <button
            onClick={onQuickAdd}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-400 hover:text-white hover:bg-emerald-500/10 transition-all mt-1"
          >
            <Zap size={20} />
            <div className="flex-1 flex justify-between items-center">
              <span className="font-medium">Quick Add</span>
              <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Command size={10} />K</span>
            </div>
          </button>

          <div className="pt-8 pb-2 px-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System</p>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-white/10">CH</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Cedric H.</p>
              <p className="text-[10px] text-slate-500 truncate font-black uppercase">Power User</p>
            </div>
            <LogOut size={16} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Magic Search (Firmen, Kontakte, Deals...)"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-6 py-3 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="p-3 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-2xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">Cockpit v2</p>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">All Systems Online</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">CH</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

