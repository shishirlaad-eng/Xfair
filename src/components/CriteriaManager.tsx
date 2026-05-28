/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CriteriaItem, ThemeSettings } from '../types';
import { Save, Trash2, Check, ArrowRight, HelpCircle } from 'lucide-react';

interface CriteriaManagerProps {
  items: CriteriaItem[];
  theme: ThemeSettings;
  onUpdateItems: (updated: CriteriaItem[]) => void;
  onShowToast: (message: string) => void;
}

export default function CriteriaManager({ items, theme, onUpdateItems, onShowToast }: CriteriaManagerProps) {
  const [selectedId, setSelectedId] = useState<number>(1006); // Company Function is default selected
  const [criteriaType, setCriteriaType] = useState<string>('Employee');

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

  const handleDeleteRow = (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete criteria "${name}"?`)) {
      const updated = items.filter((item) => item.id !== id);
      onUpdateItems(updated);
      if (selectedId === id && updated.length > 0) {
        setSelectedId(updated[0].id);
      }
      onShowToast(`Criteria "${name}" deleted.`);
    }
  };

  const handleFieldChange = (field: keyof CriteriaItem, value: any) => {
    const updated = items.map((item) =>
      item.id === selectedId ? { ...item, [field]: value } : item
    );
    onUpdateItems(updated);
  };

  const handleTranslationChange = (field: 'shortNameTranslations' | 'criteriaTranslations' | 'descriptionTranslations', index: number, value: string) => {
    const list = [...selectedItem[field]];
    if (!list[index]) {
      list[index] = { lang: index === 0 ? 'US' : index === 1 ? 'UK' : 'DE', value: '' };
    }
    list[index] = { ...list[index], value };
    handleFieldChange(field, list);
  };

  const handleSave = () => {
    onShowToast(`Criteria "${selectedItem.name}" saved.`);
  };

  return (
    <div className={`w-full flex flex-col ${isPremium ? 'space-y-4' : 'space-y-2'}`} id="criteria-manager-root">
      
      {/* Visual Design Mode banner */}
      {isPremium && (
        <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200/80 rounded-lg p-3 text-xs text-zinc-600 shadow-sm" id="premium-banner-crit">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#FFE7D6] text-[#F35D00]">Modern Theme Active</span>
            <span>Technical grid mapping density, with soft-edge primary outlines and a secure master-detail list connector.</span>
          </div>
          <div className="text-zinc-400 text-[11px] font-mono select-none">EMS › Criteria Manager</div>
        </div>
      )}

      {/* Select criteria type filter */}
      <div className={`${isPremium ? 'bg-white border border-gray-200/80 rounded-xl shadow-premium p-4 flex flex-col space-y-2' : 'bg-[#F2F2F2] border border-gray-400 p-2 text-xs flex items-center gap-4'}`}>
        <label className={`${isPremium ? 'text-xs font-semibold text-zinc-700' : 'text-xs font-bold text-black'}`}>Select criteria type</label>
        <div className="relative max-w-sm">
          <select
            value={criteriaType}
            onChange={(e) => setCriteriaType(e.target.value)}
            className={`${isPremium ? 'w-full bg-zinc-50/50 border border-zinc-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-zinc-800 focus:outline-[#F35D00]' : 'w-full bg-white border border-gray-400 p-1 text-xs'}`}
          >
            <option value="Employee">Employee</option>
            <option value="Visitor">Visitor</option>
            <option value="VIP">VIP</option>
          </select>
          {isPremium && (
            <span className="absolute right-3 top-2 pointer-events-none text-zinc-400 select-none">▼</span>
          )}
        </div>
      </div>

      {/* 2-Column Split Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Grid */}
        <div className={`${isPremium ? 'lg:col-span-4 bg-white border border-gray-200/80 rounded-xl shadow-premium overflow-hidden' : 'lg:col-span-5 bg-[#F2F2F2] border border-gray-400 rounded-none p-1'}`}>
          <div className={`${isPremium ? 'bg-zinc-50 border-b border-gray-200 p-3' : 'bg-[#E5E5E5] p-2 border-b border-gray-400 font-bold text-xs'}`}>
            <span className={isPremium ? 'font-medium text-zinc-900' : 'text-black'}>Criteria</span>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${isPremium ? 'bg-zinc-50/50 text-[11px] text-zinc-500' : 'bg-gray-300 text-xs text-black'}`}>
                  <th className="p-2 w-10 text-center font-medium">Active</th>
                  <th className="p-2 font-medium">Criteria</th>
                  <th className="p-2 w-20 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody className={isPremium ? 'divide-y divide-gray-100' : ''}>
                {items.map((item) => {
                  const isSelected = item.id === selectedId;
                  
                  let rowStyle = '';
                  let checkboxStyle = '';
                  if (isPremium) {
                    rowStyle = isSelected 
                      ? 'bg-zinc-50 text-zinc-950 font-medium relative border-l-3 border-[#F35D00]' 
                      : 'hover:bg-zinc-50/40 text-zinc-600 cursor-pointer transition-colors';
                    checkboxStyle = 'w-4 h-4 rounded border-zinc-200 text-[#F35D00] focus:ring-[#F35D00]';
                  } else {
                    rowStyle = isSelected 
                      ? 'bg-[#D3D3D3] text-black font-bold' 
                      : 'hover:bg-[#EAEAEA] text-black cursor-pointer';
                    checkboxStyle = 'w-4 h-4 rounded-none border-gray-400';
                  }

                  return (
                    <tr
                      key={item.id}
                      className={`${rowStyle} text-xs`}
                      onClick={() => handleRowClick(item.id)}
                      id={`criteria-row-${item.id}`}
                    >
                      <td className="p-2 text-center" onClick={(e) => handleCheckboxToggle(item.id, e)}>
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={() => {}}
                          className={checkboxStyle}
                        />
                      </td>
                      
                      <td className="p-2 truncate cursor-pointer font-sans">
                        {item.name}
                      </td>

                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => handleDeleteRow(item.id, item.name, e)}
                            className={`${isPremium ? 'p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50/50 transition-colors cursor-pointer' : 'px-1 bg-yellow-100 border border-gray-400 text-xs text-black'}`}
                            title="Delete Row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleRowClick(item.id)}
                            className={`${isPremium ? 'p-1 rounded text-zinc-400 hover:text-[#F35D00] hover:bg-zinc-100 transition-colors cursor-pointer' : 'px-1 bg-gray-100 border border-gray-400 text-xs text-black'}`}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className={`${isPremium ? 'lg:col-span-8 bg-white border border-gray-200/80 rounded-xl shadow-premium p-5 flex flex-col space-y-4' : 'lg:col-span-7 bg-[#F2F2F2] border border-gray-400 rounded-none p-4 flex flex-col space-y-3'}`}>
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className={`${isPremium ? 'text-sm font-semibold text-zinc-900 tracking-tight' : 'text-xs font-bold text-black'}`}>Criteria details</h3>
            <span className={`${isPremium ? 'text-xs text-zinc-400 font-mono' : 'text-xs text-black'}`}>
              ID: <strong className={isPremium ? 'text-[#F35D00] font-mono' : ''}>{selectedItem.id}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3">
            
            {/* Short name for reports * */}
            <div className="md:col-span-4 text-xs font-medium text-zinc-500 py-1">
              Short name for reports <span className="text-red-500">*</span>
            </div>
            <div className="md:col-span-8 flex flex-col space-y-2">
              {[0, 1, 2].map((idx) => {
                const trans = selectedItem.shortNameTranslations[idx] || { lang: idx === 0 ? 'US' : idx === 1 ? 'UK' : 'DE', value: '' };
                const isUS = trans.lang === 'US';
                const flag = trans.lang === 'US' ? '🇺🇸' : trans.lang === 'UK' ? '🇬🇧' : '🇩🇪';
                
                return (
                  <div key={trans.lang} className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                      {isPremium ? (
                        isUS ? (
                          <div className="w-4 h-4 rounded-full bg-[#FFE7D6] flex items-center justify-center text-[#F35D00]">
                            <span className="text-[10px] font-bold">✓</span>
                          </div>
                        ) : null
                      ) : (
                        isUS ? <span className="text-orange-500 font-bold">✓</span> : null
                      )}
                    </div>
                    <span className="text-base select-none">{flag}</span>
                    <input
                      type="text"
                      value={trans.value}
                      onChange={(e) => handleTranslationChange('shortNameTranslations', idx, e.target.value)}
                      className={`${isPremium ? 'flex-1 bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'flex-1 bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Criteria * */}
            <div className="md:col-span-4 text-xs font-medium text-zinc-500 py-1">
              Criteria <span className="text-red-500">*</span>
            </div>
            <div className="md:col-span-8 flex flex-col space-y-2">
              {[0, 1, 2].map((idx) => {
                const trans = selectedItem.criteriaTranslations[idx] || { lang: idx === 0 ? 'US' : idx === 1 ? 'UK' : 'DE', value: '' };
                const isUS = trans.lang === 'US';
                const flag = trans.lang === 'US' ? '🇺🇸' : trans.lang === 'UK' ? '🇬🇧' : '🇩🇪';
                
                return (
                  <div key={trans.lang} className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                      {isPremium ? (
                        isUS ? (
                          <div className="w-4 h-4 rounded-full bg-[#FFE7D6] flex items-center justify-center text-[#F35D00]">
                            <span className="text-[10px] font-bold">✓</span>
                          </div>
                        ) : null
                      ) : (
                        isUS ? <span className="text-orange-550 font-bold">✓</span> : null
                      )}
                    </div>
                    <span className="text-base select-none">{flag}</span>
                    <input
                      type="text"
                      value={trans.value}
                      onChange={(e) => handleTranslationChange('criteriaTranslations', idx, e.target.value)}
                      className={`${isPremium ? 'flex-1 bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'flex-1 bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="md:col-span-4 text-xs font-medium text-zinc-500 py-1">
              Description
            </div>
            <div className="md:col-span-8 flex flex-col space-y-2">
              {[0, 1, 2].map((idx) => {
                const trans = selectedItem.descriptionTranslations[idx] || { lang: idx === 0 ? 'US' : idx === 1 ? 'UK' : 'DE', value: '' };
                const isUS = trans.lang === 'US';
                const flag = trans.lang === 'US' ? '🇺🇸' : trans.lang === 'UK' ? '🇬🇧' : '🇩🇪';
                
                return (
                  <div key={trans.lang} className="flex items-start gap-2">
                    <div className="w-5 h-5 flex items-center justify-center mt-1.5">
                      {isPremium ? (
                        isUS ? (
                          <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center text-[#F35D00]">
                            <span className="text-[9px] font-bold">▶</span>
                          </div>
                        ) : null
                      ) : (
                        isUS ? <span className="text-orange-500 font-bold">▶</span> : null
                      )}
                    </div>
                    <span className="text-base mt-1.5 leading-none select-none">{flag}</span>
                    <textarea
                      rows={2}
                      value={trans.value}
                      onChange={(e) => handleTranslationChange('descriptionTranslations', idx, e.target.value)}
                      placeholder={isUS ? "Please explain how criteria values are assigned..." : ""}
                      className={`${isPremium ? 'flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 resize-none focus:outline-[#F35D00]' : 'flex-1 bg-white border border-gray-400 p-1 text-xs text-black resize-none'}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Type */}
            <div className="md:col-span-4 text-xs font-medium text-zinc-500 self-center">
              Type
            </div>
            <div className="md:col-span-8 text-xs font-semibold text-zinc-800 self-center">
              {selectedItem.type}
            </div>

            {/* Checkboxes Settings */}
            <div className="md:col-span-4 text-xs font-medium text-zinc-500">
              Settings
            </div>
            <div className="md:col-span-8 flex flex-wrap items-center gap-4 py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedItem.active}
                  onChange={(e) => handleFieldChange('active', e.target.checked)}
                  className={isPremium ? 'w-4 h-4 rounded border-zinc-305 text-[#F35D00] focus:ring-[#F35D00]' : 'w-4 h-4 rounded-none border-gray-400'}
                />
                <span className={`${isPremium ? 'text-xs text-zinc-700' : 'text-xs text-black'}`}>Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedItem.additionalComments}
                  onChange={(e) => handleFieldChange('additionalComments', e.target.checked)}
                  className={isPremium ? 'w-4 h-4 rounded border-zinc-305 text-[#F35D00] focus:ring-[#F35D00]' : 'w-4 h-4 rounded-none border-gray-400'}
                />
                <span className={`${isPremium ? 'text-xs text-zinc-700' : 'text-xs text-black'}`}>Additional comments</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedItem.multiSelect}
                  onChange={(e) => handleFieldChange('multiSelect', e.target.checked)}
                  className={isPremium ? 'w-4 h-4 rounded border-zinc-305 text-[#F35D00] focus:ring-[#F35D00]' : 'w-4 h-4 rounded-none border-gray-400'}
                />
                <span className={`${isPremium ? 'text-xs text-zinc-700' : 'text-xs text-black'}`}>Multi select</span>
              </label>
            </div>

          </div>

          <div className="pt-2 flex justify-end border-t border-gray-100">
            <button
              onClick={handleSave}
              className={`${
                isPremium
                  ? 'flex items-center gap-1.5 bg-[#F35D00] hover:bg-neutral-800 active:scale-[0.98] text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-md cursor-pointer transition-all'
                  : 'flex items-center gap-1 bg-[#E1E1E1] border border-gray-500 text-black px-4 py-1.5 text-xs font-bold cursor-pointer'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
