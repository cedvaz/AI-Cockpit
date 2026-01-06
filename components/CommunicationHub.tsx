
import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Zap,
  Search,
  Plus,
  Filter,
  Star,
  Archive,
  Trash2,
  Clock,
  Inbox,
  ArrowLeft,
  User,
  MoreVertical,
  Paperclip,
  Maximize2,
  Loader2,
  CheckCircle2,
  Target,
  Sparkles,
  Copy,
  PlusCircle,
  Tag as TagIcon,
  X,
  Link as LinkIcon,
  ChevronDown
} from 'lucide-react';
import { Mailbox, Message, Deal, Task, TaskType, TaskPriority, Company } from '../types.ts';
import { analyzeMessageAI } from '../services/geminiService.ts';

interface CommunicationHubProps {
  mailboxes: Mailbox[];
  messages: Message[];
  deals: Deal[];
  companies: Company[];
  onSendMessage: (mailboxId: string, recipient: string, subject: string, body: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateMessageTags: (messageId: string, tags: string[]) => void;
  onLinkMessageToDeal: (messageId: string, dealId: string | undefined) => void;
}

const CommunicationHub: React.FC<CommunicationHubProps> = ({
  mailboxes,
  messages,
  deals,
  companies,
  onSendMessage,
  onAddTask,
  onUpdateMessageTags,
  onLinkMessageToDeal
}) => {
  const [selectedMailboxId, setSelectedMailboxId] = useState<string | 'All'>('All');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ draftResponse: string; suggestedTasks: any[] } | null>(null);

  // Compose & Reply State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [quickReplyText, setQuickReplyText] = useState('');
  const [activeMailboxId, setActiveMailboxId] = useState(mailboxes[0].id);

  // Tagging & Context State
  const [newTagInput, setNewTagInput] = useState('');
  const [isLinkDealOpen, setIsLinkDealOpen] = useState(false);
  const [dealSearchQuery, setDealSearchQuery] = useState('');

  const filteredMessages = messages.filter(m => selectedMailboxId === 'All' || m.mailboxId === selectedMailboxId);
  const activeMessage = messages.find(m => m.id === selectedMessageId);
  const activeMailbox = mailboxes.find(mb => mb.id === activeMessage?.mailboxId);
  const activeDeal = deals.find(d => d.id === activeMessage?.dealId);
  const activeCompany = companies.find(c => c.id === activeDeal?.companyId);

  const filteredDeals = deals.filter(d => {
    const comp = companies.find(c => c.id === d.companyId);
    return d.title.toLowerCase().includes(dealSearchQuery.toLowerCase()) ||
      comp?.name.toLowerCase().includes(dealSearchQuery.toLowerCase());
  });

  // Trigger AI Analysis when message changes
  useEffect(() => {
    if (activeMessage) {
      setAnalysisResult(null);
      setQuickReplyText(''); // Reset quick reply on message change
      handleAnalyzeMessage(activeMessage);
    }
  }, [selectedMessageId, activeMessage?.dealId]);

  // Pre-fill quick reply when analysis completes
  useEffect(() => {
    if (analysisResult?.draftResponse) {
      setQuickReplyText(analysisResult.draftResponse);
    }
  }, [analysisResult]);

  const handleAnalyzeMessage = async (msg: Message) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeMessageAI(msg, activeDeal, activeCompany);
      setAnalysisResult(result);
    } catch (e) {
      console.error("AI Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const useAIDraftInFullEditor = () => {
    if (!analysisResult) return;
    setComposeTo(activeMessage?.sender || '');
    setComposeSubject(`Re: ${activeMessage?.subject}`);
    setComposeBody(analysisResult.draftResponse);
    setIsComposeOpen(true);
  };

  const handleQuickSend = () => {
    if (!quickReplyText.trim() || !activeMessage) return;
    onSendMessage(
      activeMessage.mailboxId,
      activeMessage.sender,
      `Re: ${activeMessage.subject}`,
      quickReplyText
    );
    setQuickReplyText('');
    // Optionally show a "Sent" state or notification
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage || !newTagInput.trim()) return;
    const currentTags = activeMessage.tags || [];
    if (!currentTags.includes(newTagInput.trim())) {
      onUpdateMessageTags(activeMessage.id, [...currentTags, newTagInput.trim()]);
    }
    setNewTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    if (!activeMessage) return;
    const currentTags = activeMessage.tags || [];
    onUpdateMessageTags(activeMessage.id, currentTags.filter(t => t !== tagToRemove));
  };

  const linkDeal = (dealId: string) => {
    if (!activeMessage) return;
    onLinkMessageToDeal(activeMessage.id, dealId);
    setIsLinkDealOpen(false);
    setDealSearchQuery('');
  };

  const unlinkDeal = () => {
    if (!activeMessage) return;
    onLinkMessageToDeal(activeMessage.id, undefined);
  };

  const convertToTask = (suggestedTask: any) => {
    onAddTask({
      dealId: activeMessage?.dealId || 'global',
      title: suggestedTask.title,
      status: 'To-Do',
      type: suggestedTask.type as TaskType,
      priority: suggestedTask.priority as TaskPriority,
      ownerId: 'cedric',
      dueDate: new Date().toISOString(),
      isBlocker: suggestedTask.priority === 'P0',
      estimatedMinutes: suggestedTask.estimatedMinutes
    });
  };

  const getMailboxColor = (color: string) => {
    switch (color) {
      case 'indigo': return 'text-indigo-800 bg-indigo-50';
      case 'amber': return 'text-amber-900 bg-amber-50';
      case 'rose': return 'text-rose-900 bg-rose-50';
      default: return 'text-slate-800 bg-slate-50';
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-white">
      {/* Sidebar - Mailboxes */}
      <aside className="w-64 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-6">
          <button
            onClick={() => {
              setComposeTo('');
              setComposeSubject('');
              setComposeBody('');
              setIsComposeOpen(true);
            }}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            <Plus size={18} /> Compose
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setSelectedMailboxId('All')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${selectedMailboxId === 'All' ? 'bg-white text-indigo-700 shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-white/50'}`}
          >
            <Inbox size={18} /> Unified Inbox
          </button>

          <div className="py-4 px-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Postfächer</p>
          </div>

          {mailboxes.map(mb => (
            <button
              key={mb.id}
              onClick={() => setSelectedMailboxId(mb.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${selectedMailboxId === mb.id ? 'bg-white text-indigo-700 shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-white/50'}`}
            >
              <div className={`w-2 h-2 rounded-full ${mb.color === 'indigo' ? 'bg-indigo-500' : mb.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
              <span className="truncate">{mb.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full py-3 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all flex items-center justify-center gap-2">
            <Plus size={14} /> Add Mailbox
          </button>
        </div>
      </aside>

      {/* Message List */}
      <div className="w-80 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 text-slate-900"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filteredMessages.map(msg => {
            const mailbox = mailboxes.find(mb => mb.id === msg.mailboxId);
            return (
              <div
                key={msg.id}
                onClick={() => setSelectedMessageId(msg.id)}
                className={`p-6 cursor-pointer transition-all hover:bg-slate-50 ${selectedMessageId === msg.id ? 'bg-indigo-50/30 border-l-4 border-indigo-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-black text-slate-900 truncate max-w-[120px]">{msg.sender}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h4 className={`text-sm mb-1 truncate ${!msg.isRead ? 'font-black text-slate-900' : 'font-medium text-slate-600'}`}>{msg.subject}</h4>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {mailbox && (
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${getMailboxColor(mailbox.color)}`}>
                      {mailbox.name}
                    </span>
                  )}
                  {msg.tags && msg.tags.map(t => (
                    <span key={t} className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {t}
                    </span>
                  ))}
                  {msg.dealId && <Zap size={10} className="text-indigo-600" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Content & AI Intelligence Panel */}
      <div className="flex-1 bg-white flex min-w-0">
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-50">
          {isComposeOpen ? (
            <div className="flex-1 flex flex-col p-10 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-slate-900">New Message.</h2>
                <button onClick={() => setIsComposeOpen(false)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><Trash2 size={24} /></button>
              </div>

              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest w-16">From</span>
                  <select
                    value={activeMailboxId}
                    onChange={(e) => setActiveMailboxId(e.target.value)}
                    className="flex-1 bg-transparent border-none font-bold text-sm outline-none text-indigo-700"
                  >
                    {mailboxes.map(mb => <option key={mb.id} value={mb.id}>{mb.name} ({mb.email})</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest w-16">To</span>
                  <input
                    type="email"
                    value={composeTo}
                    onChange={e => setComposeTo(e.target.value)}
                    className="flex-1 bg-transparent border-none font-bold text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest w-16">Subject</span>
                  <input
                    type="text"
                    value={composeSubject}
                    onChange={e => setComposeSubject(e.target.value)}
                    className="flex-1 bg-transparent border-none font-bold text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder="Betreff..."
                  />
                </div>

                <div className="flex-1 pt-6 relative">
                  <textarea
                    className="w-full h-full bg-transparent border-none resize-none font-medium text-slate-800 outline-none leading-relaxed placeholder:text-slate-400"
                    placeholder="Schreibe deine Nachricht..."
                    value={composeBody}
                    onChange={e => setComposeBody(e.target.value)}
                  ></textarea>

                  <div className="absolute right-0 bottom-6 flex gap-3">
                    <button
                      onClick={() => {
                        onSendMessage(activeMailboxId, composeTo, composeSubject, composeBody);
                        setIsComposeOpen(false);
                      }}
                      className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
                    >
                      <Send size={18} /> Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMessage ? (
            <div className="flex-1 flex flex-col">
              <header className="p-8 border-b border-slate-50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-700">
                      {activeMessage.sender.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{activeMessage.subject}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-700">{activeMessage.sender}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{activeMailbox?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Link Deal Context Button */}
                    <div className="relative">
                      <button
                        onClick={() => setIsLinkDealOpen(!isLinkDealOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeDeal ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        <LinkIcon size={14} />
                        {activeDeal ? activeDeal.title : 'Link Context'}
                        <ChevronDown size={14} className={isLinkDealOpen ? 'rotate-180' : ''} />
                      </button>

                      {isLinkDealOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                          <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                              <input
                                type="text"
                                autoFocus
                                placeholder="Search deals or companies..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                                value={dealSearchQuery}
                                onChange={e => setDealSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {activeDeal && (
                              <button
                                onClick={unlinkDeal}
                                className="w-full text-left px-5 py-3 hover:bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b border-slate-50"
                              >
                                <X size={14} /> Unlink Current
                              </button>
                            )}
                            {filteredDeals.map(d => {
                              const comp = companies.find(c => c.id === d.companyId);
                              return (
                                <button
                                  key={d.id}
                                  onClick={() => linkDeal(d.id)}
                                  className="w-full text-left px-5 py-4 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0"
                                >
                                  <p className="text-xs font-black text-slate-900 truncate">{d.title}</p>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{comp?.name}</p>
                                </button>
                              );
                            })}
                            {filteredDeals.length === 0 && (
                              <div className="p-8 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">No deals found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button className="p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Star size={20} /></button>
                    <button className="p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                    <button className="p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20} /></button>
                  </div>
                </div>

                {/* Interactive Tags Row */}
                <div className="flex flex-wrap items-center gap-3 mt-4 px-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mr-2">
                    <TagIcon size={14} /> Tags:
                  </div>
                  {activeMessage.tags && activeMessage.tags.map(t => (
                    <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold group border border-slate-200">
                      {t}
                      <button onClick={() => removeTag(t)} className="opacity-0 group-hover:opacity-100 hover:text-rose-700 transition-all">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <form onSubmit={handleAddTag} className="flex items-center ml-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      className="text-[11px] font-bold bg-slate-50 border border-dashed border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 w-24 placeholder:text-slate-400"
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                    />
                  </form>
                </div>
              </header>

              <div className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-3xl space-y-8">
                  <p className="text-slate-800 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                    {activeMessage.body}
                  </p>
                </div>
              </div>

              <footer className="p-8 bg-slate-50/50 border-t border-slate-100">
                <div className="bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-sm focus-within:shadow-xl focus-within:border-indigo-200 transition-all flex items-center gap-4">
                  <input
                    type="text"
                    placeholder={isAnalyzing ? "Analysiere Nachricht..." : "Schnelle Antwort schreiben..."}
                    value={quickReplyText}
                    onChange={e => setQuickReplyText(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent border-none outline-none font-bold text-sm text-slate-900 placeholder:text-slate-400"
                  />
                  {isAnalyzing ? (
                    <Loader2 size={20} className="animate-spin text-indigo-600 mx-2" />
                  ) : (
                    <button
                      onClick={handleQuickSend}
                      disabled={!quickReplyText.trim()}
                      className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-30"
                    >
                      <Send size={20} fill="currentColor" />
                    </button>
                  )}
                  <button
                    onClick={useAIDraftInFullEditor}
                    className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl flex items-center gap-2 text-xs uppercase tracking-widest shadow-lg"
                  >
                    Full Editor <ArrowLeft size={16} className="rotate-180" />
                  </button>
                </div>
              </footer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-20 opacity-40">
              <div className="space-y-4">
                <Mail size={64} className="mx-auto text-slate-500" />
                <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Select a message to read</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Intelligence Sidebar */}
        {activeMessage && (
          <aside className="w-80 bg-slate-50 flex flex-col p-8 overflow-y-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <Sparkles size={16} fill="currentColor" />
              </div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">AI Intelligence</h4>
            </div>

            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-50">
                <Loader2 size={32} className="animate-spin text-indigo-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Scanning content...</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                {/* Draft Suggestion */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Smart Reply Draft</h5>
                    <button onClick={useAIDraftInFullEditor} className="text-[10px] font-black text-indigo-700 hover:underline uppercase">Full Editor</button>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 leading-relaxed line-clamp-6">
                    "{analysisResult.draftResponse}"
                  </div>
                </section>

                {/* Task Extraction */}
                <section className="space-y-6">
                  <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Detected Tasks</h5>
                  <div className="space-y-3">
                    {analysisResult.suggestedTasks.map((st, i) => (
                      <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-600 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${st.priority === 'P0' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700 font-black border border-slate-200'}`}>
                            {st.priority}
                          </span>
                          <button
                            onClick={() => convertToTask(st)}
                            className="text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            <PlusCircle size={18} />
                          </button>
                        </div>
                        <p className="text-[11px] font-black text-slate-900 leading-tight mb-2">{st.title}</p>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase">
                          <Clock size={10} /> {st.estimatedMinutes}m • {st.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-[9px] font-black text-emerald-700 uppercase">
                    <CheckCircle2 size={12} />
                    Context Linked: {activeCompany?.name || 'Global'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <Zap size={32} className="text-slate-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No Intelligence available</p>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;

