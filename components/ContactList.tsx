
import React, { useState } from 'react';
import {
    User,
    Plus,
    Trash2,
    Mail,
    Phone,
    Building2,
    Search,
    X,
    Check,
    Briefcase,
    Edit3
} from 'lucide-react';
import { Company, Contact } from '../types.ts';

interface ContactListProps {
    contacts: Contact[];
    companies: Company[];
    selectedCompanyId: string | null;
    onAddContact: (contact: Omit<Contact, 'id'>) => void;
    onUpdateContact: (id: string, updates: Partial<Contact>) => void;
    onDeleteContact: (id: string) => void;
    onCreateDeal: (contactId: string, companyId: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({
    contacts,
    companies,
    selectedCompanyId,
    onAddContact,
    onUpdateContact,
    onDeleteContact,
    onCreateDeal
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Omit<Contact, 'id'>>({ companyId: '', name: '', email: '', phone: '', role: '', notes: '' });
    const [newContact, setNewContact] = useState({
        companyId: selectedCompanyId || '',
        name: '',
        email: '',
        phone: '',
        role: '',
        notes: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Filter contacts by selected company and search term
    const filteredContacts = contacts.filter(c => {
        const matchesCompany = !selectedCompanyId || c.companyId === selectedCompanyId;
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCompany && matchesSearch;
    });

    const getCompanyName = (companyId: string) => {
        return companies.find(c => c.id === companyId)?.name || 'Unbekannt';
    };

    const handleAdd = () => {
        if (newContact.name.trim() && newContact.companyId) {
            onAddContact(newContact);
            setNewContact({
                companyId: selectedCompanyId || '',
                name: '',
                email: '',
                phone: '',
                role: '',
                notes: ''
            });
            setIsAdding(false);
        }
    };

    const handleStartEdit = (contact: Contact) => {
        setEditingId(contact.id);
        setEditForm({
            companyId: contact.companyId,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            role: contact.role,
            notes: contact.notes
        });
    };

    const handleSaveEdit = () => {
        if (editingId && editForm.name.trim()) {
            onUpdateContact(editingId, editForm);
            setEditingId(null);
        }
    };

    // Update companyId when selectedCompanyId changes
    React.useEffect(() => {
        if (selectedCompanyId) {
            setNewContact(prev => ({ ...prev, companyId: selectedCompanyId }));
        }
    }, [selectedCompanyId]);

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <User className="text-emerald-600" size={28} />
                        Kontakte
                        <span className="bg-emerald-100 text-emerald-600 text-xs px-2.5 py-1 rounded-lg">{filteredContacts.length}</span>
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {selectedCompanyId
                            ? `Kontakte für ${getCompanyName(selectedCompanyId)}`
                            : 'Alle Kontakte aus deinem Netzwerk.'
                        }
                    </p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
                >
                    <Plus size={18} />
                    Neuer Kontakt
                </button>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Kontakte durchsuchen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-lg font-medium focus:border-emerald-600 outline-none transition-all"
                />
            </div>

            {/* Quick Add Form */}
            {isAdding && (
                <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-lg animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900">Neuen Kontakt anlegen</h3>
                        <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <select
                            value={newContact.companyId}
                            onChange={e => setNewContact(prev => ({ ...prev, companyId: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                        >
                            <option value="">Firma wählen *</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Name *"
                            value={newContact.name}
                            onChange={e => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                        />
                        <input
                            type="email"
                            placeholder="E-Mail"
                            value={newContact.email}
                            onChange={e => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                        />
                        <input
                            type="tel"
                            placeholder="Telefon"
                            value={newContact.phone}
                            onChange={e => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                        />
                        <input
                            type="text"
                            placeholder="Rolle / Position"
                            value={newContact.role}
                            onChange={e => setNewContact(prev => ({ ...prev, role: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-all"
                        >
                            Abbrechen
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={!newContact.name.trim() || !newContact.companyId}
                            className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check size={18} />
                            Kontakt anlegen
                        </button>
                    </div>
                </div>
            )}

            {/* Editing Form */}
            {editingId && (
                <div className="bg-emerald-50 rounded-3xl border-2 border-emerald-200 p-6 shadow-lg animate-in fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900">Kontakt bearbeiten</h3>
                        <button onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="px-4 py-3 bg-white border-2 border-emerald-100 rounded-xl font-bold outline-none"
                            placeholder="Name *"
                        />
                        <input
                            type="email"
                            value={editForm.email}
                            onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="px-4 py-3 bg-white border-2 border-emerald-100 rounded-xl font-bold outline-none"
                            placeholder="E-Mail"
                        />
                        <input
                            type="text"
                            value={editForm.role}
                            onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                            className="px-4 py-3 bg-white border-2 border-emerald-100 rounded-xl font-bold outline-none"
                            placeholder="Rolle"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setEditingId(null)} className="px-6 py-3 text-slate-500 font-bold">Abbrechen</button>
                        <button onClick={handleSaveEdit} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl">Speichern</button>
                    </div>
                </div>
            )}

            {/* Contact List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.length > 0 ? filteredContacts.map(contact => {
                    const isDeleting = deleteConfirm === contact.id;

                    return (
                        <div
                            key={contact.id}
                            className="group bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
                                    {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleStartEdit(contact)}
                                        className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    {isDeleting ? (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    onDeleteContact(contact.id);
                                                    setDeleteConfirm(null);
                                                }}
                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(contact.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-black text-slate-900 text-xl mb-1">{contact.name}</h3>
                                {contact.role && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-bold mb-3">
                                        <Briefcase size={14} />
                                        {contact.role}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-widest mb-4">
                                    <Building2 size={12} />
                                    {getCompanyName(contact.companyId)}
                                </div>

                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                    {contact.email && (
                                        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-all font-medium">
                                            <Mail size={14} />
                                            {contact.email}
                                        </a>
                                    )}
                                    {contact.phone && (
                                        <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-all font-medium">
                                            <Phone size={14} />
                                            {contact.phone}
                                        </a>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => onCreateDeal(contact.id, contact.companyId)}
                                className="w-full mt-6 py-3 bg-amber-50 text-amber-600 font-black rounded-2xl hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2 text-xs"
                            >
                                <Briefcase size={14} />
                                Deal erstellen
                            </button>
                        </div>
                    );
                }) : (
                    <div className="col-span-full px-8 py-20 text-center bg-white rounded-3xl border border-slate-200">
                        <div className="max-w-xs mx-auto space-y-4 opacity-40">
                            <User size={48} className="mx-auto text-slate-300" />
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                {searchTerm ? 'Keine Kontakte gefunden.' : 'Noch keine Kontakte angelegt.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactList;
