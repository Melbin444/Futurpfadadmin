import React from "react";
import { Search, X } from "lucide-react";
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
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Filtering Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#faf9f6]/95 border border-champagne/60 p-4 rounded-[2rem] shadow-soft">
        <div className="flex border border-champagne/50 bg-white/70 rounded-2xl p-1 shrink-0">
          {(["all", "new", "contacted", "archived"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setLeadsFilter(filter)}
              className={`px-4.5 py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] rounded-xl transition-all cursor-pointer ${
                leadsFilter === filter
                  ? "bg-[#0c1c30] text-white shadow-sm"
                  : "text-slate-500 hover:text-navy"
              }`}
            >
              {filter}
            </button>
          ))}
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
                  <tr key={lead.id} className="hover:bg-[#faf9f6]/40 transition-all duration-200">
                    <td className="py-5 px-6 font-bold text-navy-deep font-sans">
                      <div className="flex flex-col gap-1 items-start">
                        <span>{lead.name}</span>
                        <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isB2B
                            ? "bg-amber-50 text-amber-700 border border-amber-250/50"
                            : "bg-sky-50 text-sky-800 border border-sky-250/50"
                        }`}>
                          {isB2B ? "B2B Partner" : "Candidate"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-slate-650 font-semibold">{lead.email}</div>
                      {lead.phone && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{lead.phone}</div>}
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
                        ? "bg-amber-50 text-amber-700 border border-amber-250 animate-pulse"
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
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-[9px] font-bold uppercase tracking-wider px-3.5 py-2 bg-white border border-champagne hover:border-slate-350 text-navy rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Open Inquiry Log
                    </button>
                  </td>
                </tr>
              ); })}
          </tbody>
        </table>
      </div>

      {/* LEAD DETAILS DRAWER MODAL */}
      {selectedLead && (
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
        </div>
      )}
    </div>
  );
}
