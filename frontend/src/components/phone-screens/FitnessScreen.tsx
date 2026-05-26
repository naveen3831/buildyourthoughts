const FitnessScreen = () => (
  <div className="h-full bg-gradient-to-b from-violet-950 to-slate-900 flex flex-col text-white overflow-hidden">
    {/* Header */}
    <div className="px-3 pt-2 pb-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[8px] text-violet-400">Welcome back</div>
          <div className="text-[10px] font-bold text-white">FitPulse</div>
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-[9px] font-bold">
          A
        </div>
      </div>
    </div>

    {/* Ring progress */}
    <div className="mx-3 bg-gradient-to-br from-sky-900/50 to-cyan-900/50 rounded-2xl p-3 border border-violet-500/20">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 shrink-0">
          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
            <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="5" />
            <circle cx="28" cy="28" r="22" fill="none" stroke="rgb(139,92,246)" strokeWidth="5"
              strokeDasharray="138" strokeDashoffset="35" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-bold text-violet-300">75%</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-white">Today's Goal</div>
          <div className="text-[8px] text-white/60 mt-0.5">750 / 1000 cal burned</div>
          <div className="text-[7px] text-violet-400 mt-0.5">Keep going! 🔥</div>
        </div>
      </div>
    </div>

    {/* Stats row */}
    <div className="px-3 mt-2 grid grid-cols-3 gap-1.5">
      {[
        { label: "Steps", val: "6,240", icon: "👟" },
        { label: "Active", val: "48 min", icon: "⚡" },
        { label: "Water", val: "1.8 L", icon: "💧" },
      ].map((s) => (
        <div key={s.label} className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
          <div className="text-[10px] mb-0.5">{s.icon}</div>
          <div className="text-[8px] font-bold text-white">{s.val}</div>
          <div className="text-[6px] text-white/40">{s.label}</div>
        </div>
      ))}
    </div>

    {/* Workout plan */}
    <div className="px-3 mt-2 flex-1">
      <div className="text-[8px] font-semibold text-white/80 mb-1.5">Today's Workout</div>
      {[
        { name: "Push-ups", sets: "3×15", done: true },
        { name: "Squats", sets: "4×12", done: true },
        { name: "Plank", sets: "3×60s", done: false },
      ].map((w) => (
        <div key={w.name} className="flex items-center gap-2 py-1.5 border-b border-white/5">
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${w.done ? "bg-cyan-500 border-violet-500" : "border-white/20"}`}>
            {w.done && <span className="text-[7px] text-white">✓</span>}
          </div>
          <span className={`text-[8px] flex-1 ${w.done ? "line-through text-white/40" : "text-white"}`}>{w.name}</span>
          <span className="text-[7px] text-violet-400">{w.sets}</span>
        </div>
      ))}
    </div>

    {/* Bottom nav */}
    <div className="flex justify-around py-2 bg-violet-950/90 border-t border-white/5">
      {["🏠", "🏋️", "📊", "👤"].map((icon, i) => (
        <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "opacity-100" : "opacity-40"}`}>
          <span className="text-[10px]">{icon}</span>
          {i === 0 && <div className="w-1 h-1 rounded-full bg-violet-400" />}
        </div>
      ))}
    </div>
  </div>
);

export default FitnessScreen;
