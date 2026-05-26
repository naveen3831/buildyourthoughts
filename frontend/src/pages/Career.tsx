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
import FitnessScreen from "@/components/phone-screens/FitnessScreen";
import DashboardScreen from "@/components/phone-screens/DashboardScreen";
import TextReveal from "@/components/TextReveal";
import { MapPin, Clock, ArrowRight, DollarSign, Zap, Heart, Coffee, BookOpen, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useAssets } from "@/hooks/useAssets";

interface ApiJob {
  _id: string; title: string; location: string; type: string; salary: string;
  department: string; experience: string; desc: string; requirements: string[]; status: string;
}

const Career = () => {
  const { aboutTeam } = useAssets();  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const { settings, s, get } = useSiteData();

  const loadJobs = useCallback(() => {
    fetchPublic<ApiJob[]>("/api/jobs")
      .then((data) => setApiJobs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useSiteDataRefresh(["jobs", "content", "settings", "all"], loadJobs, [loadJobs]);

  const sc = (key: string, fallback: string) => get(key, fallback);
  const st = (key: string, fallback: string) => s(key, fallback);

  const perks = [
    { icon: Zap, label: sc("perk1_label", "Flexible work hours"), color: "primary" },
    { icon: Heart, label: sc("perk2_label", "Health insurance"), color: "accent" },
    { icon: Coffee, label: sc("perk3_label", "Remote-friendly"), color: "secondary" },
    { icon: BookOpen, label: sc("perk4_label", "Learning budget"), color: "primary" },
  ];

  const jobs = apiJobs;

  return (
  <Layout>
    <PageHeader title="Careers" subtitle="Join our team and shape the future of technology." />

    {/* Culture Section */}
    <section className="py-10 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative container grid md:grid-cols-2 gap-8 md:gap-20 items-center">
        <MotionSection animation="skew-up">
          <span className="text-accent text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-2 md:mb-4 block">Life at BUILD YOUR THOUGHTS</span>
          <TextReveal 
            text="Build Your Career With Us" 
            className="text-xl md:text-5xl font-heading font-bold mb-4 md:mb-8 leading-tight"
          />
          <p className="text-muted-foreground text-xs md:text-lg leading-relaxed mb-5 md:mb-10 font-light max-w-lg">
            We believe in creating an environment where talent thrives. Join a team that values innovation, collaboration, and continuous growth.
          </p>
          
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {perks.map((perk, i) => (
              <AnimatedSection key={perk.label} delay={i * 100} animation="scale-up">
                <div className="flex items-center gap-2 md:gap-4 p-3 md:p-6 rounded-xl md:rounded-2xl glass hover:glow-border-strong transition-all duration-500 group border-white/5">
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-${perk.color}/10 flex items-center justify-center shrink-0 border border-${perk.color}/10`}>
                    <perk.icon className={`text-${perk.color}`} size={15} />
                  </div>
                  <span className="text-xs md:text-base font-medium text-muted-foreground leading-tight">{perk.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </MotionSection>

        {/* Phone mockup */}
        <MotionSection animation="zoom-out" className="flex justify-center relative">
          <div className="relative group">
            <div className="absolute -inset-20 bg-accent/10 blur-[100px] rounded-full z-0 animate-pulse" />
            <div className="relative z-10">
              <PhoneMockup color="accent" animationClass="animate-float" animationDelay="0s" className="shadow-2xl">
                <FitnessScreen />
              </PhoneMockup>
            </div>
          </div>
        </MotionSection>
      </div>
    </section>

    {/* Team photo */}
    <section className="py-10 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container grid md:grid-cols-2 gap-10 md:gap-24 items-center">
        <MotionSection animation="slide-horizontal">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl md:rounded-[3rem] border border-white/10 shadow-2xl">
              <img
                src={aboutTeam}
                alt="BUILD YOUR THOUGHTS team culture"
                className="w-full h-auto object-cover group-hover:scale-110 transition-all duration-1000"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 glass rounded-xl md:rounded-2xl px-4 md:px-8 py-2 md:py-6 glow-border-strong shadow-2xl border-white/10">
              <div className="text-xl md:text-4xl font-black text-accent">100%</div>
              <div className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Remote Friendly</div>
            </div>
          </div>
        </MotionSection>
        
        <MotionSection animation="skew-up">
          <span className="text-primary text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-2 md:mb-4 block">Our Workspace</span>
          <TextReveal 
            text="Where Great Work Happens" 
            className="text-xl md:text-4xl font-heading font-bold mb-4 md:mb-8"
          />
          <p className="text-muted-foreground text-xs md:text-lg leading-relaxed mb-5 md:mb-10 font-light">
            Whether you're in our Hyderabad office or working remotely, you'll have everything you need to do your best work — fast machines, great tools, and an amazing team.
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {[
              { val: `${apiJobs.length || "0"}+`, label: "Open Positions", color: "primary" },
              { val: `${st("stat_team","200")}${st("stat_team_suffix","+")}`, label: "Team Members", color: "accent" },
              { val: "100%", label: "Remote OK", color: "primary" },
              { val: "2017", label: "Founded", color: "accent" },
            ].map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 120} animation="scale-up">
                <div className="glass rounded-xl md:rounded-2xl p-4 md:p-8 text-center border-white/5 group">
                  <div className={`text-2xl md:text-4xl font-heading font-black text-${s.color} mb-1 md:mb-2`}>{s.val}</div>
                  <div className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </MotionSection>
      </div>
    </section>

    {/* Open Positions */}
    <section className="py-10 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container max-w-4xl relative">
        <div className="text-center mb-8 md:mb-20">
          <MotionSection animation="parallax-reveal">
            <span className="text-primary text-xs md:text-sm font-bold uppercase tracking-[0.3em]">Opportunities</span>
            <TextReveal 
              text="Open Positions" 
              className="text-2xl md:text-6xl font-heading font-bold mt-3 md:mt-4 justify-center"
            />
            <p className="text-muted-foreground mt-3 md:mt-6 text-xs md:text-lg font-light px-2">We're always looking for talented people. Check out our current openings.</p>
          </MotionSection>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          {jobs.length === 0 ? (
            <div className="glass rounded-2xl md:rounded-3xl p-8 md:p-16 text-center border-white/5">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">💼</div>
              <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2 md:mb-3">No Open Positions Right Now</h3>
              <p className="text-muted-foreground text-xs md:text-base font-light">We don't have any open roles at the moment, but we're always looking for great talent.</p>
            </div>
          ) : (
          jobs.map((j, i) => (
            <MotionSection key={j.title} delay={i * 0.1} animation="skew-up">
              <div className="group p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] glass hover:glow-border-strong transition-all duration-700 flex flex-col gap-4 md:gap-8 border-white/5 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-base md:text-2xl text-foreground group-hover:text-primary transition-colors duration-500">{j.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-6 text-xs md:text-sm font-medium text-muted-foreground mt-2 md:mt-4">
                    {j.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {j.location}</span>}
                    {j.type && <span className="flex items-center gap-1"><Clock size={12} className="text-secondary" /> {j.type}</span>}
                    {j.salary && <span className="flex items-center gap-1"><DollarSign size={12} className="text-accent" /> {j.salary}</span>}
                    {(j as ApiJob).department && <span className="flex items-center gap-1"><Briefcase size={12} className="text-primary" /> {(j as ApiJob).department}</span>}
                  </div>
                  <p className="text-muted-foreground text-xs md:text-base mt-2 md:mt-4 font-light leading-relaxed line-clamp-2 md:line-clamp-none">{j.desc}</p>
                </div>
                <div className="relative z-10 flex flex-row md:flex-col gap-2 md:gap-3 md:shrink-0">
                  <Link to={`/career/${(j as ApiJob)._id || ""}`} className="flex-1 md:flex-none">
                    <button
                      className="w-full px-4 md:px-8 py-2 md:py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-lg text-white text-xs md:text-sm"
                      style={{ background: "linear-gradient(135deg, #0b78d2, #12b5ff)", boxShadow: "0 4px 20px rgba(11,120,210,0.35)" }}
                    >
                      View Details <ArrowRight size={12} className="inline ml-1" />
                    </button>
                  </Link>
                  <Link to={`/career/${(j as ApiJob)._id || ""}/apply`} className="flex-1 md:flex-none">
                    <GooeyButton color="primary" className="w-full !px-4 md:!px-10 !py-2 md:!py-4 text-xs md:text-[13px]">
                      Apply Now <ArrowRight size={14} className="inline ml-1" />
                    </GooeyButton>
                  </Link>
                </div>
              </div>
            </MotionSection>
          ))
          )}
        </div>
      </div>
    </section>

    {/* Dashboard phone + CTA */}
    <section className="py-16 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-card/50 to-primary/10" />
      
      <div className="relative container grid md:grid-cols-2 gap-8 md:gap-24 items-center">
        <MotionSection animation="skew-up" className="text-center md:text-left">
          <TextReveal 
            text="Don't See a Fit?" 
            className="text-2xl md:text-6xl font-heading font-black mb-4 md:mb-8 leading-tight"
          />
          <p className="text-muted-foreground text-sm md:text-xl font-light leading-relaxed mb-6 md:mb-12 max-w-lg">
            Send us your resume anyway. We're always open to meeting great talent and finding a place for exceptional people.
          </p>
          <Link to="/contact">
            <GooeyButton color="primary">
              Get In Touch <ArrowRight size={18} className="inline ml-2" />
            </GooeyButton>
          </Link>
        </MotionSection>
        
        <MotionSection animation="zoom-out" className="flex justify-center relative">
          <div className="relative group">
            <div className="absolute -inset-20 bg-primary/10 blur-[100px] rounded-full z-0 animate-pulse" />
            <div className="relative z-10">
              <PhoneMockup color="primary" animationClass="animate-float" animationDelay="0.4s" className="shadow-2xl">
                <DashboardScreen />
              </PhoneMockup>
            </div>
          </div>
        </MotionSection>
      </div>
    </section>
  </Layout>
  );
};

export default Career;
