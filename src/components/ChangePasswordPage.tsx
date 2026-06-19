/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronRight, KeyRound, AlertCircle, CheckCircle2, Save, X } from 'lucide-react';
import { ThemeConfig } from '../types';

interface ChangePasswordPageProps {
  activeTheme: ThemeConfig;
  onCancel: () => void;
}

export function ChangePasswordPage({ activeTheme }: { activeTheme: ThemeConfig }) {
  // Input fields state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Field-specific validation errors
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Success messages style
  const [successMsg, setSuccessMsg] = useState('');

  const validatePassword = () => {
    setOldPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setSuccessMsg('');

    let isValid = true;

    if (!oldPassword) {
      setOldPasswordError('Please enter your old password.');
      isValid = false;
    }

    if (!newPassword) {
      setNewPasswordError('The new password must have at least 12 characters.');
      isValid = false;
    } else {
      if (newPassword.length < 12) {
        setNewPasswordError('The new password must have at least 12 characters.');
        isValid = false;
      } else {
        // Check for special characters ($,!, etc.)
        const specialCharRegex = /[\$!,%@#\^&\*\(\)\_\+\-=\{\}\[\]:;"'<>\?\/~`\.\\|]/;
        if (!specialCharRegex.test(newPassword)) {
          setNewPasswordError('The new password must contain at least 1 special character ($, !, %, etc.).');
          isValid = false;
        } else {
          // Check forbidden characters: +, &, "
          const forbiddenRegex = /[\+&"]/;
          if (forbiddenRegex.test(newPassword)) {
            setNewPasswordError('Please avoid using the following characters in your password: +, &, ".');
            isValid = false;
          } else if (newPassword === oldPassword) {
            setNewPasswordError('Your new password cannot be the same as your old password.');
            isValid = false;
          }
        }
      }
    }

    if (newPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError('Confirm password does not match your new password.');
      isValid = false;
    }

    return isValid;
  };

  const handleApplyChange = () => {
    if (!validatePassword()) return;

    // Simulate successful password rotation on current screen
    setSuccessMsg('Your password has been changed successfully. Configuration updated.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCancel = () => {
    // Keep user on screen, simply clear the fields and error states immediately
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOldPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyChange();
  };

  return (
    <div className="space-y-8 pb-20 select-none animate-fadeIn" id="change-password-page-root">
      
      {/* Title & Actions Bar matching Event Manager layout style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: activeTheme.borderColor }}>
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium tracking-wide" id="cp-breadcrumb">
            <span>EMS</span>
            <ChevronRight className="w-3 nav-arrow h-3 text-neutral-300" style={{ color: '#d1d5db' }} />
            <span className="font-semibold" style={{ color: activeTheme.primaryColor }}>Change password</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mt-2 hover:brightness-110" style={{ color: activeTheme.textColor }}>
            Change password
          </h2>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={handleCancel}
            className="h-8 px-4 border border-neutral-250 hover:bg-neutral-50 rounded-xl text-xs text-neutral-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer bg-white transition-all shadow-xs"
            style={{ borderColor: activeTheme.borderColor }}
          >
            <X className="w-4 h-4 text-neutral-400" />
            <span>Cancel</span>
          </button>
          
          <button 
            type="button"
            onClick={handleApplyChange}
            className="h-8 px-4 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            <Save className="w-4 h-4" />
            <span>Change password</span>
          </button>
        </div>
      </div>

      {/* Styled Card Component matching standard Event Manager form widgets style */}
      <div className="bg-white rounded-2xl border shadow-xs overflow-hidden" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }} id="cp-form-container">
        
        {/* Title Bar matching Event Manager section headings */}
        <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
          <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
            Set your new password
          </h3>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">

          {successMsg && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold animate-fadeIn">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Old Password Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start py-1">
              <label className="text-xs font-bold text-neutral-600 font-sans md:col-span-1 pt-2" style={{ color: activeTheme.textColor }}>
                Old password: <span className="text-red-500 font-extrabold">*</span>
              </label>
              <div className="md:col-span-2 space-y-1.5">
                <input 
                  type="password"
                  placeholder="Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`w-full max-w-xl h-9 px-3 border rounded-lg text-xs focus:ring-1 focus:outline-none bg-neutral-50/20 text-neutral-800 font-normal ${
                    oldPasswordError 
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                      : 'border-neutral-200 focus:ring-neutral-400 focus:border-neutral-400'
                  }`}
                  style={{ color: activeTheme.textColor }}
                />
                {oldPasswordError && (
                  <p className="text-[11px] text-red-600 font-semibold animate-fadeIn flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 inline text-red-500 flex-shrink-0" />
                    <span>{oldPasswordError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* New Password Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start py-1">
              <label className="text-xs font-bold text-neutral-600 font-sans md:col-span-1 pt-2" style={{ color: activeTheme.textColor }}>
                New password: <span className="text-red-500 font-extrabold">*</span>
              </label>
              <div className="md:col-span-2 space-y-1.5">
                <input 
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full max-w-xl h-9 px-3 border rounded-lg text-xs focus:ring-1 focus:outline-none bg-neutral-50/20 text-neutral-800 font-normal ${
                    newPasswordError 
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                      : 'border-neutral-200 focus:ring-neutral-400 focus:border-neutral-400'
                  }`}
                  style={{ color: activeTheme.textColor }}
                />
                {newPasswordError && (
                  <p className="text-[11px] text-red-600 font-semibold animate-fadeIn flex items-center gap-1 max-w-xl">
                    <AlertCircle className="w-3.5 h-3.5 inline text-red-500 flex-shrink-0" />
                    <span>{newPasswordError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Confirm Password Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start py-1">
              <label className="text-xs font-bold text-neutral-600 font-sans md:col-span-1 pt-2" style={{ color: activeTheme.textColor }}>
                Confirm new password: <span className="text-red-500 font-extrabold">*</span>
              </label>
              <div className="md:col-span-2 space-y-1.5">
                <input 
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full max-w-xl h-9 px-3 border rounded-lg text-xs focus:ring-1 focus:outline-none bg-neutral-50/20 text-neutral-800 font-normal ${
                    confirmPasswordError 
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                      : 'border-neutral-200 focus:ring-neutral-400 focus:border-neutral-400'
                  }`}
                  style={{ color: activeTheme.textColor }}
                />
                {confirmPasswordError && (
                  <p className="text-[11px] text-red-600 font-semibold animate-fadeIn flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 inline text-red-500 flex-shrink-0" />
                    <span>{confirmPasswordError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Special Instruction Label */}
            <div className="pt-2">
              <p className="text-[11px] text-neutral-500 font-normal leading-relaxed italic max-w-3xl">
                The password must have at least 12 characters, of them 1 special characters ($,!, etc.). Please avoid using the following characters: +, &amp;, ". Please ensure that the password is not trivial, does not contain your company name and is not part of your email address.
              </p>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
