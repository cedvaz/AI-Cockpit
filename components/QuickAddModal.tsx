
import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Building2,
    User,
    Briefcase,
    Zap,
    Command
} from 'lucide-react';
import { Company, Contact, DealStage } from '../types.ts';

type EntityType = 'company' | 'contact' | 'deal';

interface QuickAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    companies: Company[];
    contacts: Contact[];
    onAddCompany: (company: Omit<Company, 'id'>) => void;
    onAddContact: (contact: Omit<Contact, 'id'>) => void;
    onAddDeal: (deal: { companyId: string; primaryContactId: string; title: string; value?: number; }) => void;
    initialType?: EntityType;
    initialCompanyId?: string;
    initialContactId?: string;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({
    isOpen,
    onClose,
    companies,
    contacts,
    onAddCompany,
    onAddContact,
    onAddDeal,
    initialType,
    initialCompanyId,
    initialContactId
}) => {
    const [activeTab, setActiveTab] = useState<EntityType>('company');
    const inputRef = useRef<HTMLInputElement>(null);

    // Company form
    const [companyName, setCompanyName] = useState('');
    const [companyDomain, setCompanyDomain] = useState('');
    const [companyIndustry, setCompanyIndustry] = useState('');

    // Contact form
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactCompanyId, setContactCompanyId] = useState('');
    const [contactRole, setContactRole] = useState('');

    // Deal form
    const [dealTitle, setDealTitle] = useState('');
    const [dealCompanyId, setDealCompanyId] = useState('');
    const [dealContactId, setDealContactId] = useState('');
    const [dealValue, setDealValue] = useState('');

    // Pre-fill data when modal opens or initial props change
    useEffect(() => {
        if (isOpen) {
            if (initialType) setActiveTab(initialType);
            if (initialCompanyId) {
                setContactCompanyId(initialCompanyId);
                setDealCompanyId(initialCompanyId);
            }
            if (initialContactId) {
                setDealContactId(initialContactId);
            }
        } else {
            resetForms();
        }
    }, [isOpen, initialType, initialCompanyId, initialContactId]);

    // Focus input when modal opens or tab changes
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, activeTab]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            }
            if (e.key === '1' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setActiveTab('company');
            }
            if (e.key === '2' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setActiveTab('contact');
            }
            if (e.key === '3' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setActiveTab('deal');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const resetForms = () => {
        setCompanyName('');
        setCompanyDomain('');
        setCompanyIndustry('');
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactCompanyId('');
        setContactRole('');
        setDealTitle('');
        setDealCompanyId('');
        setDealContactId('');
        setDealValue('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (activeTab === 'company' && companyName.trim()) {
            onAddCompany({
                name: companyName,
                domain: companyDomain,
                industry: companyIndustry,
                size: '',
                notes: ''
            });
            onClose();
        }

        if (activeTab === 'contact' && contactName.trim() && contactCompanyId) {
            onAddContact({
                companyId: contactCompanyId,
                name: contactName,
                email: contactEmail,
                phone: contactPhone,
                role: contactRole,
                notes: ''
            });
            onClose();
        }

        if (activeTab === 'deal' && dealTitle.trim() && dealCompanyId && dealContactId) {
            onAddDeal({
                companyId: dealCompanyId,
                primaryContactId: dealContactId,
                title: dealTitle,
                value: dealValue ? parseInt(dealValue) : undefined
            });
            onClose();
        }
    };

    // Get contacts for selected company in deal form
    const availableContacts = contacts.filter(c => c.companyId === dealCompanyId);

    if (!isOpen) return null;

    const tabs = [
        { id: 'company' as EntityType, label: 'Firma', icon: Building2, color: 'indigo', shortcut: '1' },
        { id: 'contact' as EntityType, label: 'Kontakt', icon: User, color: 'emerald', shortcut: '2' },
        { id: 'deal' as EntityType, label: 'Deal', icon: Briefcase, color: 'amber', shortcut: '3' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/80 backdrop-blur-xl p-4 pt-[15vh]">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-xl">
                            <Zap size={20} className="text-slate-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">Quick Add</h3>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Command size={10} /> + 1/2/3 zum Wechseln
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold text-sm transition-all border-b-2 ${isActive
                                    ? `border-${tab.color}-600 text-${tab.color}-600 bg-${tab.color}-50/50`
                                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                                style={isActive ? {
                                    borderColor: tab.color === 'indigo' ? '#4f46e5' : tab.color === 'emerald' ? '#059669' : '#d97706',
                                    color: tab.color === 'indigo' ? '#4f46e5' : tab.color === 'emerald' ? '#059669' : '#d97706'
                                } : {}}
                            >
                                <Icon size={18} />
                                {tab.label}
                                <span className="text-[10px] text-slate-300 ml-1">⌘{tab.shortcut}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {activeTab === 'company' && (
                        <>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Firmenname *"
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-lg font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Domain"
                                    value={companyDomain}
                                    onChange={e => setCompanyDomain(e.target.value)}
                                    className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Branche"
                                    value={companyIndustry}
                                    onChange={e => setCompanyIndustry(e.target.value)}
                                    className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'contact' && (
                        <>
                            <select
                                value={contactCompanyId}
                                onChange={e => setContactCompanyId(e.target.value)}
                                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-lg font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                            >
                                <option value="">Firma wählen *</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Name *"
                                value={contactName}
                                onChange={e => setContactName(e.target.value)}
                                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-lg font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="email"
                                    placeholder="E-Mail"
                                    value={contactEmail}
                                    onChange={e => setContactEmail(e.target.value)}
                                    className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                                />
                                <input
                                    type="tel"
                                    placeholder="Telefon"
                                    value={contactPhone}
                                    onChange={e => setContactPhone(e.target.value)}
                                    className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Rolle / Position"
                                value={contactRole}
                                onChange={e => setContactRole(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                            />
                        </>
                    )}

                    {activeTab === 'deal' && (
                        <>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Deal-Titel *"
                                value={dealTitle}
                                onChange={e => setDealTitle(e.target.value)}
                                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-lg font-bold focus:border-amber-600 focus:bg-white outline-none transition-all"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={dealCompanyId}
                                    onChange={e => {
                                        setDealCompanyId(e.target.value);
                                        setDealContactId('');
                                    }}
                                    className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-amber-600 focus:bg-white outline-none transition-all"
                                >
                                    <option value="">Firma *</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={dealContactId}
                                    onChange={e => setDealContactId(e.target.value)}
                                    disabled={!dealCompanyId}
                                    className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-amber-600 focus:bg-white outline-none transition-all disabled:opacity-50"
                                >
                                    <option value="">Kontakt *</option>
                                    {availableContacts.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="number"
                                placeholder="Wert in € (optional)"
                                value={dealValue}
                                onChange={e => setDealValue(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-amber-600 focus:bg-white outline-none transition-all"
                            />
                        </>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all mt-6 flex items-center justify-center gap-2"
                    >
                        <Zap size={18} />
                        {activeTab === 'company' && 'Firma anlegen'}
                        {activeTab === 'contact' && 'Kontakt anlegen'}
                        {activeTab === 'deal' && 'Deal starten'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickAddModal;
