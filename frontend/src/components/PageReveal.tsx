import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo.png";

const PageReveal = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const t1 = window.setTimeout(() => setPhase("out"), 1200);
    const t2 = window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "page-reveal fixed inset-0 z-[9999] flex items-center justify-center",
        isDark ? "bg-background" : "bg-white"
      )}
      style={{
        clipPath: phase === "out" ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transition: "clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
      aria-hidden={phase === "out"}
    >
      <div
        className="flex flex-col items-center gap-6 px-4"
        style={{
          opacity: phase === "out" ? 0 : 1,
          transform: phase === "out" ? "translateY(-16px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div
          className={cn(
            "rounded-2xl p-3 shadow-lg",
            isDark ? "bg-white/95" : "bg-transparent"
          )}
        >
          <img
            src={LOGO_SRC}
            alt="BUILD YOUR THOUGHTS logo"
            width={280}
            height={200}
            decoding="async"
            className="w-48 h-36 sm:w-56 sm:h-44 md:w-64 md:h-48 object-contain object-center"
          />
        </div>

        <span
          className={cn(
            "font-heading font-black text-lg sm:text-2xl md:text-4xl tracking-[0.12em] sm:tracking-[0.15em] uppercase text-center",
            isDark ? "text-foreground" : "text-[hsl(222,47%,12%)]"
          )}
        >
          BUILD YOUR THOUGHTS
        </span>

        <div
          className="w-40 h-1 rounded-full bg-gradient-to-r from-primary via-accent to-secondary origin-left"
          style={{
            transform: phase === "in" ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.5s ease",
          }}
        />
      </div>
    </div>
  );
};

export default PageReveal;
