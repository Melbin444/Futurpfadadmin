import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  HelpCircle,
  LogOut,
  ExternalLink
} from "lucide-react";
import { TabType, DashboardStats } from "../engines/types";

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
    <div className="min-h-screen hero-bg text-navy flex relative overflow-hidden font-sans p-6 gap-6">
      <div className="absolute inset-0 paper-noise opacity-[0.03] pointer-events-none mix-blend-multiply z-0" />
      
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 h-[350px] w-[350px] rounded-full bg-peach/10 blur-3xl pointer-events-none z-0 animate-mesh" />
      <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-sky/8 blur-3xl pointer-events-none z-0 animate-mesh" />
      <div className="absolute top-1/3 left-2/3 h-[300px] w-[300px] rounded-full bg-lavender/10 blur-3xl pointer-events-none z-0 animate-mesh" />

      {/* FLOATING SIDEBAR NAVIGATION DOCK */}
      <aside className="w-64 glass-strong rounded-[2.5rem] flex flex-col justify-between shrink-0 shadow-luxe relative z-10 p-6 overflow-hidden border border-white/80">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-champagne/40">
            <div className="h-11 w-11 bg-[#0c1c30] rounded-2xl flex items-center justify-center font-bold text-white shadow shadow-sky-950/20">
              🧭
            </div>
            <div>
              <h2 className="font-bold text-navy leading-none tracking-tight text-sm">Futurpfad</h2>
              <span className="text-[9px] text-[#b45309] font-extrabold tracking-widest uppercase mt-1.5 block">B2B Console</span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-2.5">
            {[
              { tab: "dashboard" as TabType, label: "Overview", icon: LayoutDashboard },
              { tab: "leads" as TabType, label: "Candidates Log", icon: Users, badge: stats?.newLeadsCount },
              { tab: "blogs" as TabType, label: "Relocation Blog", icon: BookOpen },
              { tab: "testimonials" as TabType, label: "Placement Stories", icon: Award }
            ].map(({ tab, label, icon: Icon, badge }) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); }}
                className={`w-full flex items-center justify-between px-4.5 py-4 rounded-2xl text-[9px] uppercase font-bold tracking-[0.18em] transition-all duration-300 cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#0c1c30] text-white shadow-soft scale-[1.02] border border-white/10"
                    : "text-slate-500 hover:text-navy hover:bg-cream/45"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${activeTab === tab ? "text-amber-400 animate-pulse" : "text-slate-450"}`} />
                  {label}
                </span>
                {badge && badge > 0 && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-amber-400 text-navy" : "bg-amber-500 text-white animate-pulse"}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="space-y-4.5 pt-5 border-t border-champagne/40">
          <div className="bg-[#faf9f6]/90 p-4 rounded-2xl border border-champagne/50 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Live Sync Online</span>
          </div>

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
      <div className="flex-1 flex flex-col max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[2.5rem] relative z-10 gap-6">
        
        {/* HEADER BAR */}
        <header className="h-20 glass-luxe rounded-[2rem] px-8 flex items-center justify-between sticky top-0 z-30 shadow-soft shrink-0 border border-white/60">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-navy tracking-[0.18em] uppercase font-sans">
              {activeTab === "dashboard" ? "Command Overview" : `${activeTab} Management`}
            </h1>
            {isLoading && (
              <div className="h-4 w-4 border-2 border-t-amber-600 border-r-amber-600 border-b-champagne border-l-champagne rounded-full animate-spin shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#b45309] hover:text-amber-800 transition-colors"
            >
              Public Site
              <ExternalLink className="h-3.5 w-3.5" />
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
