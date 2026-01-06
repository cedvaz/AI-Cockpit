
import React, { useState } from 'react';
import {
    Building2,
    Plus,
    Trash2,
    Edit3,
    Globe,
    Users,
    ChevronRight,
    Search,
    X,
    Check,
    Briefcase
} from 'lucide-react';
import { Company, Contact } from '../types.ts';

interface CompanyListProps {
    companies: Company[];
    contacts: Contact[];
    onAddCompany: (company: Omit<Company, 'id'>) => void;
    onDeleteCompany: (id: string) => void;
    onUpdateCompany: (id: string, updates: Partial<Company>) => void;
    onSelectCompany: (id: string) => void;
    onCreateDeal: (companyId: string) => void;
    selectedCompanyId: string | null;
}

const CompanyList: React.FC<CompanyListProps> = ({
    companies,
    contacts,
    onAddCompany,
    onDeleteCompany,
    onUpdateCompany,
    onSelectCompany,
    onCreateDeal,
    selectedCompanyId
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Omit<Company, 'id'>>({ name: '', domain: '', industry: '', size: '', notes: '' });
    const [newCompany, setNewCompany] = useState({ name: '', domain: '', industry: '', size: '', notes: '' });
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        if (newCompany.name.trim()) {
            onAddCompany(newCompany);
            setNewCompany({ name: '', domain: '', industry: '', size: '', notes: '' });
            setIsAdding(false);
        }
    };

    const handleStartEdit = (e: React.MouseEvent, company: Company) => {
        e.stopPropagation();
        setEditingId(company.id);
        setEditForm({
            name: company.name,
            domain: company.domain,
            industry: company.industry,
            size: company.size,
            notes: company.notes
        });
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId && editForm.name.trim()) {
            onUpdateCompany(editingId, editForm);
            setEditingId(null);
        }
    };

    const getContactCount = (companyId: string) => {
        return contacts.filter(c => c.companyId === companyId).length;
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Building2 className="text-indigo-600" size={28} />
                        Firmen
                        <span className="bg-indigo-100 text-indigo-600 text-xs px-2.5 py-1 rounded-lg">{companies.length}</span>
                    </h2>
                    <p className="text-slate-500 font-medium">Verwalte deine Firmenkontakte an einem Ort.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
                >
                    <Plus size={18} />
                    Neue Firma
                </button>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Firmen durchsuchen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-lg font-medium focus:border-indigo-600 outline-none transition-all"
                />
            </div>

            {/* Quick Add Form */}
            {isAdding && (
                <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 shadow-lg animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900">Neue Firma anlegen</h3>
                        <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Firmenname *"
                            value={newCompany.name}
                            onChange={e => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                            autoFocus
                        />
                        <input
                            type="text"
                            placeholder="Domain (z.B. example.com)"
                            value={newCompany.domain}
                            onChange={e => setNewCompany(prev => ({ ...prev, domain: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                        />
                        <input
                            type="text"
                            placeholder="Branche"
                            value={newCompany.industry}
                            onChange={e => setNewCompany(prev => ({ ...prev, industry: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                        />
                        <select
                            value={newCompany.size}
                            onChange={e => setNewCompany(prev => ({ ...prev, size: e.target.value }))}
                            className="px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                        >
                            <option value="">Größe wählen</option>
                            <option value="1-10">1-10</option>
                            <option value="11-50">11-50</option>
                            <option value="51-200">51-200</option>
                            <option value="201-1k">201-1k</option>
                            <option value="1k-5k">1k-5k</option>
                            <option value="5k-10k">5k-10k</option>
                            <option value="10k+">10k+</option>
                        </select>
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
                            disabled={!newCompany.name.trim()}
                            className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check size={18} />
                            Firma anlegen
                        </button>
                    </div>
                </div>
            )}

            {/* Company List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                {filteredCompanies.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredCompanies.map(company => {
                            const contactCount = getContactCount(company.id);
                            const isSelected = selectedCompanyId === company.id;
                            const isDeleting = deleteConfirm === company.id;
                            const isEditing = editingId === company.id;

                            if (isEditing) {
                                return (
                                    <form key={company.id} onSubmit={handleSaveEdit} className="p-8 bg-indigo-50/30 animate-in fade-in">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="px-4 py-3 bg-white border-2 border-indigo-100 rounded-xl font-bold focus:border-indigo-600 outline-none transition-all"
                                                placeholder="Name *"
                                                autoFocus
                                            />
                                            <input
                                                type="text"
                                                value={editForm.domain}
                                                onChange={e => setEditForm(prev => ({ ...prev, domain: e.target.value }))}
                                                className="px-4 py-3 bg-white border-2 border-indigo-100 rounded-xl font-bold focus:border-indigo-600 outline-none transition-all"
                                                placeholder="Domain"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.industry}
                                                onChange={e => setEditForm(prev => ({ ...prev, industry: e.target.value }))}
                                                className="px-4 py-3 bg-white border-2 border-indigo-100 rounded-xl font-bold focus:border-indigo-600 outline-none transition-all"
                                                placeholder="Branche"
                                            />
                                            <div className="flex gap-2">
                                                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                                                    Speichern
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="px-4 bg-white border-2 border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                );
                            }

                            return (
                                <div
                                    key={company.id}
                                    className={`group flex flex-col sm:flex-row sm:items-center justify-between px-8 py-6 hover:bg-slate-50 transition-all cursor-pointer ${isSelected ? 'bg-indigo-50' : ''}`}
                                    onClick={() => onSelectCompany(company.id)}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                                            {company.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-lg">{company.name}</p>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                    <Globe size={12} />
                                                    {company.domain || 'Keine Domain'}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 hidden sm:inline">•</span>
                                                <span className="text-xs font-bold text-slate-400">{company.industry || 'Keine Branche'}</span>
                                                <span className="text-xs font-bold text-slate-400 hidden sm:inline">•</span>
                                                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                                                    <Users size={12} />
                                                    {contactCount} Kontakte
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4 sm:mt-0" onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => onCreateDeal(company.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 text-xs font-black rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                                        >
                                            <Briefcase size={14} />
                                            Deal erstellen
                                        </button>

                                        {isDeleting ? (
                                            <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl">
                                                <span className="text-xs font-bold text-red-600">Löschen?</span>
                                                <button
                                                    onClick={() => {
                                                        onDeleteCompany(company.id);
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
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => handleStartEdit(e, company)}
                                                    className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(company.id)}
                                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-600 transition-all" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="px-8 py-20 text-center">
                        <div className="max-w-xs mx-auto space-y-4 opacity-40">
                            <Building2 size={48} className="mx-auto text-slate-300" />
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                {searchTerm ? 'Keine Firmen gefunden.' : 'Noch keine Firmen angelegt.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyList;
