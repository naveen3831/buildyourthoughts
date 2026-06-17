import { apiUrl } from "@/lib/api";

export type SiteDataScope =
  | "settings"
  | "content"
  | "assets"
  | "carousel"
  | "services"
  | "projects"
  | "team"
  | "jobs"
  | "blog"
  | "testimonials"
  | "phones"
  | "all";

export const SITE_DATA_UPDATED = "site-data-updated";
const SITE_DATA_LS_KEY = "site_data_updated";

export function notifySiteDataUpdated(scope: SiteDataScope = "all") {
  // Notify same tab
  window.dispatchEvent(new CustomEvent(SITE_DATA_UPDATED, { detail: { scope } }));
  // Notify other tabs via localStorage
  localStorage.setItem(SITE_DATA_LS_KEY, JSON.stringify({ scope, ts: Date.now() }));
}

export async function fetchPublic<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), {
    // Allow browser to cache for up to 60 s; stale-while-revalidate for 30 s more.
    // Admin saves dispatch a custom event that triggers explicit refetches, so
    // we don't need no-store here — it just causes unnecessary round-trips.
    headers: { "Cache-Control": "max-age=60, stale-while-revalidate=30" },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json() as Promise<T>;
}

export const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export function applySettingsToDocument(s: Record<string, string>) {
  const root = document.documentElement;
  if (s.color_primary) root.style.setProperty("--primary", hexToHsl(s.color_primary));
  if (s.color_secondary) root.style.setProperty("--secondary", hexToHsl(s.color_secondary));
  if (s.color_accent) root.style.setProperty("--accent", hexToHsl(s.color_accent));
  if (s.hero_highlight_color) root.style.setProperty("--hero-highlight", s.hero_highlight_color);

  if (s.seo_title) {
    document.title = s.seo_title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", s.seo_title);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", s.seo_title);
  }

  if (s.seo_description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", s.seo_description);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", s.seo_description);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", s.seo_description);
  }

  if (s.seo_keywords) {
    let metaKey = document.querySelector('meta[name="keywords"]');
    if (!metaKey) {
      metaKey = document.createElement("meta");
      metaKey.setAttribute("name", "keywords");
      document.head.appendChild(metaKey);
    }
    metaKey.setAttribute("content", s.seo_keywords);
  }
}
