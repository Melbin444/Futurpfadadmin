export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  created_at: string;
  status: "new" | "contacted" | "archived";
}

export interface Blog {
  id: string;
  category_en: string;
  category_de: string;
  title_en: string;
  title_de: string;
  summary_en: string;
  summary_de: string;
  content_en: string;
  content_de: string;
  author: string;
  date: string;
  read_time_en: string;
  read_time_de: string;
  img_url?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  origin: string;
  flag: string;
  role_en: string;
  role_de: string;
  destination: string;
  sector_en: string;
  sector_de: string;
  quote_en: string;
  quote_de: string;
  employer_name: string;
  employer_role_en: string;
  employer_role_de: string;
  employer_company: string;
  employer_city: string;
  img_url?: string;
  video_url?: string;
  milestones_en: string | string[];
  milestones_de: string | string[];
}

export interface DashboardStats {
  leadsCount: number;
  newLeadsCount: number;
  blogsCount: number;
  testimonialsCount: number;
}

export type TabType = "dashboard" | "leads" | "blogs" | "testimonials";

