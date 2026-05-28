/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegistrationItem, ThemeSettings } from '../types';
import { Save, Trash2, Globe, Link, ArrowLeft, Check, Calendar } from 'lucide-react';

interface RegistrationManagerProps {
  registration: RegistrationItem;
  theme: ThemeSettings;
  onUpdateRegistration: (updated: RegistrationItem) => void;
  onShowToast: (message: string) => void;
  onNavigateBack: () => void;
}

export default function RegistrationManager({ registration, theme, onUpdateRegistration, onShowToast, onNavigateBack }: RegistrationManagerProps) {
  const isPremium = theme.mode === 'premium';

  const handleFieldChange = (field: keyof RegistrationItem, value: any) => {
    onUpdateRegistration({ ...registration, [field]: value });
  };

  const handleTranslationChange = (field: 'nameTranslations' | 'customTextTranslations', idx: number, value: string) => {
    const list = [...registration[field]];
    list[idx] = { ...list[idx], value };
    onUpdateRegistration({ ...registration, [field]: list });
  };

  const handleSave = () => {
    onShowToast(`Registration system "${registration.nameTranslations[0].value}" saved.`);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this registration detail block?")) {
      onShowToast("Registration settings reset (mock action).");
    }
  };

  return (
    <div className={`w-full flex flex-col ${isPremium ? 'space-y-4' : 'space-y-4'}`} id="registration-manager-root">
      
      {/* Information Banner */}
      {isPremium && (
        <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200/80 rounded-lg p-3 text-xs text-zinc-600 shadow-sm" id="premium-banner-reg">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#FFE7D6] text-[#F35D00]">Modern Theme Active</span>
            <span>Refined double-column date ranges, structured multi-locale inputs, and responsive active checkbox buttons.</span>
          </div>
          <div className="text-zinc-600 text-[11px] font-mono select-none">EMS › Event manager › Registration manager</div>
        </div>
      )}

      {/* Main card */}
      <div className={`${isPremium ? 'bg-white border border-gray-200/80 rounded-xl shadow-premium p-6' : 'bg-[#F2F2F2] border border-gray-400 rounded-none p-4'}`}>
        
        {/* Navigation / Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateBack}
              className={`${
                isPremium
                  ? 'flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 p-1 rounded-md hover:bg-zinc-100 transition-colors text-xs font-medium cursor-pointer'
                  : 'flex items-center gap-1 bg-[#E1E1E1] border border-gray-500 text-black px-2 py-0.5 text-xs font-bold cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Event</span>
            </button>
            <h2 className={`${isPremium ? 'text-lg font-bold text-zinc-900 tracking-tight' : 'text-sm font-bold text-black'}`}>Registration details</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className={`${
                isPremium
                  ? 'flex items-center gap-1.5 border border-[#FDA4AF]/40 hover:bg-red-50 text-red-650 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors'
                  : 'flex items-center gap-1 bg-[#E1E1E1] border border-gray-500 text-black px-3 py-1 text-xs font-bold cursor-pointer'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`${
                isPremium
                  ? 'flex items-center gap-1.5 bg-[#F35D00] hover:bg-[#D4550E] active:scale-[0.98] text-white px-5 py-1.5 rounded-lg text-xs font-semibold shadow-md cursor-pointer transition-all'
                  : 'flex items-center gap-1 bg-[#E1E1E1] border border-gray-500 text-black px-3 py-1 text-xs font-bold cursor-pointer'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Dense Form Grid */}
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3.5 gap-x-6">
            
            {/* ID */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 self-center">
              ID
            </div>
            <div className="md:col-span-9 text-xs font-mono text-zinc-800 self-center">
              {registration.id}
            </div>

            {/* Type */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 self-center">
              Type
            </div>
            <div className="md:col-span-9 text-xs font-semibold text-zinc-800 self-center">
              {registration.type}
            </div>

            {/* Checkboxes: Active / One page */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500">
              Settings
            </div>
            <div className="md:col-span-9 flex items-center gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={registration.active}
                  onChange={(e) => handleFieldChange('active', e.target.checked)}
                  className={isPremium ? 'w-4 h-4 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00]' : 'w-4 h-4 rounded-none border-gray-400'}
                />
                <span className={`${isPremium ? 'text-xs text-zinc-700' : 'text-xs text-black'}`}>Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={registration.onePage}
                  onChange={(e) => handleFieldChange('onePage', e.target.checked)}
                  className={isPremium ? 'w-4 h-4 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00]' : 'w-4 h-4 rounded-none border-gray-400'}
                />
                <span className={`${isPremium ? 'text-xs text-zinc-700' : 'text-xs text-black'}`}>One page</span>
              </label>
            </div>

            {/* Registration name * (translations US, UK, DE) */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 pt-1">
              Registration name <span className="text-red-500">*</span>
            </div>
            <div className="md:col-span-9 space-y-2">
              {[0, 1, 2].map((idx) => {
                const trans = registration.nameTranslations[idx] || { lang: 'US', value: '' };
                const isUS = trans.lang === 'US';
                const flag = trans.lang === 'US' ? '🇺🇸' : trans.lang === 'UK' ? '🇬🇧' : '🇩🇪';
                
                return (
                  <div key={trans.lang} className="flex items-center gap-2 max-w-2xl">
                    <div className="w-5 h-5 flex items-center justify-center">
                      {isPremium ? (
                        isUS ? (
                          <div className="w-4 h-4 rounded-full bg-[#FFE7D6] flex items-center justify-center text-[#F35D00]">
                            <span className="text-[10px] font-bold">▶</span>
                          </div>
                        ) : null
                      ) : (
                        isUS ? <span className="text-orange-500 font-bold">▶</span> : null
                      )}
                    </div>
                    <span className="text-base select-none">{flag}</span>
                    <input
                      type="text"
                      value={trans.value}
                      onChange={(e) => handleTranslationChange('nameTranslations', idx, e.target.value)}
                      className={`${isPremium ? 'flex-1 bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'flex-1 bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Custom Text translations */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 pt-1">
              Custom text
            </div>
            <div className="md:col-span-9 space-y-2">
              {[0, 1, 2].map((idx) => {
                const trans = registration.customTextTranslations[idx] || { lang: 'US', value: '' };
                const isUS = trans.lang === 'US';
                const flag = trans.lang === 'US' ? '🇺🇸' : trans.lang === 'UK' ? '🇬🇧' : '🇩🇪';
                
                return (
                  <div key={trans.lang} className="flex items-center gap-2 max-w-2xl">
                    <div className="w-5 h-5 flex items-center justify-center">
                      {isPremium ? (
                        isUS ? (
                          <div className="w-4 h-4 rounded-full bg-[#FFE7D6] flex items-center justify-center text-[#F35D00]">
                            <span className="text-[10px] font-bold">▶</span>
                          </div>
                        ) : null
                      ) : (
                        isUS ? <span className="text-orange-500 font-bold">▶</span> : null
                      )}
                    </div>
                    <span className="text-base select-none">{flag}</span>
                    <input
                      type="text"
                      value={trans.value}
                      placeholder="Enter custom text translate tag..."
                      onChange={(e) => handleTranslationChange('customTextTranslations', idx, e.target.value)}
                      className={`${isPremium ? 'flex-1 bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-855 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'flex-1 bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* 2-Column Dates Integration (Start Date / End Date, Attendance state, Hotel request state) */}
            <div className="md:col-span-12 border-t border-gray-150/50 my-2 pt-3">
              <h3 className={`${isPremium ? 'text-xs font-bold text-zinc-800 uppercase tracking-wider mb-3' : 'text-xs font-bold text-black border-b border-gray-400 pb-1 mb-2'}`}>
                Operational Date Settings (Double Column Form Layout)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
                
                {/* Row 1: Start Date & End Date */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-medium text-zinc-400">Start date *</span>
                  <input
                    type="date"
                    value={registration.startDate}
                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                    className={isPremium ? 'bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-850 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'bg-white border border-gray-400 h-11 px-3 text-xs'}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-medium text-zinc-400">End date *</span>
                  <input
                    type="date"
                    value={registration.endDate}
                    onChange={(e) => handleFieldChange('endDate', e.target.value)}
                    className={isPremium ? 'bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-850 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'bg-white border border-gray-400 h-11 px-3 text-xs'}
                  />
                </div>

                {/* Row 2: Attendance Start / End */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-medium text-zinc-400">Attendance days start date *</span>
                  <input
                    type="date"
                    value={registration.attendanceStartDate}
                    onChange={(e) => handleFieldChange('attendanceStartDate', e.target.value)}
                    className={isPremium ? 'bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-855 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'bg-white border border-gray-400 h-11 px-3 text-xs'}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-medium text-zinc-400">Attendance days end date *</span>
                  <input
                    type="date"
                    value={registration.attendanceEndDate}
                    onChange={(e) => handleFieldChange('attendanceEndDate', e.target.value)}
                    className={isPremium ? 'bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-855 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'bg-white border border-gray-400 h-11 px-3 text-xs'}
                  />
                </div>

                {/* Row 3: Hotel Request Arrival / Departure */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-medium text-zinc-400">Default hotel request arrival date *</span>
                  <input
                    type="date"
                    value={registration.hotelArrivalDate}
                    onChange={(e) => handleFieldChange('hotelArrivalDate', e.target.value)}
                    className={isPremium ? 'bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-855 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'bg-white border border-gray-400 h-11 px-3 text-xs'}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-medium text-zinc-400">Default hotel request departure date *</span>
                  <input
                    type="date"
                    value={registration.hotelDepartureDate}
                    onChange={(e) => handleFieldChange('hotelDepartureDate', e.target.value)}
                    className={isPremium ? 'bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-855 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'bg-white border border-gray-400 h-11 px-3 text-xs'}
                  />
                </div>

                {/* Row 4: Hotel Request Start / End */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-medium text-zinc-400">Hotel request start date *</span>
                  <input
                    type="date"
                    value={registration.hotelStartDate}
                    onChange={(e) => handleFieldChange('hotelStartDate', e.target.value)}
                    className={isPremium ? 'bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-855 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'bg-white border border-gray-400 h-11 px-3 text-xs'}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-medium text-zinc-400">Hotel request end date *</span>
                  <input
                    type="date"
                    value={registration.hotelEndDate}
                    onChange={(e) => handleFieldChange('hotelEndDate', e.target.value)}
                    className={isPremium ? 'bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-855 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'bg-white border border-gray-400 h-11 px-3 text-xs'}
                  />
                </div>

              </div>
            </div>

            {/* Static Restricted Registration URL info box */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 self-center">
              Restricted registration Url
            </div>
            <div className="md:col-span-9 py-1 text-xs font-mono break-all text-zinc-550 select-all max-w-4xl bg-zinc-50 border border-zinc-200/80 p-2.5 rounded-lg">
              {registration.restrictedUrl}
            </div>

            {/* Redirect Url */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 self-center">
              Redirect Url
            </div>
            <div className="md:col-span-9">
              <input
                type="text"
                value={registration.redirectUrl}
                onChange={(e) => handleFieldChange('redirectUrl', e.target.value)}
                className={`${isPremium ? 'w-full max-w-3xl bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono font-semibold' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
              />
            </div>

            {/* Redirect Url - logout */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 self-center">
              Redirect Url - logout
            </div>
            <div className="md:col-span-9">
              <input
                type="text"
                placeholder="Redirect Url - logout"
                value={registration.redirectUrlLogout}
                onChange={(e) => handleFieldChange('redirectUrlLogout', e.target.value)}
                className={`${isPremium ? 'w-full max-w-3xl bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-805 focus:outline-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
              />
            </div>

            {/* Redirect Url - not attending */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 self-start pt-2">
              Redirect Url - not attending
            </div>
            <div className="md:col-span-9 max-w-3xl">
              <input
                type="text"
                value={registration.redirectUrlNotAttending}
                onChange={(e) => handleFieldChange('redirectUrlNotAttending', e.target.value)}
                className={`${isPremium ? 'w-full max-w-3xl bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono font-semibold' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
              />
              <span className="text-[10px] text-zinc-400 leading-normal block mt-1">
                e.g. http://www.xfair.net/ems_demo/Registration/Modules/RegistrationFinalPage.aspx?REGID=1&amp;redirectafter=10&amp;pagecontentkey=RegistrationFinalPageContent&amp;EventID=1&amp;redirectto=http://www.xfair.com
              </span>
            </div>

            {/* Status Selector */}
            <div className="md:col-span-3 text-xs font-medium text-zinc-500 self-center">
              Status
            </div>
            <div className="md:col-span-9">
              <div className="relative max-w-xs">
                <select
                  value={registration.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className={`${isPremium ? 'w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] appearance-none' : 'w-full bg-white border border-gray-400 p-1 text-xs text-black'}`}
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Testing">Testing</option>
                </select>
                {isPremium && (
                  <span className="absolute right-3 top-2.5 pointer-events-none text-zinc-400 select-none">▼</span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
