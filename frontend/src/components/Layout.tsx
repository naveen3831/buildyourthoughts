import { ReactNode, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "@/context/ThemeContext";
import { useSiteData } from "@/context/SiteDataContext";
import { Phone } from "lucide-react";
import { useLocation } from "react-router-dom";

const Layout = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const { settings } = useSiteData();
  const { pathname } = useLocation();

  const phoneDigits = useMemo(() => {
    const raw = settings.contact_whatsapp || settings.contact_phone || "919100006020";
    return raw.replace(/\D/g, "");
  }, [settings.contact_whatsapp, settings.contact_phone]);

  const WHATSAPP_URL = `https://wa.me/${phoneDigits}`;
  const CALL_URL = `tel:+${phoneDigits}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary/30 overflow-x-hidden">
      {/* Lightweight static background — no blur or noise (GPU-heavy) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden>
        <div className={`absolute inset-0 mesh-gradient ${theme === "light" ? "opacity-25" : "opacity-30"}`} />
        <div
          className={`absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full blur-2xl ${theme === "light" ? "bg-primary/8" : "bg-primary/12"}`}
        />
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full blur-2xl ${theme === "light" ? "bg-secondary/8" : "bg-secondary/12"}`}
        />
      </div>

      <Navbar />

      <main key={pathname} className="flex-1 pt-20 relative z-10 animate-page-in scroll-smooth">
        {children}
      </main>

      <Footer />

      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[200] flex flex-col gap-2 md:gap-3 items-center">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-125 active:scale-95 transition-transform duration-300 animate-bounce-subtle"
          style={{ background: "#25D366" }}
        >
          <svg viewBox="0 0 32 32" className="w-6 h-6 md:w-8 md:h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.782 6.86L2 30l7.34-1.742A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.594l-.418-.248-4.354 1.034 1.056-4.24-.272-.434A11.46 11.46 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.61c-.344-.172-2.036-1.004-2.352-1.118-.316-.114-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.536-2.766-1.708-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.022-.53.15-.702.154-.154.344-.4.516-.6.172-.2.23-.344.344-.574.114-.23.058-.43-.028-.602-.086-.172-.776-1.872-1.064-2.562-.28-.672-.564-.58-.776-.59l-.66-.012c-.23 0-.602.086-.916.43-.316.344-1.204 1.176-1.204 2.868s1.232 3.326 1.404 3.556c.172.23 2.426 3.706 5.878 5.196.822.354 1.464.566 1.964.724.824.262 1.574.224 2.168.136.66-.098 2.036-.832 2.322-1.636.286-.804.286-1.492.2-1.636-.084-.144-.314-.23-.658-.4z"/>
          </svg>
          <span className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 bg-[#25D366] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-none hidden md:block">
            WhatsApp Us
          </span>
        </a>

        <a
          href={CALL_URL}
          aria-label="Call us"
          className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-125 active:scale-95 transition-transform duration-300"
          style={{ background: "#E53935" }}
        >
          <Phone size={22} className="fill-white text-white" />
          <span className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 bg-[#E53935] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-none hidden md:block">
            Call Us
          </span>
        </a>
      </div>
    </div>
  );
};

export default Layout;
