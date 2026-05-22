import { ReactNode, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Anim = "zoom-out" | "skew-up" | "slide-horizontal" | "parallax-reveal" | "rotate-3d" | "reveal-from-center" | "bounce-up";

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  animation?: Anim;
  delay?: number;
}

const animStyles: Record<Anim, { hidden: string; visible: string }> = {
  "zoom-out":          { hidden: "opacity-0 scale-[1.15]",              visible: "opacity-100 scale-100" },
  "skew-up":           { hidden: "opacity-0 translate-y-20 skew-y-2",   visible: "opacity-100 translate-y-0 skew-y-0" },
  "slide-horizontal":  { hidden: "opacity-0 -translate-x-20",           visible: "opacity-100 translate-x-0" },
  "parallax-reveal":   { hidden: "opacity-0 translate-y-16 scale-[0.96]", visible: "opacity-100 translate-y-0 scale-100" },
  "rotate-3d":         { hidden: "opacity-0 translate-y-14 -rotate-3",  visible: "opacity-100 translate-y-0 rotate-0" },
  "reveal-from-center":{ hidden: "opacity-0 scale-[0.8]",               visible: "opacity-100 scale-100" },
  "bounce-up":         { hidden: "opacity-0 translate-y-24 scale-90", visible: "opacity-100 translate-y-0 scale-100" },
};

const MotionSection = ({ children, className, animation = "parallax-reveal", delay = 0 }: MotionSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { hidden, visible: vis } = animStyles[animation];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[transform,opacity] duration-700 ease-out-expo",
        visible ? vis : hidden,
        className
      )}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default MotionSection;
