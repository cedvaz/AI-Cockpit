
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import DealsList from './components/DealsList.tsx';
import LeadsList from './components/LeadsList.tsx';
import TasksManager from './components/TasksManager.tsx';
import CommunicationHub from './components/CommunicationHub.tsx';
import PowerHour from './components/PowerHour.tsx';
import DealWorkspace from './components/DealWorkspace.tsx';
import PrepareCallModal from './components/PrepareCallModal.tsx';
import NewLeadModal from './components/NewLeadModal.tsx';
import { mockDeals, mockTasks, mockInteractions, mockAccounts, mockMailboxes, mockMessages } from './mockData.ts';
import { Deal, Account, Task, Interaction, InteractionType, DealStage, Mailbox, Message } from './types.ts';
import { prepareCallAI } from './services/geminiService.ts';

const App: React.FC = () => {
  // State
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions);
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [mailboxes] = useState<Mailbox[]>(mockMailboxes);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'deals' | 'tasks' | 'communication' | 'settings'>('dashboard');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [isPrepareCallOpen, setIsPrepareCallOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isPowerHourOpen, setIsPowerHourOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Derived state
  const selectedDeal = useMemo(() => deals.find(d => d.id === selectedDealId), [deals, selectedDealId]);
  const selectedAccount = useMemo(() => accounts.find(a => a.id === selectedDeal?.accountId), [accounts, selectedDeal]);
  const dealInteractions = useMemo(() => interactions.filter(i => i.dealId === selectedDealId), [interactions, selectedDealId]);
  const dealTasks = useMemo(() => tasks.filter(t => t.dealId === selectedDealId), [tasks, selectedDealId]);

  const allLeads = useMemo(() => deals.filter(d => d.stage === DealStage.LEAD), [deals]);
  const activePipeline = useMemo(() => deals.filter(d => d.stage !== DealStage.LEAD), [deals]);

  const hotLeads = useMemo(() => deals.filter(d => d.score >= 80), [deals]);
  const upcomingCalls = useMemo(() => {
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    return deals.filter(d => d.stage === DealStage.CALL_BOOKED && new Date(d.nextStepDate) <= next7Days);
  }, [deals]);
  const openOffers = useMemo(() => deals.filter(d => d.stage === DealStage.OFFER_SENT), [deals]);
  const blockers = useMemo(() => tasks.filter(t => t.isBlocker), [tasks]);

  // Handlers
  const handleSelectDeal = (id: string) => {
    setSelectedDealId(id);
    const deal = deals.find(d => d.id === id);
    if (deal?.stage === DealStage.LEAD) {
      setActiveTab('leads');
    } else {
      setActiveTab('deals');
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: t.status === 'Done' ? 'To-Do' : 'Done' } : t
    ));
  };

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateMessageTags = (messageId: string, tags: string[]) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, tags } : m));
  };

  const handleLinkMessageToDeal = (messageId: string, dealId: string | undefined) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, dealId } : m));
  };

  const handleSendMessage = (mailboxId: string, recipient: string, subject: string, body: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      mailboxId,
      sender: 'Cedric H.',
      recipient,
      subject,
      body,
      timestamp: new Date().toISOString(),
      isRead: true,
      tags: []
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const handleNewLeadSubmit = (data: any) => {
    let accountId = data.accountId;

    if (accountId === 'new') {
      const newAcc: Account = {
        id: `acc-${Date.now()}`,
        name: data.accountData.name || 'Unknown Company',
        domain: data.accountData.domain || '',
        industry: data.accountData.industry || 'TBD',
        size: 'N/A',
        notes: `Kontakt: ${data.personName} | Tel: ${data.phone} | E-Mail: ${data.email}`
      };
      setAccounts(prev => [...prev, newAcc]);
      accountId = newAcc.id;
    }

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      accountId: accountId,
      name: data.personName || data.name,
      stage: DealStage.LEAD,
      ownerId: 'cedric',
      value: data.value,
      nextStepDate: new Date().toISOString(),
      tags: data.tags,
      score: 85
    };
    
    setDeals(prev => [newDeal, ...prev]);
    setIsNewLeadModalOpen(false);
    handleSelectDeal(newDeal.id);
  };

  const handlePrepareCallGenerate = async (depth: 'Quick' | 'Standard' | 'Deep') => {
    if (!selectedDeal || !selectedAccount) return null;
    const result = await prepareCallAI(selectedDeal, selectedAccount, dealInteractions, depth);
    return result;
  };

  return (
    <Layout 
      onSearch={setSearchTerm} 
      onNewLead={() => setIsNewLeadModalOpen(true)}
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          hotLeads={hotLeads} 
          upcomingCalls={upcomingCalls} 
          openOffers={openOffers} 
          blockers={blockers} 
          onSelectDeal={handleSelectDeal} 
        />
      )}

      {activeTab === 'leads' && (
        selectedDeal && selectedAccount && selectedDeal.stage === DealStage.LEAD ? (
          <DealWorkspace 
            deal={selectedDeal} 
            account={selectedAccount} 
            interactions={dealInteractions} 
            tasks={dealTasks}
            onBack={() => setSelectedDealId(null)}
            onPrepareCall={() => setIsPrepareCallOpen(true)}
            onCreateOffer={() => alert('Angebotserstellung...')}
          />
        ) : (
          <LeadsList 
            leads={allLeads} 
            accounts={accounts} 
            onSelectLead={handleSelectDeal} 
            searchTerm={searchTerm}
          />
        )
      )}

      {activeTab === 'deals' && (
        selectedDeal && selectedAccount && selectedDeal.stage !== DealStage.LEAD ? (
          <DealWorkspace 
            deal={selectedDeal} 
            account={selectedAccount} 
            interactions={dealInteractions} 
            tasks={dealTasks}
            onBack={() => setSelectedDealId(null)}
            onPrepareCall={() => setIsPrepareCallOpen(true)}
            onCreateOffer={() => alert('Angebotserstellung...')}
          />
        ) : (
          <DealsList 
            deals={activePipeline} 
            accounts={accounts} 
            onSelectDeal={handleSelectDeal} 
            searchTerm={searchTerm}
          />
        )
      )}

      {activeTab === 'communication' && (
        <CommunicationHub 
          mailboxes={mailboxes} 
          messages={messages} 
          deals={deals} 
          accounts={accounts}
          onSendMessage={handleSendMessage}
          onAddTask={handleAddTask}
          onUpdateMessageTags={handleUpdateMessageTags}
          onLinkMessageToDeal={handleLinkMessageToDeal}
        />
      )}

      {activeTab === 'tasks' && (
        <TasksManager 
          tasks={tasks} 
          deals={deals} 
          accounts={accounts} 
          onToggleTask={handleToggleTask}
          onSelectDeal={handleSelectDeal}
          onStartPowerHour={() => setIsPowerHourOpen(true)}
        />
      )}

      {activeTab === 'settings' && (
        <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest">Settings coming soon...</div>
      )}

      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={() => setIsNewLeadModalOpen(false)} 
        accounts={accounts}
        onSubmit={handleNewLeadSubmit}
      />

      {isPrepareCallOpen && selectedDeal && selectedAccount && (
        <PrepareCallModal 
          isOpen={isPrepareCallOpen} 
          onClose={() => setIsPrepareCallOpen(false)} 
          onGenerate={handlePrepareCallGenerate}
          deal={selectedDeal}
          account={selectedAccount}
        />
      )}

      <PowerHour 
        isOpen={isPowerHourOpen}
        onClose={() => setIsPowerHourOpen(false)}
        tasks={tasks}
        deals={deals}
        accounts={accounts}
        onCompleteTask={handleToggleTask}
      />
    </Layout>
  );
};

export default App;
