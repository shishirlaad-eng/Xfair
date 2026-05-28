/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ModuleItem, ThemeSettings } from '../types';
import { 
  Save, 
  AlertCircle, 
  Check, 
  HelpCircle, 
  FileCode, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Layers,
  Shield,
  Globe,
  Hash,
  Eye,
  CheckCircle2,
  Sliders,
  Settings,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModuleManagerProps {
  items: ModuleItem[];
  theme: ThemeSettings;
  onUpdateItems: (updated: ModuleItem[]) => void;
  onShowToast: (message: string) => void;
  viewOption: 'option-1' | 'option-2';
  setViewOption: (option: 'option-1' | 'option-2') => void;
}

export default function ModuleManager({ items, theme, onUpdateItems, onShowToast, viewOption, setViewOption }: ModuleManagerProps) {
  const [selectedId, setSelectedId] = useState<number>(36); // Accompanying person (single) is default selected
  const [isNameExpanded, setIsNameExpanded] = useState<boolean>(false);
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);

  const selectedItem = items.find((i) => i.id === selectedId) || items[0];
  const isPremium = theme.mode === 'premium';

  const handleRowClick = (id: number) => {
    setSelectedId(id);
  };

  const handleCheckboxToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    onUpdateItems(updated);
  };

  const handleFieldChange = (field: keyof ModuleItem, value: any) => {
    const updated = items.map((item) =>
      item.id === selectedId ? { ...item, [field]: value } : item
    );
    onUpdateItems(updated);
  };

  const handleTranslationChangeByLang = (lang: string, value: string) => {
    const defaultLangs = ['US', 'UK', 'DE'];
    const newTranslations = defaultLangs.map((l) => {
      const existing = selectedItem.translations.find((t) => t.lang === l);
      if (existing) {
        return { ...existing, value: existing.lang === lang ? value : existing.value };
      } else {
        return { lang: l, value: l === lang ? value : '' };
      }
    });
    handleFieldChange('translations', newTranslations);
  };

  const handleDescriptionChangeByLang = (lang: string, value: string) => {
    const defaultLangs = ['US', 'UK', 'DE'];
    const newDesc = defaultLangs.map((l) => {
      const existing = selectedItem.descriptionTranslations.find((d) => d.lang === l);
      if (existing) {
        return { ...existing, value: existing.lang === lang ? value : existing.value };
      } else {
        return { lang: l, value: l === lang ? value : '' };
      }
    });
    handleFieldChange('descriptionTranslations', newDesc);
  };

  const handleSave = () => {
    onShowToast(`Module "${selectedItem.name}" updated successfully.`);
  };



  return (
    <div className={`w-full flex flex-col ${isPremium ? 'space-y-4' : 'space-y-2'}`} id="module-manager-root">
      
      {/* Toggle selector dropdown header */}
      <div className="flex justify-end mb-1">
        <div className="relative min-w-[210px]">
          <select
            value={viewOption}
            onChange={(e) => {
              setViewOption(e.target.value as 'option-1' | 'option-2');
              onShowToast(`Layout switched to: ${e.target.value === 'option-1' ? 'Traditional Grid' : 'Modern Flow Card'}`);
            }}
            className={`${
              isPremium 
                ? 'w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 hover:border-[#F35D00] text-zinc-800 font-bold py-2 pl-3.5 pr-8 rounded-lg text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#F35D00]/30 transition-all appearance-none' 
                : 'w-full bg-white border border-gray-400 text-black text-xs p-1 cursor-pointer font-bold'
            }`}
            id="view-option-select"
          >
            <option value="option-1">Option 1: Traditional List</option>
            <option value="option-2">Option 2: Modern Flow Card</option>
          </select>
          {isPremium && <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />}
        </div>
      </div>

      {viewOption === 'option-1' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Table Panel */}
          <div className={`${isPremium ? 'lg:col-span-4 bg-white border border-zinc-200/85 rounded-xl shadow-premium overflow-hidden' : 'lg:col-span-5 bg-[#F2F2F2] border border-gray-400 rounded-none p-1'}`}>
            <div className={`${isPremium ? 'bg-zinc-50 border-b border-zinc-200 px-5 py-3.5 flex items-center justify-between' : 'bg-[#E5E5E5] p-2 border-b border-gray-400 font-bold'}`}>
              <span className={`${isPremium ? 'text-[15px] font-bold text-zinc-900 tracking-tight' : 'text-xs text-black'}`}>Module</span>
              {isPremium && <span className="text-[11px] font-bold font-mono text-[#F35D00] bg-[#FFE7D6] px-2 py-0.5 rounded-full">{items.length} Registered</span>}
            </div>

            <div 
              className="overflow-y-auto custom-scrollbar-light" 
              style={{ maxHeight: '620px' }}
              id="module-left-list"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`${isPremium ? 'bg-zinc-50/50 text-[12px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-100' : 'bg-gray-300 text-xs text-black'}`}>
                    <th className="p-3 w-12 text-center font-bold">Active</th>
                    <th className="p-3 font-bold">Module name</th>
                  </tr>
                </thead>
                <tbody className={`${isPremium ? 'divide-y divide-zinc-100' : ''}`}>
                  {items.map((item) => {
                    const isSelected = item.id === selectedId;
                    
                    // Stylings
                    let rowStyle = '';
                    let checkboxStyle = '';
                    
                    if (isPremium) {
                      rowStyle = isSelected 
                        ? 'bg-zinc-50/70 text-zinc-950 font-semibold relative border-l-3 border-[#F35D00]' 
                        : 'hover:bg-zinc-50/40 text-zinc-700 cursor-pointer transition-colors';
                      checkboxStyle = 'w-4.5 h-4.5 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00] focus:ring-opacity-20 accent-[#F35D00] cursor-pointer';
                    } else {
                      rowStyle = isSelected 
                        ? 'bg-[#D3D3D3] text-black font-bold' 
                        : 'hover:bg-[#EAEAEA] text-black cursor-pointer';
                      checkboxStyle = 'w-4 h-4 rounded-none border-gray-400 text-black cursor-pointer';
                    }

                    return (
                      <tr 
                        key={item.id} 
                        className={`${rowStyle} ${isPremium ? 'text-[13px]' : 'text-xs'}`}
                        onClick={() => handleRowClick(item.id)}
                        id={`module-row-${item.id}`}
                      >
                        <td className="p-3 text-center" onClick={(e) => handleCheckboxToggle(item.id, e)}>
                          <input 
                            type="checkbox" 
                            checked={item.active} 
                            onChange={() => {}} // Handle on parent container click
                            className={checkboxStyle}
                          />
                        </td>
                        <td className="p-3 cursor-pointer select-none">
                          <div className="flex items-center justify-between">
                            <span className={isSelected ? 'font-semibold text-zinc-900' : 'text-zinc-600'}>{item.name}</span>
                            {isPremium && isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#F35D00] shadow-sm animate-pulse" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Columns Stack */}
          <div className={`${isPremium ? 'lg:col-span-8 flex flex-col space-y-5' : 'lg:col-span-7 flex flex-col space-y-3'}`}>
            
            {/* Module Details Card */}
            <div className={`${isPremium ? 'bg-white border border-zinc-200/80 rounded-xl shadow-premium overflow-hidden flex flex-col' : 'bg-[#F2F2F2] border border-gray-400 rounded-none p-4 flex flex-col space-y-3'}`}>
              
              <div className={`${isPremium ? 'bg-zinc-50 border-b border-zinc-200 px-5 py-3.5 flex items-center justify-between' : 'flex items-center justify-between border-b border-gray-200 pb-3'}`}>
                <h3 className={`${isPremium ? 'text-[15px] font-bold text-zinc-900 tracking-tight' : 'text-xs font-bold text-black'}`}>Module details</h3>
                <span className={`${isPremium ? 'text-[13px] text-zinc-550 font-mono' : 'text-xs text-black'}`}>
                  ID: <strong className={isPremium ? 'text-[#F35D00] font-mono' : ''}>{selectedItem.id}</strong>
                </span>
              </div>

              <div className={`${isPremium ? 'p-5 flex flex-col space-y-5 flex-1' : ''}`}>
                {/* Form details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3.5">
                  
                  {/* Module code */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13px] font-bold text-zinc-700' : 'text-xs font-medium text-zinc-500'} flex items-center`}>
                    Module code
                  </div>
                  <div className="md:col-span-8">
                    <div className={`${isPremium ? 'bg-zinc-50 border border-zinc-200 text-zinc-800 font-mono rounded-lg px-4 py-2 font-semibold text-[13px]' : 'bg-[#E5E5E5] border border-gray-400 text-black p-1 text-xs'} select-all`}>
                      {selectedItem.code}
                    </div>
                  </div>

                  {/* Module Name (Translations) */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13px] font-bold text-zinc-700' : 'text-xs font-medium text-zinc-500'} py-1`}>
                    Module name <span className="text-red-500">*</span>
                  </div>
                  <div className="md:col-span-8 flex flex-col space-y-2">
                    {['US', 'GB', 'DE'].map((targetLang) => {
                      const langKey = targetLang === 'GB' ? 'UK' : targetLang;
                      const translation = (selectedItem.translations || []).find((t) => t.lang === langKey) || { lang: targetLang, value: '' };
                      const isUS = targetLang === 'US';
                      
                      // Hide GB and DE if not expanded
                      if (!isUS && !isNameExpanded) return null;

                      const flagSrc = targetLang === 'US' ? '🇺🇸' : targetLang === 'GB' ? '🇬🇧' : '🇩🇪';
                      
                      return (
                        <div key={targetLang} className="flex items-center gap-2">
                          <div className="w-5 h-5 flex items-center justify-center">
                            {isUS ? (
                              isPremium ? (
                                <button
                                  type="button"
                                  onClick={() => setIsNameExpanded(!isNameExpanded)}
                                  className="w-5 h-5 rounded-full bg-zinc-100 hover:bg-[#F35D00]/15 flex items-center justify-center text-[#F35D00] transition-all hover:scale-110 active:scale-95 cursor-pointer border-none"
                                  title={isNameExpanded ? "Collapse languages" : "Expand languages"}
                                >
                                  {isNameExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[3px]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[3px]" />}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setIsNameExpanded(!isNameExpanded)}
                                  className="text-orange-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
                                >
                                  {isNameExpanded ? '▲' : '▼'}
                                </button>
                              )
                            ) : null}
                          </div>
                          <span className="text-base leading-none select-none">{flagSrc}</span>
                          <input
                            type="text"
                            value={translation.value}
                            onChange={(e) => handleTranslationChangeByLang(langKey, e.target.value)}
                            className={`${isPremium ? 'flex-1 bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-805 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'flex-1 bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Description (Translations) */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13px] font-bold text-zinc-700' : 'text-xs font-medium text-zinc-500'} py-1`}>
                    Description
                  </div>
                  <div className="md:col-span-8 flex flex-col space-y-2">
                    {['US', 'GB', 'DE'].map((targetLang) => {
                      const langKey = targetLang === 'GB' ? 'UK' : targetLang;
                      const desc = (selectedItem.descriptionTranslations || []).find((d) => d.lang === langKey) || { lang: targetLang, value: '' };
                      const isUS = targetLang === 'US';
                      
                      // Hide GB and DE if not expanded
                      if (!isUS && !isDescExpanded) return null;

                      const flagSrc = targetLang === 'US' ? '🇺🇸' : targetLang === 'GB' ? '🇬🇧' : '🇩🇪';
                      
                      return (
                        <div key={targetLang} className="flex items-start gap-2">
                          <div className="w-5 h-5 flex items-center justify-center mt-1">
                            {isUS ? (
                              isPremium ? (
                                <button
                                  type="button"
                                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                                  className="w-5 h-5 rounded-full bg-zinc-100 hover:bg-[#F35D00]/15 flex items-center justify-center text-[#F35D00] transition-all hover:scale-110 active:scale-95 cursor-pointer border-none"
                                  title={isDescExpanded ? "Collapse descriptions" : "Expand descriptions"}
                                >
                                  {isDescExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[3px]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[3px]" />}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                                  className="text-orange-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
                                >
                                  {isDescExpanded ? '▲' : '▼'}
                                </button>
                              )
                            ) : null}
                          </div>
                          <span className="text-base leading-none select-none mt-0.5">{flagSrc}</span>
                          <textarea
                            rows={2}
                            value={desc.value}
                            onChange={(e) => handleDescriptionChangeByLang(langKey, e.target.value)}
                            placeholder={isUS ? "Enter a description..." : ""}
                            className={`${isPremium ? 'flex-1 bg-white border border-zinc-200 rounded-lg px-3.5 py-2 text-[13px] text-zinc-800 focus:outline-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/30 resize-none font-medium' : 'flex-1 bg-white border border-gray-400 p-1 text-xs text-black resize-none'}`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Path */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13px] font-bold text-zinc-700' : 'text-xs font-medium text-zinc-500'} flex items-center`}>
                    Path
                  </div>
                  <div className="md:col-span-8">
                    <input
                      type="text"
                      value={selectedItem.path}
                      onChange={(e) => handleFieldChange('path', e.target.value)}
                      className={`${isPremium ? 'w-full bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-805 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                    />
                  </div>

                  {/* Registration Path */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13px] font-bold text-zinc-700' : 'text-xs font-medium text-zinc-500'} flex items-center`}>
                    Registration path
                  </div>
                  <div className="md:col-span-8">
                    <input
                      type="text"
                      value={selectedItem.registrationPath}
                      onChange={(e) => handleFieldChange('registrationPath', e.target.value)}
                      className={`${isPremium ? 'w-full bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-850 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-mono font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black font-mono'}`}
                    />
                  </div>

                  {/* Checkbox Grid (Always Active, Active, Is Logged, Module for Registration) */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13px] font-bold text-zinc-700' : 'text-xs font-medium text-zinc-500'}`}>
                    System Settings
                  </div>
                  <div className="md:col-span-8 grid grid-cols-2 gap-3.5 py-1">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItem.alwaysActive}
                        onChange={(e) => handleFieldChange('alwaysActive', e.target.checked)}
                        className={isPremium ? 'w-4.5 h-4.5 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00] accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none border-gray-400'}
                      />
                      <span className={`${isPremium ? 'text-[13px] font-semibold text-zinc-700 cursor-pointer' : 'text-xs text-black'}`}>Always active</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItem.active}
                        onChange={(e) => handleFieldChange('active', e.target.checked)}
                        className={isPremium ? 'w-4.5 h-4.5 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00] accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none border-gray-400'}
                      />
                      <span className={`${isPremium ? 'text-[13px] font-semibold text-zinc-700 cursor-pointer' : 'text-xs text-black'}`}>Active</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItem.isLogged}
                        onChange={(e) => handleFieldChange('isLogged', e.target.checked)}
                        className={isPremium ? 'w-4.5 h-4.5 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00] accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none border-gray-400'}
                      />
                      <span className={`${isPremium ? 'text-[13px] font-semibold text-zinc-700 cursor-pointer' : 'text-xs text-black'}`}>Is logged</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItem.moduleForRegistration}
                        onChange={(e) => handleFieldChange('moduleForRegistration', e.target.checked)}
                        className={isPremium ? 'w-4.5 h-4.5 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00] accent-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none border-gray-400'}
                      />
                      <span className={`${isPremium ? 'text-[13px] font-semibold text-zinc-700 cursor-pointer' : 'text-xs text-black'}`}>Module for registration</span>
                    </label>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-3.5 flex justify-end border-t border-zinc-100">
                  <button
                    onClick={handleSave}
                    className={`${
                      isPremium
                        ? 'flex items-center gap-2 bg-[#F35D00] hover:bg-neutral-800 active:scale-[0.98] text-white px-6 py-2.5 rounded-lg text-[13.5px] font-bold shadow-md cursor-pointer transition-all'
                        : 'flex items-center gap-2 bg-[#E1E1E1] border border-gray-500 hover:bg-gray-200 text-black px-4 py-1.5 text-xs font-bold cursor-pointer'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>

              </div>

            </div>

            {/* System Fields Card */}
            <div className={`${isPremium ? 'bg-white border border-zinc-200/80 rounded-xl shadow-premium overflow-hidden flex flex-col' : 'bg-[#F2F2F2] border border-gray-400 rounded-none p-4 flex flex-col space-y-3'}`}>
              <div className={`${isPremium ? 'bg-zinc-50 border-b border-zinc-200 px-5 py-3.5' : 'flex items-center justify-between border-b border-gray-200 pb-3'}`}>
                <h3 className={`${isPremium ? 'text-[15px] font-bold text-zinc-900 tracking-tight' : 'text-xs font-bold text-black'}`}>System fields</h3>
              </div>
              <div className={`${isPremium ? 'p-5 flex flex-col flex-1' : ''}`}>
                <p className={`${isPremium ? 'text-[13px] text-zinc-500 italic font-medium' : 'text-xs text-gray-500 italic'}`}>
                  No System fields available for module.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* OPTION 2: FLUID MODERN BLUEPRINT CARD */
        <div className="flex flex-col space-y-4" id="module-layout-option-2-root">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="module-layout-option-2">
          
          {/* Left Column: Visual Registered Feed cards inside a single cohesive card container matching Module details style */}
          <div className="lg:col-span-12 xl:col-span-5 lg:col-span-12 flex flex-col">
            <div className={`${
              isPremium 
                ? 'bg-[#FAFAFC] border border-zinc-200/55 rounded-3xl shadow-xs overflow-hidden flex flex-col' 
                : 'bg-[#F9FAFB] border border-zinc-250/50 rounded-2xl p-5 flex flex-col space-y-4 shadow-sm'
            }`}>
              
              <div className={`${
                isPremium 
                  ? 'bg-transparent px-6 pt-6 pb-2 border-none flex items-center justify-between' 
                  : 'bg-transparent px-1 pt-1 pb-1 border-none flex items-center justify-between'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-[5px] h-6 rounded-full bg-gradient-to-b from-[#F35D00] to-[#FF904D] shadow-xs" />
                  <span className={`text-[18px] font-extrabold tracking-tight ${isPremium ? 'text-zinc-900' : 'text-zinc-855 text-black'}`}>Module</span>
                </div>
                {isPremium ? (
                  <span className="text-[11px] font-bold font-mono text-[#F35D00] bg-[#FFE7D6] px-2.5 py-0.5 rounded-full">{items.length} Registered</span>
                ) : (
                  <span className="text-[11px] font-bold font-mono text-zinc-600 bg-zinc-200/60 px-2.5 py-0.5 rounded-full">{items.length} Registered</span>
                )}
              </div>

              {/* Scrollable list inside premium padding box */}
              <div className={`${isPremium ? 'px-6 pb-6 pt-3 flex flex-col flex-1' : 'flex flex-col'}`}>
                <div 
                  className={`overflow-y-auto ${isPremium ? 'custom-scrollbar-light pr-1' : 'custom-scrollbar-light'}`} 
                  style={{ maxHeight: '500px' }}
                  id="blueprint-feed-scroll"
                >
                  <div className="flex flex-col space-y-1.5 pb-2">
                    {items.map((item) => {
                      const isSelected = item.id === selectedId;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleRowClick(item.id)}
                          className={`${
                            isPremium 
                              ? `group relative py-3 px-4.5 rounded-xl transition-all duration-200 cursor-pointer text-left flex items-center justify-between ${
                                  isSelected 
                                    ? 'bg-[#FFE7D6]/50 border-s-4 border-[#F35D00] rounded-s-none text-zinc-900 font-bold shadow-xs' 
                                    : 'bg-transparent border-none text-zinc-650 hover:bg-zinc-100/70 hover:text-zinc-900'
                                }` 
                              : `py-2.5 px-3.5 rounded-lg transition-all duration-155 cursor-pointer text-left flex items-center justify-between ${
                                  isSelected 
                                    ? 'bg-zinc-200/80 border-s-4 border-black rounded-s-none font-bold text-black' 
                                    : 'bg-transparent border-none text-zinc-700 hover:bg-zinc-100 hover:text-black'
                                 }`
                          }`}
                          id={`blueprint-card-${item.id}`}
                        >
                          <span className={`${isPremium ? 'text-[13.5px] group-hover:text-[#F35D00] transition-colors block' : 'text-xs block'}`}>
                            {item.name}
                          </span>

                          {/* Interactive toggle block */}
                          <button
                            type="button"
                            onClick={(e) => handleCheckboxToggle(item.id, e)}
                            className={`shrink-0 transition-transform active:scale-90 p-1 rounded-md cursor-pointer border-none ${
                              isPremium 
                                ? 'text-zinc-400 hover:bg-zinc-100/85 hover:text-[#F35D00]' 
                                : 'text-zinc-500 hover:bg-white hover:text-black'
                            }`}
                            title="Quick toggle active state"
                          >
                            {item.active ? (
                              <CheckCircle2 className={`w-4.5 h-4.5 ${isPremium ? 'text-[#F35D00]' : 'text-black'}`} />
                            ) : (
                              <div className={`w-4.5 h-4.5 rounded-full border-2 ${isPremium ? 'border-zinc-300 bg-zinc-50/50' : 'border-zinc-400 bg-white'}`} />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Modern Details Card and Custom System Fields Card with synchronized values/labels */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col space-y-6">
            
            {/* Elegant Blueprint Card */}
            <div className={`${
              isPremium 
                ? 'bg-[#FAFAFC] border border-zinc-200/55 rounded-3xl shadow-xs overflow-hidden flex flex-col' 
                : 'bg-[#F9FAFB] border border-zinc-250/50 rounded-2xl p-5 flex flex-col space-y-4 shadow-sm'
            }`}>
              
              <div className="bg-transparent px-6 pt-6 pb-2 border-none flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-[5px] h-6 rounded-full bg-gradient-to-b from-[#F35D00] to-[#FF904D] shadow-xs" />
                  <h3 className={`text-[18px] font-extrabold tracking-tight ${isPremium ? 'text-zinc-900' : 'text-black'}`}>Module details</h3>
                </div>
                <span className={`${isPremium ? 'text-[11px] text-zinc-500 font-mono bg-zinc-200/40 px-2.5 py-1 rounded-md border border-zinc-200/50' : 'text-[11px] text-zinc-650 font-mono font-bold bg-zinc-200/50 px-2.5 py-1 rounded'}`}>
                  ID: <strong className={isPremium ? 'text-[#F35D00] font-mono' : 'text-black font-mono'}>{selectedItem.id}</strong>
                </span>
              </div>

              {/* Form Elements with elegant spacious layout and rounded white cards */}
              <div className={`${isPremium ? 'p-6 md:p-8 pt-4 flex flex-col space-y-8 flex-1' : 'p-2 pt-0 flex flex-col space-y-5'}`}>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-9 md:gap-y-10">
                  
                  {/* Module Code */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13.5px] font-extrabold text-zinc-700 tracking-tight' : 'text-xs font-bold text-black'} flex items-center pt-1.5`}>
                    Module code
                  </div>
                  <div className="md:col-span-8">
                    <div className={`${
                      isPremium 
                        ? 'bg-zinc-100/60 border border-zinc-200/80 text-zinc-600 font-mono px-4 py-2.5 text-[13px] font-semibold tracking-wide rounded-xl select-all select-none shadow-inner' 
                        : 'bg-zinc-150 text-zinc-750 font-mono p-2 px-3 text-xs rounded-lg select-all'
                    }`}>
                      {selectedItem.code}
                    </div>
                  </div>

                  {/* Module Name (Translations) */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13.5px] font-extrabold text-zinc-700 tracking-tight' : 'text-xs font-bold text-black'} flex items-start pt-2`}>
                    Module name <span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="md:col-span-8 flex flex-col space-y-4.5">
                    {['US', 'GB', 'DE'].map((targetLang) => {
                      const langKey = targetLang === 'GB' ? 'UK' : targetLang;
                      const translation = (selectedItem.translations || []).find((t) => t.lang === langKey) || { lang: targetLang, value: '' };
                      const isUS = targetLang === 'US';
                      
                      // Hide GB and DE if not expanded
                      if (!isUS && !isNameExpanded) return null;

                      const flagSrc = targetLang === 'US' ? '🇺🇸' : targetLang === 'GB' ? '🇬🇧' : '🇩🇪';
                      
                      return (
                        <div key={targetLang} className="flex items-center gap-3 group">
                          {/* Language Accordion controller */}
                          <div className="w-6 h-6 flex items-center justify-center shrink-0">
                            {isUS ? (
                              isPremium ? (
                                <button
                                  type="button"
                                  onClick={() => setIsNameExpanded(!isNameExpanded)}
                                  className="w-6 h-6 rounded-full bg-zinc-100 hover:bg-[#F35D00]/15 flex items-center justify-center text-[#F35D00] transition-all hover:scale-110 active:scale-95 cursor-pointer border-none shadow-xs"
                                  title={isNameExpanded ? "Collapse languages" : "Expand languages"}
                                >
                                  {isNameExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[3px]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[3px]" />}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setIsNameExpanded(!isNameExpanded)}
                                  className="text-orange-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
                                >
                                  {isNameExpanded ? '▲' : '▼'}
                                </button>
                              )
                            ) : null}
                          </div>
                          
                          {/* Flag Icon */}
                          <span className="text-[17px] select-none shrink-0">{flagSrc}</span>
                          
                          {/* Text input with bottom border only */}
                          <input
                            type="text"
                            value={translation.value}
                            onChange={(e) => handleTranslationChangeByLang(langKey, e.target.value)}
                            className={`${
                              isPremium 
                                ? 'flex-1 bg-transparent border-b-2 border-zinc-200/90 text-zinc-800 px-1 pb-2 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-medium transition-all focus:ring-0 rounded-none' 
                                : 'flex-1 bg-transparent border-b-2 border-black p-1 pb-1.5 text-xs text-black focus:outline-none'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Description (Translations) */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13.5px] font-extrabold text-zinc-700 tracking-tight' : 'text-xs font-bold text-black'} flex items-start pt-2`}>
                    Description
                  </div>
                  <div className="md:col-span-8 flex flex-col space-y-4.5">
                    {['US', 'GB', 'DE'].map((targetLang) => {
                      const langKey = targetLang === 'GB' ? 'UK' : targetLang;
                      const desc = (selectedItem.descriptionTranslations || []).find((d) => d.lang === langKey) || { lang: targetLang, value: '' };
                      const isUS = targetLang === 'US';
                      
                      // Hide GB and DE if not expanded
                      if (!isUS && !isDescExpanded) return null;

                      const flagSrc = targetLang === 'US' ? '🇺🇸' : targetLang === 'GB' ? '🇬🇧' : '🇩🇪';
                      
                      return (
                        <div key={targetLang} className="flex items-start gap-3 group">
                          <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1">
                            {isUS ? (
                              isPremium ? (
                                <button
                                  type="button"
                                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                                  className="w-6 h-6 rounded-full bg-zinc-100 hover:bg-[#F35D00]/15 flex items-center justify-center text-[#F35D00] transition-all hover:scale-110 active:scale-[0.95] cursor-pointer border-none shadow-xs"
                                  title={isDescExpanded ? "Collapse descriptions" : "Expand descriptions"}
                                >
                                  {isDescExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[3px]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[3px]" />}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                                  className="text-orange-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
                                >
                                  {isDescExpanded ? '▲' : '▼'}
                                </button>
                              )
                            ) : null}
                          </div>
                          
                          {/* Flag Icon */}
                          <span className="text-[17px] select-none shrink-0 mt-1.5">{flagSrc}</span>
                          
                          {/* Textarea with bottom border only */}
                          <textarea
                            rows={2}
                            value={desc.value}
                            onChange={(e) => handleDescriptionChangeByLang(langKey, e.target.value)}
                            placeholder={isUS ? "Enter a description..." : ""}
                            className={`${
                              isPremium 
                                ? 'flex-1 bg-transparent border-b-2 border-zinc-200/90 text-zinc-800 px-1 pb-1.5 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-[#F35D00] resize-none font-medium transition-all focus:ring-0 rounded-none' 
                                : 'flex-1 bg-transparent border-b-2 border-black p-1 pb-1 text-xs text-black focus:outline-none resize-none'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Path */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13.5px] font-extrabold text-zinc-700 tracking-tight' : 'text-xs font-bold text-black'} flex items-center`}>
                    Path
                  </div>
                  <div className="md:col-span-8">
                    <input
                      type="text"
                      value={selectedItem.path}
                      onChange={(e) => handleFieldChange('path', e.target.value)}
                      className={`${
                        isPremium 
                          ? 'w-full bg-transparent border-b-2 border-zinc-200/90 text-zinc-800 px-1 pb-2 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-mono font-medium transition-all focus:ring-0 rounded-none' 
                          : 'w-full bg-transparent border-b-2 border-black p-1 pb-1.5 text-xs text-black font-mono focus:outline-none'
                      }`}
                    />
                  </div>

                  {/* Registration Path */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13.5px] font-extrabold text-zinc-700 tracking-tight' : 'text-xs font-bold text-black'} flex items-center`}>
                    Registration path
                  </div>
                  <div className="md:col-span-8">
                    <input
                      type="text"
                      value={selectedItem.registrationPath}
                      onChange={(e) => handleFieldChange('registrationPath', e.target.value)}
                      className={`${
                        isPremium 
                          ? 'w-full bg-transparent border-b-2 border-zinc-200/90 text-zinc-800 px-1 pb-2 text-[13.5px] focus:outline-none focus:border-[#F35D00] hover:border-zinc-350 font-mono font-medium transition-all focus:ring-0 rounded-none' 
                          : 'w-full bg-transparent border-b-2 border-black p-1 pb-1.5 text-xs text-black font-mono focus:outline-none'
                      }`}
                    />
                  </div>

                  {/* System Settings Checkbox Grid (synchronized exactly with Option 1!) */}
                  <div className={`md:col-span-4 ${isPremium ? 'text-[13.5px] font-extrabold text-zinc-700 tracking-tight' : 'text-xs font-bold text-black'}`}>
                    System Settings
                  </div>
                  <div className="md:col-span-8 grid grid-cols-2 gap-4 py-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group/checkbox">
                      <input
                        type="checkbox"
                        checked={selectedItem.alwaysActive}
                        onChange={(e) => handleFieldChange('alwaysActive', e.target.checked)}
                        className="sr-only"
                      />
                      <div className="shrink-0 transition-transform active:scale-95 duration-100">
                        {selectedItem.alwaysActive ? (
                          <CheckCircle2 className={`w-4.5 h-4.5 ${isPremium ? 'text-[#F35D00]' : 'text-black'}`} />
                        ) : (
                          <div className={`w-4.5 h-4.5 rounded-full border-2 transition-colors ${
                            isPremium 
                              ? 'border-zinc-300 bg-white group-hover/checkbox:border-[#F35D00]/60' 
                              : 'border-zinc-400 bg-white group-hover/checkbox:border-black'
                          }`} />
                        )}
                      </div>
                      <span className={`${isPremium ? 'text-[13px] font-semibold text-zinc-700' : 'text-xs text-black font-medium'}`}>Always active</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none group/checkbox">
                      <input
                        type="checkbox"
                        checked={selectedItem.active}
                        onChange={(e) => handleFieldChange('active', e.target.checked)}
                        className="sr-only"
                      />
                      <div className="shrink-0 transition-transform active:scale-95 duration-100">
                        {selectedItem.active ? (
                          <CheckCircle2 className={`w-4.5 h-4.5 ${isPremium ? 'text-[#F35D00]' : 'text-black'}`} />
                        ) : (
                          <div className={`w-4.5 h-4.5 rounded-full border-2 transition-colors ${
                            isPremium 
                              ? 'border-zinc-300 bg-white group-hover/checkbox:border-[#F35D00]/60' 
                              : 'border-zinc-400 bg-white group-hover/checkbox:border-black'
                          }`} />
                        )}
                      </div>
                      <span className={`${isPremium ? 'text-[13px] font-semibold text-zinc-700' : 'text-xs text-black font-medium'}`}>Active</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none group/checkbox">
                      <input
                        type="checkbox"
                        checked={selectedItem.isLogged}
                        onChange={(e) => handleFieldChange('isLogged', e.target.checked)}
                        className="sr-only"
                      />
                      <div className="shrink-0 transition-transform active:scale-95 duration-100">
                        {selectedItem.isLogged ? (
                          <CheckCircle2 className={`w-4.5 h-4.5 ${isPremium ? 'text-[#F35D00]' : 'text-black'}`} />
                        ) : (
                          <div className={`w-4.5 h-4.5 rounded-full border-2 transition-colors ${
                            isPremium 
                              ? 'border-zinc-300 bg-white group-hover/checkbox:border-[#F35D00]/60' 
                              : 'border-zinc-400 bg-white group-hover/checkbox:border-black'
                          }`} />
                        )}
                      </div>
                      <span className={`${isPremium ? 'text-[13px] font-semibold text-zinc-700' : 'text-xs text-black font-medium'}`}>Is logged</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none group/checkbox">
                      <input
                        type="checkbox"
                        checked={selectedItem.moduleForRegistration}
                        onChange={(e) => handleFieldChange('moduleForRegistration', e.target.checked)}
                        className="sr-only"
                      />
                      <div className="shrink-0 transition-transform active:scale-95 duration-100">
                        {selectedItem.moduleForRegistration ? (
                          <CheckCircle2 className={`w-4.5 h-4.5 ${isPremium ? 'text-[#F35D00]' : 'text-black'}`} />
                        ) : (
                          <div className={`w-4.5 h-4.5 rounded-full border-2 transition-colors ${
                            isPremium 
                              ? 'border-zinc-300 bg-white group-hover/checkbox:border-[#F35D00]/60' 
                              : 'border-zinc-400 bg-white group-hover/checkbox:border-black'
                          }`} />
                        )}
                      </div>
                      <span className={`${isPremium ? 'text-[13px] font-semibold text-zinc-700' : 'text-xs text-black font-medium'}`}>Module for registration</span>
                    </label>
                  </div>

                </div>

                {/* Save button matching Option 1 perfectly */}
                <div className="pt-5 flex justify-end border-t border-zinc-200/50">
                  <button
                    onClick={handleSave}
                    className={`${
                      isPremium
                        ? 'flex items-center gap-2 bg-[#F35D00] hover:bg-neutral-800 active:scale-[0.98] text-white px-6 py-2.5 rounded-lg text-[13.5px] font-bold shadow-md cursor-pointer transition-all'
                        : 'flex items-center gap-2 bg-[#F35D00] hover:bg-neutral-800 active:scale-[0.98] text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Custom Modernized System Fields Card matching Module details layout */}
            <div className={`${
              isPremium 
                ? 'bg-[#FAFAFC] border border-zinc-200/55 rounded-3xl shadow-xs overflow-hidden flex flex-col' 
                : 'bg-[#F9FAFB] border border-zinc-250/50 rounded-2xl p-5 flex flex-col space-y-4 shadow-sm'
            }`}>
              <div className="bg-transparent px-6 pt-6 pb-2 border-none flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-[5px] h-6 rounded-full bg-gradient-to-b from-[#F35D00] to-[#FF904D] shadow-xs" />
                  <h3 className={`text-[18px] font-extrabold tracking-tight ${isPremium ? 'text-zinc-900' : 'text-black'}`}>System fields</h3>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex flex-col">
                <p className={`${isPremium ? 'text-[13px] text-zinc-500 italic font-medium' : 'text-xs text-zinc-500 italic font-medium'}`}>
                  No System fields available for module.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
      )}
    </div>
  );
}
