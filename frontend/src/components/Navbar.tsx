import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { toSlug } from "@/pages/ServiceDetail";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useAssets } from "@/hooks/useAssets";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";


const mainLinks = [
  { name: "Home", path: "/" },
];

const dropdownLinks = [
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "FAQ", path: "/faq" },
];

const allLinks = [...mainLinks, { name: "Services", path: "/services" }, { name: "Projects", path: "/projects" }, ...dropdownLinks];

const Navbar = () => {
  const { logo } = useAssets();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projectLinks, setProjectLinks] = useState<{ name: string; path: string }[]>([]);
  const [serviceLinks, setServiceLinks] = useState<string[]>([]);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const dropdownTimer = useRef<NodeJS.Timeout | null>(null);
  const projectsTimer = useRef<NodeJS.Timeout | null>(null);
  const servicesTimer = useRef<NodeJS.Timeout | null>(null);

  const loadNavData = useCallback(() => {
    fetchPublic<{ title: string; _id: string }[]>("/api/projects")
      .then((data) => {
        if (Array.isArray(data)) {
          setProjectLinks(
            data.slice(0, 6).map((p) => ({ name: p.title, path: `/projects/${p._id}` }))
          );
        }
      })
      .catch(() => {});

    fetchPublic<{ title: string }[]>("/api/services")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServiceLinks(data.map((s) => s.title));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadNavData();
  }, [loadNavData]);

  useSiteDataRefresh(["projects", "services", "all"], loadNavData, [loadNavData]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (projectsRef.current && !projectsRef.current.contains(e.target as Node)) {
        setProjectsOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLight = theme === "light";
  const isDropdownActive = dropdownLinks.some((l) => l.path === pathname);
  const onHomeHero = pathname === "/" && !scrolled;
  const useHeroNavStyle = onHomeHero && !isLight;

  const navLinkClass = (active: boolean) =>
    cn(
      "relative text-[13px] font-bold uppercase tracking-wider px-4 py-2 transition-all duration-300 group overflow-hidden",
      useHeroNavStyle
        ? active ? "text-white" : "text-white/85 hover:text-white"
        : active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo",
        isLight
          ? cn(
              "py-3 bg-card/95 border-b border-border shadow-sm",
              scrolled && "shadow-md"
            )
          : scrolled
            ? "py-3 glass shadow-lg border-b border-border"
            : "py-6 bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group relative">
          <div className="relative">
            <img
              src={logo}
              alt="BUILD YOUR THOUGHTS"
              width={56}
              height={56}
              decoding="async"
              className="h-14 w-14 object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div>
            <span
              className={cn(
                "block text-base font-black tracking-[0.12em] uppercase leading-tight",
                useHeroNavStyle ? "text-white" : "text-foreground"
              )}
            >
              BUILD YOUR THOUGHTS
            </span>
            <span
              className={cn(
                "block text-[10px] tracking-[0.3em] font-bold uppercase",
                useHeroNavStyle ? "text-white/75" : "text-muted-foreground"
              )}
            >
              PRIVATE LIMITED
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Main links */}
          {mainLinks.map((l, i) => (
            <Link
              key={l.path}
              to={l.path}
              className={navLinkClass(pathname === l.path)}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="relative z-10">{l.name}</span>
              <span className={cn(
                "absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary origin-left transition-transform duration-500 ease-out-expo",
                pathname === l.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )} />
              <span className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out-expo" />
            </Link>
          ))}

          {/* Services dropdown */}
          <div
            className="relative"
            ref={servicesRef}
            onMouseEnter={() => {
              if (servicesTimer.current) clearTimeout(servicesTimer.current);
              setServicesOpen(true);
            }}
            onMouseLeave={() => {
              servicesTimer.current = setTimeout(() => setServicesOpen(false), 150);
            }}
          >
            <button
              className={cn(navLinkClass(pathname === "/services"), "flex items-center gap-1")}
            >
              <span className="relative z-10">Services</span>
              <ChevronDown size={14} className={cn("relative z-10 transition-transform duration-300", servicesOpen ? "rotate-180" : "")} />
              <span className={cn(
                "absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary origin-left transition-transform duration-500 ease-out-expo",
                pathname === "/services" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )} />
              <span className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out-expo" />
            </button>

            <div className={cn(
              "absolute top-full left-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl border border-border transition-all duration-300 origin-top",
              "bg-card border-border shadow-xl",
              servicesOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
            )}>
              <Link
                to="/services"
                onClick={() => setServicesOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-primary border-b border-border hover:bg-primary/5 transition-colors"
              >
                View All Services
              </Link>
              {serviceLinks.map((name) => (
                <Link
                  key={name}
                  to={`/services/${toSlug(name)}`}
                  onClick={() => setServicesOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-[13px] font-semibold transition-all duration-200 group text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-300 shrink-0" />
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Projects dropdown */}
          <div
            className="relative"
            ref={projectsRef}
            onMouseEnter={() => {
              if (projectsTimer.current) clearTimeout(projectsTimer.current);
              setProjectsOpen(true);
            }}
            onMouseLeave={() => {
              projectsTimer.current = setTimeout(() => setProjectsOpen(false), 150);
            }}
          >
            <button
              className={cn(navLinkClass(pathname === "/projects"), "flex items-center gap-1")}
            >
              <span className="relative z-10">Projects</span>
              <ChevronDown size={14} className={cn("relative z-10 transition-transform duration-300", projectsOpen ? "rotate-180" : "")} />
              <span className={cn(
                "absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary origin-left transition-transform duration-500 ease-out-expo",
                pathname === "/projects" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )} />
              <span className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out-expo" />
            </button>

            <div className={cn(
              "absolute top-full left-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl border border-border transition-all duration-300 origin-top",
              "bg-card border-border shadow-xl",
              projectsOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
            )}>
              <Link
                to="/projects"
                onClick={() => setProjectsOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-primary border-b border-border hover:bg-primary/5 transition-colors"
              >
                View All Projects
              </Link>
              {projectLinks.map((l) => (
                <Link
                  key={l.name}
                  to={l.path}
                  onClick={() => setProjectsOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-[13px] font-semibold transition-all duration-200 group text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-300" />
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => {
              if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
              setDropdownOpen(true);
            }}
            onMouseLeave={() => {
              dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 150);
            }}
          >
            <button
              className={cn(navLinkClass(isDropdownActive), "flex items-center gap-1")}
            >
              <span className="relative z-10">Company</span>
              <ChevronDown
                size={14}
                className={cn("relative z-10 transition-transform duration-300", dropdownOpen ? "rotate-180" : "")}
              />
              <span className={cn(
                "absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary origin-left transition-transform duration-500 ease-out-expo",
                isDropdownActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )} />
              <span className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out-expo" />
            </button>

            {/* Dropdown panel */}
            <div className={cn(
              "absolute top-full left-0 mt-2 w-44 rounded-2xl overflow-hidden shadow-2xl border border-border transition-all duration-300 origin-top",
              "bg-card border-border shadow-xl",
              dropdownOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
            )}>
              {dropdownLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setDropdownOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 text-[13px] font-bold uppercase tracking-wider transition-all duration-200 group",
                    pathname === l.path
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full bg-primary transition-transform duration-300",
                    pathname === l.path ? "scale-100" : "scale-0 group-hover:scale-100"
                  )} />
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-4 flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105",
                useHeroNavStyle
                  ? "bg-white/15 text-white border border-white/30 hover:bg-white/25"
                  : "glass text-muted-foreground hover:text-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.25)]"
              )}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-bold uppercase tracking-widest hover:shadow-[0_0_24px_hsl(var(--primary)/0.45)] transition-all duration-300 hover:scale-105 inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:text-primary transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-[64px] backdrop-blur-2xl transition-all duration-700 ease-out-expo z-40",
        "bg-card border-t border-border",
        open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <div className="container py-12 flex flex-col gap-4">
          {allLinks.map((l, i) => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={cn(
                "text-2xl font-heading font-bold py-4 px-6 rounded-2xl transition-all duration-500 flex items-center justify-between group",
                pathname === l.path
                  ? "text-primary bg-primary/10 translate-x-4"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5 hover:translate-x-2"
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {l.name}
              <div className={cn(
                "w-2 h-2 rounded-full bg-primary transition-transform duration-500",
                pathname === l.path ? "scale-100" : "scale-0 group-hover:scale-100"
              )} />
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 px-8 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-center text-xl shadow-2xl shadow-primary/20"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
