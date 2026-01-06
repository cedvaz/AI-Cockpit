
export enum DealStage {
  LEAD = 'Lead',
  QUALIFIED = 'Qualified',
  CALL_BOOKED = 'Call Booked',
  CALL_DONE = 'Call Done',
  OFFER_SENT = 'Offer Sent',
  WON = 'Won',
  LOST = 'Lost'
}

export enum TaskType {
  SALES = 'Sales',
  DELIVERY = 'Delivery',
  ADMIN = 'Admin'
}

export enum TaskPriority {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3'
}

export enum InteractionType {
  EMAIL = 'email',
  CALL = 'call',
  NOTE = 'note',
  SYSTEM = 'system',
  RESEARCH = 'research',
  OFFER = 'offer'
}

export interface Mailbox {
  id: string;
  name: string;
  email: string;
  color: string;
  provider: 'gmail' | 'outlook' | 'custom';
}

export interface Message {
  id: string;
  mailboxId: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  dealId?: string;
  tags?: string[];
}

export interface Account {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  notes: string;
}

export interface Task {
  id: string;
  dealId: string;
  title: string;
  description?: string;
  status: 'To-Do' | 'Doing' | 'Done';
  type: TaskType;
  priority: TaskPriority;
  ownerId: string;
  dueDate: string;
  isBlocker: boolean;
  estimatedMinutes?: number;
}

export interface Interaction {
  id: string;
  dealId: string;
  type: InteractionType;
  content: string;
  timestamp: string;
}

export interface Deal {
  id: string;
  accountId: string;
  name: string;
  stage: DealStage;
  ownerId: string;
  value?: number;
  nextStepDate: string;
  tags: string[];
  score: number;
}
