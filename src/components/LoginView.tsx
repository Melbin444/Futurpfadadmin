import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, Wifi, Key } from "lucide-react";

interface LoginViewProps {
  password?: string;
  setPassword: (val: string) => void;
  isLoggingIn: boolean;
  handleLogin: (e: React.FormEvent) => void;
}

export function LoginView({
  password = "",
  setPassword,
  isLoggingIn,
  handleLogin,
}: LoginViewProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen hero-bg flex justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      {/* Background paper texture noise */}
      <div className="absolute inset-0 paper-noise opacity-[0.03] pointer-events-none mix-blend-multiply" />
      
      {/* Dynamic atmospheric ambient glows */}
      <div className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-peach/20 blur-[120px] pointer-events-none animate-mesh" />
      <div className="absolute -bottom-32 left-1/4 h-[600px] w-[600px] rounded-full bg-sky/15 blur-[120px] pointer-events-none animate-mesh" />
      <div className="absolute top-1/3 left-2/3 h-[400px] w-[400px] rounded-full bg-[#d97706]/8 blur-[100px] pointer-events-none animate-pulse" />

      {/* Main Luxury Console Container */}
      <div className="w-full max-w-md bg-white/95 border border-[#d97706]/15 rounded-[2.5rem] p-8 sm:p-12 relative z-10 shadow-[0_20px_50px_rgba(217,119,6,0.06),_0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_30px_70px_rgba(217,119,6,0.1)] hover:border-[#d97706]/25 group">
        
        {/* Subtle reflection overlay on card top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d97706]/25 to-transparent" />
        
        <div className="flex flex-col items-center mb-9 text-center">
          
          {/* Executive Shield Emblem Logo */}
          <div className="relative h-22 w-22 flex items-center justify-center mb-5">
            {/* Double spinning luxury compass/orbit rings */}
            <div className="absolute inset-0 border border-dashed border-[#d97706]/35 rounded-full animate-[spin_50s_linear_infinite]" />
            <div className="absolute inset-2 border border-[#d97706]/10 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
            
            {/* Glowing gold back aura */}
            <div className="absolute inset-3 bg-gradient-to-tr from-[#ffe7c4] to-[#fbf7f0] rounded-full blur-sm" />
            
            {/* Gilded Inner Shield */}
            <div className="relative h-15 w-15 bg-gradient-to-tr from-[#0c1c30] to-[#1e344f] rounded-full flex items-center justify-center shadow-luxe border border-white/10 relative z-10 group-hover:scale-103 transition-transform duration-300">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#ffe7c4]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                <circle cx="12" cy="12" r="5" strokeWidth="1.2" strokeOpacity="0.5" />
                <path d="M12 3v2M12 19v2M3 12h2M19 12h2" strokeLinecap="round" />
                <path d="M12 7.5l2 4.5-2 4.5-2-4.5z" fill="#d97706" stroke="#ffe7c4" strokeWidth="1" />
              </svg>
            </div>
            
            {/* Pulsing light indicator */}
            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>

          <h1 className="text-3xl font-serif text-[#0c1c30] font-black tracking-tight leading-none text-gradient">
            Futurpfad
          </h1>
          <p className="text-slate-500 text-[10px] font-extrabold uppercase tracking-[0.25em] mt-3">
            Secure Publishing Console
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-navy/70 text-[10.5px] font-bold uppercase tracking-wider">
                System Access Key
              </label>
              <span className="text-[9.5px] text-teal font-semibold font-mono tracking-wide uppercase flex items-center gap-1">
                <Key className="h-3 w-3" /> Encrypted
              </span>
            </div>
            
            {/* Luxury Password Input Container */}
            <div className="relative flex items-center bg-[#faf9f6] border border-champagne/80 focus-within:border-[#d97706] focus-within:ring-2 focus-within:ring-[#d97706]/10 rounded-2xl transition-all duration-300 shadow-inner group/input">
              <span className="pl-4 text-slate-400 group-focus-within/input:text-[#d97706] transition-colors">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-navy bg-transparent px-3 py-4.5 text-sm outline-none font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 text-slate-450 hover:text-navy transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Secure Unlock Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-4 bg-gradient-to-r from-[#0c1c30] to-[#1e344f] hover:from-[#d97706] hover:to-[#b45309] active:scale-[0.985] text-white rounded-2xl text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5"
          >
            {isLoggingIn ? (
              <>
                <div className="h-4 w-4 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin" />
                <span>Authorizing Access...</span>
              </>
            ) : (
              <>
                <Key className="h-4 w-4 text-[#ffe7c4] group-hover:rotate-12 transition-transform duration-300" />
                <span>Unlock Console</span>
              </>
            )}
          </button>
        </form>

        {/* Security Warning Notice */}
        <div className="mt-6 bg-[#d97706]/5 border border-[#d97706]/10 rounded-2xl p-4 text-left text-[11px] leading-relaxed text-slate-500 flex gap-3 items-start animate-fadeIn">
          <span className="text-[#d97706] shrink-0 mt-0.5">
            <ShieldAlert className="h-4.5 w-4.5" />
          </span>
          <p className="font-light">
            <strong>Security Warning:</strong> This is a secure system. Unauthorized access attempts are actively logged, blocked, and reported.
          </p>
        </div>

        {/* Live Network & Encryption Metrics */}
        <div className="mt-8 pt-6 border-t border-champagne/45 grid grid-cols-3 gap-2 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex flex-col items-center gap-1 border-r border-champagne/30">
            <span className="text-slate-350">Protocol</span>
            <span className="text-teal font-mono">TLS 1.3</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-champagne/30">
            <span className="text-slate-350">Database</span>
            <span className="text-teal font-mono">D1 Edge</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-slate-350">Network</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <Wifi className="h-3 w-3 animate-pulse" /> Active
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
