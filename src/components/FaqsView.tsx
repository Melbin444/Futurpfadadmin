import React from "react";
import { Plus, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Faq } from "../engines/types";

interface FaqsViewProps {
  faqs: Faq[];
  activeFaq: Partial<Faq> | null;
  setActiveFaq: (faq: Partial<Faq> | null) => void;
  saveFaq: (e: React.FormEvent) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  slugify: (text: string) => string;
  statsCount?: number;
}

export function FaqsView({
  faqs,
  activeFaq,
  setActiveFaq,
  saveFaq,
  deleteFaq,
  slugify,
  statsCount = 0,
}: FaqsViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#faf9f6]/80 p-4 border border-champagne/60 rounded-[2rem] shadow-soft">
        <p className="text-xs text-slate-500 font-light max-w-xl">
          Configure and publish accordion question sets displayed directly to corporate employers on the main landing page.
        </p>
        {!activeFaq && (
          <button
            onClick={() =>
              setActiveFaq({
                id: `faq-${Date.now().toString().slice(-4)}`,
                order_index: statsCount + 1,
              })
            }
            className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-6 py-3.5 bg-[#0c1c30] hover:bg-navy-deep text-white rounded-2xl shadow-md transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 text-amber-400" />
            New FAQ Entry
          </button>
        )}
      </div>

      {/* FAQ EDITOR PANEL */}
      {activeFaq ? (
        <div className="glass-luxe border border-white/70 rounded-[2.5rem] overflow-hidden shadow-luxe">
          
          <div className="p-6 border-b border-champagne/45 flex justify-between items-center bg-[#faf9f6]/70">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFaq(null)}
                className="text-slate-400 hover:text-navy p-1 cursor-pointer"
                type="button"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h3 className="text-sm font-bold text-navy uppercase tracking-widest">
                {faqs.some((f) => f.id === activeFaq.id) ? "Modify FAQ Entry" : "Create FAQ Entry"}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFaq(null)}
                className="text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-500 rounded-xl transition-all cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={(e) => saveFaq(e)}
                className="text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white rounded-xl transition-all shadow-sm cursor-pointer"
                type="submit"
              >
                Save & Publish
              </button>
            </div>
          </div>

          <form onSubmit={saveFaq} className="p-8 space-y-6 text-navy">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Meta Columns */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    URL Slug (Identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeFaq.id || ""}
                    onChange={(e) => setActiveFaq({ ...activeFaq, id: e.target.value })}
                    placeholder="e.g. visa-timeline-duration"
                    disabled={faqs.some((f) => f.id === activeFaq.id)}
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    Display Sorting Index *
                  </label>
                  <input
                    type="number"
                    required
                    value={activeFaq.order_index ?? ""}
                    onChange={(e) => setActiveFaq({ ...activeFaq, order_index: parseInt(e.target.value) })}
                    placeholder="e.g. 1 (First)"
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Translatable content */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-champagne/35 lg:pl-8">
                
                {/* EN Column */}
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-[8px] font-extrabold text-[#0c1c30] bg-[#f5f0e6] border border-[#e8dfc8] px-3 py-1 rounded-full uppercase tracking-wider">
                    🇬🇧 English Question & Answer
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Question Title *</label>
                    <input
                      type="text"
                      required
                      value={activeFaq.question_en || ""}
                      onChange={(e) => {
                        const updates: any = { question_en: e.target.value };
                        if (!faqs.some((f) => f.id === activeFaq.id) && !activeFaq.id?.startsWith("faq-")) {
                          updates.id = slugify(e.target.value);
                        }
                        setActiveFaq({ ...activeFaq, ...updates });
                      }}
                      placeholder="e.g. Do you handle visa application documentation?"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Answer explanation *</label>
                    <textarea
                      required
                      rows={8}
                      value={activeFaq.answer_en || ""}
                      onChange={(e) => setActiveFaq({ ...activeFaq, answer_en: e.target.value })}
                      placeholder="B2B answer explanation text..."
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* DE Column */}
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-[8px] font-extrabold text-[#0c1c30] bg-[#f5f0e6] border border-[#e8dfc8] px-3 py-1 rounded-full uppercase tracking-wider">
                    🇩🇪 German Question & Answer
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Fragentitel *</label>
                    <input
                      type="text"
                      required
                      value={activeFaq.question_de || ""}
                      onChange={(e) => setActiveFaq({ ...activeFaq, question_de: e.target.value })}
                      placeholder="z.B. Übernehmen Sie die Visaabwicklung?"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Antwort *</label>
                    <textarea
                      required
                      rows={8}
                      value={activeFaq.answer_de || ""}
                      onChange={(e) => setActiveFaq({ ...activeFaq, answer_de: e.target.value })}
                      placeholder="Antworttext..."
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* FAQS ACCORDION LIST */
        <div className="space-y-4">
          {faqs
            .sort((a, b) => a.order_index - b.order_index)
            .map((faq) => (
              <div key={faq.id} className="glass-luxe p-5 rounded-[1.8rem] border border-white/60 shadow-soft flex items-center justify-between hover:border-gold/20 transition-all duration-300">
                <div className="flex items-center gap-4.5">
                  <span className="h-9 w-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center font-bold text-xs text-[#b45309] shrink-0 font-sans">
                    {faq.order_index}
                  </span>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-navy-deep font-sans">{faq.question_en}</h4>
                    <p className="text-[11px] text-slate-400 font-sans font-light mt-0.5">{faq.id}</p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setActiveFaq(faq)}
                    className="p-2.5 bg-white hover:bg-slate-50 border border-champagne rounded-xl text-slate-500 hover:text-navy transition-colors shadow-sm cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteFaq(faq.id)}
                    className="p-2.5 bg-red-50/60 hover:bg-red-100/80 border border-red-200/50 rounded-xl text-red-655 hover:text-red-750 transition-colors shadow-sm cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
