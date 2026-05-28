import { useState, useEffect, useRef } from 'react';
import { ThemeSettings } from '../types';
import { 
  ArrowLeft, Save, Plus, Trash, Upload, Folder, ShieldAlert,
  ChevronRight, Calendar, User, Info, Smartphone, Mail, FileText, CheckCircle2, QrCode, ChevronDown, Paperclip, ChevronUp, Clock,
  Edit2, Trash2
} from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[] | string[];
  isPremium?: boolean;
}

function CustomSelect({ value, onChange, options, isPremium = true }: CustomSelectProps) {
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

  const triggerClass = isPremium
    ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none hover:border-[#F35D00]/40 flex items-center justify-between font-semibold cursor-pointer select-none transition-all shadow-3xs'
    : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black cursor-pointer font-bold flex items-center justify-between select-none';

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClass}
      >
        <span className="truncate pr-1">{selectedOpt.label}</span>
        <ChevronDown 
          className="w-4 h-4 shrink-0 transition-transform duration-150 text-zinc-500" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} 
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
                className={`w-full text-left px-4 py-2 text-xs transition-colors duration-100 font-semibold truncate ${
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

interface CriteriaMultiSelectProps {
  activeType: string;
  value: string;
  onChange: (val: string) => void;
  isPremium: boolean;
}

function CriteriaMultiSelect({ activeType, value, onChange, isPremium }: CriteriaMultiSelectProps) {
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

  const options = (() => {
    switch (activeType) {
      case 'food':
        return ['Vegan', 'Kosher', 'Halal', 'Chinese Cuisine', 'Indian Cuisine'];
      case 'hotel':
        return ['Single Bed Standard', 'Double Bed Deluxe', 'Shared King Suite'];
      case 'shuttle':
        return ['Morning Pickup Needed', 'No Pickups', 'VIP Private Sedan'];
      case 'language':
        return ['German Speaker', 'Spanish Representative', 'Mandarin Translator'];
      default:
        return [];
    }
  })();

  const selectedValues = value ? value.split(', ').filter(Boolean) : [];

  const handleToggle = (opt: string) => {
    let nextValues: string[];
    if (selectedValues.includes(opt)) {
      nextValues = selectedValues.filter(v => v !== opt);
    } else {
      nextValues = [...selectedValues, opt];
    }
    onChange(nextValues.join(', '));
  };

  const triggerText = selectedValues.length > 0 ? selectedValues.join(', ') : 'Please select';

  const triggerClass = isPremium
    ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none hover:border-[#F35D00]/40 flex items-center justify-between font-semibold cursor-pointer select-none transition-all shadow-3xs'
    : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black cursor-pointer font-bold flex items-center justify-between select-none';

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClass}
      >
        <span className="truncate pr-1">{triggerText}</span>
        <ChevronDown 
          className="w-4 h-4 shrink-0 transition-transform duration-150 text-zinc-500" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-zinc-200 rounded-lg shadow-lg py-1 animate-fade-in custom-scrollbar">
          {options.map((opt) => {
            const isSel = selectedValues.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleToggle(opt)}
                className={`w-full text-left px-4 py-2.5 text-xs transition-all duration-105 font-semibold flex items-center gap-2.5 truncate ${
                  isSel
                    ? 'bg-[#FFE7D6] text-[#F35D00] font-extrabold'
                    : 'text-zinc-700 hover:bg-[#FFE7D6]/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSel}
                  onChange={() => {}}
                  className="rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00]/30 h-4 w-4 shrink-0 cursor-pointer accent-[#F35D00]"
                />
                <span className="truncate">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface EmployeeDetailManagerProps {
  employeeId: number | null;
  theme: ThemeSettings;
  onShowToast: (msg: string) => void;
  onBack: () => void;
}

export default function EmployeeDetailManager({ employeeId, theme, onShowToast, onBack }: EmployeeDetailManagerProps) {
  const isPremium = theme.mode === 'premium';

  // Local state to simulate form fields matching ALL images strictly!
  // Photo & Attachment variables
  const [profileImage, setProfileImage] = useState<string>('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256');
  const [hasBusinessCard, setHasBusinessCard] = useState<boolean>(false);
  const [hasSignatureImage, setHasSignatureImage] = useState<boolean>(false);

  // Section A: Personal Data state
  const [salutation, setSalutation] = useState<string>('Mr.');
  const [firstName, setFirstName] = useState<string>('Sergey');
  const [lastName, setLastName] = useState<string>('Cherniavsky');
  const [email, setEmail] = useState<string>('Sergey.Cherniavsky@xfair.com');
  const [emailComm, setEmailComm] = useState<string>('Sergey.Cherniavsky@xfair.com');
  const [birthdayDate, setBirthdayDate] = useState<string>('1988-06-04');
  const [nationality, setNationality] = useState<string>('German');
  const [personCustomLookUp1, setPersonCustomLookUp1] = useState<string>('No & yes');
  const [personCustomField1, setPersonCustomField1] = useState<string>('Software Developer Senior Level');
  const [title, setTitle] = useState<string>('none');
  const [position, setPosition] = useState<string>('Software Developer');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('English (UK)');
  const [comment, setComment] = useState<string>('Responsible for EMS core modules development and Swiss theme integration.');
  const [department, setDepartment] = useState<string>('Software Development');
  const [costCenter, setCostCenter] = useState<string>('XFAIR & xfair');
  const [cardName, setCardName] = useState<string>('Exhibitor');
  const [employeeType, setEmployeeType] = useState<string>('Employee');
  const [accompanyingCount, setAccompanyingCount] = useState<string>('0');
  const [personCustomField3, setPersonCustomField3] = useState<string>('');
  const [personCustomField4, setPersonCustomField4] = useState<string>('rrr');
  const [personCustomField5, setPersonCustomField5] = useState<string>('sss');
  const [externalIdentifier1, setExternalIdentifier1] = useState<string>('');
  const [matchedStatus, setMatchedStatus] = useState<string>('Not actioned');
  const [personCustomLookUp2, setPersonCustomLookUp2] = useState<string>('1');
  const [personCustomLookUp3, setPersonCustomLookUp3] = useState<string>('a');
  const [personCustomLookUp4, setPersonCustomLookUp4] = useState<string>('Like');

  // Section B: Private Address state
  const [privateAddress, setPrivateAddress] = useState<string>('Elisabeth-Schiemann-Bogen 1');
  const [houseNumber, setHouseNumber] = useState<string>('1');
  const [poBox, setPoBox] = useState<string>('PO-85716');
  const [postCode, setPostCode] = useState<string>('85716');
  const [cityUS, setCityUS] = useState<string>('Unterschleißheim');
  const [cityGB, setCityGB] = useState<string>('Unterschleißheim');
  const [cityDE, setCityDE] = useState<string>('Unterschleißheim');
  const [isCityExpanded, setIsCityExpanded] = useState<boolean>(false);
  const [county, setCounty] = useState<string>('Bayern');
  const [country, setCountry] = useState<string>('Germany');

  // Section C: Contact state
  const [telPrefix, setTelPrefix] = useState<string>('Germany (+49)');
  const [telArea, setTelArea] = useState<string>('89');
  const [telNumber, setTelNumber] = useState<string>('45214750');
  const [faxPrefix, setFaxPrefix] = useState<string>('Please select');
  const [faxArea, setFaxArea] = useState<string>('');
  const [faxNumber, setFaxNumber] = useState<string>('');
  const [mobilePrefix, setMobilePrefix] = useState<string>('Germany (+49)');
  const [mobileArea, setMobileArea] = useState<string>('176');
  const [mobileNumber, setMobileNumber] = useState<string>('19096811');
  const [mobilePhonesCustom, setMobilePhonesCustom] = useState<string>('+4917619096812, +4917619096813');

  // Section D: Company state
  const [companyName, setCompanyName] = useState<string>('XFAIR GmbH');
  const [companyAddressId, setCompanyAddressId] = useState<string>('Elisabeth-Schiemann-Bogen 1, 85716, Unterschleißheim, Germany');

  // Section E: Approver state
  const [approverEmail, setApproverEmail] = useState<string>('approvals@xfair.com');

  // Section F: Codes state
  const [transponderCode, setTransponderCode] = useState<string>('B09A88AC04');
  const [qrCodeVal, setQrCodeVal] = useState<string>('20473');
  const [barcodeVal, setBarcodeVal] = useState<string>('20473');

  // Section G: Fairdays state
  const [fairdaysAllSelected, setFairdaysAllSelected] = useState<boolean>(false);
  const [isFairdaysDropdownOpen, setIsFairdaysDropdownOpen] = useState<boolean>(false);
  const [fairdays, setFairdays] = useState<Array<{ id: number; date: string; weekday: string; isChecked: boolean }>>([
    { id: 1, date: '01 March', weekday: 'Wednesday', isChecked: false },
    { id: 2, date: '02 March', weekday: 'Thursday', isChecked: false },
    { id: 3, date: '03 March', weekday: 'Friday', isChecked: true },
    { id: 4, date: '04 March', weekday: 'Saturday', isChecked: true },
    { id: 5, date: '05 March', weekday: 'Sunday', isChecked: true },
    { id: 6, date: '06 March', weekday: 'Monday', isChecked: true },
    { id: 7, date: '07 March', weekday: 'Tuesday', isChecked: true },
    { id: 8, date: '08 March', weekday: 'Wednesday', isChecked: true },
    { id: 9, date: '09 March', weekday: 'Thursday', isChecked: true },
    { id: 10, date: '10 March', weekday: 'Friday', isChecked: true },
    { id: 11, date: '11 March', weekday: 'Saturday', isChecked: false },
  ]);

  // Section H/I state: Merged Criteria
  const [criteriaList, setCriteriaList] = useState([
    { id: 'country', name: 'Country Responsibility', value: 'Azerbaijan', prefix: '🇦🇿', highlight: false },
    { id: 'product', name: 'Product Group', value: 'Software - EMS, Fair Services & *', prefix: '', highlight: false },
    { id: 'function', name: 'Company Function', value: 'Projectmanagement', prefix: '', highlight: true },
    { id: 'executives', name: 'Executives', value: 'Executive: Mr. Test 1, Assistant: Mrs. Test 2', prefix: '', highlight: false },
    { id: 'unit', name: 'Business unit', value: 'Business unit 22', prefix: '', highlight: false },
    { id: 'areas', name: 'Areas', value: 'Sonstige: Fair', prefix: '', highlight: false }
  ]);

  const [activeCriteriaType, setActiveCriteriaType] = useState<string>('');
  const [activeCriteriaValue, setActiveCriteriaValue] = useState<string>('');

  // Section J: Data Protection state
  const [gdprTerms, setGdprTerms] = useState<boolean>(false);
  const [gdprPrivacy, setGdprPrivacy] = useState<boolean>(false);
  const [gdprPictureMatch, setGdprPictureMatch] = useState<boolean>(true);
  const [gdprMarketing, setGdprMarketing] = useState<boolean>(false);
  const [gdprCustomField1, setGdprCustomField1] = useState<boolean>(false);
  const [gdprCustomField2, setGdprCustomField2] = useState<boolean>(false);
  const [gdprCustomField3, setGdprCustomField3] = useState<boolean>(false);
  const [gdprCustomField4, setGdprCustomField4] = useState<boolean>(false);
  const [gdprCustomField5, setGdprCustomField5] = useState<boolean>(false);
  const [gdprPrivacyAutoEmail, setGdprPrivacyAutoEmail] = useState<boolean>(false);

  // Section K: Pre-approval state
  const [preApprovalStatus, setPreApprovalStatus] = useState<string>('Pending');
  const [approvedBy, setApprovedBy] = useState<string>('Sadhana Penta');
  const [submittedBy, setSubmittedBy] = useState<string>('sergey.cherniavsky@xfair.com');
  const [approvedDays, setApprovedDays] = useState<string[]>([
    '3/3/2028', '3/4/2028', '3/5/2028', '3/6/2028', '3/7/2028', '3/8/2028', '3/9/2028', '3/10/2028'
  ]);
  const [reasonDenial, setReasonDenial] = useState<string>('');
  const [reasonAttendance, setReasonAttendance] = useState<string>('none');

  // Section L: Registration group state
  const [registrationGroup, setRegistrationGroup] = useState<string>('Employee Registration 2028');
  const [registrationApprovalStatus, setRegistrationApprovalStatus] = useState<string>('Approved');
  const [attendingField, setAttendingField] = useState<boolean>(true);
  const [termsAgreedField, setTermsAgreedField] = useState<string>('Yes');
  const [regCompletedField, setRegCompletedField] = useState<boolean>(true);
  const [isRegHistoryOpen, setIsRegHistoryOpen] = useState<boolean>(false);

  // Section M: Event group state
  const [eventGroupName, setEventGroupName] = useState<string>('Bauma Developers Crew');
  const [empContactPerson, setEmpContactPerson] = useState<string>('Sadhana Penta');
  const [arrivalDate, setArrivalDate] = useState<string>('2028-03-03');
  const [departureDate, setDepartureDate] = useState<string>('2028-03-10');
  const [eventGroupContact, setEventGroupContact] = useState<string>('+49 89 45214750');

  const toggleAllFairdays = (val: boolean) => {
    setFairdaysAllSelected(val);
    setFairdays(prev => prev.map(f => ({ ...f, isChecked: val })));
    onShowToast(val ? 'All Fair Days selected' : 'All Fair Days deselected');
  };

  const handleFairdayToggle = (id: number, val: boolean) => {
    setFairdays(prev => prev.map(f => f.id === id ? { ...f, isChecked: val } : f));
  };

  const saveEmployeeRecord = () => {
    onShowToast(`Employee record for Sergey Cherniavsky successfully updated & persisted.`);
    onBack();
  };

  return (
    <div className="w-full animate-fade-in" id="employee-detail-viewport">
      {/* 1. Header Actions Control panel */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b mb-6 border-[#E5E7EB]`}>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h1 className={`${isPremium ? 'text-2xl font-black text-zinc-900 tracking-tight font-sans' : 'text-xl font-bold text-black'}`}>
              Sergey Cherniavsky
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={saveEmployeeRecord}
            className={`${
              isPremium
                ? 'flex items-center gap-2 bg-[#F35D00] hover:bg-[#D55200] active:scale-[0.98] text-white px-6 py-2.5 rounded-lg text-sm font-extrabold shadow-md transition-all cursor-pointer'
                : 'flex items-center gap-1.5 bg-[#18181B] border border-black text-white px-4 py-2 text-sm font-bold cursor-pointer hover:bg-black md:py-2.5'
            }`}
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Split Column Panel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Form Sections (col-span-8) */}
        <div className="lg:col-span-8 space-y-6" id="employee-detail-form-core">
          
          {/* SECTION A: Personal Data */}
          <div id="sec-personal-data" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`${isPremium ? 'text-xs font-bold text-[#1F2937] uppercase tracking-wide font-sans' : 'text-xs font-bold text-black uppercase'} transition-colors`}>
                  Personal data
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                
                {/* ID Field */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  ID
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value="473"
                    disabled
                    className={`${isPremium ? 'w-full bg-zinc-50 border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-400 font-semibold cursor-not-allowed select-none' : 'w-full bg-zinc-100 border border-gray-400 h-11 px-3 text-xs text-gray-400 select-none cursor-not-allowed'}`}
                  />
                </div>

                {/* Salutation */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Salutation
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={salutation}
                    onChange={setSalutation}
                    options={[
                      { value: 'Mr.', label: 'Mr.' },
                      { value: 'Ms.', label: 'Ms.' },
                      { value: 'Dr.', label: 'Dr.' },
                      { value: 'Prof.', label: 'Prof.' },
                      { value: 'none', label: '-- Select salutation --' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* First name */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  First name *
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Last name */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Last name *
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Email with valid email pattern notice */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Email
                </div>
                <div className="md:col-span-8">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block font-medium">Please ensure you use a valid email format!</span>
                </div>

                {/* Email address for communication */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Email address for communication
                </div>
                <div className="md:col-span-8">
                  <input
                    type="email"
                    value={emailComm}
                    onChange={(e) => setEmailComm(e.target.value)}
                    placeholder="Email address for communication"
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Birthday */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Birthday *
                </div>
                <div className="md:col-span-8">
                  <input
                    type="date"
                    value={birthdayDate}
                    onChange={(e) => setBirthdayDate(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Nationality */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Nationality
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={nationality}
                    onChange={setNationality}
                    options={[
                      { value: 'German', label: 'Germany' },
                      { value: 'Ukrainian', label: 'Ukraine' },
                      { value: 'American', label: 'United States' },
                      { value: 'Indian', label: 'India' },
                      { value: 'Turkish', label: 'Turkey' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Custom lookup fields representing systems schema */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Person custom look up field 1
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={personCustomLookUp1}
                    onChange={setPersonCustomLookUp1}
                    options={[
                      { value: 'No & yes', label: 'No & yes' },
                      { value: 'No', label: 'No' },
                      { value: 'Yes', label: 'Yes' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* PersonCustomField1 */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  PersonCustomField1
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={personCustomField1}
                    onChange={(e) => setPersonCustomField1(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Title */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Title
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={title}
                    onChange={setTitle}
                    options={[
                      { value: 'none', label: '-- none --' },
                      { value: 'Prof.', label: 'Prof.' },
                      { value: 'Dr.', label: 'Dr.' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Position */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Position
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Preferred Contact Language */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Preferred contact language
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={preferredLanguage}
                    onChange={setPreferredLanguage}
                    options={[
                      { value: 'English (UK)', label: '🇬🇧 English (UK)' },
                      { value: 'English (US)', label: '🇺🇸 English (US)' },
                      { value: 'German (DE)', label: '🇩🇪 Deutsch (DE)' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Comment Area */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} self-start pt-2.5`}>
                  Comment
                </div>
                <div className="md:col-span-8">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg p-4 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 p-3 text-xs text-black'}`}
                  />
                </div>

                {/* Department */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Department
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-[#F35D00] font-semibold shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Cost Center */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Cost center
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-[#F35D00] font-semibold' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Card Name */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Card name
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={cardName}
                    onChange={setCardName}
                    options={[
                      { value: 'none', label: '-- none --' },
                      { value: 'Visitor', label: 'Visitor' },
                      { value: 'Exhibitor', label: 'Exhibitor' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Type */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Type
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={employeeType}
                    onChange={setEmployeeType}
                    options={[
                      { value: 'Employee', label: 'Employee' },
                      { value: 'External Developer', label: 'External Developer' },
                      { value: 'Manager Area', label: 'Manager Area' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Accompanying headcount guidance */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  I come with: Please indicate here your accompanying person(s).
                </div>
                <div className="md:col-span-8">
                  <input
                    type="number"
                    value={accompanyingCount}
                    onChange={(e) => setAccompanyingCount(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Person custom field 3 */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Person custom field 3
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={personCustomField3}
                    onChange={(e) => setPersonCustomField3(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Person custom field 4 */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Person custom field 4
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={personCustomField4}
                    onChange={(e) => setPersonCustomField4(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Person custom field 5 */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Person custom field 5
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={personCustomField5}
                    onChange={(e) => setPersonCustomField5(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* External identifier 1 */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  External identifier 1
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={externalIdentifier1}
                    onChange={(e) => setExternalIdentifier1(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Matched status */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Matched status
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={matchedStatus}
                    onChange={setMatchedStatus}
                    options={[
                      { value: 'Not actioned', label: 'Not actioned' },
                      { value: 'Actioned', label: 'Actioned' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Person custom look up field 2 */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Person custom look up field 2
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={personCustomLookUp2}
                    onChange={setPersonCustomLookUp2}
                    options={[
                      { value: '1', label: '1' },
                      { value: '2', label: '2' },
                      { value: '3', label: '3' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Person custom look up field 3 */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Person custom look up field 3
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={personCustomLookUp3}
                    onChange={setPersonCustomLookUp3}
                    options={[
                      { value: 'a', label: 'a' },
                      { value: 'b', label: 'b' },
                      { value: 'c', label: 'c' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Person custom look up field 4 */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Person custom look up field 4
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={personCustomLookUp4}
                    onChange={setPersonCustomLookUp4}
                    options={[
                      { value: 'Like', label: 'Like' },
                      { value: 'Dislike', label: 'Dislike' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>              </div>

              </div>
            </div>

          {/* SECTION B: Private Address */}
          <div id="sec-private-address" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Private address
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                
                {/* Address */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Address
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={privateAddress}
                    onChange={(e) => setPrivateAddress(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* House number */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  House number
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* P.O. Box */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  P.O. box
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={poBox}
                    onChange={(e) => setPoBox(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Post code */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Post code
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* City */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  City
                </div>
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* Language expander button */}
                    <button
                      type="button"
                      onClick={() => setIsCityExpanded(!isCityExpanded)}
                      className={`${isPremium ? 'w-8 h-8 rounded-full bg-zinc-100 hover:bg-[#F35D00]/15 flex items-center justify-center text-[#F35D00] transition-all hover:scale-110 active:scale-95 cursor-pointer border-none shrink-0' : 'text-[#F35D00] font-bold hover:underline bg-transparent border-none cursor-pointer shrink-0'}`}
                      title={isCityExpanded ? "Hide translations" : "Define other languages"}
                    >
                      {isCityExpanded ? <ChevronUp className="w-4 h-4 stroke-[3px]" /> : <ChevronDown className="w-4 h-4 stroke-[3px]" />}
                    </button>

                    <span className="text-sm select-none shrink-0" title="en-US">🇺🇸</span>
                    
                    <input
                      type="text"
                      value={cityUS}
                      onChange={(e) => {
                        setCityUS(e.target.value);
                        // keep others in sync as default fallback
                        if (!cityGB) setCityGB(e.target.value);
                        if (!cityDE) setCityDE(e.target.value);
                      }}
                      placeholder="City (US)"
                      className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-[#F35D00] font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                    />
                  </div>

                  {/* Expanded Translation Fields (GB / DE) */}
                  {isCityExpanded && (
                    <div className="space-y-2 pl-10 animate-fade-in text-left">
                      {/* GB */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm select-none shrink-0" title="en-GB">🇬🇧</span>
                        <input
                          type="text"
                          value={cityGB}
                          onChange={(e) => setCityGB(e.target.value)}
                          placeholder="City (UK)"
                          className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-[#F35D00] font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                        />
                      </div>

                      {/* DE */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm select-none shrink-0" title="de-DE">🇩🇪</span>
                        <input
                          type="text"
                          value={cityDE}
                          onChange={(e) => setCityDE(e.target.value)}
                          placeholder="Stadt (DE)"
                          className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-[#F35D00] font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* County */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  County
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Country */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Country
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={country}
                    onChange={setCountry}
                    options={[
                      { value: 'Germany', label: 'Germany' },
                      { value: 'United States', label: 'United States' },
                      { value: 'India', label: 'India' },
                      { value: 'Austria', label: 'Austria' },
                      { value: 'United Kingdom', label: 'United Kingdom' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

              </div>
            </div>
          </div>

          {/* SECTION C: Contact */}
          <div id="sec-contact" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Contact
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                
                {/* Telephone structure */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} self-start pt-2.5`}>
                  Telephone
                </div>
                <div className="md:col-span-8 space-y-2">
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <CustomSelect
                        value={telPrefix}
                        onChange={setTelPrefix}
                        options={[
                          { value: 'Germany (+49)', label: 'Germany (+49)' },
                          { value: 'United States (+1)', label: 'United States (+1)' },
                          { value: 'India (+91)', label: 'India (+91)' }
                        ]}
                        isPremium={isPremium}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Area"
                      value={telArea}
                      onChange={(e) => setTelArea(e.target.value)}
                      className={`w-1/4 bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-3 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-2 text-xs text-black'}`}
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={telNumber}
                      onChange={(e) => setTelNumber(e.target.value)}
                      className={`w-1/4 bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-3 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-2 text-xs text-black'}`}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => onShowToast(`Dialing contact number: +49 ${telArea} ${telNumber}`)}
                    className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#F35D00] hover:underline"
                  >
                    📞 Initiate Dial test
                  </button>
                </div>

                {/* Fax structure */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} self-start pt-2.5`}>
                  Fax
                </div>
                <div className="md:col-span-8 flex gap-2">
                  <div className="w-1/2">
                    <CustomSelect
                      value={faxPrefix}
                      onChange={setFaxPrefix}
                      options={[
                        { value: 'Please select', label: 'Please select' },
                        { value: 'Germany (+49)', label: 'Germany (+49)' },
                        { value: 'United States (+1)', label: 'United States (+1)' }
                      ]}
                      isPremium={isPremium}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Area Code"
                    value={faxArea}
                    onChange={(e) => setFaxArea(e.target.value)}
                    className={`w-1/4 bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-3 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-2 text-xs text-black'}`}
                  />
                  <input
                    type="text"
                    placeholder="Number"
                    value={faxNumber}
                    onChange={(e) => setFaxNumber(e.target.value)}
                    className={`w-1/4 bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-3 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-2 text-xs text-black'}`}
                  />
                </div>

                {/* Mobile structure */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} self-start pt-2.5`}>
                  Mobile
                </div>
                <div className="md:col-span-8 space-y-2">
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <CustomSelect
                        value={mobilePrefix}
                        onChange={setMobilePrefix}
                        options={[
                          { value: 'Germany (+49)', label: 'Germany (+49)' },
                          { value: 'United States (+1)', label: 'United States (+1)' }
                        ]}
                        isPremium={isPremium}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Area"
                      value={mobileArea}
                      onChange={(e) => setMobileArea(e.target.value)}
                      className={`w-1/4 bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-3 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-2 text-xs text-black'}`}
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className={`w-1/4 bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-3 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-2 text-xs text-black'}`}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => onShowToast(`Dialing mobile number: +49 ${mobileArea} ${mobileNumber}`)}
                    className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#F35D00] hover:underline block text-left"
                  >
                    📞 Initiate Dial test
                  </button>
                </div>

                {/* Mobile phones field holding multiple records */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Mobile phones
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={mobilePhonesCustom}
                    onChange={(e) => setMobilePhonesCustom(e.target.value)}
                    placeholder="Additional mobile numbers comma-separated"
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

              </div>
            </div>
          </div>

          {/* SECTION D: Company */}
          <div id="sec-company" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              
              {/* Header Action Placement */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#E5E7EB] pb-3">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'} self-center`}>
                  Company
                </h2>
                
                {/* Repositioned Actions matching Event Manager 'Insert' button style */}
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => onShowToast('New Person wizard initiated inside Company module')}
                    className={`${isPremium ? 'flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#F35D00] bg-white text-[#F35D00] hover:bg-[#F35D00]/5 hover:border-[#D55200] active:scale-[0.98] text-xs font-extrabold rounded-lg transition-all cursor-pointer shadow-3xs' : 'bg-white border border-gray-500 font-bold px-2 py-1 text-xs text-black hover:bg-gray-100 cursor-pointer'}`}
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>Add New Person</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                
                {/* Company name */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Company name
                </div>
                <div className="md:col-span-8 flex items-center gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <CustomSelect
                      value={companyName}
                      onChange={setCompanyName}
                      options={[
                        { value: 'XFAIR GmbH', label: 'XFAIR GmbH' },
                        { value: 'Bauma Exhibitor Corp', label: 'Bauma Exhibitor Corp' },
                        { value: 'Messe München', label: 'Messe München' },
                        { value: 'Fairs & More Co.', label: 'Fairs & More Co.' }
                      ]}
                      isPremium={isPremium}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onShowToast('Company profile editor triggered')}
                    className="text-xs font-extrabold text-[#F35D00] hover:text-[#D55200] hover:underline cursor-pointer shrink-0 transition-all"
                  >
                    Edit Company
                  </button>
                </div>

                {/* Company Address */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Company Address
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={companyAddressId}
                    onChange={setCompanyAddressId}
                    options={[
                      { value: 'Elisabeth-Schiemann-Bogen 1, 85716, Unterschleißheim, Germany', label: 'Elisabeth-Schiemann-Bogen 1, 85716, Unterschleißheim, Germany' },
                      { value: 'Am Messesee, 81829, Munich, Germany', label: 'Am Messesee, 81829, Munich, Germany' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

              </div>
            </div>
          </div>

          {/* SECTION E: Approver */}
          <div id="sec-approver" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Approver
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                
                {/* Approver */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Approver
                </div>
                <div className="md:col-span-8">
                  <input
                    type="email"
                    value={approverEmail}
                    onChange={(e) => setApproverEmail(e.target.value)}
                    placeholder="Approver email address"
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

              </div>
            </div>
          </div>

          {/* SECTION F: Codes */}
          <div id="sec-codes" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Codes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                
                {/* Transponder code */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Transponder code
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={transponderCode}
                    onChange={(e) => setTransponderCode(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* QR code with interactive SVG representation */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} self-start pt-2.5`}>
                  QR code
                </div>
                <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="text"
                    value={qrCodeVal}
                    onChange={(e) => setQrCodeVal(e.target.value)}
                    className={`flex-1 bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                  
                  {/* SVG QR representation matching Image 3 strictly! */}
                  <div className={`shrink-0 p-2 border bg-white rounded-lg shadow-3xs ${isPremium ? 'border-zinc-200' : 'border-black'}`}>
                    <svg width="48" height="48" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="white" />
                      <path d="M10 10h30v30H10zm0 50h30v30H10zm50-50h30v30H60z" fill="black" />
                      <path d="M18 18h14v14H18zm0 50h14v14H18zm50-50h14v14H68z" fill="white" />
                      <path d="M23 23h4v4h-4zm0 50h4v4h-4zm50-50h4v4h-4z" fill="black" />
                      <path d="M50 50h10v10H50zm10 10h10v10H60zm10 10h10v15H70zm-20 10h10v10H50zm30 10h10V80H80z" fill="black" />
                    </svg>
                  </div>
                </div>

                {/* Barcode with SVG representation */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} self-start pt-2.5`}>
                  Barcode
                </div>
                <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="text"
                    value={barcodeVal}
                    onChange={(e) => setBarcodeVal(e.target.value)}
                    className={`flex-1 bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                  
                  {/* Real visual barcode */}
                  <div className={`shrink-0 p-2 border bg-white rounded-lg shadow-3xs ${isPremium ? 'border-zinc-200' : 'border-black'}`}>
                    <svg width="55" height="40" viewBox="0 0 100 60">
                      <rect width="100" height="60" fill="white" />
                      <rect x="5" y="5" width="4" height="40" fill="black" />
                      <rect x="12" y="5" width="2" height="40" fill="black" />
                      <rect x="18" y="5" width="8" height="40" fill="black" />
                      <rect x="29" y="5" width="3" height="40" fill="black" />
                      <rect x="36" y="5" width="6" height="40" fill="black" />
                      <rect x="46" y="5" width="2" height="40" fill="black" />
                      <rect x="52" y="5" width="8" height="40" fill="black" />
                      <rect x="64" y="5" width="4" height="40" fill="black" />
                      <rect x="71" y="5" width="10" height="40" fill="black" />
                      <rect x="85" y="5" width="3" height="40" fill="black" />
                      <rect x="91" y="5" width="4" height="40" fill="black" />
                      <text x="50" y="52" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle" fill="black">20473</text>
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* SECTION G: Fairdays */}
          <div id="sec-fairdays" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center justify-between mb-4 border-b border-[#E5E7EB] pb-2">
                <div className="flex items-center gap-2">
                  <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                    Fairdays
                  </h2>
                </div>
              </div>

              {/* Tag-based Selection Dropdown */}
              <div className="space-y-4">
                <div className="relative w-full">
                  {/* Dropdown trigger showing count or placeholder */}
                  <button
                    type="button"
                    onClick={() => setIsFairdaysDropdownOpen(!isFairdaysDropdownOpen)}
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-850 focus:outline-none hover:border-[#F35D00]/40 flex items-center justify-between font-semibold cursor-pointer select-none transition-all shadow-3xs' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black cursor-pointer font-bold flex items-center justify-between select-none'}`}
                  >
                    <span>{fairdays.filter(f => f.isChecked).length ? `Selected (${fairdays.filter(f => f.isChecked).length} days)` : 'Add Fair Days...'}</span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-zinc-500" />
                  </button>

                  {isFairdaysDropdownOpen && (
                    <div className="absolute z-40 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-zinc-200 rounded-lg shadow-lg py-1 custom-scrollbar text-left">
                      {fairdays.map((day) => (
                        <label 
                          key={day.id} 
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-zinc-50 cursor-pointer select-none text-xs font-semibold"
                        >
                          <input 
                            type="checkbox"
                            checked={day.isChecked}
                            onChange={(e) => handleFairdayToggle(day.id, e.target.checked)}
                            className="text-[#F35D00] focus:ring-[#F35D00]/25 rounded border-zinc-300 accent-[#F35D00] w-4.5 h-4.5 shrink-0"
                          />
                          <div className="flex-1 flex justify-between pr-2">
                            <span className="font-bold text-zinc-800">{day.date}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{day.weekday}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected days displayed as premium tags container */}
                <div className="flex flex-wrap gap-2">
                  {fairdays.filter(f => f.isChecked).map((day) => (
                    <div 
                      key={day.id}
                      className="flex items-center gap-1.5 bg-[#FFE7D6]/70 text-[#F35D00] text-[10px] font-extrabold uppercase tracking-wider font-sans px-3 py-1.5 rounded-full border border-[#FFE7D6]/80"
                    >
                      <span>{day.date}</span>
                      <button 
                        type="button"
                        onClick={() => handleFairdayToggle(day.id, false)}
                        className="hover:text-zinc-800 font-extrabold focus:outline-none transition-colors border-none bg-transparent cursor-pointer ml-1 text-xs"
                        title="Remove day"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {fairdays.filter(f => f.isChecked).length === 0 && (
                    <span className="text-xs text-zinc-400 italic font-mono">No Fair Days selected. Use the dropdown above to choose days.</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION H: Criteria */}
          <div id="sec-criteria" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Criteria Summary
                </h2>
              </div>

              {/* Merged Criteria List rows representation */}
              <div className="space-y-3.5 text-xs font-semibold">
                {criteriaList.map((crit) => (
                  <div 
                    key={crit.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E7EB] pb-2.5 gap-1.5 font-semibold group"
                  >
                    <span className="font-bold text-zinc-400 tracking-wider text-[10px] sm:w-1/3">
                      {crit.name}
                    </span>
                    <div className="sm:w-2/3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {crit.prefix && <span className="text-[14px]">{crit.prefix}</span>}
                        <span className={`font-extrabold ${crit.highlight ? 'text-[#F35D00]' : 'text-zinc-900'}`}>
                          {crit.value}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCriteriaList(criteriaList.filter(c => c.id !== crit.id));
                          onShowToast(`Removed criteria: ${crit.name}`);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 font-bold transition-all text-[11px] cursor-pointer bg-transparent border-none"
                        title="Remove criteria"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {criteriaList.length === 0 && (
                  <p className="text-xs text-zinc-400 italic">No criteria assigned to this employee.</p>
                )}
              </div>

              {/* Section H Custom manager interactive controls (former Section I) */}
              <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
                <h3 className="font-sans font-extrabold text-xs text-zinc-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#F35D00] rounded-full inline-block" />
                  Add or Adjust Criteria
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                  {/* Category Dropdown */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280]' : 'text-[11px] font-bold text-gray-500'} flex items-center tracking-wide`}>
                    Criteria Category
                  </div>
                  <div className="md:col-span-8">
                    <CustomSelect
                      value={activeCriteriaType}
                      onChange={(val) => {
                        setActiveCriteriaType(val);
                        // Reset dependent value on category change
                        setActiveCriteriaValue('');
                      }}
                      options={[
                        { value: '', label: '-- Choose a criteria --' },
                        { value: 'food', label: 'Food Preference' },
                        { value: 'hotel', label: 'Hotel Room Type' },
                        { value: 'shuttle', label: 'Shuttle Service' },
                        { value: 'language', label: 'Language Specialty' }
                      ]}
                      isPremium={isPremium}
                    />
                  </div>

                  {/* Dependent Value Dropdown (Conditional Visibility based on category) */}
                  {activeCriteriaType && (
                    <>
                      <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280]' : 'text-[11px] font-bold text-gray-500'} flex items-center tracking-wide animate-fade-in`}>
                        Select Value
                      </div>
                      <div className="md:col-span-8 animate-fade-in">
                        <CriteriaMultiSelect
                          activeType={activeCriteriaType}
                          value={activeCriteriaValue}
                          onChange={setActiveCriteriaValue}
                          isPremium={isPremium}
                        />
                      </div>
                    </>
                  )}

                  {/* Save button */}
                  <div className="md:col-span-4"></div>
                  <div className="md:col-span-8 flex gap-2">
                    <button
                      type="button"
                      disabled={!activeCriteriaType || !activeCriteriaValue}
                      onClick={() => {
                        const typesMap: Record<string, { name: string; prefix: string }> = {
                          food: { name: 'Food Preference', prefix: '🍽️' },
                          hotel: { name: 'Hotel Room Type', prefix: '🏨' },
                          shuttle: { name: 'Shuttle Service', prefix: '🚌' },
                          language: { name: 'Language Specialty', prefix: '🗣️' }
                        };
                        const mapped = typesMap[activeCriteriaType];
                        if (mapped) {
                          // Check if already in list
                          const filtered = criteriaList.filter(c => c.id !== activeCriteriaType);
                          setCriteriaList([
                            ...filtered,
                            { 
                              id: activeCriteriaType, 
                              name: mapped.name, 
                              value: activeCriteriaValue, 
                              prefix: mapped.prefix, 
                              highlight: activeCriteriaType === 'food' 
                            }
                          ]);
                          onShowToast(`Assigned ${mapped.name}: ${activeCriteriaValue}`);
                        }
                        // Reset forms
                        setActiveCriteriaType('');
                        setActiveCriteriaValue('');
                      }}
                      className={`px-5 py-2 font-black text-xs uppercase tracking-wider transition-all inline-block select-none ${
                        (!activeCriteriaType || !activeCriteriaValue)
                          ? 'bg-zinc-150 text-zinc-400 cursor-not-allowed border border-zinc-200 rounded-xl'
                          : (isPremium ? 'bg-[#F35D00] hover:bg-zinc-900 text-white rounded-xl shadow-3xs cursor-pointer' : 'bg-white border-2 border-black text-black cursor-pointer font-bold')
                      }`}
                    >
                      Save Criteria
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION J: Data Protection */}
          <div id="sec-data-protection" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Data Protection
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs font-semibold">
                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprTerms}
                    onChange={(e) => setGdprTerms(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>Terms and Conditions</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprPrivacy}
                    onChange={(e) => setGdprPrivacy(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>Data Privacy</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprPictureMatch}
                    onChange={(e) => setGdprPictureMatch(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span className="text-[#F35D00] font-black">Picture (GDPR Compliant Opt-In)</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprMarketing}
                    onChange={(e) => setGdprMarketing(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>Marketing email</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprCustomField1}
                    onChange={(e) => setGdprCustomField1(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>CustomField1</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprCustomField2}
                    onChange={(e) => setGdprCustomField2(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>CustomField2</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprCustomField3}
                    onChange={(e) => setGdprCustomField3(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>CustomField3</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprCustomField4}
                    onChange={(e) => setGdprCustomField4(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>CustomField4</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprCustomField5}
                    onChange={(e) => setGdprCustomField5(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>CustomField5</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gdprPrivacyAutoEmail}
                    onChange={(e) => setGdprPrivacyAutoEmail(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-4.5 w-4.5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                  <span>Data Privacy Auto Email Send</span>
                </label>

              </div>
            </div>
          </div>

          {/* SECTION K: Pre-approval */}
          <div id="sec-pre-approval" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Pre-approval
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                
                {/* Pre approval status */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Pre approval status
                </div>
                <div className="md:col-span-8">
                  <div className={`w-full bg-zinc-50/75 border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-500 font-semibold flex items-center cursor-not-allowed shadow-3xs' : 'border-gray-300 h-11 px-3 text-xs text-zinc-500'}`}>
                    {preApprovalStatus}
                  </div>
                </div>

                {/* Approved by */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Approved by
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={approvedBy}
                    readOnly
                    className={`w-full bg-zinc-50/75 border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-500 font-semibold cursor-not-allowed shadow-3xs' : 'border-gray-300 h-11 px-3 text-xs text-zinc-500'}`}
                  />
                </div>

                {/* Submitted by */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Submitted by
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={submittedBy}
                    readOnly
                    className={`w-full bg-zinc-50/75 border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-500 font-semibold cursor-not-allowed shadow-3xs' : 'border-gray-300 h-11 px-3 text-xs text-zinc-500'}`}
                  />
                </div>

                {/* Approved number of attendance days */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} self-start pt-2.5`}>
                  Approved number of attendance days
                </div>
                <div className="md:col-span-8 font-mono text-xs text-zinc-500 space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-150">
                  <div className="font-sans font-bold text-[#F35D00] mb-1">Calendar Windows Matrix</div>
                  {approvedDays.map(day => (
                    <div key={day} className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#F35D00] shrink-0" />
                       <span>{day}</span>
                    </div>
                  ))}
                </div>

                {/* Reason for denial */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Reason for denial
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={reasonDenial || "N/A"}
                    readOnly
                    className={`w-full bg-zinc-50/75 border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-500 font-semibold cursor-not-allowed shadow-3xs' : 'border-gray-300 h-11 px-3 text-xs text-zinc-500'}`}
                  />
                </div>

                {/* Reason for attendance */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Reason for attendance
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={reasonAttendance}
                    onChange={setReasonAttendance}
                    options={[
                      { value: 'none', label: 'none' },
                      { value: 'Project Delivery', label: 'Project Delivery' },
                      { value: 'Client Relationship', label: 'Client Specialist Represent' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

              </div>
            </div>
          </div>

          {/* SECTION L: Registration group */}
          <div id="sec-registration-group" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Registration group
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6.5 gap-x-6">
                
                {/* Registration group */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Registration group
                </div>
                <div className="md:col-span-8 flex gap-2">
                  <div className="flex-1">
                    <CustomSelect
                      value={registrationGroup}
                      onChange={setRegistrationGroup}
                      options={[
                        { value: 'Employee Registration 2028', label: 'Employee Registration 2028' },
                        { value: 'Visitor Registration 2028', label: 'Visitor Registration 2028' }
                      ]}
                      isPremium={isPremium}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsRegHistoryOpen(!isRegHistoryOpen);
                      onShowToast(isRegHistoryOpen ? 'Closed history view' : 'Opened registration group event history log');
                    }}
                    className={`px-4 whitespace-nowrap font-bold h-11 flex items-center justify-center gap-1.5 transition-all select-none border cursor-pointer ${isPremium ? 'bg-zinc-50 hover:bg-[#FFE7D6]/20 border-zinc-200 text-[#F35D00] rounded-xl text-xs shadow-3xs' : 'bg-[#E5E5E5] border-2 border-black text-black'}`}
                  >
                    <span>View History</span>
                  </button>
                </div>

                {/* Optional Collapsible Inline History Log */}
                {isRegHistoryOpen && (
                  <div className="md:col-span-12 bg-zinc-50/50 rounded-xl p-4 border border-zinc-150 border-dashed space-y-3.5 animate-fade-in">
                    <div className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">Registration Log History</div>
                    <div className="space-y-4 relative pl-3.5 border-l-2 border-[#FFE7D6]">
                      <div className="relative text-xs">
                        <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-[#F35D00]" />
                        <div className="font-extrabold text-zinc-800">Assigned Registration Group</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">May 21, 2026 • sergey.cherniavsky@xfair.com</div>
                      </div>
                      <div className="relative text-xs">
                        <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-[#6B7280]" />
                        <div className="font-extrabold text-zinc-800">Status marked as APPROVED</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">May 20, 2026 • Sadhana Penta</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval status of registration */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Approval status of registration
                </div>
                <div className="md:col-span-8">
                  <CustomSelect
                    value={registrationApprovalStatus}
                    onChange={setRegistrationApprovalStatus}
                    options={[
                      { value: 'Approved', label: 'Approved' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Denied', label: 'Denied' }
                    ]}
                    isPremium={isPremium}
                  />
                </div>

                {/* Attending */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Attending
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input 
                    type="checkbox"
                    checked={attendingField}
                    onChange={(e) => setAttendingField(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-5 w-5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                </div>

                {/* Terms and conditions agreed */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Terms & conditions agreed
                </div>
                <div className="md:col-span-8 flex items-center">
                  <span className={`text-[#F35D00] text-xs font-black uppercase font-mono tracking-wider px-3 py-1 rounded-lg ${isPremium ? 'bg-[#FFE7D6]' : 'bg-black text-white'}`}>
                    {termsAgreedField}
                  </span>
                </div>

                {/* Registration completed */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Registration completed
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input 
                    type="checkbox"
                    checked={regCompletedField}
                    onChange={(e) => setRegCompletedField(e.target.checked)}
                    className="text-[#F35D00] accent-[#F35D00] h-5 w-5 rounded focus:ring-[#F35D00]/25 cursor-pointer border-zinc-200"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* SECTION M: Event group */}
          <div id="sec-event-group" className="scroll-mt-6">
            <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
              <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
                <h2 className={`font-sans font-bold text-xs uppercase tracking-wide ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
                  Event group
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6">
                
                {/* Event group name */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Event group name
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={eventGroupName}
                    onChange={(e) => setEventGroupName(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Employee Contact Person */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Employee Contact Person
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={empContactPerson}
                    onChange={(e) => setEmpContactPerson(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Event group arrival date */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Event group arrival date
                </div>
                <div className="md:col-span-8">
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Event group departure date */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Event group departure date
                </div>
                <div className="md:col-span-8">
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

                {/* Event group contact person */}
                <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans'} flex items-center`}>
                  Event group contact person
                </div>
                <div className="md:col-span-8">
                  <input
                    type="text"
                    value={eventGroupContact}
                    onChange={(e) => setEventGroupContact(e.target.value)}
                    className={`w-full bg-white border ${isPremium ? 'border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all shadow-3xs' : 'border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Right Column Layout holding Visual Photo, Card placeholders, and attachments matching strictly all visible features (col-span-4) */}
        <div className="lg:col-span-4 space-y-6" id="sec-attachments">
          
          {/* Visual Profile Photo */}
          <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-sans mb-3 ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
              Image
            </h3>

            {/* Profile Avatar circle render with controls underneath */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-4 justify-center w-full">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-2 shrink-0 ${isPremium ? 'border-[#F35D00]/40 shadow-sm' : 'border-black'}`}>
                  <img 
                    src={profileImage} 
                    alt="Sergey Cherniavsky Profile"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Edit and Delete icons placed horizontally, with rounded-lg non-circular borders copied from event page style */}
                <div className="flex items-center gap-2.5 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const newImgPlaceholder = profileImage === 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256'
                        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256'
                        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256';
                      setProfileImage(newImgPlaceholder);
                      onShowToast('Personal photo updated');
                    }}
                    className={`${isPremium ? 'p-1.5 rounded-lg text-[#F35D00] hover:text-[#D55200] hover:bg-orange-50 border border-[#FFE7D6] bg-white shadow-2xs transition-all cursor-pointer' : 'border border-gray-500 text-black px-1.5 py-1 font-bold hover:bg-gray-200 bg-white cursor-pointer'}`}
                    title="Edit image"
                  >
                    <Edit2 className="w-4 h-4 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256');
                      onShowToast('Personal photo removed');
                    }}
                    className={`${isPremium ? 'p-1.5 rounded-lg text-red-600 hover:text-red-750 hover:bg-red-50 border border-red-105 bg-white shadow-2xs transition-all cursor-pointer' : 'border border-red-500 text-red-600 px-1.5 py-1 font-bold hover:bg-red-50 bg-white cursor-pointer'}`}
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4 shrink-0 text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-zinc-400 font-medium leading-normal max-w-[200px] text-center mt-4 break-words font-sans">
                Format requirements: jpg, bmp, gif, png (min 0 MB, max 16 MB)
              </p>
            </div>
          </div>

          {/* Business card segment */}
          <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-sans mb-3 ${isPremium ? 'text-[#1F2937]' : 'text-black font-bold'}`}>
              Business Card
            </h3>
            <div className="h-24 rounded-xl border border-dashed border-zinc-200/80 flex flex-col justify-center items-center text-center p-4 bg-zinc-50/30">
              <Smartphone className="w-6 h-6 text-zinc-400 mb-1.5 shrink-0" />
              <span className="text-xs font-bold text-zinc-500 font-sans">No Business Card</span>
            </div>
          </div>

          {/* Data security signature */}
          <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-sans mb-3 ${isPremium ? 'text-[#1F2937]' : 'text-black'}`}>
              Data Security Signature
            </h3>
            <div className="h-24 rounded-xl border border-dashed border-zinc-200/80 flex flex-col justify-center items-center text-center p-3 bg-zinc-50/30">
              <FileText className="w-6 h-6 text-zinc-400 mb-1.5 shrink-0" />
              <span className="text-xs font-bold text-zinc-500 font-sans">No Image</span>
            </div>
          </div>

          {/* Personal Attachment panel */}
          <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm' : 'bg-white border-2 border-black p-4'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-sans mb-3 ${isPremium ? 'text-[#1F2937]' : 'text-black font-bold'}`}>
              Personal Attachment
            </h3>
            <div 
              onClick={() => onShowToast('Browse triggered for personal attachment document')}
              className={`${
                isPremium
                  ? 'border border-dashed border-zinc-200/85 hover:border-[#F35D00] bg-zinc-50/40 hover:bg-[#FFE7D6]/10 rounded-xl p-3.5 transition-all text-center flex items-center justify-between cursor-pointer group shadow-3xs'
                  : 'border border-gray-400 hover:border-black p-3 bg-white text-center flex items-center justify-between cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Paperclip className={`w-4 h-4 shrink-0 ${isPremium ? 'text-[#F35D00]' : 'text-black'}`} />
                <span className={`text-xs font-bold truncate ${isPremium ? 'text-zinc-700 group-hover:text-[#F35D00]' : 'text-black'}`}>
                  Click to attach document
                </span>
              </div>
              <span className="text-[10px] text-[#9CA3AF] font-medium shrink-0 font-mono">max. 16 MB</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
