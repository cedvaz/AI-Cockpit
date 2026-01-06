
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  Filter, 
  Plus, 
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Briefcase,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { Task, TaskType, TaskPriority, Deal, Account } from '../types.ts';

interface TasksManagerProps {
  tasks: Task[];
  deals: Deal[];
  accounts: Account[];
  onToggleTask: (id: string) => void;
  onSelectDeal: (id: string) => void;
  onStartPowerHour: () => void;
}

const TasksManager: React.FC<TasksManagerProps> = ({ tasks, deals, accounts, onToggleTask, onSelectDeal, onStartPowerHour }) => {
  const [filter, setFilter] = useState<TaskType | 'All'>('All');

  const filteredTasks = tasks.filter(t => filter === 'All' || t.type === filter);
  const openTasks = filteredTasks.filter(t => t.status !== 'Done');
  const salesTasks = openTasks.filter(t => t.type === TaskType.SALES);
  const deliveryTasks = openTasks.filter(t => t.type === TaskType.DELIVERY);

  const getPriorityColor = (p: TaskPriority) => {
    switch(p) {
      case TaskPriority.P0: return 'text-rose-600 bg-rose-50 border-rose-100';
      case TaskPriority.P1: return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10">
      {/* Power Hour Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
          <h2 className="text-4xl font-black tracking-tight leading-tight">Ready for your <span className="text-indigo-300">Power Hour?</span></h2>
          <p className="text-indigo-100/70 font-medium">Ich habe {salesTasks.length} Sales-Tasks und {deliveryTasks.length} Delivery-Tasks für dich vorbereitet. Lass uns die Pipeline aufräumen.</p>
          <button 
            onClick={onStartPowerHour}
            className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-3 mx-auto md:mx-0 active:scale-95"
          >
            <Zap size={24} fill="currentColor" />
            START SPRINT MODE
          </button>
        </div>
        
        <div className="relative z-10 flex gap-4">
           <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
             <div className="text-3xl font-black mb-1">{salesTasks.length}</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Sales</div>
           </div>
           <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
             <div className="text-3xl font-black mb-1">{deliveryTasks.length}</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Delivery</div>
           </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Task List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex gap-2">
              {(['All', TaskType.SALES, TaskType.DELIVERY, TaskType.ADMIN] as const).map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
              <Plus size={20} />
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {openTasks.length > 0 ? openTasks.map(task => {
                const deal = deals.find(d => d.id === task.dealId);
                const account = accounts.find(a => a.id === deal?.accountId);
                
                return (
                  <div key={task.id} className="group p-6 hover:bg-slate-50 transition-all flex items-center gap-6">
                    <button 
                      onClick={() => onToggleTask(task.id)}
                      className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all shrink-0"
                    >
                      <Circle size={20} />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                          {account?.name} • {task.type}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {task.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {task.estimatedMinutes && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase">
                          <Clock size={12} /> {task.estimatedMinutes}m
                        </div>
                      )}
                      <button 
                        onClick={() => onSelectDeal(task.dealId)}
                        className="p-2 text-slate-300 hover:text-indigo-600 transition-all"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-20 text-center space-y-4 opacity-40">
                  <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Inbox Zero. Gut gemacht.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Insights / Stats Column */}
        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Velocity Insights</h3>
             <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Sprint Mode Readiness</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">9 Tasks ready to batch</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Weekly Throughput</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">+12% vs last week</p>
                  </div>
               </div>
             </div>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Delivery Health</h3>
             <div className="space-y-4">
               {tasks.filter(t => t.type === TaskType.DELIVERY && t.isBlocker).map(t => (
                 <div key={t.id} className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <AlertCircle size={16} className="text-rose-500 shrink-0" />
                   <p className="text-xs font-bold leading-tight">{t.title}</p>
                 </div>
               ))}
               {tasks.filter(t => t.type === TaskType.DELIVERY && t.isBlocker).length === 0 && (
                 <p className="text-xs font-medium text-slate-400 italic">Keine Blocker in der Delivery.</p>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TasksManager;
