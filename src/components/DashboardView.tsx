import React from "react";
import {
  Users,
  BookOpen,
  Award,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Plus,
  ChevronRight
} from "lucide-react";
import { TabType, DashboardStats } from "../engines/types";
import { toast } from "sonner";

interface DashboardViewProps {
  stats: DashboardStats | null;
  setActiveTab: (tab: TabType) => void;
  loadStats: () => Promise<void>;
  setIsLoading: (val: boolean) => void;
  setActiveBlog: (val: any) => void;
  setActiveTestimonial: (val: any) => void;
  setActiveFaq: (val: any) => void;
}

export function DashboardView({
  stats,
  setActiveTab,
  loadStats,
  setIsLoading,
  setActiveBlog,
  setActiveTestimonial,
  setActiveFaq,
}: DashboardViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Luxury Editorial Welcome Banner */}
      <div className="relative glass-luxe p-10 sm:p-12 rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden min-h-[220px] flex flex-col justify-between">
        <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.035] pointer-events-none select-none text-[12rem] font-serif">
          🧭
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[9px] font-bold text-[#b45309] uppercase tracking-[0.2em] bg-amber-50 border border-amber-200/55 px-4 py-1.5 rounded-full">
            Control Center
          </span>
          <h2 className="text-3xl font-serif text-navy leading-tight tracking-tight">
            Welcome to your <span className="font-serif-it gold-gradient-text">Publishing Portal</span>.
          </h2>
          <p className="text-slate-650 text-[13px] leading-relaxed font-light max-w-xl">
            Configure and publish legal relocation guides, placement updates, FAQ structures, and applicant tracking. Changes are committed instantly to Cloudflare D1 Edge databases for zero cold-start delivery.
          </p>
        </div>
      </div>

      {/* Metric Card Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { tab: "leads" as TabType, label: "Candidate Inquiries", value: stats?.leadsCount, icon: Users, sub: "Inquiry database", badge: stats?.newLeadsCount },
          { tab: "blogs" as TabType, label: "Blog articles", value: stats?.blogsCount, icon: BookOpen, sub: "Relocation guides" },
          { tab: "testimonials" as TabType, label: "Placement Stories", value: stats?.testimonialsCount, icon: Award, sub: "Relocations mapped" },
          { tab: "faqs" as TabType, label: "Defined FAQs", value: stats?.faqsCount, icon: HelpCircle, sub: "Bilingual items" }
        ].map(({ tab, label, value, icon: Icon, sub, badge }) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="glass-luxe p-6 rounded-[2.2rem] cursor-pointer transition-all duration-350 hover:-translate-y-1 relative overflow-hidden group border border-white/60"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] font-bold text-slate-450 uppercase tracking-[0.15em]">{label}</p>
                <h3 className="text-3xl font-serif text-navy mt-3">{value ?? 0}</h3>
              </div>
              <div className="h-11 w-11 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-[#d97706] shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            
            <div className="mt-5 pt-3 border-t border-champagne/20 flex items-center justify-between">
              <span className="text-[9.5px] text-slate-400 font-medium">{sub}</span>
              {badge && badge > 0 ? (
                <span className="bg-[#b45309] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  {badge} New
                </span>
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-350 group-hover:translate-x-1 duration-300" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Telemetry Actions & Systems Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Systems Sync info */}
        <div className="glass-luxe p-8 rounded-[2.5rem] border border-white/60 lg:col-span-2 space-y-6">
          <h3 className="text-[15px] font-bold text-navy flex items-center gap-3 font-serif">
            <ShieldCheck className="h-5.5 w-5.5 text-[#b45309]" />
            Website Operations & System Synchronization
          </h3>
          <p className="text-slate-650 text-[13px] leading-relaxed font-light">
            The portal utilizes a synchronized dual-channel pipeline. Candidate registrations trigger instant writes to the Cloudflare D1 SQL database, webhook dispatches to Google Sheets, and secure notification logs via Resend.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Cloudflare D1 SQL", desc: "Live synchronized database" },
              { title: "Google Sheets Webhook", desc: "Spreadsheets connected" },
              { title: "Resend Email Dispatch", desc: "Notifications active" },
              { title: "Bilingual Translation Engine", desc: "EN / DE localization online" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5 p-4 bg-[#faf9f6]/70 border border-champagne/40 rounded-2xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-navy">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-champagne/30">
            <button
              onClick={() => {
                setIsLoading(true);
                loadStats().then(() => {
                  setIsLoading(false);
                  toast.success("Operational telemetry synchronized");
                });
              }}
              className="inline-flex items-center gap-2.5 text-[9px] font-bold uppercase tracking-widest px-6 py-3.5 border border-slate-200 bg-white hover:bg-[#faf9f6] text-navy rounded-2xl transition-all duration-300 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin-hover" />
              Synchronize Telemetry
            </button>
            <a
              href="https://docs.google.com/spreadsheets"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-6 py-3.5 border border-champagne bg-white hover:bg-[#faf9f6] text-[#b45309] rounded-2xl transition-all duration-300"
            >
              Open Google Sheets
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="glass-luxe p-8 rounded-[2.5rem] border border-white/60 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className="text-[15px] font-bold text-navy font-serif">Publishing shortcuts</h3>
            <p className="text-slate-650 text-[12.5px] font-light leading-relaxed">
              Instantly populate new relocation articles, relocation timelines, or FAQ structures using the bilingual wizard terminals.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setActiveBlog({
                  id: `post-${Date.now().toString().slice(-4)}`,
                  date: new Date().toISOString().split("T")[0],
                  author: "Futurpfad Team",
                  read_time_en: "5 min read",
                  read_time_de: "5 Min. Lesezeit",
                });
                setActiveTab("blogs");
              }}
              className="w-full flex items-center justify-between p-4 border border-champagne/60 bg-[#faf9f6]/60 hover:bg-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.12em] text-navy transition-all duration-300 hover:border-gold/30 hover:shadow-sm cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <Plus className="h-4 w-4 text-[#d97706]" />
                Publish Blog Article
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-350" />
            </button>

            <button
              onClick={() => {
                setActiveTestimonial({
                  id: `placement-${Date.now().toString().slice(-4)}`,
                  flag: "🇩🇪",
                  milestones_en: [],
                  milestones_de: [],
                });
                setActiveTab("testimonials");
              }}
              className="w-full flex items-center justify-between p-4 border border-champagne/60 bg-[#faf9f6]/60 hover:bg-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.12em] text-navy transition-all duration-300 hover:border-gold/30 hover:shadow-sm cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <Plus className="h-4 w-4 text-[#d97706]" />
                Add Relocation Story
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-350" />
            </button>

            <button
              onClick={() => {
                setActiveFaq({
                  id: `faq-${Date.now().toString().slice(-4)}`,
                  order_index: (stats?.faqsCount || 0) + 1,
                });
                setActiveTab("faqs");
              }}
              className="w-full flex items-center justify-between p-4 border border-champagne/60 bg-[#faf9f6]/60 hover:bg-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.12em] text-navy transition-all duration-300 hover:border-gold/30 hover:shadow-sm cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <Plus className="h-4 w-4 text-[#d97706]" />
                Create FAQ Entry
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-350" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
