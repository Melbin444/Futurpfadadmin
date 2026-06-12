import React from "react";

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
  return (
    <div className="min-h-screen hero-bg flex justify-center items-center px-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 paper-noise opacity-[0.03] pointer-events-none mix-blend-multiply" />
      
      {/* Animated Aurora meshes */}
      <div className="absolute -top-12 right-1/4 h-[400px] w-[400px] rounded-full bg-peach/20 blur-3xl pointer-events-none animate-mesh" />
      <div className="absolute -bottom-24 left-1/3 h-[500px] w-[500px] rounded-full bg-sky/15 blur-3xl pointer-events-none animate-mesh" />
      <div className="absolute top-1/2 left-2/3 h-[300px] w-[300px] rounded-full bg-lavender/15 blur-3xl pointer-events-none animate-mesh" />

      <div className="w-full max-w-md glass-strong rounded-[2.5rem] p-10 sm:p-14 relative z-10 text-navy">
        <div className="flex flex-col items-center mb-10 text-center">
          
          {/* Elegant Emblem */}
          <div className="relative h-20 w-20 flex items-center justify-center mb-6">
            <div className="absolute inset-0 border border-dashed border-gold/40 rounded-full animate-[spin_30s_linear_infinite]" />
            <div className="h-15 w-15 bg-gradient-to-tr from-[#0c1c30] to-[#1a2d42] rounded-full flex items-center justify-center shadow-luxe">
              <span className="font-serif-it text-white text-2xl select-none">🧭</span>
            </div>
          </div>

          <h1 className="text-[28px] font-serif text-navy tracking-tight leading-none">Futurpfad</h1>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.22em] mt-2.5">
            Secure Publishing Console
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2.5">
            <label className="block text-navy/70 text-[9px] font-bold uppercase tracking-wider pl-1">
              Enter Terminal Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#faf9f6]/80 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-5 py-4 text-sm outline-none transition-all duration-300 shadow-inner font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-4.5 bg-[#0c1c30] hover:bg-navy-deep active:scale-[0.99] text-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-luxe transition-all duration-350 disabled:opacity-50 cursor-pointer"
          >
            {isLoggingIn ? "Authorizing Keys..." : "Unlock Terminal"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-champagne/45 flex justify-center items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
            SQL Synced on D1 Edge
          </span>
        </div>
      </div>
    </div>
  );
}
