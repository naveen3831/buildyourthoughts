const DashboardScreen = () => (
  <div className="h-full bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col text-white overflow-hidden">
    {/* Header */}
    <div className="px-3 pt-2 pb-2 flex items-center justify-between">
      <div>
        <div className="text-[8px] text-cyan-400">Analytics</div>
        <div className="text-[10px] font-bold text-white">Dashboard</div>
      </div>
      <div className="flex gap-1">
        <div className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-[6px] text-cyan-300">Live</div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mt-0.5" />
      </div>
    </div>

    {/* KPI row */}
    <div className="px-3 grid grid-cols-2 gap-1.5 mb-2">
      {[
        { label: "Revenue", val: "₹4.2L", change: "+12%", color: "cyan" },
        { label: "Users", val: "8,420", change: "+8%", color: "cyan" },
        { label: "Orders", val: "1,240", change: "+5%", color: "green" },
        { label: "Churn", val: "2.1%", change: "-0.4%", color: "orange" },
      ].map((k) => (
        <div key={k.label} className="bg-white/5 rounded-xl p-2 border border-white/5">
          <div className="text-[7px] text-white/50">{k.label}</div>
          <div className="text-[11px] font-bold text-white">{k.val}</div>
          <div className={`text-[7px] text-${k.color}-400`}>{k.change}</div>
        </div>
      ))}
    </div>

    {/* Bar chart */}
    <div className="mx-3 bg-white/5 rounded-xl p-2 border border-white/5 mb-2">
      <div className="text-[7px] text-white/60 mb-1.5">Weekly Revenue</div>
      <div className="flex items-end gap-1 h-12">
        {[50, 70, 45, 90, 65, 80, 100].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className={`w-full rounded-t-sm ${i === 6 ? "bg-cyan-400" : "bg-cyan-500/30"}`}
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="text-[6px] text-white/30 flex-1 text-center">{d}</span>
        ))}
      </div>
    </div>

    {/* Recent activity */}
    <div className="px-3 flex-1">
      <div className="text-[8px] font-semibold text-white/80 mb-1.5">Recent Activity</div>
      {[
        { action: "New order #1042", time: "2m ago", dot: "bg-green-400" },
        { action: "User signup: Priya S.", time: "8m ago", dot: "bg-blue-400" },
        { action: "Payment received", time: "15m ago", dot: "bg-cyan-400" },
      ].map((a) => (
        <div key={a.action} className="flex items-center gap-2 py-1 border-b border-white/5">
          <div className={`w-1.5 h-1.5 rounded-full ${a.dot} shrink-0`} />
          <span className="text-[7px] text-white/70 flex-1">{a.action}</span>
          <span className="text-[6px] text-white/30">{a.time}</span>
        </div>
      ))}
    </div>

    {/* Bottom nav */}
    <div className="flex justify-around py-2 bg-slate-950/90 border-t border-white/5">
      {["🏠", "📊", "🔔", "⚙️"].map((icon, i) => (
        <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "opacity-100" : "opacity-40"}`}>
          <span className="text-[10px]">{icon}</span>
          {i === 0 && <div className="w-1 h-1 rounded-full bg-cyan-400" />}
        </div>
      ))}
    </div>
  </div>
);

export default DashboardScreen;
