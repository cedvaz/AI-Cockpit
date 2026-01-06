
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import DealsList from './components/DealsList.tsx';
import TasksManager from './components/TasksManager.tsx';
import CommunicationHub from './components/CommunicationHub.tsx';
import PowerHour from './components/PowerHour.tsx';
import DealWorkspace from './components/DealWorkspace.tsx';
import PrepareCallModal from './components/PrepareCallModal.tsx';
import CompanyList from './components/CompanyList.tsx';
import ContactList from './components/ContactList.tsx';
import QuickAddModal from './components/QuickAddModal.tsx';
import ImportModal from './components/ImportModal.tsx';
import { mockDeals, mockTasks, mockInteractions, mockCompanies, mockContacts, mockMailboxes, mockMessages } from './mockData.ts';
import { Deal, Company, Contact, Task, Interaction, DealStage, Mailbox, Message } from './types.ts';
import { prepareCallAI } from './services/geminiService.ts';

const App: React.FC = () => {
  // State
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [mailboxes] = useState<Mailbox[]>(mockMailboxes);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks' | 'communication' | 'settings'>('dashboard');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isPrepareCallOpen, setIsPrepareCallOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddInitialData, setQuickAddInitialData] = useState<{ type?: 'company' | 'contact' | 'deal', companyId?: string, contactId?: string }>({});
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPowerHourOpen, setIsPowerHourOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Derived state
  const selectedDeal = useMemo(() => deals.find(d => d.id === selectedDealId), [deals, selectedDealId]);
  const selectedCompany = useMemo(() => companies.find(c => c.id === selectedDeal?.companyId), [companies, selectedDeal]);
  const dealInteractions = useMemo(() => interactions.filter(i => i.dealId === selectedDealId), [interactions, selectedDealId]);
  const dealTasks = useMemo(() => tasks.filter(t => t.dealId === selectedDealId), [tasks, selectedDealId]);

  const activePipeline = useMemo(() => deals, [deals]);

  const hotLeads = useMemo(() => deals.filter(d => d.score >= 80), [deals]);
  const upcomingCalls = useMemo(() => {
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    return deals.filter(d => d.stage === DealStage.CALL_BOOKED && new Date(d.nextStepDate) <= next7Days);
  }, [deals]);
  const openOffers = useMemo(() => deals.filter(d => d.stage === DealStage.OFFER_SENT), [deals]);
  const blockers = useMemo(() => tasks.filter(t => t.isBlocker), [tasks]);

  // Company Handlers
  const handleAddCompany = (companyData: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      ...companyData,
      id: `comp-${Date.now()}`
    };
    setCompanies(prev => [newCompany, ...prev]);
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    setContacts(prev => prev.filter(c => c.companyId !== id));
    setDeals(prev => prev.filter(d => d.companyId !== id));
    if (selectedCompanyId === id) setSelectedCompanyId(null);
  };

  const handleUpdateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Contact Handlers
  const handleAddContact = (contactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `contact-${Date.now()}`
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Deal Handlers
  const handleAddDeal = (dealData: { companyId: string; primaryContactId: string; title: string; value?: number; }) => {
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      companyId: dealData.companyId,
      primaryContactId: dealData.primaryContactId,
      title: dealData.title,
      stage: DealStage.LEAD,
      ownerId: 'cedric',
      value: dealData.value,
      nextStepDate: new Date().toISOString(),
      tags: [],
      score: 85
    };
    setDeals(prev => [newDeal, ...prev]);
    setActiveTab('deals');
  };

  const handleSelectDeal = (id: string) => {
    setSelectedDealId(id);
    setActiveTab('deals');
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

  const handlePrepareCallGenerate = async (depth: 'Quick' | 'Standard' | 'Deep') => {
    if (!selectedDeal || !selectedCompany) return null;
    const result = await prepareCallAI(selectedDeal, selectedCompany, dealInteractions, depth);
    return result;
  };

  const handleBatchImport = (newCompanies: Company[], newContacts: Contact[]) => {
    setCompanies(prev => [...newCompanies, ...prev]);
    setContacts(prev => [...newContacts, ...prev]);
  };

  return (
    <Layout
      onSearch={setSearchTerm}
      onQuickAdd={() => {
        setQuickAddInitialData({});
        setIsQuickAddOpen(true);
      }}
      onImport={() => setIsImportModalOpen(true)}
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

      {activeTab === 'companies' && (
        <CompanyList
          companies={companies}
          contacts={contacts}
          onAddCompany={handleAddCompany}
          onDeleteCompany={handleDeleteCompany}
          onUpdateCompany={handleUpdateCompany}
          onSelectCompany={(id) => {
            setSelectedCompanyId(id);
            setActiveTab('contacts');
          }}
          onCreateDeal={(companyId) => {
            setQuickAddInitialData({ type: 'deal', companyId });
            setIsQuickAddOpen(true);
          }}
          selectedCompanyId={selectedCompanyId}
        />
      )}

      {activeTab === 'contacts' && (
        <ContactList
          contacts={contacts}
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onAddContact={handleAddContact}
          onUpdateContact={handleUpdateContact}
          onDeleteContact={handleDeleteContact}
          onCreateDeal={(contactId, companyId) => {
            setQuickAddInitialData({ type: 'deal', contactId, companyId });
            setIsQuickAddOpen(true);
          }}
        />
      )}

      {activeTab === 'deals' && (
        selectedDeal && selectedCompany ? (
          <DealWorkspace
            deal={selectedDeal}
            company={selectedCompany}
            interactions={dealInteractions}
            tasks={dealTasks}
            onBack={() => setSelectedDealId(null)}
            onPrepareCall={() => setIsPrepareCallOpen(true)}
            onCreateOffer={() => alert('Angebotserstellung...')}
          />
        ) : (
          <DealsList
            deals={activePipeline}
            companies={companies}
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
          companies={companies}
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
          companies={companies}
          onToggleTask={handleToggleTask}
          onSelectDeal={handleSelectDeal}
          onStartPowerHour={() => setIsPowerHourOpen(true)}
        />
      )}

      {activeTab === 'settings' && (
        <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest">Settings coming soon...</div>
      )}

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        companies={companies}
        contacts={contacts}
        onAddCompany={handleAddCompany}
        onAddContact={handleAddContact}
        onAddDeal={handleAddDeal}
        initialType={quickAddInitialData.type}
        initialCompanyId={quickAddInitialData.companyId}
        initialContactId={quickAddInitialData.contactId}
      />

      {isPrepareCallOpen && selectedDeal && selectedCompany && (
        <PrepareCallModal
          isOpen={isPrepareCallOpen}
          onClose={() => setIsPrepareCallOpen(false)}
          onGenerate={handlePrepareCallGenerate}
          deal={selectedDeal}
          company={selectedCompany}
        />
      )}

      <PowerHour
        isOpen={isPowerHourOpen}
        onClose={() => setIsPowerHourOpen(false)}
        tasks={tasks}
        deals={deals}
        companies={companies}
        onCompleteTask={handleToggleTask}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleBatchImport}
      />
    </Layout>
  );
};

export default App;
