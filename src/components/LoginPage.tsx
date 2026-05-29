/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { ThemeConfig } from '../types';

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

        <div className="relative z-10 flex items-center gap-3.5">
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

      {/* Right Login Pane */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-transparent p-4 relative"
        >
          {showFeedback ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-10 h-10" />
              </motion.div>
              <h3 className="text-xl font-medium tracking-tight text-neutral-900" style={{ color: activeTheme.textColor }}>Access Granted</h3>
              <p className="text-sm text-neutral-500 mt-1">Authenticating profile credentials...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-medium tracking-tight text-neutral-900" style={{ color: activeTheme.textColor }}>
                  Login
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 tracking-wide mb-2 font-sans" style={{ color: activeTheme.textColor }}>
                    Email
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
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 tracking-wide mb-2 font-sans" style={{ color: activeTheme.textColor }}>
                    Password
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
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
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Logging in...
                      </span>
                    ) : (
                      <>
                        Log In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <a 
                      href="#forgot-password" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset linkage is currently mocked in pre-production mode.");
                      }}
                      className="text-xs font-semibold hover:underline transition-colors"
                      style={{ color: activeTheme.primaryColor }}
                    >
                      Forgot Password
                    </a>
                  </div>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
