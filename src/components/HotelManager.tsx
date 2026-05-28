/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HotelItem, ThemeSettings } from '../types';
import { Search, Download, Edit, Trash2, Plus, Star, X } from 'lucide-react';

interface HotelManagerProps {
  items: HotelItem[];
  theme: ThemeSettings;
  onUpdateItems: (updated: HotelItem[]) => void;
  onShowToast: (message: string) => void;
}

export default function HotelManager({ items, theme, onUpdateItems, onShowToast }: HotelManagerProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true);
  
  // Inline hotel insertion state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newHotelName, setNewHotelName] = useState<string>('');
  const [newHotelStars, setNewHotelStars] = useState<number>(4);
  const [newHotelArea, setNewHotelArea] = useState<string>('');
  const [newHotelAddress, setNewHotelAddress] = useState<string>('');
  const [newHotelContingents, setNewHotelContingents] = useState<number>(2);

  const isPremium = theme.mode === 'premium';

  // Filter items in real time
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Original search behavior can tolerate filter checkbox
    if (isActiveFilter) {
      return matchesSearch && item.active;
    }
    return matchesSearch;
  });

  const handleCheckboxToggle = (id: number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    onUpdateItems(updated);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from your hotel list?`)) {
      const updated = items.filter((item) => item.id !== id);
      onUpdateItems(updated);
      onShowToast(`Hotel "${name}" successfully deleted.`);
    }
  };

  const handleAddHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim()) {
      alert('Please enter a hotel name.');
      return;
    }

    const newHotel: HotelItem = {
      id: Date.now(),
      active: true,
      name: newHotelName,
      stars: newHotelStars,
      area: newHotelArea,
      address: newHotelAddress,
      contingents: newHotelContingents
    };

    onUpdateItems([...items, newHotel]);
    onShowToast(`Hotel "${newHotelName}" was added successfully.`);
    
    // Clear state
    setNewHotelName('');
    setNewHotelArea('');
    setNewHotelAddress('');
    setNewHotelStars(4);
    setNewHotelContingents(2);
    setShowAddForm(false);
  };

  // Star rating helper
  const renderStars = (starsCount: number) => {
    if (starsCount === 0) return <span className="text-zinc-450 italic text-[11px]">No stars</span>;
    
    if (isPremium) {
      return (
        <div className="flex items-center gap-0.5" title={`${starsCount} Star Hotel`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < starsCount ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
              }`}
            />
          ))}
        </div>
      );
    } else {
      // Legacy simple text star rating symbols
      return <span className="text-amber-500 font-bold select-all">{"★".repeat(starsCount)}</span>;
    }
  };

  return (
    <div className={`w-full flex flex-col ${isPremium ? 'space-y-4' : 'space-y-3'}`} id="hotel-manager-root">
      
      {/* Visual Design Mode banner */}
      {isPremium && (
        <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200/80 rounded-lg p-3 text-xs text-zinc-650 shadow-sm" id="premium-banner-hotel">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#FFE7D6] text-[#F35D00]">Modern Theme Active</span>
            <span>Vectored star configurations, high contrast contingent pills, real-time filtering, and and modular inline inserts.</span>
          </div>
          <div className="text-zinc-400 text-[11px] font-mono select-none">EMS › Hotel › Hotel manager</div>
        </div>
      )}

      {/* Search Bar Grid Block */}
      <div className={`${isPremium ? 'bg-white border border-gray-200/80 rounded-xl shadow-premium p-4' : 'bg-[#F2F2F2] border border-gray-400 p-2 text-xs'}`}>
        <h3 className={`${isPremium ? 'text-xs font-semibold text-zinc-500 mb-2' : 'text-xs font-bold text-black border-b border-gray-300 pb-1 mb-2'}`}>Search</h3>
        
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input
              type="checkbox"
              checked={isActiveFilter}
              onChange={(e) => setIsActiveFilter(e.target.checked)}
              className={isPremium ? 'w-4 h-4 rounded border-zinc-300 text-[#F35D00] focus:ring-[#F35D00]' : 'w-4 h-4 rounded-none border-gray-400'}
            />
            <span className={isPremium ? 'text-zinc-700 font-medium' : 'text-black'}>Filter active hotels only</span>
          </label>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by hotel name, area, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isPremium ? 'flex-1 bg-zinc-50/50 border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-all' : 'flex-1 bg-white border border-gray-400 h-11 px-3 text-xs'}`}
            />
            
            <button
              onClick={() => onShowToast(`Filter applied with search: "${searchQuery}"`)}
              className={`${
                isPremium
                  ? 'flex items-center gap-1.5 bg-[#F35D00] hover:bg-[#E15E12] text-white px-5 h-11 rounded-lg text-xs font-bold shadow-md cursor-pointer transition-colors shrink-0'
                  : 'flex items-center gap-1 bg-[#E1E1E1] border border-gray-500 text-black px-3 h-11 text-xs font-bold cursor-pointer shrink-0'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Results card */}
      <div className={`${isPremium ? 'bg-white border border-gray-200/80 rounded-xl shadow-premium overflow-hidden' : 'bg-[#F2F2F2] border border-gray-400 p-1 rounded-none text-xs'}`}>
        
        <div className={`${isPremium ? 'bg-zinc-50 border-b border-gray-200 p-3.5 flex items-center justify-between' : 'bg-[#E5E5E5] p-2 border-b border-gray-400 font-bold'}`}>
          <span className={isPremium ? 'font-medium text-zinc-900 tracking-tight' : 'text-xs text-black'}>Results</span>
          {isPremium && <span className="text-[10px] font-mono text-zinc-400">{filteredItems.length} listed</span>}
        </div>

        {/* Results list */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${isPremium ? 'bg-zinc-50/50 text-[11px] text-zinc-500 border-b border-gray-150' : 'bg-gray-300 text-xs text-black border-b border-gray-450'}`}>
                <th className="p-3 w-12 text-center font-semibold">Active</th>
                <th className="p-3 font-semibold">Hotel name</th>
                <th className="p-3 font-semibold">Area</th>
                <th className="p-3 font-semibold">Address</th>
                <th className="p-3 w-32 text-center font-semibold text-wrap">Contingents</th>
                <th className="p-3 w-36 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className={isPremium ? 'divide-y divide-gray-100' : ''}>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400 italic text-xs">
                    No registry results matched search criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`${isPremium ? 'hover:bg-zinc-50/50 text-zinc-650' : 'hover:bg-[#EAEAEA] text-black'} text-xs`}
                    id={`hotel-row-${item.id}`}
                  >
                    
                    {/* Active */}
                    <td className="p-3 text-center" onClick={() => handleCheckboxToggle(item.id)}>
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() => {}}
                        className={isPremium ? 'w-4 h-4 rounded border-zinc-200 text-[#F35D00] focus:ring-[#F35D00] cursor-pointer' : 'w-4 h-4 rounded-none border-gray-400 cursor-pointer'}
                      />
                    </td>

                    {/* Hotel name */}
                    <td className="p-3 font-medium text-zinc-900 font-sans">
                      <div className="flex flex-col space-y-1">
                        <span className={isPremium ? 'font-semibold text-zinc-950 text-xs tracking-tight' : 'font-bold'}>{item.name}</span>
                        {renderStars(item.stars)}
                      </div>
                    </td>

                    {/* Area */}
                    <td className="p-3 font-sans truncate max-w-[150px]">
                      {item.area || <span className="text-zinc-350 italic">—</span>}
                    </td>

                    {/* Address */}
                    <td className="p-3 font-sans max-w-[200px] truncate" title={item.address}>
                      {item.address || <span className="text-zinc-350 italic">—</span>}
                    </td>

                    {/* Contingents Badge (Green/Orange) */}
                    <td className="p-3 text-center">
                      <div className="flex justify-center">
                        {isPremium ? (
                          item.contingents > 0 ? (
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-250 animate-pulse-soft">
                              {item.contingents} Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-250">
                              0 Quota
                            </span>
                          )
                        ) : (
                          <span 
                            className={`px-2 py-0.5 font-bold ${
                              item.contingents > 0 ? 'bg-[#4CAF50] text-white' : 'bg-[#FF9800] text-black'
                            }`}
                          >
                            {item.contingents}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onShowToast(`Downloading configuration PDF for "${item.name}"...`)}
                          className={`${isPremium ? 'p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer' : 'px-1 bg-gray-150 border border-gray-400'}`}
                          title="Download report sheet"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => onShowToast(`Edit configurations for "${item.name}"...`)}
                          className={`${isPremium ? 'p-1.5 rounded-lg text-zinc-400 hover:text-[#F35D00] hover:bg-zinc-100 cursor-pointer' : 'px-1 bg-gray-150 border border-gray-400'}`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className={`${isPremium ? 'p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 cursor-pointer' : 'px-1 bg-gray-150 border border-gray-400 text-red-650'}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sub horizontal bar: + Add new hotel toggleable screen */}
        <div className="p-3 border-t border-gray-100">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className={`${
                isPremium
                  ? 'w-full py-2.5 border border-dashed border-zinc-300 hover:border-[#F35D00] rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFE7D6] text-zinc-650 hover:text-zinc-950 font-semibold text-xs transition-colors cursor-pointer'
                  : 'w-full py-2 bg-white border border-gray-400 text-center text-xs font-bold cursor-pointer hover:bg-gray-50'
              }`}
            >
              <Plus className="w-4 h-4 text-[#F35D00]" />
              <span>Add new hotel</span>
            </button>
          ) : (
            <form onSubmit={handleAddHotelSubmit} className={`${isPremium ? 'bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3' : 'bg-white border border-gray-400 p-2 space-y-2'}`}>
              <div className="flex items-center justify-between border-b pb-2">
                <span className={`${isPremium ? 'font-bold text-zinc-800' : 'font-bold'}`}>Add New Hotel Record</span>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-zinc-400 hover:text-zinc-900">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-left">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wide mb-1.5">Hotel name *</label>
                  <input
                    type="text"
                    required
                    value={newHotelName}
                    onChange={(e) => setNewHotelName(e.target.value)}
                    className={`${isPremium ? 'w-full bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-805 placeholder-zinc-450 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-10 px-2'}`}
                    placeholder="e.g. Hilton Executive"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wide mb-1.5">Star rating (0-5)</label>
                  <select
                    value={newHotelStars}
                    onChange={(e) => setNewHotelStars(Number(e.target.value))}
                    className={`${isPremium ? 'w-full bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-805 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors cursor-pointer' : 'w-full bg-white border border-gray-400 h-10 px-2'}`}
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wide mb-1.5">Area</label>
                  <input
                    type="text"
                    value={newHotelArea}
                    onChange={(e) => setNewHotelArea(e.target.value)}
                    className={`${isPremium ? 'w-full bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-805 placeholder-zinc-450 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-10 px-2'}`}
                    placeholder="e.g. Munich Central"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wide mb-1.5">Contingents (Quota)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newHotelContingents}
                    onChange={(e) => setNewHotelContingents(Number(e.target.value))}
                    className={`${isPremium ? 'w-full bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-805 font-mono focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-10 px-2 text-zinc-805 font-mono'}`}
                  />
                </div>
              </div>

              <div className="text-xs text-left">
                <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wide mb-1.5">Street address</label>
                <input
                  type="text"
                  value={newHotelAddress}
                  onChange={(e) => setNewHotelAddress(e.target.value)}
                  className={`${isPremium ? 'w-full bg-white border border-zinc-200 rounded-lg px-4 h-11 text-xs text-zinc-850 placeholder-zinc-450 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-10 px-2'}`}
                  placeholder="e.g. Landsberger Str. 112, 80339 München, Germany"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded border border-zinc-205 text-zinc-650 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#F35D00] text-white hover:bg-neutral-800 font-semibold"
                >
                  Create Hotel Record
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
