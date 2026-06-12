import React from "react";
import { Plus, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Blog } from "../engines/types";

interface BlogsViewProps {
  blogs: Blog[];
  activeBlog: Partial<Blog> | null;
  setActiveBlog: (blog: Partial<Blog> | null) => void;
  saveBlog: (e: React.FormEvent) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'blog') => Promise<void>;
  slugify: (text: string) => string;
}

export function BlogsView({
  blogs,
  activeBlog,
  setActiveBlog,
  saveBlog,
  deleteBlog,
  handleImageUpload,
  slugify,
}: BlogsViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#faf9f6]/80 p-4 border border-champagne/60 rounded-[2rem] shadow-soft">
        <p className="text-xs text-slate-500 font-light max-w-xl">
          Publish relocation guidelines, CEFR language requirements, fast-track §81a procedures, and German integration news.
        </p>
        {!activeBlog && (
          <button
            onClick={() =>
              setActiveBlog({
                id: `post-${Date.now().toString().slice(-4)}`,
                date: new Date().toISOString().split("T")[0],
                author: "Futurpfad Team",
                read_time_en: "5 min read",
                read_time_de: "5 Min. Lesezeit",
              })
            }
            className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-6 py-3.5 bg-[#0c1c30] hover:bg-navy-deep text-white rounded-2xl shadow-md transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 text-amber-400" />
            New Blog Post
          </button>
        )}
      </div>

      {/* BLOG EDITOR PANEL */}
      {activeBlog ? (
        <div className="glass-luxe border border-white/70 rounded-[2.5rem] overflow-hidden shadow-luxe">
          
          <div className="p-6 border-b border-champagne/45 flex justify-between items-center bg-[#faf9f6]/70">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveBlog(null)}
                className="text-slate-400 hover:text-navy p-1 cursor-pointer"
                type="button"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h3 className="text-sm font-bold text-navy uppercase tracking-widest">
                {blogs.some((b) => b.id === activeBlog.id) ? "Modify Blog Article" : "Create Blog Article"}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveBlog(null)}
                className="text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-500 rounded-xl transition-all cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={(e) => saveBlog(e)}
                className="text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white rounded-xl transition-all shadow-sm cursor-pointer"
                type="submit"
              >
                Save & Publish
              </button>
            </div>
          </div>

          <form onSubmit={saveBlog} className="p-8 space-y-6 text-navy">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Meta parameters Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    URL Slug (Identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeBlog.id || ""}
                    onChange={(e) => setActiveBlog({ ...activeBlog, id: e.target.value })}
                    placeholder="e.g. fast-track-visas-81a"
                    disabled={blogs.some((b) => b.id === activeBlog.id)}
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    Publish Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={activeBlog.date || ""}
                    onChange={(e) => setActiveBlog({ ...activeBlog, date: e.target.value })}
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeBlog.author || ""}
                    onChange={(e) => setActiveBlog({ ...activeBlog, author: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-450 uppercase tracking-widest mb-2 pl-1">
                    Illustration Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={activeBlog.img_url || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, img_url: e.target.value })}
                      placeholder="Optional URL illustration link"
                      className="flex-1 bg-[#faf9f6]/70 border border-champagne/70 focus:border-gold focus:ring-1 focus:ring-gold text-navy rounded-2xl px-4 py-3.5 text-xs outline-none transition-all shadow-inner"
                    />
                    <label className="flex items-center justify-center bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-2xl px-4 py-3.5 text-xs font-bold cursor-pointer transition-all shadow-sm">
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'blog')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* English & German Columns */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-champagne/35 lg:pl-8">
                
                {/* EN Column */}
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-[8px] font-extrabold text-[#0c1c30] bg-[#f5f0e6] border border-[#e8dfc8] px-3 py-1 rounded-full uppercase tracking-wider">
                    🇬🇧 English Version
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={activeBlog.category_en || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, category_en: e.target.value })}
                      placeholder="e.g. Legal & Compliance"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={activeBlog.title_en || ""}
                      onChange={(e) => {
                        const updates: any = { title_en: e.target.value };
                        if (!blogs.some((b) => b.id === activeBlog.id) && !activeBlog.id?.startsWith("post-")) {
                          updates.id = slugify(e.target.value);
                        }
                        setActiveBlog({ ...activeBlog, ...updates });
                      }}
                      placeholder="e.g. Fast-Tracking German Work Visas"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Read Time *</label>
                    <input
                      type="text"
                      required
                      value={activeBlog.read_time_en || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, read_time_en: e.target.value })}
                      placeholder="e.g. 5 min read"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Summary (SEO) *</label>
                    <textarea
                      required
                      rows={2}
                      value={activeBlog.summary_en || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, summary_en: e.target.value })}
                      placeholder="Short editorial summary"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Body Content *</label>
                    <textarea
                      required
                      rows={8}
                      value={activeBlog.content_en || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, content_en: e.target.value })}
                      placeholder="Paragraph text..."
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* DE Column */}
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-[8px] font-extrabold text-[#0c1c30] bg-[#f5f0e6] border border-[#e8dfc8] px-3 py-1 rounded-full uppercase tracking-wider">
                    🇩🇪 German Version
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Kategorie *</label>
                    <input
                      type="text"
                      required
                      value={activeBlog.category_de || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, category_de: e.target.value })}
                      placeholder="z.B. Recht & Compliance"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Titel *</label>
                    <input
                      type="text"
                      required
                      value={activeBlog.title_de || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, title_de: e.target.value })}
                      placeholder="z.B. Fast-Track Arbeitsvisa in Deutschland"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Lesezeit *</label>
                    <input
                      type="text"
                      required
                      value={activeBlog.read_time_de || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, read_time_de: e.target.value })}
                      placeholder="z.B. 5 Min. Lesezeit"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Zusammenfassung *</label>
                    <textarea
                      required
                      rows={2}
                      value={activeBlog.summary_de || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, summary_de: e.target.value })}
                      placeholder="Kurze Beschreibung"
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-550 mb-1.5 pl-1">Inhalt *</label>
                    <textarea
                      required
                      rows={8}
                      value={activeBlog.content_de || ""}
                      onChange={(e) => setActiveBlog({ ...activeBlog, content_de: e.target.value })}
                      placeholder="Paragraph..."
                      className="w-full bg-[#faf9f6]/50 border border-champagne/70 focus:border-gold text-navy rounded-xl px-4 py-2.5 text-xs outline-none transition-all font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* ARTICLES LIST */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="glass-luxe p-6.5 rounded-[2rem] border border-white/60 shadow-soft flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wider rounded-full">
                    {blog.category_en}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{blog.date}</span>
                </div>
                <div>
                  <h4 className="text-[16px] font-serif font-bold text-navy-deep leading-snug">{blog.title_en}</h4>
                  <p className="text-[12px] text-slate-550 font-light mt-2 line-clamp-2">{blog.summary_en}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-champagne/20 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-mono">By {blog.author}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveBlog(blog)}
                    className="p-2 bg-white hover:bg-slate-50 border border-champagne rounded-xl text-slate-500 hover:text-navy transition-colors shadow-sm cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    className="p-2 bg-red-50/60 hover:bg-red-100/80 border border-red-200/50 rounded-xl text-red-655 hover:text-red-750 transition-colors shadow-sm cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
