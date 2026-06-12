import React from "react";
import { useAdminEngine } from "./engines/useAdminEngine";
import { LoginView } from "./components/LoginView";
import { Layout } from "./components/Layout";
import { DashboardView } from "./components/DashboardView";
import { LeadsView } from "./components/LeadsView";
import { BlogsView } from "./components/BlogsView";
import { TestimonialsView } from "./components/TestimonialsView";
import { FaqsView } from "./components/FaqsView";

export default function App() {
  const engine = useAdminEngine();

  // If checkAuth is still executing and isAuthenticated is null, show a loader
  if (engine.isAuthenticated === null) {
    return (
      <div className="min-h-screen hero-bg flex justify-center items-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-t-amber-600 border-r-amber-600 border-b-champagne border-l-champagne rounded-full animate-spin" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Synchronizing console security credentials...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, render LoginView
  if (engine.isAuthenticated === false) {
    return (
      <LoginView
        password={engine.password}
        setPassword={engine.setPassword}
        isLoggingIn={engine.isLoggingIn}
        handleLogin={engine.handleLogin}
      />
    );
  }

  // Render Layout wrapping the correct active view
  return (
    <Layout
      activeTab={engine.activeTab}
      setActiveTab={engine.setActiveTab}
      stats={engine.stats}
      handleLogout={engine.handleLogout}
      isLoading={engine.isLoading}
    >
      {engine.activeTab === "dashboard" && (
        <DashboardView
          stats={engine.stats}
          setActiveTab={engine.setActiveTab}
          loadStats={engine.loadStats}
          setIsLoading={engine.setIsLoading}
          setActiveBlog={engine.setActiveBlog}
          setActiveTestimonial={engine.setActiveTestimonial}
          setActiveFaq={engine.setActiveFaq}
        />
      )}

      {engine.activeTab === "leads" && (
        <LeadsView
          leads={engine.leads}
          leadsFilter={engine.leadsFilter}
          setLeadsFilter={engine.setLeadsFilter}
          searchTerm={engine.searchTerm}
          setSearchTerm={engine.setSearchTerm}
          selectedLead={engine.selectedLead}
          setSelectedLead={engine.setSelectedLead}
          updateLeadStatus={engine.updateLeadStatus}
          deleteLead={engine.deleteLead}
        />
      )}

      {engine.activeTab === "blogs" && (
        <BlogsView
          blogs={engine.blogs}
          activeBlog={engine.activeBlog}
          setActiveBlog={engine.setActiveBlog}
          saveBlog={engine.saveBlog}
          deleteBlog={engine.deleteBlog}
          handleImageUpload={(e) => engine.handleImageUpload(e, "blog")}
          slugify={engine.slugify}
        />
      )}

      {engine.activeTab === "testimonials" && (
        <TestimonialsView
          testimonials={engine.testimonials}
          activeTestimonial={engine.activeTestimonial}
          setActiveTestimonial={engine.setActiveTestimonial}
          isVideoOnly={engine.isVideoOnly}
          setIsVideoOnly={engine.setIsVideoOnly}
          saveTestimonial={engine.saveTestimonial}
          deleteTestimonial={engine.deleteTestimonial}
          handleImageUpload={(e) => engine.handleImageUpload(e, "testimonial")}
          getYouTubeId={engine.getYouTubeId}
        />
      )}

      {engine.activeTab === "faqs" && (
        <FaqsView
          faqs={engine.faqs}
          activeFaq={engine.activeFaq}
          setActiveFaq={engine.setActiveFaq}
          saveFaq={engine.saveFaq}
          deleteFaq={engine.deleteFaq}
          slugify={engine.slugify}
          statsCount={engine.stats?.faqsCount || 0}
        />
      )}
    </Layout>
  );
}
