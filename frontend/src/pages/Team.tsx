import { useCallback, useEffect, useState } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import MotionSection from "@/components/MotionSection";
import GooeyButton from "@/components/GooeyButton";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import { Linkedin, Github, Twitter, Users, Award, Globe, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ApiMember {
  _id: string; name: string; role: string; bio: string; initials: string;
  gradient: string; linkedin: string; github: string; twitter: string; image: string;
}

const Team = () => {
  const [apiMembers, setApiMembers] = useState<ApiMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { get } = useSiteData();

  const loadTeam = useCallback(() => {
    fetchPublic<ApiMember[]>("/api/team")
      .then((data) => {
        setApiMembers(Array.isArray(data) ? data : []);
        setLoadingMembers(false);
      })
      .catch(() => setLoadingMembers(false));
  }, []);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  useSiteDataRefresh(["team", "content", "all"], loadTeam, [loadTeam]);

  const sc = (key: string, fallback: string) => get(key, fallback);
  const members = apiMembers.map(m => ({ ...m, icon: Briefcase }));

  return (
  <Layout>
    <PageHeader title="Our Team" subtitle="Meet the talented people behind BUILD YOUR THOUGHTS." />

    {/* Culture */}
    <section className="py-10 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="relative container">
        <div className="text-center mb-8 md:mb-20">
          <MotionSection animation="parallax-reveal">
            <span className="text-primary text-xs md:text-sm font-bold uppercase tracking-[0.3em]">Our Culture</span>
            <TextReveal 
              text="What Makes Us Different" 
              className="text-xl md:text-4xl lg:text-5xl font-heading font-bold mt-3 md:mt-4 justify-center"
            />
          </MotionSection>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {[
            { icon: Users, color: "primary", titleKey: "culture1_title", descKey: "culture1_desc", defaultTitle: "Collaborative", defaultDesc: "We work as one team, sharing knowledge and lifting each other up." },
            { icon: Award, color: "secondary", titleKey: "culture2_title", descKey: "culture2_desc", defaultTitle: "Excellence", defaultDesc: "We hold ourselves to the highest standards in everything we do." },
            { icon: Globe, color: "accent", titleKey: "culture3_title", descKey: "culture3_desc", defaultTitle: "Inclusive", defaultDesc: "Diverse perspectives make us stronger and more innovative." },
          ].map((c, i) => (
            <MotionSection key={i} delay={i * 0.1} animation="skew-up">
              <div className="glass rounded-2xl md:rounded-[2.5rem] p-5 md:p-10 text-center hover:glow-border-strong transition-all duration-700 group border-white/5 relative overflow-hidden h-full">
                <div className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-${c.color}/10 flex items-center justify-center mx-auto mb-4 md:mb-8 group-hover:scale-110 transition-all duration-500 border border-${c.color}/10 relative z-10`}>
                  <c.icon className={`text-${c.color}`} size={18} />
                </div>
                <h3 className="font-heading font-bold text-sm md:text-2xl text-foreground mb-2 md:mb-4 relative z-10">{sc(c.titleKey, c.defaultTitle)}</h3>
                <p className="text-muted-foreground text-xs md:text-base leading-relaxed font-light relative z-10">{sc(c.descKey, c.defaultDesc)}</p>
              </div>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>

    {/* Team Grid */}
    <section className="py-10 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container relative">
        <div className="text-center mb-8 md:mb-20">
          <MotionSection animation="parallax-reveal">
            <span className="text-secondary text-xs md:text-sm font-bold uppercase tracking-[0.3em]">The People</span>
            <TextReveal 
              text="Meet the Team" 
              className="text-xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 md:mt-4 justify-center"
            />
          </MotionSection>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {loadingMembers ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl md:rounded-[3rem] glass border-white/5 p-6 md:p-10 animate-pulse">
                <div className="w-20 h-20 md:w-44 md:h-44 rounded-full bg-white/10 mx-auto mb-4 md:mb-8" />
                <div className="h-4 bg-white/10 rounded-full w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-white/10 rounded-full w-1/2 mx-auto" />
              </div>
            ))
          ) : members.length === 0 ? (
            <div className="col-span-2 md:col-span-3 text-center py-16 text-muted-foreground">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-xl font-semibold">Team members coming soon.</p>
            </div>
          ) : (
            members.map((m, i) => (
            <MotionSection key={m.name} delay={i * 0.1} animation="skew-up">
              <div className="group text-center p-5 md:p-10 rounded-2xl md:rounded-[3rem] glass hover:glow-border-strong transition-all duration-700 border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative inline-block mb-4 md:mb-10">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-20 h-20 md:w-44 md:h-44 mx-auto rounded-full object-cover object-center group-hover:scale-110 transition-all duration-700 relative z-10 border-2 md:border-4 border-primary/30 group-hover:border-primary/70" />
                  ) : (
                    <div className={`w-20 h-20 md:w-44 md:h-44 mx-auto rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xl md:text-5xl font-heading font-black text-primary-foreground group-hover:scale-110 transition-all duration-700 relative z-10 overflow-hidden`}>
                      <span>{m.initials}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-heading font-bold text-sm md:text-2xl text-foreground mb-1 md:mb-2 group-hover:text-primary transition-colors duration-500 leading-tight">{m.name}</h3>
                <p className="text-[9px] md:text-sm text-primary font-black uppercase tracking-widest mb-2 md:mb-4 opacity-80">{m.role}</p>
                <p className="text-muted-foreground text-[10px] md:text-base font-light leading-relaxed mb-4 md:mb-8 line-clamp-2 md:line-clamp-none">{m.bio}</p>
                
                <div className="flex justify-center gap-2 md:gap-4 relative z-10">
                  {[
                    { Icon: Linkedin, url: m.linkedin },
                    { Icon: Github, url: m.github },
                    { Icon: Twitter, url: m.twitter },
                  ].map(({ Icon, url }, j) => (
                    <a key={j} href={url || "#"} target={url ? "_blank" : undefined} rel="noopener noreferrer"
                      className="w-7 h-7 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer border border-white/5">
                      <Icon size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </MotionSection>
          ))
          )}
        </div>
      </div>
    </section>

    {/* Join Us CTA */}
    <section className="py-16 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-card/50 to-secondary/20" />
      
      <MotionSection animation="zoom-out" className="container text-center relative z-10 px-4">
        <TextReveal 
          text="Want to Join Our Team?" 
          className="text-2xl md:text-5xl lg:text-7xl font-heading font-black mb-5 md:mb-8 justify-center"
        />
        <p className="text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-xl font-light leading-relaxed">
          We're always looking for talented people who are passionate about technology and innovation.
        </p>
        <Link to="/career">
          <GooeyButton color="primary">
            View Open Positions <ArrowRight size={18} className="inline ml-1" />
          </GooeyButton>
        </Link>
      </MotionSection>
    </section>
  </Layout>
  );
};

export default Team;
