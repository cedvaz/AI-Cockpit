
import React, { useState, useRef } from 'react';
import {
    X,
    Upload,
    FileText,
    Table as TableIcon,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ArrowLeft,
    Loader2,
    Database
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (companies: any[], contacts: any[]) => void;
}

type Step = 'upload' | 'mapping' | 'preview' | 'processing';

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const [step, setStep] = useState<Step>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [rawData, setRawData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const targetFields = [
        { key: 'company_name', label: 'Firma Name*', group: 'Company' },
        { key: 'company_domain', label: 'Firma Domain', group: 'Company' },
        { key: 'company_industry', label: 'Firma Branche', group: 'Company' },
        { key: 'contact_name', label: 'Kontakt Name*', group: 'Contact' },
        { key: 'contact_email', label: 'Kontakt E-Mail*', group: 'Contact' },
        { key: 'contact_phone', label: 'Kontakt Telefon', group: 'Contact' },
        { key: 'contact_role', label: 'Kontakt Rolle', group: 'Contact' },
    ];

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (file: File) => {
        setFile(file);
        const reader = new FileReader();

        if (file.name.endsWith('.csv')) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    setRawData(results.data);
                    setHeaders(Object.keys(results.data[0] || {}));
                    setStep('mapping');
                }
            });
        } else {
            reader.onload = (e) => {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);
                setRawData(json);
                setHeaders(Object.keys(json[0] || {}));
                setStep('mapping');
            };
            reader.readAsBinaryString(file);
        }
    };

    const handleMappingChange = (field: string, csvHeader: string) => {
        setMapping(prev => ({ ...prev, [field]: csvHeader }));
    };

    const autoMap = () => {
        const newMapping: Record<string, string> = {};
        headers.forEach(header => {
            const h = header.toLowerCase();
            if (h.includes('firma') || h.includes('company') || h.includes('name')) {
                if (!newMapping['company_name']) newMapping['company_name'] = header;
            }
            if (h.includes('domain') || h.includes('website')) newMapping['company_domain'] = header;
            if (h.includes('email') || h.includes('mail')) newMapping['contact_email'] = header;
            if (h.includes('kontakt') || h.includes('person') || h.includes('name')) {
                if (h !== newMapping['company_name']) newMapping['contact_name'] = header;
            }
        });
        setMapping(prev => ({ ...prev, ...newMapping }));
    };

    const executeImport = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const companiesMap = new Map();
            const finalContacts: any[] = [];

            rawData.forEach((row, index) => {
                const coName = row[mapping['company_name']];
                if (!coName) return;

                if (!companiesMap.has(coName)) {
                    companiesMap.set(coName, {
                        id: `import-co-${index}`,
                        name: coName,
                        domain: row[mapping['company_domain']] || '',
                        industry: row[mapping['company_industry']] || 'Imported',
                        size: 'Unknown',
                        notes: 'Batch imported'
                    });
                }

                const company = companiesMap.get(coName);
                if (row[mapping['contact_email']]) {
                    finalContacts.push({
                        id: `import-ct-${index}`,
                        companyId: company.id,
                        name: row[mapping['contact_name']] || 'Unknown',
                        email: row[mapping['contact_email']],
                        phone: row[mapping['contact_phone']] || '',
                        role: row[mapping['contact_role']] || 'Imported',
                        notes: ''
                    });
                }
            });

            onImport(Array.from(companiesMap.values()), finalContacts);
            setIsProcessing(false);
            setStep('upload');
            setFile(null);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
                <header className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Data Batch Import</h3>
                            <p className="text-slate-500 text-xs">CSV or Excel (xlsx) files</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {step === 'upload' && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 rounded-[2rem] p-16 flex flex-col items-center justify-center gap-4 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                        >
                            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-slate-900">Choose file or drag & drop</p>
                                <p className="text-slate-500 text-sm">Supports .csv, .xlsx</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".csv, .xlsx"
                            />
                        </div>
                    )}

                    {step === 'mapping' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center">
                                <button onClick={() => setStep('upload')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm">
                                    <ArrowLeft size={16} /> Change File
                                </button>
                                <button onClick={autoMap} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all">
                                    Auto-Detect Fields
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Mapping Fields</h4>
                                    <div className="space-y-4">
                                        {targetFields.map(field => (
                                            <div key={field.key} className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 flex justify-between">
                                                    {field.label}
                                                    <span className="text-[10px] text-indigo-400 uppercase tracking-tighter">{field.group}</span>
                                                </label>
                                                <select
                                                    value={mapping[field.key] || ''}
                                                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                >
                                                    <option value="">Select column...</option>
                                                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">File Preview</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    {headers.slice(0, 3).map(h => (
                                                        <th key={h} className="text-[10px] font-black text-slate-400 uppercase p-2 border-b border-slate-200">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rawData.slice(0, 5).map((row, i) => (
                                                    <tr key={i} className="text-xs text-slate-600">
                                                        {headers.slice(0, 3).map(h => (
                                                            <td key={h} className="p-2 border-b border-slate-100 truncate max-w-[100px]">{String(row[h] || '')}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[10px] text-slate-400 italic">Showing first 5 rows of {rawData.length} records</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-2xl transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={step === 'upload' || !mapping['company_name'] || isProcessing}
                        onClick={executeImport}
                        className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Import {rawData.length} Records
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ImportModal;
