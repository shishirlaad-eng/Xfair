/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Search, Globe, ChevronDown, User, ShieldAlert,
  MessageSquare, FileCheck, CheckCircle, ExternalLink, Settings 
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface HeaderProps {
  activePage: string;
  activeTheme: ThemeConfig;
  currentUser: { name: string; role: string; email: string; avatar: string };
  selectedTenant: string;
  onTenantChange: (tenant: string) => void;
}

export function Header({ activePage, activeTheme, currentUser, selectedTenant, onTenantChange }: HeaderProps) {
  const [showScopeSelector, setShowScopeSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [lang, setLang] = useState('English (US)');
  const [searchQuery, setSearchQuery] = useState('');

  const langFlags: Record<string, string> = {
    'English (US)': '🇺🇸',
    'English (UK)': '🇬🇧',
    'Deutsch': '🇩🇪',
    'Français': '🇫🇷',
    'Español': '🇪🇸',
  };

  const notifications = [
    { id: 1, title: 'Compliance Complete', text: 'Steven Terry approved March 4 attendance.', type: 'success', time: '10m ago' },
    { id: 2, title: 'Branding Refreshed', text: 'Corporate palette compiled into active stylesheet.', type: 'info', time: '1h ago' },
    { id: 3, title: 'PDF Invoice Dispatch', text: 'Hotel room bookings voucher generated.', type: 'alert', time: '3h ago' }
  ];

  return (
    <header 
      className="sticky top-0 z-20 h-16 border-b bg-white/95 backdrop-blur flex items-center justify-between px-6 shadow-xs"
      style={{ 
        backgroundColor: `${activeTheme.cardColor}F0`, // Transparent card backdrop
        borderColor: activeTheme.borderColor,
        fontFamily: activeTheme.fontFamily
      }}
    >
      
      {/* Left Pane Spacer (Search removed) */}
      <div className="flex-1" />

      {/* Right Controls Row */}
      <div className="flex items-center gap-4">
        
        {/* Tenant Event selector */}
        <div className="hidden sm:flex items-center gap-2 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowScopeSelector(!showScopeSelector);
                setShowLanguageSelector(false);
                setShowNotifications(false);
              }}
              className="px-3 py-1.5 border border-neutral-200 rounded-xl bg-white text-xs font-semibold text-neutral-700 cursor-pointer flex items-center gap-1.5 hover:bg-neutral-50 hover:border-neutral-350 transition-all shadow-xs"
              style={{ fontFamily: activeTheme.fontFamily }}
            >
              {selectedTenant === 'Regional Office Switzerland' && (
                <span className="text-sm leading-none">🇨🇭</span>
              )}
              <span>{selectedTenant}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                showScopeSelector ? 'rotate-180' : ''
              }`} />
            </button>

            <AnimatePresence>
              {showScopeSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
                  className="absolute left-0 mt-2 w-60 bg-white border border-neutral-200/80 rounded-2xl shadow-xl z-50 py-2 text-xs origin-top-left"
                  style={{ fontFamily: activeTheme.fontFamily }}
                >
                  {[
                    'Bauma 2028',
                    'Munich High Tech Arena',
                    'Regional Office Switzerland'
                  ].map((tenant) => (
                    <button
                      key={tenant}
                      type="button"
                      onClick={() => {
                        onTenantChange(tenant);
                        setShowScopeSelector(false);
                      }}
                      className="w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors cursor-pointer font-semibold block truncate"
                    >
                      {tenant === 'Regional Office Switzerland' && (
                        <span className="text-sm leading-none">🇨🇭</span>
                      )}
                      <span>{tenant === 'Bauma 2028' ? 'Bauma 2028 (Trade Fair)' : tenant}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Language selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowLanguageSelector(!showLanguageSelector);
              setShowScopeSelector(false);
              setShowNotifications(false);
            }}
            className="px-3 py-1.5 border border-neutral-200 rounded-xl bg-white text-xs font-semibold text-neutral-700 cursor-pointer flex items-center gap-1.5 hover:bg-neutral-50 hover:border-neutral-350 transition-all shadow-xs"
            style={{ fontFamily: activeTheme.fontFamily }}
          >
            <span className="text-sm leading-none">{langFlags[lang] || '🇺🇸'}</span>
            <span>{lang}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
              showLanguageSelector ? 'rotate-180' : ''
            }`} />
          </button>

          <AnimatePresence>
            {showLanguageSelector && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
                className="absolute right-0 mt-2 w-42 bg-white border border-neutral-200/80 rounded-2xl shadow-xl z-50 py-2 text-xs origin-top-right"
                style={{ fontFamily: activeTheme.fontFamily }}
              >
                {['English (UK)', 'English (US)', 'Deutsch', 'Français', 'Español'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setLang(l);
                      setShowLanguageSelector(false);
                    }}
                    className="w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors cursor-pointer font-semibold block truncate"
                  >
                    <span className="text-sm leading-none">{langFlags[l]}</span>
                    <span>{l}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Notification Bell */}
        <div className="relative">
          <div
            className="p-2 rounded-xl text-neutral-500 relative cursor-default select-none"
          >
            <Bell className="w-4.5 h-4.5" />
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </div>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
                className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs origin-top-right"
                style={{ fontFamily: activeTheme.fontFamily }}
              >
                <div className="p-3 bg-neutral-900 text-white font-semibold flex justify-between items-center">
                  <span>Roster Alerts Stream</span>
                  <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-neutral-300">3 Alerts</span>
                </div>
                <div className="divide-y divide-neutral-150">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 bg-white hover:bg-neutral-50/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-neutral-800 block truncate max-w-[170px]">{n.title}</span>
                        <span className="text-[9px] text-neutral-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1 leading-normal">{n.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t text-center bg-neutral-50">
                  <button 
                    type="button" 
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] font-bold text-orange-600 hover:underline cursor-pointer"
                    style={{ color: activeTheme.primaryColor }}
                  >
                    Dismiss All Alerts
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Static Profile Display without dropdown or designation */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-lg object-cover border border-neutral-200"
            referrerPolicy="no-referrer"
          />
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-neutral-800 leading-none block">{currentUser.name}</span>
          </div>
        </div>

      </div>

    </header>
  );
}
