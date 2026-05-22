import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { toSlug } from "@/pages/ServiceDetail";
import { useAssets } from "@/hooks/useAssets";
import { useSiteData } from "@/context/SiteDataContext";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import { useCallback, useEffect, useState } from "react";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

const socialIcons = [
  { Icon: Facebook, key: "social_facebook", fallback: "" },
  { Icon: Twitter, key: "social_twitter", fallback: "" },
  { Icon: Linkedin, key: "social_linkedin", fallback: "" },
  { Icon: Instagram, key: "social_instagram", fallback: "" },
];

const Footer = () => {
  const { logo } = useAssets();
  const { s } = useSiteData();
  const [services, setServices] = useState<{ name: string; path: string }[]>([]);
  const [projects, setProjects] = useState<{ name: string; path: string }[]>([]);

  const loadServices = useCallback(() => {
    fetchPublic<{ title: string }[]>("/api/services")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(
            data.slice(0, 6).map((item) => ({
              name: item.title,
              path: `/services/${toSlug(item.title)}`,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const loadProjects = useCallback(() => {
    fetchPublic<{ _id: string; title: string }[]>("/api/projects")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(
            data.slice(0, 6).map((item) => ({
              name: item.title,
              path: `/projects/${item._id}`,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const loadFooterData = useCallback(() => {
    loadServices();
    loadProjects();
  }, [loadServices, loadProjects]);

  useEffect(() => {
    loadFooterData();
  }, [loadFooterData]);

  useSiteDataRefresh(["services", "projects", "all"], loadFooterData, [loadFooterData]);

  const siteName = s("site_name", "BUILD YOUR THOUGHTS");
  const description = s(
    "site_description",
    "Delivering innovative IT solutions and driving digital transformation for businesses worldwide."
  );
  const copyright = s("footer_copyright", `${siteName} PRIVATE LIMITED. All rights reserved.`);
  const address = s(
    "contact_address",
    "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Hyderabad, Telangana 500032"
  );
  const phone = s("contact_phone", "+91 9100006020");
  const email = s("contact_email", "info@buildyourthoughts.com");

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative container py-8 md:py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt={siteName} className="h-8 w-8 md:h-10 md:w-10 object-contain" />
            <div>
              <span className="block text-xs md:text-sm font-bold text-foreground leading-tight uppercase">
                {siteName}
              </span>
              <span className="block text-[9px] md:text-[10px] text-muted-foreground tracking-widest">
                PRIVATE LIMITED
              </span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3 md:mb-5">{description}</p>
          <div className="flex gap-2 md:gap-3">
            {socialIcons.map(({ Icon, key }, i) => {
              const href = s(key, "");
              if (!href) return null;
              return (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <Icon size={13} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 md:mb-4 text-foreground text-xs md:text-base">Quick Links</h4>
          <div className="flex flex-col gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
            {quickLinks.map((l) => (
              <Link key={l.name} to={l.path} className="hover:text-primary transition-colors w-fit">
                {l.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 md:mb-4 text-foreground text-xs md:text-base">Services</h4>
          <div className="flex flex-col gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
            {services.length > 0 ? (
              services.map((item) => (
                <Link key={item.name} to={item.path} className="hover:text-primary transition-colors w-fit">
                  {item.name}
                </Link>
              ))
            ) : (
              <Link to="/services" className="hover:text-primary transition-colors">
                View All Services
              </Link>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 md:mb-4 text-foreground text-xs md:text-base">Projects</h4>
          <div className="flex flex-col gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
            {projects.length > 0 ? (
              projects.map((item) => (
                <Link key={item.path} to={item.path} className="hover:text-primary transition-colors w-fit">
                  {item.name}
                </Link>
              ))
            ) : (
              <Link to="/projects" className="hover:text-primary transition-colors">
                View All Projects
              </Link>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 md:mb-4 text-foreground text-xs md:text-base">Contact</h4>
          <div className="flex flex-col gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
            <span className="flex items-start gap-1.5">
              <MapPin size={12} className="text-primary shrink-0 mt-0.5" />
              <span className="leading-tight">{address}</span>
            </span>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone size={12} className="text-secondary shrink-0" />
              {phone}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail size={12} className="text-accent shrink-0" />
              {email}
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} {copyright}
          </span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
