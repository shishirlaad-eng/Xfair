/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronRight, Save, Languages, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { ThemeConfig } from '../types';

interface ResourceEditorPageProps {
  activeTheme: ThemeConfig;
}

interface ResourceItem {
  id: string;
  key: string;
  source: string;
  target: string;
}

export function ResourceEditorPage({ activeTheme }: ResourceEditorPageProps) {
  // Filters state
  const [selectedModule, setSelectedModule] = useState('Core');
  const [selectedResource, setSelectedResource] = useState('/Company/Company.aspx');
  const [translateFrom, setTranslateFrom] = useState('English (UK)');
  const [translateTo, setTranslateTo] = useState('English (US)');

  // List choices for custom, themed dropdown elements
  const moduleOptions = ['Core', 'Events', 'Hotel', 'CRM', 'Administration'];
  const resourceOptions = ['/Company/Company.aspx', '/Contact/ContactDetail.aspx', '/Registration/EventReg.aspx', '/Hotel/Request.aspx'];
  const translateFromOptions = ['English (UK)', 'English (US)', 'German (DE)', 'French (FR)'];
  const translateToOptions = ['English (US)', 'English (UK)', 'German (DE)', 'French (FR)', 'Italian (IT)'];

  // Underpinning state for active dropdown interaction
  const [activeDropdown, setActiveDropdown] = useState<'module' | 'resource' | 'translateFrom' | 'translateTo' | null>(null);

  // Notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Default dataset matching the provided screenshot exactly (with editable state)
  const [items, setItems] = useState<ResourceItem[]>([
    {
      id: '1',
      key: 'AddressBox.GroupingText',
      source: 'Address',
      target: 'Address',
    },
    {
      id: '2',
      key: 'AddressCV.ErrorMessage',
      source: 'The selected address cannot be removed because it has persons assigned to it! Please transfer all assigned persons to a different company before deleting.',
      target: 'The selected address cannot be removed because it has persons assigned to it! Please transfer all assigned persons to a different company before deleting.',
    },
    {
      id: '3',
      key: 'AssignedPersonsBox.GroupingText',
      source: 'Assigned persons',
      target: 'Assigned persons',
    },
    {
      id: '4',
      key: 'AssignedVisitorsCV.ErrorMessage',
      source: 'The company cannot be removed, because it is assigned to visitors as responsible company!',
      target: 'The company cannot be removed, because it is assigned to visitors as responsible company!',
    },
    {
      id: '5',
      key: 'CompanyAddressesLabel.Text',
      source: 'Office address',
      target: 'Office address',
    },
    {
      id: '6',
      key: 'CompanyNameExistsLabel.Text',
      source: 'The entered company name already exists in the system. Please enter a different company name or use the company search',
      target: 'The entered company name already exists in the system. Please enter a different company name or use the company search',
    },
    {
      id: '7',
      key: 'CompanyNameTBRV.ErrorMessage',
      source: 'Company Name is required!',
      target: 'Company Name is required!',
    },
    {
      id: '8',
      key: 'DeleteCBE.ConfirmText',
      source: 'Are you sure you wish to delete this company?',
      target: 'Are you sure you wish to delete this company?',
    },
    {
      id: '9',
      key: 'DeleteCompanyCV.ErrorMessage',
      source: 'The company cannot be removed because it has persons assigned to it! Please transfer all persons to a different company before deleting.',
      target: 'The company cannot be removed because it has persons assigned to it! Please transfer all persons to a different company before deleting.',
    },
    {
      id: '10',
      key: 'DetailsBox.GroupingText',
      source: 'General details',
      target: 'General details',
    },
    {
      id: '11',
      key: 'NoAssignedPersonsLbl.Text',
      source: 'No Assigned Persons found.',
      target: 'No Assigned Persons found.',
    },
    {
      id: '12',
      key: 'NoResponsibilityLbl.Text',
      source: 'No responsible persons found.',
      target: 'No responsible persons found.',
    },
    {
      id: '13',
      key: 'PaymentAddressCV.ErrorMessage',
      source: 'The selected address cannot be removed because it has payments assigned to it!',
      target: 'The selected address cannot be removed because it has payments assigned to it!',
    },
    {
      id: '14',
      key: 'ResponsibilityBox.GroupingText',
      source: 'Responsible persons',
      target: 'Responsible persons',
    },
    {
      id: '15',
      key: 'TransferEmployeesBox.GroupingText',
      source: 'Transfer employees to another company.',
      target: 'Transfer employees to another company.',
    },
    {
      id: '16',
      key: 'TransferPersonsLbl.Text',
      source: 'Transfer employees',
      target: 'Transfer employees',
    },
    {
      id: '17',
      key: 'ViewResponsiblePersonsLbl.Text',
      source: 'View persons',
      target: 'View persons',
    },
  ]);

  // Handle live updating of translatable fields
  const handleUpdateText = (id: string, field: 'source' | 'target', value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Trigger simulated successful persistence
  const handleSave = () => {
    setSuccessMsg('Translations successfully serialized and saved to server storage.');
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  return (
    <div className="space-y-8 pb-20 select-none animate-fadeIn" id="resource-editor-page-root">
      
      {/* Title & Actions Bar matching standard screen architecture */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: activeTheme.borderColor }}>
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium tracking-wide" id="re-breadcrumb">
            <span>EMS</span>
            <ChevronRight className="w-3 h-3 text-neutral-300" style={{ color: '#d1d5db' }} />
            <span className="font-semibold" style={{ color: activeTheme.primaryColor }}>Resource editor</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight mt-2" style={{ color: activeTheme.textColor }}>
            Resource editor
          </h2>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            type="button"
            onClick={handleSave}
            className="h-8 px-4 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Success / Error notification bar */}
      {successMsg && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold animate-fadeIn max-w-[1200px]" id="re-notification">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs font-semibold animate-fadeIn max-w-[1200px]" id="re-error">
          <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* BLOCK 1: Select Resource form */}
      <div className="bg-white rounded-2xl border shadow-2xs overflow-visible" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }} id="re-select-resource-card">
        
        {/* Card Header */}
        <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
          <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
            Select resource
          </h3>
        </div>

        {/* Card Content Form */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          
          {/* Modules Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 font-sans block" style={{ color: activeTheme.textColor }}>Modules</label>
            <div className={`relative ${activeDropdown === 'module' ? 'z-40' : 'z-20'}`}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'module' ? null : 'module')}
                className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-800 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              >
                <span className="truncate">{selectedModule}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform font-bold" style={{ transform: activeDropdown === 'module' ? 'rotate(180deg)' : 'none' }} />
              </button>

              {activeDropdown === 'module' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div 
                    className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                    style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                  >
                    {moduleOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedModule(opt);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                        style={{
                          color: activeTheme.textColor,
                          backgroundColor: selectedModule === opt ? activeTheme.backgroundColor : undefined,
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Resources Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 font-sans block" style={{ color: activeTheme.textColor }}>Resources</label>
            <div className={`relative ${activeDropdown === 'resource' ? 'z-40' : 'z-20'}`}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'resource' ? null : 'resource')}
                className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-800 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              >
                <span className="truncate">{selectedResource}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform font-bold" style={{ transform: activeDropdown === 'resource' ? 'rotate(180deg)' : 'none' }} />
              </button>

              {activeDropdown === 'resource' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div 
                    className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                    style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                  >
                    {resourceOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedResource(opt);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                        style={{
                          color: activeTheme.textColor,
                          backgroundColor: selectedResource === opt ? activeTheme.backgroundColor : undefined,
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Translate From Column */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 font-sans block" style={{ color: activeTheme.textColor }}>Translate from</label>
            <div className={`relative ${activeDropdown === 'translateFrom' ? 'z-40' : 'z-20'}`}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'translateFrom' ? null : 'translateFrom')}
                className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-800 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              >
                <span className="truncate">{translateFrom}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform font-bold" style={{ transform: activeDropdown === 'translateFrom' ? 'rotate(180deg)' : 'none' }} />
              </button>

              {activeDropdown === 'translateFrom' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div 
                    className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                    style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                  >
                    {translateFromOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setTranslateFrom(opt);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                        style={{
                          color: activeTheme.textColor,
                          backgroundColor: translateFrom === opt ? activeTheme.backgroundColor : undefined,
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Translate To Column */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 font-sans block" style={{ color: activeTheme.textColor }}>Translate to</label>
            <div className={`relative ${activeDropdown === 'translateTo' ? 'z-40' : 'z-20'}`}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'translateTo' ? null : 'translateTo')}
                className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-800 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
              >
                <span className="truncate">{translateTo}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform font-bold" style={{ transform: activeDropdown === 'translateTo' ? 'rotate(180deg)' : 'none' }} />
              </button>

              {activeDropdown === 'translateTo' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div 
                    className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                    style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                  >
                    {translateToOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setTranslateTo(opt);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100"
                        style={{
                          color: activeTheme.textColor,
                          backgroundColor: translateTo === opt ? activeTheme.backgroundColor : undefined,
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* BLOCK 2: Resource List card with fully responsive and customizable editor rows */}
      <div className="bg-white rounded-2xl border shadow-2xs overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }} id="re-resource-list-card">
        
        {/* Card Header Toolbar with dynamic filters */}
        <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: activeTheme.borderColor }}>
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
              Resource list
            </h3>
          </div>
        </div>

        {/* Content Table / List Grid matching the high-fidelity style */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-neutral-50/20 border-b text-[10.5px] font-bold text-neutral-400 hover:text-neutral-600 tracking-wider border-neutral-100">
                <th className="py-3 px-5 w-1/4">Key</th>
                <th className="py-3 px-5 w-3/8">{translateFrom}</th>
                <th className="py-3 px-5 w-3/8">{translateTo}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-neutral-55/10 transition-all align-top"
                  >
                    {/* Key field name with copy text */}
                    <td className="py-4 px-5 font-mono text-[11.5px] font-medium select-text break-all" style={{ color: activeTheme.textColor }}>
                      {item.key}
                    </td>

                    {/* Source English UK field (Editable in input fields matching Event Manager style exactly) */}
                    <td className="py-3 px-5">
                      <input
                        type="text"
                        value={item.source}
                        onChange={(e) => handleUpdateText(item.id, 'source', e.target.value)}
                        className="w-full h-7 px-3 border border-neutral-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 font-normal bg-neutral-50/10 text-neutral-800"
                        style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                        placeholder="Draft translation..."
                      />
                    </td>

                    {/* Target English US field (Editable in input fields matching Event Manager style exactly) */}
                    <td className="py-3 px-5">
                      <input
                        type="text"
                        value={item.target}
                        onChange={(e) => handleUpdateText(item.id, 'target', e.target.value)}
                        className="w-full h-7 px-3 border border-neutral-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 font-normal bg-neutral-50/10 text-neutral-800"
                        style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                        placeholder="Draft translation..."
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-neutral-400 font-medium">
                    <div className="flex flex-col items-center gap-2">
                       <span>No keys available in resource configuration.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
