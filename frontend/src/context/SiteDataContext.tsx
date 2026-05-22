import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  applySettingsToDocument,
  fetchPublic,
  SITE_DATA_UPDATED,
  type SiteDataScope,
} from "@/lib/siteData";
import { ASSETS_INVALIDATE_EVENT } from "@/context/AssetsContext";

type SiteDataContextValue = {
  settings: Record<string, string>;
  content: Record<string, string>;
  loading: boolean;
  refetchSettings: () => Promise<void>;
  refetchContent: () => Promise<void>;
  s: (key: string, fallback: string) => string;
  t: (key: string, fallback: string) => string;
  /** Reads settings first, then site-content — matches admin panel saves */
  get: (key: string, fallback: string) => string;
};

const SiteDataContext = createContext<SiteDataContextValue>({
  settings: {},
  content: {},
  loading: true,
  refetchSettings: async () => {},
  refetchContent: async () => {},
  s: (_k, fb) => fb,
  t: (_k, fb) => fb,
  get: (_k, fb) => fb,
});

export const SiteDataProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const refetchSettings = useCallback(async () => {
    try {
      const data = await fetchPublic<Record<string, string>>("/api/settings");
      setSettings(data);
      applySettingsToDocument(data);

      const logoRes = await fetchPublic<Record<string, string>>("/api/assets").catch(() => ({}));
      const logoUrl = logoRes?.asset_logo;
      if (logoUrl) {
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon) favicon.href = logoUrl;
      }
    } catch {
      /* keep previous */
    }
  }, []);

  const refetchContent = useCallback(async () => {
    try {
      const data = await fetchPublic<Record<string, string>>("/api/site-content");
      setContent(data);
    } catch {
      /* keep previous */
    }
  }, []);

  useEffect(() => {
    Promise.all([refetchSettings(), refetchContent()]).finally(() => setLoading(false));
  }, [refetchSettings, refetchContent]);

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const scope = (e as CustomEvent<{ scope: SiteDataScope }>).detail?.scope ?? "all";
      if (scope === "all" || scope === "settings") refetchSettings();
      if (scope === "all" || scope === "content") refetchContent();
      if (scope === "all" || scope === "assets") {
        window.dispatchEvent(new Event(ASSETS_INVALIDATE_EVENT));
      }
    };
    window.addEventListener(SITE_DATA_UPDATED, onUpdate);
    return () => window.removeEventListener(SITE_DATA_UPDATED, onUpdate);
  }, [refetchSettings, refetchContent]);

  const s = (key: string, fallback: string) => settings[key] || fallback;
  const t = (key: string, fallback: string) => content[key] || fallback;
  const get = (key: string, fallback: string) => settings[key] || content[key] || fallback;

  return (
    <SiteDataContext.Provider
      value={{ settings, content, loading, refetchSettings, refetchContent, s, t, get }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => useContext(SiteDataContext);
