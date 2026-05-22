import { useCallback, useEffect, useState } from "react";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { Calendar, ArrowRight, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

interface Post {
  _id: string; title: string; excerpt: string; tag: string; author: string;
  readTime: string; image: string; status: string; featured: boolean; createdAt: string;
}

const defaultPosts = [
  { _id: "1", title: "The Future of AI in Enterprise Software", createdAt: new Date().toISOString(), excerpt: "How artificial intelligence is reshaping enterprise operations and decision-making processes at scale.", tag: "AI", readTime: "5 min", author: "Rajesh K.", image: "", status: "Published", featured: true },
  { _id: "2", title: "Why Cloud-Native Architecture Matters", createdAt: new Date().toISOString(), excerpt: "Benefits of building cloud-native applications for scalability and resilience in modern businesses.", tag: "Cloud", readTime: "4 min", author: "Priya S.", image: "", status: "Published", featured: false },
  { _id: "3", title: "Best Practices for Secure Web Development", createdAt: new Date().toISOString(), excerpt: "Essential security practices every development team should follow to protect users and data.", tag: "Security", readTime: "6 min", author: "Vikram P.", image: "", status: "Published", featured: false },
  { _id: "4", title: "Scaling Your Startup with the Right Tech Stack", createdAt: new Date().toISOString(), excerpt: "Choosing technologies that grow with your business without creating technical debt.", tag: "Strategy", readTime: "3 min", author: "Ananya R.", image: "", status: "Published", featured: false },
  { _id: "5", title: "Introduction to DevOps Culture", createdAt: new Date().toISOString(), excerpt: "How DevOps practices accelerate delivery and improve reliability across engineering teams.", tag: "DevOps", readTime: "5 min", author: "Karthik N.", image: "", status: "Published", featured: false },
  { _id: "6", title: "Data-Driven Decision Making", createdAt: new Date().toISOString(), excerpt: "Leveraging analytics and real-time dashboards to make smarter business decisions.", tag: "Data", readTime: "4 min", author: "Meera G.", image: "", status: "Published", featured: false },
];

const tagColorMap: Record<string, string> = {
  AI: "bg-primary/10 text-primary", Cloud: "bg-secondary/10 text-secondary",
  Security: "bg-accent/10 text-accent", Strategy: "bg-primary/10 text-primary",
  DevOps: "bg-secondary/10 text-secondary", Data: "bg-accent/10 text-accent",
  Technology: "bg-primary/10 text-primary", Mobile: "bg-secondary/10 text-secondary",
  General: "bg-muted text-muted-foreground",
};

const tagTextMap: Record<string, string> = {
  AI: "primary", Cloud: "secondary", Security: "accent", Strategy: "primary",
  DevOps: "secondary", Data: "accent", Technology: "primary", Mobile: "secondary", General: "muted-foreground",
};

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = useCallback(() => {
    fetchPublic<Post[]>("/api/blog")
      .then((data) => setPosts(Array.isArray(data) && data.length > 0 ? data : defaultPosts))
      .catch(() => setPosts(defaultPosts));
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useSiteDataRefresh(["blog", "all"], loadPosts, [loadPosts]);

  const featured = posts.find(p => p.featured) || posts[0];
  const rest = posts.filter(p => p._id !== featured?._id);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Layout>
      <PageHeader title="Blog" subtitle="Insights, tutorials, and industry updates from our team." />

      {/* Featured post */}
      {featured && (
        <section className="py-6 md:py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
          <div className="relative container grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <AnimatedSection animation="slide-in-left">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">Featured</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tagColorMap[featured.tag] || "bg-muted text-muted-foreground"}`}>{featured.tag}</span>
              </div>
              <h2 className="text-lg md:text-3xl font-heading font-bold text-foreground mb-2 md:mb-3 hover:text-primary transition-colors cursor-pointer leading-tight">{featured.title}</h2>
              <p className="text-muted-foreground text-xs md:text-base mb-3 md:mb-5 leading-relaxed line-clamp-2 md:line-clamp-none">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground mb-3 md:mb-5">
                <span className="flex items-center gap-1"><User size={10} /> {featured.author}</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(featured.createdAt)}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {featured.readTime}</span>
              </div>
              <Link to={`/blog/${featured._id}`}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-primary text-primary-foreground text-xs md:text-sm font-semibold hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105">
                Read Article <ArrowRight size={12} />
              </Link>
            </AnimatedSection>

            <AnimatedSection animation="slide-in-right">
              <div className="relative group">
                {featured.image ? (
                  <img src={featured.image} alt={featured.title}
                    className="relative rounded-xl md:rounded-2xl w-full object-cover shadow-2xl group-hover:scale-[1.02] transition-all duration-500 max-h-40 md:max-h-64" />
                ) : (
                  <div className="relative rounded-xl md:rounded-2xl w-full h-32 md:h-48 glass border border-border flex items-center justify-center text-4xl md:text-6xl">📝</div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-8 md:py-12 pb-12 md:pb-20 bg-background relative overflow-hidden">
        <div className="container relative">
          <AnimatedSection className="mb-6 md:mb-10">
            <span className="text-secondary text-xs md:text-sm font-semibold uppercase tracking-widest">All Articles</span>
            <h2 className="text-lg md:text-2xl font-heading font-bold mt-1 text-foreground">Latest Posts</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {rest.map((p, i) => (
              <AnimatedSection key={p._id} delay={i * 100} animation={i % 3 === 0 ? "slide-in-left" : i % 3 === 1 ? "fade-in-up" : "slide-in-right"}>
                <Link to={`/blog/${p._id}`} className="group h-full flex flex-col rounded-xl glass hover:glow-border-strong transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden">
                  {p.image && <img src={p.image} alt={p.title} className="w-full h-24 md:h-40 object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="p-3 md:p-6 flex flex-col flex-1">
                    <span className={`text-[9px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full w-fit ${tagColorMap[p.tag] || "bg-muted text-muted-foreground"}`}>{p.tag}</span>
                    <h3 className="font-heading font-semibold text-xs md:text-lg mt-2 mb-1 md:mb-2 text-foreground group-hover:text-primary transition-colors leading-tight">{p.title}</h3>
                    <p className="text-[10px] md:text-sm text-muted-foreground flex-1 leading-relaxed line-clamp-2 md:line-clamp-3">{p.excerpt}</p>
                    <div className="flex items-center gap-2 mt-3 pt-2 md:pt-4 border-t border-border/50 text-[9px] md:text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-0.5"><Calendar size={9} /> {formatDate(p.createdAt)}</span>
                      <span className="flex items-center gap-0.5"><Clock size={9} /> {p.readTime}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] md:text-sm text-${tagTextMap[p.tag] || "primary"} font-medium mt-2 md:mt-3`}>
                      Read More <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Blog;
