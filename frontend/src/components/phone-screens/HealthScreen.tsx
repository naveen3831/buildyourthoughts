const HealthScreen = () => (
  <div className="h-full bg-gradient-to-b from-emerald-950 to-slate-900 flex flex-col text-white overflow-hidden">
    {/* Header */}
    <div className="px-3 pt-2 pb-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[8px] text-emerald-400 font-medium">Good Morning</div>
          <div className="text-[10px] font-bold text-white">Dr. Priya's Clinic</div>
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[9px] font-bold">
          P
        </div>
      </div>
    </div>

    {/* Health card */}
    <div className="mx-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3 relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10" />
      <div className="text-[8px] text-white/80 font-medium">Today's Summary</div>
      <div className="flex items-end gap-1 mt-1">
        <span className="text-[22px] font-bold text-white leading-none">8,432</span>
        <span className="text-[8px] text-white/70 mb-1">steps</span>
      </div>
      <div className="mt-2 bg-white/20 rounded-full h-1.5 overflow-hidden">
        <div className="h-full bg-white rounded-full" style={{ width: "70%" }} />
      </div>
      <div className="text-[7px] text-white/70 mt-0.5">70% of daily goal</div>
    </div>

    {/* Vitals */}
    <div className="px-3 mt-2">
      <div className="text-[8px] font-semibold text-white/80 mb-1.5">Vitals</div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "Heart Rate", val: "72 bpm", icon: "❤️", color: "from-red-500/20 to-pink-500/20" },
          { label: "Blood O₂", val: "98%", icon: "🫁", color: "from-blue-500/20 to-cyan-500/20" },
          { label: "Sleep", val: "7.5 hrs", icon: "😴", color: "from-cyan-500/20 to-indigo-500/20" },
          { label: "Calories", val: "1,840", icon: "🔥", color: "from-orange-500/20 to-yellow-500/20" },
        ].map((v) => (
          <div key={v.label} className={`bg-gradient-to-br ${v.color} rounded-xl p-2 border border-white/5`}>
            <div className="text-[10px] mb-0.5">{v.icon}</div>
            <div className="text-[9px] font-bold text-white">{v.val}</div>
            <div className="text-[7px] text-white/50">{v.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Appointment */}
    <div className="mx-3 mt-2 bg-white/5 rounded-xl p-2 border border-emerald-500/20">
      <div className="text-[7px] text-emerald-400 font-semibold uppercase tracking-wide">Next Appointment</div>
      <div className="text-[9px] font-semibold text-white mt-0.5">Dr. Sharma - Cardiology</div>
      <div className="text-[7px] text-white/50">Tomorrow, 10:30 AM</div>
    </div>

    {/* Bottom nav */}
    <div className="flex justify-around py-2 bg-emerald-950/90 border-t border-white/5 mt-auto">
      {["🏠", "📊", "📅", "👤"].map((icon, i) => (
        <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "opacity-100" : "opacity-40"}`}>
          <span className="text-[10px]">{icon}</span>
          {i === 0 && <div className="w-1 h-1 rounded-full bg-emerald-400" />}
        </div>
      ))}
    </div>
  </div>
);

export default HealthScreen;
