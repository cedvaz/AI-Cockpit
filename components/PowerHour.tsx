
import React, { useState } from 'react';
import { 
  Zap, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  Mail, 
  MessageSquare, 
  Copy,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { Task, Deal, Account } from '../types.ts';

interface PowerHourProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  deals: Deal[];
  accounts: Account[];
  onCompleteTask: (id: string) => void;
}

const PowerHour: React.FC<PowerHourProps> = ({ isOpen, onClose, tasks, deals, accounts, onCompleteTask }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const sprintTasks = tasks.filter(t => t.status !== 'Done');
  const currentTask = sprintTasks[currentIndex];
  const deal = deals.find(d => d.id === currentTask?.dealId);
  const account = accounts.find(a => a.id === deal?.accountId);

  if (!isOpen || !currentTask) {
    if (isOpen && !currentTask) {
      return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-8">
           <div className="max-w-md text-center space-y-8 animate-in zoom-in-95 duration-700">
             <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(79,70,229,0.5)]">
               <CheckCircle2 size={48} className="text-white" />
             </div>
             <h2 className="text-4xl font-black text-white">Power Hour Complete.</h2>
             <p className="text-slate-400 font-medium">Du hast alle fälligen Aufgaben für heute erledigt. Deine Pipeline ist sauber.</p>
             <button 
               onClick={onClose}
               className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-50 transition-all uppercase tracking-widest text-xs"
             >
               Zurück zum Dashboard
             </button>
           </div>
        </div>
      );
    }
    return null;
  }

  const handleComplete = () => {
    onCompleteTask(currentTask.id);
    if (currentIndex < sprintTasks.length - 1) {
      // Don't auto-advance if we want to show completion state? 
      // For now, simple advance
    }
  };

  const progress = ((currentIndex + 1) / sprintTasks.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col p-6 md:p-12 overflow-hidden">
      {/* Power Hour Header */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
            <Zap size={16} className="animate-pulse" fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">Power Hour Active</span>
          </div>
          <div className="text-slate-500 font-black text-xs uppercase tracking-[0.2em]">
            Task {currentIndex + 1} of {sprintTasks.length}
          </div>
        </div>
        <button onClick={onClose} className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
          <X size={24} />
        </button>
      </header>

      {/* Main Focus Area */}
      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Task Context */}
        <div className="space-y-10 animate-in slide-in-from-left-8 duration-500">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
              <Target size={14} /> {account?.name}
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              {currentTask.title}
            </h1>
            <div className="flex items-center gap-4">
              <span className="bg-white/10 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                {currentTask.type}
              </span>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <Clock size={12} /> {currentTask.estimatedMinutes} min effort
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Context & Strategy</h3>
            <p className="text-slate-300 text-lg leading-relaxed font-medium">
              Dieser Task ist entscheidend für den Abschluss. {account?.name} wartet auf das Feedback zu den Security-Requirements.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-bold text-indigo-300">
                #security
              </div>
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-300">
                #pipeline-booster
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Card */}
        <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_0_100px_rgba(79,70,229,0.2)] space-y-10 animate-in slide-in-from-right-8 duration-500">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Action Proposal</h3>
              <div className="flex gap-2">
                <button title="E-Mail" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><Mail size={18} /></button>
                <button title="Message" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><MessageSquare size={18} /></button>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
              <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy size={16} className="text-slate-300 cursor-pointer hover:text-indigo-600" />
              </div>
              <p className="text-slate-700 font-medium leading-relaxed italic">
                "Hi [Name], ich habe mir unseren Stack nochmal angesehen. Die Security-Bedenken können wir durch ein lokales LLM-Deployment komplett eliminieren. Wollen wir dazu morgen kurz telen?"
              </p>
            </div>
          </div>

          <div className="space-y-4">
             <button 
               onClick={handleComplete}
               className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
             >
               <CheckCircle2 size={24} />
               MARK COMPLETE
             </button>
             <div className="flex gap-4">
               <button 
                 onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                 disabled={currentIndex === 0}
                 className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-30"
               >
                 PREVIOUS
               </button>
               <button 
                 onClick={() => setCurrentIndex(prev => Math.min(sprintTasks.length - 1, prev + 1))}
                 disabled={currentIndex === sprintTasks.length - 1}
                 className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-30"
               >
                 SKIP / LATER
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <footer className="mt-auto pt-12">
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </footer>
    </div>
  );
};

export default PowerHour;
