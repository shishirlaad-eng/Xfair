/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, Fragment } from 'react';
import { ActiveScreen, ThemeSettings, ModuleItem, CriteriaItem, HotelItem, EventItem, RegistrationItem } from './types';
import { 
  INITIAL_MODULE_ITEMS, 
  INITIAL_EVENT, 
  INITIAL_REGISTRATION, 
  INITIAL_CRITERIA_ITEMS, 
  INITIAL_HOTEL_ITEMS 
} from './data';

// Modular Screen Import
import ModuleManager from './components/ModuleManager';
import EventManager from './components/EventManager';
import RegistrationManager from './components/RegistrationManager';
import CriteriaManager from './components/CriteriaManager';
import ThemeManager from './components/ThemeManager';
import HotelManager from './components/HotelManager';
import EmployeeManager from './components/EmployeeManager';
import EmployeeDetailManager from './components/EmployeeDetailManager';
import Login from './components/Login';
const xfairLogo = '/Logo/ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png';

// Lucide Icons Import
import { 
  Search, Users, Landmark, Settings2, UserPlus, Sliders, Play, 
  Grid2X2, Compass, Cpu, Mail, HeartHandshake, Eye, HelpCircle, 
  Globe, LogOut, Check, Sparkles, MessageCircle, AlertCircle, ChevronDown, ChevronRight, RefreshCw,
  User, Fingerprint, Menu, TrendingUp, BarChart3, Smartphone, Lock, Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Theme settings (Premium vs Legacy toggle)
  const [theme, setTheme] = useState<ThemeSettings>({ mode: 'premium' });
  const isPremium = theme.mode === 'premium';

  // State flag to activate/de-activate employee detail directory link
  const isEmployeeSearchEnabled = false;

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Selected screen view
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('event-manager');
  const [moduleViewOption, setModuleViewOption] = useState<'option-1' | 'option-2'>('option-1');
  const [eventViewOption, setEventViewOption] = useState<'option-1' | 'option-2'>('option-1');

  // Sidebar interactive state (Tab filters, collapsible menus)
  const [sidebarTab, setSidebarTab] = useState<'users' | 'building' | 'settings'>('users');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Select status');
  const [selectedFunction, setSelectedFunction] = useState<string>('Select function');
  const [selectedCriteria, setSelectedCriteria] = useState<string>('Select criteria');
  const [actionSelection, setActionSelection] = useState<string>('Nothing selected');

  // Collapsible category triggers
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'Event Info': false,
    'Configuration': true,
    'Resources': false,
    'Hotel': false
  });

  // Host Data States (mock persistent database)
  const [moduleDataset, setModuleDataset] = useState<ModuleItem[]>(INITIAL_MODULE_ITEMS);
  const [criteriaDataset, setCriteriaDataset] = useState<CriteriaItem[]>(INITIAL_CRITERIA_ITEMS);
  const [hotelDataset, setHotelDataset] = useState<HotelItem[]>(INITIAL_HOTEL_ITEMS);
  const [eventRecord, setEventRecord] = useState<EventItem>(INITIAL_EVENT);
  const [registrationRecord, setRegistrationRecord] = useState<RegistrationItem>(INITIAL_REGISTRATION);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  // Language & Event State Dropdowns
  const [currentEventText, setCurrentEventText] = useState<string>('Bauma 2028');
  const [currentLanguage, setCurrentLanguage] = useState<string>('English (US)');
  const [showEventDropdown, setShowEventDropdown] = useState<boolean>(false);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const [showFunctionDropdown, setShowFunctionDropdown] = useState<boolean>(false);
  const [showCriteriaDropdown, setShowCriteriaDropdown] = useState<boolean>(false);
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);
  
  // Company Selection Dropdown States
  const [selectedCompany, setSelectedCompany] = useState<string>('XFAIR');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState<boolean>(false);

  // Unread messages stack simulation
  const [messagesUnread, setMessagesUnread] = useState<number>(3);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState<boolean>(false);

  // Notification Toast manager
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastId, setToastId] = useState<number>(0);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    const newId = Date.now();
    setToastId(newId);
    setTimeout(() => {
      setToastId((currentId) => {
        if (currentId === newId) {
          setToastMessage(null);
        }
        return currentId;
      });
    }, 4000);
  };

  const toggleCategory = (cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Switch Theme Function
  const handleToggleTheme = (mode: 'premium' | 'legacy') => {
    setTheme({ mode });
    triggerToast(
      mode === 'premium' 
        ? 'Switched to Modern Swiss Enterprise Theme (2028 Design Ready)' 
        : 'Switched to Legacy UI Theme Mode for Parity Proofing'
    );
  };

  // Breadcrumbs text helper
  const getBreadcrumbs = () => {
    switch (activeScreen) {
      case 'module-manager':
        return { root: 'EMS', paths: ['Module manager'] };
      case 'event-manager':
        return { root: 'EMS', paths: ['Event manager'] };
      case 'registration-manager':
        return { root: 'EMS', paths: ['Event manager', 'Registration manager'] };
      case 'criteria-manager':
        return { root: 'EMS', paths: ['Criteria Manager'] };
      case 'theme-manager':
        return { root: 'EMS', paths: ['Theme Manager'] };
      case 'hotel-manager':
        return { root: 'EMS', paths: ['Hotel manager'] };
      case 'employees':
        return { root: 'EMS', paths: ['Employees'] };
      case 'employee-detail':
        return { root: 'EMS', paths: ['Employees', 'Sergey Cherniavsky'] };
      default:
        return { root: 'EMS', paths: ['Module manager'] };
    }
  };

  const breadcrumbs = getBreadcrumbs();

  const handleBreadcrumbClick = (label: string) => {
    const l = label.toLowerCase();
    if (l === 'ems') {
      setActiveScreen('module-manager');
      triggerToast("Returned to Module Manager home view.");
    } else if (l === 'employees') {
      setActiveScreen('employees');
      triggerToast("Navigated to Employee Directory.");
    } else if (l === 'event manager') {
      setActiveScreen('event-manager');
      triggerToast("Returned to Event Manager.");
    } else if (l === 'registration manager') {
      setActiveScreen('registration-manager');
      triggerToast("Navigated to Registration Manager.");
    } else if (l === 'hotel manager') {
      setActiveScreen('hotel-manager');
      triggerToast("Navigated to Hotel Rooming Block.");
    } else if (l === 'criteria manager') {
      setActiveScreen('criteria-manager');
      triggerToast("Navigated to Criteria Manager.");
    } else if (l === 'theme manager') {
      setActiveScreen('theme-manager');
      triggerToast("Navigated to Theme Settings.");
    } else if (l === 'module manager') {
      setActiveScreen('module-manager');
      triggerToast("Navigated to Module Manager.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full relative">
        {/* PERSISTENT TOAST NOTIFICATION BANNER */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
              id="workspace-alert"
            >
              <div className="bg-zinc-900 text-white rounded-xl shadow-2xl border border-zinc-700/50 px-5 py-3 flex items-center gap-3 text-xs max-w-md pointer-events-auto text-left">
                <Sparkles className="w-4.5 h-4.5 text-[#F35D00] shrink-0 animate-spin-slow" />
                <div className="flex-1 font-medium">{toastMessage}</div>
                <button 
                  onClick={() => setToastMessage(null)}
                  className="text-zinc-400 hover:text-white px-1.5 py-0.5 rounded transition-colors text-[10px]"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Login
          isPremium={isPremium}
          onLogin={(email) => {
            setIsLoggedIn(true);
            setSidebarSearch('');
            setActiveScreen('event-manager');
          }}
          onToggleTheme={(mode) => handleToggleTheme(mode)}
          language={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onShowToast={triggerToast}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row font-sans bg-[#f6f6f6] ${isPremium ? 'text-zinc-900' : 'text-black'}`} id="app-viewport">
      
      {/* PERSISTENT TOAST NOTIFICATION BANNER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            id="workspace-alert"
          >
            <div className="bg-zinc-900 text-white rounded-xl shadow-2xl border border-zinc-700/50 px-5 py-3 flex items-center gap-3 text-xs max-w-md pointer-events-auto">
              <Sparkles className="w-4.5 h-4.5 text-[#F35D00] shrink-0 animate-spin-slow" />
              <div className="flex-1 font-medium">{toastMessage}</div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-zinc-400 hover:text-white px-1.5 py-0.5 rounded transition-colors text-[10px]"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT BAR PANEL (Navigation hierarchy and Quick status filters) */}
      <aside 
        className={`${
          isPremium 
            ? sidebarCollapsed
              ? 'w-full lg:w-[84px] bg-[#111116] border-r border-[#1C1C24] text-[#F4F4F6] px-3 py-5 flex flex-col shrink-0 justify-between lg:h-screen lg:overflow-y-auto custom-scrollbar-dark lg:sticky lg:top-0 lg:z-30 transition-all duration-300'
              : 'w-full lg:w-[260px] bg-[#111116] border-r border-[#1C1C24] text-[#F4F4F6] px-4 py-5 flex flex-col shrink-0 justify-between lg:h-screen lg:overflow-y-auto custom-scrollbar-dark lg:sticky lg:top-0 lg:z-30 transition-all duration-300' 
            : sidebarCollapsed
              ? 'w-full lg:w-[84px] bg-[#A4A4A4] border-r border-black text-black p-1.5 flex flex-col space-y-2 lg:h-screen lg:overflow-y-auto custom-scrollbar-light lg:sticky lg:top-0 lg:z-30 transition-all duration-300'
              : 'w-full lg:w-[270px] bg-[#A4A4A4] border-r border-black text-black p-2 flex flex-col space-y-2 lg:h-screen lg:overflow-y-auto custom-scrollbar-light lg:sticky lg:top-0 lg:z-30 transition-all duration-300'
        }`}
        id="sidebar-navigation"
      >
        {isPremium ? (
          <div className="flex flex-col space-y-4.5">
            
            {/* Header: Logo, Brand Text, Hamburger */}
            <div className={`flex items-center pb-3 border-b border-[#1C1C24] ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => triggerToast("XFAIR ERP Enterprise Suite")}>
                  <img 
                    src={xfairLogo} 
                    alt="XFAIR Logo" 
                    style={{ width: '210px', height: '70px' }}
                    className="shrink-0 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              
              <div 
                className="p-1 rounded-md text-[#8B8B98]"
              >
                <Menu className="w-5 h-5" />
              </div>
            </div>

            {/* General Category Segmented Tabs Row */}
            <div className={`grid ${sidebarCollapsed ? 'grid-cols-1 gap-2.5' : 'grid-cols-3 gap-1'} bg-[#15151F] p-1 rounded-xl border border-[#21212E]/70`} id="sidebar-icon-tabs">
              <button
                type="button"
                onClick={() => { setSidebarTab('users'); }}
                className={`py-2 rounded-lg flex justify-center cursor-pointer transition-all ${
                  sidebarTab === 'users' 
                    ? 'bg-[#20202F] text-white' 
                    : 'bg-transparent text-[#5C5C70] hover:text-[#8B8B98]'
                }`}
                title="Users Directory"
              >
                <User className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={() => { setSidebarTab('building'); }}
                className={`py-2 rounded-lg flex justify-center cursor-pointer transition-all ${
                  sidebarTab === 'building' 
                    ? 'bg-[#20202F] text-white' 
                    : 'bg-transparent text-[#5C5C70] hover:text-[#8B8B98]'
                }`}
                title="Buildings & Facilities"
              >
                <Landmark className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => { setSidebarTab('settings'); }}
                className={`py-2 rounded-lg flex justify-center cursor-pointer transition-all ${
                  sidebarTab === 'settings' 
                    ? 'bg-[#20202F] text-white' 
                    : 'bg-transparent text-[#5C5C70] hover:text-[#8B8B98]'
                }`}
                title="Device Fingerprint Registry"
              >
                <Fingerprint className="w-4.5 h-4.5" />
              </button>
            </div>

            {!sidebarCollapsed && (
              <>
                {/* Inner controls stack with inputs and custom dropdowns */}
                <div className="flex flex-col space-y-2">
                  
                  {/* Name search input row */}
                  <div className="flex gap-1.5 items-stretch" id="sidebar-search-container">
                    <input
                      type="text"
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (isEmployeeSearchEnabled) {
                            setActiveScreen('employees');
                            triggerToast(`Searching directory records for "${sidebarSearch || 'all'}"...`);
                          } else {
                            triggerToast(`Search simulated for "${sidebarSearch || 'all'}". Active directory is currently offline.`);
                          }
                        }
                      }}
                      placeholder="Search attendee..."
                      className="flex-1 h-9 bg-[#171721] text-[#F4F4F6] border border-[#21212E] hover:border-[#38384F] px-3.5 rounded-lg text-xs placeholder-[#606072] focus:outline-none focus:border-[#38384F] transition-colors"
                    />
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (isEmployeeSearchEnabled) {
                          setActiveScreen('employees');
                          triggerToast(`Display directory for: "${sidebarSearch || 'all'}"`);
                        } else {
                          triggerToast(`Search query simulated for "${sidebarSearch || 'all'}". Directory link is currently configured as offline.`);
                        }
                      }}
                      className="w-9 h-9 flex items-center justify-center bg-[#171721] text-[#606072] hover:text-white border border-[#21212E] hover:border-[#38384F] rounded-lg cursor-pointer transition-colors"
                      title="Search Attendee"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Postal Code field */}
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code..."
                    className="w-full h-9 bg-[#171721] text-[#F4F4F6] border border-[#21212E] hover:border-[#38384F] px-3.5 rounded-lg text-xs placeholder-[#606072] focus:outline-none focus:border-[#38384F] transition-colors"
                  />

                  {/* Status Dropdown */}
                  <div className="relative font-sans">
                    <div
                      className="w-full h-9 text-left bg-[#171721] text-[#F4F4F6] border border-[#21212E] px-3.5 rounded-lg text-xs flex justify-between items-center cursor-default transition-colors select-none"
                    >
                      <span className="truncate text-[#F4F4F6] font-medium">{selectedStatus}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8B8B98] shrink-0" />
                    </div>
                  </div>

                  {/* Function Dropdown */}
                  <div className="relative font-sans">
                    <div
                      className="w-full h-9 text-left bg-[#171721] text-[#F4F4F6] border border-[#21212E] px-3.5 rounded-lg text-xs flex justify-between items-center cursor-default transition-colors select-none"
                    >
                      <span className="truncate text-[#F4F4F6] font-medium">{selectedFunction}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8B8B98] shrink-0" />
                    </div>
                  </div>

                  {/* Criteria Dropdown */}
                  <div className="relative font-sans">
                    <div
                      className="w-full h-9 text-left bg-[#171721] text-[#F4F4F6] border border-[#21212E] px-3.5 rounded-lg text-xs flex justify-between items-center cursor-default transition-colors select-none"
                    >
                      <span className="truncate text-[#F4F4F6] font-medium">{selectedCriteria}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8B8B98] shrink-0" />
                    </div>
                  </div>

                </div>

                {/* Quick Actions 2x2 Bento Grid */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button 
                    type="button"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#14141F] border border-[#21212E]/80 hover:border-[#38384F] hover:bg-[#1A1A28] transition-all cursor-pointer text-center group"
                  >
                    <UserPlus className="w-5 h-5 mb-1.5 text-[#F35D00]" />
                    <span className="text-[10.5px] font-semibold text-[#8B8B98] group-hover:text-[#F4F4F6] leading-tight block">New employee</span>
                  </button>

                  <button 
                    type="button"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#14141F] border border-[#21212E]/80 hover:border-[#38384F] hover:bg-[#1A1A28] transition-all cursor-pointer text-center group"
                  >
                    <Fingerprint className="w-5 h-5 mb-1.5 text-[#F35D00]" />
                    <span className="text-[10.5px] font-semibold text-[#8B8B98] group-hover:text-[#F4F4F6] leading-tight block">Scan card</span>
                  </button>

                  <button 
                    type="button"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#14141F] border border-[#21212E]/80 hover:border-[#38384F] hover:bg-[#1A1A28] transition-all cursor-pointer text-center group"
                  >
                    <Grid2X2 className="w-5 h-5 mb-1.5 text-[#F35D00]" />
                    <span className="text-[10.5px] font-semibold text-[#8B8B98] group-hover:text-[#F4F4F6] leading-tight block">Scan schema</span>
                  </button>

                  <button 
                    type="button"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#14141F] border border-[#21212E]/80 text-center group cursor-default"
                  >
                    <Search className="w-5 h-5 mb-1.5 text-[#F35D00]" />
                    <span className="text-[10.5px] font-semibold text-[#8B8B98] leading-tight block">Advanced search</span>
                  </button>
                </div>

                {/* Section 2: Collapsible Accordion Sections */}
                <div className="flex flex-col space-y-2 mt-4" id="sidebar-collapsibles">
                  
                  {/* 1. EVENT INFO (Expanded by default) */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleCategory('Event Info')}
                      className={`w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer ${
                        expandedCats['Event Info']
                          ? 'bg-[#1C1C26] text-white border border-[#2B2B3D]/30 shadow-md'
                          : 'bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Landmark className={`w-[18px] h-[18px] shrink-0 transition-colors ${expandedCats['Event Info'] ? 'text-[#F35D00]' : 'text-[#8B8B98]'}`} />
                        <span className="text-[13.5px] font-bold tracking-wide">Event Info</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedCats['Event Info'] ? 'rotate-180 text-white' : 'text-[#8B8B98]'}`} />
                    </button>
                    
                    {expandedCats['Event Info'] && (
                      <div className="flex flex-col pl-4 pr-1 mt-2.5 space-y-1.5 border-l border-[#222230] ml-6 pb-2.5">
                        {[
                          { label: 'General Information', screen: 'event-manager' as const },
                          { label: 'Event Criteria Values', screen: 'criteria-manager' as const },
                          { label: 'Check in Status', screen: null },
                          { label: 'Service Order Checkin', screen: null },
                          { label: 'Print Namebadge from Qrcode', screen: null },
                        ].map(({ label, screen }) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              if (screen) {
                                setActiveScreen(screen);
                                triggerToast(`Navigated to ${label}.`);
                              } else {
                                triggerToast(`${label} — coming soon.`);
                              }
                            }}
                            className={`block w-full text-left text-[13px] transition-all py-2 px-4 rounded-xl font-semibold leading-tight cursor-pointer ${
                              screen && activeScreen === screen
                                ? 'bg-[#F35D00] text-white font-bold shadow-md shadow-[#F35D00]/15'
                                : 'text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. CONFIGURATION */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleCategory('Configuration')}
                      className={`w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer ${
                        expandedCats['Configuration']
                          ? 'bg-[#1C1C26] text-white border border-[#2B2B3D]/30 shadow-md'
                          : 'bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings2 className={`w-[18px] h-[18px] shrink-0 transition-colors ${expandedCats['Configuration'] ? 'text-[#F35D00]' : 'text-[#8B8B98]'}`} />
                        <span className="text-[13.5px] font-bold tracking-wide">Configuration</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedCats['Configuration'] ? 'rotate-180 text-white' : 'text-[#8B8B98]'}`} />
                    </button>
                    
                    {expandedCats['Configuration'] && (
                      <div className="flex flex-col pl-4 pr-1 mt-2.5 space-y-1.5 border-l border-[#222230] ml-6 pb-2.5">
                        <button
                          type="button"
                          onClick={() => setActiveScreen('event-manager')}
                          className={`block w-full text-left cursor-pointer transition-all py-2 px-4 rounded-xl text-[13px] font-semibold leading-tight ${
                            activeScreen === 'event-manager' 
                              ? 'bg-[#F35D00] text-white font-bold shadow-md shadow-[#F35D00]/15' 
                              : 'text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                          }`}
                        >
                          Event manager
                        </button>

                        <button
                          type="button"
                          onClick={() => { setActiveScreen('criteria-manager'); triggerToast("Navigated to Criteria Manager."); }}
                          className={`block w-full text-left text-[13px] py-2 px-4 rounded-xl font-semibold leading-tight cursor-pointer transition-all ${
                            activeScreen === 'criteria-manager'
                              ? 'bg-[#F35D00] text-white font-bold shadow-md shadow-[#F35D00]/15'
                              : 'text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                          }`}
                        >
                          Criteria Manager
                        </button>
                        
                        {['Criteria value manager', 'Criteria Value Limits', 'Message templates', 'Email templates', 'Lead wizard manager', 'Dialing rules', 'Mobile apps manager', 'System manager', 'Person Report Configuration'].map((lnk) => (
                          <Fragment key={lnk}>
                            <button
                              type="button"
                              className="block w-full text-left text-[13px] py-2 px-4 rounded-xl font-semibold leading-tight text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40 cursor-pointer transition-all"
                            >
                              {lnk}
                            </button>
                            
                            {lnk === 'Criteria Value Limits' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveScreen('theme-manager');
                                }}
                                className={`block w-full text-left cursor-pointer text-[13px] transition-all py-2 px-4 rounded-xl font-semibold leading-tight ${
                                  activeScreen === 'theme-manager' 
                                    ? 'bg-[#F35D00] text-white font-bold shadow-md shadow-[#F35D00]/15' 
                                    : 'text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                                }`}
                              >
                                Theme Manager
                              </button>
                            )}
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. RESOURCES */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleCategory('Resources')}
                      className={`w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer ${
                        expandedCats['Resources']
                          ? 'bg-[#1C1C26] text-white border border-[#2B2B3D]/30 shadow-md'
                          : 'bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Cpu className={`w-[18px] h-[18px] shrink-0 transition-colors ${expandedCats['Resources'] ? 'text-[#F35D00]' : 'text-[#8B8B98]'}`} />
                        <span className="text-[13.5px] font-bold tracking-wide">Resources</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedCats['Resources'] ? 'rotate-180 text-white' : 'text-[#8B8B98]'}`} />
                    </button>
                    {expandedCats['Resources'] && (
                      <div className="flex flex-col pl-4 pr-1 mt-2.5 space-y-1.5 border-l border-[#222230] ml-6 pb-2.5">
                        {['Documents', 'Media Library', 'Floor Plans'].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => triggerToast(`${item} — coming soon.`)}
                            className="block w-full text-left text-[13px] transition-all py-2 px-4 rounded-xl font-semibold leading-tight text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40 cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. HOTEL */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleCategory('Hotel')}
                      className={`w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer ${
                        expandedCats['Hotel']
                          ? 'bg-[#1C1C26] text-white border border-[#2B2B3D]/30 shadow-md'
                          : 'bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe className={`w-[18px] h-[18px] shrink-0 transition-colors ${expandedCats['Hotel'] ? 'text-[#F35D00]' : 'text-[#8B8B98]'}`} />
                        <span className="text-[13.5px] font-bold tracking-wide">Hotel</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedCats['Hotel'] ? 'rotate-180 text-white' : 'text-[#8B8B98]'}`} />
                    </button>
                    {expandedCats['Hotel'] && (
                      <div className="flex flex-col pl-4 pr-1 mt-2.5 space-y-1.5 border-l border-[#222230] ml-6 pb-2.5">
                        <button
                          type="button"
                          onClick={() => { setActiveScreen('hotel-manager'); triggerToast("Navigated to Hotel Rooming Block."); }}
                          className={`block w-full text-left text-[13px] transition-all py-2 px-4 rounded-xl font-semibold leading-tight cursor-pointer ${
                            activeScreen === 'hotel-manager'
                              ? 'bg-[#F35D00] text-white font-bold shadow-md shadow-[#F35D00]/15'
                              : 'text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40'
                          }`}
                        >
                          Rooming Block
                        </button>
                        {['Room Allocation', 'Hotel Contracts'].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => triggerToast(`${item} — coming soon.`)}
                            className="block w-full text-left text-[13px] transition-all py-2 px-4 rounded-xl font-semibold leading-tight text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40 cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. SALES */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => triggerToast("Sales module — coming soon.")}
                      className="w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-[18px] h-[18px] shrink-0 text-[#8B8B98]" />
                        <span className="text-[13.5px] font-bold tracking-wide">Sales</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B8B98]" />
                    </button>
                  </div>

                  {/* 6. REPORTING */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => triggerToast("Reporting module — coming soon.")}
                      className="w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <BarChart3 className="w-[18px] h-[18px] shrink-0 text-[#8B8B98]" />
                        <span className="text-[13.5px] font-bold tracking-wide">Reporting</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B8B98]" />
                    </button>
                  </div>

                  {/* 7. DEVICES MANAGE */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => triggerToast("Devices manage — coming soon.")}
                      className="w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-[18px] h-[18px] shrink-0 text-[#8B8B98]" />
                        <span className="text-[13.5px] font-bold tracking-wide font-sans">Devices manage</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B8B98]" />
                    </button>
                  </div>

                  {/* 8. ADMIN FUNCTIONS */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => triggerToast("Admin functions — coming soon.")}
                      className="w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-[18px] h-[18px] shrink-0 text-[#8B8B98]" />
                        <span className="text-[13.5px] font-bold tracking-wide">Admin functions</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B8B98]" />
                    </button>
                  </div>

                  {/* 9. TECHNICIANS */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => triggerToast("Technicians module — coming soon.")}
                      className="w-full text-left flex justify-between items-center transition-all font-sans px-4 py-3 rounded-xl cursor-pointer bg-transparent text-[#8B8B98] hover:text-[#F4F4F6] hover:bg-[#1C1C26]/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <Wrench className="w-[18px] h-[18px] shrink-0 text-[#8B8B98]" />
                        <span className="text-[13.5px] font-bold tracking-wide">Technicians</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B8B98]" />
                    </button>
                  </div>

                </div>
              </>
            )}

          </div>
        ) : (
          /* Legacy layout */
          <div className="flex flex-col space-y-2">
            <div className="py-2 px-1 border-b border-black mb-2">
              <div className="cursor-pointer flex items-center gap-3 select-none justify-center lg:justify-start" onClick={() => triggerToast("XFAIR Corporate Identity v2028")}>
                <img 
                  src={xfairLogo} 
                  alt="XFAIR Logo" 
                  style={{ width: '210px', height: '70px' }}
                  className="object-contain max-w-full brightness-110" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            <div className="bg-[#D3D3D3] border border-gray-500 p-2">
              <span className="text-xs font-bold border-b border-gray-455 block pb-1">
                General Navigation
              </span>
              <div className="grid grid-cols-3 gap-1.5" id="sidebar-icon-tabs">
                <button
                  type="button"
                  onClick={() => { setSidebarTab('users'); }}
                  className={`py-2 rounded-lg flex justify-center cursor-pointer transition-colors ${
                    sidebarTab === 'users' ? 'bg-white border border-black font-bold' : 'bg-[#E1E1E1]'
                  }`}
                  title="Users Directory"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => { setSidebarTab('building'); }}
                  className={`py-2 rounded-lg flex justify-center cursor-pointer transition-colors ${
                    sidebarTab === 'building' ? 'bg-white border border-black font-bold' : 'bg-[#E1E1E1]'
                  }`}
                  title="Buildings & Facilities"
                >
                  <Landmark className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => { setSidebarTab('settings'); }}
                  className={`py-2 rounded-lg flex justify-center cursor-pointer transition-colors ${
                    sidebarTab === 'settings' ? 'bg-white border border-black font-bold' : 'bg-[#E1E1E1]'
                  }`}
                >
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2 items-stretch mt-2" id="sidebar-search-container">
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Name"
                  className="w-full bg-white border border-gray-400 p-2 text-xs text-black h-8"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isEmployeeSearchEnabled) {
                      setActiveScreen('employees');
                      triggerToast(`Displaying Employee directory filtering for "${sidebarSearch || 'all'}"...`);
                    } else {
                      triggerToast(`Search simulated for "${sidebarSearch || 'all'}". Directory link is currently configured as offline.`);
                    }
                  }}
                  className="h-8 px-2.5 bg-zinc-800 hover:bg-black text-white border border-black text-xs font-bold"
                >
                  Search
                </button>
              </div>
              <select
                value={selectedStatus}
                onChange={() => {}}
                className="w-full bg-white border border-gray-400 p-1 text-xs text-black mt-2 cursor-default pointer-events-none select-none"
              >
                <option value="Select status">Select status</option>
              </select>
              <select
                value={selectedCriteria}
                onChange={() => {}}
                className="w-full bg-white border border-gray-400 p-1 text-xs text-black mt-2 cursor-default pointer-events-none select-none"
              >
                <option value="Select criteria">Select criteria</option>
              </select>
              <select
                value={actionSelection}
                onChange={(e) => {
                  setActionSelection(e.target.value);
                  triggerToast(`General Option trigger: ${e.target.value}`);
                }}
                className="w-full bg-[#D3D3D3] border border-gray-400 p-1 text-xs text-black mt-2"
              >
                <option value="Nothing selected">Nothing selected</option>
                <option value="Dispatch confirmation codes">Dispatch confirmation codes</option>
                <option value="Export registration tables">Export registration tables</option>
              </select>
            </div>
          </div>
        )}

        {/* Footer Level log out container at bottom */}
        {isPremium ? (
          <div className="pt-4 border-t border-[#1C1C28] mt-6">
            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(false);
                triggerToast("Logged out of enterprise panel successfully.");
              }}
              className={`w-full flex items-center gap-2.5 py-1 text-[13.5px] font-semibold text-[#8B8B98] hover:text-white transition-all cursor-pointer text-left ${sidebarCollapsed ? 'justify-center' : ''}`}
              title="Logout"
            >
              <LogOut className="w-4 h-4 ml-0.5" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        ) : (
          <div className="pt-2 border-t border-gray-600 flex justify-center gap-4 text-[11px] text-black">
            {!sidebarCollapsed ? (
              <>
                <span className="hover:underline cursor-pointer" onClick={() => triggerToast("Imprint Details")}>Imprint</span>
                <span className="hover:underline cursor-pointer" onClick={() => triggerToast("Data Privacy")}>Data Privacy</span>
              </>
            ) : (
              <span className="cursor-default select-none">●</span>
            )}
          </div>
        )}

      </aside>

        {/* WORKSPACE AREA & HEADER CONTAINER (Sits on the right of full-height sidebar on desktop) */}
        <div className="flex-1 flex flex-col min-w-0" id="workspace-right-area">
          
          {/* PERSISTENT HEADER BAR */}
          <header className={`${isPremium ? 'bg-white border-b border-zinc-200/80 px-6 py-3.5 flex items-center justify-between text-zinc-900 shadow-xs' : 'bg-gray-100 border-b border-gray-400 px-4 py-2 flex items-center justify-between text-black'}`} id="app-header-bar">
            {/* Header left: prominent Event Switcher */}
            <div className="flex items-center gap-2.5">
              {isPremium ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventDropdown(!showEventDropdown);
                      setShowLangDropdown(false);
                      setShowMessagesDropdown(false);
                      setShowCompanyDropdown(false);
                    }}
                    className="bg-zinc-100 border border-zinc-300 hover:border-[#F35D00] hover:bg-[#FFE7D6]/10 rounded-lg pl-3.5 pr-9 py-2 text-xs text-zinc-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#F35D00] cursor-pointer inline-flex items-center gap-2 select-none min-w-[210px] justify-between relative transition-all shadow-3xs"
                    id="header-event-switcher"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-[#F35D00] animate-pulse shrink-0" />
                      <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider shrink-0">Event:</span>
                      <span className="truncate font-black text-zinc-950 text-xs">{currentEventText}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none transition-transform duration-200 ${showEventDropdown ? 'rotate-180 text-[#F35D00]' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showEventDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowEventDropdown(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-0 mt-1 min-w-[210px] bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50 text-xs overflow-hidden"
                        >
                          {['Bauma 2028', 'EuroShop 2029', 'Hannover Messe'].map((evt) => (
                            <button
                              key={evt}
                              type="button"
                              onClick={() => {
                                setCurrentEventText(evt);
                                setShowEventDropdown(false);
                                triggerToast(`Active workspace context changed to: ${evt}`);
                              }}
                              className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer block ${
                                currentEventText === evt 
                                  ? 'bg-[#F35D00]/10 text-[#F35D00] font-bold border-l-2 border-[#F35D00]' 
                                  : 'text-zinc-650 hover:bg-[#F35D00]/5 hover:text-[#F35D00]'
                              }`}
                            >
                              {evt}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="relative flex items-center gap-1.5 bg-white border border-gray-400 p-1 px-2">
                  <span className="text-[10px] font-black text-black uppercase tracking-wider">EVENT:</span>
                  <select
                    value={currentEventText}
                    onChange={(e) => {
                      setCurrentEventText(e.target.value);
                      triggerToast(`Active workspace context changed to: ${e.target.value}`);
                    }}
                    className="bg-transparent border-none text-xs text-black font-extrabold appearance-none pr-6 cursor-pointer focus:outline-none"
                  >
                    <option value="Bauma 2028">Bauma 2028</option>
                    <option value="EuroShop 2029">EuroShop 2029</option>
                    <option value="Hannover Messe">Hannover Messe</option>
                  </select>
                  <span className="pointer-events-none text-black text-[9px] select-none font-bold">▼</span>
                </div>
              )}
            </div>

            {/* Header right: Actions and profile dropdowns */}
            <div className="flex items-center gap-3">
              
              {/* Unread Message Dropdown Module */}
              <div className="relative">
                <div 
                  className={`${isPremium ? 'px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-zinc-700 border border-zinc-200 flex items-center gap-1.5 cursor-default select-none' : 'px-2 py-0.5 bg-white border border-gray-400 text-xs text-black cursor-default select-none'}`}
                >
                  <span>Unread Messages</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${isPremium ? 'bg-[#F35D00]/10 text-[#F35D00]' : 'bg-red-500 text-white'}`}>{messagesUnread}</span>
                </div>
              </div>



              {/* 1. Translation Locale Selector flag list */}
              <div className="relative">
                {isPremium ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLangDropdown(!showLangDropdown);
                        setShowEventDropdown(false);
                        setShowMessagesDropdown(false);
                        setShowCompanyDropdown(false);
                      }}
                      className="bg-white border border-zinc-200 hover:border-[#F35D00] rounded-lg pl-3 pr-8 py-1.5 text-xs text-zinc-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#F35D00] cursor-pointer inline-flex items-center gap-1.5 select-none min-w-[140px] justify-between relative transition-all"
                    >
                      <span className="truncate">
                        {currentLanguage === 'English (US)' && '🇺🇸 English (US)'}
                        {currentLanguage === 'English (UK)' && '🇬🇧 English (UK)'}
                        {currentLanguage === 'German (DE)' && '🇩🇪 Deutsch (DE)'}
                        {!['English (US)', 'English (UK)', 'German (DE)'].includes(currentLanguage) && currentLanguage}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none transition-transform duration-200 ${showLangDropdown ? 'rotate-180 text-[#F35D00]' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showLangDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowLangDropdown(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-1 min-w-[140px] bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50 text-xs overflow-hidden"
                          >
                            {[
                              { val: 'English (US)', label: '🇺🇸 English (US)' },
                              { val: 'English (UK)', label: '🇬🇧 English (UK)' },
                              { val: 'German (DE)', label: '🇩🇪 Deutsch (DE)' }
                            ].map((lang) => (
                              <button
                                key={lang.val}
                                type="button"
                                onClick={() => {
                                  setCurrentLanguage(lang.val);
                                  setShowLangDropdown(false);
                                  triggerToast(`Client runtime language translated to: ${lang.val}`);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer block ${
                                  currentLanguage === lang.val 
                                    ? 'bg-[#F35D00]/10 text-[#F35D00] font-bold' 
                                    : 'text-zinc-650 hover:bg-[#F35D00]/5 hover:text-[#F35D00]'
                                }`}
                              >
                                {lang.label}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="relative">
                    <select
                      value={currentLanguage}
                      onChange={(e) => {
                        setCurrentLanguage(e.target.value);
                        triggerToast(`Client runtime language translated to: ${e.target.value}`);
                      }}
                      className="bg-white border border-gray-400 p-1 text-xs text-black appearance-none pr-6"
                    >
                      <option value="English (US)">🇺🇸 English (US)</option>
                      <option value="English (UK)">🇬🇧 English (UK)</option>
                      <option value="German (DE)">🇩🇪 Deutsch (DE)</option>
                    </select>
                    <span className="absolute right-1.5 top-1.5 pointer-events-none text-black text-[10px] select-none">▼</span>
                  </div>
                )}
              </div>

              {/* 2. Help Icon */}
              <div 
                className={`${isPremium ? 'w-8 h-8 rounded-lg bg-white border border-zinc-200 text-zinc-400 flex items-center justify-center cursor-default select-none' : 'px-1 bg-white border border-gray-400 text-xs text-gray-500 font-bold cursor-default select-none'}`}
              >
                <HelpCircle className="w-4 h-4" />
              </div>

              {/* 3. Profile Name & Signout Icon badge (Sadhana Penta) */}
              <div className="flex items-center gap-1.5">
                {isPremium ? (
                  <button 
                    onClick={() => {
                      setIsLoggedIn(false);
                      triggerToast("Signed out of XFAIR enterprise workspace successfully.");
                    }}
                    className="bg-white border border-zinc-200 hover:border-[#F35D00] rounded-lg px-3 py-1.5 text-xs text-zinc-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#F35D00] cursor-pointer inline-flex items-center gap-2 select-none relative transition-all shadow-3xs h-[32px]"
                    title="System Sign Out"
                  >
                    <div className="w-5 h-5 bg-[#FFE1CC] flex items-center justify-center rounded-md text-[#F35D00] font-bold text-[10px] shrink-0">
                      SP
                    </div>
                    <span className="text-xs font-semibold text-zinc-700 tracking-tight">Sadhana Penta</span>
                    <LogOut className="w-3.5 h-3.5 text-zinc-400 hover:text-[#F35D00] transition-colors shrink-0 ml-0.5" />
                  </button>
                ) : (
                  <div className="text-xs text-black border border-gray-400 px-2 py-0.5 font-bold bg-[#E5E5E5] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse shrink-0" />
                    <span>Sadhana Penta</span>
                    <button 
                      onClick={() => {
                        setIsLoggedIn(false);
                        triggerToast("Signed out of XFAIR enterprise workspace successfully.");
                      }}
                      className="ml-1 hover:text-[#F35D00] cursor-pointer bg-transparent border-none text-center flex items-center"
                      title="System Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5 inline text-zinc-450 hover:text-[#F35D00] transition-colors" />
                    </button>
                  </div>
                )}
              </div>

            </div>

          </header>

          <section className={`flex-1 p-6 overflow-y-auto bg-[#f6f6f6] ${isPremium ? 'text-zinc-900' : 'text-black p-4'}`} id="content-pane">
          
          {/* Breadcrumb section matching dynamic selection (Screenshot parity) */}
          {activeScreen === 'module-manager' && moduleViewOption === 'option-2' ? (
            <div className={`${isPremium ? 'mb-6 py-3 px-5 bg-zinc-100 border border-zinc-200/60 rounded-xl shadow-xs' : 'mb-3 p-2.5 bg-[#D3D3D3] border border-gray-400'}`} id="navigation-breadcrumbs">
              <div className={`flex items-center ${isPremium ? 'gap-2 text-[12.5px] font-semibold tracking-wide' : 'gap-1 text-xs font-bold text-black'}`}>
                <span 
                  className={isPremium ? 'text-zinc-500 uppercase font-mono tracking-wider cursor-default select-none' : 'text-black cursor-default select-none'}
                >EMS</span>
                <span className={isPremium ? 'text-zinc-400 font-bold mx-1' : 'text-black font-bold mx-0.5'}>/</span>
                <span className={isPremium ? 'text-[#F35D00] font-bold' : 'text-black font-bold'}>Module Manager</span>
              </div>
            </div>
          ) : activeScreen === 'event-manager' && eventViewOption === 'option-2' ? (
            <div className={`${isPremium ? 'mb-6 py-3 px-5 bg-zinc-100 border border-zinc-200/60 rounded-xl shadow-xs' : 'mb-3 p-2.5 bg-[#D3D3D3] border border-gray-400'}`} id="navigation-breadcrumbs">
              <div className={`flex items-center ${isPremium ? 'gap-2 text-[12.5px] font-semibold tracking-wide' : 'gap-1 text-xs font-bold text-black'}`}>
                <span 
                  className={isPremium ? 'text-zinc-500 uppercase font-mono tracking-wider cursor-default select-none' : 'text-black cursor-default select-none'}
                >EMS</span>
                <span className={isPremium ? 'text-zinc-400 font-bold mx-1' : 'text-black font-bold mx-0.5'}>/</span>
                <span className={isPremium ? 'text-[#F35D00] font-bold' : 'text-black font-bold'}>Event Manager</span>
              </div>
            </div>
          ) : (
            <div className={`${isPremium ? 'mb-6 py-1.5' : 'mb-3'}`} id="navigation-breadcrumbs">
              <div className={`flex items-center ${isPremium ? 'gap-2.5 text-[12.5px] font-semibold tracking-wide' : 'gap-1 text-xs font-bold text-black'}`}>
                <span 
                  className={isPremium ? 'text-zinc-500 uppercase font-mono tracking-wider cursor-default select-none' : 'text-black cursor-default select-none'}
                >{breadcrumbs.root}</span>
                {breadcrumbs.paths.map((p, idx) => (
                  <div key={p} className={`flex items-center ${isPremium ? 'gap-2.5' : 'gap-1'}`}>
                    <span className={isPremium ? 'text-zinc-400 font-bold mx-0.5' : 'text-black font-bold'}>›</span>
                    <span 
                      onClick={() => handleBreadcrumbClick(p)}
                      className={`${
                        idx === breadcrumbs.paths.length - 1 
                          ? (isPremium ? 'text-[#F35D00] font-bold underline decoration-dotted underline-offset-4' : 'text-black font-bold') 
                          : (isPremium ? 'text-zinc-500 hover:text-[#F35D00] transition-colors cursor-pointer hover:underline' : 'text-black cursor-pointer hover:underline')
                      }`}
                    >
                      {p}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC SCREEN SWITCHER INJECT */}
          <div id="active-screen-container">
            {activeScreen === 'module-manager' && (
              <ModuleManager 
                items={moduleDataset} 
                theme={theme} 
                onUpdateItems={setModuleDataset} 
                onShowToast={triggerToast} 
                viewOption={moduleViewOption}
                setViewOption={setModuleViewOption}
              />
            )}

            {activeScreen === 'event-manager' && (
              <EventManager 
                event={eventRecord} 
                theme={theme} 
                onUpdateEvent={setEventRecord} 
                onShowToast={triggerToast} 
                onNavigateToRegistration={() => setActiveScreen('registration-manager')}
                viewOption={eventViewOption}
                setViewOption={setEventViewOption}
              />
            )}

            {activeScreen === 'registration-manager' && (
              <RegistrationManager 
                registration={registrationRecord} 
                theme={theme} 
                onUpdateRegistration={setRegistrationRecord} 
                onShowToast={triggerToast} 
                onNavigateBack={() => setActiveScreen('event-manager')}
              />
            )}

            {activeScreen === 'criteria-manager' && (
              <CriteriaManager 
                items={criteriaDataset} 
                theme={theme} 
                onUpdateItems={setCriteriaDataset} 
                onShowToast={triggerToast} 
              />
            )}

            {activeScreen === 'theme-manager' && (
              <ThemeManager
                theme={theme}
                onShowToast={triggerToast}
              />
            )}

            {activeScreen === 'hotel-manager' && (
              <HotelManager 
                items={hotelDataset} 
                theme={theme} 
                onUpdateItems={setHotelDataset} 
                onShowToast={triggerToast} 
              />
            )}

            {activeScreen === 'employees' && (
              <EmployeeManager 
                theme={theme} 
                onShowToast={triggerToast} 
                initialSearch={sidebarSearch}
                onSelectEmployee={(empId) => {
                  setSelectedEmployeeId(empId);
                  setActiveScreen('employee-detail');
                }}
              />
            )}

            {activeScreen === 'employee-detail' && (
              <EmployeeDetailManager
                employeeId={selectedEmployeeId}
                theme={theme}
                onShowToast={triggerToast}
                onBack={() => setActiveScreen('employees')}
              />
            )}
          </div>

          {/* Simple parity verification notice */}
          {!isPremium && (
            <div className="mt-8 border border-gray-400 bg-gray-100 p-2 text-xs text-black" id="legacy-warning">
              Parity Warning: You are viewing this application in <strong>Legacy UI Theme Mode</strong>. Old styles represent the original .NET WebForms system. 
              Click <strong>"Modern Swiss Enterprise (2028 Design)"</strong> inside the corporate toolbar at the very top of the page to transform the experience.
            </div>
          )}

        </section>

      </div>

    </div>
  );
}
