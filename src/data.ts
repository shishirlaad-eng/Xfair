/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeConfig, EventData, EmployeeProfile, ThemePreset } from './types';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'xfair-classic',
    name: 'XFAIR Brand Classic',
    theme: {
      companyName: 'XFAIR.org',
      logoUrl: '', // Will render custom vector in component if empty
      faviconUrl: '',
      loginBackgroundUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      emailHeaderLogoUrl: '',
      primaryColor: '#f89728',
      secondaryColor: '#1E1E24',
      accentColor: '#F6F6F6',
      successColor: '#10B981',
      warningColor: '#F59E0B',
      errorColor: '#EF4444',
      infoColor: '#3B82F6',
      textColor: '#1F2937',
      backgroundColor: '#F6F6F6',
      cardColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'stripe-minimal',
    name: 'Stripe Slate Dashboard',
    theme: {
      companyName: 'XFAIR Enterprise',
      logoUrl: '',
      faviconUrl: '',
      loginBackgroundUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop',
      emailHeaderLogoUrl: '',
      primaryColor: '#635BFF',
      secondaryColor: '#0A85EA',
      accentColor: '#7970FF',
      successColor: '#00D4B2',
      warningColor: '#FFB800',
      errorColor: '#FF2E74',
      infoColor: '#00D4B2',
      textColor: '#0A2540',
      backgroundColor: '#FAFCFF',
      cardColor: '#FFFFFF',
      borderColor: '#ECEFF1',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'linear-dark',
    name: 'Linear Obsidian Theme',
    theme: {
      companyName: 'XFAIR Pro',
      logoUrl: '',
      faviconUrl: '',
      loginBackgroundUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop',
      emailHeaderLogoUrl: '',
      primaryColor: '#5E6AD2',
      secondaryColor: '#FF4757',
      accentColor: '#848EED',
      successColor: '#2ED573',
      warningColor: '#FFA502',
      errorColor: '#FF4757',
      infoColor: '#1E90FF',
      textColor: '#F1F2F6',
      backgroundColor: '#121214',
      cardColor: '#1C1C1F',
      borderColor: '#2D2D34',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'monday-creative',
    name: 'Monday.com Energetic',
    theme: {
      companyName: 'XFAIR Creative',
      logoUrl: '',
      faviconUrl: '',
      loginBackgroundUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
      emailHeaderLogoUrl: '',
      primaryColor: '#00C875',
      secondaryColor: '#FFCB00',
      accentColor: '#0085FF',
      successColor: '#00C87GREEN',
      warningColor: '#FFCB00',
      errorColor: '#E2445C',
      infoColor: '#0085FF',
      textColor: '#2E2D32',
      backgroundColor: '#F7F8F9',
      cardColor: '#FFFFFF',
      borderColor: '#E1E4E6',
      fontFamily: 'Inter',
    },
  }
];

export const MOCK_EVENT: EventData = {
  id: 160,
  name: 'Bauma 2028',
  address: '31366 Blue Laguna Street, 85716, Unterschleissheim, Bayern, Germany',
  startDate: '2028-03-03',
  endDate: '2028-03-10',
  attendanceDaysBefore: 2,
  attendanceDaysAfter: 1,
  hotelDaysBefore: 2,
  hotelDaysAfter: 2,
  timezone: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
  eventType: 'Trade Fair',
  currency: 'Euro',
  website: 'https://bauma.de/',
  externalIdentifier: 'test20250',
  externalIdentifierCode: 'test2024',
  active: true,
  image: 'ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png',
  pdfSummaryMail: { name: 'bauma2028_summary_layout_v2.pdf', size: '2.4 MB' },
  pdfTemplateHotel: { name: 'hotel_booking_voucher_template.pdf', size: '1.1 MB' },
  availableRegistrations: [
    'Add New Employee (Appointment)',
    'Add New Visitor (Appointment)',
    'New Registration - Custom Host',
    'VIP Customer Self-Registration',
    'Exhibitor Standard Registration',
    'Survey 2028 Feedback Form',
    'Visitor Registration 2028 Pool',
    'Employee Registration 2028 Standard'
  ],
  configurationModules: [
    'Client manager',
    'Event module manager',
    'Event fields manager',
    'Event order manager',
    'Event order configuration',
    'Event permissions',
    'Event criteria manager',
    'Criteria group manager',
    'Access control manager',
    'Email addresses manager',
    'Email templates',
    'Visitor report templates',
    'Dynamic page content manager',
    'Event wallet',
    'Event fairdays and timeslots',
    'Time slot / function',
    'Event taxes',
    'Event invoices manager',
    'Event API manager',
    'Mobile phones',
    'Locker keys'
  ],
};

export const MOCK_EMPLOYEE: EmployeeProfile = {
  id: 'EMP-902',
  name: 'Mr. Steven Terry',
  company: 'XFAIR GmbH',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', // Realistic avatar
  position: 'Head of Development',
  department: 'Development',
  costCenter: 'XFAIR',
  email: 'steven.terry@xfair.com',
  phone: '+4989309096829',
  mobile: '+4917619096829',
  companyAddress: 'Elisabeth-Schiemann-Bogen 1, 85716, Unterschleißheim, Germany',
  criteria: {
    areas: ['Fair'],
    businessUnit: ['Business unit 22'],
    companyFunction: ['Security'],
    countryResponsibility: ['Argentina', 'Azerbaijan', 'South Africa'],
    executives: ['Executive: Mr. Test 1', 'Assistant: Mrs. Test 2'],
    foodPreferences: ['english'],
    industrySegment: ['Automotive'],
    languages: [
      'Afrikaans', 'Albanian', 'Arabic (Algeria)', 'English', 'English (Australia)',
      'English (USA)', 'French', 'Hebrew', 'Italian', 'Lithuanian',
      'Other 1: swahilki', 'Serbian', 'Spanish'
    ],
    productGroup: ['Computer', 'Fair Services & \' ; , Network'],
  },
  appointments: [
    {
      id: 'APT-101',
      room: 'Common room',
      subject: 'Common Room Welcome and Briefing',
      time: '3/1/2028 7:00 AM - 7:10 AM',
      details: 'Kick-off and health-and-safety guidelines review with the team.'
    },
    {
      id: 'APT-102',
      room: 'Room 1',
      subject: 'Meeting with Coca Cola team',
      time: '3/1/2028 7:30 AM - 8:15 AM',
      details: 'Review tech stack demo for the main stand displays.'
    },
    {
      id: 'APT-103',
      room: 'Main Hall',
      subject: 'VIP Keynote Presentation',
      time: '3/4/2028 10:00 AM - 11:30 AM',
      details: 'Speech regarding decentralized stand technologies.'
    }
  ],
  services: [
    {
      id: 'SRV-001',
      name: 'Morning day1 Catering Stand setup & briefing',
      time: '3/3/2028 8:00 AM - 12:00 PM',
      status: 'Confirmed'
    },
    {
      id: 'SRV-002',
      name: 'Product Trial Run & Network latency check',
      time: '3/3/2028 8:00 AM - 8:00 PM',
      status: 'Confirmed'
    },
    {
      id: 'SRV-003',
      name: 'Evening Reception Technical Lead Presence',
      time: '3/6/2028 6:00 PM - 10:00 PM',
      status: 'Pending'
    }
  ],
  deputies: ['Mr. Arslan Anwar Khawaja', 'Mr. Chirag Patel'],
  attendance: {
    1: 'none',
    2: 'none',
    3: 'none',
    4: 'present',
    5: 'present',
    6: 'present',
    7: 'present',
    8: 'present',
    9: 'present',
    10: 'present',
    11: 'none',
    12: 'none',
    13: 'absent',
    14: 'present',
    15: 'present',
    16: 'none',
    17: 'none',
    18: 'present',
    19: 'present',
    20: 'present',
    21: 'present',
    22: 'none',
    23: 'none',
    24: 'present',
    25: 'pending',
    26: 'pending'
  }
};
