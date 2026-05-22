import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import MotionSection from "@/components/MotionSection";
import TextReveal from "@/components/TextReveal";
import PhoneMockup from "@/components/PhoneMockup";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EcommerceScreen = lazy(() => import("@/components/phone-screens/EcommerceScreen"));
const FitnessScreen = lazy(() => import("@/components/phone-screens/FitnessScreen"));
const DashboardScreen = lazy(() => import("@/components/phone-screens/DashboardScreen"));
const FoodScreen = lazy(() => import("@/components/phone-screens/FoodScreen"));
const SocialScreen = lazy(() => import("@/components/phone-screens/SocialScreen"));
const FintechScreen = lazy(() => import("@/components/phone-screens/FintechScreen"));

const PhoneFallback = () => <div className="w-full h-full bg-slate-800 rounded-2xl" />;

const colors: ("primary" | "secondary" | "accent")[] = ["primary", "secondary", "accent", "primary", "secondary", "accent"];
const delays = ["0s", "0.3s", "0.6s", "0.9s", "1.2s", "1.5s"];
const defaultScreens = [EcommerceScreen, FitnessScreen, DashboardScreen, FoodScreen, SocialScreen, FintechScreen];

interface ApiPhone {
  _id: string;
  image: string;
  label: string;
  color: "primary" | "secondary" | "accent";
  order: number;
}

const MobileShowcase = () => {
  const [apiPhones, setApiPhones] = useState<ApiPhone[]>([]);

  const loadPhones = useCallback(() => {
    fetchPublic<ApiPhone[]>("/api/phone-showcase")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setApiPhones(
            data.map((p) => ({ ...p, image: resolveMediaUrl(p.image) }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadPhones();
  }, [loadPhones]);

  useSiteDataRefresh(["phones", "all"], loadPhones, [loadPhones]);

  const useApi = apiPhones.length > 0;

  // On mobile show 3 phones, on desktop show all 6
  const mobileCount = 3;

  return (
    <section className="py-16 md:py-32 overflow-hidden relative bg-background section-optimized">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="relative container">
        <MotionSection className="text-center mb-10 md:mb-20" animation="parallax-reveal">
          <span className="text-primary text-sm font-black uppercase tracking-[0.3em] mb-3 md:mb-4 block">Portfolio</span>
          <TextReveal
            text="Our Latest Masterpieces"
            className="text-2xl md:text-6xl font-heading font-black justify-center mb-3 md:mb-6"
          />
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-xl font-light leading-relaxed px-4 md:px-0">
            We build stunning mobile apps and web solutions that redefine user experience.
          </p>
        </MotionSection>

        <MotionSection animation="bounce-up" className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full -z-10" />

          {/* ── Mobile: 3-column grid, no scroll ── */}
          <div className="grid grid-cols-3 gap-2 md:hidden px-2">
            {(useApi ? apiPhones.slice(0, mobileCount) : defaultScreens.slice(0, mobileCount)).map((item, i) => (
              <AnimatedSection key={i} delay={i * 120} animation="bounce-in">
                <div className={i === 1 ? "mt-6" : ""}>
                  {useApi ? (
                    <PhoneMockup
                      color={(item as ApiPhone).color}
                      animationClass="animate-float"
                      animationDelay={delays[i]}
                    >
                      <img
                        src={(item as ApiPhone).image}
                        alt={(item as ApiPhone).label || `App ${i + 1}`}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                    </PhoneMockup>
                  ) : (
                    <PhoneMockup
                      color={colors[i]}
                      animationClass="animate-float"
                      animationDelay={delays[i]}
                    >
                      <Suspense fallback={<PhoneFallback />}>
                        {(() => { const Screen = item as typeof EcommerceScreen; return <Screen />; })()}
                      </Suspense>
                    </PhoneMockup>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* ── Desktop: horizontal flex row, all 6 ── */}
          <div className="hidden md:flex items-end justify-center gap-6 pb-4">
            {(useApi ? apiPhones : defaultScreens).map((item, i) => (
              <AnimatedSection key={i} delay={i * 120} animation="bounce-in">
                <div className={i % 2 === 1 ? "mb-10" : ""}>
                  {useApi ? (
                    <PhoneMockup
                      color={(item as ApiPhone).color}
                      animationClass="animate-float"
                      animationDelay={delays[i % delays.length]}
                    >
                      <img
                        src={(item as ApiPhone).image}
                        alt={(item as ApiPhone).label || `App ${i + 1}`}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                    </PhoneMockup>
                  ) : (
                    <PhoneMockup
                      color={colors[i]}
                      animationClass="animate-float"
                      animationDelay={delays[i]}
                    >
                      <Suspense fallback={<PhoneFallback />}>
                        {(() => { const Screen = item as typeof EcommerceScreen; return <Screen />; })()}
                      </Suspense>
                    </PhoneMockup>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </MotionSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-20">
          {[
            { title: "Mobile App Development", desc: "iOS & Android apps with stunning UI, seamless UX, and world-class performance.", color: "primary" },
            { title: "Web Development", desc: "Responsive websites and web applications built for extreme performance and scale.", color: "secondary" },
            { title: "Full-Stack Solutions", desc: "End-to-end digital products from concept to deployment with modern tech stacks.", color: "accent" },
          ].map((item, i) => (
            <AnimatedSection key={i} delay={i * 150} animation="fade-in-up">
              <div className="text-center group p-5 md:p-8 rounded-2xl md:rounded-3xl glass border-border hover:glow-border transition-all duration-500">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-${item.color}/10 border border-${item.color}/20 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 group-hover:bg-${item.color}/20 transition-all duration-300`}>
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-${item.color} animate-pulse`} />
                </div>
                <h3 className={`text-sm md:text-xl font-heading font-bold mb-2 md:mb-3 group-hover:text-${item.color} transition-colors duration-300 leading-tight`}>{item.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed text-xs md:text-sm">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-16">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-105 transition-all duration-300"
          >
            View All Projects <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
