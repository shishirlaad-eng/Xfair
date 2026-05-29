/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Check, HelpCircle, Save, Info, AlertCircle, ChevronLeft, 
  ChevronRight, Users, Sparkles, Filter, RefreshCw, BarChart2, CheckCircle2 
} from 'lucide-react';
import { ThemeConfig, EmployeeProfile } from '../types';

interface AttendanceCalendarPageProps {
  employee: EmployeeProfile;
  onChangeEmployee: (emp: EmployeeProfile) => void;
  activeTheme: ThemeConfig;
}

interface CalendarDay {
  dayNum: number;
  monthName: string;
  year: number;
  weekday: string;
  isFairDay: boolean;
  status: 'present' | 'absent' | 'pending' | 'none';
  label?: string;
}

export function AttendanceCalendarPage({ employee, onChangeEmployee, activeTheme }: AttendanceCalendarPageProps) {
  const [currentMonth, setCurrentMonth] = useState('March 2028');
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedDayInfo, setSelectedDayInfo] = useState<CalendarDay | null>(null);

  // Read March 2028 schedule from employee state or default
  // March 1, 2028 is a Wednesday
  const weekdaysPattern = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'];
  
  const generateMarchDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    for (let d = 1; d <= 31; d++) {
      const patternIdx = (d - 1) % 7;
      const weekday = weekdaysPattern[patternIdx];
      // Fair Days correspond exactly to screenshot: March 3, 4, 5, 6, 7, 8, 9, 10
      const isFairDay = d >= 3 && d <= 10;
      const status = employee.attendance[d] || 'none';
      days.push({
        dayNum: d,
        monthName: 'March',
        year: 2028,
        weekday,
        isFairDay,
        status,
        label: isFairDay ? 'Fair Day' : undefined
      });
    }
    return days;
  };

  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>(generateMarchDays());

  const handleCellClick = (day: CalendarDay) => {
    setSelectedDayInfo(day);
  };

  const toggleStatus = (dayNum: number, nextStatus: 'present' | 'absent' | 'pending' | 'none') => {
    const updatedDays = calendarDays.map(d => {
      if (d.dayNum === dayNum) {
        return { ...d, status: nextStatus };
      }
      return d;
    });
    setCalendarDays(updatedDays);

    // Sync to parent employee profile
    const updatedAttendance = { ...employee.attendance, [dayNum]: nextStatus };
    const updatedEmployee = { ...employee, attendance: updatedAttendance };
    onChangeEmployee(updatedEmployee);

    // If current selected, sync info
    if (selectedDayInfo && selectedDayInfo.dayNum === dayNum) {
      setSelectedDayInfo(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleSelectAllToggle = () => {
    const nextVal = !isSelectAll;
    setIsSelectAll(nextVal);
    const nextStatus = nextVal ? 'present' : 'none';
    
    const updatedDays = calendarDays.map(d => ({
      ...d,
      status: d.isFairDay ? nextStatus : d.status
    }));
    setCalendarDays(updatedDays);

    // Sync state to parent for all fair days
    const attendanceCopy = { ...employee.attendance };
    for (let d = 3; d <= 10; d++) {
      attendanceCopy[d] = nextStatus;
    }
    onChangeEmployee({ ...employee, attendance: attendanceCopy });
  };

  const saveRosterState = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Stats calculation
  const totalFairDays = calendarDays.filter(d => d.isFairDay).length;
  const standardShowDays = calendarDays.filter(d => d.isFairDay && d.status === 'present').length;
  const compliancePercent = Math.round((standardShowDays / totalFairDays) * 100);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: activeTheme.borderColor }}>
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium tracking-wide">
            <span>EMS</span>
            <ChevronRight className="w-3 nav-arrow h-3 text-neutral-300" />
            <span>Schedule Planner</span>
            <ChevronRight className="w-3 nav-arrow h-3 text-neutral-300" />
            <span className="text-neutral-800 font-semibold" style={{ color: activeTheme.primaryColor }}>Attendance by Month</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mt-2" style={{ color: activeTheme.textColor }}>
            Manager Roster Calendar
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Display daily check-in states, fair events, and hotel stays for attendee rosters.
          </p>
        </div>

        {/* Global actions row */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectAllToggle}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-xs hover:bg-neutral-50 text-neutral-700 bg-white font-semibold cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{isSelectAll ? 'Deselect All Fair Days' : 'Select All Fair Days'}</span>
          </button>
          
          <button
            onClick={saveRosterState}
            className="px-5 py-2 text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm hover:brightness-105"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            <Save className="w-4 h-4" />
            Save Attendance Grid
          </button>
        </div>
      </div>

      {/* Roster & Calendar Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Fair Coverage Rate</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-neutral-800" style={{ color: activeTheme.textColor }}>{compliancePercent}%</span>
            <span className="text-xs text-emerald-600 font-bold">{standardShowDays} / {totalFairDays} Days</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${compliancePercent}%`, backgroundColor: activeTheme.primaryColor }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Assigned Personnel</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-neutral-800" style={{ color: activeTheme.textColor }}>{employee.name}</span>
            <span className="text-xs text-indigo-600 font-semibold">{employee.company}</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-light block mt-2">Active Technical Lead of Stand</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Event Terminus</span>
          <p className="text-sm font-semibold text-neutral-800 mt-2">March 3 &ndash; 10, 2028</p>
          <span className="text-[10px] font-mono text-orange-600 block mt-1.5" style={{ color: activeTheme.primaryColor }}>8 Official Fair Days</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">DayPilot Grid Engine</span>
          <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs mt-2.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Virtual DOM Ready</span>
          </div>
          <span className="text-[10px] text-neutral-400 block mt-1 font-light">Custom CSS styling applied.</span>
        </div>

      </div>

      {/* Floating Save confirmation overlay */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-between shadow-lg sticky top-6 z-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold">Daypilot state metrics serialized and saved to memory database.</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Timestamp: {new Date().toLocaleTimeString()}</span>
        </div>
      )}

      {/* Calendar Master Layout Grid with Sidebar controls */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Calendar DayPilot Month Structure Panel (Col-span 3) */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Calendar Controller Header */}
          <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-xs flex items-center justify-between" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-600" style={{ color: activeTheme.primaryColor }} />
              <span className="text-sm font-bold text-neutral-800">{currentMonth}</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentMonth(currentMonth.includes('March') ? 'February 2028' : 'March 2028')}
                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 cursor-pointer text-xs flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentMonth('March 2028')}
                className="px-3 py-1 border border-neutral-200 rounded-lg text-xs hover:bg-neutral-50 text-neutral-600 font-semibold cursor-pointer"
              >
                Today
              </button>
              <button 
                onClick={() => setCurrentMonth(currentMonth.includes('March') ? 'April 2028' : 'March 2028')}
                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 cursor-pointer text-xs flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekdays Grid Headers */}
          <div className="grid grid-cols-7 gap-2.5 text-center">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
              <div key={d} className="py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono bg-neutral-100 rounded-md">
                {d.substring(0, 3)}
              </div>
            ))}
          </div>

          {/* 31 Calendar Cells Grid starting Wednesday */}
          {/* We insert 2 empty offset placeholder cells because March 1, 2028 starts on Wednesday */}
          <div className="grid grid-cols-7 gap-2.5">
            {/* Empty Offset cells */}
            <div className="aspect-square bg-neutral-100/40 rounded-xl border border-neutral-200/50 p-2 text-neutral-300 font-light text-xs flex items-end justify-start select-none">
              <span className="font-mono">28</span>
            </div>
            <div className="aspect-square bg-neutral-100/40 rounded-xl border border-neutral-200/50 p-2 text-neutral-300 font-light text-xs flex items-end justify-start select-none">
              <span className="font-mono">29</span>
            </div>

            {/* Real March 2028 Cells */}
            {calendarDays.map((day) => {
              const statusColors = {
                present: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-300 text-emerald-800',
                absent: 'bg-red-50 hover:bg-red-100/70 border-red-300 text-red-800',
                pending: 'bg-amber-50 hover:bg-amber-100/70 border-amber-300 text-amber-800',
                none: 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600'
              };

              // Check if selected
              const isSelected = selectedDayInfo && selectedDayInfo.dayNum === day.dayNum;

              return (
                <div
                  key={day.dayNum}
                  onClick={() => handleCellClick(day)}
                  className={`aspect-square p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative ${
                    statusColors[day.status]
                  } ${
                    isSelected ? 'ring-2 ring-neutral-800 ring-offset-2' : ''
                  }`}
                  style={{ 
                    borderLeft: day.isFairDay ? `4px solid ${activeTheme.primaryColor}` : undefined 
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs font-bold leading-none">{day.dayNum}</span>
                    
                    {/* Status dot in cell */}
                    {day.status !== 'none' && (
                      <span className={`w-2 h-2 rounded-full ${
                        day.status === 'present' ? 'bg-emerald-500' : day.status === 'absent' ? 'bg-red-500' : 'bg-amber-400'
                      }`} />
                    )}
                  </div>

                  {/* Badges details inside cells */}
                  <div className="space-y-1">
                    {day.isFairDay && (
                      <span className="text-[7.5px] font-bold uppercase tracking-wider block bg-orange-100 px-1 py-0.5 rounded text-orange-800 truncate" style={{ backgroundColor: activeTheme.primaryColor + '15', color: activeTheme.primaryColor }}>
                        {day.label}
                      </span>
                    )}
                    
                    {day.status !== 'none' && (
                      <span className="text-[7.5px] font-mono uppercase tracking-tight block font-bold leading-none truncate max-w-full">
                        {day.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Append month-end offset placeholders to keep clean 7-column layout */}
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="aspect-square bg-neutral-100/40 rounded-xl border border-neutral-200/50 p-2 text-neutral-300 font-light text-xs flex items-end justify-start select-none">
                <span className="font-mono">{idx + 1}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Calendar Side Panel Controller */}
        <div className="space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-mono block pb-2 border-b border-neutral-100">Roster Controller</span>
            
            {selectedDayInfo ? (
              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block">SELECTED TIMEFRAME</span>
                  <p className="text-sm font-bold text-neutral-800 mt-1">
                    {selectedDayInfo.weekday}, March {selectedDayInfo.dayNum}, 2028
                  </p>
                  
                  {selectedDayInfo.isFairDay && (
                    <span className="inline-block mt-1 bg-orange-50 border border-orange-200 text-orange-700 font-semibold px-2 py-0.5 rounded text-[10px]" style={{ color: activeTheme.primaryColor }}>
                      Official Trade Fair Day
                    </span>
                  )}
                </div>

                <div className="border-t pt-3 border-neutral-100">
                  <span className="text-[10px] font-semibold text-neutral-400 block mb-2 font-sans">SET ROSTER STATUS</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleStatus(selectedDayInfo.dayNum, 'present')}
                      className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer text-center ${
                        selectedDayInfo.status === 'present'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white hover:bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(selectedDayInfo.dayNum, 'absent')}
                      className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer text-center ${
                        selectedDayInfo.status === 'absent'
                          ? 'bg-red-50 border-red-300 text-red-800'
                          : 'bg-white hover:bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(selectedDayInfo.dayNum, 'pending')}
                      className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer text-center ${
                        selectedDayInfo.status === 'pending'
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-white hover:bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(selectedDayInfo.dayNum, 'none')}
                      className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer text-center ${
                        selectedDayInfo.status === 'none'
                          ? 'bg-neutral-100 border-neutral-300 text-neutral-800 font-bold'
                          : 'bg-white hover:bg-neutral-50 text-neutral-400'
                      }`}
                    >
                      Unassigned
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500 leading-relaxed font-light">
                  <span className="font-semibold block text-neutral-700 mb-1">Roster Guidelines:</span>
                  Allocating "Present" days generates dynamic hotel vouchers for corresponding dates. Updates trigger automatic host notifications.
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center text-neutral-400 py-12">
                <Info className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                <p className="text-xs">Click any calendar cell to update roster parameters, print badges, or edit daily check-ins.</p>
              </div>
            )}

          </div>

          {/* Quick Informational Guide Legend */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-mono block">Daypilot Legend</span>
            <div className="space-y-3.5 mt-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded bg-white border border-neutral-200" style={{ borderLeft: `4px solid ${activeTheme.primaryColor}` }} />
                <span className="text-neutral-600 font-medium font-sans">Official Event Fair Day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded bg-emerald-500" />
                <span className="text-neutral-600 font-medium font-sans">Present & Active</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded bg-red-500" />
                <span className="text-neutral-600 font-medium font-sans">Absent / Excused Off-stand</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded bg-amber-400" />
                <span className="text-neutral-600 font-medium font-sans">Pending Manual Screening</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
