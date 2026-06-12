import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Lead, Blog, Testimonial, Faq, DashboardStats, TabType } from "./types";

function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function useAdminEngine() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentHash, setCurrentHash] = useState<string>(() => {
    const hash = window.location.hash;
    return hash && ["#dashboard", "#leads", "#blogs", "#testimonials", "#faqs"].includes(hash)
      ? hash
      : "#dashboard";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && ["#dashboard", "#leads", "#blogs", "#testimonials", "#faqs"].includes(hash)) {
        setCurrentHash(hash);
      } else {
        setCurrentHash("#dashboard");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const activeTab = currentHash.replace("#", "") as TabType;
  const setActiveTab = (tab: TabType) => {
    window.location.hash = `#${tab}`;
  };

  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Core datasets
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  // Search/Filter states
  const [leadsFilter, setLeadsFilter] = useState<"all" | "new" | "contacted" | "archived">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // CRUD Item states
  const [activeBlog, setActiveBlog] = useState<Partial<Blog> | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isVideoOnly, setIsVideoOnly] = useState(false);

  useEffect(() => {
    if (activeTestimonial) {
      const isVid = !!activeTestimonial.video_url && (!activeTestimonial.role_en || activeTestimonial.role_en.trim() === "");
      setIsVideoOnly(isVid);
    } else {
      setIsVideoOnly(false);
    }
  }, [activeTestimonial]);
  
  const [activeFaq, setActiveFaq] = useState<Partial<Faq> | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadTabContent();
    }
  }, [isAuthenticated, activeTab]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your B2B access key");
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        toast.success("Terminal unlocked successfully");
      } else {
        toast.error(data.error || "Invalid authorization key");
      }
    } catch (err) {
      toast.error("Network error during verification");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to lock the console?")) return;
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setIsAuthenticated(false);
      setPassword("");
      toast.success("Console locked successfully");
    } catch (e) {
      toast.error("Lock sequence failed");
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) {
      console.error("Failed to load metrics");
    }
  };

  const loadTabContent = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "leads") {
        const res = await fetch("/api/leads");
        if (res.ok) setLeads(await res.json());
      } else if (activeTab === "blogs") {
        const res = await fetch("/api/blogs");
        if (res.ok) setBlogs(await res.json());
      } else if (activeTab === "testimonials") {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const raw = await res.json();
          setTestimonials(raw.map((t: any) => ({
            ...t,
            milestones_en: typeof t.milestones_en === "string" ? JSON.parse(t.milestones_en) : t.milestones_en,
            milestones_de: typeof t.milestones_de === "string" ? JSON.parse(t.milestones_de) : t.milestones_de,
          })));
        }
      } else if (activeTab === "faqs") {
        const res = await fetch("/api/faqs");
        if (res.ok) setFaqs(await res.json());
      }
    } catch (e) {
      toast.error(`Error synchronizing ${activeTab} directory`);
    } finally {
      setIsLoading(false);
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const updateLeadStatus = async (id: string, newStatus: Lead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Lead status set to ${newStatus}`);
        setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
        loadStats();
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      } else {
        toast.error("Failed to update status");
      }
    } catch (e) {
      toast.error("Error updating lead status");
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Lead record deleted successfully");
        setLeads(leads.filter((l) => l.id !== id));
        loadStats();
        setSelectedLead(null);
      } else {
        toast.error("Failed to delete lead");
      }
    } catch (e) {
      toast.error("Error deleting lead");
    }
  };

  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBlog) return;
    if (!activeBlog.id || !activeBlog.title_en || !activeBlog.title_de) {
      toast.error("Identifier and titles are required");
      return;
    }

    const isEditing = blogs.some((b) => b.id === activeBlog.id);
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeBlog),
      });

      const data = await res.json();
      if (res.ok && (data.success || !data.error)) {
        toast.success(`Blog article ${isEditing ? "updated" : "published"} successfully`);
        setActiveBlog(null);
        loadTabContent();
        loadStats();
      } else {
        toast.error(data.error || "Failed to save blog article");
      }
    } catch (e) {
      toast.error("Error saving blog article");
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog article deleted");
        loadTabContent();
        loadStats();
      } else {
        toast.error("Failed to delete blog article");
      }
    } catch (e) {
      toast.error("Error deleting blog article");
    }
  };

  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTestimonial) return;
    if (!activeTestimonial.id || !activeTestimonial.name || !activeTestimonial.origin) {
      toast.error("Identifier, name, and origin country are required");
      return;
    }

    const isEditing = testimonials.some((t) => t.id === activeTestimonial.id);
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      ...activeTestimonial,
      role_en: isVideoOnly ? "" : (activeTestimonial.role_en || ""),
      role_de: isVideoOnly ? "" : (activeTestimonial.role_de || ""),
      sector_en: isVideoOnly ? "Healthcare" : (activeTestimonial.sector_en || "Healthcare"),
      sector_de: isVideoOnly ? "Pflege" : (activeTestimonial.sector_de || "Pflege"),
      destination: isVideoOnly ? "Germany" : (activeTestimonial.destination || "Germany"),
      quote_en: isVideoOnly ? "" : (activeTestimonial.quote_en || ""),
      quote_de: isVideoOnly ? "" : (activeTestimonial.quote_de || ""),
      employer_name: isVideoOnly ? "" : (activeTestimonial.employer_name || ""),
      employer_role_en: isVideoOnly ? "" : (activeTestimonial.employer_role_en || ""),
      employer_role_de: isVideoOnly ? "" : (activeTestimonial.employer_role_de || ""),
      employer_company: isVideoOnly ? "" : (activeTestimonial.employer_company || ""),
      employer_city: isVideoOnly ? "" : (activeTestimonial.employer_city || ""),
      flag: activeTestimonial.flag || "🇩🇪",
      origin: activeTestimonial.origin || "Germany",
      milestones_en: isVideoOnly ? [] : (activeTestimonial.milestones_en || []),
      milestones_de: isVideoOnly ? [] : (activeTestimonial.milestones_de || []),
    };

    try {
      const res = await fetch("/api/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && (data.success || !data.error)) {
        toast.success(`Relocation profile ${isEditing ? "updated" : "published"} successfully`);
        setActiveTestimonial(null);
        loadTabContent();
        loadStats();
      } else {
        toast.error(data.error || "Failed to save relocation profile");
      }
    } catch (e) {
      toast.error("Error saving relocation profile");
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this placement profile?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Relocation profile deleted");
        loadTabContent();
        loadStats();
      } else {
        toast.error("Failed to delete relocation profile");
      }
    } catch (e) {
      toast.error("Error deleting relocation profile");
    }
  };

  const saveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFaq) return;
    if (!activeFaq.id || !activeFaq.question_en || !activeFaq.question_de) {
      toast.error("Identifier and questions are required");
      return;
    }

    const isEditing = faqs.some((f) => f.id === activeFaq.id);
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch("/api/faqs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeFaq),
      });

      const data = await res.json();
      if (res.ok && (data.success || !data.error)) {
        toast.success(`FAQ catalog entry ${isEditing ? "updated" : "published"} successfully`);
        setActiveFaq(null);
        loadTabContent();
        loadStats();
      } else {
        toast.error(data.error || "Failed to save FAQ catalog entry");
      }
    } catch (e) {
      toast.error("Error saving FAQ catalog entry");
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ entry?")) return;
    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("FAQ catalog entry deleted");
        loadTabContent();
        loadStats();
      } else {
        toast.error("Failed to delete FAQ catalog entry");
      }
    } catch (e) {
      toast.error("Error deleting FAQ entry");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'blog' | 'testimonial') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        if (type === 'blog') {
          if (activeBlog) {
            setActiveBlog({ ...activeBlog, img_url: data.url });
          }
        } else {
          if (activeTestimonial) {
            setActiveTestimonial({ ...activeTestimonial, img_url: data.url });
          }
        }
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error(data.error || "Upload failed", { id: toastId });
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Network error during image upload", { id: toastId });
    }
  };

  return {
    isAuthenticated,
    setIsAuthenticated,
    currentHash,
    activeTab,
    setActiveTab,
    password,
    setPassword,
    isLoggingIn,
    stats,
    leads,
    blogs,
    testimonials,
    faqs,
    leadsFilter,
    setLeadsFilter,
    searchTerm,
    setSearchTerm,
    activeBlog,
    setActiveBlog,
    activeTestimonial,
    setActiveTestimonial,
    isVideoOnly,
    setIsVideoOnly,
    activeFaq,
    setActiveFaq,
    selectedLead,
    setSelectedLead,
    isLoading,
    setIsLoading,
    checkAuth,
    handleLogin,
    handleLogout,
    loadStats,
    loadTabContent,
    updateLeadStatus,
    deleteLead,
    saveBlog,
    deleteBlog,
    saveTestimonial,
    deleteTestimonial,
    saveFaq,
    deleteFaq,
    handleImageUpload,
    slugify,
    getYouTubeId,
  };
}
