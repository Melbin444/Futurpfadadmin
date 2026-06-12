import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  LogOut,
  ExternalLink
} from "lucide-react";
import { TabType, DashboardStats } from "../engines/types";
import logoImg from "../assets/logo.png";

interface LayoutProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  stats: DashboardStats | null;
  handleLogout: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export function Layout({
  activeTab,
  setActiveTab,
  stats,
  handleLogout,
  isLoading,
  children,
}: LayoutProps) {
  return (
    <div className="min-h-screen hero-bg text-navy flex flex-col lg:flex-row relative overflow-x-hidden font-sans p-4 lg:p-6 gap-4 lg:gap-6">
      <div className="absolute inset-0 paper-noise opacity-[0.03] pointer-events-none mix-blend-multiply z-0" />
      
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 h-[350px] w-[350px] rounded-full bg-peach/10 blur-3xl pointer-events-none z-0 animate-mesh" />
      <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-sky/8 blur-3xl pointer-events-none z-0 animate-mesh" />
      <div className="absolute top-1/3 left-2/3 h-[300px] w-[300px] rounded-full bg-lavender/10 blur-3xl pointer-events-none z-0 animate-mesh" />

      {/* FLOATING SIDEBAR NAVIGATION DOCK */}
      <aside className="w-full lg:w-64 glass-strong rounded-[2rem] lg:rounded-[2.5rem] flex flex-col justify-between shrink-0 shadow-luxe relative z-10 p-4 lg:p-6 border border-white/80 overflow-hidden">
        <div className="flex flex-col lg:space-y-8 w-full">
          {/* Brand header */}
          <div className="flex items-center justify-between lg:justify-start lg:gap-3.5 pb-4 lg:pb-5 border-b border-champagne/40 w-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 lg:h-11 lg:w-11 bg-white rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 shadow shadow-sky-950/5">
                <img src={logoImg} alt="Futurpfad Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 className="font-bold text-navy leading-none tracking-tight text-xs lg:text-sm">Futurpfad</h2>
                <span className="text-[8px] lg:text-[9px] text-[#b45309] font-extrabold tracking-widest uppercase mt-1 lg:mt-1.5 block">B2B Console</span>
              </div>
            </div>
            
            {/* Mobile logout button */}
            <button
              onClick={handleLogout}
              title="Lock Portal"
              className="lg:hidden p-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible py-3 lg:py-0 scrollbar-none w-full">
            {[
              { tab: "dashboard" as TabType, label: "Overview", icon: LayoutDashboard },
              { tab: "leads" as TabType, label: "Candidates Log", icon: Users, badge: stats?.newLeadsCount },
              { tab: "blogs" as TabType, label: "Relocation Blog", icon: BookOpen },
              { tab: "testimonials" as TabType, label: "Placement Stories", icon: Award }
            ].map(({ tab, label, icon: Icon, badge }) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); }}
                className={`flex items-center justify-center lg:justify-between px-4 lg:px-4.5 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[8.5px] lg:text-[9px] uppercase font-bold tracking-[0.12em] lg:tracking-[0.18em] transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? "bg-[#0c1c30] text-white shadow-soft scale-[1.02] border border-white/10"
                    : "text-slate-555 hover:text-navy hover:bg-[#faf9f6]/70 border border-transparent"
                }`}
              >
                <span className="flex items-center gap-2 lg:gap-3">
                  <Icon className={`h-4 lg:h-4.5 w-4 lg:w-4.5 shrink-0 ${activeTab === tab ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{label}</span>
                </span>
                {badge && badge > 0 && (
                  <span className={`ml-2 text-[8px] lg:text-[9px] font-bold px-1.5 lg:px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-amber-400 text-navy" : "bg-amber-500 text-white animate-pulse"}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop Footer controls */}
        <div className="hidden lg:block pt-5 border-t border-champagne/40 w-full">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50/60 hover:bg-red-100/80 border border-red-200/55 text-red-750 text-[9px] font-bold uppercase tracking-widest rounded-2xl transition-all duration-300 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Lock Portal
          </button>
        </div>
      </aside>

      {/* CORE WORKSPACE MODULE */}
      <div className="flex-1 flex flex-col lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto rounded-2xl lg:rounded-[2.5rem] relative z-10 gap-4 lg:gap-6">
        
        {/* HEADER BAR */}
        <header className="h-16 lg:h-20 glass-luxe rounded-2xl lg:rounded-[2rem] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-soft shrink-0 border border-white/60">
          <div className="flex items-center gap-3">
            <h1 className="text-xs lg:text-sm font-bold text-navy tracking-[0.12em] lg:tracking-[0.18em] uppercase font-sans">
              {activeTab === "dashboard" ? "Command Overview" : `${activeTab} Management`}
            </h1>
            {isLoading && (
              <div className="h-3.5 w-3.5 lg:h-4 lg:w-4 border-2 border-t-amber-600 border-r-amber-600 border-b-champagne border-l-champagne rounded-full animate-spin shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-[#b45309] hover:text-amber-800 transition-colors"
            >
              <span>Public Site</span>
              <ExternalLink className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
            </a>
          </div>
        </header>

        {/* WORKSPACE CONTENT ROUTE */}
        <div className="flex-1 space-y-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
