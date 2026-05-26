import { ReactNode } from "react";

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
  animationClass?: string;
  animationDelay?: string;
  color?: "primary" | "secondary" | "accent";
}

const PhoneMockup = ({
  children,
  className = "",
  animationClass = "animate-float",
  animationDelay = "0s",
  color = "primary",
}: PhoneMockupProps) => (
  <div
    className={`relative ${animationClass} ${className} group`}
    style={{ animationDelay }}
  >
    {/* Glow behind phone */}
    <div className={`absolute inset-0 bg-${color}/20 blur-3xl rounded-full scale-75 -z-10 transition-all duration-700 group-hover:scale-110 group-hover:bg-${color}/40`} />

    {/* Phone frame */}
    <div className="relative w-full max-w-[140px] md:w-[220px] mx-auto">
      {/* Outer shell */}
      <div
        className={`relative rounded-[2rem] md:rounded-[2.5rem] border-2 border-${color}/30 shadow-[0_0_40px_hsl(var(--${color})/0.2)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_60px_hsl(var(--${color})/0.45)] group-hover:border-${color}/60 group-hover:scale-[1.03]`}
        style={{
          aspectRatio: "9/19",
          background: "linear-gradient(to bottom, #07121c, #0b2239)",
        }}
      >
        {/* Full-screen image layer — sits behind notch/status bar */}
        <div className="absolute inset-0 z-0">
          {children}
        </div>

        {/* Notch overlay — on top of image */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl z-20 flex items-center justify-center gap-1"
          style={{ background: "#07121c" }}
        >
          <div className="w-1 h-1 rounded-full bg-white/25" />
          <div className="w-6 h-1 rounded-full bg-white/15" />
        </div>

        {/* Status bar — on top of image */}
        <div className="absolute top-6 left-0 right-0 px-4 flex justify-between items-center z-10">
          <span className="text-[8px] text-white/80 font-semibold drop-shadow">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5 items-end">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} className="w-0.5 bg-white/70 rounded-sm" style={{ height: h }} />
              ))}
            </div>
            <div className="w-3 h-1.5 rounded-sm border border-white/60 relative">
              <div className="absolute inset-0.5 right-0.5 bg-white/60 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Scanline on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden z-30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scanline" />
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/30 z-20" />
      </div>

      {/* Side buttons */}
      <div className={`absolute -right-0.5 top-16 w-1 h-7 rounded-r-sm bg-${color}/30`} />
      <div className={`absolute -left-0.5 top-12 w-1 h-5 rounded-l-sm bg-${color}/30`} />
      <div className={`absolute -left-0.5 top-20 w-1 h-5 rounded-l-sm bg-${color}/30`} />
    </div>
  </div>
);

export default PhoneMockup;
