import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TextReveal = ({
  text,
  className,
  delay = 0,
  shimmer = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  shimmer?: boolean;
}) => {
  const { ref, visible } = useScrollAnimation(0.05);

  return (
    <h2
      ref={ref}
      className={cn(className, shimmer && visible && "text-shimmer")}
      style={{
        transform: visible ? "translateY(0)" : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease",
        transitionDelay: `${delay}s`,
      }}
    >
      {text}
    </h2>
  );
};

export default TextReveal;
