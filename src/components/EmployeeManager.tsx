/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ThemeSettings } from '../types';
import { 
  Mail, Phone, Smartphone, MessageSquare, Printer, ShieldAlert, Key, 
  Hotel, Sliders, Calendar, ShoppingCart, Receipt, RefreshCw, QrCode, 
  Lock, History, User, Check, Trash2, UserPlus, Download, Search, CheckSquare, 
  Square, ShieldCheck, MailCheck, AlertTriangle, Filter, CheckCircle2,
  X, Briefcase, AtSign, ChevronRight, ChevronLeft
} from 'lucide-react';

interface Employee {
  id: number;
  title: string;
  name: string;
  companyName: string;
  email: string;
  role: 'Employee' | 'Visitor' | 'Exhibitor' | 'Guest' | 'Survey';
  presence: 'present' | 'meeting' | 'not-present' | 'left';
  presenceText?: string;
  avatarUrl?: string;
  avatarBg?: string;
  hasHotelRequest?: boolean;
}

interface EmployeeManagerProps {
  theme: ThemeSettings;
  onShowToast: (msg: string) => void;
  initialSearch?: string;
  onSelectEmployee?: (empId: number) => void;
}

// Initial robust employee list matching the exact names and company profiles in the screenshot
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    title: 'Mr.',
    name: 'Sergey Cherniavsky',
    companyName: 'XFAIR GmbH',
    email: 'sergey.cherniavsky@xfair.gmbh',
    role: 'Employee',
    presence: 'present',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hasHotelRequest: false
  },
  {
    id: 2,
    title: 'Mr.',
    name: 'Günter Koiner',
    companyName: 'FC Bayern GmbH',
    email: 'guenter.koiner@fcbayern.de',
    role: 'Exhibitor',
    presence: 'present',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hasHotelRequest: true
  },
  {
    id: 3,
    title: 'Ms.',
    name: 'Rajashree Swain',
    companyName: 'Hankaass Test GmbH',
    email: 'rajashree.swain@hankaass.de',
    role: 'Employee',
    presence: 'present',
    avatarBg: 'bg-indigo-600',
    hasHotelRequest: true
  },
  {
    id: 4,
    title: 'Mr.',
    name: 'Steven Terry',
    companyName: 'XFAIR GmbH',
    email: 'steven.terry@xfair.gmbh',
    role: 'Employee',
    presence: 'meeting',
    presenceText: 'In meeting until 15:30',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    hasHotelRequest: true
  },
  {
    id: 5,
    title: 'Mr.',
    name: 'Arslan Anwar Khawaja',
    companyName: 'XFAIR GmbH',
    email: 'arslan.khawaja@xfair.gmbh',
    role: 'Visitor',
    presence: 'left',
    presenceText: 'Day end until checkout',
    avatarBg: 'bg-amber-600',
    hasHotelRequest: false
  },
  {
    id: 6,
    title: '',
    name: 'Priyank B',
    companyName: 'FC Bayern GmbH',
    email: 'priyank.b@fcbayern.de',
    role: 'Employee',
    presence: 'not-present',
    avatarBg: 'bg-[#F35D00]',
    hasHotelRequest: false
  },
  {
    id: 7,
    title: '',
    name: 'Bengi Benli',
    companyName: 'Hankaass Test GmbH',
    email: 'bengi.benli@hankaass.com',
    role: 'Guest',
    presence: 'not-present',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    hasHotelRequest: false
  },
  {
    id: 8,
    title: '',
    name: 'Joe berg',
    companyName: 'XFAIR GmbH',
    email: 'joe.berg@xfair.gmbh',
    role: 'Employee',
    presence: 'not-present',
    avatarBg: 'bg-cyan-600',
    hasHotelRequest: false
  },
  {
    id: 9,
    title: '',
    name: 'Anirudh G',
    companyName: 'XFAIR GmbH',
    email: 'anirudh.g@xfair.gmbh',
    role: 'Guest',
    presence: 'present',
    avatarBg: 'bg-emerald-600',
    hasHotelRequest: false
  },
  {
    id: 10,
    title: 'Ms.',
    name: 'Aniruddhsinh Gohil',
    companyName: 'XFAIR GmbH',
    email: 'aniruddhsinh.gohil@xfair.gmbh',
    role: 'Employee',
    presence: 'not-present',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    hasHotelRequest: true
  },
  {
    id: 11,
    title: '',
    name: 'Robert P',
    companyName: 'FC Bayern GmbH',
    email: 'robert.p@fcbayern.de',
    role: 'Exhibitor',
    presence: 'not-present',
    avatarBg: 'bg-violet-600',
    hasHotelRequest: false
  },
  {
    id: 12,
    title: '',
    name: 'Stephenie P',
    companyName: 'Hankaass Test GmbH',
    email: 'stephenie.p@hankaass.com',
    role: 'Visitor',
    presence: 'not-present',
    avatarBg: 'bg-[#2F3747]',
    hasHotelRequest: true
  }
];

export default function EmployeeManager({ theme, onShowToast, initialSearch = '', onSelectEmployee }: EmployeeManagerProps) {
  const isPremium = theme.mode === 'premium';
  
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [filterCompany, setFilterCompany] = useState<string>('All');
  const [filterPresence, setFilterPresence] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isBulkActionMenuOpen, setIsBulkActionMenuOpen] = useState<boolean>(true);

  // New Employee fields
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpCompany, setNewEmpCompany] = useState('XFAIR GmbH');
  const [newEmpRole, setNewEmpRole] = useState<'Employee' | 'Visitor' | 'Exhibitor' | 'Guest' | 'Survey'>('Employee');
  const [newEmpPresence, setNewEmpPresence] = useState<'present' | 'meeting' | 'not-present' | 'left'>('present');
  const [newEmpEmail, setNewEmpEmail] = useState('');

  // Local Search & Filtering logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCompany = filterCompany === 'All' || emp.companyName === filterCompany;
      const matchPresence = filterPresence === 'All' || emp.presence === filterPresence;
      
      return matchSearch && matchCompany && matchPresence;
    });
  }, [employees, searchTerm, filterCompany, filterPresence]);

  const companiesList = useMemo(() => {
    const list = new Set(employees.map(e => e.companyName));
    return ['All', ...Array.from(list)];
  }, [employees]);

  // Bulk actions toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredEmployees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmployees.map(emp => emp.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const executeBulkAction = (actionName: string) => {
    const targetCount = selectedIds.length > 0 ? selectedIds.length : filteredEmployees.length;
    const targetList = selectedIds.length > 0 ? "selected persons" : "all displayed persons";
    onShowToast(`Bulk execution triggered: ${actionName} for ${targetCount} ${targetList}!`);
  };

  const triggerSingleAction = (employeeName: string, actionName: string) => {
    onShowToast(`Executed action: "${actionName}" for ${employeeName}`);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) {
      onShowToast('Please enter an employee name before submitting.');
      return;
    }
    const newId = Date.now();
    const newEmp: Employee = {
      id: newId,
      title: 'Mr.',
      name: newEmpName,
      companyName: newEmpCompany,
      email: newEmpEmail || `${newEmpName.toLowerCase().replace(/\s+/g, '.')}@${newEmpCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      role: newEmpRole,
      presence: newEmpPresence,
      avatarBg: 'bg-zinc-500',
      hasHotelRequest: false
    };
    setEmployees([newEmp, ...employees]);
    setShowAddModal(false);
    // Clear inputs
    setNewEmpName('');
    setNewEmpEmail('');
    onShowToast(`Successfully added employee: ${newEmpName}!`);
  };

  const handleDeleteEmployee = (id: number, name: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    setSelectedIds(selectedIds.filter(x => x !== id));
    onShowToast(`Removed employee ${name} from event database.`);
  };
  // Status helper widgets
  const getStatusInfo = (presence: 'present' | 'meeting' | 'not-present' | 'left', text?: string) => {
    switch (presence) {
      case 'present':
        return {
          bannerColor: 'bg-emerald-500',
          borderColor: 'border-l-emerald-500', 
          textColor: 'text-emerald-700',
          label: 'Present',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
        };
      case 'meeting':
        return {
          bannerColor: 'bg-yellow-500',
          borderColor: 'border-l-yellow-400',
          textColor: 'text-yellow-700',
          label: 'Meeting until 12:30PM',
          badgeBg: 'bg-yellow-50 text-yellow-700 border-yellow-200/50'
        };
      case 'left':
        return {
          bannerColor: 'bg-rose-500',
          borderColor: 'border-l-rose-500',
          textColor: 'text-rose-700',
          label: 'Day end until 12:00 AM',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/50'
        };
      default:
        return {
          bannerColor: 'bg-zinc-400/80',
          borderColor: 'border-l-zinc-300',
          textColor: 'text-zinc-655',
          label: 'Away',
          badgeBg: 'bg-zinc-50 text-zinc-600 border-zinc-200/40'
        };
    }
  };

  // Grid Action Definition
  const ACTIONS = [
    { id: 'at-mail', icon: AtSign, label: 'Send @-Mail', color: 'text-sky-600 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700' },
    { id: 'call', icon: Phone, label: 'Voice Call', color: 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700' },
    { id: 'sms', icon: Smartphone, label: 'SMS Dispatcher', color: 'text-purple-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700' },
    { id: 'chat', icon: MessageSquare, label: 'Instant Chat', color: 'text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700' },
    { id: 'print-info', icon: Printer, label: 'Print Person Information', color: 'text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300' },
    
    // SECOND ROW ACTIONS (Indices 5-9 in grid-cols-5)
    { id: 'print-badge', icon: ShieldCheck, label: 'Print Badge Layout', color: 'text-sky-600 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700' },
    { id: 'email', icon: Mail, label: 'Send Email', color: 'text-blue-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700' },
    { id: 'assignbadge', icon: User, label: 'Assign Name Badge Structure', color: 'text-teal-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700' },
    { id: 'assignphone', icon: Smartphone, label: 'Assign Mobile Phone Terminal', color: 'text-cyan-600 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700' },
    { id: 'assignlocker', icon: Key, label: 'Assign Safe / Locker Compartment', color: 'text-amber-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700' },
    
    { id: 'hotel', icon: Hotel, label: 'Hotel Booking Quota request', color: 'text-rose-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700', highlight: true },
    { id: 'criteria', icon: Sliders, label: 'Set / Show Criteria evaluation', color: 'text-orange-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700' },
    { id: 'calendar', icon: Calendar, label: 'Open Personal Calendar Agenda', color: 'text-violet-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700' },
    { id: 'order', icon: ShoppingCart, label: 'View Order Cart', color: 'text-fuchsia-600 hover:bg-fuchsia-50 hover:border-fuchsia-200 hover:text-fuchsia-700' },
    { id: 'invoices', icon: Receipt, label: 'View Invoices ledger', color: 'text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700' },
    { id: 'transfer', icon: RefreshCw, label: 'Transfer Personnel to Different Event', color: 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700' },
    { id: 'qrcode', icon: QrCode, label: 'Show Security QR Code', color: 'text-zinc-800 hover:bg-zinc-100' },
  ];

  // Disabled actions for visual completeness of screenshot parity
  const DISABLED_ACTIONS = [
    { id: 'sec-lock', icon: Lock, label: 'Corporate Security Lock (Feature Disabled)', color: 'text-zinc-300 cursor-not-allowed opacity-40 bg-zinc-50' },
    { id: 'access-hist', icon: History, label: 'Hardware Terminal Access Logs (Feature Disabled)', color: 'text-zinc-300 cursor-not-allowed opacity-40 bg-zinc-50' }
  ];

  return (
    <div className={`space-y-6 ${!isPremium ? 'border-4 border-[#858585] p-3 bg-white' : ''}`} id="employee-manager-workspace">
      
      {/* TOP COUNT & DYNAMIC REPORT ACTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-200/80" id="employee-report-status">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h1 className={`${isPremium ? 'text-2xl font-black text-zinc-900 tracking-tight' : 'text-lg font-bold text-black'}`}>
            Employees
          </h1>
        </div>

        <div className="flex items-center gap-3.5 relative">
          <span className={`${isPremium ? 'flex items-center h-10 text-[11px] text-[#F35D00] font-mono bg-[#FFE7D6]/60 px-3.5 rounded-lg font-black border border-[#F35D00]/15 uppercase tracking-wider' : 'text-xs border border-black px-2 py-1 font-bold bg-[#E5E5E5]'}`}>
            {filteredEmployees.length} record(s) found
          </span>

          <div className="relative">
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className={`${isPremium ? 'flex items-center gap-1.5 px-3.5 h-10 rounded-lg border border-zinc-200 bg-white hover:border-[#F35D00] hover:text-[#F35D00] text-zinc-705 text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-3xs' : 'bg-white border border-black text-black text-xs font-bold px-2 py-1 flex items-center gap-1'}`}
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Download Reports</span>
              <span className="text-[9px] ml-0.5 opacity-60">▼</span>
            </button>
            {showDownloadDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDownloadDropdown(false)} />
                <div className={`absolute right-0 mt-2 w-52 z-40 ${isPremium ? 'bg-white border border-zinc-200 rounded-lg shadow-lg py-1 overflow-hidden font-sans' : 'bg-white border-2 border-black p-1'}`}>
                  {['Excel Spreadsheet (.xlsx)', 'PDF Personnel Report', 'CSV Data Feed', 'XML Schema Grid'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => {
                        onShowToast(`Downloading compilation report format: ${fmt}`);
                        setShowDownloadDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors block ${isPremium ? 'hover:bg-[#FFE7D6] text-zinc-700 hover:text-[#F35D00] font-bold' : 'text-black hover:bg-gray-200 font-bold'}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CORE GRID LAYOUT & BULK BAR WRAPPER */}
      <div className="flex flex-col lg:flex-row items-start gap-5 relative">
        
        {/* MAIN EMPLOYEES GRID */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full" id="employees-grid-workspace">
          {filteredEmployees.length === 0 ? (
            <div className={`col-span-full py-16 text-center ${isPremium ? 'bg-white border border-zinc-200 rounded-3xl' : 'bg-white border border-black'}`}>
              <AlertTriangle className="w-12 h-12 text-[#F35D00] mx-auto mb-3" />
              <p className={`text-sm font-semibold ${isPremium ? 'text-zinc-500' : 'text-black'}`}>No events personnel matched your query.</p>
              <p className="text-xs text-zinc-405 mt-1">Try relaxing filters or changing the Name search query in the sidebar.</p>
            </div>
          ) :            filteredEmployees.map(emp => {
               const status = getStatusInfo(emp.presence, emp.presenceText);
               const isSelected = selectedIds.includes(emp.id);

               return (
                 <div
                   key={emp.id}
                   className={`relative flex flex-col justify-between transition-all ${
                     isPremium 
                        ? `bg-white border-2 ${isSelected ? 'border-[#F35D00] ring-2 ring-[#F35D00]/10 shadow-md' : 'border-[#E5E7EB] shadow-sm'} rounded-2xl` 
                        : `bg-[#E5E5E5] border-2 border-[#E5E7EB] ${isSelected ? 'shadow-lg bg-orange-100' : ''}`
                   }`}
                   id={`employee-card-${emp.id}`}
                 >
                   
                   {/* Top Header Card Section: White Background, Profile Avatar, Name, Company, Badge */}
                   <div className={`flex items-stretch bg-white border-b border-[#E5E7EB] border-l-4 ${status.borderColor} rounded-t-[14px]`}>
                     {/* Thinner Left Edge Status Indicator */}
                     
                     
                     <div className="flex-1 flex items-center justify-between p-4 bg-white gap-3 min-w-0">
                       <div className="flex items-center gap-3 min-w-0">
                         {/* Avatar picture or fallback initials with accent color bg */}
                         {emp.avatarUrl ? (
                           <div onClick={() => onSelectEmployee?.(emp.id)} className="relative w-11 h-11 rounded-full border border-zinc-150 overflow-hidden shrink-0 shadow-3xs cursor-pointer hover:border-[#F35D00]">
                             <img
                               src={emp.avatarUrl}
                               alt={emp.name}
                               referrerPolicy="no-referrer"
                               className="w-full h-full object-cover"
                             />
                           </div>
                         ) : (
                           <div onClick={() => onSelectEmployee?.(emp.id)} className="w-11 h-11 rounded-full bg-[#FFE7D6] text-[#F35D00] border border-[#F35D00]/15 font-black flex items-center justify-center text-xs shrink-0 shadow-3xs cursor-pointer hover:border-[#F35D00]">
                             {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                           </div>
                         )}

                         <div className="min-w-0">
                           <div className="flex items-center gap-1">
                             {emp.title && <span className="text-zinc-400 font-bold text-xs">{emp.title}</span>}
                             <h3 className="font-extrabold text-zinc-900 text-[13px] leading-tight truncate font-sans hover:text-[#F35D00] cursor-pointer" title={emp.name} onClick={() => onSelectEmployee?.(emp.id)}>
                               {emp.name}
                             </h3>
                           </div>
                           <p className="text-[11px] font-semibold text-zinc-400 tracking-tight mt-0.5 truncate">
                             <span>{emp.companyName}</span>
                           </p>
                         </div>
                       </div>

                       <div className="shrink-0 flex items-center">
                         <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase font-mono tracking-wider ${status.badgeBg}`}>
                           {status.label}
                         </span>
                       </div>
                     </div>
                   </div>

                   {/* Card Action Body */}
                   <div className="p-4 flex-1 flex flex-col justify-end">
                     <div>
                       <div className="grid grid-cols-5 gap-1.5" id={`actions-grid-employee-${emp.id}`}>
                         {ACTIONS.map(act => {
                           const IconComponent = act.icon;
                           const isSpecialHighlight = act.highlight && emp.hasHotelRequest;

                           return (
                             <button
                               key={act.id}
                               type="button"
                               onClick={() => triggerSingleAction(emp.name, act.label)}
                               className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer relative group/btn h-9 ${
                                 isPremium
                                   ? isSpecialHighlight 
                                     ? 'bg-[#FFE7D6] text-[#F35D00] border-[#F35D00]/50 shadow-3xs'
                                     : 'bg-zinc-50 text-zinc-600 border-zinc-200/80 hover:border-[#F35D00] hover:text-[#F35D00] hover:scale-105'
                                   : 'bg-white text-black border border-black p-1 block'
                               }`}
                               title={act.label}
                             >
                               <IconComponent className="w-4.5 h-4.5 shrink-0" />
                               
                               {/* Modern interactive Hover Tooltip */}
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/btn:block z-50 pointer-events-none min-w-[120px]">
                                 <div className="bg-[#2F3747] text-white text-[9.5px] font-extrabold py-1 px-2 rounded-md shadow-lg text-center leading-tight whitespace-normal relative font-sans">
                                   {act.label}
                                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2F3747]" />
                                 </div>
                               </div>

                               {/* Small alert ring for hotel booking request if active */}
                               {isSpecialHighlight && (
                                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 border border-white rounded-full animate-ping" />
                               )}
                             </button>
                           );
                         })}

                         {/* Parity completeness: Disabled buttons with padlock overlay */}
                         {DISABLED_ACTIONS.map(act => {
                           const IconComponent = act.icon;
                           return (
                             <div
                               key={act.id}
                               className={`p-2 rounded-lg border flex items-center justify-center relative group/btn h-9 ${
                                 isPremium ? act.color + ' border-zinc-150' : 'bg-gray-300 text-gray-500 border border-gray-400 p-1 cursor-not-allowed'
                               }`}
                               title={act.label}
                             >
                               <IconComponent className="w-4.5 h-4.5 shrink-0" />
                               
                               {/* Lock indicator */}
                               <span className="absolute -bottom-0.5 -right-0.5 bg-zinc-400 text-white rounded-full p-0.5 text-[7px]" title="Feature Locked">
                                 <Lock className="w-1.5 h-1.5" />
                               </span>

                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/btn:block z-50 pointer-events-none min-w-[140px]">
                                 <div className="bg-zinc-900 text-zinc-350 text-[9.5px] font-medium py-1 px-2 rounded-md shadow-lg text-center leading-tight whitespace-normal relative font-sans border border-zinc-700">
                                   {act.label}
                                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-3 border-transparent border-t-zinc-900" />
                                 </div>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   </div>

                 </div>
               );
             })
            }
         </div>

          {/* Vertical Toggle Handle on the Absolute Right Side when collapsed */}
          {!isBulkActionMenuOpen && (
            <button
              type="button"
              onClick={() => setIsBulkActionMenuOpen(true)}
              className={`absolute -right-3 top-36 z-40 flex flex-col items-center gap-2.5 py-6 px-1.5 shadow-md cursor-pointer group active:scale-95 transition-all ${
                isPremium 
                  ? 'bg-[#F35D00] text-white rounded-l-xl border-y border-l border-[#B24400] hover:bg-[#B24400]' 
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
              title="Expand bulk actions"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-white animate-pulse" />
              <span 
                style={{ writingMode: 'vertical-lr' }} 
                className="text-[9px] font-black uppercase tracking-widest rotate-180 leading-none select-none"
              >
                Bulk Action
              </span>
            </button>
          )}

          {/* BULK ACTION BAR (Right hand vertical panel reflecting exact event manager style) */}
          {isBulkActionMenuOpen && (
            <div 
              className={`shrink-0 w-full lg:w-[260px] flex flex-col ${
                isPremium 
                  ? 'bg-white border border-[#E5E7EB] rounded-2xl shadow-sm text-zinc-800 shrink-0 overflow-hidden animate-fade-in' 
                  : 'bg-white border border-gray-400 rounded-none flex flex-col overflow-hidden shadow-none'
              }`}
              id="sidebar-bulkaction-panel"
            >
              {/* Header click collapses it */}
              <div 
                onClick={() => setIsBulkActionMenuOpen(false)}
                className={`${
                  isPremium 
                    ? 'bg-white border-b border-[#E5E7EB] px-5 py-4 hover:bg-zinc-50/50' 
                    : 'bg-[#E5E5E5] px-4 py-2 border-b border-gray-400 hover:bg-gray-100'
                } flex items-center justify-between cursor-pointer select-none group/hdr transition-colors`}
              >
                <div className="flex items-center gap-2.5">
                  <h2 className={`${
                    isPremium 
                      ? 'text-xs font-bold text-[#1F2937] uppercase tracking-wide font-sans group-hover/hdr:text-[#F35D00]' 
                      : 'text-xs font-bold text-black'
                  } transition-colors`}>
                    Bulk Action
                  </h2>
                  {selectedIds.length > 0 && (
                    <span className="text-[10px] text-zinc-500 font-extrabold">
                      ({selectedIds.length} Checked)
                    </span>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBulkActionMenuOpen(false);
                  }}
                  className={`${isPremium ? 'p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-[#F35D00] cursor-pointer' : 'border border-gray-500 bg-white font-bold p-1 text-black font-mono cursor-pointer'}`}
                  title="Collapse bulk actions"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className={`${isPremium ? 'p-4 flex flex-col' : 'p-4 flex flex-col'}`}>
                {selectedIds.length > 0 && (
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-100/80">
                    <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider">Active select</span>
                    <button
                      onClick={() => {
                        setSelectedIds([]);
                        onShowToast("Cleared bulk selection.");
                      }}
                      className="text-[9.5px] text-[#F35D00] hover:text-[#D55200] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-1.5 w-full bg-white" id="bulk-action-items-container">
                  {[
                    { id: 'b-email', icon: Mail, label: 'Bulk Email', tooltip: 'Dispatch emails in bulk' },
                    { id: 'b-sms', icon: Smartphone, label: 'Bulk SMS', tooltip: 'Launch bulk SMS' },
                    { id: 'b-badge', icon: ShieldCheck, label: 'Bulk Badge', tooltip: 'Compile badge prints' },
                    { id: 'b-info', icon: Printer, label: 'Bulk Print', tooltip: 'Print personal summaries' },
                    { id: 'b-key', icon: Key, label: 'Bulk Keys', tooltip: 'Locker assignments' },
                    { id: 'b-hotel', icon: Hotel, label: 'Bulk Hotel', tooltip: 'Reserve hotel quarters' },
                    { id: 'b-crit', icon: Sliders, label: 'Bulk Criteria', tooltip: 'Update status criteria' },
                    { id: 'b-refresh', icon: RefreshCw, label: 'Bulk Shift', tooltip: 'Transfer event personnel' },
                    { id: 'b-qr', icon: QrCode, label: 'Bulk QR', tooltip: 'Generate QR codes' },
                  ].map(item => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => executeBulkAction(item.label)}
                        className={`w-full flex items-center justify-between p-2.5 text-[11px] text-left cursor-pointer transition-all select-none rounded-lg border font-semibold duration-150 group/item ${
                          isPremium
                            ? 'bg-white text-zinc-700 border-[#E5E7EB] hover:bg-[#FFE7D6]/20 hover:text-[#F35D00] hover:border-[#F35D00]'
                            : 'bg-white text-black border-gray-400 hover:bg-gray-100'
                        }`}
                        title={`${item.label} - ${item.tooltip}`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <IconComponent className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                            isPremium ? 'text-zinc-400 group-hover/item:text-[#F35D00]' : 'text-black'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform transition-colors duration-150 ${
                          isPremium 
                            ? 'text-zinc-400 group-hover/item:translate-x-0.5 group-hover/item:text-[#F35D00]' 
                            : 'text-black'
                        }`} />
                      </button>
                    );
                  })}
                </div>

                {/* Reset Selection Button Helper bottom anchor */}
                {selectedIds.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedIds([]);
                      onShowToast("Cleared bulk selection.");
                    }}
                    className="mt-4 w-full bg-[#FFE7D6]/80 hover:bg-[#FFE7D6] border border-[#F35D00]/10 text-[#F35D00] font-black text-[9.5px]/tight py-2.5 rounded-xl block uppercase tracking-wider font-mono transition-all cursor-pointer shadow-3xs text-center"
                  >
                    Reset Selection
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      {/* CREATE EMPLOYEE MODAL DIALOG (Swiss High Design Precision) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-250 rounded-3xl p-6 shadow-2xl max-w-md w-full font-sans space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-5 bg-[#F35D00] rounded-xs" />
                <h3 className="text-lg font-black text-zinc-900 tracking-tight">Create Event Employee</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 text-sm font-bold bg-transparent border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs font-semibold text-zinc-700">
              
              <div className="space-y-1">
                <label className="block text-zinc-500 uppercase tracking-wide">Employee Full Name *</label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="e.g. Sadhana Penta"
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#F35D00] rounded-lg px-3.5 h-10 focus:outline-none focus:ring-1 focus:ring-[#F35D00]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-500 uppercase tracking-wide">Enterprise Email address</label>
                <input
                  type="email"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  placeholder="e.g. sadhana.penta@xfair.de"
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#F35D00] rounded-lg px-3.5 h-10 focus:outline-none focus:ring-1 focus:ring-[#F35D00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-zinc-500 uppercase tracking-wide">Company Anchor</label>
                  <select
                    value={newEmpCompany}
                    onChange={(e) => setNewEmpCompany(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 h-10 focus:outline-none cursor-pointer"
                  >
                    <option value="XFAIR GmbH">XFAIR GmbH</option>
                    <option value="FC Bayern GmbH">FC Bayern GmbH</option>
                    <option value="Hankaass Test GmbH">Hankaass Test GmbH</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-500 uppercase tracking-wide">Domain Role</label>
                  <select
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 h-10 focus:outline-none cursor-pointer"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Visitor">Visitor</option>
                    <option value="Exhibitor">Exhibitor</option>
                    <option value="Guest">Guest</option>
                    <option value="Survey">Survey</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-500 uppercase tracking-wide">Presence Entry Status</label>
                <select
                  value={newEmpPresence}
                  onChange={(e) => setNewEmpPresence(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 h-10 focus:outline-none cursor-pointer"
                >
                  <option value="present">🟢 Present (On-site)</option>
                  <option value="meeting">🟡 Away (In Meeting)</option>
                  <option value="not-present">⚪ Offline (Not present)</option>
                </select>
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-zinc-150">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-zinc-250 text-zinc-600 rounded-lg font-bold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F35D00] text-white rounded-lg font-extrabold hover:bg-[#D55200] cursor-pointer shadow-3xs"
                >
                  Save Entry Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
