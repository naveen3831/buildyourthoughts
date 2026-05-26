const SocialScreen = () => (
  <div className="h-full bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col text-white overflow-hidden">
    {/* Header */}
    <div className="px-3 pt-2 pb-2 flex items-center justify-between">
      <span className="text-[11px] font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Vibe</span>
      <div className="flex gap-1.5">
        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px]">💬</div>
        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px]">🔔</div>
      </div>
    </div>

    {/* Stories */}
    <div className="px-3 mb-2">
      <div className="flex gap-2 overflow-x-hidden">
        {[
          { name: "You", color: "from-pink-500 to-cyan-500", active: false, add: true },
          { name: "Raj", color: "from-orange-400 to-pink-500", active: true, add: false },
          { name: "Priya", color: "from-blue-400 to-cyan-400", active: true, add: false },
          { name: "Vik", color: "from-green-400 to-teal-400", active: false, add: false },
        ].map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-0.5 shrink-0">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${s.color} p-0.5 ${s.active ? "ring-1 ring-pink-400" : ""}`}>
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                {s.add ? "+" : s.name[0]}
              </div>
            </div>
            <span className="text-[6px] text-white/50">{s.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Posts */}
    <div className="flex-1 overflow-hidden px-3 flex flex-col gap-2">
      {/* Post 1 */}
      <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
        <div className="flex items-center gap-1.5 p-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-[7px] font-bold">R</div>
          <div>
            <div className="text-[8px] font-semibold text-white">Rajesh K.</div>
            <div className="text-[6px] text-white/40">2 hours ago</div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 flex items-center justify-center">
          <span className="text-[20px]">🌅</span>
        </div>
        <div className="p-2">
          <div className="text-[7px] text-white/70">Beautiful sunset from the office! 🔥</div>
          <div className="flex gap-3 mt-1.5">
            {["❤️ 124", "💬 18", "🔁 5"].map((a) => (
              <span key={a} className="text-[7px] text-white/40">{a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Post 2 */}
      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-[7px] font-bold">P</div>
          <div>
            <div className="text-[8px] font-semibold text-white">Priya S.</div>
            <div className="text-[6px] text-white/40">5 hours ago</div>
          </div>
        </div>
        <div className="text-[7px] text-white/70">Just shipped a new feature! 🚀 So excited for everyone to try it out.</div>
        <div className="flex gap-3 mt-1.5">
          {["❤️ 89", "💬 12", "🔁 3"].map((a) => (
            <span key={a} className="text-[7px] text-white/40">{a}</span>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom nav */}
    <div className="flex justify-around py-2 bg-slate-900/90 border-t border-white/5">
      {["🏠", "🔍", "➕", "💬", "👤"].map((icon, i) => (
        <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "opacity-100" : "opacity-40"}`}>
          <span className="text-[10px]">{icon}</span>
          {i === 0 && <div className="w-1 h-1 rounded-full bg-pink-400" />}
        </div>
      ))}
    </div>
  </div>
);

export default SocialScreen;
