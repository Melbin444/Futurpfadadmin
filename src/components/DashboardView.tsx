import {
  Users,
  BookOpen,
  Award,
  ChevronRight
} from "lucide-react";
import { TabType, DashboardStats } from "../engines/types";

interface DashboardViewProps {
  stats: DashboardStats | null;
  setActiveTab: (tab: TabType) => void;
  loadStats: () => Promise<void>;
  setIsLoading: (val: boolean) => void;
  setActiveBlog: (val: any) => void;
  setActiveTestimonial: (val: any) => void;
}

export function DashboardView({
  stats,
  setActiveTab,
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
            Configure and publish legal relocation guides, placement updates, and applicant tracking. Changes are committed instantly to Cloudflare D1 Edge databases for zero cold-start delivery.
          </p>
        </div>
      </div>

      {/* Metric Card Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { tab: "leads" as TabType, label: "Candidate Inquiries", value: stats?.leadsCount, icon: Users, sub: "Inquiry database", badge: stats?.newLeadsCount },
          { tab: "blogs" as TabType, label: "Blog articles", value: stats?.blogsCount, icon: BookOpen, sub: "Relocation guides" },
          { tab: "testimonials" as TabType, label: "Placement Stories", value: stats?.testimonialsCount, icon: Award, sub: "Relocations mapped" }
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
    </div>
  );
}
