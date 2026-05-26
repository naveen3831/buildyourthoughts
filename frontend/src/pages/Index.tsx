import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import HeroCarousel from "@/components/HeroCarousel";
import CounterAnimation from "@/components/CounterAnimation";
import MobileShowcase from "@/components/MobileShowcase";
import TextReveal from "@/components/TextReveal";
import GooeyButton from "@/components/GooeyButton";
import MotionSection from "@/components/MotionSection";
import { ArrowRight, Code, Cloud, Shield, Cpu, Users, Zap, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toSlug } from "@/pages/ServiceDetail";
import { useSiteData } from "@/context/SiteDataContext";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";

const defaultStats = [
  { num: 100, suffix: "+", label: "Projects Delivered" },
  { num: 76, suffix: "+", label: "Happy Clients" },
  { num: 200, suffix: "+", label: "Team Members" },
  { num: 9, suffix: "+", label: "Years Experience" },
];

const whyUs = [
  "Custom development tailored to your business needs",
  "Agile methodology with rapid deployment",
  "Enterprise-grade security & 99.9% uptime",
  "Scalable architecture from startup to enterprise",
  "Transparent communication throughout",
  "Dedicated post-launch support & maintenance",
];const defaultTestimonials = [
  { name: "Abdul Hameed", role: "CEO, KSA", text: "BUILD YOUR THOUGHTS has designed solutions for my business at very reasonable prices. They are mavens in providing quality services and offering customer support.", rating: 5 },
  { name: "Arjun M.", role: "CEO, TechStartup", text: "BUILD YOUR THOUGHTS delivered our platform ahead of schedule with exceptional quality. The team was professional and truly understood our vision.", rating: 5 },
  { name: "Ravi K.", role: "Founder, FinEdge", text: "Professional team, transparent process, and outstanding results. They built our fintech app from scratch and it exceeded all expectations.", rating: 5 },
];

const iconMap: Record<string, React.ElementType> = { Code, Cloud, Shield, Cpu, Users, Zap };

const Index = () => {
  const progressRef = useRef<HTMLDivElement>(null);
  const { settings, s, t, get } = useSiteData();
  const [stats, setStats] = useState(defaultStats);
  const [apiServices, setApiServices] = useState<{ icon: React.ElementType; title: string; desc: string; color: string }[]>([]);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  const applyStats = useCallback((data: Record<string, string>) => {
    if (data.stat_projects) {
      setStats([
        { num: parseInt(data.stat_projects) || 100, suffix: data.stat_projects_suffix || "+", label: "Projects Delivered" },
        { num: parseInt(data.stat_clients) || 76, suffix: data.stat_clients_suffix || "+", label: "Happy Clients" },
        { num: parseInt(data.stat_team) || 200, suffix: data.stat_team_suffix || "+", label: "Team Members" },
        { num: parseInt(data.stat_experience) || 9, suffix: data.stat_experience_suffix || "+", label: "Years Experience" },
      ]);
    }
  }, []);

  const loadPageData = useCallback(() => {
    applyStats(settings);
    Promise.allSettled([
      fetchPublic<{ _id: string; title: string; description: string; icon: string; color: string }[]>("/api/services"),
      fetchPublic<{ name: string; role: string; text: string; rating: number }[]>("/api/testimonials"),
    ]).then(([servicesRes, testimonialsRes]) => {
      if (servicesRes.status === "fulfilled" && Array.isArray(servicesRes.value) && servicesRes.value.length > 0) {
        setApiServices(
          servicesRes.value.slice(0, 6).map((item) => ({
            icon: iconMap[item.icon] || Code,
            title: item.title,
            desc: item.description,
            color: item.color || "primary",
          }))
        );
      }
      if (testimonialsRes.status === "fulfilled" && Array.isArray(testimonialsRes.value) && testimonialsRes.value.length > 0) {
        setTestimonials(testimonialsRes.value);
      }
    });
  }, [settings, applyStats]);

  useEffect(() => {
    applyStats(settings);
  }, [settings, applyStats]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  useSiteDataRefresh(["settings", "content", "services", "testimonials", "all"], loadPageData, [loadPageData]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (progressRef.current && scrollHeight) {
            progressRef.current.style.width = `${(window.scrollY / scrollHeight) * 100}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Layout>
      {/* Scroll Progress Bar — direct DOM mutation, zero re-renders */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary z-[100] shadow-[0_0_12px_hsl(var(--primary)/0.6)] transition-[width] duration-150 ease-out"
        style={{ width: "0%" }}
      />

      <HeroCarousel />

      {/* Stats */}
      <section className="relative py-10 md:py-24 overflow-hidden bg-background section-optimized">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-primary/5 blur-3xl rounded-full pointer-events-none" aria-hidden />
        <MotionSection animation="bounce-up" className="relative container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 120} animation="elastic-in">
              <div className="text-center group relative p-5 md:p-8 rounded-[2rem] bg-slate-950/10 border border-primary/15 shadow-[0_20px_50px_hsl(var(--primary)/0.06)] hover:bg-slate-950/15 hover:scale-105 transition-all duration-500 overflow-hidden">
                <div className="text-3xl md:text-6xl font-heading font-black text-gradient mb-1 md:mb-3">
                  <CounterAnimation target={s.num} suffix={s.suffix} />
                </div>
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground leading-tight">
                  {s.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </MotionSection>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-24 bg-background relative overflow-hidden section-optimized">
        <div className="absolute -right-20 top-20 w-64 h-64 bg-accent/8 rounded-full blur-2xl pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-line-grow origin-left" />
        <div className="container relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <AnimatedSection animation="fade-in-up">
              <span className="text-primary text-sm font-black uppercase tracking-[0.3em]">{t("services_label", "What We Do")}</span>
            </AnimatedSection>
            <TextReveal text={get("services_title", "Innovation & Excellence")} className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black mt-4 mb-4 md:mb-6 justify-center leading-tight" />
            <AnimatedSection delay={200}>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed px-2">
                End-to-end IT solutions tailored to your business needs, powered by innovation and expertise.
              </p>
            </AnimatedSection>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {apiServices.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 100} animation="bounce-in">
                <Link to={`/services/${toSlug(s.title)}`} className="group h-full block p-5 md:p-8 rounded-[2rem] glass hover:glow-border-strong hover:shadow-[0_20px_70px_hsl(var(--primary)/0.08)] hover:-translate-y-2 transition-all duration-500 border border-primary/15 relative overflow-hidden card-3d">
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 border border-primary/20">
                    <s.icon className="text-primary" size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-sm md:text-xl mb-2 md:mb-3 text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">{s.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm font-light leading-relaxed mb-4 md:mb-6 line-clamp-3">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 md:gap-2 text-primary text-[10px] md:text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Explore <ArrowRight size={12} />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <MobileShowcase />

      {/* Why Choose Us with Rotate-In and Skew */}
      <section className="py-16 md:py-32 bg-background relative overflow-hidden section-optimized">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <MotionSection animation="skew-up">
            <span className="text-primary font-black text-sm uppercase tracking-[0.3em] mb-4 md:mb-6 block">{get("home_whyus_label", get("whyus_label", "Why Choose Us"))}</span>
            <TextReveal
              text={get("home_whyus_title", get("whyus_title", "Delivering Excellence In Every Project"))}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black mb-8 md:mb-12 leading-tight"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
              {[1,2,3,4,5,6].map(n => {
                const point = get(`whyus_point${n}`, whyUs[n-1] || "");
                if (!point) return null;
                return (
                  <AnimatedSection key={n} delay={n * 80} animation="slide-in-left">
                    <div className="flex items-start gap-3 md:gap-5 group">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/30 group-hover:scale-110 transition-all duration-500 border border-secondary/20">
                        <CheckCircle className="text-secondary group-hover:scale-110 transition-transform duration-300" size={18} />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-500 font-medium text-sm md:text-lg leading-tight">{point}</span>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </MotionSection>
          
          <AnimatedSection animation="rotate-in">
            <div className="relative">
              <div className="absolute -inset-20 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/15 rounded-full blur-[120px]" />
              <div className="relative grid grid-cols-2 gap-4 md:gap-8">
                {[
                  { valKey: "whyus_stat1_val", labelKey: "whyus_stat1_label", defaultVal: "99%", defaultLabel: "Satisfaction", color: "primary", delay: 0 },
                  { valKey: "whyus_stat2_val", labelKey: "whyus_stat2_label", defaultVal: "24/7", defaultLabel: "Support", color: "primary", delay: 100 },
                  { valKey: "whyus_stat3_val", labelKey: "whyus_stat3_label", defaultVal: "100+", defaultLabel: "Tech Stack", color: "accent", delay: 200 },
                  { valKey: "whyus_stat4_val", labelKey: "whyus_stat4_label", defaultVal: "50+", defaultLabel: "Partners", color: "accent", delay: 300 },
                ].map((item, i) => (
                  <AnimatedSection key={i} delay={item.delay} animation="bounce-in">
                  <div 
                    className={cn(
                      "glass rounded-2xl md:rounded-[2.5rem] p-5 md:p-10 hover:glow-border-strong hover:scale-105 transition-all duration-700 border border-primary/15 bg-slate-950/10 shadow-[0_20px_50px_hsl(var(--primary)/0.06)]",
                      i % 2 === 1 ? "mt-6 md:mt-12" : ""
                    )}
                  >
                    <div className={`text-3xl md:text-5xl font-heading font-black text-${item.color} mb-2 md:mb-4`}>{s(item.valKey, item.defaultVal)}</div>
                    <div className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.15em] md:tracking-[0.2em]">{s(item.labelKey, item.defaultLabel)}</div>
                  </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials with Card-Rise */}
      <section className="py-16 md:py-32 relative overflow-hidden bg-background section-optimized">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background" />
        <div className="relative container">
          <div className="text-center mb-12 md:mb-24">
            <AnimatedSection animation="reveal-text">
              <span className="text-primary text-sm font-black uppercase tracking-[0.3em]">{get("testimonials_label", "Testimonials")}</span>
            </AnimatedSection>
            <TextReveal
              text={get("testimonials_title", "What Our Clients Say")}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black mt-4 md:mt-6 justify-center"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
            {testimonials.map((testimonial, i) => (
              <AnimatedSection key={i} delay={i * 150} animation="blur-in">
                <div className="glass rounded-xl md:rounded-[2.5rem] p-4 md:p-10 hover:glow-border-strong hover:-translate-y-2 transition-all duration-700 h-full flex flex-col border border-primary/15 bg-slate-950/10 shadow-[0_20px_60px_hsl(var(--primary)/0.06)] group relative overflow-hidden card-3d">
                  <div className="flex gap-1 md:gap-2 mb-3 md:mb-8 relative z-10">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-xs md:text-xl flex-1 italic leading-relaxed relative z-10 font-light">
                    "{testimonial.text}"
                  </p>
                  <div className="mt-4 md:mt-10 pt-3 md:pt-8 border-t border-primary/15 flex items-center gap-2 md:gap-6 relative z-10">
                    <div className="w-8 h-8 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-primary/10 flex items-center justify-center font-heading font-black text-sm md:text-2xl text-primary shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-xs md:text-lg text-foreground truncate">{testimonial.name}</div>
                      <div className="text-[9px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.1em] md:tracking-[0.2em] truncate">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-32 relative overflow-hidden bg-background section-optimized">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-accent/8 to-secondary/15" />
        <MotionSection animation="reveal-from-center" className="container text-center relative z-10 px-4">
          <TextReveal
            text={t("cta_title", "Ready to Transform Your Business?")}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-black mb-6 md:mb-8 justify-center leading-tight tracking-tighter"
          />
          <p className="text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto text-sm md:text-xl font-light leading-relaxed">
            {get("cta_subtitle", get("home_cta_subtitle", "Let's discuss how BUILD YOUR THOUGHTS can accelerate your digital journey and bring your vision to life."))}
          </p>
          <div className="flex justify-center">
            <GooeyButton color="primary">
              <Link to="/contact" className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-5 font-black text-sm md:text-lg uppercase tracking-widest">
                Get Started Now <ArrowRight size={18} />
              </Link>
            </GooeyButton>
          </div>
        </MotionSection>
      </section>
    </Layout>
  );
};


export default Index;
