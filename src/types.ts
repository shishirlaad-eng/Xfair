/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeConfig {
  companyName: string;
  logoUrl: string;
  faviconUrl: string;
  loginBackgroundUrl: string;
  emailHeaderLogoUrl: string;
  
  // Color configuration
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  textColor: string;
  backgroundColor: string;
  cardColor: string;
  borderColor: string;
  
  // Typography
  fontFamily: string;
  
  // Login customization
  loginMainTitle?: string;
  loginSubTitle?: string;
}

export interface EventData {
  id: number;
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  attendanceDaysBefore: number;
  attendanceDaysAfter: number;
  hotelDaysBefore: number;
  hotelDaysAfter: number;
  timezone: string;
  eventType: string;
  currency: string;
  website: string;
  externalIdentifier: string;
  externalIdentifierCode: string;
  active: boolean;
  image: string;
  pdfSummaryMail?: { name: string; size: string };
  pdfTemplateHotel?: { name: string; size: string };
  availableRegistrations: string[];
  configurationModules: string[];
}

export interface Appointment {
  id: string;
  room: string;
  subject: string;
  time: string;
  details: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface EmployeeProfile {
  id: string;
  name: string;
  company: string;
  avatar: string;
  position: string;
  department: string;
  costCenter: string;
  email: string;
  phone: string;
  mobile: string;
  companyAddress: string;
  criteria: {
    areas: string[];
    businessUnit: string[];
    companyFunction: string[];
    countryResponsibility: string[];
    executives: string[];
    foodPreferences: string[];
    industrySegment: string[];
    languages: string[];
    productGroup: string[];
  };
  appointments: Appointment[];
  services: ServiceItem[];
  deputies: string[];
  // Day-by-day attendance status for March 2028
  attendance: { [day: number]: 'present' | 'absent' | 'pending' | 'none' };
}

export interface ThemePreset {
  id: string;
  name: string;
  theme: ThemeConfig;
}
