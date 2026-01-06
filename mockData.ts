
import { Deal, Company, Contact, DealStage, Task, TaskType, TaskPriority, Interaction, InteractionType, Mailbox, Message } from './types.ts';

export const mockMailboxes: Mailbox[] = [
  { id: 'mb-1', name: 'KI Business', email: 'cedric@ki-ops.de', color: 'indigo', provider: 'gmail' },
  { id: 'mb-2', name: 'WE Immobilien', email: 'c.h@we-immobilien.de', color: 'amber', provider: 'custom' },
  { id: 'mb-3', name: 'Personal Gmail', email: 'cedric.private@gmail.com', color: 'rose', provider: 'gmail' },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    mailboxId: 'mb-1',
    sender: 'CTO @ Volkswagen',
    recipient: 'cedric@ki-ops.de',
    subject: 'Rückfrage zum KI-Audit',
    body: 'Hallo Cedric, wir haben uns das Dokument angesehen. Können wir die Latenz-Zeiten noch weiter optimieren?',
    timestamp: new Date().toISOString(),
    isRead: false,
    dealId: 'deal-1'
  },
  {
    id: 'msg-2',
    mailboxId: 'mb-2',
    sender: 'Hausverwaltung Müller',
    recipient: 'c.h@we-immobilien.de',
    subject: 'Nebenkostenabrechnung Objekt A1',
    body: 'Anbei die gewünschten Unterlagen für das Objekt in der Mainstraße.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true
  },
  {
    id: 'msg-3',
    mailboxId: 'mb-1',
    sender: 'Zalando Procurement',
    recipient: 'cedric@ki-ops.de',
    subject: 'Terminbestätigung Onboarding',
    body: 'Der Termin für nächste Woche steht. Wir freuen uns auf die Zusammenarbeit.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    dealId: 'deal-2'
  },
];

// Renamed from mockAccounts to mockCompanies
export const mockCompanies: Company[] = [
  { id: 'comp-1', name: 'Volkswagen AG', domain: 'vw.de', industry: 'Automotive', size: '10k+', notes: 'Interesse an KI-Prozess-Automatisierung für Logistik.' },
  { id: 'comp-2', name: 'Zalando SE', domain: 'zalando.io', industry: 'E-Commerce', size: '5k-10k', notes: 'Prüfen LLM-Einsatz im Customer Support.' },
  { id: 'comp-3', name: 'Siemens Healthineers', domain: 'siemens.com', industry: 'Healthcare', size: '10k+', notes: 'Security-Audit für KI-Modelle erforderlich.' },
  { id: 'comp-4', name: 'HypoVereinsbank', domain: 'hvb.de', industry: 'Finance', size: '1k-5k', notes: 'Compliance-Checks via Agenten-System.' },
];

// Backward compatibility alias
export const mockAccounts = mockCompanies;

// New: Contacts
export const mockContacts: Contact[] = [
  { id: 'contact-1', companyId: 'comp-1', name: 'Dr. Thomas Müller', email: 't.mueller@vw.de', phone: '+49 151 12345678', role: 'CTO', notes: 'Hauptansprechpartner für KI-Projekte' },
  { id: 'contact-2', companyId: 'comp-1', name: 'Anna Schmidt', email: 'a.schmidt@vw.de', phone: '+49 151 87654321', role: 'Head of Innovation', notes: 'Technische Entscheiderin' },
  { id: 'contact-3', companyId: 'comp-2', name: 'Max Weber', email: 'm.weber@zalando.io', phone: '+49 160 11223344', role: 'VP Engineering', notes: 'Fokus auf Customer Support Automation' },
  { id: 'contact-4', companyId: 'comp-3', name: 'Julia Becker', email: 'j.becker@siemens.com', phone: '+49 170 99887766', role: 'Security Lead', notes: 'Verantwortlich für AI Governance' },
  { id: 'contact-5', companyId: 'comp-4', name: 'Michael Fischer', email: 'm.fischer@hvb.de', phone: '+49 172 55443322', role: 'Head of Compliance', notes: 'Interested in AI compliance automation' },
];

// Updated Deals with new structure
export const mockDeals: Deal[] = [
  { id: 'deal-1', companyId: 'comp-1', primaryContactId: 'contact-1', title: 'Workflow Audit: Supply Chain', stage: DealStage.CALL_BOOKED, ownerId: 'cedric', value: 18500, nextStepDate: new Date().toISOString(), tags: ['urgent', 'audit'], score: 92 },
  { id: 'deal-2', companyId: 'comp-2', primaryContactId: 'contact-3', title: 'Custom LLM Support Bot', stage: DealStage.QUALIFIED, ownerId: 'cedric', value: 45000, nextStepDate: new Date(Date.now() + 86400000).toISOString(), tags: ['high-potential', 'build'], score: 78 },
  { id: 'deal-3', companyId: 'comp-3', primaryContactId: 'contact-4', title: 'AI Security Readiness', stage: DealStage.OFFER_SENT, ownerId: 'cedric', value: 12000, nextStepDate: new Date(Date.now() + 172800000).toISOString(), tags: ['follow-up'], score: 65 },
  { id: 'deal-4', companyId: 'comp-4', primaryContactId: 'contact-5', title: 'AI Ops Retainer Q4', stage: DealStage.WON, ownerId: 'cedric', value: 8500, nextStepDate: new Date(Date.now() + 345600000).toISOString(), tags: ['retainer'], score: 100 },
];

export const mockTasks: Task[] = [
  { id: 't-1', dealId: 'deal-1', title: 'Research VW Logistik-Stack', status: 'To-Do', type: TaskType.SALES, priority: TaskPriority.P0, ownerId: 'cedric', dueDate: new Date().toISOString(), isBlocker: true, estimatedMinutes: 20 },
  { id: 't-2', dealId: 'deal-2', title: 'API Dokumentation prüfen', status: 'Doing', type: TaskType.DELIVERY, priority: TaskPriority.P1, ownerId: 'cedric', dueDate: new Date().toISOString(), isBlocker: false, estimatedMinutes: 45 },
  { id: 't-3', dealId: 'deal-3', title: 'Follow-up Email senden', status: 'To-Do', type: TaskType.SALES, priority: TaskPriority.P1, ownerId: 'cedric', dueDate: new Date().toISOString(), isBlocker: false, estimatedMinutes: 5 },
  { id: 't-4', dealId: 'deal-1', title: 'Nachfassen Meeting Termin', status: 'To-Do', type: TaskType.SALES, priority: TaskPriority.P2, ownerId: 'cedric', dueDate: new Date().toISOString(), isBlocker: false, estimatedMinutes: 5 },
  { id: 't-5', dealId: 'deal-4', title: 'Onboarding Call vorbereiten', status: 'To-Do', type: TaskType.DELIVERY, priority: TaskPriority.P1, ownerId: 'cedric', dueDate: new Date().toISOString(), isBlocker: false, estimatedMinutes: 30 },
];

export const mockInteractions: Interaction[] = [
  { id: 'int-1', dealId: 'deal-1', type: InteractionType.SYSTEM, content: 'Inbound Anfrage via Website (VW). Fokus: Effizienzsteigerung.', timestamp: new Date(Date.now() - 172800000).toISOString() },
  { id: 'int-2', dealId: 'deal-1', type: InteractionType.NOTE, content: 'Vorab-Telefonat: CTO ist sehr offen für Automatisierung.', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'int-3', dealId: 'deal-4', type: InteractionType.SYSTEM, content: 'Angebot angenommen. Kick-off geplant.', timestamp: new Date(Date.now() - 432000000).toISOString() },
];

