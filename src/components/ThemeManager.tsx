/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ThemeSettings } from '../types';
import { 
  Save, 
  Trash2, 
  ChevronDown,
  RefreshCw,
  Paperclip
} from 'lucide-react';

interface ThemeManagerProps {
  theme: ThemeSettings;
  onShowToast: (message: string) => void;
}

export default function ThemeManager({ theme, onShowToast }: ThemeManagerProps) {
  const isPremium = theme.mode === 'premium';

  // State for branding fields
  const [companyName, setCompanyName] = useState<string>('XFAIR Solutions GmbH');

  // State for colors
  const [primaryColor, setPrimaryColor] = useState<string>('#F35D00');
  const [secondaryColor, setSecondaryColor] = useState<string>('#2F3747');
  const [accentColor, setAccentColor] = useState<string>('#FFE7D6');

  // State for typography
  const [fontWeight, setFontWeight] = useState<string>('Inter');
  const [showFontDropdown, setShowFontDropdown] = useState<boolean>(false);

  // State for login screen setup
  const [loginTitle, setLoginTitle] = useState<string>('Welcome to XFAIR Hub');
  const [loginSubtitle, setLoginSubtitle] = useState<string>('Sign in to manage your events, registrations, and modules.');

  // File Upload refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const loginBgInputRef = useRef<HTMLInputElement>(null);

  // Available font families list
  const FONTS_LIST = ['Inter', 'IBM Plex Sans', 'JetBrains Mono', 'Roboto', 'Montserrat', 'Playfair Display'];

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onShowToast(`Attached Company Logo: ${file.name}`);
    }
  };

  // Handle favicon upload
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onShowToast(`Attached Corporate Favicon: ${file.name}`);
    }
  };

  // Handle login background upload
  const handleLoginBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onShowToast(`Attached Login Background Image: ${file.name}`);
    }
  };

  // Reset theme defaults
  const handleResetDefaults = () => {
    setPrimaryColor('#F35D00');
    setSecondaryColor('#2F3747');
    setAccentColor('#FFE7D6');
    setFontWeight('Inter');
    onShowToast('Theme settings restored to corporate XFAIR guidelines.');
  };

  // Apply and save changes
  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Corporate branding configuration applied and saved successfully.');
  };

  return (
    <form onSubmit={handleSaveTheme} className="w-full flex flex-col space-y-6" id="theme-manager-root">
      
      {/* Page-level Header Title Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${isPremium ? 'border-zinc-200/80' : 'border-gray-400'}`}>
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h1 className={`${isPremium ? 'text-2xl font-black text-zinc-900 tracking-tight' : 'text-lg font-bold text-black'}`}>
            Manage Theme
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className={`${
              isPremium
                ? 'flex items-center gap-2 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-5 py-2.5 rounded-lg text-sm font-bold shadow-2xs active:scale-[0.98] transition-all cursor-pointer'
                : 'flex items-center gap-1.5 bg-[#E1E1E1] border border-gray-500 text-black px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-gray-200'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-zinc-500" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="submit"
            className={`${
              isPremium
                ? 'flex items-center gap-2 bg-[#F35D00] hover:bg-[#D55200] active:scale-[0.98] text-white px-6 py-2.5 rounded-lg text-sm font-extrabold shadow-md transition-all cursor-pointer'
                : 'flex items-center gap-1.5 bg-[#18181B] border border-black text-white px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-black'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save Theme</span>
          </button>
        </div>
      </div>

      {/* Form fields panels */}
      <div className="space-y-6 animate-fade-in pb-48">
        
        {/* SECTION 1: BRANDING */}
        <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden p-6' : 'bg-[#F2F2F2] border border-gray-400 p-4'}`} id="section-branding-fields">
          <div className="mb-6 pb-3 border-b border-zinc-100 text-left">
            <h2 className={`${isPremium ? 'text-sm font-bold text-zinc-800 tracking-wide font-sans' : 'text-xs font-bold text-black'}`}>Branding</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6 text-left">
              
              {/* Field: Company Name (autofilled and read only) */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                Company name
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  value={companyName}
                  disabled
                  className={`${isPremium ? 'w-full bg-zinc-50 border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-400 font-semibold cursor-not-allowed select-none' : 'w-full bg-zinc-100 border border-gray-400 h-11 px-3 text-xs text-gray-400 select-none cursor-not-allowed'}`}
                />
              </div>

              {/* Field: Company Logo (Attachment same as event manager) */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} self-start pt-2`}>
                Company logo
              </div>
              <div className="md:col-span-8" id="company-logo-container">
                <input 
                  type="file" 
                  ref={logoInputRef} 
                  onChange={handleLogoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className={`${
                    isPremium
                      ? 'border border-dashed border-zinc-300 hover:border-[#F35D00] bg-white rounded-xl p-3.5 transition-all text-center flex items-center justify-between cursor-pointer group shadow-3xs w-full'
                      : 'border border-dashed border-gray-400 hover:border-black p-3 bg-white text-center flex items-center justify-between cursor-pointer w-full'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Paperclip className={`w-4 h-4 shrink-0 ${isPremium ? 'text-[#F35D00]' : 'text-zinc-700'}`} />
                    <span className={`text-[12px] font-bold truncate ${isPremium ? 'text-zinc-700 group-hover:text-[#F35D00]' : 'text-black'}`}>
                      Click to attach Company Logo
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium shrink-0 font-mono">max. 16 MB</span>
                </div>
              </div>

              {/* Field: Corporate Favicon (Attachment same as event manager) */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} self-start pt-2`}>
                Corporate favicon
              </div>
              <div className="md:col-span-8" id="corporate-favicon-container">
                <input 
                  type="file" 
                  ref={faviconInputRef} 
                  onChange={handleFaviconUpload} 
                  accept=".ico,.png" 
                  className="hidden" 
                />

                <div 
                  onClick={() => faviconInputRef.current?.click()}
                  className={`${
                    isPremium
                      ? 'border border-dashed border-zinc-300 hover:border-[#F35D00] bg-white rounded-xl p-3.5 transition-all text-center flex items-center justify-between cursor-pointer group shadow-3xs w-full'
                      : 'border border-dashed border-gray-400 hover:border-black p-3 bg-white text-center flex items-center justify-between cursor-pointer w-full'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Paperclip className={`w-4 h-4 shrink-0 ${isPremium ? 'text-[#F35D00]' : 'text-zinc-700'}`} />
                    <span className={`text-[12px] font-bold truncate ${isPremium ? 'text-zinc-700 group-hover:text-[#F35D00]' : 'text-black'}`}>
                      Click to attach Corporate Favicon
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium shrink-0 font-mono">max. 16 MB</span>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: COLORS */}
          <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden p-6' : 'bg-[#F2F2F2] border border-gray-400 p-4'}`} id="section-colors-fields">
            <div className="mb-6 pb-3 border-b border-zinc-100 text-left">
              <h2 className={`${isPremium ? 'text-sm font-bold text-zinc-800 tracking-wide font-sans' : 'text-xs font-bold text-black'}`}>Colors</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6 text-left">
              
              {/* Field: Primary Color */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                Primary color
              </div>
              <div className="md:col-span-8 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#F35D00"
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>
                <div className="w-11 h-11 border border-[#E5E7EB] rounded-lg overflow-hidden shrink-0 shadow-3xs relative cursor-pointer">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: primaryColor }} />
                </div>
              </div>

              {/* Field: Secondary Color */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                Secondary color
              </div>
              <div className="md:col-span-8 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    placeholder="#2F3747"
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>
                <div className="w-11 h-11 border border-[#E5E7EB] rounded-lg overflow-hidden shrink-0 shadow-3xs relative cursor-pointer">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: secondaryColor }} />
                </div>
              </div>

              {/* Field: Accent Color */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                Accent color
              </div>
              <div className="md:col-span-8 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#FFE7D6"
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                  />
                </div>
                <div className="w-11 h-11 border border-[#E5E7EB] rounded-lg overflow-hidden shrink-0 shadow-3xs relative cursor-pointer">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: accentColor }} />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 3: TYPOGRAPHY */}
          <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6' : 'bg-[#F2F2F2] border border-gray-400 p-4'}`} id="section-typography-fields">
            <div className="mb-6 pb-3 border-b border-zinc-100 text-left">
              <h2 className={`${isPremium ? 'text-sm font-bold text-zinc-800 tracking-wide font-sans' : 'text-xs font-bold text-black'}`}>Typography</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6 text-left">
              
              {/* Field: Font Family */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                Font family
              </div>
              <div className="md:col-span-8">
                <div className="relative">
                  
                  <button
                    type="button"
                    onClick={() => setShowFontDropdown(!showFontDropdown)}
                    className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 flex items-center justify-between font-semibold cursor-pointer select-none transition-all shadow-3xs text-left' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black flex items-center justify-between font-semibold select-none text-left'}`}
                  >
                    <span>{fontWeight}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  </button>

                  {showFontDropdown && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowFontDropdown(false)} />
                      <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-zinc-200 rounded-lg shadow-lg py-1">
                        {FONTS_LIST.map((font) => (
                          <button
                            key={font}
                            type="button"
                            onClick={() => {
                              setFontWeight(font);
                              setShowFontDropdown(false);
                              onShowToast(`Font changed to: ${font}`);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs transition-colors duration-100 font-semibold truncate cursor-pointer ${
                              fontWeight === font
                                ? 'bg-[#FFE7D6] text-[#F35D00] font-extrabold'
                                : 'text-zinc-750 hover:bg-[#FFE7D6] hover:text-[#F35D00]'
                            }`}
                            style={{ fontFamily: font }}
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

          {/* SECTION 4: LOGIN SCREEN SETUP */}
          <div className={`${isPremium ? 'bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6' : 'bg-[#F2F2F2] border border-gray-400 p-4'}`} id="section-login-screen-setup">
            <div className="mb-6 pb-3 border-b border-zinc-100 text-left">
              <h2 className={`${isPremium ? 'text-sm font-bold text-zinc-800 tracking-wide font-sans' : 'text-xs font-bold text-black'}`}>Login screen setup</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6 text-left">
              
              {/* Field: Background Image */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} self-start pt-2`}>
                Background image
              </div>
              <div className="md:col-span-8" id="login-bg-container">
                <input 
                  type="file" 
                  ref={loginBgInputRef} 
                  onChange={handleLoginBgUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <div 
                  onClick={() => loginBgInputRef.current?.click()}
                  className={`${
                    isPremium
                      ? 'border border-dashed border-zinc-300 hover:border-[#F35D00] bg-white rounded-xl p-3.5 transition-all text-center flex items-center justify-between cursor-pointer group shadow-3xs w-full'
                      : 'border border-dashed border-gray-400 hover:border-black p-3 bg-white text-center flex items-center justify-between cursor-pointer w-full'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Paperclip className={`w-4 h-4 shrink-0 ${isPremium ? 'text-[#F35D00]' : 'text-zinc-700'}`} />
                    <span className={`text-[12px] font-bold truncate ${isPremium ? 'text-zinc-700 group-hover:text-[#F35D00]' : 'text-black'}`}>
                      Click to attach login background image
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium shrink-0 font-mono">max. 16 MB</span>
                </div>
              </div>

              {/* Field: Main Title */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                Main title
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  value={loginTitle}
                  onChange={(e) => setLoginTitle(e.target.value)}
                  placeholder="Enter main title"
                  className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                />
              </div>

              {/* Field: Sub-title */}
              <div className={`md:col-span-4 ${isPremium ? 'text-[11px] font-bold text-[#6B7280] tracking-wide font-sans' : 'text-[11px] font-medium text-zinc-500'} flex items-center`}>
                Sub-title
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  value={loginSubtitle}
                  onChange={(e) => setLoginSubtitle(e.target.value)}
                  placeholder="Enter sub-title"
                  className={`${isPremium ? 'w-full bg-white border border-[#E5E7EB] rounded-lg px-4 h-11 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 font-semibold transition-colors' : 'w-full bg-white border border-gray-400 h-11 px-3 text-xs text-black'}`}
                />
              </div>

            </div>
          </div>

      </div>

    </form>
  );
}
