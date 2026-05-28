/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { EventItem, ThemeSettings } from '../types';
import { Save, Trash2, Calendar, MapPin, Globe, Clock, DollarSign, Plus, Minus, ArrowRight, Image as ImageIcon, FolderOpen, Upload, HelpCircle, FileText, ChevronDown, Sparkles, ChevronRight, ChevronLeft, ChevronUp, Paperclip, Lock, Mail, Sliders, Database } from 'lucide-react';

interface EventManagerProps {
  event: EventItem;
  theme: ThemeSettings;
  onUpdateEvent: (updated: EventItem) => void;
  onShowToast: (message: string) => void;
  onNavigateToRegistration: () => void;
  viewOption: 'option-1' | 'option-2';
  setViewOption: (view: 'option-1' | 'option-2') => void;
}

interface ConfigGroup {
  heading: string;
  items: string[];
}

const CONFIG_GROUPS: ConfigGroup[] = [
  {
    heading: 'Core event setup',
    items: ['Client manager', 'Event module manager', 'Event fields manager']
  },
  {
    heading: 'Criteria & registration data',
    items: ['Event criteria manager', 'Criteria group manager']
  },
  {
    heading: 'Access & permissions',
    items: ['Event permissions', 'Access control manager']
  },
  {
    heading: 'Communication',
    items: ['Email addresses manager', 'Email templates']
  },
  {
    heading: 'Reporting & content',
    items: ['Visitor report templates', 'Dynamic page content manager']
  },
  {
    heading: 'Billing & finance',
    items: ['Event taxes', 'Event invoices manager', 'Event wallet']
  },
  {
    heading: 'Devices & physical assets',
    items: ['Mobile phones', 'Locker keys']
  },
  {
    heading: 'Integration & external APIs',
    items: ['Event API manager']
  }
];

const getHeaderIcon = (heading: string) => {
  switch (heading) {
    case 'Core event setup':
      return FolderOpen;
    case 'Criteria & registration data':
      return Sliders;
    case 'Access & permissions':
      return Lock;
    case 'Communication':
      return Mail;
    case 'Reporting & content':
      return FileText;
    case 'Billing & finance':
      return DollarSign;
    case 'Devices & physical assets':
      return Clock;
    case 'Integration & external APIs':
      return Globe;
    default:
      return FolderOpen;
  }
};

// Custom Dropdown select that replaces all standard <select> elements on this screen
interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[] | string[];
  isPremium?: boolean;
  variant?: 'box' | 'line' | 'header' | 'small';
}

function CustomSelect({ value, onChange, options, isPremium = true, variant = 'box' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectOptions = Array.isArray(options)
    ? options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt))
    : [];

  const selectedOpt = selectOptions.find((o) => o.value === value) || selectOptions[0] || { value: '', label: '' };

  let triggerClass = '';
  if (variant === 'header') {
    triggerClass = isPremium
      ? 'w-full bg-zinc-50 hover:bg-zinc-105 border border-zinc-200 hover:border-[#F35D00]/60 text-zinc-800 font-bold py-2 px-3.5 rounded-lg text-xs cursor-pointer focus:outline-none transition-all flex items-center justify-between select-none min-h-[38px] shadow-3xs'
      : 'w-full bg-white border border-gray-400 text-black text-xs px-3 py-2 cursor-pointer font-bold flex items-center justify-between select-none';
  } else if (variant === 'box') {
    triggerClass = isPremium
      ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none hover:border-[#F35D00]/40 flex items-center justify-between font-semibold cursor-pointer select-none transition-all shadow-3xs'
      : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black cursor-pointer font-bold flex items-center justify-between select-none';
  } else if (variant === 'line') {
    triggerClass = isPremium
      ? 'w-full bg-transparent border-b border-zinc-200/60 text-zinc-805 px-1 pb-1.5 text-[13px] font-bold focus:outline-none hover:border-zinc-350 transition-all flex items-center justify-between cursor-pointer select-none'
      : 'w-full bg-transparent border-b-2 border-black p-1 pb-1 text-xs text-black cursor-pointer font-bold flex items-center justify-between select-none';
  } else if (variant === 'small') {
    triggerClass = isPremium
      ? 'bg-zinc-50/50 hover:bg-zinc-100/60 border border-[#E5E7EB] rounded-lg px-4 py-1 text-xs text-zinc-850 focus:outline-none font-bold cursor-pointer min-w-[124px] h-[34px] flex items-center justify-between select-none transition-all h-9 shadow-3xs'
      : 'bg-white border border-gray-400 px-3 py-1 text-xs text-black cursor-pointer font-bold flex items-center justify-between select-none min-w-[124px] h-9';
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClass}
      >
        <span className="truncate pr-1">{selectedOpt.label}</span>
        <ChevronDown 
          className="w-4 h-4 shrink-0 transition-transform duration-150" 
          style={{ color: '#2F3747', transform: isOpen ? 'rotate(180deg)' : 'none' }} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-zinc-200 rounded-lg shadow-lg py-1 animate-fade-in custom-scrollbar">
          {selectOptions.map((opt) => {
            const isSel = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors duration-100 font-semibold truncate ${
                  isSel
                    ? 'bg-[#FFE7D6] text-[#F35D00] font-extrabold'
                    : 'text-zinc-700 hover:bg-[#FFE7D6] hover:text-[#F35D00]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EventManager({ 
  event, 
  theme, 
  onUpdateEvent, 
  onShowToast, 
  onNavigateToRegistration,
  viewOption,
  setViewOption
}: EventManagerProps) {
  const isPremium = theme.mode === 'premium';

  // State managers corresponding to the lower registrations cards / actions
  const [registrations, setRegistrations] = useState<string[]>([
    'Add New Employee (Appointment)',
    'Add New Visitor (Appointment)',
    'New Registration',
    'Survey 2028'
  ]);
  const [selectedRegIdx, setSelectedRegIdx] = useState<number | null>(null);
  const [createRegType, setCreateRegType] = useState<'New' | 'Template'>('New');
  const [createRegRole, setCreateRegRole] = useState<string>('Employee');
  const [eventSetupType, setEventSetupType] = useState<'New' | 'Template'>('New');
  const [configMenuExpanded, setConfigMenuExpanded] = useState<boolean>(true);
  const [selectedConfigAction, setSelectedConfigAction] = useState<string>('Client manager');
  const [opt2Sections, setOpt2Sections] = useState<Record<string, boolean>>({
    setupOption: true, // first stays open by default
    primaryIdentity: false,
    scheduleSteppers: false,
    assetsEmailing: false,
    availableRegistrations: false,
  });

  const handleFieldChange = (field: keyof EventItem, value: any) => {
    onUpdateEvent({ ...event, [field]: value });
  };

  const handleStepper = (field: 'attendanceDaysBefore' | 'attendanceDaysAfter' | 'hotelDaysBefore' | 'hotelDaysAfter', amount: number) => {
    const current = event[field];
    const nextVal = Math.max(0, current + amount);
    handleFieldChange(field, nextVal);
  };

  const handleSave = () => {
    onShowToast(`Event "${event.name}" saved successfully.`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete Event "${event.name}"?`)) {
      onShowToast(`Event "${event.name}" deleted successfully (mock action).`);
    }
  };

  const handleInsertRegistration = () => {
    let nameText = '';
    if (createRegType === 'New') {
      nameText = `New ${createRegRole}`;
    } else {
      nameText = `${createRegRole} Registration 2028`;
    }
    
    // Add item
    setRegistrations([...registrations, nameText]);
    onShowToast(`Successfully inserted registration format: "${nameText}"`);
  };

  const handleDeleteRegistration = (idx: number) => {
    const text = registrations[idx];
    setRegistrations(registrations.filter((_, i) => i !== idx));
    if (selectedRegIdx === idx) {
      setSelectedRegIdx(null);
    } else if (selectedRegIdx !== null && selectedRegIdx > idx) {
      setSelectedRegIdx(selectedRegIdx - 1);
    }
    onShowToast(`Removed registration: "${text}"`);
  };

  return (
    <div className={`w-full flex flex-col ${isPremium ? 'space-y-4' : 'space-y-3'}`} id="event-manager-root">
      
      {true ? (
        /* ==========================================================
           OPTION 1: TRADITIONAL DATASET GRID SYSTEM (Default)
           ========================================================== */
        <div className="flex flex-col space-y-6 relative" id="event-layout-option-1-root">

          {/* Page-level Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className={`${isPremium ? 'text-2xl font-black text-zinc-900 tracking-tight' : 'text-lg font-bold text-black'}`}>
                Create event
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className={`${
                  isPremium
                    ? 'flex items-center gap-2 bg-white border border-red-200 hover:border-red-350 hover:bg-red-50/50 text-red-600 px-5 py-2.5 rounded-lg text-sm font-bold shadow-2xs active:scale-[0.98] transition-all cursor-pointer'
                    : 'flex items-center gap-1.5 bg-[#E1E1E1] border border-gray-500 text-black px-4 py-2 text-sm font-bold cursor-pointer md:py-2.5'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={`${
                  isPremium
                    ? 'flex items-center gap-2 bg-[#F35D00] hover:bg-[#D55200] active:scale-[0.98] text-white px-6 py-2.5 rounded-lg text-sm font-extrabold shadow-md transition-all cursor-pointer'
                    : 'flex items-center gap-1.5 bg-[#18181B] border border-black text-white px-4 py-2 text-sm font-bold cursor-pointer hover:bg-black md:py-2.5'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Vertical Toggle Handle on the Absolute Right Side when collapsed */}
          {!configMenuExpanded && (
            <button
              type="button"
              onClick={() => setConfigMenuExpanded(true)}
              className={`absolute -right-3 top-36 z-40 flex flex-col items-center gap-2.5 py-6 px-1.5 shadow-md cursor-pointer group active:scale-95 transition-all ${
                isPremium 
                  ? 'bg-[#F35D00] text-white rounded-l-xl border-y border-l border-[#B24400] hover:bg-[#B24400]' 
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
              title="Expand configuration menu"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-white animate-pulse" />
              <span 
                style={{ writingMode: 'vertical-lr' }} 
                className="text-[9px] font-black uppercase tracking-widest rotate-180 leading-none select-none"
              >
                Event configuration
              </span>
            </button>
          )}
          
          {/* Grid splitting Form and Event Configuration into columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Main Form Container - Left Column */}
            <div className={`${configMenuExpanded ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col space-y-6 transition-all duration-300`}>
              
              {/* Standalone Event Setup Option Card (Separated from Fields Section) */}
              <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4' : 'bg-[#E5E5E5] border border-gray-400 p-4'}`} id="event-setup-insert-control">
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#F35D00] rounded-full inline-block" />
                    <span className={`${isPremium ? 'text-xs font-black text-zinc-800 uppercase tracking-wider font-mono' : 'text-xs font-bold text-black uppercase'}`}>
                      Setup Option
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <input
                        type="radio"
                        name="event-setup-radio"
                        value="New"
                        checked={eventSetupType === 'New'}
                        onChange={() => setEventSetupType('New')}
                        className={`${isPremium ? 'w-4 h-4 text-[#F35D00] focus:ring-[#F35D00]/41 border-zinc-300 accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none cursor-pointer'}`}
                      />
                      <span className={`${isPremium ? 'text-xs font-bold text-zinc-700 group-hover:text-[#F35D00] transition-colors' : 'text-xs text-black font-bold'}`}>New event</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <input
                        type="radio"
                        name="event-setup-radio"
                        value="Template"
                        checked={eventSetupType === 'Template'}
                        onChange={() => setEventSetupType('Template')}
                        className={`${isPremium ? 'w-4 h-4 text-[#F35D00] focus:ring-[#F35D00]/41 border-zinc-300 accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none cursor-pointer'}`}
                      />
                      <span className={`${isPremium ? 'text-xs font-bold text-zinc-700 group-hover:text-[#F35D00] transition-colors' : 'text-xs text-black font-bold'}`}>Use template</span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onShowToast(`Successfully inserted configuration as: ${eventSetupType}`)}
                  className={`${isPremium ? 'flex items-center gap-1.5 px-4.5 py-2.5 border-2 border-[#F35D00] bg-white text-[#F35D00] hover:bg-[#F35D00]/5 hover:border-[#D55200] active:scale-[0.98] text-xs font-extrabold rounded-lg transition-all cursor-pointer shadow-3xs' : 'bg-white border border-gray-500 font-bold px-3 py-1.5 text-xs text-black hover:bg-gray-100 cursor-pointer'}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert</span>
                </button>
              </div>

              {/* Main Fields Form Section Cover Card */}
              <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden p-6' : 'bg-[#F2F2F2] border border-gray-400 p-4'}`}>
              
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">

                {/* Event ID */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  ID
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={event.id}
                    readOnly
                    className={`${isPremium ? 'w-full bg-zinc-50 border border-[#E5E7EB] text-zinc-400 rounded-lg px-4 h-11 text-xs font-semibold cursor-not-allowed select-none' : 'w-full bg-zinc-100 border border-gray-400 h-11 px-3 text-xs text-gray-500 cursor-not-allowed'}`}
                  />
                </div>

                {/* Event Name */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  Event name <span className="text-red-500 ml-1">*</span>
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={event.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                    placeholder="e.g. Autumn Fair 2026"
                  />
                </div>

                {/* Address */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  Address
                </div>
                <div className="md:col-span-8">
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={event.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      className={`${isPremium ? 'flex-1 bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'flex-1 bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                      placeholder="Location details"
                    />
                    <button
                      type="button"
                      onClick={() => onShowToast('Edit address dialogue (mock action)')}
                      className={`${isPremium ? 'border border-[#E5E7EB] hover:border-[#F35D00] hover:bg-zinc-50/50 text-[#1F2937] hover:text-[#F35D00] px-4 h-11 rounded-lg text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 shadow-3xs shrink-0' : 'bg-[#E1E1E1] border border-gray-500 text-black px-3 h-11 text-xs font-bold shrink-0'}`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Dates (Double Columns) */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} self-start pt-2`}>
                  Dates
                </div>
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 tracking-wider">Event start date *</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={event.startDate}
                        onChange={(e) => handleFieldChange('startDate', e.target.value)}
                        className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 tracking-wider">Event end date *</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={event.endDate}
                        onChange={(e) => handleFieldChange('endDate', e.target.value)}
                        className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Warning Note */}
                <div className="md:col-span-4 text-xs"></div>
                <div className="md:col-span-8">
                  <div className={`${isPremium ? 'bg-amber-50/50 border border-amber-100/85 text-[11px] text-amber-800 p-3.5 rounded-xl flex items-start gap-2.5 leading-relaxed' : 'text-xs text-zinc-640 bg-white border border-gray-400 p-2'}`}>
                    <span className="text-base select-none mt-0.5">⚠️</span>
                    <span>
                      <strong>NOTE:</strong> Changes to event days, days before / after event and hotel days before / after event can affect the attendance days and hotel request dates of registrations that are already configured. If the old attendance day is beyond the possible new timeframe, it will be replaced with the new earliest possible attendance day. All affected registrations will be changed automatically.
                    </span>
                  </div>
                </div>

                {/* Modernized Numeric Spinner Boxes */}
                <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6 py-3 border-t border-b border-zinc-100 my-2">
                  
                  {/* Stepper 1: Attendance days before */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                    Attendance days before event
                  </div>
                  <div className="md:col-span-8">
                    <div className="relative flex items-center max-w-[130px]">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={event.attendanceDaysBefore}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleFieldChange('attendanceDaysBefore', isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg pl-4 pr-10 h-11 text-xs text-zinc-800 font-semibold focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                      />
                      {isPremium && (
                        <div className="absolute right-1.5 top-1.5 bottom-1.5 flex flex-col justify-between py-0.5 pr-0.5">
                          <button
                            type="button"
                            onClick={() => handleStepper('attendanceDaysBefore', 1)}
                            className="px-1.5 py-0.5 bg-zinc-50 hover:bg-zinc-100 border border-[#E5E7EB] rounded-[3px] text-[7px] text-zinc-500 hover:text-[#F35D00] transition-colors leading-none"
                            title="Increment"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStepper('attendanceDaysBefore', -1)}
                            className="px-1.5 py-0.5 bg-zinc-50 hover:bg-zinc-100 border border-[#E5E7EB] rounded-[3px] text-[7px] text-zinc-500 hover:text-[#F35D00] transition-colors leading-none"
                            title="Decrement"
                          >
                            ▼
                          </button>
                        </div>
                      )}
                      <span className="absolute -right-16 text-[10px] text-zinc-400 font-mono font-medium">days</span>
                    </div>
                  </div>

                  {/* Stepper 2: Attendance days after */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                    Attendance days after event
                  </div>
                  <div className="md:col-span-8">
                    <div className="relative flex items-center max-w-[130px]">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={event.attendanceDaysAfter}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleFieldChange('attendanceDaysAfter', isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg pl-4 pr-10 h-11 text-xs text-zinc-800 font-semibold focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                      />
                      {isPremium && (
                        <div className="absolute right-1.5 top-1.5 bottom-1.5 flex flex-col justify-between py-0.5 pr-0.5">
                          <button
                            type="button"
                            onClick={() => handleStepper('attendanceDaysAfter', 1)}
                            className="px-1.5 py-0.5 bg-zinc-50 hover:bg-zinc-100 border border-[#E5E7EB] rounded-[3px] text-[7px] text-zinc-500 hover:text-[#F35D00] transition-colors leading-none"
                            title="Increment"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStepper('attendanceDaysAfter', -1)}
                            className="px-1.5 py-0.5 bg-zinc-50 hover:bg-zinc-100 border border-[#E5E7EB] rounded-[3px] text-[7px] text-zinc-500 hover:text-[#F35D00] transition-colors leading-none"
                            title="Decrement"
                          >
                            ▼
                          </button>
                        </div>
                      )}
                      <span className="absolute -right-16 text-[10px] text-zinc-400 font-mono font-medium">days</span>
                    </div>
                  </div>

                  {/* Stepper 3: Hotel days before */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                    Hotel days before event
                  </div>
                  <div className="md:col-span-8">
                    <div className="relative flex items-center max-w-[130px]">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={event.hotelDaysBefore}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleFieldChange('hotelDaysBefore', isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg pl-4 pr-10 h-11 text-xs text-zinc-800 font-semibold focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                      />
                      {isPremium && (
                        <div className="absolute right-1.5 top-1.5 bottom-1.5 flex flex-col justify-between py-0.5 pr-0.5">
                          <button
                            type="button"
                            onClick={() => handleStepper('hotelDaysBefore', 1)}
                            className="px-1.5 py-0.5 bg-zinc-50 hover:bg-zinc-100 border border-[#E5E7EB] rounded-[3px] text-[7px] text-zinc-500 hover:text-[#F35D00] transition-colors leading-none"
                            title="Increment"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStepper('hotelDaysBefore', -1)}
                            className="px-1.5 py-0.5 bg-zinc-50 hover:bg-zinc-100 border border-[#E5E7EB] rounded-[3px] text-[7px] text-zinc-500 hover:text-[#F35D00] transition-colors leading-none"
                            title="Decrement"
                          >
                            ▼
                          </button>
                        </div>
                      )}
                      <span className="absolute -right-16 text-[10px] text-zinc-400 font-mono font-medium">days</span>
                    </div>
                  </div>

                  {/* Stepper 4: Hotel days after */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                    Hotel days after event
                  </div>
                  <div className="md:col-span-8">
                    <div className="relative flex items-center max-w-[130px]">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={event.hotelDaysAfter}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleFieldChange('hotelDaysAfter', isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg pl-4 pr-10 h-11 text-xs text-zinc-800 font-semibold focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                      />
                      {isPremium && (
                        <div className="absolute right-1.5 top-1.5 bottom-1.5 flex flex-col justify-between py-0.5 pr-0.5">
                          <button
                            type="button"
                            onClick={() => handleStepper('hotelDaysAfter', 1)}
                            className="px-1.5 py-0.5 bg-zinc-50 hover:bg-zinc-100 border border-[#E5E7EB] rounded-[3px] text-[7px] text-zinc-500 hover:text-[#F35D00] transition-colors leading-none"
                            title="Increment"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStepper('hotelDaysAfter', -1)}
                            className="px-1.5 py-0.5 bg-zinc-50 hover:bg-zinc-100 border border-[#E5E7EB] rounded-[3px] text-[7px] text-zinc-500 hover:text-[#F35D00] transition-colors leading-none"
                            title="Decrement"
                          >
                            ▼
                          </button>
                        </div>
                      )}
                      <span className="absolute -right-16 text-[10px] text-zinc-400 font-mono font-medium">days</span>
                    </div>
                  </div>

                </div>

                {/* Timezone */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  Event time zone
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={event.timezone}
                    onChange={(val) => handleFieldChange('timezone', val)}
                    options={[
                      { value: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna', label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
                      { value: '(UTC+00:00) London, Dublin, Lisbon', label: '(UTC+00:00) London, Dublin, Lisbon' },
                      { value: '(UTC-05:00) Eastern Time (US & Canada)', label: '(UTC-05:00) Eastern Time (US & Canada)' },
                      { value: '(UTC+08:00) Singapore, Beijing, Perth', label: '(UTC+08:00) Singapore, Beijing, Perth' },
                    ]}
                    isPremium={isPremium}
                    variant="box"
                  />
                </div>

                {/* Event Type */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  Event type
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={event.eventType}
                    onChange={(val) => handleFieldChange('eventType', val)}
                    options={[
                      { value: 'Please select', label: 'Please select' },
                      { value: 'Trade Fair', label: 'Trade Fair' },
                      { value: 'Corporate Seminar', label: 'Corporate Seminar' },
                      { value: 'Exhibition', label: 'Exhibition' },
                    ]}
                    isPremium={isPremium}
                    variant="box"
                  />
                </div>

                {/* Currency */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[#6B7280] text-[11px] font-bold tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  Currency
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={event.currency}
                    onChange={(val) => handleFieldChange('currency', val)}
                    options={[
                      { value: 'Euro', label: 'Euro' },
                      { value: 'USD', label: 'USD' },
                      { value: 'GBP', label: 'GBP' },
                      { value: 'CHF', label: 'CHF' },
                    ]}
                    isPremium={isPremium}
                    variant="box"
                  />
                </div>

                {/* Website */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} self-start pt-2`}>
                  Website
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={event.website}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-805 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono font-semibold' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                    placeholder="e.g. http://www.xfair.com"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block font-medium">e.g. http://www.xfair.com</span>
                </div>

                {/* External identifier */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  External identifier
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={event.externalIdentifier}
                    onChange={(e) => handleFieldChange('externalIdentifier', e.target.value)}
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-850 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono font-semibold' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                  />
                </div>

                {/* External identifier code */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  External identifier code
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={event.externalIdentifierCode}
                    onChange={(e) => handleFieldChange('externalIdentifierCode', e.target.value)}
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-850 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono font-semibold' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                  />
                </div>

                {/* Active Switch/Checkbox */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                  Active
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    id="event-active-checkbox"
                    checked={event.isTemplate !== true} // Simple default binding mapping
                    onChange={(e) => {
                      onShowToast(e.target.checked ? 'Event marked as active' : 'Event marked as inactive');
                    }}
                    className={`${
                      isPremium
                        ? 'w-4.5 h-4.5 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00]/41 accent-[#F35D00] cursor-pointer'
                        : 'w-4 h-4 rounded-none border-gray-400 cursor-pointer'
                    }`}
                  />
                </div>

                {/* Image (XFAIR brand logo display + selector dropdown) */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} self-start pt-2`}>
                  Image
                </div>
                <div className="md:col-span-8 space-y-3">
                  {/* Selector select dropdown (FIRST) */}
                  <CustomSelect
                    value="xfair logo.png"
                    onChange={(val) => onShowToast(`Selected image resource: ${val}`)}
                    options={[
                      { value: 'xfair logo.png', label: 'xfair logo.png' },
                      { value: 'alternate_banner_2026.png', label: 'alternate_banner_2026.png' },
                      { value: 'fair_map_structure.jpg', label: 'fair_map_structure.jpg' },
                      { value: 'none', label: '-- Hide Header Image --' },
                    ]}
                    isPremium={isPremium}
                    variant="box"
                  />

                  {/* Logo representation preview (BELOW) */}
                  <div className={`${isPremium ? 'bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center gap-3 w-fit shadow-xs' : 'bg-white border-2 border-dashed border-gray-400 p-3 flex items-center gap-2 w-fit'}`} id="logo-preview-frame">
                    <div className="flex gap-1.5 items-center">
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <div className="flex gap-0.5">
                          <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                          <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs animate-pulse-soft" />
                          <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                        </div>
                        <div className="flex gap-0.5 justify-center">
                          <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                          <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                        </div>
                      </div>
                      <div className="flex flex-col select-none">
                        <span className="text-[21px] font-black leading-none tracking-tight text-zinc-900 font-sans">
                          X<span className="text-[#F35D00]">FAIR</span>
                        </span>
                        <span className="text-[7.5px] font-bold text-[#F35D00] uppercase tracking-wider leading-none mt-1 whitespace-nowrap">
                          flexibility through ability
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDF Summary mail attachment upload form mockup */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} self-start pt-2`}>
                  PDF summary mail
                </div>
                <div className="md:col-span-8" id="pdf-summary-mail-container">
                  <div 
                    onClick={() => onShowToast('Browse triggered for PDF summary mail')}
                    className={`${
                      isPremium
                        ? 'border border-dashed border-zinc-200/80 hover:border-[#F35D00] bg-zinc-50/40 hover:bg-[#FFE7D6]/10 rounded-xl p-3.5 transition-all text-center flex items-center justify-between cursor-pointer group shadow-3xs'
                        : 'border border-gray-400 hover:border-black p-3 bg-white text-center flex items-center justify-between cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Paperclip className={`w-4 h-4 shrink-0 ${isPremium ? 'text-[#F35D00]' : 'text-[#2F3747]'}`} />
                      <span className={`text-[12px] font-bold truncate ${isPremium ? 'text-zinc-700 group-hover:text-[#F35D00]' : 'text-black'}`}>
                        Click to attach PDF summary
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium shrink-0 font-mono">max. 16 MB</span>
                  </div>
                </div>

                {/* PDF Template for hotel booking */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} self-start pt-2`}>
                  PDF template for hotel booking
                </div>
                <div className="md:col-span-8" id="pdf-hotel-booking-container">
                  <div 
                    onClick={() => onShowToast('Browse triggered for PDF hotel booking template')}
                    className={`${
                      isPremium
                        ? 'border border-dashed border-zinc-200/80 hover:border-[#F35D00] bg-zinc-50/40 hover:bg-[#FFE7D6]/10 rounded-xl p-3.5 transition-all text-center flex items-center justify-between cursor-pointer group shadow-3xs'
                        : 'border border-gray-400 hover:border-black p-3 bg-white text-center flex items-center justify-between cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Paperclip className={`w-4 h-4 shrink-0 ${isPremium ? 'text-[#F35D00]' : 'text-[#2F3747]'}`} />
                      <span className={`text-[12px] font-bold truncate ${isPremium ? 'text-zinc-700 group-hover:text-[#F35D00]' : 'text-black'}`}>
                        Click to attach PDF hotel booking template
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium shrink-0 font-mono">max. 16 MB</span>
                  </div>
                </div>

              </div> {/* Close internal fields grid */}
            </div> {/* Close form cover card wrapper */}
          </div> {/* Close Left Column "lg:col-span-8|12" */}

          {/* Event Configuration - Right Column */}
          {configMenuExpanded && (
            <div className="lg:col-span-4 flex flex-col animate-fade-in" id="sidebar-event-configuration">
              <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl shadow-premium flex flex-col overflow-hidden animate-fade-in' : 'bg-[#F2F2F2] border border-gray-400 rounded-none flex flex-col overflow-hidden p-4'}`}>
                
                {/* Header block styled with white bg and gray border, in one section with dark text */}
                <div 
                  onClick={() => setConfigMenuExpanded(false)}
                  className={`${isPremium ? 'bg-white border-b border-[#E5E7EB] px-5 py-4 hover:bg-zinc-50/50' : 'bg-[#E5E5E5] px-4 py-2 border-b border-gray-400 hover:bg-gray-100'} flex items-center justify-between cursor-pointer select-none group/hdr`}
                >
                  <h3 className={`${isPremium ? 'text-xs font-bold text-[#1F2937] uppercase tracking-wide font-sans group-hover/hdr:text-[#F35D00]' : 'text-xs font-bold text-black'} transition-colors`}>
                    Event configuration
                  </h3>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfigMenuExpanded(false);
                    }}
                    className={`${isPremium ? 'p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-[#F35D00]' : 'border border-gray-500 bg-white font-bold p-1 text-black'}`}
                    title="Collapse to right"
                  >
                    <ChevronRight className="w-4 h-4 text-zinc-500 hover:text-[#F35D00]" />
                  </button>
                </div>

                {/* Vertical action buttons list in configuration */}
                <div className={`${isPremium ? 'p-5' : 'p-3'} flex flex-col`}>
                  <div className="overflow-y-auto max-h-[580px] pr-1 flex flex-col gap-1 custom-scrollbar bg-white">
                    {CONFIG_GROUPS.map((group, groupIdx) => {
                      const HeadingIcon = getHeaderIcon(group.heading);
                      return (
                        <div 
                          key={group.heading} 
                          className={`flex flex-col mb-3 last:mb-0 ${
                            isPremium 
                              ? `${groupIdx === 0 ? 'mt-0.5' : 'mt-3.5'}` 
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {isPremium && (
                              <HeadingIcon className="w-4 h-4 text-[#F35D00] shrink-0" />
                            )}
                            <h4 className={`${
                              isPremium 
                                ? 'text-[10px] font-bold uppercase tracking-widest text-[#828290] font-sans' 
                                : 'text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono border-b border-gray-400 pb-0.5'
                            }`}>
                              {group.heading}
                            </h4>
                          </div>
                          
                          <div className={`flex flex-col ${isPremium ? 'gap-1.5' : 'gap-1.5'}`}>
                            {group.items.map((actionName) => {
                              const isSelected = selectedConfigAction === actionName;
                              return (
                                <button
                                  key={actionName}
                                  type="button"
                                  onClick={() => {
                                    setSelectedConfigAction(actionName);
                                    onShowToast(`Action triggered: ${actionName}`);
                                  }}
                                  className={`w-full flex items-center justify-between transition-all select-none duration-150 group cursor-pointer ${
                                    isPremium
                                      ? `p-3 px-4 text-[12px] rounded-lg border font-bold ${
                                          isSelected
                                            ? 'bg-white text-[#F35D00] border-[#F35D00] shadow-sm'
                                            : 'bg-zinc-50/80 text-zinc-700 border-zinc-200/60 hover:bg-zinc-100/50 hover:text-[#F35D00] hover:border-zinc-300'
                                        }`
                                      : `p-3 text-[11px] text-left rounded-lg border font-semibold ${
                                          isSelected
                                            ? 'bg-[#D3D3D3] text-black font-extrabold border-black'
                                            : 'bg-white text-black border-gray-400 hover:bg-gray-100'
                                        }`
                                  }`}
                                >
                                  <div className="truncate">
                                    <span className="truncate">{actionName}</span>
                                  </div>
                                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${
                                    isPremium 
                                      ? isSelected 
                                        ? 'text-[#F35D00] translate-x-0.5' 
                                        : 'text-zinc-400 group-hover:translate-x-0.5 group-hover:text-[#F35D00]' 
                                      : 'text-black'
                                  }`} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          </div> {/* Close parent split grid */}

          <div className="w-full animate-fade-in mt-8" id="event-manager-footers-opt1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 mb-4">
              <div className="flex items-center gap-3">
                <h3 className={`${isPremium ? 'text-xl font-black text-zinc-900 tracking-tight' : 'text-lg font-bold text-black'}`}>
                  Available registrations
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* Integration Option Selector bar (New / Template + Role + Insert Button) - Standalone Card */}
              <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-3xs' : 'bg-[#E5E5E5] border border-gray-400 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3'}`} id="registration-insert-control">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#F35D00] rounded-full inline-block" />
                    <span className={`${isPremium ? 'text-xs font-black text-zinc-800 uppercase tracking-wider font-mono' : 'text-xs font-bold text-black uppercase'}`}>
                      Setup Option
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-5">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none group">
                      <input
                        type="radio"
                        name="reg-create-radio"
                        value="New"
                        checked={createRegType === 'New'}
                        onChange={() => setCreateRegType('New')}
                        className={`${isPremium ? 'w-4 h-4 text-[#F35D00] focus:ring-[#F35D00]/25 border-zinc-300 accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none cursor-pointer'}`}
                      />
                      <span className={`${isPremium ? 'text-xs font-bold text-zinc-700 group-hover:text-[#F35D00] transition-colors' : 'text-xs text-black font-semibold'}`}>New</span>
                    </label>
                    
                    <label className="flex items-center gap-1.5 cursor-pointer select-none group">
                      <input
                        type="radio"
                        name="reg-create-radio"
                        value="Template"
                        checked={createRegType === 'Template'}
                        onChange={() => setCreateRegType('Template')}
                        className={`${isPremium ? 'w-4 h-4 text-[#F35D00] focus:ring-[#F35D00]/25 border-zinc-300 accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none cursor-pointer'}`}
                      />
                      <span className={`${isPremium ? 'text-xs font-bold text-zinc-700 group-hover:text-[#F35D00] transition-colors' : 'text-xs text-black font-semibold'}`}>Template</span>
                    </label>
                  </div>

                  <div className="h-4 w-[1px] bg-zinc-200 hidden md:block" />

                  {/* Target Domain Role dropdown */}
                  <div className="flex items-center gap-2.5">
                    <span className={`${isPremium ? 'text-xs font-bold text-zinc-500 uppercase tracking-wide font-sans whitespace-nowrap' : 'text-xs text-black font-semibold whitespace-nowrap'}`}>Target domain role:</span>
                    <CustomSelect
                      value={createRegRole}
                      onChange={(val) => setCreateRegRole(val)}
                      options={[
                        { value: 'Employee', label: 'Employee' },
                        { value: 'Visitor', label: 'Visitor' },
                        { value: 'Exhibitor', label: 'Exhibitor' },
                        { value: 'Guest', label: 'Guest' },
                        { value: 'Survey', label: 'Survey' },
                      ]}
                      isPremium={isPremium}
                      variant="small"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInsertRegistration}
                  className={`${isPremium ? 'flex items-center gap-1.5 px-4.5 py-2 border-2 border-[#F35D00] bg-white text-[#F35D00] hover:bg-[#F35D00]/5 hover:border-[#D55200] active:scale-[0.98] text-xs font-extrabold rounded-lg transition-all cursor-pointer shadow-3xs' : 'bg-white border border-gray-500 font-bold px-3 py-1.5 text-xs text-black hover:bg-gray-100 cursor-pointer'}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert</span>
                </button>
              </div>

              {/* Registration list - Embedded within card styled container in premium */}
              <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-3xs' : 'bg-transparent'}`}>
                <div className={`${isPremium ? 'pb-4 border-b border-[#E5E7EB] mb-4' : 'pb-2 border-b border-gray-400 mb-3'}`}>
                  <span className={`${isPremium ? 'text-xs font-bold text-[#1F2937] uppercase tracking-wide font-sans block' : 'text-xs font-bold text-black uppercase block'}`}>Registrations List</span>
                </div>
                
                <div className={`overflow-y-auto max-h-[300px] custom-scrollbar ${isPremium ? 'space-y-2 p-1 bg-white' : 'divide-y divide-gray-200 border border-gray-200 bg-white'}`}>
                  {registrations.map((reg, idx) => {
                    const isSelected = selectedRegIdx === idx;
                    return (
                      <div
                        key={`${reg}-${idx}`}
                        onClick={() => setSelectedRegIdx(idx)}
                        className={`flex items-center justify-between transition-all cursor-pointer select-none group border duration-150 ${
                          isPremium
                            ? `p-3 px-4 text-[12px] rounded-lg font-bold ${
                                isSelected 
                                  ? 'bg-white text-[#F35D00] border-[#F35D00] shadow-sm' 
                                  : 'bg-zinc-50/80 text-zinc-700 border-zinc-200/60 hover:bg-zinc-100/50 hover:text-[#F35D00] hover:border-zinc-300'
                              }`
                            : isSelected
                              ? 'p-3 px-4.5 text-xs bg-[#D3D3D3] text-black font-extrabold border-l-4 border-black'
                              : 'p-3 px-4.5 text-xs hover:bg-gray-100 text-black border-transparent'
                        }`}
                      >
                        <div className="text-left truncate">
                          <span className={`truncate ${isPremium ? 'text-[12px] font-bold' : 'font-semibold'} ${isPremium && isSelected ? 'text-[#F35D00]' : 'text-zinc-700 group-hover:text-[#F35D00]'}`}>{reg}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRegistration(idx);
                          }}
                          title="Remove template configuration"
                          className={`${isPremium ? 'p-1.5 rounded-lg text-red-600 hover:text-red-750 hover:bg-red-50 border border-red-100 bg-white shadow-3xs transition-colors cursor-pointer' : 'border border-gray-500 text-black px-1.5 py-0.5 font-bold hover:bg-gray-200 bg-white cursor-pointer'}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                  {registrations.length === 0 && (
                    <div className="p-8 text-center text-xs text-zinc-400 italic">
                      No templates or registrations available. Use the controller above to insert one.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==========================================================
           OPTION 2: FLUID BLUEPRINT MULTI-CARD FORM WORKSPACE
           ========================================================== */
        <div className="flex flex-col space-y-6 relative" id="event-layout-option-2-root">
          
          {/* Vertical Toggle Handle on the Absolute Right Side when collapsed */}
          {!configMenuExpanded && (
            <button
              type="button"
              onClick={() => setConfigMenuExpanded(true)}
              className={`absolute -right-3 top-36 z-40 flex flex-col items-center gap-2.5 py-6 px-1.5 shadow-md cursor-pointer group active:scale-95 transition-all ${
                isPremium 
                  ? 'bg-[#F35D00] text-white rounded-l-xl border-y border-l border-[#B24400] hover:bg-[#B24400]' 
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
              title="Expand configuration menu"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-white animate-pulse" />
              <span 
                style={{ writingMode: 'vertical-lr' }} 
                className="text-[9px] font-black uppercase tracking-widest rotate-180 leading-none select-none"
              >
                Show Configuration
              </span>
            </button>
          )}

          {/* Transparent modern unified header block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200/50">
            <div className="flex items-center gap-3">
              <div className="w-[5px] h-6 rounded-full bg-gradient-to-b from-[#F35D00] to-[#FF904D] shadow-xs" />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <h2 className={`${isPremium ? 'text-lg font-extrabold text-zinc-900 tracking-tight' : 'text-sm font-bold text-black'}`}>
                    Create event
                  </h2>
                  <span className={`${isPremium ? 'text-[11px] text-[#F35D00] font-mono bg-[#F35D00]/10 px-2 py-0.5 rounded-md' : 'text-xs text-black font-bold ml-1'}`}>
                    ID: {event.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className={`${
                  isPremium
                    ? 'flex items-center gap-2 border border-red-200 text-red-600 bg-red-50/40 hover:bg-red-55 focus:ring-1 focus:ring-red-400/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm'
                    : 'flex items-center gap-1.5 bg-[#E1E1E1] border border-gray-500 text-black px-4 py-2 text-sm font-bold cursor-pointer md:py-2.5'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              
              <button
                onClick={handleSave}
                className={`${
                  isPremium
                    ? 'flex items-center gap-2 bg-gradient-to-r from-[#F35D00] to-[#FF8133] hover:from-[#D55200] hover:to-[#F35D00] text-white px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer'
                    : 'flex items-center gap-1.5 bg-[#18181B] border border-black text-white px-4 py-2 text-sm font-bold cursor-pointer hover:bg-black md:py-2.5'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
            
            {/* LEFT COMPONENT: Sequential Vertical Accordion Sections */}
            <div className={`${configMenuExpanded ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col space-y-4 transition-all duration-300`}>
              
              {/* SECTION 1: Setup & Identity Settings (starts open by default) */}
              <div className={`${
                isPremium
                  ? 'bg-white border border-zinc-200/55 rounded-2xl shadow-2xs overflow-hidden transition-all duration-300'
                  : 'border border-gray-400 bg-white p-4'
              } flex flex-col`}>
                <div 
                  onClick={() => setOpt2Sections(prev => ({ ...prev, setupOption: !prev.setupOption }))}
                  className={`flex items-center justify-between cursor-pointer p-4 select-none hover:bg-zinc-50/55 transition-colors border-l-4 ${opt2Sections.setupOption ? 'border-l-[#F35D00]' : 'border-l-zinc-350'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`${isPremium ? 'text-[13px] md:text-[13.5px] font-black text-zinc-850 tracking-widest' : 'text-sm font-bold text-black font-mono'}`}>
                      01. Setup & identity settings
                    </span>
                  </div>
                  {opt2Sections.setupOption ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>

                {opt2Sections.setupOption && (
                  <div className={`${isPremium ? 'p-6 pt-2 border-t border-zinc-100/50' : 'pt-3 border-t border-gray-300'}`}>
                    
                    {/* Setup Option config choice */}
                    <div className="pb-5 border-b border-zinc-100/80 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
                        <div className="flex items-center gap-5">
                          <span className={`${isPremium ? 'text-[11px] font-extrabold text-[#F35D00] uppercase tracking-wider' : 'text-xs font-bold text-black uppercase'}`}>
                            Setup Option:
                          </span>
                          
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="event-setup-radio-opt2-acc"
                              value="New"
                              checked={eventSetupType === 'New'}
                              onChange={() => setEventSetupType('New')}
                              className={`${isPremium ? 'w-4 h-4 text-[#F35D00] focus:ring-[#F35D00]/45 border-zinc-305 accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none cursor-pointer'}`}
                            />
                            <span className={`${isPremium ? 'text-[13px] font-bold text-zinc-700' : 'text-xs text-black font-semibold'}`}>New</span>
                          </label>
                          
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="event-setup-radio-opt2-acc"
                              value="Template"
                              checked={eventSetupType === 'Template'}
                              onChange={() => setEventSetupType('Template')}
                              className={`${isPremium ? 'w-4 h-4 text-[#F35D00] focus:ring-[#F35D00]/45 border-zinc-305 accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none cursor-pointer'}`}
                            />
                            <span className={`${isPremium ? 'text-[13px] font-bold text-zinc-700' : 'text-xs text-black font-semibold'}`}>Template</span>
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={() => onShowToast(`Successfully inserted configuration as: ${eventSetupType}`)}
                          className={`${isPremium ? 'flex items-center gap-1.5 px-4.5 py-2 border-2 border-[#F35D00] bg-white text-[#F35D00] hover:bg-[#F35D00]/5 active:scale-[0.98] text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-2xs' : 'bg-white border border-gray-500 font-bold px-3 py-1.5 text-xs text-black hover:bg-gray-100 cursor-pointer'}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Insert</span>
                        </button>
                      </div>
                    </div>

                    {/* Identity settings fields */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-7 gap-x-6">
                      
                      {/* Event Name */}
                      <div className="md:col-span-3 text-xs font-bold text-zinc-700 self-center">
                        Event Title <span className="text-[#F35D00] font-bold">*</span>
                      </div>
                      <div className="md:col-span-9">
                        <input
                          type="text"
                          value={event.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          className={`${
                            isPremium 
                              ? 'w-full bg-transparent border-b border-zinc-200/60 text-zinc-805 px-1 pb-1.5 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-bold transition-all focus:ring-0 rounded-none' 
                              : 'w-full bg-transparent border-b border-black p-1 pb-1 text-xs text-black focus:outline-none rounded-none'
                          }`}
                          placeholder="e.g. World Industry Trade Fair 2026"
                        />
                      </div>

                      {/* Address */}
                      <div className="md:col-span-3 text-xs font-bold text-zinc-700 self-center">
                        Address Location
                      </div>
                      <div className="md:col-span-9 flex items-center gap-2">
                        <input
                          type="text"
                          value={event.address || ''}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          className={`${
                            isPremium 
                              ? 'flex-1 bg-transparent border-b border-zinc-200/60 text-zinc-750 px-1 pb-1.5 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-medium transition-all focus:ring-0 rounded-none' 
                              : 'flex-1 bg-transparent border-b-2 border-black p-1 pb-1 text-xs text-black focus:outline-none rounded-none'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => onShowToast('Edit address dialogue (mock action)')}
                          className={`${
                            isPremium 
                              ? 'border border-[#F35D00]/20 hover:border-[#F35D00] hover:bg-[#F35D00]/5 text-[#F35D00] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs bg-white shrink-0' 
                              : 'bg-[#E1E1E1] border border-gray-500 text-black px-2 py-1 text-xs font-bold shrink-0'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#F35D00]" />
                          <span>Edit</span>
                        </button>
                      </div>

                      {/* Time Zone picker */}
                      <div className="md:col-span-3 text-xs font-bold text-zinc-700 self-center">
                        Zone Registry
                      </div>
                      <div className="md:col-span-9">
                        <CustomSelect
                          value={event.timezone}
                          onChange={(val) => handleFieldChange('timezone', val)}
                          options={[
                            { value: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna', label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
                            { value: '(UTC+00:00) London, Dublin, Lisbon', label: '(UTC+00:00) London, Dublin, Lisbon' },
                            { value: '(UTC-05:00) Eastern Time (US & Canada)', label: '(UTC-05:00) Eastern Time (US & Canada)' },
                            { value: '(UTC+08:00) Singapore, Beijing, Perth', label: '(UTC+08:00) Singapore, Beijing, Perth' },
                          ]}
                          isPremium={isPremium}
                          variant="line"
                        />
                      </div>

                      {/* Event Type / Classification */}
                      <div className="md:col-span-3 text-xs font-bold text-zinc-700 self-center">
                        Classification
                      </div>
                      <div className="md:col-span-9">
                        <CustomSelect
                          value={event.eventType}
                          onChange={(val) => handleFieldChange('eventType', val)}
                          options={[
                            { value: 'Please select', label: 'Please select' },
                            { value: 'Trade Fair', label: 'Trade Fair (Default)' },
                            { value: 'Corporate Seminar', label: 'Corporate Seminar' },
                            { value: 'Exhibition', label: 'Exhibition' },
                          ]}
                          isPremium={isPremium}
                          variant="line"
                        />
                      </div>

                      {/* Currency */}
                      <div className="md:col-span-3 text-xs font-bold text-zinc-700 self-center">
                        Payment currency
                      </div>
                      <div className="md:col-span-9">
                        <CustomSelect
                          value={event.currency}
                          onChange={(val) => handleFieldChange('currency', val)}
                          options={[
                            { value: 'Euro', label: 'Euro (€)' },
                            { value: 'USD', label: 'USD ($)' },
                            { value: 'GBP', label: 'GBP (£)' },
                            { value: 'CHF', label: 'CHF (Fr)' },
                          ]}
                          isPremium={isPremium}
                          variant="line"
                        />
                      </div>

                      {/* Website */}
                      <div className="md:col-span-3 text-xs font-bold text-zinc-700 self-center">
                        Website Address
                      </div>
                      <div className="md:col-span-9 text-left">
                        <input
                          type="text"
                          value={event.website || ''}
                          onChange={(e) => handleFieldChange('website', e.target.value)}
                          className={`${
                            isPremium 
                              ? 'w-full bg-transparent border-b border-zinc-200/60 text-zinc-805 px-1 pb-1.5 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-mono font-medium transition-all focus:ring-0 rounded-none' 
                              : 'w-full bg-transparent border-b-2 border-black p-1 pb-1 text-xs text-black font-mono focus:outline-none rounded-none'
                          }`}
                        />
                        <span className="text-[10px] text-zinc-400 mt-1 block">Specify URL starting, e.g. http://www.xfair.com</span>
                      </div>

                      {/* External ID and Code */}
                      <div className="md:col-span-3 text-xs font-bold text-zinc-700 self-center">
                        External ID / Code
                      </div>
                      <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <input
                          type="text"
                          placeholder="Identifier"
                          value={event.externalIdentifier || ''}
                          onChange={(e) => handleFieldChange('externalIdentifier', e.target.value)}
                          className={`${
                            isPremium 
                              ? 'w-full bg-transparent border-b border-zinc-200/60 text-zinc-805 px-1 pb-1.5 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-mono font-medium transition-all focus:ring-0 rounded-none' 
                              : 'w-full bg-transparent border-b-2 border-black p-1 pb-1 text-xs text-black font-mono focus:outline-none rounded-none'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Identifier Code"
                          value={event.externalIdentifierCode || ''}
                          onChange={(e) => handleFieldChange('externalIdentifierCode', e.target.value)}
                          className={`${
                            isPremium 
                              ? 'w-full bg-transparent border-b border-zinc-200/60 text-zinc-805 px-1 pb-1.5 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-mono font-medium transition-all focus:ring-0 rounded-none' 
                              : 'w-full bg-transparent border-b-2 border-black p-1 pb-1 text-xs text-black font-mono focus:outline-none rounded-none'
                          }`}
                        />
                      </div>

                      {/* Active Toggle Switch */}
                      <div className="md:col-span-3 text-xs font-bold text-zinc-700 self-center">
                        Publication State
                      </div>
                      <div className="md:col-span-9 flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={event.isTemplate !== true}
                            onChange={(e) => {
                              onShowToast(e.target.checked ? 'Event marked as active' : 'Event marked as inactive');
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F35D00]"></div>
                          <span className="ml-3 text-xs font-semibold text-zinc-650">
                            {event.isTemplate !== true ? 'Active and Visible' : 'Inactive'}
                          </span>
                        </label>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* SECTION 2: Schedule & Stepper Buffers */}
              <div className={`${
                isPremium
                  ? 'bg-white border border-zinc-200/55 rounded-2xl shadow-2xs overflow-hidden'
                  : 'border border-gray-400 bg-white p-4'
              } flex flex-col`}>
                <div 
                  onClick={() => setOpt2Sections(prev => ({ ...prev, scheduleSteppers: !prev.scheduleSteppers }))}
                  className={`flex items-center justify-between cursor-pointer p-4 select-none hover:bg-zinc-50/55 transition-colors border-l-4 ${opt2Sections.scheduleSteppers ? 'border-l-[#F35D00]' : 'border-l-zinc-350'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`${isPremium ? 'text-[13px] md:text-[13.5px] font-black text-zinc-850 tracking-widest' : 'text-sm font-bold text-black font-mono'}`}>
                      02. Schedule & stepper buffers
                    </span>
                  </div>
                  {opt2Sections.scheduleSteppers ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>

                {opt2Sections.scheduleSteppers && (
                  <div className={`${isPremium ? 'p-6 pt-2 border-t border-zinc-100/50' : 'pt-3 border-t border-gray-300'}`}>
                    <div className="space-y-7">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-1">
                          <span className="text-[11px] text-zinc-405 font-bold uppercase tracking-wide block mb-1">Start Date</span>
                          <input
                            type="date"
                            value={event.startDate || ''}
                            onChange={(e) => handleFieldChange('startDate', e.target.value)}
                            className={`${
                              isPremium 
                                ? 'w-full bg-transparent border-b border-zinc-200/60 text-zinc-805 px-1 pb-2.5 pt-1 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-bold transition-all focus:ring-0 rounded-none' 
                                : 'w-full bg-transparent border-b border-black p-1 pb-1 text-xs text-black focus:outline-none rounded-none'
                            }`}
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-[11px] text-zinc-405 font-bold uppercase tracking-wide block mb-1">End Date</span>
                          <input
                            type="date"
                            value={event.endDate || ''}
                            onChange={(e) => handleFieldChange('endDate', e.target.value)}
                            className={`${
                              isPremium 
                                ? 'w-full bg-transparent border-b border-zinc-200/60 text-zinc-805 px-1 pb-2.5 pt-1 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-bold transition-all focus:ring-0 rounded-none' 
                                : 'w-full bg-transparent border-b border-black p-1 pb-1 text-xs text-black focus:outline-none rounded-none'
                            }`}
                          />
                        </div>
                      </div>

                      <div className={`${isPremium ? 'bg-amber-50/70 border border-amber-200/90 text-[11px] text-amber-900 p-3.5 rounded-xl flex items-start gap-2.5 leading-relaxed font-semibold' : 'text-xs text-zinc-650 bg-white border border-gray-400 p-2'}`}>
                        <span className="text-sm select-none mt-0.5 shrink-0">⚠️</span>
                        <span>
                          Event changes automatically ripple down and recalculate pre-arranged templates. Check calculations.
                        </span>
                      </div>

                      <div className="space-y-1 pt-1">
                        {[
                          { key: 'attendanceDaysBefore', label: 'Attendance Days Prior' },
                          { key: 'attendanceDaysAfter', label: 'Attendance Days Post' },
                          { key: 'hotelDaysBefore', label: 'Hotel Booking Days Prior' },
                          { key: 'hotelDaysAfter', label: 'Hotel Booking Days Post' }
                        ].map((stepper) => {
                          const field = stepper.key as 'attendanceDaysBefore' | 'attendanceDaysAfter' | 'hotelDaysBefore' | 'hotelDaysAfter';
                          return (
                            <div 
                              key={stepper.key} 
                              className={`flex items-center justify-between py-3.5 px-1 transition-all ${
                                isPremium 
                                  ? 'bg-transparent border-b border-zinc-200/80' 
                                  : 'bg-transparent border-b border-black'
                              }`}
                            >
                              <span className="text-xs font-bold text-zinc-700">{stepper.label}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStepper(field, -1)}
                                  className="w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center cursor-pointer transition-colors font-bold text-[15px]"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-xs font-extrabold text-[#F35D00] font-mono">
                                  {event[field]}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleStepper(field, 1)}
                                  className="w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center cursor-pointer transition-colors font-bold text-[15px]"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Branding Assets & Documents */}
              <div className={`${
                isPremium
                  ? 'bg-white border border-zinc-200/55 rounded-2xl shadow-2xs overflow-hidden'
                  : 'border border-gray-400 bg-white p-4'
              } flex flex-col`}>
                <div 
                  onClick={() => setOpt2Sections(prev => ({ ...prev, assetsEmailing: !prev.assetsEmailing }))}
                  className={`flex items-center justify-between cursor-pointer p-4 select-none hover:bg-zinc-50/55 transition-colors border-l-4 ${opt2Sections.assetsEmailing ? 'border-l-[#F35D00]' : 'border-l-zinc-350'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`${isPremium ? 'text-[13px] md:text-[13.5px] font-black text-zinc-850 tracking-widest' : 'text-sm font-bold text-black font-mono'}`}>
                      03. Branding assets & documents
                    </span>
                  </div>
                  {opt2Sections.assetsEmailing ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>

                {opt2Sections.assetsEmailing && (
                  <div className={`${isPremium ? 'p-6 pt-2 border-t border-zinc-100/50' : 'pt-3 border-t border-gray-300'}`}>
                                         <div className="space-y-4">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Image Logo Configuration</span>
                        
                        {/* Selector select dropdown (FIRST) */}
                        <CustomSelect
                          value="xfair logo.png"
                          onChange={(val) => onShowToast(`Selected image resource: ${val}`)}
                          options={[
                            { value: 'xfair logo.png', label: 'xfair logo.png' },
                            { value: 'alternate_banner_2026.png', label: 'alternate_banner_2026.png' },
                            { value: 'fair_map_structure.jpg', label: 'fair_map_structure.jpg' },
                            { value: 'none', label: '-- Hide Header Image --' },
                          ]}
                          isPremium={isPremium}
                          variant="line"
                        />

                        {/* Image Logo Preview (BELOW) */}
                        <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs w-fit">
                          <div className="flex gap-1.5 items-center">
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <div className="flex gap-0.5 animate-pulse-soft">
                                <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                                <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                                <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                              </div>
                              <div className="flex gap-0.5 justify-center">
                                <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                                <span className="w-2.5 h-2.5 bg-[#F35D00] rounded-xs" />
                              </div>
                            </div>
                            <div className="flex flex-col select-none px-2">
                              <span className="text-[18px] font-extrabold leading-none tracking-tight text-zinc-900 font-sans">
                                X<span className="text-[#F35D00]">FAIR</span>
                              </span>
                              <span className="text-[6.5px] font-bold text-[#F35D00] uppercase tracking-wider leading-none mt-0.5">
                                flexibility through ability
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-1">
                        {/* PDF Summary Template */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block font-sans">PDF summary mail template</span>
                          <div 
                            onClick={() => onShowToast('Browse triggered for PDF summary mail')}
                            className={`${
                              isPremium
                                ? 'border border-dashed border-zinc-200/80 hover:border-[#F35D00] bg-zinc-50/40 hover:bg-[#FFE7D6]/10 rounded-xl p-3 text-center flex items-center justify-between cursor-pointer group shadow-3xs'
                                : 'border border-gray-400 hover:border-black p-2.5 bg-white text-center flex items-center justify-between cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Paperclip className={`w-3.5 h-3.5 shrink-0 ${isPremium ? 'text-[#F35D00]' : 'text-[#2F3747]'}`} />
                              <span className={`text-[11px] font-bold truncate ${isPremium ? 'text-zinc-700 group-hover:text-[#F35D00]' : 'text-black'}`}>
                                Click to attach PDF summary
                              </span>
                            </div>
                            <span className="text-[9px] text-zinc-400 font-medium shrink-0 font-mono">max. 16 MB</span>
                          </div>
                        </div>

                        {/* PDF Hotel Template */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block font-sans">PDF template for hotel booking</span>
                          <div 
                            onClick={() => onShowToast('Browse triggered for PDF hotel booking template')}
                            className={`${
                              isPremium
                                ? 'border border-dashed border-zinc-200/80 hover:border-[#F35D00] bg-zinc-50/40 hover:bg-[#FFE7D6]/10 rounded-xl p-3 text-center flex items-center justify-between cursor-pointer group shadow-3xs'
                                : 'border border-gray-400 hover:border-black p-2.5 bg-white text-center flex items-center justify-between cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Paperclip className={`w-3.5 h-3.5 shrink-0 ${isPremium ? 'text-[#F35D00]' : 'text-[#2F3747]'}`} />
                              <span className={`text-[11px] font-bold truncate ${isPremium ? 'text-zinc-700 group-hover:text-[#F35D00]' : 'text-black'}`}>
                                Click to attach PDF hotel template
                              </span>
                            </div>
                            <span className="text-[9px] text-zinc-400 font-medium shrink-0 font-mono">max. 16 MB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* SECTION 4: Available registrations */}
              <div className={`${
                isPremium
                  ? 'bg-white border border-zinc-200/55 rounded-2xl shadow-2xs overflow-hidden'
                  : 'border border-gray-400 bg-white p-4'
              } flex flex-col`}>
                <div 
                  onClick={() => setOpt2Sections(prev => ({ ...prev, availableRegistrations: !prev.availableRegistrations }))}
                  className={`flex items-center justify-between cursor-pointer p-4 select-none hover:bg-zinc-50/55 transition-colors border-l-4 ${opt2Sections.availableRegistrations ? 'border-l-[#F35D00]' : 'border-l-zinc-350'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`${isPremium ? 'text-[13px] md:text-[13.5px] font-black text-zinc-850 tracking-widest' : 'text-sm font-bold text-black font-mono'}`}>
                      04. Available registrations
                    </span>
                  </div>
                  {opt2Sections.availableRegistrations ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>

                {opt2Sections.availableRegistrations && (
                  <div className={`${isPremium ? 'p-6 pt-2 border-t border-zinc-100/50' : 'pt-3 border-t border-gray-300'}`}>
                    <div className="space-y-7">
                      
                      {/* Integrated creation form layout with enhanced spacing and sizes */}
                      <div className={`p-6 rounded-2xl space-y-6 border ${isPremium ? 'bg-zinc-50/40 border-zinc-200/50' : 'bg-[#F2F2F2] border-gray-400'}`}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="w-1.5 h-3.5 bg-[#F35D00] rounded-full" />
                          <span className="text-[13px] font-black uppercase tracking-wider text-zinc-800">Add template / registration configuration</span>
                        </div>

                        <div className="flex items-center gap-6 pt-1 select-none">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="reg-create-type-opt2-accordion"
                              value="New"
                              checked={createRegType === 'New'}
                              onChange={() => setCreateRegType('New')}
                              className={isPremium ? 'w-4 h-4 text-[#F35D00] focus:ring-[#F35D00] border-zinc-305 cursor-pointer accent-[#F35D00]' : 'w-4 h-4 rounded-none cursor-pointer'}
                            />
                            <span className="text-[13px] text-zinc-700 font-bold font-sans">New Format</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="reg-create-type-opt2-accordion"
                              value="Template"
                              checked={createRegType === 'Template'}
                              onChange={() => setCreateRegType('Template')}
                              className={isPremium ? 'w-4 h-4 text-[#F35D00] focus:ring-[#F35D00] border-zinc-305 cursor-pointer accent-[#F35D00]' : 'w-4 h-4 rounded-none cursor-pointer'}
                            />
                            <span className="text-[13px] text-zinc-700 font-bold font-sans">Template Layout</span>
                          </label>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <span className="text-[11px] font-extrabold text-zinc-405 uppercase tracking-widest block font-sans whitespace-nowrap">Target Domain Role</span>
                          <CustomSelect
                            value={createRegRole}
                            onChange={(val) => setCreateRegRole(val)}
                            options={[
                              { value: 'Employee', label: 'Employee' },
                              { value: 'Visitor', label: 'Visitor' },
                              { value: 'Exhibitor', label: 'Exhibitor' },
                              { value: 'Guest', label: 'Guest' },
                              { value: 'Survey', label: 'Survey' },
                            ]}
                            isPremium={isPremium}
                            variant="line"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleInsertRegistration}
                          className={`${
                            isPremium
                              ? 'w-full flex items-center justify-center gap-2 border-2 border-[#F35D00] bg-white text-[#F35D00] hover:bg-[#F35D00]/5 hover:border-[#D55200] py-2.5 px-4 rounded-xl text-xs font-extrabold shadow-2xs transition-all active:scale-[0.98] cursor-pointer'
                              : 'w-full flex items-center justify-center gap-1 bg-[#E1E1E1] border border-gray-500 text-black px-3 py-1.5 text-xs font-bold cursor-pointer'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Insert</span>
                        </button>
                      </div>

                      {/* Display registrations list */}
                      <div className="space-y-3.5">
                        <span className="text-[11px] text-zinc-405 font-bold uppercase tracking-wider block">Currently available layouts</span>
                        <div className={`overflow-y-auto max-h-[300px] custom-scrollbar ${isPremium ? 'space-y-2 p-1 bg-white' : 'divide-y divide-gray-200 border border-gray-250 bg-white overflow-hidden'}`}>
                          {registrations.map((reg, idx) => {
                            const isSelected = selectedRegIdx === idx;
                            return (
                              <div
                                key={`${reg}-${idx}`}
                                onClick={() => setSelectedRegIdx(idx)}
                                className={`flex items-center justify-between transition-all cursor-pointer select-none group border duration-150 ${
                                  isPremium
                                    ? `p-3 px-4 text-[12px] rounded-lg font-bold ${
                                        isSelected 
                                          ? 'bg-white text-[#F35D00] border-[#F35D00] shadow-sm' 
                                          : 'bg-zinc-50/80 text-zinc-700 border-zinc-200/60 hover:bg-zinc-100/50 hover:text-[#F35D00] hover:border-zinc-300'
                                      }`
                                    : isSelected
                                      ? 'p-3 px-4 text-xs bg-[#D3D3D3] text-black font-extrabold border-l-4 border-black'
                                      : 'p-3 px-4 text-xs hover:bg-gray-100 text-black border-transparent'
                                }`}
                              >
                                <div className="text-left truncate">
                                  <span className={`truncate ${isPremium ? 'text-[12px] font-bold' : 'font-semibold'} ${isPremium && isSelected ? 'text-[#F35D00]' : 'text-zinc-700 group-hover:text-[#F35D00]'}`}>{reg}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRegistration(idx);
                                  }}
                                  title="Remove template layout"
                                  className={`${isPremium ? 'p-1.5 rounded-lg text-red-600 hover:text-red-750 hover:bg-red-50 border border-red-105 bg-white shadow-2xs transition-colors cursor-pointer group-hover:border-red-200' : 'border border-gray-500 text-black px-1.5 font-bold hover:bg-gray-200 bg-white cursor-pointer'}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                </button>
                              </div>
                            );
                          })}
                          {registrations.length === 0 && (
                            <div className="p-6 text-center text-xs text-zinc-405 italic">
                              No registrations formats configured. Add one above.
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COMPONENT: Collapsible Event Configuration menu */}
            {configMenuExpanded && (
              <div className="lg:col-span-4 flex flex-col animate-fade-in" id="event-configuration-menu-panel-accordion-opt2">
                <div className={`${isPremium ? 'bg-white border border-zinc-200/80 rounded-2xl shadow-premium flex flex-col overflow-hidden' : 'bg-white border border-gray-400 rounded-none flex flex-col overflow-hidden'}`}>
                  
                  {/* Header click collapses it */}
                  <div 
                    onClick={() => setConfigMenuExpanded(false)}
                    className={`${
                      isPremium 
                        ? 'bg-white border-b border-zinc-100/70 p-4 border-l-4 border-l-[#F35D00] hover:bg-zinc-50/40' 
                        : 'bg-white p-4 border-b border-gray-400 border-l-4 border-l-black hover:bg-gray-50'
                    } flex items-center justify-between cursor-pointer select-none group/hdr transition-colors`}
                  >
                    <div className="flex items-center gap-2.5">
                      <h2 className={`${
                        isPremium 
                          ? 'text-[13px] md:text-[13.5px] font-black text-zinc-850 tracking-widest uppercase group-hover/hdr:text-[#F35D00]' 
                          : 'text-xs font-bold text-black font-mono'
                      } transition-colors`}>
                        Event configuration
                      </h2>
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfigMenuExpanded(false);
                      }}
                      className={`${isPremium ? 'p-1.5 rounded-lg hover:bg-zinc-200/60 transition-colors text-zinc-500 hover:text-zinc-800 cursor-pointer' : 'border border-gray-500 bg-white font-bold p-1 text-black font-mono cursor-pointer'}`}
                      title="Collapse config menu"
                    >
                      <ChevronRight className="w-4 h-4 text-zinc-500 hover:text-[#F35D00]" />
                    </button>
                  </div>

                  {/* Actions list redesigned for Option 2 Premium Theme */}
                  <div className={`${isPremium ? 'p-5' : 'p-4'}`}>
                    <div className="overflow-y-auto max-h-[525px] pr-1 flex flex-col gap-1 custom-scrollbar-light">
                      {CONFIG_GROUPS.map((group, groupIdx) => {
                        const HeadingIcon = getHeaderIcon(group.heading);
                        return (
                          <div 
                            key={group.heading} 
                            className={`flex flex-col mb-3 last:mb-0 ${
                              isPremium 
                                ? `${groupIdx === 0 ? 'mt-0.5' : 'mt-3.5'}` 
                                : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {isPremium && (
                                <HeadingIcon className="w-4 h-4 text-[#F35D00] shrink-0" />
                              )}
                              <h4 className={`${
                                isPremium 
                                  ? 'text-[10px] font-bold uppercase tracking-widest text-[#828290] font-sans' 
                                  : 'text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono border-b border-gray-400 pb-0.5'
                              }`}>
                                {group.heading}
                              </h4>
                            </div>
                            
                            <div className={`${isPremium ? 'space-y-1.5' : 'divide-y divide-gray-250 border border-gray-400 bg-white'}`}>
                              {group.items.map((actionName) => {
                                const isSelected = selectedConfigAction === actionName;
                                return (
                                  <button
                                    key={actionName}
                                    type="button"
                                    onClick={() => {
                                      setSelectedConfigAction(actionName);
                                      onShowToast(`Action triggered: ${actionName}`);
                                    }}
                                    className={`w-full flex items-center justify-between border rounded-lg transition-all select-none group cursor-pointer ${
                                      isPremium
                                        ? `p-3 px-4 text-[12px] font-bold ${
                                            isSelected
                                              ? 'bg-white text-[#F35D00] border-[#F35D00] shadow-sm'
                                              : 'bg-zinc-50/80 text-zinc-700 border-zinc-200/60 hover:bg-zinc-100/50 hover:text-[#F35D00] hover:border-zinc-300'
                                          }`
                                        : isSelected
                                          ? 'bg-gray-200 text-black border-l-2 border-black font-extrabold text-xs p-2 px-3.5'
                                          : 'bg-white hover:bg-gray-100 text-black border-transparent hover:border-black font-medium text-xs p-2 px-3.5'
                                    }`}
                                  >
                                    <div className="truncate">
                                      <span className={`truncate ${isPremium ? 'text-[12px] font-bold' : 'text-xs'}`}>{actionName}</span>
                                    </div>
                                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-150 ${
                                      isPremium 
                                        ? isSelected ? 'text-[#F35D00] translate-x-0.5' : 'text-zinc-400 group-hover:translate-x-0.5 group-hover:text-[#F35D00]' 
                                        : 'text-black group-hover:translate-x-0.5'
                                    }`} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
