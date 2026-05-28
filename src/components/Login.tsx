import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  isPremium: boolean;
  onLogin: (email: string) => void;
  onToggleTheme: (mode: 'premium' | 'legacy') => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onShowToast: (msg: string) => void;
}

export default function Login({
  isPremium,
  onLogin,
  onToggleTheme,
  language,
  onLanguageChange,
  onShowToast
}: LoginProps) {
  const [email, setEmail] = useState('admin@xfair.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      onShowToast('Please enter a valid email address.');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(email);
      onShowToast(`Successfully logged into XFAIR as Sadhana Penta (${email})`);
    }, 1200);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      onShowToast('Please enter your email to receive recovery instructions.');
      return;
    }
    onShowToast(`Password recovery link has been safely transmitted to ${recoveryEmail}`);
    setShowForgotPassword(false);
    setRecoveryEmail('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-[#2F3747] font-sans">
      
      {/* LEFT COLUMN: BRANDING & ARTWORK */}
      <div id="login-branding-area" className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 md:p-16 h-screen overflow-hidden text-white">
        
        {/* Grayscale Architectural Skyscraper Background Photo */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
          alt="XFAIR Highrise Skyscrapers Background"
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.25] contrast-[1.15]"
          referrerPolicy="no-referrer"
        />

        {/* Dynamic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20 mix-blend-multiply pointer-events-none" />

        {/* TOP branding row */}
        <div className="z-10 flex items-center gap-3">
          <img 
            src="/Logo/ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png"
            alt="XFAIR Logo"
            style={{ width: '210px', height: '70px' }}
            className="object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* MIDDLE headline area */}
        <div className="z-10 flex flex-col space-y-6 my-auto">
          <h1 className="text-[40px] md:text-[46px] lg:text-[48px] font-bold tracking-tight text-white leading-[1.12] max-w-md font-sans">
            Next-gen event orchestration starts here.
          </h1>

          <p className="text-[13.5px] md:text-[14.5px] text-[#A1A1AA] max-w-sm font-medium leading-relaxed">
            Manage attendance calendars, registration types, hotel lists, and branding systems in a simplified premium workspace.
          </p>
        </div>

        {/* BOTTOM metadata row */}
        <div className="z-10 flex items-center gap-6 text-[11px] text-[#8B8B98] font-semibold">
          <button 
            type="button" 
            onClick={() => onShowToast('Imprint clicked')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Imprint
          </button>
          <button 
            type="button" 
            onClick={() => onShowToast('Data Privacy Policy clicked')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Data Privacy
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: LOGIN FORM */}
      <div id="login-form-area" className="w-full lg:w-1/2 flex flex-col justify-center items-center min-h-screen bg-[#F8F9FA] px-6 py-12 md:px-12 md:py-24 relative">
        
        {/* MOBILE TOP BRANDING (ONLY VISIBLE ON MOBILE) */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <img 
            src="/Logo/ChatGPT_Image_May_12__2026__02_15_00_PM-removebg-preview.png"
            alt="XFAIR Logo"
            style={{ width: '210px', height: '70px' }}
            className="object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* CENTERING CONTAINER */}
        <div className="w-full max-w-[380px] space-y-8">
          
          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <motion.div
                key="login-form-main"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 text-left"
              >
                
                {/* HEADLINE */}
                <div>
                  <h2 className="text-[32px] font-semibold text-slate-800 tracking-tight leading-tight">
                    Login
                  </h2>
                </div>

                {/* FORM */}
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  
                  {/* EMAIL INPUT */}
                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">
                      Email Account
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#A1A1AA] pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@xfair.com"
                        className="w-full h-12 pl-11 pr-4 bg-white border border-[#E4E4E7] rounded-xl text-[13.5px] text-slate-800 placeholder-[#BBB] focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#A1A1AA] pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="•••••••••••••"
                        className="w-full h-12 pl-11 pr-11 bg-white border border-[#E4E4E7] rounded-xl text-[13.5px] text-slate-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none p-1"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-[18px] h-[18px]" />
                        ) : (
                          <Eye className="w-[18px] h-[18px]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* LOG IN BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#F35D00] hover:bg-[#E05200] active:bg-[#C24300] text-white rounded-xl font-bold tracking-wide text-[14px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#F35D00]/10 hover:shadow-lg hover:shadow-[#F35D00]/15 select-none"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Logging In...
                        </>
                      ) : (
                        <>
                          Log In
                          <ArrowRight className="w-[18px] h-[18px]" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* FORGOT PASSWORD LINK DISABLED */}

                </form>

              </motion.div>
            ) : (
              <motion.div
                key="login-form-recovery"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                
                {/* HEADLINE */}
                <div>
                  <h2 className="text-[26px] font-bold text-slate-800 tracking-tight leading-tight">
                    Reset Password
                  </h2>
                  <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                    Provide your electronic mail address. A credential reset cryptographic token will be dispatched to verify identity authority.
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#A1A1AA] pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="you@xfair.com"
                        className="w-full h-12 pl-11 pr-4 bg-white border border-[#E4E4E7] rounded-xl text-[13.5px] text-slate-800 focus:outline-none focus:border-[#F35D00] focus:ring-1 focus:ring-[#F35D00]/25 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 h-11 border border-[#E4E4E7] bg-white hover:bg-slate-50 text-slate-755 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 bg-[#F35D00] hover:bg-[#E05200] active:bg-[#C24300] text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Send Code
                    </button>
                  </div>
                </form>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* MOBILE BOTTOM METADATA BAR */}
        <div className="lg:hidden absolute bottom-6 flex items-center justify-center gap-6 text-[10px] text-slate-500 font-semibold w-full">
          <button type="button" onClick={() => onShowToast('Imprint clicked')} className="hover:underline">Imprint</button>
          <button type="button" onClick={() => onShowToast('Data Privacy Policy clicked')} className="hover:underline">Data Privacy</button>
        </div>

      </div>

    </div>
  );
}
