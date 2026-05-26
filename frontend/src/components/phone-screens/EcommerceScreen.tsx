const EcommerceScreen = () => (
  <div className="h-full bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col text-white overflow-hidden">
    {/* Header */}
    <div className="px-3 pt-2 pb-2 bg-slate-900/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-white">ShopEase</span>
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <div className="w-5 h-5 rounded-full bg-muted/30 flex items-center justify-center">
            <div className="w-3 h-0.5 bg-white/60 rounded" />
          </div>
        </div>
      </div>
      <div className="bg-slate-700/60 rounded-lg px-2 py-1 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
        <span className="text-[8px] text-muted-foreground">Search products...</span>
      </div>
    </div>

    {/* Banner */}
    <div className="mx-3 mt-2 rounded-xl bg-gradient-to-r from-primary to-accent p-3 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10" />
      <div className="text-[8px] font-bold text-white">SALE UP TO 50% OFF</div>
      <div className="text-[7px] text-white/70 mt-0.5">Limited time offer</div>
      <div className="mt-1.5 bg-white/20 rounded-md px-2 py-0.5 w-fit">
        <span className="text-[7px] font-semibold text-white">Shop Now</span>
      </div>
    </div>

    {/* Categories */}
    <div className="px-3 mt-2">
      <div className="text-[8px] font-semibold text-white/80 mb-1.5">Categories</div>
      <div className="flex gap-1.5 overflow-x-hidden">
        {[
          { label: "Fashion", color: "bg-pink-500/20 text-pink-300" },
          { label: "Tech", color: "bg-blue-500/20 text-blue-300" },
          { label: "Home", color: "bg-green-500/20 text-green-300" },
        ].map((c) => (
          <div key={c.label} className={`${c.color} rounded-lg px-2 py-1 text-[7px] font-medium whitespace-nowrap`}>
            {c.label}
          </div>
        ))}
      </div>
    </div>

    {/* Products */}
    <div className="px-3 mt-2 flex-1">
      <div className="text-[8px] font-semibold text-white/80 mb-1.5">Featured</div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { name: "Sneakers", price: "₹2,499", color: "from-orange-500/20 to-red-500/20", badge: "HOT" },
          { name: "Watch", price: "₹5,999", color: "from-blue-500/20 to-cyan-500/20", badge: "NEW" },
        ].map((p) => (
          <div key={p.name} className={`bg-gradient-to-br ${p.color} rounded-xl p-2 border border-white/5`}>
            <div className="flex justify-between items-start mb-1">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <div className="w-4 h-4 rounded bg-white/20" />
              </div>
              <span className="text-[6px] font-bold bg-primary/80 text-white px-1 py-0.5 rounded">{p.badge}</span>
            </div>
            <div className="text-[8px] font-semibold text-white">{p.name}</div>
            <div className="text-[7px] text-primary font-bold">{p.price}</div>
            <div className="mt-1 bg-primary/30 rounded-md py-0.5 text-center">
              <span className="text-[6px] text-white">Add to Cart</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom nav */}
    <div className="flex justify-around py-2 bg-slate-900/90 border-t border-white/5 mt-1">
      {["🏠", "🔍", "🛒", "👤"].map((icon, i) => (
        <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "opacity-100" : "opacity-40"}`}>
          <span className="text-[10px]">{icon}</span>
          {i === 0 && <div className="w-1 h-1 rounded-full bg-primary" />}
        </div>
      ))}
    </div>
  </div>
);

export default EcommerceScreen;
