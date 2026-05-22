import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Anim =
  | "fade-in-up"
  | "fade-in"
  | "slide-in-left"
  | "slide-in-right"
  | "scale-in"
  | "reveal-text"
  | "zoom-in-out"
  | "rotate-in"
  | "scale-up"
  | "blur-in"
  | "card-rise"
  | "mask-reveal"
  | "bounce-in"
  | "elastic-in";

const animMap: Record<Anim, { hidden: string; visible: string }> = {
  "fade-in-up":     { hidden: "opacity-0 translate-y-14 scale-[0.97]",     visible: "opacity-100 translate-y-0 scale-100" },
  "fade-in":        { hidden: "opacity-0",                                  visible: "opacity-100" },
  "slide-in-left":  { hidden: "opacity-0 -translate-x-16 scale-[0.98]",   visible: "opacity-100 translate-x-0 scale-100" },
  "slide-in-right": { hidden: "opacity-0 translate-x-16 scale-[0.98]",    visible: "opacity-100 translate-x-0 scale-100" },
  "scale-in":       { hidden: "opacity-0 scale-[0.85]",                   visible: "opacity-100 scale-100" },
  "reveal-text":    { hidden: "opacity-0 translate-y-8 scale-[0.98]",     visible: "opacity-100 translate-y-0 scale-100" },
  "zoom-in-out":    { hidden: "opacity-0 scale-[1.12]",                   visible: "opacity-100 scale-100" },
  "rotate-in":      { hidden: "opacity-0 -rotate-6 translate-y-10 scale-95", visible: "opacity-100 rotate-0 translate-y-0 scale-100" },
  "scale-up":       { hidden: "opacity-0 scale-[0.75]",                   visible: "opacity-100 scale-100" },
  "blur-in":        { hidden: "opacity-0 translate-y-8 scale-[0.97]",     visible: "opacity-100 translate-y-0 scale-100" },
  "card-rise":      { hidden: "opacity-0 translate-y-16 scale-[0.92]",    visible: "opacity-100 translate-y-0 scale-100" },
  "mask-reveal":    { hidden: "opacity-0 scale-[0.88]",                   visible: "opacity-100 scale-100" },
  "bounce-in":      { hidden: "opacity-0 scale-[0.7] translate-y-12",   visible: "opacity-100 scale-100 translate-y-0" },
  "elastic-in":     { hidden: "opacity-0 scale-50",                       visible: "opacity-100 scale-100" },
};

const AnimatedSection = ({
  children,
  animation = "fade-in-up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  animation?: Anim;
  delay?: number;
  className?: string;
}) => {
  const { ref, visible } = useScrollAnimation();
  const { hidden, visible: vis } = animMap[animation];
  const isElastic = animation === "elastic-in";

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[transform,opacity] duration-700",
        isElastic ? "ease-out-back" : "ease-out-expo",
        visible ? vis : hidden,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
