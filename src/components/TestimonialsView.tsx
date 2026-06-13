import React from "react";
import { Plus, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Testimonial } from "../engines/types";

interface TestimonialsViewProps {
  testimonials: Testimonial[];
  activeTestimonial: Partial<Testimonial> | null;
  setActiveTestimonial: (t: Partial<Testimonial> | null) => void;
  isVideoOnly: boolean;
  setIsVideoOnly: (val: boolean) => void;
  saveTestimonial: (e: React.FormEvent) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'testimonial' | 'employer') => Promise<void>;
  getYouTubeId: (url?: string) => string | null;
}

export function TestimonialsView({
  testimonials,
  activeTestimonial,
  setActiveTestimonial,
  isVideoOnly,
  setIsVideoOnly,
  saveTestimonial,
  deleteTestimonial,
  handleImageUpload,
  getYouTubeId,
}: TestimonialsViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#faf9f6]/80 p-4 border border-champagne/60 rounded-[2rem] shadow-soft">
        <p className="text-xs text-slate-500 font-light max-w-xl">
          Relocation profiles map international talent relocations from origin countries (India, Colombia) to specific employers in Germany, displaying verified milestones.
        </p>
        {!activeTestimonial && (
          <button
            onClick={() =>
              setActiveTestimonial({
                id: `placement-${Date.now().toString().slice(-4)}`,
                flag: "🇩🇪",
                milestones_en: [],
                milestones_de: [],
              })
            }
            className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-6 py-3.5 bg-[#0c1c30] hover:bg-navy-deep text-white rounded-2xl shadow-md transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 text-amber-400" />
            New Placement Profile
          </button>
        )}
      </div>

      {/* TESTIMONIAL EDITOR PANEL */}
      {activeTestimonial ? (
        <div className="glass-luxe border border-white/70 rounded-[2.5rem] overflow-hidden shadow-luxe">
          
          <div className="p-6 border-b border-champagne/45 flex justify-between items-center bg-[#faf9f6]/70">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTestimonial(null)}
                className="text-slate-400 hover:text-navy p-1 cursor-pointer"
                type="button"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h3 className="text-sm font-bold text-navy uppercase tracking-widest">
                {testimonials.some((t) => t.id === activeTestimonial.id) ? "Modify Relocation Profile" : "Create Relocation Profile"}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTestimonial(null)}
                className="text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-500 rounded-xl transition-all cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={(e) => saveTestimonial(e)}
                className="text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white rounded-xl transition-all shadow-sm cursor-pointer"
                type="submit"
              >
                Save & Publish
              </button>
            </div>
          </div>

          <form onSubmit={saveTestimonial} className="p-8 space-y-6 text-navy">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Meta Columns */}
              <div className="space-y-4">
                {/* Video-Only Toggle */}
                <div className="bg-[#faf9f6]/60 p-4 border border-champagne/50 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <label className="text-[11px] font-bold text-navy block">Video-Only Testimonial</label>
                    <span className="text-[9px] text-slate-500 font-light block leading-tight">Hides all text details and shows only the video player</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isVideoOnly}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setIsVideoOnly(isChecked);
                      if (isChecked) {
                        setActiveTestimonial({
                          ...activeTestimonial,
                          role_en: "",
                          role_de: "",
                          sector_en: "",
                          sector_de: "",
                          quote_en: "",
                          quote_de: "",
                          employer_name: "",
                          employer_role_en: "",
                          employer_role_de: "",
                          employer_company: "",
                          employer_city: "",
                          milestones_en: [],
                          milestones_de: [],
                        });
                      }
                    }}
                    className="h-4.5 w-4.5 accent-amber-600 focus:ring-amber-500 border-champagne rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    URL Slug (Identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeTestimonial.id || ""}
                    onChange={(e) => setActiveTestimonial({ ...activeTestimonial, id: e.target.value })}
                    placeholder="e.g. anjali-nurse-frankfurt"
                    disabled={testimonials.some((t) => t.id === activeTestimonial.id)}
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    Candidate Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeTestimonial.name || ""}
                    onChange={(e) => setActiveTestimonial({ ...activeTestimonial, name: e.target.value })}
                    placeholder="e.g. Anjali Sharma"
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    Origin Country {!isVideoOnly && "*"}
                  </label>
                  <input
                    type="text"
                    required={!isVideoOnly}
                    value={activeTestimonial.origin || ""}
                    onChange={(e) => setActiveTestimonial({ ...activeTestimonial, origin: e.target.value })}
                    placeholder="e.g. India"
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    Destination City in Germany {!isVideoOnly && "*"}
                  </label>
                  <input
                    type="text"
                    required={!isVideoOnly}
                    value={activeTestimonial.destination || ""}
                    onChange={(e) => setActiveTestimonial({ ...activeTestimonial, destination: e.target.value })}
                    placeholder="e.g. Frankfurt am Main"
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                  />
                </div>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    Candidate Portrait URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={activeTestimonial.img_url || ""}
                      onChange={(e) => setActiveTestimonial({ ...activeTestimonial, img_url: e.target.value })}
                      placeholder="Optional image URL link"
                      className="flex-1 bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                    />
                    <label className="flex items-center justify-center bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-2xl px-4 py-3.5 text-xs font-bold cursor-pointer transition-all shadow-sm">
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'testimonial')}
                      />
                    </label>
                  </div>
                  {activeTestimonial.img_url && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-champagne/40 bg-[#faf9f6]/40 p-2 shadow-inner">
                      <img src={activeTestimonial.img_url} alt="Candidate portrait preview" className="w-full h-36 object-contain rounded-xl mx-auto" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    YouTube Video Link {isVideoOnly && "*"}
                  </label>
                  <input
                    type="text"
                    required={isVideoOnly}
                    value={activeTestimonial.video_url || ""}
                    onChange={(e) => setActiveTestimonial({ ...activeTestimonial, video_url: e.target.value })}
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                  />
                  {activeTestimonial.video_url && (() => {
                    const ytId = getYouTubeId(activeTestimonial.video_url);
                    if (ytId) {
                      return (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-champagne/45 bg-[#071324] shadow-md aspect-video relative animate-fadeIn">
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                            title="Edit Video Preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {!isVideoOnly && (
                  <div className="pt-2 border-t border-champagne/20 space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Employer Endorsement Info</h4>
                    <div>
                      <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">Employer Company Name *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.employer_company || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, employer_company: e.target.value })}
                        placeholder="e.g. CareGroup Baden-Wuerttemberg"
                        className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">Employer Contact Representative *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.employer_name || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, employer_name: e.target.value })}
                        placeholder="e.g. Dr. Andreas Reinhardt"
                        className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">Employer City *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.employer_city || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, employer_city: e.target.value })}
                        placeholder="e.g. Stuttgart"
                        className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                        Employer Profile Image
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={activeTestimonial.employer_img_url || ""}
                          onChange={(e) => setActiveTestimonial({ ...activeTestimonial, employer_img_url: e.target.value })}
                          placeholder="Optional avatar URL"
                          className="flex-1 bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                        />
                        <label className="flex items-center justify-center bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-2xl px-4 py-3.5 text-xs font-bold cursor-pointer transition-all shadow-sm">
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'employer')}
                          />
                        </label>
                      </div>
                      {activeTestimonial.employer_img_url && (
                        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-champagne/45 bg-[#faf9f6]/40 p-2 shadow-inner">
                          <img
                            src={activeTestimonial.employer_img_url}
                            alt="Employer avatar preview"
                            className="h-10 w-10 rounded-full object-cover border border-champagne"
                          />
                          <span className="text-[10px] text-slate-500 font-mono overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                            {activeTestimonial.employer_img_url}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Translatable areas */}
              {isVideoOnly ? (
                <div className="lg:col-span-2 flex flex-col justify-center items-center border border-dashed border-champagne/70 rounded-[2rem] p-8 bg-[#faf9f6]/40 min-h-[300px]">
                  <div className="text-center max-w-md space-y-4">
                    <div className="p-3 bg-amber-50 rounded-full inline-block text-amber-600">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Video-Only Testimonial Preview</h4>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      This testimonial will render as a large, centered YouTube player with no text or quotes.
                    </p>
                    
                    {/* Real-time YouTube player preview inside the admin panel */}
                    {(() => {
                      const ytId = activeTestimonial.video_url ? getYouTubeId(activeTestimonial.video_url) : null;
                      if (ytId) {
                        return (
                          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-champagne shadow-md bg-navy-deep mt-4">
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                              title="YouTube Preview"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center text-xs text-slate-400 bg-white mt-4">
                            Enter a valid YouTube video link on the left to see the player preview here.
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-champagne/35 lg:pl-8">
                  
                  {/* EN Column */}
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 text-[8px] font-extrabold text-[#0c1c30] bg-[#f5f0e6] border border-[#e8dfc8] px-3 py-1 rounded-full uppercase tracking-wider">
                      🇬🇧 English Relocation Details
                    </span>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Candidate Role *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.role_en || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, role_en: e.target.value })}
                        placeholder="e.g. ICU Registered Nurse"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Sourcing Sector *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.sector_en || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, sector_en: e.target.value })}
                        placeholder="e.g. Healthcare Placements"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Employer Review Quote *</label>
                      <textarea
                        required={!isVideoOnly}
                        rows={3}
                        value={activeTestimonial.quote_en || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, quote_en: e.target.value })}
                        placeholder="B2B client feedback quote"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Employer Reviewer Role *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.employer_role_en || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, employer_role_en: e.target.value })}
                        placeholder="e.g. Director of Human Resources"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">
                        Milestone Milestones (1 per line) *
                      </label>
                      <textarea
                        rows={4}
                        required={!isVideoOnly}
                        value={
                          Array.isArray(activeTestimonial.milestones_en)
                            ? activeTestimonial.milestones_en.join("\n")
                            : typeof activeTestimonial.milestones_en === "string"
                              ? activeTestimonial.milestones_en
                              : ""
                        }
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, milestones_en: e.target.value.split("\n") })}
                        placeholder="e.g.&#10;Language Academy: Completed B2 Certificate&#10;Deficit Assessment: Mapped & Verified&#10;Work Authorization: Issued via Fast-Track"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* DE Column */}
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 text-[8px] font-extrabold text-[#0c1c30] bg-[#f5f0e6] border border-[#e8dfc8] px-3 py-1 rounded-full uppercase tracking-wider">
                      🇩🇪 German Relocation Details
                    </span>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Berufsbezeichnung *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.role_de || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, role_de: e.target.value })}
                        placeholder="z.B. Intensivpfleger / Krankenschwester"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Sektor *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.sector_de || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, sector_de: e.target.value })}
                        placeholder="z.B. Pflegekräftevermittlung"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Arbeitgeberzitat *</label>
                      <textarea
                        required={!isVideoOnly}
                        rows={3}
                        value={activeTestimonial.quote_de || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, quote_de: e.target.value })}
                        placeholder="Kundenfeedback (Deutsch)"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Position des Reviewers *</label>
                      <input
                        type="text"
                        required={!isVideoOnly}
                        value={activeTestimonial.employer_role_de || ""}
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, employer_role_de: e.target.value })}
                        placeholder="z.B. Pflegedienstleiter / HR-Leiter"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">
                        Meilensteine (1 pro Zeile) *
                      </label>
                      <textarea
                        rows={4}
                        required={!isVideoOnly}
                        value={
                          Array.isArray(activeTestimonial.milestones_de)
                            ? activeTestimonial.milestones_de.join("\n")
                            : typeof activeTestimonial.milestones_de === "string"
                              ? activeTestimonial.milestones_de
                              : ""
                        }
                        onChange={(e) => setActiveTestimonial({ ...activeTestimonial, milestones_de: e.target.value.split("\n") })}
                        placeholder="z.B.&#10;Sprachakademie: B2-Zertifikat abgeschlossen&#10;Gleichwertigkeitsprüfung: Anerkennungsbescheid erhalten&#10;Arbeitserlaubnis: Fast-Track-Visum erteilt"
                        className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      ) : (
        /* CARDS LIST */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {testimonials.map((test) => {
            const ytId = test.video_url ? getYouTubeId(test.video_url) : null;
            return (
              <div key={test.id} className="group glass-luxe rounded-[2.5rem] border border-white/80 shadow-soft hover:shadow-luxe hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between overflow-hidden bg-white/60">
                
                {/* Main Card Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Candidate Profile Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                      {test.img_url ? (
                        <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-champagne shadow-sm shrink-0">
                          <img src={test.img_url} alt={test.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-[#faf6ee] border-2 border-champagne/80 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                          {test.flag || "🇩🇪"}
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-bold text-navy-deep font-sans leading-snug">{test.name}</h4>
                        <p className="text-[11px] text-slate-450 font-semibold tracking-wide mt-0.5">
                          {test.flag || "🇩🇪"} {test.origin} &rarr; <span className="text-teal font-bold">{test.destination}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-light mt-0.5">
                          {test.role_en || "Video-Only Testimonial"}
                        </p>
                      </div>
                    </div>
                    
                    <span className="inline-block px-3 py-1 bg-amber-50/80 border border-amber-100/50 text-[#b45309] text-[9px] font-extrabold uppercase tracking-wider rounded-full shadow-sm shrink-0">
                      {test.sector_en || "Video-Only"}
                    </span>
                  </div>

                  {/* Video Preview Block (if video_url is present) */}
                  {ytId && (
                    <div className="relative w-full aspect-video rounded-2xl border border-champagne/60 bg-[#071324] overflow-hidden shadow-md group/video">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                        title={`Video preview of ${test.name}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Review Quote Block with Employer Profile Image */}
                  {(test.quote_en || test.employer_name) && (
                    <div className="relative bg-[#faf9f6]/95 border border-champagne/30 rounded-[1.8rem] p-5 shadow-sm space-y-4">
                      {test.quote_en && (
                        <div>
                          <span className="absolute top-2 right-4 text-4xl font-serif text-amber-600/10 select-none pointer-events-none">“</span>
                          <p className="text-[13px] font-serif-it font-light text-navy/90 leading-relaxed italic pr-4">
                            "{test.quote_en}"
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t border-champagne/20 flex items-center gap-3">
                        {test.employer_img_url ? (
                          <img
                            src={test.employer_img_url}
                            alt={test.employer_name}
                            className="h-10 w-10 rounded-full object-cover border-2 border-champagne shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-amber-100 text-[#b45309] flex items-center justify-center font-bold text-[12px] border border-champagne shrink-0">
                            {test.employer_name ? test.employer_name[0] : "?"}
                          </div>
                        )}
                        <div className="leading-tight">
                          <h5 className="font-bold text-[12px] text-navy-deep">{test.employer_name}</h5>
                          <p className="text-[10px] text-teal font-semibold mt-0.5">
                            {test.employer_company} &bull; <span className="text-slate-400 font-light">{test.employer_role_en}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Milestones Preview */}
                  {Array.isArray(test.milestones_en) && test.milestones_en.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Integration Journey:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {test.milestones_en.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[9.5px] text-[#475569] bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-full">
                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mx-6 sm:mx-8 mb-6 sm:mb-8 pt-4 border-t border-champagne/30 flex justify-between items-center shrink-0">
                  <div className="flex gap-2">
                    <span className="inline-block px-3 py-1 bg-[#f5f0e6] border border-champagne/60 text-[#b45309] text-[9.5px] font-bold rounded-full">
                      ID: {test.id}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTestimonial(test)}
                      title="Edit Placement Profile"
                      className="p-2 bg-white hover:bg-amber-50 border border-champagne hover:border-amber-250 rounded-xl text-slate-555 hover:text-[#b45309] transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTestimonial(test.id)}
                      title="Delete Profile"
                      className="p-2 bg-red-50/50 hover:bg-red-100/80 border border-red-200/50 hover:border-red-300/50 rounded-xl text-red-600 transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
