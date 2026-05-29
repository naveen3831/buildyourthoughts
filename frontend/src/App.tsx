import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageReveal from "@/components/PageReveal";
import { ThemeProvider } from "@/context/ThemeContext";
import { AssetsProvider } from "@/context/AssetsContext";
import { SiteDataProvider, useSiteData } from "@/context/SiteDataContext";

import Index from "./pages/Index";

const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Projects = lazy(() => import("./pages/Projects"));
const Blog = lazy(() => import("./pages/Blog"));
const Team = lazy(() => import("./pages/Team"));
const Career = lazy(() => import("./pages/Career"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const JobApply = lazy(() => import("./pages/JobApply"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCarousel = lazy(() => import("./pages/AdminCarousel"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminSubmissions = lazy(() => import("./pages/AdminSubmissions"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"));
const AdminPhoneShowcase = lazy(() => import("./pages/AdminPhoneShowcase"));
import RequireAdminAuth from "./components/RequireAdminAuth";

// Created once — never recreated on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const AppRoutes = () => {
  const { settings, s } = useSiteData();
  const path = window.location.pathname;
  const isAdmin = path.startsWith("/admin");
  const maintenance = settings.maintenance_mode === "true";
  const contactEmail = s("contact_email", "info@buildyourthoughts.com");

  if (maintenance && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white text-center px-6">
        <div className="mb-8 text-6xl">🔧</div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">Under Maintenance</h1>
        <p className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed mb-8">
          We're currently performing scheduled maintenance. We'll be back online shortly. Thank you for your patience!
        </p>
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          Maintenance in progress — check back soon
        </div>
        <p className="mt-8 text-white/30 text-sm">
          For urgent inquiries:{" "}
          <a href={`mailto:${contactEmail}`} className="text-cyan-400 hover:underline">
            {contactEmail}
          </a>
        </p>
      </div>
    );
  }

  return (
    <>
      <PageReveal />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/team" element={<Team />} />
          <Route path="/career" element={<Career />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/carousel"
            element={
              <RequireAdminAuth>
                <AdminCarousel />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <RequireAdminAuth>
                <AdminBlog />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RequireAdminAuth>
                <AdminSettings />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <RequireAdminAuth>
                <AdminSubmissions />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <RequireAdminAuth>
                <AdminTestimonials />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/phone-showcase"
            element={
              <RequireAdminAuth>
                <AdminPhoneShowcase />
              </RequireAdminAuth>
            }
          />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/career/:id" element={<JobDetail />} />
          <Route path="/career/:id/apply" element={<JobApply />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <SiteDataProvider>
      <AssetsProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AssetsProvider>
    </SiteDataProvider>
  </ThemeProvider>
);

export default App;
