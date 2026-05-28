/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModuleItem, EventItem, RegistrationItem, CriteriaItem, HotelItem } from './types';

export const INITIAL_MODULE_ITEMS: ModuleItem[] = [
  {
    id: 30,
    active: true,
    name: 'Access Control',
    code: 'accesscontrol',
    translations: [
      { lang: 'US', value: 'Access Control' },
      { lang: 'UK', value: 'Access Control' },
      { lang: 'DE', value: 'Zutrittskontrolle' }
    ],
    descriptionTranslations: [
      { lang: 'US', value: 'System of granting or denying access.' },
      { lang: 'UK', value: 'System of granting or denying access.' },
      { lang: 'DE', value: 'System zur Gewährung oder Verweigerung des Zugangs.' }
    ],
    path: '~/Persons/AccessControl.aspx',
    registrationPath: '~/Registration/Modules/AccessControl.aspx',
    alwaysActive: false,
    isLogged: true,
    moduleForRegistration: true
  },
  {
    id: 36,
    active: true,
    name: 'Accompanying person (single)',
    code: 'singleaccompanyingperson',
    translations: [
      { lang: 'US', value: 'Accompanying person (single)' },
      { lang: 'UK', value: 'Accompanying person (single)' },
      { lang: 'DE', value: 'Begleitperson (Einzel)' }
    ],
    descriptionTranslations: [
      { lang: 'US', value: 'Used to enter a single accompanying person (or guest).' },
      { lang: 'UK', value: 'Used to enter a single accompanying person (or guest).' },
      { lang: 'DE', value: 'Dient zur Erfassung einer einzelnen Begleitperson (oder eines Gastes).' }
    ],
    path: '~/Persons/AccompanyingPersons.aspx',
    registrationPath: '~/Registration/Modules/SingleResponsiblePersonModule.aspx',
    alwaysActive: false,
    isLogged: true,
    moduleForRegistration: true
  },
  {
    id: 37,
    active: false,
    name: 'Accompanying persons',
    code: 'multipleaccompanyingpersons',
    translations: [
      { lang: 'US', value: 'Accompanying persons' },
      { lang: 'UK', value: 'Accompanying persons' },
      { lang: 'DE', value: 'Begleitpersonen' }
    ],
    descriptionTranslations: [
      { lang: 'US', value: 'Group of accompanying persons.' },
      { lang: 'UK', value: 'Group of accompanying persons.' },
      { lang: 'DE', value: 'Liste von Begleitpersonen.' }
    ],
    path: '~/Persons/GroupAccompanying.aspx',
    registrationPath: '~/Registration/Modules/GroupAccompanying.aspx',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 38,
    active: false,
    name: 'Add new employee',
    code: 'addemployee',
    translations: [
      { lang: 'US', value: 'Add new employee' },
      { lang: 'UK', value: 'Add new employee' },
      { lang: 'DE', value: 'Mitarbeiter hinzufügen' }
    ],
    descriptionTranslations: [
      { lang: 'US', value: 'Wizard for adding a new employee' },
      { lang: 'UK', value: 'Wizard for adding a new employee' },
      { lang: 'DE', value: 'Assistent zum Hinzufügen von Mitarbeitern' }
    ],
    path: '~/Employee/Add.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: true,
    moduleForRegistration: false
  },
  {
    id: 39,
    active: false,
    name: 'Add new visitor',
    code: 'addvisitor',
    translations: [
      { lang: 'US', value: 'Add new visitor' },
      { lang: 'UK', value: 'Add new visitor' },
      { lang: 'DE', value: 'Besucher hinzufügen' }
    ],
    descriptionTranslations: [
      { lang: 'US', value: 'Wizard for registering custom visitors' },
      { lang: 'UK', value: 'Wizard for registering custom visitors' },
      { lang: 'DE', value: 'Assistent zum Hinzufügen von Besuchern des Events' }
    ],
    path: '~/Visitor/Add.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: true
  },
  {
    id: 40,
    active: false,
    name: 'Advanced Search - Employee',
    code: 'advsearchemployee',
    translations: [
      { lang: 'US', value: 'Advanced Search - Employee' },
      { lang: 'UK', value: 'Advanced Search - Employee' },
      { lang: 'DE', value: 'Erweiterte Suche - Mitarbeiter' }
    ],
    descriptionTranslations: [],
    path: '~/Search/Employee.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 41,
    active: false,
    name: 'Advanced Search - Visitor',
    code: 'advsearchvisitor',
    translations: [],
    descriptionTranslations: [],
    path: '~/Search/Visitor.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 42,
    active: false,
    name: 'Appointment request',
    code: 'appointmentrequest',
    translations: [],
    descriptionTranslations: [],
    path: '~/Request/Appointment.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: true
  },
  {
    id: 43,
    active: false,
    name: 'Attendance',
    code: 'attendance',
    translations: [],
    descriptionTranslations: [],
    path: '~/Attendance/Overview.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: true,
    moduleForRegistration: false
  },
  {
    id: 44,
    active: false,
    name: 'Attendance / time',
    code: 'attendancetime',
    translations: [],
    descriptionTranslations: [],
    path: '~/Attendance/TimeTrack.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 45,
    active: false,
    name: 'Attendance by month',
    code: 'attendancemonth',
    translations: [],
    descriptionTranslations: [],
    path: '~/Attendance/MonthlyReport.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 46,
    active: false,
    name: 'Attendance with tasks and functions',
    code: 'attendancetasks',
    translations: [],
    descriptionTranslations: [],
    path: '~/Attendance/Tasks.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: true,
    moduleForRegistration: false
  },
  {
    id: 47,
    active: false,
    name: 'Attendance with Timeslots',
    code: 'attendancetimeslots',
    translations: [],
    descriptionTranslations: [],
    path: '~/Attendance/Timeslots.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 48,
    active: false,
    name: 'Attending',
    code: 'attending',
    translations: [],
    descriptionTranslations: [],
    path: '~/Attendance/Attending.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 49,
    active: false,
    name: 'Brochure Item',
    code: 'brochureitem',
    translations: [],
    descriptionTranslations: [],
    path: '~/Items/Brochures.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 50,
    active: false,
    name: 'Calendar',
    code: 'calendar',
    translations: [],
    descriptionTranslations: [],
    path: '~/Tools/Calendar.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 51,
    active: false,
    name: 'Company coordinators',
    code: 'companycoordinators',
    translations: [],
    descriptionTranslations: [],
    path: '~/Coordinators/Company.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 52,
    active: false,
    name: 'Coordinator - Add new Person',
    code: 'coordinatoraddperson',
    translations: [],
    descriptionTranslations: [],
    path: '~/Coordinators/AddPerson.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 53,
    active: false,
    name: 'Create account',
    code: 'createaccount',
    translations: [],
    descriptionTranslations: [],
    path: '~/Profile/Security.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 54,
    active: false,
    name: 'Credit card',
    code: 'creditcard',
    translations: [],
    descriptionTranslations: [],
    path: '~/Billing/CreditCard.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 55,
    active: false,
    name: 'Criteria',
    code: 'criteria',
    translations: [],
    descriptionTranslations: [],
    path: '~/Settings/Criteria.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 56,
    active: false,
    name: 'Criteria groups',
    code: 'criteriagroups',
    translations: [],
    descriptionTranslations: [],
    path: '~/Settings/CriteriaGroups.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  },
  {
    id: 57,
    active: false,
    name: 'Data security',
    code: 'datasecurity',
    translations: [],
    descriptionTranslations: [],
    path: '~/Settings/SecurityRegulations.aspx',
    registrationPath: '',
    alwaysActive: false,
    isLogged: false,
    moduleForRegistration: false
  }
];

export const INITIAL_EVENT: EventItem = {
  id: 160,
  name: 'Bauma 2028',
  address: '3166 Blue Laguna Street, 85716, Unterschleissheim, Bayern, Germany',
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
  isTemplate: false
};

export const INITIAL_REGISTRATION: RegistrationItem = {
  id: 168,
  type: 'Visitor',
  active: true,
  onePage: false,
  nameTranslations: [
    { lang: 'US', value: 'Visitor Registration 2028' },
    { lang: 'UK', value: 'Visitor Registration 2028' },
    { lang: 'DE', value: 'Besucherregistrierung 2028' }
  ],
  customTextTranslations: [
    { lang: 'US', value: '' },
    { lang: 'UK', value: '' },
    { lang: 'DE', value: '' }
  ],
  startDate: '2025-11-14',
  endDate: '2028-03-08',
  attendanceStartDate: '2028-03-03',
  attendanceEndDate: '2028-03-08',
  hotelArrivalDate: '2028-03-01',
  hotelDepartureDate: '2028-03-09',
  hotelStartDate: '2028-03-03',
  hotelEndDate: '2028-03-09',
  restrictedUrl: 'https://www.xfair.org/ems_test/Registration/default.aspx?REGID=D26DC638-2F3E-4145-80F3-53E7223ABEC3',
  redirectUrl: 'https://www.xfair.org/ems_testrd/registration',
  redirectUrlLogout: '',
  redirectUrlNotAttending: 'https://www.xfair.org/ems_testrd/registration',
  status: 'Production'
};

export const INITIAL_CRITERIA_ITEMS: CriteriaItem[] = [
  {
    id: 1001,
    name: 'Areas',
    active: true,
    shortNameTranslations: [
      { lang: 'US', value: 'Areas' },
      { lang: 'UK', value: 'Areas' },
      { lang: 'DE', value: 'Bereiche' }
    ],
    criteriaTranslations: [
      { lang: 'US', value: 'Areas' },
      { lang: 'UK', value: 'Areas' },
      { lang: 'DE', value: 'Bereiche' }
    ],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: true
  },
  {
    id: 1002,
    name: 'Business unit',
    active: true,
    shortNameTranslations: [
      { lang: 'US', value: 'Business unit' },
      { lang: 'UK', value: 'Business unit' },
      { lang: 'DE', value: 'Geschäftsbereich' }
    ],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: false
  },
  {
    id: 1006,
    name: 'Company Function',
    active: true,
    shortNameTranslations: [
      { lang: 'US', value: 'Company Function' },
      { lang: 'UK', value: 'Company Function' },
      { lang: 'DE', value: 'Funktion in der Firma' }
    ],
    criteriaTranslations: [
      { lang: 'US', value: 'Company Function' },
      { lang: 'UK', value: 'Company Function' },
      { lang: 'DE', value: 'Funktion in der Firma' }
    ],
    descriptionTranslations: [
      { lang: 'US', value: 'Please select your function in the company.' },
      { lang: 'UK', value: 'Please select your function in the company.' },
      { lang: 'DE', value: 'Bitte geben Sie Ihre Funktion im Unternehmen ein.' }
    ],
    type: 'Employee',
    additionalComments: false,
    multiSelect: true
  },
  {
    id: 1007,
    name: 'Country Responsibility',
    active: true,
    shortNameTranslations: [
      { lang: 'US', value: 'Country Responsibility' },
      { lang: 'UK', value: 'Country Responsibility' },
      { lang: 'DE', value: 'Länderverantwortung' }
    ],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: true,
    multiSelect: true
  },
  {
    id: 1008,
    name: 'Department',
    active: true,
    shortNameTranslations: [
      { lang: 'US', value: 'Department' },
      { lang: 'DE', value: 'Abteilung' }
    ],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: false
  },
  {
    id: 1009,
    name: 'Division',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: false
  },
  {
    id: 1010,
    name: 'Employee Department Criteria',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: true
  },
  {
    id: 1011,
    name: 'Executives',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: false
  },
  {
    id: 1012,
    name: 'Fair function',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: false
  },
  {
    id: 1013,
    name: 'Flags on Badge',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: true
  },
  {
    id: 1014,
    name: 'Food preferences',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: true,
    multiSelect: true
  },
  {
    id: 1015,
    name: 'Function',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: false
  },
  {
    id: 1016,
    name: 'Industry segment',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: false
  },
  {
    id: 1017,
    name: 'Kick-Off-Meeting',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: false
  },
  {
    id: 1018,
    name: 'Languages',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: true
  },
  {
    id: 1019,
    name: 'Product Group',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: true
  },
  {
    id: 1020,
    name: 'Product Responsibility',
    active: true,
    shortNameTranslations: [],
    criteriaTranslations: [],
    descriptionTranslations: [],
    type: 'Employee',
    additionalComments: false,
    multiSelect: true
  }
];

export const INITIAL_HOTEL_ITEMS: HotelItem[] = [
  {
    id: 201,
    active: true,
    name: 'Mariotte',
    stars: 5,
    area: '',
    address: '',
    contingents: 2
  },
  {
    id: 202,
    active: true,
    name: 'Murree Hotel',
    stars: 3,
    area: 'Main City',
    address: 'Ohmstrasse 1, 85716, Unterschleissheim, Germany',
    contingents: 2
  },
  {
    id: 203,
    active: true,
    name: 'New hotel',
    stars: 0,
    area: '',
    address: '',
    contingents: 0
  },
  {
    id: 204,
    active: true,
    name: 'Pearl Continental',
    stars: 5,
    area: 'Central Munich',
    address: 'Frankfurterstr 1000, 97638, Bali, Angola',
    contingents: 1
  },
  {
    id: 205,
    active: true,
    name: 'Taj Hotels',
    stars: 4,
    area: 'Mountains and Hills',
    address: 'Hausmehringerstr. 1, 85405, Nandlstadt, Germany',
    contingents: 2
  }
];
