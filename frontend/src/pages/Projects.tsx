import { useCallback, useEffect, useState } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import MotionSection from "@/components/MotionSection";
import GooeyButton from "@/components/GooeyButton";
import TextReveal from "@/components/TextReveal";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ApiProject {
  _id: string; title: string; category: string; description: string;
  tech: string[]; liveUrl: string; features: string[]; status: string; client: string; image: string;
}

const statusColors: Record<string, string> = {
  Completed: "bg-green-500/10 text-green-400 border-green-500/20",
  Active: "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const tagColors = ["primary", "secondary", "accent"] as const;

const defaultStats = [
  { val: "50+", label: "Projects Delivered", color: "primary" },
  { val: "30+", label: "Happy Clients", color: "accent" },
  { val: "98%", label: "On-Time Delivery", color: "primary" },
  { val: "4.9★", label: "Average Rating", color: "accent" },
];

const Projects = () => {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteData();
  const navigate = useNavigate();

  const loadProjects = useCallback(() => {
    fetchPublic<ApiProject[]>("/api/projects")
      .then((data) => {
        setProjects(
          Array.isArray(data)
            ? data.map((p) => ({ ...p, image: resolveMediaUrl(p.image) }))
            : []
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useSiteDataRefresh(["projects", "settings", "all"], loadProjects, [loadProjects]);

  const stats = [
    { val: settings.proj_stat1_val || defaultStats[0].val, label: settings.proj_stat1_label || defaultStats[0].label, color: "primary" },
    { val: settings.proj_stat2_val || defaultStats[1].val, label: settings.proj_stat2_label || defaultStats[1].label, color: "accent" },
    { val: settings.proj_stat3_val || defaultStats[2].val, label: settings.proj_stat3_label || defaultStats[2].label, color: "primary" },
    { val: settings.proj_stat4_val || defaultStats[3].val, label: settings.proj_stat4_label || defaultStats[3].label, color: "accent" },
  ];

  return (
    <Layout>
      <PageHeader title="Our Projects" subtitle="Explore our successful deliveries across various industries." />

      {/* Stats */}
      <section className="py-8 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-card/30 to-secondary/5" />
        <div className="relative container grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {stats.map((s, i) => (
            <MotionSection key={s.label} delay={i * 0.1} animation="skew-up">
              <div className="text-center glass rounded-xl md:rounded-2xl p-4 md:p-8 hover:glow-border-strong transition-all duration-500 border-border group">
                <div className={`text-2xl md:text-4xl font-heading font-black text-${s.color} mb-1 md:mb-2`}>{s.val}</div>
                <div className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">{s.label}</div>
              </div>
            </MotionSection>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-10 md:py-24 bg-background relative overflow-hidden">
        <div className="container relative">
          <div className="text-center mb-8 md:mb-20">
            <MotionSection animation="parallax-reveal">
              <span className="text-primary text-xs md:text-sm font-bold uppercase tracking-[0.3em]">Portfolio</span>
              <TextReveal text="Our Work" className="text-2xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 md:mt-4 justify-center" />
              <p className="text-muted-foreground mt-3 md:mt-6 text-xs md:text-lg font-light max-w-2xl mx-auto px-2">
                Click any project to see full details, tech stack, and features.
              </p>
            </MotionSection>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-5xl mb-4">🚀</div>
              <p className="text-xl font-semibold">No projects yet.</p>
              <p className="text-sm mt-2">Add projects from the admin dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {projects.map((p, i) => (
                <AnimatedSection key={p._id} delay={i * 80} animation="card-rise">
                  <div
                    onClick={() => navigate(`/projects/${p._id}`)}
                    className="group cursor-pointer h-full bg-card rounded-xl md:rounded-3xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-[0_20px_60px_hsl(var(--primary)/0.15)] transition-all duration-500 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-24 md:h-52 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl md:text-5xl">🚀</div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:flex items-center justify-center">
                        <span className="bg-white text-primary font-bold text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                          <ExternalLink size={14} /> View Details
                        </span>
                      </div>
                      {/* Status badge */}
                      <div className="absolute top-1.5 md:top-3 left-1.5 md:left-3">
                        <span className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold border ${statusColors[p.status] || "bg-muted text-muted-foreground border-border"}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-6 flex-1 flex flex-col">
                      <h3 className="font-heading font-bold text-xs md:text-xl text-foreground mb-1 md:mb-2 group-hover:text-primary transition-colors leading-tight">
                        {p.title}
                      </h3>
                      {p.client && (
                        <p className="text-[9px] md:text-xs text-muted-foreground mb-1 md:mb-3 font-medium">Client: {p.client}</p>
                      )}
                      <p className="text-muted-foreground text-[9px] md:text-sm leading-relaxed mb-2 md:mb-5 flex-1 line-clamp-2">
                        {p.description}
                      </p>
                      {/* Tech stack — show fewer on mobile */}
                      <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
                        {p.tech.slice(0, 2).map(t => (
                          <span key={t} className="px-1.5 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg glass text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-wider border border-border">
                            {t}
                          </span>
                        ))}
                        {p.tech.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold text-muted-foreground md:hidden">
                            +{p.tech.length - 2}
                          </span>
                        )}
                        {p.tech.slice(2, 4).map(t => (
                          <span key={t} className="hidden md:inline px-3 py-1 rounded-lg glass text-[10px] font-bold text-muted-foreground uppercase tracking-wider border border-border">
                            {t}
                          </span>
                        ))}
                        {p.tech.length > 4 && (
                          <span className="hidden md:inline px-3 py-1 rounded-lg text-[10px] font-bold text-muted-foreground">
                            +{p.tech.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-32 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-card/50 to-secondary/20" />
        <MotionSection animation="zoom-out" className="container text-center relative z-10 px-4">
          <TextReveal text="Have a Project in Mind?" className="text-2xl md:text-7xl font-heading font-black mb-5 md:mb-8 justify-center leading-tight" />
          <p className="text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-xl font-light leading-relaxed">
            Let's build something amazing together. Our team is ready to bring your vision to life.
          </p>
          <Link to="/contact">
            <GooeyButton color="primary" className="!px-8 md:!px-12 !py-3 md:!py-5 text-sm md:text-lg">
              Start a Project <ArrowRight size={18} className="inline ml-2" />
            </GooeyButton>
          </Link>
        </MotionSection>
      </section>
    </Layout>
  );
};

export default Projects;
