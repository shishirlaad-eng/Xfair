/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { ThemeConfig, EventData, EmployeeProfile } from './types';
import { THEME_PRESETS, MOCK_EVENT, MOCK_EMPLOYEE } from './data';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ThemeSettingsPage } from './components/ThemeSettingsPage';
import { CreateEventPage } from './components/CreateEventPage';
import { EmployeeProfilePage } from './components/EmployeeProfilePage';
import { AttendanceCalendarPage } from './components/AttendanceCalendarPage';
import { DynamicModulePage } from './components/DynamicModulePage';

const ERP_MODULE_LABELS: { [id: string]: string } = {
  'general-information': 'General Information',
  'event-criteria-values': 'Event criteria values',
  'agenda-manager': 'Agenda manager',
  'agenda-items': 'Agenda items',
  'agenda-templates': 'Agenda templates',
  'checklist': 'Checklist',
  'checklist-items': 'Checklist items',
  'check-in-status': 'Check In Status',
  'service-order-checkin': 'Service Order Checkin',
  'print-namebadge': 'Print Namebadge from QRCode',
  'demo-room': 'Demo room',
  'restaurant': 'Restaurant',
  'meeting-room-booking-search': 'Meeting room booking search',
  'meeting-rooms-manager': 'Meeting rooms manager',
  'meeting-room-groups-manager': 'Meeting room groups manager',
  'seating-planner-manager': 'Seating planner manager',
  'event-manager-conf': 'Event manager',
  'criteria-manager': 'Criteria Manager',
  'criteria-value-manager': 'Criteria value manager',
  'criteria-value-limits': 'Criteria Value Limits',
  'message-templates': 'Message templates',
  'email-templates': 'Email templates',
  'lead-wizard-manager': 'Lead wizard manager',
  'dialing-rules': 'Dialing rules',
  'mobile-apps-manager-conf': 'Mobile apps manager',
  'system-manager-conf': 'System manager',
  'person-report-configuration': 'Person Report Configuration',
  'images-res': 'Images',
  'attachment-manager': 'Attachment manager',
  'module-manager': 'Module manager',
  'fields-manager': 'Fields manager',
  'visitor-report-templates': 'Visitor report templates',
  'resource-editor': 'Resource editor',
  'languages': 'Languages',
  'look-up-values-manager': 'Look-up values manager',
  'countries': 'Countries',
  'rights': 'Rights',
  'report-types-manager': 'Report types manager',
  'product-types': 'Product types',
  'products': 'Products',
  'sales-price-categories': 'Sales price categories',
  'sales-locations': 'Sales locations',
  'sales-printers': 'Sales printers',
  'event-products': 'Event products',
  'event-prices': 'Event prices',
  'sales-orders-overview': 'Sales orders overview',
  'sales-orders-search': 'Sales orders search',
  'event-reports': 'Event reports',
  'system-reports': 'System reports',
  'visitor-reports-overview': 'Visitor reports overview',
  'visitor-statistics-overview': 'Visitor statistics overview',
  'photo-overview': 'Photo overview',
  'hotel-manager': 'Hotel manager',
  'hotel-facilities-manager': 'Hotel facilities manager',
  'hotel-activation': 'Hotel activation',
  'hotel-booking-search': 'Hotel booking search',
  'hotel-booking-overview': 'Hotel booking overview',
  'hotel-request-overview': 'Hotel request overview',
  'order-types': 'Order types',
  'order-item-attributes': 'Order item attributes',
  'orders-search': 'Orders search',
  'orders-seating-planner': 'Orders seating planner',
  'return-tickets': 'Return tickets',
  'service-groups-manager': 'Service groups manager',
  'event-services-manager': 'Event services manager',
  'service-orders-search': 'Service orders search',
  'service-orders-overview': 'Service orders overview',
  'assign-devices-by-scanner': 'Assign devices by scanner',
  'mobile-phones': 'Mobile phones',
  'locker-keys': 'Locker keys',
  'personal-system-log': 'Personal system log',
  'system-log-search': 'System log search',
  'database-search': 'Database search',
  'message-search': 'Message search',
  'log-error-search': 'Log Error Search',
  'groups-search': 'Groups search',
  'grouping-headers-manager': 'Grouping headers manager',
  'matching': 'Matching',
  'grouping': 'Grouping',
  'login-problems': 'Login problems',
  'system-processing': 'System processing',
  'administrative-tasks': 'Administrative tasks',
  'data-import': 'Data import',
  'registration-approval': 'Registration approval',
  'task-scheduler': 'Task scheduler',
  'global-coordinator-configuration': 'Global coordinator configuration',
  'coordinator-approval': 'Coordinator approval',
  'admin-upload-page': 'Admin Upload Page',
  'tech-admin-upload-page': 'Admin Upload Page',
  'tech-sales-locations': 'Sales locations',
  'tech-sales-printers': 'Sales printers',
  'tech-dialing-rules': 'Dialing rules',
  'tech-mobile-apps-manager': 'Mobile apps manager',
  'tech-system-manager': 'System manager',
  'tech-event-configuration': 'Event configuration',
  'tech-client-manager': 'Client manager',
  'tech-access-control-manager': 'Access control manager'
};

export default function App() {
  // Session Access state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false so Login page opens on refresh
  const [sessionUser, setSessionUser] = useState({
    name: 'Mr. Steven Terry',
    role: 'Administrator',
    email: 'admin@xfair.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'
  });

  // Active theme configuration state (XFAIR Classic defaults)
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(THEME_PRESETS[0].theme);

  // Core databases
  const [eventDb, setEventDb] = useState<EventData>(MOCK_EVENT);
  const [employeeDb, setEmployeeDb] = useState<EmployeeProfile>(MOCK_EMPLOYEE);
  const [selectedTenant, setSelectedTenant] = useState('Bauma 2028');

  // Page Routing State: starts with theme settings
  const [activePage, setActivePage] = useState<string>('theme-settings');

  // Keep body or root styles updated dynamically
  useEffect(() => {
    // Inject custom Google font link dynamically if not already present
    const linkId = 'google-fonts-custom';
    let linkElement = document.getElementById(linkId) as HTMLLinkElement;
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = linkId;
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;700&family=DM+Sans:wght@400;500;700&family=Exo+2:wght@400;500;700&family=Figtree:wght@400;500;700&family=Inter:wght@300;400;500;600;700&family=Jost:wght@400;500;700&family=Karla:wght@400;500;700&family=Manrope:wght@400;500;700&family=Montserrat:wght@400;500;700&family=Mulish:wght@400;500;700&family=Noto+Sans:wght@400;500;700&family=Nunito:wght@400;500;700&family=Open+Sans:wght@400;500;700&family=Outfit:wght@400;500;700&family=Overpass:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;700&family=Raleway:wght@400;500;700&family=Roboto:wght@400;500;700&family=Rubik:wght@400;500;700&family=Sora:wght@400;500;700&family=Source+Sans+3:wght@400;500;700&family=Work+Sans:wght@400;500;700&display=swap';
      document.head.appendChild(linkElement);
    }
  }, []);

  const handleLoginSuccess = (role: string, email: string) => {
    setSessionUser(prev => ({
      ...prev,
      role,
      email,
      name: email.includes('terry') ? 'Steven Terry' : 'Mr. Steven Terry'
    }));
    setIsLoggedIn(true);
    setActivePage('event-manager-conf');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Allows sidebar modal creation to add dynamic profile mock updates
  const handleAddEmployeeFromSidebar = (name: string, email: string, functionRole: string) => {
    setEmployeeDb(prev => ({
      ...prev,
      name,
      email,
      position: functionRole,
      criteria: {
        ...prev.criteria,
        companyFunction: [functionRole]
      }
    }));
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'theme-settings':
        return (
          <ThemeSettingsPage 
            currentTheme={activeTheme}
            onThemeChange={(newTheme) => setActiveTheme(newTheme)}
            activeTheme={activeTheme}
          />
        );
      case 'create-event':
      case 'general-information':
      case 'event-manager-conf':
        return (
          <CreateEventPage 
            initialEvent={eventDb}
            onSave={(updated) => setEventDb(updated)}
            activeTheme={activeTheme}
            onNavigate={(page) => setActivePage(page)}
          />
        );
      case 'employee-profile':
        return (
          <EmployeeProfilePage 
            employee={employeeDb}
            onChangeEmployee={(updated) => setEmployeeDb(updated)}
            activeTheme={activeTheme}
            onNavigateToCalendar={() => setActivePage('attendance-calendar')}
          />
        );
      case 'attendance-calendar':
      case 'check-in-status':
        return (
          <AttendanceCalendarPage 
            employee={employeeDb}
            onChangeEmployee={(updated) => setEmployeeDb(updated)}
            activeTheme={activeTheme}
          />
        );
      default: {
        const moduleLabel = ERP_MODULE_LABELS[activePage] || 'Event Dashboard Module';
        return (
          <DynamicModulePage 
            moduleId={activePage}
            moduleLabel={moduleLabel}
            activeTheme={activeTheme}
          />
        );
      }
    }
  };

  // Login view is completely standalone, with no surrounding sidebars or footers
  if (!isLoggedIn) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        activeTheme={activeTheme}
      />
    );
  }

  return (
    <div 
      className="min-h-screen flex selection:bg-orange-500 selection:text-white"
      style={{ 
        backgroundColor: activeTheme.backgroundColor, 
        fontFamily: activeTheme.fontFamily,
        color: activeTheme.textColor
      }}
    >
      {/* Dynamic Left Sidebar Tool */}
      <Sidebar 
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        activeTheme={activeTheme}
        onLogout={handleLogout}
        onAddEmployeeMock={handleAddEmployeeFromSidebar}
      />

      {/* Right Core Content layout */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Header Topbar */}
        <Header 
          activePage={activePage}
          activeTheme={activeTheme}
          currentUser={sessionUser}
          selectedTenant={selectedTenant}
          onTenantChange={(val) => {
            setSelectedTenant(val);
            if (val.includes('Bauma')) {
              setEventDb({
                ...eventDb,
                name: 'Bauma 2028',
                id: 160,
                website: 'https://bauma.de/'
              });
            } else {
              setEventDb({
                ...eventDb,
                name: 'Munich Expo 2028',
                id: 412,
                website: 'https://munich-expo.com/'
              });
            }
          }}
        />

        {/* Dynamic Sandbox Workspace Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderActivePage()}
        </main>

        {/* Modular Footers bar */}
        <footer className="py-4 border-t px-8 flex justify-center text-[11px] text-neutral-400 font-mono bg-white/40" style={{ borderColor: activeTheme.borderColor }}>
          <div className="flex items-center gap-4">
            <a href="#imprint" className="hover:text-neutral-600 transition-colors">Imprint</a>
            <a href="#privacy" className="hover:text-neutral-600 transition-colors">Privacy</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
