/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Calendar, Clock, Globe, DollarSign, Upload, 
  Plus, Save, Users, AlertTriangle, FileText, CheckCircle2, 
  FolderLock, Tag, LayoutDashboard, ChevronRight, CheckCircle, ExternalLink,
  ChevronDown, Trash2, FolderOpen, Image as ImageIcon, MapPin,
  Search, ShieldCheck, Layers, Settings, Wallet, Receipt, Key, Send, Mail,
  History, Paperclip
} from 'lucide-react';
import { EventData, ThemeConfig } from '../types';

interface CreateEventPageProps {
  initialEvent: EventData;
  onSave: (updatedEvent: EventData) => void;
  activeTheme: ThemeConfig;
  onNavigate?: (page: string) => void;
}

export function CreateEventPage({ initialEvent, onSave, activeTheme, onNavigate }: CreateEventPageProps) {
  const formatToDMY = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const [eventData, setEventData] = useState<EventData>({
    ...initialEvent,
    availableRegistrations: initialEvent.availableRegistrations ? initialEvent.availableRegistrations.slice(-2) : [
      'Visitor Registration 2028 Pool',
      'Employee Registration 2028 Standard'
    ]
  });

  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  
  // Create registration form state
  const [newRegMode, setNewRegMode] = useState<'New' | 'Template'>('New');
  const [selectedRegType, setSelectedRegType] = useState('Employee');
  const [customRegName, setCustomRegName] = useState('');

  // Top header creation modes
  const [topMode, setTopMode] = useState<'New' | 'Template'>('New');

  // Active dropdown state for custom dropdown menus
  const [activeDropdown, setActiveDropdown] = useState<'timezone' | 'eventType' | 'currency' | 'image' | 'regType' | null>(null);

  const timezoneOptions = [
    { value: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna', label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
    { value: '(UTC+00:00) London, Dublin, Lisbon', label: '(UTC+00:00) London, Dublin, Lisbon' },
    { value: '(UTC-05:00) New York, Toronto, Miami', label: '(UTC-05:00) New York, Toronto, Miami' }
  ];

  const eventTypeOptions = [
    { value: 'Trade Fair', label: 'Corporate Trade Fair' },
    { value: 'Conference', label: 'General Technical Conference' },
    { value: 'Exhibition', label: 'Public Exhibition & Showcase' }
  ];

  const currencyOptions = [
    { value: 'Euro', label: 'Euro' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'GBP', label: 'GBP (£)' }
  ];

  const imageOptions = [
    { value: 'ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png', label: 'ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png' },
    { value: 'xfair_logo.png', label: 'xfair logo.png' },
    { value: 'bauma_exhibitor_main.png', label: 'bauma_exhibitor_main.png' },
    { value: 'munich_brand_header.jpg', label: 'munich_brand_header.jpg' }
  ];

  const registrationTypeOptions = [
    { value: 'Employee', label: 'Employee' },
    { value: 'Visitor', label: 'Visitor' },
    { value: 'VIP customer', label: 'VIP customer' },
    { value: 'Exhibitor', label: 'Exhibitor' }
  ];

  // Interactive browse files lists (for mock upload browsing)
  const [pdfSummaryFile, setPdfSummaryFile] = useState<{name: string, size: string} | null>(null);
  const [pdfHotelFile, setPdfHotelFile] = useState<{name: string, size: string} | null>(null);

  // Address edit active switch
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Configuration Hub states
  const [configSearch, setConfigSearch] = useState('');
  const [selectedConfigCat, setSelectedConfigCat] = useState<'All' | 'Core' | 'Logistics' | 'Sales' | 'Messaging'>('All');

  // Quick counter increments
  const handleIntChange = (field: 'attendanceDaysBefore' | 'attendanceDaysAfter' | 'hotelDaysBefore' | 'hotelDaysAfter', val: number) => {
    setEventData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + val)
    }));
  };

  const handleTextChange = (field: keyof EventData, val: any) => {
    setEventData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleFileUpload = (type: 'summary' | 'hotel') => {
    const defaultName = type === 'summary' ? 'summary_mail_invoice_v8.pdf' : 'hotel_room_voucher_print.pdf';
    const mockFile = { name: defaultName, size: '2.4 MB' };
    if (type === 'summary') {
      setPdfSummaryFile(mockFile);
    } else {
      setPdfHotelFile(mockFile);
    }
  };

  // Insert a registration schema to list
  const handleInsertRegistration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const modeSuffix = newRegMode === 'Template' ? '(Template)' : '(Appointment)';
    const name = `Add New ${selectedRegType} ${modeSuffix}`;
    setEventData(prev => ({
      ...prev,
      availableRegistrations: [...prev.availableRegistrations, name]
    }));
  };

  const handleRemoveRegistration = (indexToKill: number) => {
    setEventData(prev => ({
      ...prev,
      availableRegistrations: prev.availableRegistrations.filter((_, i) => i !== indexToKill)
    }));
  };

  const handleMainFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Silently save without toast/alert notification
    const updated = {
      ...eventData,
      pdfSummaryMail: pdfSummaryFile,
      pdfTemplateHotel: pdfHotelFile
    };
    onSave(updated);
  };

  return (
    <div className="space-y-8 pb-20 select-none animate-fadeIn">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: activeTheme.borderColor }}>
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium tracking-wide">
            <span>EMS</span>
            <ChevronRight className="w-3 nav-arrow h-3 text-neutral-300" />
            <span className="text-neutral-800 font-semibold" style={{ color: activeTheme.primaryColor }}>Event manager</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mt-2" style={{ color: activeTheme.textColor }}>
            Create Event
          </h2>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to delete this event workspace?")) {
                alert("This action is restricted in sandbox preview!");
              }
            }}
            className="h-8 px-4 border border-neutral-250 hover:bg-neutral-50 rounded-xl text-xs text-neutral-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer bg-white transition-all shadow-xs"
            style={{ borderColor: activeTheme.borderColor }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Delete</span>
          </button>
          
          <button 
            onClick={handleMainFormSubmit}
            className="h-8 px-4 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
 
      {/* Core Dual-Column Bento Workspace wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Side: Standard properties parameters and schemas definitions */}
        <div className={`${isConfigExpanded ? 'xl:col-span-9' : 'xl:col-span-12'} space-y-6 transition-all duration-300`}>
 
          {/* Top Creation Mode Selector - Aligned exactly with Left Column Width */}
          <div className="bg-white rounded-2xl border shadow-xs overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            {/* Title Bar - Reduced height */}
            <div className="px-5 py-2 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
              <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
                Create Event
              </h3>
            </div>
 
            {/* Content Body of Mode Selector with tighter padding */}
            <div className="p-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <span className="text-xs font-bold text-neutral-700 tracking-wider font-sans" style={{ color: activeTheme.textColor }}>Setup Option</span>
                <div className="flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() => setTopMode('New')}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    <div 
                      className="w-4 h-4 rounded-full border flex items-center justify-center transition-all bg-white"
                      style={{ 
                        borderColor: topMode === 'New' ? activeTheme.primaryColor : activeTheme.borderColor,
                        borderWidth: topMode === 'New' ? '2px' : '1px'
                      }}
                    >
                      {topMode === 'New' && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                        />
                      )}
                    </div>
                    <span className="text-xs font-semibold font-sans" style={{ color: activeTheme.textColor }}>New event</span>
                  </button>
 
                  <button
                    type="button"
                    onClick={() => setTopMode('Template')}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    <div 
                      className="w-4 h-4 rounded-full border flex items-center justify-center transition-all bg-white"
                      style={{ 
                        borderColor: topMode === 'Template' ? activeTheme.primaryColor : activeTheme.borderColor,
                        borderWidth: topMode === 'Template' ? '2px' : '1px'
                      }}
                    >
                      {topMode === 'Template' && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                        />
                      )}
                    </div>
                    <span className="text-xs font-semibold font-sans" style={{ color: activeTheme.textColor }}>Clone from template</span>
                  </button>
                </div>
              </div>
 
              <button 
                type="button"
                onClick={() => {
                  alert(`Drafting new ${topMode === 'Template' ? 'template workspace' : 'blank event'}...`);
                }}
                className="group h-7 px-4 border rounded-xl text-xs hover:bg-neutral-50 bg-white text-neutral-750 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                style={{ borderColor: activeTheme.borderColor }}
              >
                <Plus className="w-4.5 h-4.5 text-neutral-400 group-hover:text-neutral-750 transition-colors" />
                <span>Insert</span>
              </button>
            </div>
          </div>
          
          {/* Event Data Container */}
          <div className="bg-white rounded-2xl border shadow-xs overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            {/* Title Bar */}
            <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
              <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
                Event Data
              </h3>
            </div>
 
            {/* Content Form Body aligned as horizontal row grid */}
            <div className="divide-y divide-neutral-100" style={{ borderColor: activeTheme.borderColor }}>
          
          {/* Row 1: ID */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>ID</span>
            <div className="md:col-span-3">
              <div className="w-full h-7 flex items-center justify-between bg-neutral-50 px-2.5 rounded-lg border max-w-xs font-mono text-xs text-neutral-700" style={{ borderColor: activeTheme.borderColor }}>
                <span>{eventData.id}</span>
                {/* History icon */}
                <History className="w-4 h-4 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer" title="View historical entries" />
              </div>
            </div>
          </div>
 
          {/* Row 2: Event Name */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
              Event Name <span className="text-red-500 font-semibold">*</span>
            </span>
            <div className="md:col-span-3">
              <input 
                type="text" 
                required
                value={eventData.name}
                onChange={(e) => handleTextChange('name', e.target.value)}
                className="w-full h-7 max-w-2xl px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-800 font-normal focus:outline-none"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              />
            </div>
          </div>
 
          {/* Row 3: Address */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>Address</span>
            <div className="md:col-span-3 flex items-center gap-2 max-w-2xl">
              <input 
                type="text" 
                disabled={!isEditingAddress}
                value={eventData.address}
                onChange={(e) => handleTextChange('address', e.target.value)}
                className={`flex-1 h-7 px-3 border rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-800 font-normal focus:outline-none ${isEditingAddress ? 'border-neutral-400 bg-white' : 'border-neutral-200'}`}
                style={{ color: activeTheme.textColor, borderColor: isEditingAddress ? 'rgb(163, 163, 163)' : activeTheme.borderColor }}
              />
              <button
                type="button"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="group h-7 px-4 border rounded-xl text-xs hover:bg-neutral-50 bg-white text-neutral-750 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                style={{ borderColor: activeTheme.borderColor }}
              >
                <span>{isEditingAddress ? 'Confirm' : 'Edit'}</span>
              </button>
            </div>
          </div>
 
          {/* Row 4: Dates with explicit label details */}
          <div className="px-6 py-2.5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>Dates</span>
            <div className="md:col-span-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Event Start Date */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-neutral-500 w-28">Event Start Date *:</span>
                  <div className="relative flex items-center w-36">
                    <input 
                      type="text"
                      readOnly
                      value={formatToDMY(eventData.startDate)}
                      className="w-full h-7 px-3 pr-9 border border-neutral-200 rounded-lg text-xs bg-neutral-50/30 text-neutral-800 font-normal focus:outline-none cursor-pointer"
                      style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                    />
                    <div className="absolute inset-0 opacity-0 cursor-pointer">
                      <input 
                        type="date"
                        value={eventData.startDate}
                        onChange={(e) => handleTextChange('startDate', e.target.value)}
                        className="w-full h-full cursor-pointer"
                      />
                    </div>
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>

                {/* Event End Date */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-neutral-500 w-28">Event End Date *:</span>
                  <div className="relative flex items-center w-36">
                    <input 
                      type="text"
                      readOnly
                      value={formatToDMY(eventData.endDate)}
                      className="w-full h-7 px-3 pr-9 border border-neutral-200 rounded-lg text-xs bg-neutral-50/30 text-neutral-800 font-normal focus:outline-none cursor-pointer"
                      style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                    />
                    <div className="absolute inset-0 opacity-0 cursor-pointer">
                      <input 
                        type="date"
                        value={eventData.endDate}
                        onChange={(e) => handleTextChange('endDate', e.target.value)}
                        className="w-full h-full cursor-pointer"
                      />
                    </div>
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Note section - styled cleanly in gray */}
              <div className="max-w-3xl p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] text-neutral-500 leading-relaxed font-sans shadow-2xs">
                <span className="font-bold uppercase tracking-wider block mb-0.5 text-[9.5px]">NOTE:</span>
                Changes to event days, days before / after event and hotel days before / after event can affect the attendance days and hotel request dates of registrations that are already configured. If the old attendance day is beyond the possible new time frame, it will be replaced with the new earliest possible attendance day. All affected registrations will be changed automatically. Please check
              </div>
            </div>
          </div>

          {/* Row 5: Attendance Days (Side-by-Side) */}
          <div className="px-6 py-2.5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>Attendance Days</span>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Before */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-500 w-24">Before Event:</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => handleIntChange('attendanceDaysBefore', -1)}
                    className="w-7 h-7 rounded bg-neutral-400 hover:bg-neutral-500 text-white font-sans font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <div 
                    className="w-14 h-7 text-center bg-neutral-50 border rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{ borderColor: activeTheme.borderColor, color: activeTheme.textColor }}
                  >
                    {eventData.attendanceDaysBefore}
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleIntChange('attendanceDaysBefore', 1)}
                    className="w-7 h-7 rounded bg-neutral-400 hover:bg-neutral-500 text-white font-sans font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* After */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-500 w-24">After Event:</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => handleIntChange('attendanceDaysAfter', -1)}
                    className="w-7 h-7 rounded bg-neutral-400 hover:bg-neutral-500 text-white font-sans font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <div 
                    className="w-14 h-7 text-center bg-neutral-50 border rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{ borderColor: activeTheme.borderColor, color: activeTheme.textColor }}
                  >
                    {eventData.attendanceDaysAfter}
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleIntChange('attendanceDaysAfter', 1)}
                    className="w-7 h-7 rounded bg-neutral-400 hover:bg-neutral-500 text-white font-sans font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 6: Hotel Days (Side-by-Side) */}
          <div className="px-6 py-2.5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>Hotel Days</span>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Before */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-500 w-24">Before Event:</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => handleIntChange('hotelDaysBefore', -1)}
                    className="w-7 h-7 rounded bg-neutral-400 hover:bg-neutral-500 text-white font-sans font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <div 
                    className="w-14 h-7 text-center bg-neutral-50 border rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{ borderColor: activeTheme.borderColor, color: activeTheme.textColor }}
                  >
                    {eventData.hotelDaysBefore}
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleIntChange('hotelDaysBefore', 1)}
                    className="w-7 h-7 rounded bg-neutral-400 hover:bg-neutral-500 text-white font-sans font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* After */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-500 w-24">After Event:</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => handleIntChange('hotelDaysAfter', -1)}
                    className="w-7 h-7 rounded bg-neutral-400 hover:bg-neutral-500 text-white font-sans font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <div 
                    className="w-14 h-7 text-center bg-neutral-50 border rounded flex items-center justify-center font-mono text-xs font-bold"
                    style={{ borderColor: activeTheme.borderColor, color: activeTheme.textColor }}
                  >
                    {eventData.hotelDaysAfter}
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleIntChange('hotelDaysAfter', 1)}
                    className="w-7 h-7 rounded bg-neutral-400 hover:bg-neutral-500 text-white font-sans font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 9: Time zone */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>Event Time Zone</span>
            <div className="md:col-span-3 relative max-w-2xl z-30">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'timezone' ? null : 'timezone')}
                className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-808 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              >
                <span className="truncate">
                  {timezoneOptions.find(o => o.value === eventData.timezone)?.label || eventData.timezone}
                </span>
                <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform" style={{ transform: activeDropdown === 'timezone' ? 'rotate(180deg)' : 'none' }} />
              </button>

              {activeDropdown === 'timezone' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div 
                    className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                    style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                  >
                    {timezoneOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          handleTextChange('timezone', opt.value);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                        style={{
                          color: activeTheme.textColor,
                          backgroundColor: eventData.timezone === opt.value ? activeTheme.backgroundColor : undefined,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 10: Event Type */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>Event Type</span>
            <div className="md:col-span-3 relative max-w-2xl z-20">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'eventType' ? null : 'eventType')}
                className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-808 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              >
                <span className="truncate">
                  {eventTypeOptions.find(o => o.value === eventData.eventType)?.label || eventData.eventType}
                </span>
                <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform" style={{ transform: activeDropdown === 'eventType' ? 'rotate(180deg)' : 'none' }} />
              </button>

              {activeDropdown === 'eventType' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div 
                    className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                    style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                  >
                    {eventTypeOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          handleTextChange('eventType', opt.value);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                        style={{
                          color: activeTheme.textColor,
                          backgroundColor: eventData.eventType === opt.value ? activeTheme.backgroundColor : undefined,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 11: Currency */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1 block" style={{ color: activeTheme.textColor }}>
              Currency
            </span>
            <div className="md:col-span-3 max-w-2xl relative z-20">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'currency' ? null : 'currency')}
                className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-808 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              >
                <span className="truncate">
                  {currencyOptions.find(o => o.value === eventData.currency)?.label || eventData.currency}
                </span>
                <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform" style={{ transform: activeDropdown === 'currency' ? 'rotate(180deg)' : 'none' }} />
              </button>

              {activeDropdown === 'currency' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div 
                    className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                    style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                  >
                    {currencyOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          handleTextChange('currency', opt.value);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                        style={{
                          color: activeTheme.textColor,
                          backgroundColor: eventData.currency === opt.value ? activeTheme.backgroundColor : undefined,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 12: Website */}
          <div className="px-6 py-2.5 grid grid-cols-1 md:grid-cols-4 gap-2">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>Website</span>
            <div className="md:col-span-3 max-w-2xl space-y-1">
              <input 
                type="text" 
                value={eventData.website}
                onChange={(e) => handleTextChange('website', e.target.value)}
                className="w-full h-7 px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-800 font-normal focus:outline-none"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                placeholder="https://example.com"
              />
              <span className="block text-[10px] text-neutral-400 font-mono">e.g. http://www.xfair.com</span>
            </div>
          </div>

          {/* Row 13: External Identifier */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>External Identifier</span>
            <div className="md:col-span-3">
              <input 
                type="text" 
                value={eventData.externalIdentifier}
                onChange={(e) => handleTextChange('externalIdentifier', e.target.value)}
                className="w-full h-7 max-w-2xl px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-800 font-normal focus:outline-none"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              />
            </div>
          </div>

          {/* Row 14: External Identifier Code */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>External Identifier Code</span>
            <div className="md:col-span-3">
              <input 
                type="text" 
                value={eventData.externalIdentifierCode}
                onChange={(e) => handleTextChange('externalIdentifierCode', e.target.value)}
                className="w-full h-7 max-w-2xl px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-800 font-normal focus:outline-none"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              />
            </div>
          </div>

          {/* Row 15: Active */}
          <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>Active</span>
            <div className="md:col-span-3 flex items-center">
              <button
                type="button"
                onClick={() => handleTextChange('active', !eventData.active)}
                className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                style={{ backgroundColor: eventData.active ? activeTheme.primaryColor : '#E5E7EB' }}
              >
                <span
                  className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                  style={{ transform: eventData.active ? 'translateX(16px)' : 'translateX(0px)' }}
                />
              </button>
            </div>
          </div>

          {/* Row 16: Image Asset Selection & logo representation */}
          <div className="px-6 py-2.5 grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1 pt-1.5" style={{ color: activeTheme.textColor }}>Image</span>
            <div className="md:col-span-3 max-w-2xl space-y-3">
              {/* Clean rendering of the brand logo block as requested */}
              <div className="p-3 bg-neutral-100 rounded-xl border max-w-xs flex items-center justify-center" style={{ borderColor: activeTheme.borderColor }}>
                <img 
                  src="/Logo/ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png"
                  alt="XFAIR Logo"
                  className="w-[210px] h-[70px] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Selector dropdown for matching image upload state files */}
              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'image' ? null : 'image')}
                  className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-808 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                  style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                >
                  <span className="truncate">
                    {imageOptions.find(o => o.value === eventData.image)?.label || eventData.image}
                  </span>
                  <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform" style={{ transform: activeDropdown === 'image' ? 'rotate(180deg)' : 'none' }} />
                </button>

                {activeDropdown === 'image' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                    <div 
                      className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                      style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                    >
                      {imageOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            handleTextChange('image', opt.value);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                          style={{
                            color: activeTheme.textColor,
                            backgroundColor: eventData.image === opt.value ? activeTheme.backgroundColor : undefined,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Row 17: PDF summary mail block */}
          <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>PDF Summary Mail</span>
            <div className="md:col-span-3 max-w-2xl">
              {!pdfSummaryFile ? (
                <button
                  type="button"
                  onClick={() => handleFileUpload('summary')}
                  className="w-full h-11 border border-dashed rounded-xl px-4 flex items-center justify-between text-xs font-sans transition-all cursor-pointer hover:bg-neutral-50/50"
                  style={{ borderColor: activeTheme.borderColor || 'rgba(0,0,0,0.1)' }}
                >
                  <div className="flex items-center gap-2 text-neutral-808">
                    <Paperclip className="w-4 h-4 text-orange-500" style={{ color: activeTheme.primaryColor || '#f89728' }} />
                    <span className="font-semibold text-neutral-700">Click to attach PDF summary</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">max. 16 MB</span>
                </button>
              ) : (
                <div 
                  className="w-full h-11 border rounded-xl px-4 flex items-center justify-between text-xs font-sans"
                  style={{ 
                    borderColor: (activeTheme.primaryColor || '#f89728') + '40',
                    backgroundColor: (activeTheme.primaryColor || '#f89728') + '08'
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4" style={{ color: activeTheme.primaryColor }} />
                    <span className="font-bold text-neutral-800 truncate" style={{ color: activeTheme.textColor }}>
                      {pdfSummaryFile.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">
                      ({pdfSummaryFile.size})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPdfSummaryFile(null)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-500 cursor-pointer"
                    title="Remove PDF"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Row 18: PDF template for hotel booking */}
          <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>PDF Template For Hotel Booking</span>
            <div className="md:col-span-3 max-w-2xl">
              {!pdfHotelFile ? (
                <button
                  type="button"
                  onClick={() => handleFileUpload('hotel')}
                  className="w-full h-11 border border-dashed rounded-xl px-4 flex items-center justify-between text-xs font-sans transition-all cursor-pointer hover:bg-neutral-50/50"
                  style={{ borderColor: activeTheme.borderColor || 'rgba(0,0,0,0.1)' }}
                >
                  <div className="flex items-center gap-2 text-neutral-808">
                    <Paperclip className="w-4 h-4 text-orange-500" style={{ color: activeTheme.primaryColor || '#f89728' }} />
                    <span className="font-semibold text-neutral-700">Click to attach PDF hotel booking template</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">max. 16 MB</span>
                </button>
              ) : (
                <div 
                  className="w-full h-11 border rounded-xl px-4 flex items-center justify-between text-xs font-sans"
                  style={{ 
                    borderColor: (activeTheme.primaryColor || '#f89728') + '40',
                    backgroundColor: (activeTheme.primaryColor || '#f89728') + '08'
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4" style={{ color: activeTheme.primaryColor }} />
                    <span className="font-bold text-neutral-800 truncate" style={{ color: activeTheme.textColor }}>
                      {pdfHotelFile.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">
                      ({pdfHotelFile.size})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPdfHotelFile(null)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-500 cursor-pointer"
                    title="Remove template"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      {/* Create Registrations Sections (Split into two cards) */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-neutral-800 font-sans px-1 animate-fadeIn" style={{ color: activeTheme.textColor }}>
          Create Registrations
        </h3>

        {/* Panel 1: Setup Option Panel */}
        <div 
          className="bg-white rounded-2xl border shadow-xs overflow-hidden"
          style={{ 
            backgroundColor: activeTheme.cardColor, 
            borderColor: activeTheme.borderColor 
          }}
        >
          <div className="p-4 px-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {/* Option Choice button pairs */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-neutral-700 tracking-wider font-sans" style={{ color: activeTheme.textColor }}>Setup Option</span>
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => setNewRegMode('New')}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    <div 
                      className="w-4 h-4 rounded-full border flex items-center justify-center transition-all bg-white"
                      style={{ 
                        borderColor: newRegMode === 'New' ? activeTheme.primaryColor : activeTheme.borderColor,
                        borderWidth: newRegMode === 'New' ? '2px' : '1px'
                      }}
                    >
                      {newRegMode === 'New' && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                        />
                      )}
                    </div>
                    <span className="text-xs font-semibold font-sans text-neutral-700 hover:text-neutral-900 transition-colors" style={{ color: activeTheme.textColor }}>New</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRegMode('Template')}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    <div 
                      className="w-4 h-4 rounded-full border flex items-center justify-center transition-all bg-white"
                      style={{ 
                        borderColor: newRegMode === 'Template' ? activeTheme.primaryColor : activeTheme.borderColor,
                        borderWidth: newRegMode === 'Template' ? '2px' : '1px'
                      }}
                    >
                      {newRegMode === 'Template' && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                        />
                      )}
                    </div>
                    <span className="text-xs font-semibold font-sans text-neutral-700 hover:text-neutral-900 transition-colors" style={{ color: activeTheme.textColor }}>Clone from template</span>
                  </button>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block w-px h-5 bg-neutral-200" style={{ backgroundColor: activeTheme.borderColor }} />

              {/* Target Domain Role text & styled dropdown */}
              <div className="flex items-center gap-3 relative z-30">
                <span className="text-xs font-bold text-neutral-700 tracking-wider font-sans" style={{ color: activeTheme.textColor }}>Target Domain Role</span>
                <div className="relative w-44">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'selectedRegType' ? null : 'selectedRegType')}
                    className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-808 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                    style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                  >
                    <span className="truncate">{selectedRegType}</span>
                    <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform" style={{ transform: activeDropdown === 'selectedRegType' ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  {activeDropdown === 'selectedRegType' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                      <div 
                        className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                        style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                      >
                        {['Employee', 'Visitor', 'VIP customer', 'Exhibitor'].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSelectedRegType(opt);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                            style={{
                              color: activeTheme.textColor,
                              backgroundColor: selectedRegType === opt ? activeTheme.backgroundColor : undefined,
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Styled Insert button exactly identical to Create Event Insert option */}
            <button
              type="button"
              onClick={() => handleInsertRegistration()}
              className="group h-7 px-4 border rounded-xl text-xs hover:bg-neutral-50 bg-white text-neutral-750 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
              style={{ borderColor: activeTheme.borderColor }}
            >
              <Plus className="w-4.5 h-4.5 text-neutral-400 group-hover:text-neutral-750 transition-colors" />
              <span>Insert</span>
            </button>
          </div>
        </div>

        {/* Panel 2: Registration list card panel */}
        <div 
          className="bg-white rounded-2xl border shadow-xs overflow-hidden"
          style={{ 
            backgroundColor: activeTheme.cardColor, 
            borderColor: activeTheme.borderColor 
          }}
        >
          {/* Title bar representing "Available Registrations" in Title Case */}
          <div className="px-5 py-2 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
            <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
              Available Registrations
            </h3>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex flex-col gap-2.5">
              {eventData.availableRegistrations.map((reg, index) => (
                <div 
                  key={index}
                  className="h-8 px-2.5 rounded-lg flex items-center justify-between gap-2.5 border text-[11px] font-sans transition-all hover:bg-neutral-50/50"
                  style={{ borderColor: activeTheme.borderColor }}
                >
                  <span 
                    className="font-semibold block truncate" 
                    style={{ 
                      color: activeTheme.textColor,
                      fontFamily: activeTheme.fontFamily 
                    }}
                  >
                    {reg}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRegistration(index)}
                    className="w-5 h-5 rounded-md flex items-center justify-center transition-all bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-500 cursor-pointer flex-shrink-0"
                    title="Remove registration"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))}
              {eventData.availableRegistrations.length === 0 && (
                <div className="text-center py-8 text-neutral-410 text-xs italic bg-neutral-50/15 border border-dashed rounded-xl" style={{ borderColor: activeTheme.borderColor }}>
                  No active registrations configured in list.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

        </div> {/* closing Left Column xl:col-span-9 wrapper div */}

        {/* Right Side: Interactive Event configuration */}
        {isConfigExpanded && (
          <div className="xl:col-span-3 space-y-6 transition-all duration-300">
            
            <div 
              className="bg-white rounded-2xl border p-4.5 shadow-sm transition-all border-l-[3.5px]" 
              style={{ 
                backgroundColor: activeTheme.cardColor, 
                borderColor: activeTheme.borderColor,
                borderLeftColor: activeTheme.primaryColor 
              }}
            >
              {/* Title Block - Reduced height settings appearance */}
              <div className="border-b pb-3 mb-3 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
                <div className="flex items-center gap-2 min-w-0">
                  <Settings className="w-4 h-4 flex-shrink-0" style={{ color: activeTheme.primaryColor }} />
                  <span className="text-xs font-bold tracking-wider font-sans whitespace-nowrap truncate" style={{ color: activeTheme.textColor }}>
                    Event Configuration
                  </span>
                </div>
                
                {/* Collapse button */}
                <button
                  type="button"
                  onClick={() => setIsConfigExpanded(false)}
                  className="p-1 rounded bg-neutral-50 hover:bg-neutral-150 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                  title="Collapse side panel"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            {/* Interactive Categorized Directories list */}
            <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
              {(() => {
                const CONFIG_CATEGORIES = [
                  {
                    category: 'Core Event Setup',
                    icon: Settings,
                    links: [
                      { label: 'Client Manager', id: 'client-manager-conf' },
                      { label: 'Event Module Manager', id: 'event-module-manager-conf' },
                      { label: 'Event Fields Manager', id: 'fields-manager' }
                    ]
                  },
                  {
                    category: 'Criteria & Registration Data',
                    icon: Tag,
                    links: [
                      { label: 'Event Criteria Manager', id: 'criteria-manager' },
                      { label: 'Criteria Group Manager', id: 'criteria-value-limits' }
                    ]
                  },
                  {
                    category: 'Access & Permissions',
                    icon: ShieldCheck,
                    links: [
                      { label: 'Event Permissions', id: 'rights' },
                      { label: 'Access Control Manager', id: 'access-control-manager' }
                    ]
                  },
                  {
                    category: 'Communication',
                    icon: Mail,
                    links: [
                      { label: 'Email Addresses Manager', id: 'email-addresses-manager' },
                      { label: 'Email Templates', id: 'email-templates' }
                    ]
                  },
                  {
                    category: 'Reporting & Content',
                    icon: FileText,
                    links: [
                      { label: 'Visitor Report Templates', id: 'visitor-report-templates' },
                      { label: 'Dynamic Page Content Manager', id: 'person-report-configuration' }
                    ]
                  },
                  {
                    category: 'Billing & Finance',
                    icon: DollarSign,
                    links: [
                      { label: 'Event Taxes', id: 'sales-locations' },
                      { label: 'Event Invoices Manager', id: 'sales-orders-overview' },
                      { label: 'Event Wallet', id: 'sales-price-categories' }
                    ]
                  },
                  {
                    category: 'Devices & Physical Assets',
                    icon: Key,
                    links: [
                      { label: 'Mobile Phones', id: 'mobile-phones' },
                      { label: 'Locker Keys', id: 'locker-keys' }
                    ]
                  },
                  {
                    category: 'Integration & External APIs',
                    icon: Globe,
                    links: [
                      { label: 'Event API Manager', id: 'event-api-manager' }
                    ]
                  }
                ];

                return CONFIG_CATEGORIES.map((group, gIdx) => {
                  const GroupIcon = group.icon;
                  return (
                    <div key={gIdx} className="space-y-1.5">
                       <div className="flex items-center gap-1.5 px-0.5 pt-1">
                        <GroupIcon className="w-3 h-3 text-neutral-400" />
                        <span className="text-[10px] font-bold text-neutral-400 tracking-wider font-sans">
                          {group.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-1">
                        {group.links.map((link, lIdx) => {
                          const isActive = link.label === 'Client Manager';
                          return (
                            <div
                              key={lIdx}
                              className="h-7 px-2.5 rounded-lg flex items-center justify-between gap-2.5 border text-[11px] font-sans transition-all cursor-default"
                              style={{ 
                                borderColor: isActive ? activeTheme.primaryColor + '40' : activeTheme.borderColor,
                                backgroundColor: isActive ? activeTheme.primaryColor + '0d' : 'transparent',
                              }}
                            >
                              <div className="flex-1 min-w-0">
                                <span 
                                  className="font-semibold block truncate" 
                                  style={{ 
                                    color: isActive ? activeTheme.primaryColor : activeTheme.textColor,
                                    fontFamily: activeTheme.fontFamily 
                                  }}
                                >
                                  {link.label}
                                </span>
                              </div>
                              <ChevronRight 
                                className="w-3 h-3 flex-shrink-0"
                                style={{ 
                                  color: isActive ? activeTheme.primaryColor : '#cbd5e1'
                                }} 
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

          </div>

        </div>
        )} {/* closing Right Column xl:col-span-3 wrapper section */}

      </div> {/* closing Core Dual-Column Bento Workspace wrapper div */}

      {/* Floating vertical sidebar tab when collapsed */}
      {!isConfigExpanded && (
        <div 
          onClick={() => setIsConfigExpanded(true)}
          className="fixed right-0 top-[280px] z-50 shadow-md select-none cursor-pointer flex flex-col items-center py-5 px-1.5 rounded-l-xl transition-all duration-300 hover:pr-3.5"
          style={{ backgroundColor: activeTheme.primaryColor }}
          title="Expand Event Configuration"
        >
          <ChevronRight className="w-4 h-4 text-white mb-2 rotate-180" />
          <span className="[writing-mode:vertical-lr] text-white font-sans uppercase tracking-[0.16em] text-[10px] font-bold select-none whitespace-nowrap">
            Event Configuration
          </span>
        </div>
      )}

      {/* Floating Save Status */}
      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 px-6 py-3.5 bg-emerald-600 text-white rounded-xl shadow-2xl flex items-center gap-3 z-50 text-xs font-semibold"
          >
            <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
            <span>{saveMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
