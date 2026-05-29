/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Calendar, Sliders, FolderOpen, DollarSign, BarChart3, 
  Hotel, ShoppingBag, Radio, Laptop, Shield, Settings, Menu, X, 
  LogOut, ChevronDown, Search, User, QrCode, ClipboardList, 
  RefreshCw, Check, CheckCircle2, UserPlus, Fingerprint, Scan, AlertCircle, Eye, Info, CreditCard
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  activeTheme: ThemeConfig;
  onLogout: () => void;
  // Dynamic employee profile link inside App
  onAddEmployeeMock?: (name: string, email: string, functionRole: string) => void;
}

export interface SubmenuItem {
  id: string;
  label: string;
}

export interface SidebarCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items: SubmenuItem[];
}

function toTitleCase(str: string): string {
  if (!str) return str;
  const lowercasePrepositions = ['from', 'and', 'by', 'of', 'to', 'in', 'on', 'with', 'at'];
  return str
    .split(' ')
    .map((word, index) => {
      if (!word) return '';
      const lower = word.toLowerCase();
      if (index > 0 && lowercasePrepositions.includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export function Sidebar({ activePage, onNavigate, activeTheme, onLogout, onAddEmployeeMock }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  
  // Accordion expanded categories map
  const [expandedCats, setExpandedCats] = useState<{ [id: string]: boolean }>({
    'event-info': true,
    'schedule': false,
    'configuration': false,
    'resources': false,
    'sales': false,
    'reporting': false,
    'hotel': false,
    'orders': false,
    'services': false,
    'devices': false,
    'admin-functions': false,
    'technicians': false
  });

  // GENERAL SEARCH CONTROLS (from legacy sidebar)
  const [activeTab, setActiveTab] = useState<'employee' | 'stands' | 'roles'>('employee');
  const [searchName, setSearchName] = useState('');
  const [searchPostCode, setSearchPostCode] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedFunction, setSelectedFunction] = useState('ALL');
  const [selectedCriteria, setSelectedCriteria] = useState('ALL');
  const [selectedStandCriteria, setSelectedStandCriteria] = useState('ALL');
  const [selectedAccessPrivilege, setSelectedAccessPrivilege] = useState('ALL');

  // Company Search states (stands)
  const [companyFilter, setCompanyFilter] = useState<'All' | 'Employee' | 'Visitor'>('All');
  const [newCompany, setNewCompany] = useState({ companyName: '', industry: 'Technology', country: 'Germany' });

  // Visitor Search states (roles - customized)
  const [searchVisitorName, setSearchVisitorName] = useState('');
  const [searchVisitorCompany, setSearchVisitorCompany] = useState('');
  const [selectedVisitorStatus, setSelectedVisitorStatus] = useState('ALL');
  const [selectedVisitorCategory, setSelectedVisitorCategory] = useState('ALL');
  const [selectedVisitorArea, setSelectedVisitorArea] = useState('ALL');

  // Custom dropdown open state
  const [activeDropdown, setActiveDropdown] = useState<'status' | 'function' | 'criteria' | 'stands-criteria' | 'roles-privileges' | 'visitor-status' | 'visitor-category' | 'visitor-area' | null>(null);

  const statusOptions = [
    { value: 'ALL', label: 'Select Status' },
    { value: 'Present', label: 'Present' },
    { value: 'Beer garden (break)', label: 'Beer garden (break)' },
    { value: 'Fair walk / other booth', label: 'Fair walk / other booth' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Beer garden (customer)', label: 'Beer garden (customer)' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Absent', label: 'Absent' },
    { value: 'Day end', label: 'Day end' },
    { value: 'End of event', label: 'End of event' },
    { value: 'Not present', label: 'Not present' }
  ];

  const functionOptions = [
    { value: 'ALL', label: 'Select Function' },
    { value: 'Customer care', label: 'Customer care' },
    { value: 'Info desk', label: 'Info desk' },
    { value: 'Stand person', label: 'Stand person' }
  ];

  const criteriaOptions = [
    { value: 'ALL', label: 'Select Criteria' },
    { value: 'Areas', label: 'Areas' },
    { value: 'Business unit', label: 'Business unit' },
    { value: 'Company function', label: 'Company function' },
    { value: 'Country responsibility', label: 'Country responsibility' },
    { value: 'Employee department criteria', label: 'Employee department criteria' },
    { value: 'Executives', label: 'Executives' },
    { value: 'Food preferences', label: 'Food preferences' },
    { value: 'Industry segment', label: 'Industry segment' },
    { value: 'Languages', label: 'Languages' },
    { value: 'Product group', label: 'Product group' },
    { value: 'Products', label: 'Products' }
  ];

  const privilegeOptions = [
    { value: 'ALL', label: 'Select Access Privileges' },
    { value: 'Global Admin', label: 'Global Admin' },
    { value: 'Regional Coordinator', label: 'Regional Coordinator' },
    { value: 'Booth Technician', label: 'Booth Technician' }
  ];

  // Specific Visitor Search Lists
  const visitorStatusOptions = [
    { value: 'ALL', label: 'Select Status' },
    { value: 'Pre-Registered', label: 'Pre-Registered' },
    { value: 'Checked In', label: 'Checked In' },
    { value: 'Checked Out', label: 'Checked Out' },
    { value: 'Absent', label: 'Absent' }
  ];

  const visitorCategoryOptions = [
    { value: 'ALL', label: 'Select Category' },
    { value: 'VIP', label: 'VIP' },
    { value: 'Press', label: 'Press' },
    { value: 'Guest', label: 'Guest' },
    { value: 'Contractor', label: 'Contractor' },
    { value: 'Partner', label: 'Partner' }
  ];

  const visitorAreaOptions = [
    { value: 'ALL', label: 'Select Area' },
    { value: 'Exhibition Hall', label: 'Exhibition Hall' },
    { value: 'Conference Rooms', label: 'Conference Rooms' },
    { value: 'VIP Lounge', label: 'VIP Lounge' }
  ];

  // MODAL SIMULATOR STATES
  const [activeModal, setActiveModal] = useState<'scan-card' | 'scan-schema' | 'new-employee' | 'new-company' | null>(null);
  
  // New Employee mini-form state
  const [newEmp, setNewEmp] = useState({ name: '', email: '', role: 'Security' });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const toggleCategory = (catId: string) => {
    setExpandedCats(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // FULL ENTERPRISE SUITE STRUCTURAL MAP (Match the exact prompt specifications)
  const categories: SidebarCategory[] = useMemo(() => [
    {
      id: 'event-info',
      label: 'Event Info',
      icon: Building2,
      items: [
        { id: 'general-information', label: 'General Information' },
        { id: 'event-criteria-values', label: 'Event criteria values' },
        { id: 'agenda-manager', label: 'Agenda manager' },
        { id: 'agenda-items', label: 'Agenda items' },
        { id: 'agenda-templates', label: 'Agenda templates' },
        { id: 'checklist', label: 'Checklist' },
        { id: 'checklist-items', label: 'Checklist items' },
        { id: 'check-in-status', label: 'Check In Status' },
        { id: 'service-order-checkin', label: 'Service Order Checkin' },
        { id: 'print-namebadge', label: 'Print Namebadge from QRCode' }
      ]
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      items: [
        { id: 'demo-room', label: 'Demo room' },
        { id: 'restaurant', label: 'Restaurant' },
        { id: 'meeting-room-booking-search', label: 'Meeting room booking search' },
        { id: 'meeting-rooms-manager', label: 'Meeting rooms manager' },
        { id: 'meeting-room-groups-manager', label: 'Meeting room groups manager' },
        { id: 'seating-planner-manager', label: 'Seating planner manager' }
      ]
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: Sliders,
      items: [
        { id: 'event-manager-conf', label: 'Event manager' },
        { id: 'criteria-manager', label: 'Criteria Manager' },
        { id: 'criteria-value-manager', label: 'Criteria value manager' },
        { id: 'criteria-value-limits', label: 'Criteria Value Limits' },
        { id: 'theme-settings', label: 'Theme Manager' },
        { id: 'message-templates', label: 'Message templates' },
        { id: 'email-templates', label: 'Email templates' },
        { id: 'lead-wizard-manager', label: 'Lead wizard manager' },
        { id: 'dialing-rules', label: 'Dialing rules' },
        { id: 'mobile-apps-manager-conf', label: 'Mobile apps manager' },
        { id: 'system-manager-conf', label: 'System manager' },
        { id: 'person-report-configuration', label: 'Person Report Configuration' }
      ]
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: FolderOpen,
      items: [
        { id: 'images-res', label: 'Images' },
        { id: 'attachment-manager', label: 'Attachment manager' },
        { id: 'module-manager', label: 'Module manager' },
        { id: 'fields-manager', label: 'Fields manager' },
        { id: 'visitor-report-templates', label: 'Visitor report templates' },
        { id: 'resource-editor', label: 'Resource editor' },
        { id: 'languages', label: 'Languages' },
        { id: 'look-up-values-manager', label: 'Look-up values manager' },
        { id: 'countries', label: 'Countries' },
        { id: 'rights', label: 'Rights' },
        { id: 'report-types-manager', label: 'Report types manager' }
      ]
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: DollarSign,
      items: [
        { id: 'product-types', label: 'Product types' },
        { id: 'products', label: 'Products' },
        { id: 'sales-price-categories', label: 'Sales price categories' },
        { id: 'sales-locations', label: 'Sales locations' },
        { id: 'sales-printers', label: 'Sales printers' },
        { id: 'event-products', label: 'Event products' },
        { id: 'event-prices', label: 'Event prices' },
        { id: 'sales-orders-overview', label: 'Sales orders overview' },
        { id: 'sales-orders-search', label: 'Sales orders search' }
      ]
    },
    {
      id: 'reporting',
      label: 'Reporting',
      icon: BarChart3,
      items: [
        { id: 'event-reports', label: 'Event reports' },
        { id: 'system-reports', label: 'System reports' },
        { id: 'visitor-reports-overview', label: 'Visitor reports overview' },
        { id: 'visitor-statistics-overview', label: 'Visitor statistics overview' },
        { id: 'photo-overview', label: 'Photo overview' }
      ]
    },
    {
      id: 'hotel',
      label: 'Hotel',
      icon: Hotel,
      items: [
        { id: 'hotel-manager', label: 'Hotel manager' },
        { id: 'hotel-facilities-manager', label: 'Hotel facilities manager' },
        { id: 'hotel-activation', label: 'Hotel activation' },
        { id: 'hotel-booking-search', label: 'Hotel booking search' },
        { id: 'hotel-booking-overview', label: 'Hotel booking overview' },
        { id: 'hotel-request-overview', label: 'Hotel request overview' }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      items: [
        { id: 'order-types', label: 'Order types' },
        { id: 'order-item-attributes', label: 'Order item attributes' },
        { id: 'orders-search', label: 'Orders search' },
        { id: 'orders-seating-planner', label: 'Orders seating planner' },
        { id: 'return-tickets', label: 'Return tickets' }
      ]
    },
    {
      id: 'services',
      label: 'Services',
      icon: Radio,
      items: [
        { id: 'service-groups-manager', label: 'Service groups manager' },
        { id: 'event-services-manager', label: 'Event services manager' },
        { id: 'service-orders-search', label: 'Service orders search' },
        { id: 'service-orders-overview', label: 'Service orders overview' }
      ]
    },
    {
      id: 'devices',
      label: 'Devices Manager',
      icon: Laptop,
      items: [
        { id: 'assign-devices-by-scanner', label: 'Assign devices by scanner' },
        { id: 'mobile-phones', label: 'Mobile phones' },
        { id: 'locker-keys', label: 'Locker keys' }
      ]
    },
    {
      id: 'admin-functions',
      label: 'Admin Functions',
      icon: Shield,
      items: [
        { id: 'personal-system-log', label: 'Personal system log' },
        { id: 'system-log-search', label: 'System log search' },
        { id: 'database-search', label: 'Database search' },
        { id: 'message-search', label: 'Message search' },
        { id: 'log-error-search', label: 'Log Error Search' },
        { id: 'groups-search', label: 'Groups search' },
        { id: 'grouping-headers-manager', label: 'Grouping headers manager' },
        { id: 'matching', label: 'Matching' },
        { id: 'grouping', label: 'Grouping font' },
        { id: 'login-problems', label: 'Login problems' },
        { id: 'system-processing', label: 'System processing' },
        { id: 'administrative-tasks', label: 'Administrative tasks' },
        { id: 'data-import', label: 'Data import' },
        { id: 'registration-approval', label: 'Registration approval' },
        { id: 'task-scheduler', label: 'Task scheduler' },
        { id: 'global-coordinator-configuration', label: 'Global coordinator configuration' },
        { id: 'coordinator-approval', label: 'Coordinator approval' },
        { id: 'admin-upload-page', label: 'Admin Upload Page' }
      ]
    },
    {
      id: 'technicians',
      label: 'Technicians',
      icon: Settings,
      items: [
        { id: 'tech-admin-upload-page', label: 'Admin Upload Page' },
        { id: 'tech-sales-locations', label: 'Sales locations' },
        { id: 'tech-sales-printers', label: 'Sales printers' },
        { id: 'tech-dialing-rules', label: 'Dialing rules' },
        { id: 'tech-mobile-apps-manager', label: 'Mobile apps manager' },
        { id: 'tech-system-manager', label: 'System manager' },
        { id: 'tech-event-configuration', label: 'Event configuration' },
        { id: 'tech-client-manager', label: 'Client manager' },
        { id: 'tech-access-control-manager', label: 'Access control manager' }
      ]
    }
  ], []);

  // ---------------- SEARCH INSIDE NAVIGATION ----------------
  const filteredCategories = useMemo(() => {
    if (!navSearch.trim()) return categories;
    return categories.map(cat => {
      const filteredItems = cat.items.filter(item => 
        item.label.toLowerCase().includes(navSearch.toLowerCase())
      );
      if (filteredItems.length > 0) {
        return { ...cat, items: filteredItems };
      }
      return null;
    }).filter(Boolean) as SidebarCategory[];
  }, [navSearch, categories]);

  // Expand categories during filter
  React.useEffect(() => {
    if (navSearch.trim()) {
      const keysToExpand = filteredCategories.reduce((acc, cat) => {
        acc[cat.id] = true;
        return acc;
      }, {} as { [id: string]: boolean });
      setExpandedCats(keysToExpand);
    }
  }, [navSearch, filteredCategories]);

  // ---------------- SIMULATOR HANDLERS ----------------
  const triggerScanCard = () => {
    setActiveModal('scan-card');
    setModalLoading(true);
    setModalSuccess(false);
    setTimeout(() => {
      setModalLoading(false);
      setModalSuccess(true);
    }, 2200);
  };

  const triggerScanSchema = () => {
    setActiveModal('scan-schema');
    setModalLoading(true);
    setModalSuccess(false);
    setTimeout(() => {
      setModalLoading(false);
      setModalSuccess(true);
    }, 2000);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email) return;
    setModalLoading(true);
    setTimeout(() => {
      setModalLoading(false);
      setModalSuccess(true);
      if (onAddEmployeeMock) {
        onAddEmployeeMock(newEmp.name, newEmp.email, newEmp.role);
      }
      setTimeout(() => {
        setActiveModal(null);
        setNewEmp({ name: '', email: '', role: 'Security' });
        onNavigate('employee-profile');
      }, 1500);
    }, 1500);
  };

  return (
    <>
      <aside 
        className={`h-screen sticky top-0 border-r flex flex-col justify-between transition-all duration-300 z-30 select-none ${
          isCollapsed ? 'w-16' : 'w-72'
        }`}
        style={{
          backgroundColor: '#1E1E24', // Modern Obsidian Charcoal Canvas
          borderColor: activeTheme.borderColor,
          fontFamily: activeTheme.fontFamily
        }}
      >
        {/* BRAND TOP ROW */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="pt-1.5 pb-2 px-3 flex flex-col items-center border-b border-white/5 bg-black/15 relative">
            {!isCollapsed ? (
              <div className="flex flex-col items-center py-0">
                <img 
                  src="/Logo/ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png"
                  alt="XFAIR Logo"
                  className="w-[210px] h-[70px] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div 
                className="w-10 h-10 rounded-lg mx-auto flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors overflow-hidden"
                onClick={() => setIsCollapsed(false)}
              >
                <img 
                  src="/Logo/ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png"
                  alt="Logo"
                  className="h-8 w-8 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            
            <button 
              type="button" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute right-2 top-2 p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white cursor-pointer transition-colors"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* REAL PRESETS COGNITIVE COMPACT/EXPAND FILTER PANEL (Top Half matching screenshots) */}
          {!isCollapsed && (
            <div 
              className="mx-3 mt-1.5 mb-2.5 p-3 rounded-2xl space-y-2.5 border shadow-xl transition-all duration-300"
              style={{
                backgroundColor: activeTheme.backgroundColor,
                borderColor: activeTheme.borderColor,
              }}
            >
              {/* Compact title headers indicating distinct tool zone */}
              <div className="flex items-center justify-between px-1 pb-1 border-b" style={{ borderColor: activeTheme.borderColor }}>
                <span className="text-[10px] font-bold tracking-widest" style={{ color: activeTheme.textColor }}>General</span>
              </div>
 
              {/* Scope Segment Tabs */}
              <div 
                className="grid grid-cols-3 gap-1 p-0.5 rounded-xl border"
                style={{
                  backgroundColor: activeTheme.cardColor,
                  borderColor: activeTheme.borderColor,
                }}
              >
                {(['employee', 'stands', 'roles'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setActiveDropdown(null);
                    }}
                    className={`py-1 rounded-lg text-[10px] font-semibold flex flex-col items-center justify-center hover:opacity-90 transition-all cursor-pointer gap-0.5 ${
                      activeTab === tab 
                        ? 'text-white shadow-xs font-extrabold' 
                        : 'border border-transparent hover:bg-neutral-100/50'
                    }`}
                    style={{
                      color: activeTab === tab ? '#ffffff' : activeTheme.textColor,
                      backgroundColor: activeTab === tab ? activeTheme.primaryColor : undefined,
                    }}
                  >
                    {tab === 'employee' && (
                      <>
                        <User className="w-3.5 h-3.5" style={{ color: activeTab === tab ? '#ffffff' : '#64748b' }} />
                        <span className="text-[8.5px]">Employee</span>
                      </>
                    )}
                    {tab === 'stands' && (
                      <>
                        <Building2 className="w-3.5 h-3.5" style={{ color: activeTab === tab ? '#ffffff' : '#64748b' }} />
                        <span className="text-[8.5px]">Company</span>
                      </>
                    )}
                    {tab === 'roles' && (
                      <>
                        <Fingerprint className="w-3.5 h-3.5" style={{ color: activeTab === tab ? '#ffffff' : '#64748b' }} />
                        <span className="text-[8.5px]">Visitor</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
  
              {/* Dynamic input filters by Active Segment with consistent 7px spacing */}
              <div className="flex flex-col gap-[7px]">
                {/* Always render Employee (tab 1) input content directly */}
                <>
                    {/* Name search row with inline absolute search icon inside input field */}
                    <div className="relative flex items-center h-7">
                      <input
                        type="text"
                        placeholder="Name..."
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                        className="w-full pl-2.5 pr-8 rounded-lg border text-[10.5px] placeholder-neutral-500 font-sans font-medium focus:outline-none focus:ring-1 focus:ring-neutral-400 h-7"
                        style={{
                          backgroundColor: activeTheme.cardColor,
                          borderColor: activeTheme.borderColor,
                          color: activeTheme.textColor,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (searchName.trim()) {
                            onNavigate('employee-profile');
                          }
                        }}
                        className="absolute right-1.5 p-1 hover:opacity-85 cursor-pointer focus:outline-none flex items-center justify-center w-5 h-5 rounded-md"
                        title="Search name"
                      >
                        <Search className="w-3 h-3 text-neutral-400" />
                      </button>
                    </div>
 
                    {/* Compact inputs row: Postcode & Status column layout for readability */}
                    <div className="grid grid-cols-[4fr_6fr] gap-1.5 h-7">
                      {/* Postcode */}
                      <div>
                        <input
                          type="text"
                          placeholder="Postcode"
                          value={searchPostCode}
                          onChange={e => setSearchPostCode(e.target.value)}
                          className="w-full px-2.5 rounded-lg border text-[10.5px] placeholder-neutral-500 font-medium h-7 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          style={{
                            backgroundColor: activeTheme.cardColor,
                            borderColor: activeTheme.borderColor,
                            color: activeTheme.textColor,
                          }}
                        />
                      </div>
 
                      {/* Selector Status */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
                          className={`w-full flex items-center justify-between px-2.5 rounded-lg border text-[10.5px] focus:outline-none cursor-pointer transition-all font-sans h-7 ${
                            selectedStatus === 'ALL' ? 'text-neutral-500 font-medium' : 'text-neutral-800 font-semibold'
                          }`}
                          style={{
                            backgroundColor: activeTheme.cardColor,
                            borderColor: activeTheme.borderColor,
                          }}
                        >
                          <span className="truncate">
                            {statusOptions.find(o => o.value === selectedStatus)?.label || 'Select Status'}
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 transition-transform duration-200" />
                        </button>
 
                        <AnimatePresence>
                          {activeDropdown === 'status' && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.12 }}
                              className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-lg shadow-xl z-50 py-1 text-[10px] custom-sidebar-scrollbar"
                              style={{
                                backgroundColor: activeTheme.cardColor,
                                borderColor: activeTheme.borderColor,
                              }}
                            >
                              {statusOptions.map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedStatus(opt.value);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer block truncate text-xs font-sans"
                                  style={{
                                    color: activeTheme.textColor,
                                    backgroundColor: selectedStatus === opt.value ? activeTheme.backgroundColor : undefined,
                                  }}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
 
                    {/* Row 3: Selector Function (Full width for maximum readability) */}
                    <div className="relative h-7">
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === 'function' ? null : 'function')}
                        className={`w-full flex items-center justify-between px-2.5 rounded-lg border text-[10.5px] focus:outline-none cursor-pointer transition-all font-sans h-7 ${
                          selectedFunction === 'ALL' ? 'text-neutral-500 font-medium' : 'text-neutral-800 font-semibold'
                        }`}
                        style={{
                          backgroundColor: activeTheme.cardColor,
                          borderColor: activeTheme.borderColor,
                        }}
                      >
                        <span className="truncate">
                          {functionOptions.find(o => o.value === selectedFunction)?.label || 'Select Function'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 transition-transform duration-200" />
                      </button>
 
                      <AnimatePresence>
                        {activeDropdown === 'function' && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-lg shadow-xl z-50 py-1 text-[10px] custom-sidebar-scrollbar"
                            style={{
                              backgroundColor: activeTheme.cardColor,
                              borderColor: activeTheme.borderColor,
                            }}
                          >
                            {functionOptions.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setSelectedFunction(opt.value);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer block truncate text-xs font-sans"
                                style={{
                                  color: activeTheme.textColor,
                                  backgroundColor: selectedFunction === opt.value ? activeTheme.backgroundColor : undefined,
                                }}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
 
                    {/* Row 4: Selector Criteria (Full width for maximum readability) */}
                    <div className="relative h-7">
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === 'criteria' ? null : 'criteria')}
                        className={`w-full flex items-center justify-between px-2.5 rounded-lg border text-[10.5px] focus:outline-none cursor-pointer transition-all font-sans h-7 ${
                          selectedCriteria === 'ALL' ? 'text-neutral-500 font-medium' : 'text-neutral-800 font-semibold'
                        }`}
                        style={{
                          backgroundColor: activeTheme.cardColor,
                          borderColor: activeTheme.borderColor,
                        }}
                      >
                        <span className="truncate">
                          {criteriaOptions.find(o => o.value === selectedCriteria)?.label || 'Select Criteria'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 transition-transform duration-200" />
                      </button>
 
                      <AnimatePresence>
                        {activeDropdown === 'criteria' && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-lg shadow-xl z-50 py-1 text-[10px] custom-sidebar-scrollbar"
                            style={{
                              backgroundColor: activeTheme.cardColor,
                              borderColor: activeTheme.borderColor,
                            }}
                          >
                            {criteriaOptions.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setSelectedCriteria(opt.value);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer block truncate text-xs font-sans"
                                style={{
                                  color: activeTheme.textColor,
                                  backgroundColor: selectedCriteria === opt.value ? activeTheme.backgroundColor : undefined,
                                }}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
 
                    {/* Row 5: Disabled "Nothing Selected" Dropdown below Criteria */}
                    <div className="relative opacity-60 h-7">
                      <button
                        type="button"
                        disabled
                        className="w-full flex items-center justify-between px-2.5 rounded-lg border text-[10.5px] font-sans cursor-not-allowed h-7 text-neutral-500 font-medium"
                        style={{
                          backgroundColor: activeTheme.cardColor,
                          borderColor: activeTheme.borderColor,
                        }}
                      >
                        <span className="truncate flex-1 text-left">Nothing Selected</span>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                    </div>
                  </>
              </div>
 
              {/* 1x4 HORIZONTAL BUTTON ACTION LINE BAR (Premium theme-styled interactive buttons) */}
              <div className="grid grid-cols-4 gap-1.5 pt-2.5 border-t" style={{ borderColor: activeTheme.borderColor }}>
                <button
                  type="button"
                  onClick={() => {}}
                  className="group py-1.5 px-0.5 border rounded-xl flex flex-col items-center justify-center text-center gap-0.5 cursor-pointer select-none transition-all duration-200 hover:scale-[1.04] active:scale-95 shadow-2xs hover:shadow-xs"
                  style={{
                    backgroundColor: activeTheme.primaryColor + '12',
                    borderColor: activeTheme.primaryColor + '30',
                  }}
                  title="New Employee"
                >
                  <UserPlus className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" style={{ color: activeTheme.primaryColor }} />
                  <span className="text-[7.5px] font-bold tracking-tight block truncate w-full transition-colors font-sans" style={{ color: activeTheme.textColor }}>New Emp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className="group py-1.5 px-0.5 border rounded-xl flex flex-col items-center justify-center text-center gap-0.5 cursor-pointer select-none transition-all duration-200 hover:scale-[1.04] active:scale-95 shadow-2xs hover:shadow-xs"
                  style={{
                    backgroundColor: activeTheme.primaryColor + '12',
                    borderColor: activeTheme.primaryColor + '30',
                  }}
                  title="Scan Card"
                >
                  <CreditCard className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" style={{ color: activeTheme.primaryColor }} />
                  <span className="text-[7.5px] font-bold tracking-tight block truncate w-full transition-colors font-sans" style={{ color: activeTheme.textColor }}>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className="group py-1.5 px-0.5 border rounded-xl flex flex-col items-center justify-center text-center gap-0.5 cursor-pointer select-none transition-all duration-200 hover:scale-[1.04] active:scale-95 shadow-2xs hover:shadow-xs"
                  style={{
                    backgroundColor: activeTheme.primaryColor + '12',
                    borderColor: activeTheme.primaryColor + '30',
                  }}
                  title="Scan Schema"
                >
                  <Scan className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" style={{ color: activeTheme.primaryColor }} />
                  <span className="text-[7.5px] font-bold tracking-tight block truncate w-full transition-colors font-sans" style={{ color: activeTheme.textColor }}>Schema</span>
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className="group py-1.5 px-0.5 border rounded-xl flex flex-col items-center justify-center text-center gap-0.5 cursor-pointer select-none transition-all duration-200 hover:scale-[1.04] active:scale-95 shadow-2xs hover:shadow-xs"
                  style={{
                    backgroundColor: activeTheme.primaryColor + '12',
                    borderColor: activeTheme.primaryColor + '30',
                  }}
                  title="Advanced search"
                >
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" style={{ color: activeTheme.primaryColor }} />
                    <span className="absolute -top-[5px] -right-[5px] text-[8.5px] font-black font-sans" style={{ color: activeTheme.primaryColor }}>+</span>
                  </div>
                  <span className="text-[7.5px] font-bold tracking-tight block truncate w-full transition-colors font-sans" style={{ color: activeTheme.textColor }}>Search</span>
                </button>
              </div>
 
            </div>
          )}

          {/* SCROLLABLE CATEGORIES SYSTEM ACCORDIONS LIST */}
          <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar py-2.5 px-2.5 space-y-1">
            {filteredCategories.map(cat => {
              const Icon = cat.icon;
              const isExpanded = expandedCats[cat.id];
              const isActiveCat = cat.items.some(item => activePage === item.id);

              return (
                <div key={cat.id} className="space-y-0.5">
                  {/* Category Trigger Header Button */}
                  <button
                    type="button"
                    onClick={() => !isCollapsed && toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer ${
                      isActiveCat ? 'font-bold bg-white/5 text-white' : 'font-semibold text-neutral-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 flex-shrink-0 duration-200 ${
                        isActiveCat ? 'text-white scale-105' : 'text-neutral-400'
                      }`} />
                      
                      {!isCollapsed && (
                        <span className={`text-[12px] tracking-wide truncate ${isActiveCat ? 'text-white' : 'text-neutral-300'}`}>{toTitleCase(cat.label)}</span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${
                        isActiveCat ? 'text-white' : 'text-neutral-400'
                      } ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    )}
                  </button>

                  {/* Accordion list items */}
                  {!isCollapsed && isExpanded && (
                    <div className="pl-6 border-l border-white/5 ml-4 space-y-1.5 py-1">
                      {cat.items.map(item => {
                        const isActiveSub = activePage === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              if (item.id === 'event-manager-conf' || item.id === 'theme-settings') {
                                onNavigate(item.id);
                              }
                            }}
                            className={`w-full text-left py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all block truncate cursor-pointer ${
                              isActiveSub 
                                ? 'text-white shadow-xs' 
                                : 'text-neutral-300 hover:text-white hover:bg-white/5'
                            }`}
                            style={{
                              backgroundColor: isActiveSub ? activeTheme.primaryColor : undefined
                            }}
                          >
                            {toTitleCase(item.label)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* FOOTER ACTIONS AREA */}
        <div className="p-3 border-t border-white/5 bg-black/15">
          
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/25 text-xs font-semibold cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 text-neutral-400 hover:text-red-500" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>

      </aside>

      {/* MODAL LIGHT OVERLAYS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full border border-neutral-100 p-6 space-y-6"
            >
              {/* Card scanning simulator */}
              {activeModal === 'scan-card' && (
                <div className="text-center space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">RFID Reader Emulator</span>
                    <button onClick={() => setActiveModal(null)} className="text-neutral-400 hover:text-neutral-800 cursor-pointer">
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {modalLoading && (
                    <div className="py-8 space-y-4">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 1.5 }}
                        className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" 
                        style={{ borderColor: activeTheme.primaryColor, borderTopColor: 'transparent' }}
                      />
                      <p className="text-xs font-bold text-neutral-500 font-mono">Awaiting NFC Card Contact...</p>
                    </div>
                  )}

                  {modalSuccess && (
                    <div className="py-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                        <Check className="w-6 h-6 font-bold" />
                      </div>
                      <h4 className="text-xs font-bold text-neutral-800">Badge Mapped Successfully!</h4>
                      <p className="text-[11px] text-neutral-500 font-mono leading-relaxed">
                        RFID: <strong className="text-neutral-800">EMP-902</strong><br />
                        Attendee: <strong>Mr. Steven Terry</strong><br />
                        Security Level: <strong>Admin HQ</strong>
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setActiveModal(null);
                            onNavigate('attendance-calendar');
                          }}
                          className="px-4 py-2 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                        >
                          View Attendance Record
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Barcode / Scan Schema scanner */}
              {activeModal === 'scan-schema' && (
                <div className="text-center space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">Barcode scanner</span>
                    <button onClick={() => setActiveModal(null)} className="text-neutral-400 hover:text-neutral-800 cursor-pointer">
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {modalLoading && (
                    <div className="py-8 space-y-4 relative flex flex-col items-center">
                      <div className="w-40 h-28 border border-neutral-300 rounded-lg relative overflow-hidden bg-neutral-50 flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-neutral-300" />
                        <motion.div 
                          animate={{ y: [0, 112, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          className="absolute inset-x-0 h-1 bg-red-500 shadow-md shadow-red-500/50"
                        />
                      </div>
                      <p className="text-xs font-bold text-neutral-500 font-mono animate-pulse">Running criteria validator scan...</p>
                    </div>
                  )}

                  {modalSuccess && (
                    <div className="py-6 space-y-3 font-mono">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                        <Check className="w-6 h-6 font-bold" />
                      </div>
                      <h4 className="text-xs font-bold text-neutral-800">Criteria Schema Ok!</h4>
                      <p className="text-[10px] text-neutral-500">
                        Event configuration mapped safely. Database synchronization latches active.
                      </p>
                      
                      <button
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-1.5 border hover:bg-neutral-50 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* New employee slide / form popup */}
              {activeModal === 'new-employee' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">Register New Attendee</span>
                    <button onClick={() => setActiveModal(null)} className="text-neutral-400 hover:text-neutral-800 cursor-pointer">
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {modalSuccess ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-neutral-800">Attendee Indexed Safely</h4>
                      <p className="text-[11px] text-neutral-500">Dispatched system account invitations to {newEmp.email}.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs font-semibold">
                      <div>
                        <label className="block text-neutral-500 uppercase text-[10px] tracking-wider mb-1 font-sans">Full Participant Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Mr. Steven Terry"
                          value={newEmp.name}
                          onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl bg-neutral-50 focus:bg-white text-neutral-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-500 uppercase text-[10px] tracking-wider mb-1 font-sans">E-Mail Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="e.g. steven.terry@xfair.com"
                          value={newEmp.email}
                          onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl bg-neutral-50 focus:bg-white text-neutral-800 font-medium font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <label className="block text-neutral-500 uppercase text-[10px] tracking-wider mb-1 font-sans">Corporate Function Role</label>
                          <select
                            value={newEmp.role}
                            onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl bg-neutral-50 text-neutral-800 font-medium"
                          >
                            <option value="Security">Security Coordinator</option>
                            <option value="Booth Support">Booth Support Representative</option>
                            <option value="Technical Liaison">Technical Liaison</option>
                            <option value="Executive Sponsor">Executive Sponsor</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={modalLoading}
                        className="w-full py-2.5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                        style={{ backgroundColor: activeTheme.primaryColor }}
                      >
                        {modalLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Dispatch Profile & Map</span>}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* New Company form popup */}
              {activeModal === 'new-company' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono font-sans">Register New Company</span>
                    <button onClick={() => setActiveModal(null)} className="text-neutral-400 hover:text-neutral-800 cursor-pointer">
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {modalSuccess ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 font-sans">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-neutral-800 font-sans">Company Indexed Safely</h4>
                      <p className="text-[11px] text-neutral-500 font-sans">Integrated {newCompany.companyName} into the enterprise master list.</p>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setModalLoading(true);
                        setTimeout(() => {
                          setModalLoading(false);
                          setModalSuccess(true);
                          setTimeout(() => {
                            setActiveModal(null);
                            setModalSuccess(false);
                            setNewCompany({ companyName: '', industry: 'Technology', country: 'Germany' });
                          }, 1500);
                        }, 1200);
                      }} 
                      className="space-y-4 text-xs font-semibold"
                    >
                      <div>
                        <label className="block text-neutral-500 uppercase text-[10px] tracking-wider mb-1 font-sans">Company name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Acme Industries GmbH"
                          value={newCompany.companyName}
                          onChange={e => setNewCompany({ ...newCompany, companyName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl bg-neutral-50 focus:bg-white text-neutral-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-500 uppercase text-[10px] tracking-wider mb-1 font-sans">Industry Segment</label>
                        <select 
                          value={newCompany.industry}
                          onChange={e => setNewCompany({ ...newCompany, industry: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl bg-neutral-50 text-neutral-800 font-medium"
                        >
                          <option value="Technology">Technology</option>
                          <option value="Automotive">Automotive</option>
                          <option value="Healthcare">Healthcare & Biotech</option>
                          <option value="Finance">Financial Services</option>
                          <option value="Consulting">Professional Services</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-500 uppercase text-[10px] tracking-wider mb-1 font-sans">Country headquarters</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Germany"
                          value={newCompany.country}
                          onChange={e => setNewCompany({ ...newCompany, country: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl bg-neutral-50 focus:bg-white text-neutral-800 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={modalLoading}
                        className="w-full py-2.5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                        style={{ backgroundColor: activeTheme.primaryColor }}
                      >
                        {modalLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Add Company Profile</span>}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
