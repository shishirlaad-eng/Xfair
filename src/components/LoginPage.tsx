/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle, ArrowLeft, Send, Smartphone, RefreshCw, KeyRound, Info, ChevronDown, Check, X, ChevronRight } from 'lucide-react';
import { ThemeConfig } from '../types';

const TRANSLATIONS = {
  us: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    logInBtn: 'Log In',
    loggingIn: 'Logging in...',
    recoverTitle: 'Recover password',
    send: 'Send',
    sending: 'Sending...',
    backToLogin: 'Back to Login',
    successMsgTitle: 'A password recovery link has been sent to your email address.',
    successMsgSub: 'Please follow the link and enter your new password to gain access to the system.',
    imprint: 'Imprint',
    privacy: 'Data Privacy',
    changePassHeader: 'Change password',
    setNewPassTitle: 'Set your new password',
    newPassLabel: 'New password',
    confirmPassLabel: 'Confirm new password',
    newPassPlaceholder: 'New Password',
    confirmPassPlaceholder: 'Confirm password',
    passRequirementMsg: 'The password must have at least 12 characters, of them 1 special characters ($,!. etc.). Please avoid using the following characters: +, &, ". Please ensure that the password is not trivial, does not contain your company name and is not part of your email address.',
    changePasswordSuccessMsg: 'Your password has been reset successfully. You can now log in with your new password.',
  },
  uk: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    logInBtn: 'Log In',
    loggingIn: 'Logging in...',
    recoverTitle: 'Recover password',
    send: 'Send',
    sending: 'Sending...',
    backToLogin: 'Back to Login',
    successMsgTitle: 'A password recovery link has been sent to your email address.',
    successMsgSub: 'Please follow the link and enter your new password to gain access to the system.',
    imprint: 'Imprint',
    privacy: 'Data Privacy',
    changePassHeader: 'Change password',
    setNewPassTitle: 'Set your new password',
    newPassLabel: 'New password',
    confirmPassLabel: 'Confirm new password',
    newPassPlaceholder: 'New Password',
    confirmPassPlaceholder: 'Confirm password',
    passRequirementMsg: 'The password must have at least 12 characters, of them 1 special characters ($,!. etc.). Please avoid using the following characters: +, &, ". Please ensure that the password is not trivial, does not contain your company name and is not part of your email address.',
    changePasswordSuccessMsg: 'Your password has been reset successfully. You can now log in with your new password.',
  },
  de: {
    login: 'Anmelden',
    email: 'E-Mail',
    password: 'Passwort',
    forgotPassword: 'Kennwort vergessen?',
    logInBtn: 'Anmelden',
    loggingIn: 'Anmeldung läuft...',
    recoverTitle: 'Recover your password', // Matches matching recover your password in screenshot
    send: 'Send', // User requested send button labeled "Send"
    sending: 'Senden...',
    backToLogin: 'Zurück zur Anmeldung',
    successMsgTitle: 'A password recovery link has been sent to your email address.',
    successMsgSub: 'Please follow the link and enter your new password to gain access to the system.',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    changePassHeader: 'Kennwort ändern',
    setNewPassTitle: 'Setzen Sie Ihr neues Passwort',
    newPassLabel: 'Neues Passwort',
    confirmPassLabel: 'Neues Passwort bestätigen',
    newPassPlaceholder: 'Neues Passwort',
    confirmPassPlaceholder: 'Passwort bestätigen',
    passRequirementMsg: 'Das Passwort muss mindestens 12 Zeichen enthalten, davon 1 Sonderzeichen ($, !, etc.). Bitte vermeiden Sie folgende Zeichen: +, &, ". Bitte stellen Sie sicher, dass das Passwort nicht trivial ist, nicht den Namen Ihres Unternehmens enthält und nicht Teil Ihrer E-Mail-Adresse ist.',
    changePasswordSuccessMsg: 'Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.',
  },
};

interface LoginPageProps {
  onLoginSuccess: (role: string, email: string) => void;
  activeTheme: ThemeConfig;
}

export function LoginPage({ onLoginSuccess, activeTheme }: LoginPageProps) {
  const [email, setEmail] = useState('admin@xfair.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('Munich HQ - Event Hub');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState<'us' | 'uk' | 'de'>('us');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const t = TRANSLATIONS[selectedLanguage];

  // Redesigned Forgot Password States
  const [viewMode, setViewMode] = useState<'login' | 'forgot-password' | 'otp-verification' | 'success' | 'reset-password'>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'otp'>('email');
  const [isProcessingRecovery, setIsProcessingRecovery] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);

  // New Password Reset core states
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showNewResetPassword, setShowNewResetPassword] = useState(false);
  const [showConfirmResetPassword, setShowConfirmResetPassword] = useState(false);

  // Resend Countdown controller
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDemoFill = (role: 'admin' | 'manager' | 'technician') => {
    if (role === 'admin') {
      setEmail('admin@xfair.com');
      setPassword('adminPass2026!');
      setSelectedTenant('Munich HQ - Event Hub');
    } else if (role === 'manager') {
      setEmail('s.terry@xfair.com');
      setPassword('terryManager2028');
      setSelectedTenant('Bauma 2028 - Regional Office');
    } else {
      setEmail('tech.support@xfair.dev');
      setPassword('techXfairSecure');
      setSelectedTenant('Mobile Device Pool #4');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate premium verification flow
    setTimeout(() => {
      setIsSubmitting(false);
      setShowFeedback(true);
      setTimeout(() => {
        onLoginSuccess(
          email.includes('admin') ? 'Administrator' : 'Regional Manager',
          email
        );
      }, 700);
    }, 1200);
  };

  const handleSSOLogin = () => {
    setIsSubmitting(true);
    // Simulate premium SSO authentication flow
    setTimeout(() => {
      setIsSubmitting(false);
      setShowFeedback(true);
      setTimeout(() => {
        onLoginSuccess(
          'SSO Authorized User',
          email || 'sso.user@xfair.com'
        );
      }, 700);
    }, 1200);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;

    setIsProcessingRecovery(true);
    setTimeout(() => {
      setIsProcessingRecovery(false);
      setViewMode('success');
      setCountdown(60);
    }, 1300);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) return;

    setIsProcessingRecovery(true);
    setTimeout(() => {
      setIsProcessingRecovery(false);
      setViewMode('success');
    }, 1200);
  };

  const handleResetSubmit = () => {
    setResetError('');
    setResetSuccess(false);

    if (!newResetPassword) {
      setResetError(selectedLanguage === 'de' ? 'Bitte geben Sie ein neues Passwort ein.' : 'The new password must have at least 12 characters.');
      return;
    }

    if (newResetPassword.length < 12) {
      setResetError(selectedLanguage === 'de' ? 'Das neue Passwort muss mindestens 12 Zeichen enthalten.' : 'The new password must have at least 12 characters.');
      return;
    }

    // Check for special characters ($,!, etc.)
    const specialCharRegex = /[\$!,%@#\^&\*\(\)\_\+\-=\{\}\[\]:;"'<>\?\/~`\.\\|]/;
    if (!specialCharRegex.test(newResetPassword)) {
      setResetError(selectedLanguage === 'de' ? 'Das neue Passwort muss mindestens 1 Sonderzeichen enthalten ($, !, %, etc.).' : 'The new password must contain at least 1 special character ($, !, %, etc.).');
      return;
    }

    // Check forbidden characters: +, &, "
    const forbiddenRegex = /[\+&"]/;
    if (forbiddenRegex.test(newResetPassword)) {
      setResetError(selectedLanguage === 'de' ? 'Bitte vermeiden Sie folgende Zeichen in Ihrem Passwort: +, &, ".' : 'Please avoid using the following characters in your password: +, &, ".');
      return;
    }

    if (newResetPassword !== confirmResetPassword) {
      setResetError(selectedLanguage === 'de' ? 'Passwort-Bestätigung stimmt nicht mit dem neuen Passwort überein.' : 'Confirm password does not match your new password.');
      return;
    }

    setResetSuccess(true);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val)) && val !== '') return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto-focus next field
    if (val !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otpCode[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const triggerResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    // Mimic soft reset
  };

  // Code deactivated - we now render the reset-password screen inside the right content pane split-layout.
  if (viewMode === 'reset-password' && false) {
    return (
      <div 
        className="min-h-screen flex flex-col bg-[#F8FAF9] transition-colors duration-300 animate-fadeIn"
        style={{ fontFamily: activeTheme.fontFamily }}
        id="reset-password-full-page"
      >
        {/* 1. Header (White background bar, 56px height) */}
        <header className="h-14 bg-white border-b border-neutral-200 px-6 sm:px-12 md:px-24 flex items-center justify-between z-15 select-none font-sans">
          {/* Logo matching corporate spec - click to go back to login */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
            onClick={() => {
              setNewResetPassword('');
              setConfirmResetPassword('');
              setResetError('');
              setResetSuccess(false);
              setViewMode('login');
            }}
            title="Back to login"
          >
            <img 
              src="/Logo/ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png"
              alt="XFAIR Logo"
              className="w-[150px] h-[50px] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right Language Selection & Info */}
          <div className="flex items-center gap-4">
            {/* Info Icon (matching Login screen) */}
            <div
              className="p-2 border border-neutral-200 rounded-full bg-white shadow-2xs text-neutral-400 select-none cursor-pointer hover:bg-neutral-50 transition-colors"
              style={{ borderColor: activeTheme.borderColor }}
              onClick={() => setIsInfoOpen(true)}
              title="System Information"
            >
              <Info className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Language Switcher Dropdown (identical to Login screen) */}
            <div className="relative" ref={langDropdownRef} id="reset-lang-dropdown-wrapper">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 hover:border-neutral-300 rounded-full bg-white hover:bg-neutral-50 transition-colors shadow-2xs font-semibold text-xs text-neutral-700 cursor-pointer"
                style={{ borderColor: activeTheme.borderColor }}
              >
                <img 
                  src={selectedLanguage === 'us' ? '/Public/us.webp' : selectedLanguage === 'uk' ? '/Public/uk.png' : '/Public/de.png'} 
                  alt="" 
                  className="w-4.5 h-3 object-cover rounded-xs"
                />
                <span>{selectedLanguage === 'us' ? 'English (US)' : selectedLanguage === 'uk' ? 'English (UK)' : 'Deutsch'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    key="language-menu-reset"
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-2xl shadow-lg py-2 z-50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => { setSelectedLanguage('us'); setIsLangDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                        selectedLanguage === 'us' 
                          ? 'text-white font-bold' 
                          : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                      }`}
                      style={{ backgroundColor: selectedLanguage === 'us' ? activeTheme.primaryColor : undefined }}
                    >
                      <div className="flex items-center gap-2">
                        <img src="/Public/us.webp" alt="" className="w-5 h-3.5 object-cover rounded-xs border border-white/20" />
                        <span>English (US)</span>
                      </div>
                      {selectedLanguage === 'us' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSelectedLanguage('uk'); setIsLangDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                        selectedLanguage === 'uk' 
                          ? 'text-white font-bold' 
                          : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                      }`}
                      style={{ backgroundColor: selectedLanguage === 'uk' ? activeTheme.primaryColor : undefined }}
                    >
                      <div className="flex items-center gap-2">
                        <img src="/Public/uk.png" alt="" className="w-5 h-3.5 object-cover rounded-xs border border-white/20" />
                        <span>English (UK)</span>
                      </div>
                      {selectedLanguage === 'uk' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSelectedLanguage('de'); setIsLangDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                        selectedLanguage === 'de' 
                          ? 'text-white font-bold' 
                          : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                      }`}
                      style={{ backgroundColor: selectedLanguage === 'de' ? activeTheme.primaryColor : undefined }}
                    >
                      <div className="flex items-center gap-2">
                        <img src="/Public/de.png" alt="" className="w-5 h-3.5 object-cover rounded-xs border border-white/20" />
                        <span>Deutsch</span>
                      </div>
                      {selectedLanguage === 'de' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 2. Change password title bar matching Event Manager header / toolbar layout & buttons (Breadcrumbs removed!) */}
        <div className="border-b bg-white py-6 px-6 sm:px-12 md:px-24 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none" style={{ borderColor: activeTheme.borderColor }}>
          <div>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 font-sans" style={{ color: activeTheme.textColor }}>
              {t.changePassHeader}
            </h2>
          </div>

          {/* Action Toolbar Button exactly matching the Save button placement and style in Create Event */}
          <div className="flex items-center gap-2.5">
            <button 
              type="submit"
              form="password-reset-main-form"
              className="h-8 px-4 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 active:scale-[0.98] select-none cursor-pointer"
              style={{ backgroundColor: activeTheme.primaryColor }}
              id="top-custom-submit-btn"
            >
              <KeyRound className="w-4 h-4" />
              <span>{t.changePassHeader}</span>
            </button>
          </div>
        </div>

        {/* 3. Main Form Workspace container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 md:px-24 py-12 md:py-16">
          <div className="bg-white rounded-2xl border shadow-xs overflow-hidden max-w-5xl" style={{ backgroundColor: activeTheme.cardColor, borderColor: activeTheme.borderColor }}>
            {/* Title Bar header */}
            <div className="px-5 py-2.5 border-b bg-neutral-50/50 flex items-center justify-between" style={{ borderColor: activeTheme.borderColor }}>
              <h3 className="font-sans font-bold text-xs tracking-wider text-neutral-800" style={{ color: activeTheme.textColor }}>
                {t.setNewPassTitle}
              </h3>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8">
              {resetSuccess ? (
                <div 
                  className="p-6 rounded-2xl border border-emerald-250 bg-emerald-50 text-emerald-800 text-sm font-semibold flex flex-col gap-4 animate-fadeIn"
                  id="reset-success-box"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{t.changePasswordSuccessMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewResetPassword('');
                      setConfirmResetPassword('');
                      setResetError('');
                      setResetSuccess(false);
                      setViewMode('login');
                    }}
                    className="px-5 py-2 rounded-xl text-white text-xs font-bold hover:brightness-105 active:scale-98 transition-all cursor-pointer shadow-xs self-start"
                    style={{ backgroundColor: activeTheme.primaryColor }}
                  >
                    {t.backToLogin}
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleResetSubmit(); }}
                  className="space-y-6"
                  id="password-reset-main-form"
                >
                  {resetError && (
                    <div 
                      className="p-5 rounded-lg border border-red-200 bg-[#FFF0F0] text-red-700 text-xs font-semibold border-l-[6px] border-l-[#E52222] animate-fadeIn mb-6"
                      id="reset-password-error-box"
                    >
                      <div className="font-bold text-sm text-[#E52222] mb-1.5 font-sans">
                        {selectedLanguage === 'de' ? 'Bitte korrigieren Sie Ihre Eingaben' : 'Please correct your entries'}
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[#E52222] font-semibold font-sans text-xs">
                        <li>{resetError}</li>
                      </ul>
                    </div>
                  )}

                  {/* Set Your New Password section header */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold tracking-tight font-sans uppercase text-neutral-500 mb-2" style={{ color: activeTheme.primaryColor }}>
                      {t.setNewPassTitle}
                    </h4>
                  </div>

                  {/* Form fields layout aligned cleanly */}
                  <div className="space-y-5">
                    
                    {/* Row 1: New Password */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
                      <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                        {selectedLanguage === 'de' ? 'Neues Passwort' : 'New password'}: <span className="text-red-500 font-bold">*</span>
                      </span>
                      <div className="md:col-span-3">
                        <input
                          type="password"
                          placeholder={t.newPassPlaceholder}
                          value={newResetPassword}
                          onChange={(e) => {
                            setNewResetPassword(e.target.value);
                            setResetError('');
                          }}
                          className="w-full h-9 max-w-2xl px-3 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-white text-neutral-800 font-normal focus:outline-none text-xs transition-colors shadow-2xs"
                          style={{ color: activeTheme.textColor }}
                          required
                          id="reset-new-password-input"
                        />
                      </div>
                    </div>

                    {/* Row 2: Confirm Password */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
                      <span className="text-xs font-bold text-neutral-600 font-sans md:col-span-1" style={{ color: activeTheme.textColor }}>
                        {selectedLanguage === 'de' ? 'Neues Passwort bestätigen' : 'Confirm new password'}: <span className="text-red-500 font-bold">*</span>
                      </span>
                      <div className="md:col-span-3">
                        <input
                          type="password"
                          placeholder={t.confirmPassPlaceholder}
                          value={confirmResetPassword}
                          onChange={(e) => {
                            setConfirmResetPassword(e.target.value);
                            setResetError('');
                          }}
                          className="w-full h-9 max-w-2xl px-3 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 bg-white text-neutral-800 font-normal focus:outline-none text-xs transition-colors shadow-2xs"
                          style={{ color: activeTheme.textColor }}
                          required
                          id="reset-confirm-password-input"
                        />
                      </div>
                    </div>

                    {/* Rules instruction below inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1.5">
                      <div className="hidden md:block" />
                      <div className="md:col-span-3 max-w-2xl text-[11px] text-neutral-600 font-medium leading-relaxed font-sans italic opacity-85">
                        {t.passRequirementMsg}
                      </div>
                    </div>

                    {/* Submit Button aligned to the right inside grid workspace matching error screenshot */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
                      <div className="hidden md:block" />
                      <div className="md:col-span-3 flex justify-end max-w-2xl">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded text-white font-bold text-xs shadow-xs transition-all hover:brightness-105 active:scale-[0.98] select-none cursor-pointer flex items-center justify-center gap-1.5"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                          id="submit-password-reset-btn"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          {t.changePassHeader}
                        </button>
                      </div>
                    </div>

                  </div>
                </form>
              )}
            </div>
          </div>
        </main>

        {/* 4. Bottom Crowds Graphic and Footer (Visible crowd image) */}
        <div className="relative mt-auto w-full">
          <div 
            className="h-28 bg-cover bg-bottom opacity-75 select-none border-t border-neutral-200"
            style={{ 
              backgroundImage: `url(${activeTheme.loginBackgroundUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop'})` 
            }}
          />
          <div className="py-4.5 bg-[#F6F6F6] border-t border-neutral-250 flex justify-center gap-8 text-[11px] text-neutral-400 select-none">
            <a href="#imprint" onClick={(e) => e.preventDefault()} className="hover:text-neutral-600 transition-colors uppercase font-mono tracking-wide">{t.imprint}</a>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-neutral-600 transition-colors uppercase font-mono tracking-wide">{t.privacy}</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F6F6F6] transition-colors duration-300" style={{ backgroundColor: activeTheme.backgroundColor, fontFamily: activeTheme.fontFamily }}>
      {/* Brand & Marketing Left Pane */}
      <div className="md:w-1/2 bg-neutral-900 flex flex-col justify-between p-8 md:p-16 relative overflow-hidden text-white min-h-[350px] md:min-h-screen">
        {/* Background abstract element */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img 
            src={activeTheme.loginBackgroundUrl} 
            alt="Corporate architecture" 
            className="w-full h-full object-cover filter grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Absolute Glowing Gradient Accent */}
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${activeTheme.primaryColor} 0%, transparent 70%)` }}
        />

        {/* Clickable Left Logo to return to login */}
        <div 
          className="relative z-10 flex items-center gap-3.5 cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
          onClick={() => {
            setNewResetPassword('');
            setConfirmResetPassword('');
            setResetError('');
            setResetSuccess(false);
            setViewMode('login');
          }}
          title="Back to login"
          id="left-brand-logo-wrapper"
        >
          <img 
            src="/Logo/ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png"
            alt="XFAIR Logo"
            className="w-[210px] h-[70px] object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 my-auto py-12 md:py-0">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-orange-400 font-semibold mb-6" style={{ color: activeTheme.primaryColor }}>
            <ShieldCheck className="w-4 h-4" /> XFAIR GMBH
          </span>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight max-w-md">
            {activeTheme.loginMainTitle || "Next-gen event orchestration starts here."}
          </h1>
          <p className="mt-4 text-neutral-400 text-sm md:text-base max-w-sm font-light leading-relaxed">
            {activeTheme.loginSubTitle || "Manage attendance calendars, registration types, hotel lists, and branding systems in a simplified premium workspace."}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500 font-light pt-4 border-t border-white/10">
          <a href="#imprint" className="hover:text-neutral-300 transition-colors">Imprint</a>
          <a href="#privacy" className="hover:text-neutral-300 transition-colors">Data Privacy</a>
        </div>
      </div>

      {/* Right Content Pane (Swaps dynamically depending on Forgot Password option) */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-16 relative" id="login-right-pane">
        
        {/* Top Header Controls: Language switcher & Info */}
        <div className="absolute top-6 right-6 md:top-8 md:right-12 flex items-center gap-3 z-30" id="login-header-controls">
          {/* Info Icon (Unclickable) */}
          <div
            className="p-2 border border-neutral-200 rounded-full bg-white shadow-2xs text-neutral-400 select-none"
            style={{ borderColor: activeTheme.borderColor }}
            title="System Information"
            id="login-info-btn"
          >
            <Info className="w-4 h-4" />
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langDropdownRef} id="login-lang-dropdown-wrapper">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 hover:border-neutral-300 rounded-full bg-white hover:bg-neutral-50 transition-colors shadow-2xs font-semibold text-xs text-neutral-700 cursor-pointer"
              style={{ borderColor: activeTheme.borderColor }}
              id="login-lang-trigger"
            >
              <img 
                src={selectedLanguage === 'us' ? '/Public/us.webp' : selectedLanguage === 'uk' ? '/Public/uk.png' : '/Public/de.png'} 
                alt="" 
                className="w-4.5 h-3 object-cover rounded-xs"
              />
              <span>{selectedLanguage === 'us' ? 'English (US)' : selectedLanguage === 'uk' ? 'English (UK)' : 'Deutsch'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div
                  key="language-menu"
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-2xl shadow-lg py-2 z-50 overflow-hidden"
                  id="login-lang-dropdown-menu"
                >
                  <button
                    type="button"
                    onClick={() => { setSelectedLanguage('us'); setIsLangDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                      selectedLanguage === 'us' 
                        ? 'text-white font-bold' 
                        : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                    }`}
                    style={{ backgroundColor: selectedLanguage === 'us' ? activeTheme.primaryColor : undefined }}
                    id="lang-option-us"
                  >
                    <div className="flex items-center gap-2">
                      <img src="/Public/us.webp" alt="" className="w-5 h-3.5 object-cover rounded-xs border border-white/20" />
                      <span>English (US)</span>
                    </div>
                    {selectedLanguage === 'us' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedLanguage('uk'); setIsLangDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                      selectedLanguage === 'uk' 
                        ? 'text-white font-bold' 
                        : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                    }`}
                    style={{ backgroundColor: selectedLanguage === 'uk' ? activeTheme.primaryColor : undefined }}
                    id="lang-option-uk"
                  >
                    <div className="flex items-center gap-2">
                      <img src="/Public/uk.png" alt="" className="w-5 h-3.5 object-cover rounded-xs border border-white/20" />
                      <span>English (UK)</span>
                    </div>
                    {selectedLanguage === 'uk' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedLanguage('de'); setIsLangDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                      selectedLanguage === 'de' 
                        ? 'text-white font-bold' 
                        : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                    }`}
                    style={{ backgroundColor: selectedLanguage === 'de' ? activeTheme.primaryColor : undefined }}
                    id="lang-option-de"
                  >
                    <div className="flex items-center gap-2">
                      <img src="/Public/de.png" alt="" className="w-5 h-3.5 object-cover rounded-xs border border-white/20" />
                      <span>Deutsch</span>
                    </div>
                    {selectedLanguage === 'de' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Modal Dialog */}
        <AnimatePresence>
          {isInfoOpen && (
            <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="info-modal-backdrop">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-neutral-100 relative"
                id="info-modal-content"
              >
                <button
                  type="button"
                  onClick={() => setIsInfoOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                  id="close-info-modal-btn"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="text-xl font-bold text-neutral-900 mb-2">XFAIR Event Orchestration</h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-light">
                  Welcome to the XFAIR corporate login and security portal. Here you can configure system modules, event calendars, theme specifications, and registration types.
                </p>
                <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-1.5 text-xs text-neutral-500 font-mono">
                  <div>Version: v3.2.1-prod</div>
                  <div>Environment: Munich HQ Server Pool</div>
                  <div>Security Compliance: ISO 27001 Certified</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInfoOpen(false)}
                  className="mt-6 w-full text-white font-bold py-2.5 rounded-xl transition-all shadow-sm hover:brightness-105 active:scale-[0.99] text-xs cursor-pointer"
                  style={{ backgroundColor: activeTheme.primaryColor }}
                  id="info-modal-confirm-btn"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-md bg-transparent p-4 relative" id="login-inner-box">
          <AnimatePresence mode="wait">
            
            {/* LATEST LOGIN VERIFICATION SCREEN */}
            {viewMode === 'login' && !showFeedback && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                id="login-view-form"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-medium tracking-tight text-neutral-900" style={{ color: activeTheme.textColor }}>
                    {t.login}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" id="login-credentials-form">
                  {/* Email Address */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 tracking-wide mb-2 font-sans" style={{ color: activeTheme.textColor }}>
                      {t.email}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 bg-neutral-50 focus:bg-white transition-all text-neutral-800"
                        style={{ 
                          borderColor: activeTheme.borderColor,
                        }}
                        placeholder="e.g. name@company.com"
                        id="login-email-input"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 tracking-wide mb-2 font-sans" style={{ color: activeTheme.textColor }}>
                      {t.password}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 bg-neutral-50 focus:bg-white transition-all text-neutral-800"
                        style={{ 
                          borderColor: activeTheme.borderColor,
                        }}
                        placeholder="Enter credentials"
                        id="login-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                        id="toggle-password-visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit and Link Container */}
                  <div className="space-y-4 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:brightness-105 active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm"
                      style={{ backgroundColor: activeTheme.primaryColor }}
                      id="login-submit-btn"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          {t.loggingIn}
                        </span>
                      ) : (
                        <>
                          {t.logInBtn}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center">
                      <button 
                        type="button"
                        onClick={() => {
                          setRecoveryEmail(email !== '••••••••••••' ? email : '');
                          setViewMode('forgot-password');
                        }}
                        className="text-xs font-semibold hover:underline transition-colors cursor-pointer"
                        style={{ color: activeTheme.primaryColor }}
                        id="login-forgot-password-link"
                      >
                        {t.forgotPassword}
                      </button>
                    </div>

                    {/* SSO Option */}
                    <div className="pt-2" id="sso-login-section">
                      <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-neutral-200"></div>
                        <span className="flex-shrink mx-4 text-xs font-semibold text-neutral-500 font-sans">
                          {selectedLanguage === 'de' ? 'Mit Single Sign-On anmelden' : 'Log in using Single Sign-On'}
                        </span>
                        <div className="flex-grow border-t border-neutral-200"></div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSSOLogin}
                        disabled={isSubmitting}
                        className="w-full bg-white hover:bg-neutral-50/70 transition-all font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 border shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm font-sans"
                        style={{ 
                          borderColor: activeTheme.primaryColor,
                          color: activeTheme.primaryColor,
                          borderWidth: '1.5px'
                        }}
                        id="sso-sign-on-btn"
                      >
                        <KeyRound className="w-4 h-4" style={{ color: activeTheme.primaryColor }} />
                        <span>{selectedLanguage === 'de' ? 'Anmeldung mit Single Sign-On' : 'Sign on with Single Sign-On'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* REDESIGNED FORGOT PASSWORD PRESETS PANEL */}
            {viewMode === 'forgot-password' && (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                id="forgot-password-view"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-6 transition-colors cursor-pointer"
                  id="forgot-password-back-btn"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t.backToLogin}
                </button>

                <div className="mb-6">
                  <h2 className="text-3xl font-medium tracking-tight text-neutral-900" style={{ color: activeTheme.textColor }}>
                    {t.recoverTitle}
                  </h2>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6" id="forgot-password-form">
                  {/* Registered recovery account field */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 tracking-wide mb-2 font-sans" style={{ color: activeTheme.textColor }}>
                      {t.email}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 bg-neutral-50 focus:bg-white transition-all text-neutral-800"
                        style={{ 
                          borderColor: activeTheme.borderColor,
                        }}
                        placeholder="e.g. name@company.com"
                        id="forgot-password-email-input"
                      />
                    </div>
                  </div>

                  {/* Submission dispatch action */}
                  <button
                    type="submit"
                    disabled={isProcessingRecovery}
                    className="w-full text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:brightness-105 active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm"
                    style={{ backgroundColor: activeTheme.primaryColor }}
                    id="forgot-password-submit-btn"
                  >
                    {isProcessingRecovery ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        {t.sending}
                      </span>
                    ) : (
                      <>
                        {t.send}
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* OTP VERIFICATION VIEW (Option B) */}
            {viewMode === 'otp-verification' && (
              <motion.div
                key="otp-verification"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                id="otp-verification-view"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('forgot-password')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-6 transition-colors cursor-pointer"
                  id="otp-verification-method-btn"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Method
                </button>

                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-neutral-100 rounded-full text-[10px] font-bold text-neutral-600 mb-2">
                    <KeyRound className="w-3 h-3 text-neutral-500" /> INSTANT TFA
                  </span>
                  <h2 className="text-3xl font-medium tracking-tight text-neutral-900" style={{ color: activeTheme.textColor }}>
                    Enter Security Code
                  </h2>
                  <p className="text-sm text-neutral-500 mt-2 font-light leading-relaxed">
                    We've sent a 6-digit verification code to <strong className="text-neutral-700">{recoveryEmail || 'your email'}</strong>. Enter the OTP code below.
                  </p>
                </div>

                <form onSubmit={handleOtpVerify} className="space-y-6" id="otp-form">
                  {/* Digital OTP input blocks */}
                  <div className="flex justify-between gap-2 py-2">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-bold rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-neutral-50 text-neutral-800 focus:bg-white transition-all shadow-2xs"
                        style={{ borderColor: activeTheme.borderColor }}
                      />
                    ))}
                  </div>

                  {/* Submit verify */}
                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isProcessingRecovery || otpCode.join('').length < 6}
                      className="w-full text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:brightness-105 active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm"
                      style={{ backgroundColor: activeTheme.primaryColor }}
                      id="otp-submit-btn"
                    >
                      {isProcessingRecovery ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Verifying code...
                        </span>
                      ) : (
                        <>
                          Verify Security PIN
                          <CheckCircle className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={triggerResend}
                        disabled={countdown > 0}
                        className={`text-xs font-semibold inline-flex items-center gap-1.5 transition-all text-neutral-600 ${
                          countdown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'
                        }`}
                        style={{ color: countdown === 0 ? activeTheme.primaryColor : undefined }}
                        id="otp-resend-btn"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isProcessingRecovery ? 'animate-spin' : ''}`} />
                        {countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Security Code'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* SUCCESS CONFIRMATION PANEL */}
            {viewMode === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 animate-fade-in"
                id="forgot-password-success-view"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-2 transition-colors cursor-pointer"
                  id="success-back-to-login-btn"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t.backToLogin}
                </button>

                <div className="mb-4">
                  <h2 className="text-3xl font-medium tracking-tight text-neutral-900" style={{ color: activeTheme.textColor }}>
                    {t.recoverTitle}
                  </h2>
                </div>

                <div 
                  className="p-5 rounded-2xl border text-sm leading-relaxed"
                  style={{ 
                    backgroundColor: `${activeTheme.primaryColor}08`, 
                    color: activeTheme.textColor,
                    borderColor: `${activeTheme.borderColor}`
                  }}
                  id="success-message-box"
                >
                  <p className="font-semibold mb-1.5" style={{ color: activeTheme.primaryColor }}>
                    {t.successMsgTitle}
                  </p>
                  <p className="text-xs opacity-95 font-light leading-relaxed text-neutral-600" style={{ color: activeTheme.textColor }}>
                    {t.successMsgSub}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('reset-password')}
                  className="w-full text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:brightness-105 active:scale-[0.99] cursor-pointer text-xs"
                  style={{ backgroundColor: activeTheme.primaryColor }}
                  id="success-proceed-to-reset-btn"
                >
                  <span>Proceed to Password Reset</span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>
              </motion.div>
            )}

            {/* RESET PASSWORD VIEW WITHIN SPLIT-SCREEN LAYOUT */}
            {viewMode === 'reset-password' && !showFeedback && (
              <motion.div
                key="reset-password-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                id="reset-password-form-wrapper"
                className="w-full animate-fadeIn"
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-medium tracking-tight text-neutral-900 font-sans" style={{ color: activeTheme.textColor }}>
                    {t.changePassHeader}
                  </h2>
                </div>

                {resetSuccess ? (
                  <div className="space-y-6">
                    <div 
                      className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-semibold flex flex-col gap-4 animate-fadeIn"
                      id="reset-success-box"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{t.changePasswordSuccessMsg}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewResetPassword('');
                        setConfirmResetPassword('');
                        setResetError('');
                        setResetSuccess(false);
                        setViewMode('login');
                      }}
                      className="w-full text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:brightness-105 active:scale-[0.99] cursor-pointer text-sm font-sans"
                      style={{ backgroundColor: activeTheme.primaryColor }}
                    >
                      {t.backToLogin}
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleResetSubmit(); }} 
                    className="space-y-6"
                    id="password-reset-main-form"
                  >
                    {resetError && (
                      <div 
                        className="p-5 rounded-lg border border-red-200 bg-[#FFF0F0] text-red-700 text-xs font-semibold border-l-[6px] border-l-[#E52222] animate-fadeIn mb-6 font-sans"
                        id="reset-password-error-box"
                      >
                        <div className="font-bold text-sm text-[#E52222] mb-1.5 font-sans">
                          {selectedLanguage === 'de' ? 'Bitte korrigieren Sie Ihre Eingaben' : 'Please correct your entries'}
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-[#E52222] font-semibold font-sans text-xs">
                          {resetError.split('\n').map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* New Password Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 tracking-wide mb-2 font-sans" style={{ color: activeTheme.textColor }}>
                        {selectedLanguage === 'de' ? 'Neues Passwort' : 'New password'} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showNewResetPassword ? 'text' : 'password'}
                          required
                          value={newResetPassword}
                          onChange={(e) => {
                            setNewResetPassword(e.target.value);
                            setResetError('');
                          }}
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 bg-neutral-50 focus:bg-white transition-all text-neutral-800"
                          style={{ 
                            borderColor: activeTheme.borderColor,
                          }}
                          placeholder={t.newPassPlaceholder}
                          id="reset-new-password-input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewResetPassword(!showNewResetPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          id="toggle-new-password-visibility"
                        >
                          {showNewResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 tracking-wide mb-2 font-sans" style={{ color: activeTheme.textColor }}>
                        {selectedLanguage === 'de' ? 'Neues Passwort bestätigen' : 'Confirm new password'} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showConfirmResetPassword ? 'text' : 'password'}
                          required
                          value={confirmResetPassword}
                          onChange={(e) => {
                            setConfirmResetPassword(e.target.value);
                            setResetError('');
                          }}
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 bg-neutral-50 focus:bg-white transition-all text-neutral-800"
                          style={{ 
                            borderColor: activeTheme.borderColor,
                          }}
                          placeholder={t.confirmPassPlaceholder}
                          id="reset-confirm-password-input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmResetPassword(!showConfirmResetPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          id="toggle-confirm-password-visibility"
                        >
                          {showConfirmResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Requirements rules underneath inputs */}
                    <div className="pt-1.5 leading-relaxed font-light text-[11px] text-neutral-500 italic opacity-90 font-sans">
                      {t.passRequirementMsg}
                    </div>

                    {/* Single Form Submit Button */}
                    <button
                      type="submit"
                      className="w-full text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:brightness-105 active:scale-[0.99] cursor-pointer text-sm font-sans"
                      style={{ backgroundColor: activeTheme.primaryColor }}
                      id="submit-password-reset-btn"
                    >
                      <span>{t.changePassHeader}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Access Granted Animation Overrides */}
            {showFeedback && (
              <motion.div
                key="feedback-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
                id="login-feedback-panel"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-xl font-medium tracking-tight text-neutral-900" style={{ color: activeTheme.textColor }}>Access Granted</h3>
                <p className="text-sm text-neutral-500 mt-1">Authenticating profile credentials...</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
