import { useState, useEffect, useRef, useCallback } from "react";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const GRADIENT_SLIDES = [
  "linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #0f3460 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
  "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 40%, #16213e 100%)",
];

interface ApiSlide {
  _id: string;
  badge: string;
  title: string;
  highlight: string;
  desc: string;
  ctaText: string;
  ctaLink: string;
  cta2Text: string;
  cta2Link: string;
  image: string;
  isActive: boolean;
  order: number;
}

type Slide = {
  image: string;
  gradient: string;
  badge: string;
  title: string;
  highlight: string;
  desc: string;
  cta: { text: string; to: string };
  cta2: { text: string; to: string };
};

const defaultSlides: Slide[] = [
  { image: "", gradient: GRADIENT_SLIDES[0], badge: "Welcome to the Future of IT", title: "Build Your Digital Future", highlight: "BUILD YOUR THOUGHTS", desc: "Full-stack software, automation, and IT solutions that drive real business growth.", cta: { text: "Our Services", to: "/services" }, cta2: { text: "Get in Touch", to: "/contact" } },
  { image: "", gradient: GRADIENT_SLIDES[1], badge: "Mobile App Development", title: "Stunning Mobile Apps", highlight: "For Every Platform", desc: "We build beautiful, high-performance mobile applications for iOS and Android.", cta: { text: "View Projects", to: "/projects" }, cta2: { text: "Get a Quote", to: "/contact" } },
  { image: "", gradient: GRADIENT_SLIDES[2], badge: "Cloud & Security Solutions", title: "Secure & Scalable", highlight: "Cloud Infrastructure", desc: "Enterprise-grade cybersecurity and cloud solutions to protect and grow your business.", cta: { text: "Learn More", to: "/services" }, cta2: { text: "Contact Us", to: "/contact" } },
];

function preloadImage(src: string) {
  if (!src) return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

/** Always split headline into white title + purple highlight (old two-color style). */
function splitHeroHeadline(title: string, highlight: string) {
  const t = title.trim();
  let h = highlight.trim();

  if (h && t.endsWith(h)) {
    const titlePart = t.slice(0, t.length - h.length).replace(/\s+$/, "");
    return { titlePart: titlePart || t, highlightPart: h };
  }

  if (h && h !== t && !t.includes(h)) {
    return { titlePart: t, highlightPart: h };
  }

  if (h && t === h) h = "";

  const words = t.split(/\s+/).filter(Boolean);
  if (words.length >= 4) {
    const n = words.length >= 7 ? 4 : words.length >= 5 ? 3 : 2;
    return {
      titlePart: words.slice(0, -n).join(" "),
      highlightPart: words.slice(-n).join(" "),
    };
  }
  if (words.length >= 2) {
    return {
      titlePart: words.slice(0, -1).join(" "),
      highlightPart: words[words.length - 1],
    };
  }

  return { titlePart: t, highlightPart: h || "BUILD YOUR THOUGHTS" };
}

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);

  const loadSlides = useCallback(() => {
    fetchPublic<ApiSlide[]>("/api/carousel")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data
            .filter((s) => s.isActive !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((s, i) => ({
              image: resolveMediaUrl(s.image),
              gradient: GRADIENT_SLIDES[i % 3],
              badge: s.badge || "",
              title: s.title || "",
              highlight: s.highlight || "",
              desc: s.desc || "",
              cta: { text: s.ctaText || "Learn More", to: s.ctaLink || "/services" },
              cta2: { text: s.cta2Text || "Contact Us", to: s.cta2Link || "/contact" },
            }));
          if (mapped.length > 0) {
            setSlides(mapped);
            setFailedImages({});
            mapped.forEach((s) => preloadImage(s.image));
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  useSiteDataRefresh(["carousel", "all"], loadSlides, [loadSlides]);

  const goTo = useCallback((index: number) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setPrevIdx(current);
    setCurrent(index);
    const nextSlide = slides[index];
    if (nextSlide?.image) preloadImage(nextSlide.image);
    setTimeout(() => {
      setPrevIdx(null);
      setTransitioning(false);
    }, 500);
  }, [current, transitioning, slides]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    timerRef.current = setInterval(next, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const slide = slides[current];
  const { titlePart, highlightPart } = splitHeroHeadline(slide.title, slide.highlight);

  const showImage = (i: number) => {
    const s = slides[i];
    return Boolean(s?.image) && !failedImages[i];
  };

  return (
    <section className="relative min-h-[65vh] md:min-h-[90vh] flex items-center justify-center text-center overflow-hidden bg-black -mt-20 isolate">
      {/* Slide backgrounds */}
      {slides.map((s, i) => {
        const active = i === current || i === prevIdx;
        if (!active) return null;
        const hasImage = showImage(i);

        return (
          <div
            key={`${i}-${s.image || "gradient"}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              i === current ? "opacity-100 z-[1]" : "opacity-0 z-0"
            )}
            aria-hidden
          >
            {hasImage ? (
              <img
                src={s.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.45] saturate-[0.9]"
                decoding="async"
                fetchPriority={i === current ? "high" : "low"}
                onError={() => setFailedImages((prev) => ({ ...prev, [i]: true }))}
              />
            ) : (
              <div className="absolute inset-0" style={{ background: s.gradient }} />
            )}
          </div>
        );
      })}

      {/* Dark overlay — text dominates; only white + purple on copy (old style) */}
      <div
        className={cn(
          "absolute inset-0 z-[2] pointer-events-none",
          showImage(current) ? "bg-black/50" : "bg-black/30"
        )}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent z-[2] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/55 to-transparent z-[2] pointer-events-none" />

      <div className="relative z-10 container px-5 pt-24 md:pt-28 pb-14 md:pb-16">
        <div key={`badge-${current}`} className="animate-hero-pop mb-4 md:mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/15 border border-white/30 text-white text-xs md:text-sm backdrop-blur-sm">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shrink-0" />
            <span className="truncate max-w-[200px] md:max-w-none">{slide.badge}</span>
            <ArrowRight size={12} className="text-primary shrink-0" />
          </span>
        </div>

        <h1
          key={`title-${current}`}
          className="animate-hero-pop font-heading font-bold mb-3 md:mb-6 tracking-tight leading-tight"
          style={{ animationDelay: "80ms" }}
        >
          <span className="block text-[1.75rem] sm:text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
            {titlePart}
          </span>
          <span
            className="block text-[1.75rem] sm:text-5xl md:text-7xl lg:text-8xl mt-1 md:mt-2 text-primary"
            style={{ color: "var(--hero-highlight, hsl(var(--primary)))" }}
          >
            {highlightPart}
          </span>
        </h1>

        {slide.desc ? (
          <p
            key={`desc-${current}`}
            className="animate-hero-pop text-white/85 max-w-2xl mx-auto text-xs md:text-xl mb-5 md:mb-10 font-light leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] px-2 md:px-0"
            style={{ animationDelay: "160ms" }}
          >
            {slide.desc}
          </p>
        ) : null}

        <div
          key={`cta-${current}`}
          className="animate-hero-pop flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
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

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-10 bg-primary" : "w-3 bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
