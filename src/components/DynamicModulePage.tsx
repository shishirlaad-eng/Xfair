/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Calendar, FileText, Search, Plus, Trash2, CheckCircle2, 
  Printer, Smartphone, QrCode, ClipboardList, Info, AlertOctagon, 
  Settings, Check, X, ShieldAlert, Cpu, Database, Save, Play, RefreshCw, 
  DollarSign, Sliders, ArrowUpRight, SearchCode, Eye, Send, Filter, CheckCircle,
  ChevronDown
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface DynamicModulePageProps {
  moduleId: string;
  moduleLabel: string;
  activeTheme: ThemeConfig;
}

export function DynamicModulePage({ moduleId, moduleLabel, activeTheme }: DynamicModulePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg: string) => {
    // Toast messages removed per user request
  };

  // 1. PRINT NAMEBADGE FROM QR CODE MODULE STATE
  const [badgeForm, setBadgeForm] = useState({
    name: 'Mr. Steven Terry',
    company: 'XFAIR GmbH',
    role: 'Technical Lead',
    gateId: 'Munich-HQ-Gate4',
    food: 'Vegetarian'
  });
  const [isPrinting, setIsPrinting] = useState(false);

  // 2. CHECKLIST MODULE STATE
  const [checklist, setChecklist] = useState([
    { id: '1', task: 'Verify trade fair main line power feed', done: true },
    { id: '2', task: 'Pre-print VIP access cards', done: true },
    { id: '3', task: 'Deploy Munich-HQ-Gate4 namebadge printers', done: false },
    { id: '4', task: 'Verify local DB cache sync latency', done: false },
    { id: '5', task: 'Confirm hotel voucher automated mailer', done: false }
  ]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // 3. MEETING ROOMS STATE
  const [bookings, setBookings] = useState([
    { id: 'b1', room: 'Alpha Boardroom', client: 'Audi AG Tech Team', time: '10:00 AM - 11:30 AM', status: 'Approved' },
    { id: 'b2', room: 'Beta Stand Suite', client: 'Siemens Integration', time: '11:45 AM - 12:30 PM', status: 'Approved' },
    { id: 'b3', room: 'Catering Lounge', client: 'Swiss Regional Office', time: '01:00 PM - 02:00 PM', status: 'Pending' }
  ]);
  const [newBooking, setNewBooking] = useState({ room: 'Alpha Boardroom', client: '', time: '02:30 PM - 03:00 PM' });

  // 4. HOTEL REQUEST QUEUE STATE
  const [hotelRequests, setHotelRequests] = useState([
    { id: 'h1', name: 'Arslan Anwar', hotel: 'Maritim Hotel München', dates: 'March 3 - March 8', status: 'Pending', cost: 720 },
    { id: 'h2', name: 'Chirag Patel', hotel: 'Hilton Park Munich', dates: 'March 4 - March 10', status: 'Approved', cost: 1150 },
    { id: 'h3', name: 'Steven Terry', hotel: 'NH Hotel Unterschleißheim', dates: 'March 3 - March 10', status: 'Approved', cost: 890 }
  ]);

  // 5. SALES & PRODUCTS STATE
  const [products, setProducts] = useState([
    { id: 'p1', name: 'Premium Stand Terminal Hub', price: 299.00, category: 'Hardware', stock: 12 },
    { id: 'p2', name: 'XFAIR Pro Software License', price: 899.00, category: 'Software', stock: 150 },
    { id: 'p3', name: 'Namebadge RFID Smartcard Pack', price: 45.00, category: 'Consumables', stock: 450 },
    { id: 'p4', name: 'Mobile Barcode Scanner Unit', price: 150.00, category: 'Devices', stock: 8 }
  ]);
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  // 6. LOG ERROR SEARCH / SYSTEM LOGS STATE
  const [logLevel, setLogLevel] = useState<'ALL' | 'ERROR' | 'INFO' | 'DATABASE'>('ALL');
  const [systemLogs, setSystemLogs] = useState([
    { id: 'l1', time: '2026-05-22 10:01:05', type: 'INFO', context: 'GATE', msg: 'Card RFID checked: EMP-902 present.' },
    { id: 'l2', time: '2026-05-22 10:01:42', type: 'ERROR', context: 'PRINTER', msg: 'Namebadge thermal printer Gate4 paper low exception.' },
    { id: 'l3', time: '2026-05-22 10:02:11', type: 'DATABASE', context: 'SYNC', msg: 'Local DB cache sync complete. Latency 0.12s.' },
    { id: 'l4', time: '2026-05-22 10:02:59', type: 'INFO', context: 'SECURITY', msg: 'Coordinator approval granted for user ID EMP-103.' },
    { id: 'l5', time: '2026-05-22 10:03:01', type: 'ERROR', context: 'API', msg: 'Failed request to external WebHook CRM endpoint. Retry scheduled.' },
    { id: 'l6', time: '2026-05-22 10:03:32', type: 'INFO', context: 'SYSTEM', msg: 'Server active. All modules initialized under Bauma 2028 scope.' }
  ]);

  // 7. DEVICES STATE
  const [devicesList, setDevicesList] = useState([
    { id: 'dev-10', type: 'Android Zebra Scanner', sn: 'SN-00982-Z', battery: '92%', status: 'Assigned', employee: 'Mr. Chirag Patel' },
    { id: 'dev-11', type: 'NFC Badge Reader Block', sn: 'EF-11003-B', battery: 'Line Fed', status: 'Active', employee: 'Unterschleißheim Gate 1' },
    { id: 'dev-12', type: 'Handheld Mobile Device', sn: 'MO-23910-X', battery: '38%', status: 'Stock', employee: 'None' }
  ]);
  const [newDeviceSn, setNewDeviceSn] = useState('');
  const [newDeviceType, setNewDeviceType] = useState('Android Zebra Scanner');

  // 8. DATA TABLE FALLBACK DATA (FOR STANDARD MANAGERS)
  const [generalRows, setGeneralRows] = useState([
    { col1: 'Bauma 2028 - Munich Event', col2: 'Active Main Stand', col3: 'DE-85716', col4: 'Admin-System' },
    { col1: 'Meeting Room Hub West', col2: 'Room Level 1 Block C', col3: 'CH-8001', col4: 'Coordinator-Approval' },
    { col1: 'Catering Contract Standard', col2: 'Internal Ref #20982', col3: 'UK-LO32', col4: 'Billing-Approved' },
    { col1: 'Technical Support Duty', col2: 'Active Lead 24/7', col3: 'DE-85716', col4: 'Operational' }
  ]);
  const [newGeneralRowText, setNewGeneralRowText] = useState('');

  React.useEffect(() => {
    const lmod = moduleId.toLowerCase();
    if (lmod.includes('language')) {
      setGeneralRows([
        { col1: 'English (US)', col2: 'Global Primary', col3: 'EN-US', col4: 'Active-System' },
        { col1: 'English (UK)', col2: 'Global Alternative', col3: 'EN-GB', col4: 'Active-System' },
        { col1: 'Deutsch', col2: 'Fair Local Host', col3: 'DE-DE', col4: 'Active-System' },
        { col1: 'Français', col2: 'European Regional', col3: 'FR-FR', col4: 'Active-System' },
        { col1: 'Español', col2: 'Iberian Extension', col3: 'ES-ES', col4: 'Active-System' },
        { col1: 'Italiano', col2: 'Mediterranean Active', col3: 'IT-IT', col4: 'Enabled' }
      ]);
    } else if (lmod.includes('countr')) {
      setGeneralRows([
        { col1: 'Germany', col2: 'Europe Central', col3: 'DE', col4: 'Active-System' },
        { col1: 'United States', col2: 'North America', col3: 'US', col4: 'Active-System' },
        { col1: 'France', col2: 'Europe West', col3: 'FR', col4: 'Active-System' },
        { col1: 'Switzerland', col2: 'Alpine Non-EU', col3: 'CH', col4: 'Active-System' },
        { col1: 'Austria', col2: 'Europe Central', col3: 'AT', col4: 'Enabled' }
      ]);
    } else if (lmod.includes('right') || lmod.includes('privilege')) {
      setGeneralRows([
        { col1: 'Global System Administrator', col2: 'Full Read/Write Access', col3: 'SYS-ADMIN', col4: 'System-Level' },
        { col1: 'Regional Coordinator', col2: 'Limited Staff Approvals', col3: 'REG-COORD', col4: 'Booth-Level' },
        { col1: 'Lead Stand Personnel', col2: 'Attendance Tracking Only', col3: 'STAND-PERS', col4: 'Operational' }
      ]);
    } else {
      setGeneralRows([
        { col1: 'Bauma 2028 - Munich Event', col2: 'Active Main Stand', col3: 'DE-85716', col4: 'Admin-System' },
        { col1: 'Meeting Room Hub West', col2: 'Room Level 1 Block C', col3: 'CH-8001', col4: 'Coordinator-Approval' },
        { col1: 'Catering Contract Standard', col2: 'Internal Ref #20982', col3: 'UK-LO32', col4: 'Billing-Approved' },
        { col1: 'Technical Support Duty', col2: 'Active Lead 24/7', col3: 'DE-85716', col4: 'Operational' }
      ]);
    }
  }, [moduleId]);

  // ---------------- HEADER / BREADCRUMB BUILDER ----------------
  const findCategory = () => {
    const checkId = moduleId.toLowerCase();
    if (checkId.includes('information') || checkId.includes('criteria') || checkId.includes('agenda') || checkId.includes('checklist') || checkId.includes('check') || checkId.includes('badge') || checkId.includes('checkin')) return 'Event Info';
    if (checkId.includes('room') || checkId.includes('restaurant') || checkId.includes('seating') || checkId.includes('meeting')) return 'Schedule';
    if (checkId.includes('manager') || checkId.includes('limit') || checkId.includes('template') || checkId.includes('wizard') || checkId.includes('dialing') || checkId.includes('rule') || checkId.includes('apps') || checkId.includes('report') || checkId.includes('system')) return 'Configuration';
    if (checkId.includes('image') || checkId.includes('attach') || checkId.includes('module') || checkId.includes('field') || checkId.includes('resource') || checkId.includes('language') || checkId.includes('value') || checkId.includes('countr') || checkId.includes('right')) return 'Resources';
    if (checkId.includes('product') || checkId.includes('price') || checkId.includes('sale') || checkId.includes('order')) return 'Sales';
    if (checkId.includes('report') || checkId.includes('stat') || checkId.includes('photo')) return 'Reporting';
    if (checkId.includes('hotel')) return 'Hotel';
    if (checkId.includes('order') || checkId.includes('ticket')) return 'Orders';
    if (checkId.includes('service')) return 'Services';
    if (checkId.includes('device') || checkId.includes('phone') || checkId.includes('locker')) return 'Devices Manager';
    if (checkId.includes('log') || checkId.includes('db') || checkId.includes('search') || checkId.includes('group') || checkId.includes('match') || checkId.includes('task') || checkId.includes('coordinat') || checkId.includes('upload') || checkId.includes('import') || checkId.includes('regist')) return 'Admin Functions';
    return 'Technicians';
  };

  const currentCategory = findCategory();

  // ---------------- GENERAL EVENT HANDLERS ----------------
  const handlePrintBadge = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      triggerToast(`Namebadge dynamically queued to printer: ${badgeForm.name}`);
    }, 2000);
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistItem.trim()) return;
    setChecklist([...checklist, { id: Date.now().toString(), task: newChecklistItem.trim(), done: false }]);
    setNewChecklistItem('');
    triggerToast('Added task to check-list manager database');
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.client.trim()) return;
    setBookings([...bookings, { id: Date.now().toString(), ...newBooking, status: 'Approved' }]);
    setNewBooking({ room: 'Alpha Boardroom', client: '', time: '02:30 PM - 03:00 PM' });
    triggerToast('Meeting reservation indexed on scheduler server');
  };

  const handleUpdateHotelStatus = (id: string, status: string) => {
    setHotelRequests(hotelRequests.map(req => req.id === id ? { ...req, status } : req));
    triggerToast(`Hotel request is set to '${status.toUpperCase()}' on Munich API`);
  };

  const handleAddToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    triggerToast('Unit loaded to billing checkout queue.');
  };

  const handleClearCart = () => {
    setCart({});
    triggerToast('Cart stack flushed');
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceSn.trim()) return;
    setDevicesList([...devicesList, {
      id: `dev-${Date.now().toString().slice(-2)}`,
      type: newDeviceType,
      sn: newDeviceSn.trim().toUpperCase(),
      battery: '100%',
      status: 'Stock',
      employee: 'None'
    }]);
    setNewDeviceSn('');
    triggerToast('Device registered to local scanner hardware config');
  };

  const handleAddGeneralRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGeneralRowText.trim()) return;
    setGeneralRows([...generalRows, {
      col1: newGeneralRowText.trim(),
      col2: 'Manual Entry Instance',
      col3: 'SYS-GLOBAL',
      col4: 'ACTIVE'
    }]);
    setNewGeneralRowText('');
    triggerToast('Record serialized and successfully added to memory list.');
  };

  // ---------------- RENDERING DECISIONS ----------------
  const renderInteractiveWorkspace = () => {
    const normId = moduleId.toLowerCase();

    // 1. QR CODE / PRINT NAMEBADGE
    if (normId.includes('badge') || normId.includes('qr') || normId.includes('card')) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xs space-y-4" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block">Badge Information Serializer</span>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Full Participant Name</label>
                <input 
                  type="text" 
                  value={badgeForm.name} 
                  onChange={e => setBadgeForm({...badgeForm, name: e.target.value})}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs bg-neutral-50 hover:bg-neutral-50/50 focus:bg-white text-neutral-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Company Association</label>
                <input 
                  type="text" 
                  value={badgeForm.company} 
                  onChange={e => setBadgeForm({...badgeForm, company: e.target.value})}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs bg-neutral-50 hover:bg-neutral-50/50 focus:bg-white text-neutral-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Exhibitor Access Role</label>
                  <div className="relative">
                    <select 
                      value={badgeForm.role} 
                      onChange={e => setBadgeForm({...badgeForm, role: e.target.value})}
                      className="w-full appearance-none px-3 py-2 border rounded-xl text-xs bg-neutral-50 focus:bg-white text-neutral-800 font-medium pr-8"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Technical Lead">Technical Lead</option>
                      <option value="VIP Representative">VIP Representative</option>
                      <option value="Catering Staff">Catering Staff</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Stand Active Gate ID</label>
                  <input 
                    type="text" 
                    value={badgeForm.gateId} 
                    onChange={e => setBadgeForm({...badgeForm, gateId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-neutral-50 text-neutral-800 font-medium"
                  />
                </div>
              </div>

              <button
                onClick={handlePrintBadge}
                disabled={isPrinting}
                className="w-full py-3 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs font-sans transition-all active:scale-[98%]"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                {isPrinting ? (
                  <>
                    <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                    <span>Thermal Ink Rendering...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-4.5 h-4.5" />
                    <span>Compile & Print Namebadge Block</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Badge Layout Preview Card */}
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl border border-neutral-100 shadow-xs relative overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <div className="absolute top-0 inset-x-0 h-2" style={{ backgroundColor: activeTheme.primaryColor }} />
            
            <div className="w-68 border border-neutral-200 rounded-2xl bg-neutral-50 shadow-lg p-5 flex flex-col items-center space-y-4 border-t-8" style={{ borderTopColor: activeTheme.primaryColor }}>
              <div className="flex justify-between items-center w-full pb-3 border-b text-[9px] font-bold text-neutral-400 font-mono">
                <span>XFAIR.org</span>
                <span className="text-emerald-600 font-extrabold uppercase">LEVEL 3 SECURE</span>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase font-mono">{badgeForm.role}</p>
                <h4 className="text-base font-bold text-neutral-800 mt-1 leading-snug">{badgeForm.name}</h4>
                <p className="text-xs font-semibold text-neutral-500">{badgeForm.company}</p>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-xs border border-neutral-200">
                <QrCode className="w-24 h-24 text-neutral-800" />
              </div>

              <div className="text-center text-[9px] font-mono text-neutral-400">
                <span>GATE: {badgeForm.gateId}</span>
                <span className="block mt-1 uppercase text-red-500 font-black">Valid Live 2028 ONLY</span>
              </div>
            </div>

            <p className="text-neutral-400 text-[11px] mt-4 font-mono text-center">
              Uses high-definition 300DPI vector sublimation template layouts directly linked on Bauma 2028 network.
            </p>
          </div>
        </div>
      );
    }

    // 2. CHECKLIST MANAGER / ITEMS
    if (normId.includes('checklist')) {
      const doneCount = checklist.filter(c => c.done).length;
      const pct = Math.round((doneCount / checklist.length) * 100);

      return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="text-xs font-bold text-neutral-400 font-mono uppercase block">{moduleLabel} Database Management</span>
              <h4 className="text-lg font-bold text-neutral-800 mt-0.5">Bauma 2028 Readiness Checkpoints</h4>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-neutral-600 font-mono">{doneCount} / {checklist.length} Completed</span>
              <div className="w-24 bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>

          <form onSubmit={handleAddChecklist} className="flex gap-2">
            <input
              type="text"
              placeholder="Record a new checklist checkpoint task description..."
              value={newChecklistItem}
              onChange={e => setNewChecklistItem(e.target.value)}
              className="flex-1 px-3.5 py-1.5 text-xs border rounded-xl bg-neutral-50 focus:bg-white text-neutral-800"
            />
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:brightness-105 transition-all"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </form>

          <div className="divide-y divide-neutral-100 border rounded-xl overflow-hidden">
            {checklist.map(item => (
              <div key={item.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-neutral-50/50" style={{ backgroundColor: activeTheme.cardColor }}>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                      item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {item.done && <Check className="w-3.5 h-3.5 font-bold" />}
                  </button>
                  <span className={`text-xs ${item.done ? 'line-through text-neutral-400 font-light' : 'text-neutral-700 font-semibold'}`}>
                    {item.task}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setChecklist(checklist.filter(c => c.id !== item.id));
                    triggerToast('Checkpoint deleted from cache list');
                  }}
                  className="text-neutral-300 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 3. MEETING ROOM BOOKING
    if (normId.includes('room') || normId.includes('meeting') || normId.includes('restaurant')) {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-4 xl:col-span-1" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block">Index Reservation</span>
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Select Active Space</label>
                <div className="relative">
                  <select
                    value={newBooking.room}
                    onChange={e => setNewBooking({ ...newBooking, room: e.target.value })}
                    className="w-full appearance-none px-3 py-2 border rounded-xl text-xs bg-neutral-50 focus:bg-white text-neutral-800 pr-8"
                  >
                    <option value="Alpha Boardroom">Alpha Boardroom (Stand Main)</option>
                    <option value="Beta Stand Suite">Beta Stand Suite (Upstairs)</option>
                    <option value="Catering Lounge">Catering Lounge (Bistro Zone)</option>
                    <option value="VIP Dining Room">VIP Dining Room (Restricted)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Client Partner Name</label>
                <input 
                  type="text" 
                  placeholder="Enter firm name or contact person..."
                  value={newBooking.client}
                  onChange={e => setNewBooking({ ...newBooking, client: e.target.value })}
                  className="w-full px-3.5 py-1.5 border rounded-xl text-xs bg-neutral-50 focus:bg-white text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Scheduled Timeslot</label>
                <input 
                  type="text" 
                  value={newBooking.time}
                  onChange={e => setNewBooking({ ...newBooking, time: e.target.value })}
                  className="w-full px-3.5 py-1.5 border rounded-xl text-xs bg-neutral-50 focus:bg-white text-neutral-800 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105 transition-all"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>Save Stand Allocation</span>
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-4 xl:col-span-2" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block">Active Rooms Reservation Grid</span>
            
            <div className="space-y-3">
              {bookings.map(book => (
                <div key={book.id} className="p-4 border rounded-xl bg-neutral-50 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="bg-orange-100 text-orange-850 px-2.5 py-0.5 rounded-full text-[9px] font-sans font-extrabold uppercase" style={{ backgroundColor: activeTheme.primaryColor + '20', color: activeTheme.primaryColor }}>
                      {book.room}
                    </span>
                    <h5 className="text-xs font-bold text-neutral-800 mt-1.5">{book.client}</h5>
                    <p className="text-[10px] font-mono text-neutral-400">{book.time}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      {book.status}
                    </span>
                    <button
                      onClick={() => {
                        setBookings(bookings.filter(b => b.id !== book.id));
                        triggerToast('Booking removed form active timetable');
                      }}
                      className="text-neutral-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 4. HOTEL REQUEST QUEUE
    if (normId.includes('hotel')) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50 border rounded-xl" style={{ backgroundColor: activeTheme.primaryColor + '08', borderColor: activeTheme.primaryColor + '20' }}>
              <span className="text-[10px] font-bold uppercase block text-neutral-400">Indexed Budget Value</span>
              <p className="text-xl font-black text-neutral-800 mt-1">&euro; {hotelRequests.reduce((acc, h) => acc + h.cost, 0)}</p>
              <span className="text-[9px] text-neutral-400 block mt-0.5">Total registered hotel block reserves.</span>
            </div>
            
            <div className="p-4 bg-white border border-neutral-100 rounded-xl" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
              <span className="text-[10px] font-bold uppercase block text-neutral-400">Total requests</span>
              <p className="text-xl font-bold text-neutral-800 mt-1">{hotelRequests.length} Rooms</p>
              <span className="text-[9px] text-neutral-400 block mt-0.5">March 3 &ndash; 10 Block Booking</span>
            </div>

            <div className="p-4 bg-white border border-neutral-100 rounded-xl" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
              <span className="text-[10px] font-bold uppercase block text-neutral-400">Pending Approvals</span>
              <p className="text-xl font-bold text-neutral-850 mt-1" style={{ color: activeTheme.primaryColor }}>
                {hotelRequests.filter(h => h.status === 'Pending').length} Pending
              </p>
              <span className="text-[9px] text-neutral-400 block mt-0.5">Awaiting manager dispatch approval.</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm overflow-x-auto" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block pb-4">Hotel Reservation and Allocation Queue</span>
            
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-neutral-400 font-bold">
                  <th className="pb-3 pr-2 whitespace-nowrap">PERSONNEL</th>
                  <th className="pb-3 pr-2 whitespace-nowrap">ALLOCATED HOTEL STAND</th>
                  <th className="pb-3 pr-2 whitespace-nowrap">STAY TIMEFRAME</th>
                  <th className="pb-3 pr-2 whitespace-nowrap">ALLOCATED BUDGET</th>
                  <th className="pb-3 pr-2 whitespace-nowrap">SYSTEM STATUS</th>
                  <th className="pb-3 text-right whitespace-nowrap">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {hotelRequests.map(req => (
                  <tr key={req.id} className="hover:bg-neutral-50/20">
                    <td className="py-3.5 pr-2 font-bold text-neutral-850">{req.name}</td>
                    <td className="py-3.5 pr-2 font-semibold text-neutral-600">{req.hotel}</td>
                    <td className="py-3.5 pr-2 font-mono text-[11px] text-neutral-500">{req.dates}</td>
                    <td className="py-3.5 pr-2 font-bold text-neutral-800">&euro; {req.cost}</td>
                    <td className="py-3.5 pr-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-1 whitespace-nowrap">
                      {req.status === 'Pending' ? (
                        <button
                          onClick={() => handleUpdateHotelStatus(req.id, 'Approved')}
                          className="px-2.5 py-1 text-white text-[10px] font-bold rounded bg-emerald-500 hover:brightness-105 cursor-pointer"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateHotelStatus(req.id, 'Pending')}
                          className="px-2.5 py-1 text-neutral-600 text-[10px] font-bold rounded bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // 5. SALES & PRODUCTS CHECKOUT
    if (normId.includes('product') || normId.includes('price') || normId.includes('sales')) {
      const cartItemsCount = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);
      const cartTotal = products.reduce((acc, p) => acc + (cart[p.id] || 0) * p.price, 0);

      return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Products Grid */}
          <div className="xl:col-span-8 space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
              <span className="text-xs font-bold text-neutral-400 font-mono uppercase">ERP Product Catalog ({products.length} Items)</span>
              <span className="text-[10px] text-orange-600 font-bold" style={{ color: activeTheme.primaryColor }}>Interactive Stand Registers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl border flex flex-col justify-between space-y-3" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
                  <div>
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-[9px] font-bold text-neutral-500 uppercase">{p.category}</span>
                    <h5 className="text-xs font-bold text-neutral-800 mt-2">{p.name}</h5>
                    <p className="text-sm font-mono font-bold text-neutral-900 mt-1">&euro; {p.price.toFixed(2)}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-[10px] text-neutral-400">Stock: {p.stock} units</span>
                    <button
                      onClick={() => handleAddToCart(p.id)}
                      className="px-3 py-1.5 text-[10px] text-white font-bold rounded-lg cursor-pointer transition-all hover:scale-[102%]"
                      style={{ backgroundColor: activeTheme.primaryColor }}
                    >
                      Increment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Billing Workspace */}
          <div className="xl:col-span-4 bg-white p-5 rounded-2xl border flex flex-col justify-between space-y-4" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <div>
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <span className="text-xs font-bold text-neutral-500 uppercase font-mono">Invoice Checkout Cart</span>
                {cartItemsCount > 0 && (
                  <button onClick={handleClearCart} className="text-[10px] text-red-500 hover:underline cursor-pointer">
                    Flush
                  </button>
                )}
              </div>

              {cartItemsCount === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-2">
                  <DollarSign className="w-8 h-8 mx-auto text-neutral-350" style={{ color: activeTheme.primaryColor }} />
                  <p className="text-xs">No catalog items mapped in checkout buffer.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {products.map(p => {
                    const qty = cart[p.id] || 0;
                    if (qty === 0) return null;
                    return (
                      <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-neutral-50 rounded-lg">
                        <div>
                          <p className="font-bold text-neutral-800 class truncate max-w-[150px]">{p.name}</p>
                          <span className="text-[10px] text-neutral-400">&euro; {p.price.toFixed(2)} x {qty}</span>
                        </div>
                        <span className="font-mono font-bold text-neutral-850">&euro; {(p.price * qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-semibold text-neutral-500">Gross Total</span>
                <span className="text-base font-black font-mono text-neutral-900">&euro; {cartTotal.toFixed(2)}</span>
              </div>

              <button
                disabled={cartItemsCount === 0}
                onClick={() => {
                  triggerToast(`Receipt generated and dispatched code total: €${cartTotal.toFixed(2)}`);
                  handleClearCart();
                }}
                className="w-full py-2.5 rounded-xl text-xs text-white font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-center transition-all shadow-xs"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                Compile Order and Print Ticket
              </button>
            </div>

          </div>

        </div>
      );
    }

    // 6. DEVELOPER EXTREME SYSTEM LOG TERMINAL
    if (normId.includes('log') || normId.includes('db') || normId.includes('search') || normId.includes('error')) {
      const filteredLogs = logLevel === 'ALL' 
        ? systemLogs 
        : systemLogs.filter(l => l.type === logLevel || l.context === logLevel);

      return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-4" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
            <div>
              <span className="text-xs font-bold text-neutral-400 font-mono uppercase block">System Debug Tunnel</span>
              <h4 className="text-base font-bold text-neutral-800">Operational Log Streams Console</h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'INFO', 'ERROR', 'DATABASE'] as const).map(lev => (
                <button
                  key={lev}
                  type="button"
                  onClick={() => setLogLevel(lev)}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold cursor-pointer ${
                    logLevel === lev 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-650'
                  }`}
                >
                  {lev}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-neutral-950 rounded-2xl font-mono text-[11px] text-emerald-400 space-y-2 h-72 overflow-y-auto custom-scrollbar shadow-inner border border-neutral-900 leading-relaxed">
            <span className="text-[9px] text-neutral-500 font-bold block border-b border-neutral-900 pb-1.5 mb-2.5">BAUMA2028 INTERFACE DEBUG GATE: ACTIVE</span>
            {filteredLogs.map(log => (
              <p key={log.id} className="hover:bg-neutral-900/40 py-0.5 rounded transition-colors">
                <span className="text-neutral-500">[{log.time}]</span>{' '}
                <span className={`font-bold uppercase ${
                  log.type === 'ERROR' ? 'text-red-500' : log.type === 'DATABASE' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  [{log.type}]
                </span>{' '}
                <span className="text-neutral-400 font-semibold">&lt;{log.context}&gt;</span>{' '}
                <span className="text-neutral-50">{log.msg}</span>
              </p>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] text-neutral-400">
            <span>Latency offset calibration: <strong>0.12s Standard (Stable)</strong></span>
            <button
              onClick={() => {
                setSystemLogs([
                  {
                    id: Date.now().toString(),
                    time: new Date().toISOString().replace('T', ' ').slice(0, 19),
                    type: 'INFO',
                    context: 'USER',
                    msg: `Manual log flush and stack test triggered by ${badgeForm.name || 'Admin'}.`
                  },
                  ...systemLogs
                ]);
                triggerToast('Appended user audit entry log code');
              }}
              className="px-3 py-1 font-mono rounded border hover:bg-neutral-50 text-neutral-600 font-bold cursor-pointer"
            >
              Add Sandbox Log Entry +
            </button>
          </div>
        </div>
      );
    }

    // 7. DEVICES MANAGER
    if (normId.includes('device') || normId.includes('phone') || normId.includes('locker')) {
      return (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block">Register Scanner/Locker Key Hardware</span>
            
            <form onSubmit={handleAddDevice} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Hardware ID / Serial Key</label>
                <input
                  type="text"
                  placeholder="e.g. SN-99824-L..."
                  value={newDeviceSn}
                  onChange={e => setNewDeviceSn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-neutral-50 focus:bg-white text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase font-sans">Unit Model Type</label>
                <div className="relative">
                  <select
                    value={newDeviceType}
                    onChange={e => setNewDeviceType(e.target.value)}
                    className="w-full appearance-none py-2 px-3 border rounded-xl text-xs bg-neutral-50 focus:bg-white text-neutral-800 font-medium pr-8"
                  >
                    <option value="Android Zebra Scanner">Android Zebra Scanner</option>
                    <option value="RFID Wristband Token">RFID Wristband Token</option>
                    <option value="Locker RF-Key Fob">Locker RF-Key Fob</option>
                    <option value="Mobile Phone LTE Host">Mobile Phone LTE Host</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 text-white text-xs font-bold rounded-xl cursor-pointer hover:brightness-105 transition-all flex items-center gap-1"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Assign Serial</span>
              </button>
            </form>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block pb-4">Indexed Hardware Inventory</span>
            <div className="divide-y divide-neutral-150">
              {devicesList.map(dev => (
                <div key={dev.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 font-mono tracking-wide">{dev.id}</span>
                    <h5 className="text-xs font-bold text-neutral-800 mt-0.5">{dev.type}</h5>
                    <p className="text-[10px] font-mono text-neutral-400 mt-1">Serial SN: <strong>{dev.sn}</strong></p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] block font-mono text-neutral-500">Power: <strong className="text-emerald-600">{dev.battery}</strong></span>
                      <span className="text-[10px] block text-neutral-400">Assigned: {dev.employee}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600">
                      {dev.status}
                    </span>

                    <button
                      onClick={() => {
                        setDevicesList(devicesList.filter(d => d.id !== dev.id));
                        triggerToast('Hardware unit deleted from system registers');
                      }}
                      className="text-neutral-305 hover:text-red-500 p-1 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // GENERAL STANDARD DETAILED LIST DATA TABLE INTERACTION
    return (
      <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block">System Category Management Console</span>
            <h4 className="text-lg font-bold text-neutral-800 mt-0.5">XFAIR Resource Datatables Grid</h4>
            <p className="text-xs text-neutral-400 mt-1">
              Add database credentials, configure look-up matrices, or deploy microservice assets dynamically.
            </p>
          </div>

          <form onSubmit={handleAddGeneralRow} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter active record name..."
              value={newGeneralRowText}
              onChange={e => setNewGeneralRowText(e.target.value)}
              className="px-3.5 py-1.5 text-xs border rounded-xl bg-neutral-50 focus:bg-white text-neutral-800 w-52 sm:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Insert Record</span>
            </button>
          </form>
        </div>

        {/* Standard Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pr-2 font-mono">RECORD NAME</th>
                <th className="pb-3 pr-2 font-mono">DEPLOYMENT SCOPE</th>
                <th className="pb-3 pr-2 font-mono">LOCALE CODE</th>
                <th className="pb-3 pr-2 font-mono">SYSTEM STATUS</th>
                <th className="pb-3 text-right font-mono">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {generalRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/20">
                  <td className="py-3.5 pr-2 font-bold text-neutral-850">{row.col1}</td>
                  <td className="py-3.5 pr-2 font-semibold text-neutral-600">{row.col2}</td>
                  <td className="py-3.5 pr-2 font-mono text-neutral-500">{row.col3}</td>
                  <td className="py-3.5 pr-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {row.col4}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setGeneralRows(generalRows.filter((_, i) => i !== idx));
                        triggerToast('Record successfully pruned from memory list.');
                      }}
                      className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header and Sync State indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: activeTheme.borderColor }}>
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold tracking-wide uppercase font-mono">
            <span>ERP SUITE</span>
            <span>&gt;</span>
            <span>{currentCategory}</span>
            <span>&gt;</span>
            <span className="text-orange-500" style={{ color: activeTheme.primaryColor }}>{moduleLabel}</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-2" style={{ color: activeTheme.textColor }}>
            {moduleLabel}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Enterprise database terminal interface supporting dynamic configuration sync.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-100 rounded-xl flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server Cache Synced</span>
          </div>
          
          <button
            onClick={() => triggerToast('Remote database records fully refreshed.')}
            className="p-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-600 transition-all cursor-pointer shadow-xs flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating alert/success micro-interaction toasts */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-650" />
              <span className="text-xs font-semibold">{successToast}</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">Ref: XFAIR-ERP-901</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main rendering area containing our tailored interactive widgets */}
      {renderInteractiveWorkspace()}

    </div>
  );
}
