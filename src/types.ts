/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationField {
  lang: 'US' | 'UK' | 'DE';
  value: string;
}

export interface ModuleItem {
  id: number;
  active: boolean;
  name: string;
  code: string;
  translations: TranslationField[];
  descriptionTranslations: TranslationField[];
  path: string;
  registrationPath: string;
  alwaysActive: boolean;
  isLogged: boolean;
  moduleForRegistration: boolean;
}

export interface EventItem {
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
  isTemplate: boolean;
}

export interface RegistrationItem {
  id: number;
  type: string;
  active: boolean;
  onePage: boolean;
  nameTranslations: TranslationField[];
  customTextTranslations: TranslationField[];
  startDate: string;
  endDate: string;
  attendanceStartDate: string;
  attendanceEndDate: string;
  hotelArrivalDate: string;
  hotelDepartureDate: string;
  hotelStartDate: string;
  hotelEndDate: string;
  restrictedUrl: string;
  redirectUrl: string;
  redirectUrlLogout: string;
  redirectUrlNotAttending: string;
  status: string;
}

export interface CriteriaItem {
  id: number;
  name: string;
  active: boolean;
  shortNameTranslations: TranslationField[];
  criteriaTranslations: TranslationField[];
  descriptionTranslations: TranslationField[];
  type: string;
  additionalComments: boolean;
  multiSelect: boolean;
}

export interface HotelItem {
  id: number;
  active: boolean;
  name: string;
  stars: number;
  area: string;
  address: string;
  contingents: number;
}

export type ActiveScreen =
  | 'module-manager'
  | 'event-manager'
  | 'registration-manager'
  | 'criteria-manager'
  | 'theme-manager'
  | 'hotel-manager'
  | 'employees'
  | 'employee-detail';

export interface ThemeSettings {
  mode: 'premium' | 'legacy';
}
