import { createPortal } from "react-dom";
import { Search, X, Check, Archive, Trash2, Mail, Phone, Layers, Inbox, UserCheck } from "lucide-react";
import { Lead } from "../engines/types";

interface LeadsViewProps {
  leads: Lead[];
  leadsFilter: "all" | "new" | "contacted" | "archived";
  setLeadsFilter: (filter: "all" | "new" | "contacted" | "archived") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export function LeadsView({
  leads,
  leadsFilter,
  setLeadsFilter,
  searchTerm,
  setSearchTerm,
  selectedLead,
  setSelectedLead,
  updateLeadStatus,
  deleteLead,
}: LeadsViewProps) {
  const countAll = leads.length;
  const countNew = leads.filter((l) => l.status === "new").length;
  const countContacted = leads.filter((l) => l.status === "contacted").length;
  const countArchived = leads.filter((l) => l.status === "archived").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Filtering Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-[#faf9f6]/95 border border-champagne/60 p-4 rounded-[2rem] shadow-soft">
        <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-champagne/45 rounded-2xl shrink-0">
          {[
            { key: "all", label: "All", count: countAll, icon: Layers, activeClass: "bg-[#0c1c30] text-white shadow-md shadow-[#0c1c30]/10", badgeClass: "bg-white/20 text-white", inactiveBadgeClass: "bg-slate-100 text-slate-500" },
            { key: "new", label: "New", count: countNew, icon: Inbox, activeClass: "bg-amber-600 text-white shadow-md shadow-amber-600/10", badgeClass: "bg-white/25 text-white", inactiveBadgeClass: "bg-amber-50 text-amber-600 border border-amber-200/30" },
            { key: "contacted", label: "Contacted", count: countContacted, icon: UserCheck, activeClass: "bg-emerald-600 text-white shadow-md shadow-emerald-600/10", badgeClass: "bg-white/25 text-white", inactiveBadgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-250/30" },
            { key: "archived", label: "Archived", count: countArchived, icon: Archive, activeClass: "bg-slate-600 text-white shadow-md shadow-slate-600/10", badgeClass: "bg-white/25 text-white", inactiveBadgeClass: "bg-slate-100 text-slate-400" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = leadsFilter === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setLeadsFilter(item.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  isActive
                    ? `${item.activeClass} font-extrabold`
                    : "text-slate-500 hover:text-navy hover:bg-[#faf9f6]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "opacity-100" : "opacity-60"}`} />
                <span>{item.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                  isActive ? item.badgeClass : item.inactiveBadgeClass
                }`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#e8dfc8] hover:border-slate-355 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl pl-11 pr-4 py-3 text-xs outline-none transition-all shadow-inner font-sans"
          />
        </div>
      </div>

      {/* Leads Listing */}
      <div className="glass-luxe rounded-[2rem] overflow-hidden border border-white/60 shadow-soft">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-champagne/50 text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] bg-[#faf9f6]/60 select-none">
              <th className="py-5 px-6">Candidate Details</th>
              <th className="py-5 px-6">Channels</th>
              <th className="py-5 px-6">Date Received</th>
              <th className="py-5 px-6">Review State</th>
              <th className="py-5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/20 text-xs">
            {leads
              .filter((l) => leadsFilter === "all" || l.status === leadsFilter)
              .filter(
                (l) =>
                  l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (l.message || "").toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((lead) => {
                const isB2B = (lead.message || "").includes("B2B Sourcing Inquiry:") ||
                              (lead.message || "").includes("B2B Sourcing Request:") ||
                              (lead.message || "").includes("Employer B2B Request:") ||
                              (lead.message || "").includes("B2B Sourcing Consultation:") ||
                              (lead.message || "").includes("Company:") ||
                              (lead.message || "").includes("Organisation:");

                return (
                  <tr key={lead.id} className={`hover:bg-[#faf9f6]/60 transition-all duration-205 ${
                    lead.status === "new" ? "bg-amber-50/20" : ""
                  }`}>
                    <td className="py-5 px-6 font-sans">
                      <div className="flex flex-col gap-1 items-start max-w-[280px] sm:max-w-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-navy-deep text-xs">{lead.name}</span>
                          <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isB2B
                              ? "bg-amber-55 bg-opacity-10 text-amber-700 border border-amber-250/40"
                              : "bg-sky-55 bg-opacity-10 text-sky-850 border border-sky-250/40"
                          }`}>
                            {isB2B ? "B2B Partner" : "Candidate"}
                          </span>
                        </div>
                        {lead.message && (
                          <span className="text-[11px] text-slate-450 line-clamp-1 italic font-light mt-0.5">
                            "{lead.message.replace(/\s+/g, ' ')}"
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6 font-sans">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-650 font-semibold">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-450 font-mono">
                            <Phone className="h-3 w-3 text-slate-350 shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-slate-500 font-sans">
                      {new Date(lead.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        lead.status === "new"
                          ? "bg-amber-50 text-amber-750 border border-amber-250 animate-pulse"
                          : lead.status === "contacted"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                            : "bg-slate-50 text-slate-400 border border-slate-200"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          lead.status === "new" ? "bg-amber-500" : lead.status === "contacted" ? "bg-emerald-500" : "bg-slate-350"
                        }`} />
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          title="Open Details Log"
                          className="p-2 bg-white hover:bg-slate-50 border border-champagne rounded-xl text-slate-500 hover:text-navy transition-colors shadow-sm cursor-pointer"
                        >
                          <Search className="h-3.5 w-3.5" />
                        </button>
                        
                        {lead.status === "new" && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, "contacted")}
                            title="Mark as Contacted"
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-600 rounded-xl transition-colors shadow-sm cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        
                        {lead.status !== "archived" && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, "archived")}
                            title="Archive Lead"
                            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-xl transition-colors shadow-sm cursor-pointer"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteLead(lead.id)}
                          title="Delete Lead"
                          className="p-2 bg-red-50/60 hover:bg-red-100/85 border border-red-200/50 text-red-600 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* LEAD DETAILS DRAWER MODAL */}
      {selectedLead && createPortal(
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="w-full max-w-xl glass-strong border border-white rounded-[2.5rem] p-8 sm:p-10 shadow-luxe space-y-6 text-navy">
            
            <div className="flex justify-between items-center border-b border-champagne/45 pb-4">
              <div>
                <span className="text-[9px] font-bold text-[#b45309] uppercase tracking-widest pl-0.5">Applicant Log File</span>
                <h3 className="text-xl font-serif text-navy-deep font-bold mt-1">{selectedLead.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="h-10 w-10 bg-[#faf9f6] border border-champagne rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-[#faf9f6]/70 border border-champagne/30 rounded-2xl p-4 space-y-1">
                <span className="text-[8.5px] font-bold text-slate-450 uppercase tracking-wider">Email Address</span>
                <p className="font-semibold text-navy-deep break-all">{selectedLead.email}</p>
              </div>
              <div className="bg-[#faf9f6]/70 border border-champagne/30 rounded-2xl p-4 space-y-1">
                <span className="text-[8.5px] font-bold text-slate-450 uppercase tracking-wider">Phone number</span>
                <p className="font-semibold text-navy-deep">{selectedLead.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="bg-[#faf9f6]/70 border border-champagne/35 rounded-2xl p-5 space-y-2">
              <span className="text-[8.5px] font-bold text-slate-450 uppercase tracking-wider">Demands & Vacancy description</span>
              <p className="text-xs text-navy/85 leading-relaxed font-light whitespace-pre-wrap">
                {selectedLead.message || "No message included."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-between pt-4 border-t border-champagne/40">
              <div className="flex gap-2">
                <button
                  onClick={() => updateLeadStatus(selectedLead.id, "contacted")}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => updateLeadStatus(selectedLead.id, "archived")}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-650 rounded-xl text-[9px] font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Archive
                </button>
              </div>

              <button
                onClick={() => {
                  deleteLead(selectedLead.id);
                }}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-650 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
