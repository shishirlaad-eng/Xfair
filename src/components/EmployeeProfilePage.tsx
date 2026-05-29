/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Send, Phone, MapPin, Building, Briefcase, Award,
  CheckCircle, Calendar, CalendarRange, Clock, Coffee, ShieldAlert,
  ChevronRight, ArrowLeftRight, Compass, ShieldCheck, Mail, MessageSquare,
  Printer, Smartphone, Columns, Copy, Plus, MoreHorizontal, UserSearch
} from 'lucide-react';
import { EmployeeProfile, Appointment, ServiceItem, ThemeConfig } from '../types';

interface EmployeeProfilePageProps {
  employee: EmployeeProfile;
  onChangeEmployee: (emp: EmployeeProfile) => void;
  activeTheme: ThemeConfig;
  onNavigateToCalendar: () => void;
}

export function EmployeeProfilePage({ employee, onChangeEmployee, activeTheme, onNavigateToCalendar }: EmployeeProfilePageProps) {
  const [profile, setProfile] = useState<EmployeeProfile>(employee);
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Dynamic edits state
  const [isEditingDeputy, setIsEditingDeputy] = useState(false);
  const [newDeputyName, setNewDeputyName] = useState('');
  const [selectedDayTab, setSelectedDayTab] = useState<number>(4);

  const toggleDayStatus = (day: number) => {
    const current = profile.attendance[day] || 'none';
    let next: 'none' | 'present' | 'absent' | 'pending' = 'none';
    if (current === 'none') next = 'present';
    else if (current === 'present') next = 'absent';
    else if (current === 'absent') next = 'pending';
    else next = 'none';

    const updated = {
      ...profile,
      attendance: {
        ...profile.attendance,
        [day]: next
      }
    };
    setProfile(updated);
    onChangeEmployee(updated);
    
    setStatusMsg(`Day ${day} status toggled to '${next.toUpperCase()}'`);
    setShowStatusSuccess(true);
    setTimeout(() => setShowStatusSuccess(false), 2000);
  };

  const handleAddDeputy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeputyName.trim()) return;
    const updated = {
      ...profile,
      deputies: [...profile.deputies, newDeputyName.trim()]
    };
    setProfile(updated);
    onChangeEmployee(updated);
    setNewDeputyName('');
    setIsEditingDeputy(false);
    
    setStatusMsg(`Deputy '${newDeputyName}' added as system backup.`);
    setShowStatusSuccess(true);
    setTimeout(() => setShowStatusSuccess(false), 2000);
  };

  const handleRemoveDeputy = (nameToRemove: string) => {
    const updated = {
      ...profile,
      deputies: profile.deputies.filter(d => d !== nameToRemove)
    };
    setProfile(updated);
    onChangeEmployee(updated);
    
    setStatusMsg(`Deputy '${nameToRemove}' removed.`);
    setShowStatusSuccess(true);
    setTimeout(() => setShowStatusSuccess(false), 2000);
  };

  const handleActionClick = (actionName: string) => {
    setStatusMsg(`Action Triggered: ${actionName} configured for ${profile.name}`);
    setShowStatusSuccess(true);
    setTimeout(() => setShowStatusSuccess(false), 2000);
  };

  // Pre-calculated stats
  const totalDaysRegistered = Object.values(profile.attendance).filter(v => v !== 'none').length;
  const presentDaysCount = Object.values(profile.attendance).filter(v => v === 'present').length;
  const attendanceRate = totalDaysRegistered > 0 ? Math.round((presentDaysCount / totalDaysRegistered) * 100) : 100;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Breadcrumb & Quick Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: activeTheme.borderColor }}>
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium tracking-wide">
            <span>EMS</span>
            <ChevronRight className="w-3 nav-arrow h-3 text-neutral-300" />
            <span>Personnel</span>
            <ChevronRight className="w-3 nav-arrow h-3 text-neutral-300" />
            <span>Employees Manager</span>
            <ChevronRight className="w-3 nav-arrow h-3 text-neutral-300" />
            <span className="text-neutral-800 font-semibold" style={{ color: activeTheme.primaryColor }}>Executive Profile</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mt-2" style={{ color: activeTheme.textColor }}>
            Personnel Directory
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Display identity cards, language qualifications, upcoming on-stand appointments, and schedules.
          </p>
        </div>

        {/* Global Toolbar Panel, transforming old ugly sidebar icons */}
        <div className="flex flex-wrap items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-neutral-200">
          <button 
            onClick={() => handleActionClick('Send Email via Outlook')} 
            title="Email Personnel"
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <Mail className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={() => handleActionClick('Send E-SMS broadcast')} 
            title="SMS broadcast"
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <Smartphone className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={() => handleActionClick('Generate Chat Session')} 
            title="Instant Live Chat"
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={() => handleActionClick('Print Badges & ID layouts')} 
            title="Print Credentials"
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <Printer className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={() => handleActionClick('Database sync to handheld RFID')} 
            title="Sync device tags"
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <Compass className="w-4.5 h-4.5" />
          </button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <button 
            onClick={onNavigateToCalendar}
            className="px-3.5 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            Calendar Grid View
          </button>
        </div>
      </div>

      {/* Analytics widgets for Steven Terry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Confirmed Attendance</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-neutral-800" style={{ color: activeTheme.textColor }}>{attendanceRate}%</span>
            <span className="text-xs text-neutral-500 font-mono">{presentDaysCount} Active Days</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${attendanceRate}%` }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Total Engagements</span>
          <div className="flex items-baseline justify-between mt-12 md:mt-1">
            <span className="text-2xl font-bold text-neutral-800" style={{ color: activeTheme.textColor }}>{profile.appointments.length} Meetings</span>
            <span className="text-xs text-neutral-400 font-mono">On-stand block</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-light mt-2.5">
            Bauma Room1 & Hall assignments
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Stand Service Vouchers</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-neutral-800" style={{ color: activeTheme.textColor }}>{profile.services.length} Vouchers</span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-200">Confirmed</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-light mt-3">
            Morning setups & latency trials
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Security Checkpoint Status</span>
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-sans">Level 1 Checked</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-light mt-3 truncate">
            RFID: Approved at Main Ingress
          </p>
        </div>
      </div>

      {/* Main Grid: Info Header Card, Profile Bio and Secondary details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Info Blocks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Identity Header Card with photo - Premium redesign */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm relative overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            {/* Soft decorative visual element */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-orange-500/5 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Photo */}
              <div className="relative group">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-neutral-50 shadow-md group-hover:scale-102 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-emerald-500 border-2 border-white rounded-full" title="Status: On Duty" />
              </div>

              {/* Bio block */}
              <div className="flex-1 space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-2xl font-bold text-neutral-900" style={{ color: activeTheme.textColor }}>{profile.name}</h3>
                  <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Executive Key
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-600 block">{profile.position} at {profile.company}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs text-neutral-500 font-light pt-1">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neutral-400" />
                    Dept: {profile.department}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-neutral-400" />
                    Cost Center: {profile.costCenter}
                  </span>
                </div>
              </div>

              {/* Quick interactive print and tag sync card */}
              <div className="w-full sm:w-auto p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">Personal NFC ID</span>
                <span className="text-xs font-mono font-bold block text-neutral-700">#NFC-902-STERRY</span>
                <span className="text-[10px] text-emerald-600 block bg-emerald-50 border border-emerald-100 rounded px-1 px-1.5 py-0.5 mt-1 font-semibold">Active & Encrypted</span>
              </div>
            </div>

            {/* Attendance Track timeline - March 2028 */}
            <div className="border-t mt-8 pt-6" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-semibold text-neutral-800 text-xs uppercase tracking-wider font-sans">
                    Attendance Calendar Row: March 2028
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-light mt-0.5">
                    Click cells to toggle status interactively. Days 3 to 10 are official Event Fair Days.
                  </p>
                </div>
                {showStatusSuccess && (
                  <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 animate-slide-in">
                    {statusMsg}
                  </span>
                )}
              </div>

              {/* Day cells 1 to 14 */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 14 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isFairDay = dayNum >= 3 && dayNum <= 10;
                  const status = profile.attendance[dayNum] || 'none';
                  
                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => toggleDayStatus(dayNum)}
                      className={`flex-1 min-w-[42px] max-w-[55px] p-2 rounded-xl text-center border transition-all cursor-pointer select-none ${
                        status === 'present'
                          ? 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-xs'
                          : status === 'absent'
                          ? 'bg-red-500 text-white border-red-600 font-bold'
                          : status === 'pending'
                          ? 'bg-amber-400 text-neutral-900 border-amber-500 font-bold'
                          : isFairDay
                          ? 'bg-neutral-50 text-neutral-800 border-orange-300 font-medium'
                          : 'bg-neutral-50 text-neutral-400 border-neutral-200 font-light'
                      }`}
                    >
                      <span className="text-[10px] block font-mono">D{dayNum}</span>
                      <span className="text-[9px] block tracking-normal uppercase font-bold mt-1 scale-90">
                        {status === 'present' ? 'Pres' : status === 'absent' ? 'Abs' : status === 'pending' ? 'Pend' : isFairDay ? 'Fair' : '-'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Personal data details accordion - 3 sections row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-mono block pb-2 border-b border-neutral-100">Contact Channels</span>
              <div className="space-y-3.5 mt-3 text-xs">
                <div>
                  <span className="text-neutral-400 block font-light">Default Email</span>
                  <a href={`mailto:${profile.email}`} className="font-semibold text-neutral-800 hover:underline hover:text-orange-500 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    {profile.email}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-400 block font-light">Office Phone</span>
                  <span className="font-semibold text-neutral-800 block mt-0.5">{profile.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-light">Mobile Handset</span>
                  <span className="font-semibold text-neutral-800 block mt-0.5">{profile.mobile}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-mono block pb-2 border-b border-neutral-100">Primary Company</span>
              <div className="space-y-3 mt-3 text-xs">
                <div>
                  <span className="text-neutral-400 block font-light">Corporate Employer</span>
                  <span className="font-bold text-neutral-800 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-neutral-400" />
                    {profile.company}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-light">Logistic Headquarters</span>
                  <span className="font-medium text-neutral-600 block mt-0.5 leading-relaxed">
                    {profile.companyAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Backups & Deputies list card */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-mono block">Backup Deputies</span>
                <button
                  type="button"
                  onClick={() => setIsEditingDeputy(!isEditingDeputy)}
                  className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
                  style={{ color: activeTheme.primaryColor }}
                >
                  {isEditingDeputy ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingDeputy && (
                <form onSubmit={handleAddDeputy} className="mt-2.5 flex gap-1 bg-neutral-50 p-1.5 rounded-lg border border-neutral-200">
                  <input
                    type="text"
                    required
                    placeholder="Deputy name..."
                    value={newDeputyName}
                    onChange={(e) => setNewDeputyName(e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-neutral-200 rounded text-xs focus:outline-none"
                  />
                  <button type="submit" className="px-2 py-1 bg-orange-600 text-white rounded text-[10px] font-bold hover:bg-orange-700 cursor-pointer">
                    Add
                  </button>
                </form>
              )}

              <div className="space-y-2 mt-3">
                {profile.deputies.map((dep, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                    <span className="font-medium text-neutral-700">{dep}</span>
                    {isEditingDeputy && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDeputy(dep)}
                        className="text-neutral-400 hover:text-red-500 font-bold px-1"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Criteria details card, mapping the 2nd image layout exactly */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-neutral-400" />
                <h4 className="font-medium text-neutral-800 text-base" style={{ color: activeTheme.textColor }}>Enterprise Criteria & Credentials</h4>
              </div>
              <span className="text-xs text-neutral-400 font-light">Verification Level Checked</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Strategic Areas</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {profile.criteria.areas.map((x, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 font-semibold">{x}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Assigned Corporate Unit</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {profile.criteria.businessUnit.map((x, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">{x}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Stand Management Function</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {profile.criteria.companyFunction.map((x, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">{x}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Territory Country Responsibilities</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {profile.criteria.countryResponsibility.map((x, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-neutral-50 text-neutral-600 border border-neutral-200 font-mono text-[10px]">{x}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Stand Executive Escort Mapping</span>
                  <div className="space-y-1 mt-1.5 text-[11px] text-neutral-600">
                    {profile.criteria.executives.map((x, i) => (
                      <div key={i} className="p-1.5 bg-neutral-50 rounded border border-neutral-100">{x}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2 of Criteria */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Catering & Dietary Intentions</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {profile.criteria.foodPreferences.map((x, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold capitalize">{x}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Lead Industry Segment</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {profile.criteria.industrySegment.map((x, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">{x}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Interactive Language Proficiencies</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {profile.criteria.languages.map((x, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium text-[11px]" style={{ fontFamily: activeTheme.fontFamily }}>{x}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block font-sans">Technology Product Class Groups</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {profile.criteria.productGroup.map((x, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-neutral-50 text-neutral-600 border border-neutral-200 text-[10px] font-mono">{x}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Collateral Column: Calendar appointments, schedule and actions */}
        <div className="space-y-6">
          
          {/* Calendar On-Stand Appointments card */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-neutral-400" />
                <h4 className="font-medium text-neutral-800 text-base" style={{ color: activeTheme.textColor }}>Upcoming Appointments</h4>
              </div>
              <span className="text-xs text-neutral-400">{profile.appointments.length} Blocked</span>
            </div>

            <div className="space-y-4">
              {profile.appointments.map((apt) => (
                <div key={apt.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 hover:border-neutral-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[9px] font-mono font-bold rounded" style={{ backgroundColor: activeTheme.primaryColor + '1F', color: activeTheme.primaryColor }}>
                      {apt.room}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{apt.id}</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800 leading-tight">{apt.subject}</h5>
                    <p className="text-[10px] text-neutral-500 font-light mt-1 leading-relaxed">{apt.details}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-semibold pt-1 border-t border-neutral-200/50">
                    <Clock className="w-3.5 h-3.5 text-neutral-300" />
                    <span>{apt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stand Services Requested card */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-neutral-400" />
                <h4 className="font-medium text-neutral-800 text-base" style={{ color: activeTheme.textColor }}>Stand Services Log</h4>
              </div>
              <span className="text-xs text-neutral-400">{profile.services.length} items</span>
            </div>

            <div className="space-y-3.5">
              {profile.services.map((srv) => (
                <div key={srv.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-700 truncate max-w-[170px]">{srv.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      srv.status === 'Confirmed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {srv.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1.5 border-t border-dotted border-neutral-200">
                    <span>{srv.time}</span>
                    <span className="font-mono">{srv.id}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
