import { useState, useEffect, useRef, useCallback } from "react";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

// CSS gradient backgrounds — used when no Cloudinary image is uploaded yet
const GRADIENT_SLIDES = [
  "linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #0f3460 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
  "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 40%, #16213e 100%)",
];

interface ApiSlide {
  _id: string; badge: string; title: string; highlight: string; desc: string;
  ctaText: string; ctaLink: string; cta2Text: string; cta2Link: string;
  image: string; isActive: boolean; order: number;
}

const defaultSlides = [
  { image: "", gradient: GRADIENT_SLIDES[0], badge: "Welcome to the Future of IT", title: "Build Your Digital Future", highlight: "BUILD YOUR THOUGHTS", desc: "Full-stack software, automation, and IT solutions that drive real business growth.", cta: { text: "Our Services", to: "/services" }, cta2: { text: "Get in Touch", to: "/contact" } },
  { image: "", gradient: GRADIENT_SLIDES[1], badge: "Mobile App Development", title: "Stunning Mobile Apps", highlight: "For Every Platform", desc: "We build beautiful, high-performance mobile applications for iOS and Android.", cta: { text: "View Projects", to: "/projects" }, cta2: { text: "Get a Quote", to: "/contact" } },
  { image: "", gradient: GRADIENT_SLIDES[2], badge: "Cloud & Security Solutions", title: "Secure & Scalable", highlight: "Cloud Infrastructure", desc: "Enterprise-grade cybersecurity and cloud solutions to protect and grow your business.", cta: { text: "Learn More", to: "/services" }, cta2: { text: "Contact Us", to: "/contact" } },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [slides, setSlides] = useState(defaultSlides);
  const loadSlides = useCallback(() => {
    fetchPublic<ApiSlide[]>("/api/carousel")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(
            data.map((s, i) => ({
              image: s.image || "",
              gradient: GRADIENT_SLIDES[i % 3],
              badge: s.badge,
              title: s.title,
              highlight: s.highlight,
              desc: s.desc,
              cta: { text: s.ctaText, to: s.ctaLink },
              cta2: { text: s.cta2Text, to: s.cta2Link },
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  useSiteDataRefresh(["carousel", "all"], loadSlides, [loadSlides]);

  const goTo = useCallback((index: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setPrevIdx(current);
    setCurrent(index);
    setTimeout(() => { setPrevIdx(null); setTransitioning(false); }, 600);
  }, [current, transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-[65vh] md:min-h-[95vh] flex items-center justify-center text-center overflow-hidden bg-background -mt-20">
      {slides.map((s, i) => {
        const active = i === current || i === prevIdx;
        if (!active) return null;
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              background: s.image ? undefined : s.gradient,
              backgroundImage: s.image ? `url(${s.image})` : undefined,
              backgroundSize: s.image ? "cover" : undefined,
              backgroundPosition: s.image ? "center" : undefined,
              opacity: i === current ? 1 : 0,
              filter: s.image ? (isLight ? "brightness(0.75) saturate(0.9)" : "brightness(0.55)") : undefined,
            }}
          />
        );
      })}

      {/* Overlay — lighter when using gradient (no image) */}
      <div
        className={`absolute inset-0 ${
          slide.image ? (isLight ? "bg-black/50" : "bg-black/45") : isLight ? "bg-black/25" : "bg-black/20"
        }`}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />

      {/* Content — pt clears the fixed navbar height (navbar ~80px on mobile) */}
      <div className="relative z-10 container px-5 pt-24 md:pt-28 pb-14 md:pb-16">
        <div key={`badge-${current}`} className="animate-fade-in-up mb-4 md:mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/15 border border-white/30 text-white text-xs md:text-sm backdrop-blur-sm">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shrink-0" />
            <span className="truncate max-w-[200px] md:max-w-none">{slide.badge}</span>
            <ArrowRight size={12} className="text-primary shrink-0" />
          </span>
        </div>

        <h1
          key={`title-${current}`}
          className="animate-fade-in-up text-[1.75rem] leading-tight sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-3 md:mb-6 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          style={{ animationDelay: "80ms" }}
        >
          {slide.title}
          <br />
          <span className="text-[var(--hero-highlight,#a855f7)]">
            {slide.highlight}
          </span>
        </h1>

        <p
          key={`desc-${current}`}
          className="animate-fade-in-up text-white/85 max-w-2xl mx-auto text-xs md:text-xl mb-5 md:mb-10 font-light leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] px-2 md:px-0"
          style={{ animationDelay: "160ms" }}
        >
          {slide.desc}
        </p>

        <div
          key={`cta-${current}`}
          className="animate-fade-in-up flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            to={slide.cta.to}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_25px_hsl(var(--primary)/0.5)] hover:scale-105 transition-all duration-300"
          >
            {slide.cta.text}
          </Link>
          <Link
            to={slide.cta2.to}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-white/15 border border-white/30 text-white font-bold text-sm hover:bg-white/25 backdrop-blur-sm transition-all duration-300"
          >
            {slide.cta2.text}
          </Link>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 rounded-full bg-white/15 border border-white/30 items-center justify-center text-white hover:text-primary hover:bg-white/25 backdrop-blur-sm transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 rounded-full bg-white/15 border border-white/30 items-center justify-center text-white hover:text-primary hover:bg-white/25 backdrop-blur-sm transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? "w-10 bg-primary" : "w-3 bg-white/30 hover:bg-white/50"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
