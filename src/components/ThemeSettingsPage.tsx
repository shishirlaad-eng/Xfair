/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, RefreshCw, Save, Trash2, 
  Paperclip, ChevronRight, FileText, ChevronDown 
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { THEME_PRESETS } from '../data';

interface ThemeSettingsPageProps {
  currentTheme: ThemeConfig;
  onThemeChange: (updatedTheme: ThemeConfig) => void;
  activeTheme: ThemeConfig;
}

const FONT_OPTIONS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Nunito',
  'Work Sans',
  'Noto Sans',
  'Source Sans 3',
  'DM Sans',
  'Manrope',
  'Figtree',
  'Plus Jakarta Sans',
  'Outfit',
  'Mulish',
  'Karla',
  'Jost',
  'Cabin',
  'Rubik',
  'Raleway',
  'Exo 2',
  'Overpass',
  'Sora'
];

export function ThemeSettingsPage({ currentTheme, onThemeChange, activeTheme }: ThemeSettingsPageProps) {
  // Local state for the editable parameters of the theme with initial alignment matching requirements 8 and 9
  const [themeState, setThemeState] = useState<ThemeConfig>({
    ...currentTheme,
    secondaryColor: currentTheme.secondaryColor === '#f89728' || currentTheme.secondaryColor === '' ? '#1E1E24' : currentTheme.secondaryColor,
    accentColor: currentTheme.accentColor === '#df7c1a' || currentTheme.accentColor === '' ? '#F6F6F6' : currentTheme.accentColor,
    loginMainTitle: currentTheme.loginMainTitle || "Next-gen event orchestration starts here.",
    loginSubTitle: currentTheme.loginSubTitle || "Manage attendance calendars, registration types, hotel lists, and branding systems in a simplified premium workspace."
  });

  // Local state for dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState<'fontFamily' | null>(null);

  // Local state for simulated file size/names to make it realistic
  const [filesState, setFilesState] = useState({
    logo: themeState.logoUrl ? { name: "company_logo_brand.png", size: "1.4 MB" } : null,
    favicon: themeState.faviconUrl ? { name: "favicon.ico", size: "12 KB" } : null,
    loginBackground: themeState.loginBackgroundUrl ? { name: "portal_background.jpg", size: "4.8 MB" } : null
  });

  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    // Toast messages removed per user request
  };

  // Handlers for input updates
  const handleInputChange = (key: keyof ThemeConfig, val: string) => {
    setThemeState(prev => {
      const updated = { ...prev, [key]: val };
      onThemeChange(updated);
      return updated;
    });
  };

  // Native color picker or swatch updates
  const handleColorChange = (key: 'primaryColor' | 'secondaryColor' | 'accentColor', hexVal: string) => {
    let cleanHex = hexVal;
    if (hexVal && !hexVal.startsWith('#') && hexVal.length <= 7) {
      cleanHex = '#' + hexVal;
    }
    setThemeState(prev => {
      const updated = { ...prev, [key]: cleanHex };
      onThemeChange(updated);
      return updated;
    });
  };

  // Mock Upload Handler
  const handleLogoUploadMock = (field: 'logo' | 'favicon' | 'loginBackground', simulatedName: string, sizeStr: string) => {
    let mockUrl = '';
    if (field === 'logo') {
      mockUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop';
      setThemeState(prev => {
        const u = { ...prev, logoUrl: mockUrl };
        onThemeChange(u);
        return u;
      });
      setFilesState(prev => ({ ...prev, logo: { name: simulatedName, size: sizeStr } }));
    } else if (field === 'favicon') {
      mockUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=32&auto=format&fit=crop';
      setThemeState(prev => {
        const u = { ...prev, faviconUrl: mockUrl };
        onThemeChange(u);
        return u;
      });
      setFilesState(prev => ({ ...prev, favicon: { name: simulatedName, size: sizeStr } }));
    } else {
      mockUrl = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop';
      setThemeState(prev => {
        const u = { ...prev, loginBackgroundUrl: mockUrl };
        onThemeChange(u);
        return u;
      });
      setFilesState(prev => ({ ...prev, loginBackground: { name: simulatedName, size: sizeStr } }));
    }
  };

  // Clear Uploaded File Mock
  const handleFileClear = (field: 'logo' | 'favicon' | 'loginBackground') => {
    if (field === 'logo') {
      setThemeState(prev => {
        const u = { ...prev, logoUrl: '' };
        onThemeChange(u);
        return u;
      });
      setFilesState(prev => ({ ...prev, logo: null }));
    } else if (field === 'favicon') {
      setThemeState(prev => {
        const u = { ...prev, faviconUrl: '' };
        onThemeChange(u);
        return u;
      });
      setFilesState(prev => ({ ...prev, favicon: null }));
    } else {
      setThemeState(prev => {
        const u = { ...prev, loginBackgroundUrl: '' };
        onThemeChange(u);
        return u;
      });
      setFilesState(prev => ({ ...prev, loginBackground: null }));
    }
  };

  // Reset to original Classic Defaults
  const handleResetTheme = () => {
    const classicDefault = THEME_PRESETS[0].theme;
    const restored = {
      ...classicDefault,
      secondaryColor: '#1E1E24',
      accentColor: '#F6F6F6',
      loginMainTitle: "Next-gen event orchestration starts here.",
      loginSubTitle: "Manage attendance calendars, registration types, hotel lists, and branding systems in a simplified premium workspace."
    };
    setThemeState(restored);
    setFilesState({
      logo: { name: "company_logo_brand.png", size: "1.4 MB" },
      favicon: { name: "favicon.ico", size: "12 KB" },
      loginBackground: { name: "portal_background.jpg", size: "4.8 MB" }
    });
    onThemeChange(restored);
    triggerToast("Theme parameters reverted back to XFAIR Classic defaults.");
  };

  // Explicit Save Theme Button Actions
  const handleSaveTheme = () => {
    onThemeChange(themeState);
    triggerToast("Branding configuration saved and deployed immediately across the Enterprise Suite.");
  };

  return (
    <div className="space-y-8 pb-20 select-none animate-fadeIn">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: activeTheme.borderColor }}>
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium tracking-wide">
            <span>EMS</span>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <span className="text-neutral-808 font-semibold" style={{ color: activeTheme.primaryColor }}>Theme Manager</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mt-2" style={{ color: activeTheme.textColor }}>
            Manage Theme
          </h2>
        </div>

        {/* Action Buttons Toolbar consistent with Event Manager layout */}
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={handleResetTheme}
            className="h-8 px-4 border border-neutral-250 hover:bg-neutral-50 rounded-xl text-xs text-neutral-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer bg-white transition-all shadow-xs"
            style={{ borderColor: activeTheme.borderColor }}
          >
            <RefreshCw className="w-4 h-4 text-neutral-500" />
            <span>Reset Defaults</span>
          </button>
          
          <button 
            type="button"
            onClick={handleSaveTheme}
            className="h-8 px-4 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            <Save className="w-4 h-4" />
            <span>Save Theme</span>
          </button>
        </div>
      </div>

      {/* Success Notification Feedback Box */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl border flex items-center gap-2.5 shadow-md bg-emerald-50 text-emerald-800 border-emerald-200"
          >
            <Check className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold">{toastMessage} Compiled instantly.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single-column Layout for Theme Options Form (Real-Time Preview Removed) */}
      <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">

        {/* Section 1: Branding */}
        <div className="bg-white rounded-2xl border shadow-xs overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
            <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
              Branding
            </h3>
          </div>
          
          <div className="divide-y divide-neutral-100" style={{ borderColor: activeTheme.borderColor }}>
            {/* Row: Company Name */}
            <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Company Name
              </span>
              <div className="md:col-span-3">
                <input 
                  type="text" 
                  value={themeState.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full h-7 max-w-2xl px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-808 font-normal focus:outline-none"
                  style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                  placeholder="e.g. XFAIR Solutions GmbH"
                />
              </div>
            </div>

            {/* Row: Company Logo */}
            <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Company Logo
              </span>
              <div className="md:col-span-3 max-w-2xl">
                {!filesState.logo ? (
                  <button
                    type="button"
                    onClick={() => handleLogoUploadMock('logo', 'company_logo_brand.png', '1.4 MB')}
                    className="w-full h-11 border border-dashed rounded-xl px-4 flex items-center justify-between text-xs font-sans transition-all cursor-pointer hover:bg-neutral-50/50"
                    style={{ borderColor: activeTheme.borderColor || 'rgba(0,0,0,0.1)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-orange-500 font-bold" style={{ color: activeTheme.primaryColor }} />
                      <span className="font-semibold text-neutral-700" style={{ color: activeTheme.textColor }}>Click to Attach Company Logo</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">max. 16 MB</span>
                  </button>
                ) : (
                  <div 
                    className="w-full h-11 border rounded-xl px-4 flex items-center justify-between text-xs font-sans"
                    style={{ 
                      borderColor: (activeTheme.primaryColor || '#f89728') + '40',
                      backgroundColor: (activeTheme.primaryColor || '#f89728') + '08'
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-neutral-500" style={{ color: activeTheme.primaryColor }} />
                      <span className="font-bold text-neutral-800 truncate" style={{ color: activeTheme.textColor }}>
                        {filesState.logo.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">
                        ({filesState.logo.size})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileClear('logo')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-500 cursor-pointer"
                      title="Remove logo"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Row: Corporate Favicon */}
            <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Corporate Favicon
              </span>
              <div className="md:col-span-3 max-w-2xl">
                {!filesState.favicon ? (
                  <button
                    type="button"
                    onClick={() => handleLogoUploadMock('favicon', 'favicon.ico', '12 KB')}
                    className="w-full h-11 border border-dashed rounded-xl px-4 flex items-center justify-between text-xs font-sans transition-all cursor-pointer hover:bg-neutral-50/50"
                    style={{ borderColor: activeTheme.borderColor || 'rgba(0,0,0,0.1)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-orange-500 font-bold" style={{ color: activeTheme.primaryColor }} />
                      <span className="font-bold text-neutral-700" style={{ color: activeTheme.textColor }}>Click to Attach Corporate Favicon</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">max. 16 MB</span>
                  </button>
                ) : (
                  <div 
                    className="w-full h-11 border rounded-xl px-4 flex items-center justify-between text-xs font-sans"
                    style={{ 
                      borderColor: (activeTheme.primaryColor || '#f89728') + '40',
                      backgroundColor: (activeTheme.primaryColor || '#f89728') + '08'
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-neutral-500" style={{ color: activeTheme.primaryColor }} />
                      <span className="font-bold text-neutral-800 truncate" style={{ color: activeTheme.textColor }}>
                        {filesState.favicon.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">
                        ({filesState.favicon.size})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileClear('favicon')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-500 cursor-pointer"
                      title="Remove favicon"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Colors */}
        <div className="bg-white rounded-2xl border shadow-xs overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
            <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
              Colors
            </h3>
          </div>
          
          <div className="divide-y divide-neutral-100" style={{ borderColor: activeTheme.borderColor }}>
            {/* Primary Color row */}
            <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Primary Color
              </span>
              <div className="md:col-span-3">
                <div className="flex gap-3 max-w-2xl">
                  <input 
                    type="text" 
                    value={themeState.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 h-7 px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-800 font-normal focus:outline-none uppercase"
                    style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                    placeholder="#E5E7EB"
                  />
                  <div 
                    className="w-10 h-7 rounded-lg border border-neutral-200 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs transition-all relative overflow-hidden"
                    style={{ backgroundColor: themeState.primaryColor || '#000000', borderColor: activeTheme.borderColor }}
                  >
                    <input 
                      type="color"
                      value={themeState.primaryColor.startsWith('#') && themeState.primaryColor.length === 7 ? themeState.primaryColor : '#000000'}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer scale-150 w-full h-full"
                      title="Choose Primary Color"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Color row */}
            <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Secondary Color
              </span>
              <div className="md:col-span-3">
                <div className="flex gap-3 max-w-2xl">
                  <input 
                    type="text" 
                    value={themeState.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 h-7 px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-808 font-normal focus:outline-none uppercase"
                    style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                    placeholder="#E5E7EB"
                  />
                  <div 
                    className="w-10 h-7 rounded-lg border border-neutral-200 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs transition-all relative overflow-hidden"
                    style={{ backgroundColor: themeState.secondaryColor || '#000000', borderColor: activeTheme.borderColor }}
                  >
                    <input 
                      type="color"
                      value={themeState.secondaryColor.startsWith('#') && themeState.secondaryColor.length === 7 ? themeState.secondaryColor : '#000000'}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer scale-150 w-full h-full"
                      title="Choose Secondary Color"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* General Navigation Section Color row (Accent Color renamed) */}
            <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                General Navigation Section Color
              </span>
              <div className="md:col-span-3">
                <div className="flex gap-3 max-w-2xl">
                  <input 
                    type="text" 
                    value={themeState.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="flex-1 h-7 px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-808 font-normal focus:outline-none uppercase"
                    style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                    placeholder="#E5E7EB"
                  />
                  <div 
                    className="w-10 h-7 rounded-lg border border-neutral-200 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs transition-all relative overflow-hidden"
                    style={{ backgroundColor: themeState.accentColor || '#000000', borderColor: activeTheme.borderColor }}
                  >
                    <input 
                      type="color"
                      value={themeState.accentColor.startsWith('#') && themeState.accentColor.length === 7 ? themeState.accentColor : '#000000'}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer scale-150 w-full h-full"
                      title="Choose General Navigation Section Color"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Typography */}
        <div className="bg-white rounded-2xl border shadow-xs" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex items-center justify-between rounded-t-2xl" style={{ borderColor: activeTheme.borderColor }}>
            <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
              Typography
            </h3>
          </div>
          
          <div className="divide-y divide-neutral-100" style={{ borderColor: activeTheme.borderColor }}>
            {/* Custom Interactive Font Family Dropdown, matching Event Manager layout */}
            <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Font Family
              </span>
              <div className="md:col-span-3 relative max-w-2xl z-30">
                <button
                  type="button"
                  id="font-family-dropdown-trigger"
                  onClick={() => setActiveDropdown(activeDropdown === 'fontFamily' ? null : 'fontFamily')}
                  className="w-full h-7 flex items-center justify-between px-3 border border-neutral-200 bg-neutral-50/30 rounded-lg text-xs text-neutral-808 font-normal focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer text-left"
                  style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                >
                  <span className="truncate">
                    {themeState.fontFamily}
                  </span>
                  <ChevronDown 
                    className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200" 
                    style={{ transform: activeDropdown === 'fontFamily' ? 'rotate(180deg)' : 'none' }} 
                  />
                </button>

                {activeDropdown === 'fontFamily' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                    <div 
                      className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto border rounded-xl shadow-xl z-50 py-1"
                      style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}
                    >
                      {FONT_OPTIONS.map(font => (
                        <button
                          key={font}
                          type="button"
                          onClick={() => {
                            handleInputChange('fontFamily', font);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3 py-1.5 transition-colors cursor-pointer block truncate text-xs font-sans hover:bg-neutral-100/10"
                          style={{
                            color: activeTheme.textColor,
                            backgroundColor: themeState.fontFamily === font ? activeTheme.backgroundColor : undefined,
                            fontWeight: themeState.fontFamily === font ? 'bold' : 'normal'
                          }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Login Screen Setup */}
        <div className="bg-white rounded-2xl border shadow-xs overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
          <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
            <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
              Login Screen Setup
            </h3>
          </div>
          
          <div className="divide-y divide-neutral-100" style={{ borderColor: activeTheme.borderColor }}>
            {/* Row: Background Image */}
            <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Background Image
              </span>
              <div className="md:col-span-3 max-w-2xl">
                {!filesState.loginBackground ? (
                  <button
                    type="button"
                    onClick={() => handleLogoUploadMock('loginBackground', 'portal_background.jpg', '4.8 MB')}
                    className="w-full h-11 border border-dashed rounded-xl px-4 flex items-center justify-between text-xs font-sans transition-all cursor-pointer hover:bg-neutral-50/50"
                    style={{ borderColor: activeTheme.borderColor || 'rgba(0,0,0,0.1)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-orange-500 font-bold" style={{ color: activeTheme.primaryColor }} />
                      <span className="font-semibold text-neutral-700" style={{ color: activeTheme.textColor }}>Click to Attach Login Background Image</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">max. 16 MB</span>
                  </button>
                ) : (
                  <div 
                    className="w-full h-11 border rounded-xl px-4 flex items-center justify-between text-xs font-sans"
                    style={{ 
                      borderColor: (activeTheme.primaryColor || '#f89728') + '40',
                      backgroundColor: (activeTheme.primaryColor || '#f89728') + '08'
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-neutral-500" style={{ color: activeTheme.primaryColor }} />
                      <span className="font-bold text-neutral-800 truncate" style={{ color: activeTheme.textColor }}>
                        {filesState.loginBackground.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">
                        ({filesState.loginBackground.size})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileClear('loginBackground')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-500 cursor-pointer"
                      title="Remove background"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Row: Main Title */}
            <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Main Title
              </span>
              <div className="md:col-span-3">
                <input 
                  type="text" 
                  value={themeState.loginMainTitle}
                  onChange={(e) => handleInputChange('loginMainTitle', e.target.value)}
                  className="w-full h-7 max-w-2xl px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-808 font-normal focus:outline-none"
                  style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                  placeholder="Welcome to XFAIR Hub"
                />
              </div>
            </div>

            {/* Row: Sub-Title */}
            <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                Sub-Title
              </span>
              <div className="md:col-span-3">
                <input 
                  type="text" 
                  value={themeState.loginSubTitle}
                  onChange={(e) => handleInputChange('loginSubTitle', e.target.value)}
                  className="w-full h-7 max-w-2xl px-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-neutral-50/30 text-neutral-808 font-normal focus:outline-none"
                  style={{ color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                  placeholder="Sign In to Manage Your Events, Registrations, and Modules."
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
