import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssets } from "@/hooks/useAssets";

const navItems = [
  { path: "/admin/dashboard", icon: "🚀", label: "Projects" },
  { path: "/admin/dashboard", icon: "⚙️", label: "Services" },
  { path: "/admin/carousel", icon: "🎠", label: "Carousel" },
  { path: "/admin/submissions", icon: "📋", label: "Submissions" },
  { path: "/admin/blog", icon: "📝", label: "Blog" },
  { path: "/admin/testimonials", icon: "💬", label: "Testimonials" },
  { path: "/admin/phone-showcase", icon: "📱", label: "Phone Showcase" },
  { path: "/admin/settings", icon: "🔧", label: "Settings" },
];

export default function AdminSidebar({ active }: { active: string }) {
  const navigate = useNavigate();
  const { logo } = useAssets();
  const [open, setOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("speshway_admin_token");
    localStorage.removeItem("speshway_admin_user");
    navigate("/admin");
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger button — only on mobile (below lg) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-[500] lg:hidden w-10 h-10 bg-slate-950 rounded-xl flex flex-col items-center justify-center gap-[5px] shadow-lg"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-white rounded" />
        <span className="block w-5 h-0.5 bg-white rounded" />
        <span className="block w-5 h-0.5 bg-white rounded" />
      </button>

      {/* Full-screen dark overlay — shown when sidebar is open on mobile */}
      <div
        className={`fixed inset-0 z-[600] bg-black/70 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-[700] w-64 bg-slate-950 text-white
          flex flex-col py-5 px-4 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-56 lg:shadow-none
        `}
      >
        {/* Header row: logo + close button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="w-8 h-8 object-contain shrink-0" />
            <span className="font-bold text-sm leading-tight">Speshway Admin</span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-cyan-300 hover:text-white hover:bg-white/10 transition-colors text-lg"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
          {navItems.map(n => (
            <button
              key={n.label}
              onClick={() => handleNav(n.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors w-full ${
                active === n.label
                  ? "bg-cyan-600/40 text-white"
                  : "text-cyan-300 hover:bg-cyan-600/20 hover:text-white"
              }`}
            >
              <span className="text-base shrink-0">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/15 text-sm font-medium mt-3 w-full"
        >
          🚪 Logout
        </button>
      </aside>
    </>
  );
}
