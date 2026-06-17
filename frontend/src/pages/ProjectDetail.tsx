import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, ExternalLink, CheckCircle, Tag, User, Layers } from "lucide-react";

interface Project {
  _id: string; title: string; category: string; description: string;
  tech: string[]; liveUrl: string; features: string[]; status: string; client: string; image: string;
}

const statusColors: Record<string, string> = {
  Completed: "bg-green-500/10 text-green-500 border-green-500/20",
  Active: "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </Layout>
  );

  if (!project) return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Project not found</h2>
        <button onClick={() => navigate("/projects")} className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold">
          <ArrowLeft size={18} /> Back to Projects
        </button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* Back button */}
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full glass border border-border text-muted-foreground font-bold text-sm hover:text-foreground hover:border-primary/30 transition-all duration-300 mb-6 md:mb-8 w-fit"
        >
          <ArrowLeft size={16} /> Back to Projects
        </button>

        {/* Project Title */}
        <div className="mb-6 md:mb-10">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
            <span className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest border ${statusColors[project.status] || "bg-muted text-muted-foreground border-border"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {project.status}
            </span>
            <span className="text-muted-foreground text-xs md:text-sm font-medium">{project.category}</span>
            {project.client && <span className="text-muted-foreground text-xs md:text-sm">· Client: <span className="text-foreground font-semibold">{project.client}</span></span>}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black text-foreground leading-tight">
            {project.title}
          </h1>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">

          {/* LEFT — Project Image */}
          <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-border shadow-2xl group hover:shadow-[0_0_60px_hsl(var(--primary)/0.2)] transition-all duration-700 lg:sticky lg:top-28">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700"
              />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl rounded-3xl">
                🚀
              </div>
            )}
          </div>

          {/* RIGHT — All Details */}
          <div className="space-y-8">

            {/* Description */}
            <div>
              <h2 className="text-xl font-heading font-black text-foreground mb-3">About This Project</h2>
              <p className="text-muted-foreground text-base leading-relaxed font-light">{project.description}</p>
            </div>

            {/* Project Info */}
            <div className="glass rounded-2xl p-6 border border-border space-y-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-2">Project Info</h3>

              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Layers size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                  <span className={`inline-flex px-3 py-0.5 rounded-full text-[11px] font-bold border mt-0.5 ${statusColors[project.status] || "bg-muted text-muted-foreground border-border"}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {project.client && (
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                    <User size={15} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Client</p>
                    <p className="text-foreground font-bold mt-0.5">{project.client}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Tag size={15} className="text-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category</p>
                  <p className="text-foreground font-bold mt-0.5">{project.category}</p>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            {project.tech.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="px-4 py-2 rounded-xl glass text-[11px] font-bold text-foreground uppercase tracking-wider border border-border hover:border-primary/40 hover:text-primary transition-all duration-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {project.features?.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-3">Key Features</h3>
                <div className="space-y-3">
                  {project.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl glass border border-border hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group">
                      <CheckCircle size={16} className="text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-foreground text-sm font-medium leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-[1.02] transition-all duration-300"
                >
                  <ExternalLink size={16} /> Visit Live Project
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
