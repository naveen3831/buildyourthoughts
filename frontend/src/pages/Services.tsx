import { useCallback, useEffect, useState } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import MotionSection from "@/components/MotionSection";
import GooeyButton from "@/components/GooeyButton";
import PhoneMockup from "@/components/PhoneMockup";
import EcommerceScreen from "@/components/phone-screens/EcommerceScreen";
import DashboardScreen from "@/components/phone-screens/DashboardScreen";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import { Code, Cloud, Shield, Cpu, Smartphone, Database, Globe, Settings, BarChart, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAssets } from "@/hooks/useAssets";
import { toSlug } from "./ServiceDetail";

interface ApiService {
  _id: string; title: string; description: string; icon: string;
  color: string; features: string[]; order: number;
}

const iconMap: Record<string, React.ElementType> = {
  Code, Cloud, Shield, Cpu, Smartphone, Database, Globe, Settings, BarChart, Zap,
};

const defaultServices = [
  { icon: Code, title: "Web Development", desc: "Custom web applications using React, Node.js, and modern frameworks.", color: "primary" },
  { icon: Smartphone, title: "Mobile Development", desc: "Native and cross-platform mobile apps for iOS and Android.", color: "secondary" },
  { icon: Cloud, title: "Cloud Solutions", desc: "AWS, Azure, and GCP cloud architecture, migration, and management.", color: "accent" },
  { icon: Shield, title: "Cybersecurity", desc: "Security audits, penetration testing, and compliance solutions.", color: "primary" },
  { icon: Cpu, title: "AI & Machine Learning", desc: "Intelligent automation, NLP, computer vision, and predictive analytics.", color: "secondary" },
  { icon: Database, title: "Data Engineering", desc: "Data pipelines, warehousing, and real-time analytics platforms.", color: "accent" },
  { icon: Globe, title: "Digital Marketing", desc: "SEO, SEM, social media, and content marketing strategies.", color: "primary" },
  { icon: Settings, title: "DevOps & CI/CD", desc: "Automated deployment pipelines and infrastructure as code.", color: "secondary" },
  { icon: BarChart, title: "IT Consulting", desc: "Strategic technology roadmaps and digital transformation advisory.", color: "accent" },
];

const Services = () => {
  const { webShowcase } = useAssets();
  const { get } = useSiteData();
  const [apiServices, setApiServices] = useState<ApiService[]>([]);

  const loadServices = useCallback(() => {
    fetchPublic<ApiService[]>("/api/services")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setApiServices(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useSiteDataRefresh(["services", "content", "all"], loadServices, [loadServices]);

  const sc = (key: string, fallback: string) => get(key, fallback);

  const process = [
    { step: "01", title: sc("process_step1_title", "Discovery"), desc: sc("process_step1_desc", "We understand your goals, challenges, and requirements.") },
    { step: "02", title: sc("process_step2_title", "Planning"), desc: sc("process_step2_desc", "Detailed roadmap, architecture design, and sprint planning.") },
    { step: "03", title: sc("process_step3_title", "Development"), desc: sc("process_step3_desc", "Agile development with regular demos and feedback loops.") },
    { step: "04", title: sc("process_step4_title", "Delivery"), desc: sc("process_step4_desc", "Testing, deployment, and post-launch support.") },
  ];

  const displayServices = apiServices.length > 0
    ? apiServices.map(s => ({ icon: iconMap[s.icon] || Code, title: s.title, desc: s.description, color: s.color, features: s.features }))
    : defaultServices.map(s => ({ ...s, features: [] }));

  return (
  <Layout>
    <PageHeader title="Our Services" subtitle="Comprehensive IT solutions to power your business growth." />

    {/* Services Grid */}
    <section className="py-12 md:py-24 bg-background relative overflow-hidden">
      <div className="container relative">
        <div className="text-center mb-10 md:mb-20">
          <MotionSection animation="parallax-reveal">
            <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">What We Offer</span>
            <TextReveal
              text="End-to-End IT Solutions"
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold mt-4 mb-4 md:mb-6 justify-center"
            />
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed px-2">
              From strategy to execution, we cover every aspect of your digital journey with cutting-edge technology.
            </p>
          </MotionSection>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {displayServices.map((s, i) => (
            <MotionSection
              key={s.title}
              delay={i * 0.1}
              animation="skew-up"
            >
              <Link to={`/services/${toSlug(s.title)}`} className="block h-full group p-4 md:p-8 rounded-2xl md:rounded-3xl glass hover:glow-border-strong hover:shadow-2xl transition-all duration-700 ease-out-expo card-3d border-white/5 relative overflow-hidden cursor-pointer">
                {/* Spotlight effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className={`w-11 h-11 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-${s.color}/10 flex items-center justify-center mb-4 md:mb-8 group-hover:bg-${s.color}/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-${s.color}/10 relative z-10`}>
                  <s.icon className={`text-${s.color}`} size={20} />
                </div>
                
                <h3 className="font-heading font-bold text-sm md:text-2xl mb-2 md:mb-4 text-foreground group-hover:text-primary transition-colors duration-500 relative z-10 leading-tight">{s.title}</h3>
                <p className="text-muted-foreground text-xs md:text-base leading-relaxed mb-3 md:mb-8 relative z-10 line-clamp-3">{s.desc}</p>
                
                <MagneticButton distance={30} strength={0.2} className="relative z-10">
                  <span className="inline-flex items-center gap-1 md:gap-2 text-primary text-[10px] md:text-[13px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] group-hover:gap-3 transition-all duration-500"
                    style={{ color: "hsl(var(--primary))" }}>
                    Learn More <ArrowRight size={11} />
                  </span>
                </MagneticButton>
              </Link>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>

    {/* Process with Mask Reveal */}
    <section className="py-12 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="relative container">
        <div className="text-center mb-10 md:mb-20">
          <MotionSection animation="parallax-reveal">
            <span className="text-secondary text-xs md:text-sm font-bold uppercase tracking-[0.3em]">How We Work</span>
            <TextReveal 
              text="Our Seamless Process" 
              className="text-xl md:text-4xl lg:text-5xl font-heading font-bold mt-3 md:mt-4 justify-center"
            />
          </MotionSection>
        </div>

        <MotionSection animation="zoom-out">
          <div className="grid grid-cols-4 gap-3 md:gap-12 relative">
            {/* Animated path line — animates when parent MotionSection becomes visible */}
            <div className="absolute top-6 md:top-10 left-[10%] right-[10%] h-[2px] bg-white/5 overflow-hidden z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent origin-left scale-x-0 transition-transform duration-[1500ms] ease-out delay-300 [.opacity-100_&]:scale-x-100" />
            </div>
            {process.map((p, i) => (
              <MotionSection key={p.step} delay={i * 0.1} animation="zoom-out">
                <div className="text-center group relative z-10">
                  <div className="relative w-10 h-10 md:w-20 md:h-20 mx-auto mb-3 md:mb-8">
                    <div className="relative w-10 h-10 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-xs md:text-2xl group-hover:scale-110 transition-all duration-1000">
                      {p.step}
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-[10px] md:text-xl text-foreground mb-1 md:mb-4 group-hover:text-primary transition-colors duration-500 tracking-tight leading-tight">{p.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed text-[9px] md:text-base hidden md:block">{p.desc}</p>
                </div>
              </MotionSection>
            ))}
          </div>
        </MotionSection>
      </div>
    </section>

    {/* Mobile App Showcase with phone mockups */}
    <section className="py-10 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-secondary/5" />
      
      <div className="relative container grid md:grid-cols-2 gap-8 md:gap-20 items-center">
        <MotionSection animation="slide-horizontal">
          <span className="text-secondary text-xs md:text-sm font-bold uppercase tracking-[0.3em]">Mobile Excellence</span>
          <h2 className="text-xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 md:mt-4 mb-4 md:mb-8 text-foreground leading-tight">We Build Apps <br />People <span className="text-secondary">Love</span></h2>
          <p className="text-muted-foreground text-xs md:text-lg leading-relaxed mb-5 md:mb-10 font-light">
            From concept to launch, we create mobile experiences that engage users and drive business results. Our apps are built for performance, security, and scalability.
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-6 mb-5 md:mb-12">
            {["Cross-platform iOS & Android", "Offline-first architecture", "Real-time sync", "Push notifications"].map((f, i) => (
              <AnimatedSection key={f} delay={i * 100} animation="slide-in-left">
                <div className="flex items-center gap-2 md:gap-4 group">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="text-secondary" size={14} />
                  </div>
                  <span className="text-muted-foreground font-medium text-xs md:text-base leading-tight">{f}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="flex gap-3 md:gap-6">
            {[{ val: "200+", label: "Apps Built", color: "primary" }, { val: "4.8★", label: "Rating", color: "accent" }, { val: "1M+", label: "Downloads", color: "primary" }].map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 150} animation="scale-up" className="flex-1">
                <div className="glass rounded-xl md:rounded-2xl p-3 md:p-6 text-center border-white/5">
                  <div className={`text-lg md:text-3xl font-bold text-${s.color} mb-0.5 md:mb-1`}>{s.val}</div>
                  <div className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </MotionSection>

        {/* Phone mockups */}
        <MotionSection animation="zoom-out" className="flex justify-center items-end gap-3 md:gap-6 relative">
          <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full z-0 animate-pulse" />
          <div className="relative z-10">
            <PhoneMockup color="primary" animationClass="animate-float" animationDelay="0s">
              <EcommerceScreen />
            </PhoneMockup>
          </div>
          <div className="mb-8 md:mb-12 relative z-10">
            <PhoneMockup color="secondary" animationClass="animate-float" animationDelay="0.4s">
              <DashboardScreen />
            </PhoneMockup>
          </div>
        </MotionSection>
      </div>
    </section>

    {/* Web showcase with interactive image */}
    <section className="py-10 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container grid md:grid-cols-2 gap-8 md:gap-20 items-center">
        <MotionSection animation="zoom-out" className="order-2 md:order-1">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] border border-white/10 shadow-2xl">
              <img
                src={webShowcase}
                alt="Web development showcase"
                className="w-full h-auto object-cover group-hover:scale-110 transition-all duration-1000 ease-out-expo"
                loading="lazy"
              />
            </div>
          </div>
        </MotionSection>

        <MotionSection animation="skew-up" className="order-1 md:order-2">
          <span className="text-primary text-xs md:text-sm font-bold uppercase tracking-[0.3em]">Web Development</span>
          <h2 className="text-xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 md:mt-4 mb-4 md:mb-8 text-foreground leading-tight">Future-Proof <br /><span className="text-primary">Web Applications</span></h2>
          <p className="text-muted-foreground text-xs md:text-lg leading-relaxed mb-5 md:mb-10 font-light">
            We build high-performance web applications that provide seamless user experiences across all devices. Our tech stack includes React, Next.js, Node.js, and other modern technologies.
          </p>
          <ul className="space-y-2 md:space-y-4 mb-6 md:mb-12">
            {[
              "Progressive Web Apps (PWA)",
              "Server-side Rendering (SSR)",
              "Static Site Generation (SSG)",
              "Headless CMS Integration"
            ].map((item, i) => (
              <AnimatedSection key={item} delay={i * 100} animation="slide-in-right">
                <li className="flex items-center gap-3 md:gap-4 text-muted-foreground group">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shrink-0" />
                  <span className="font-medium text-xs md:text-base">{item}</span>
                </li>
              </AnimatedSection>
            ))}
          </ul>
          <Link to="/contact">
            <GooeyButton color="primary">Discuss Your Project</GooeyButton>
          </Link>
        </MotionSection>
      </div>
    </section>
  </Layout>
  );
};

export default Services;
