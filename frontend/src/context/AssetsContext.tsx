import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiUrl } from "@/lib/api";

const CLOUDINARY: Record<string, string> = {
  aboutTeam: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  webShowcase: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  logo: "/logo.svg",
  heroSlide1: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
  heroSlide2: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80",
  heroSlide3: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
  heroBg: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
  mobileShowcase: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  phoneEcommerce: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
  phoneFintech: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
  phoneFitness: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  phoneFood: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  phoneHealth: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
  phoneSocial: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80",
};

export interface Assets {
  aboutTeam: string;
  webShowcase: string;
  logo: string;
  heroSlide1: string;
  heroSlide2: string;
  heroSlide3: string;
  heroBg: string;
  mobileShowcase: string;
  phoneEcommerce: string;
  phoneFintech: string;
  phoneFitness: string;
  phoneFood: string;
  phoneHealth: string;
  phoneSocial: string;
}

const defaults = CLOUDINARY as Assets;

const AssetsContext = createContext<Assets>(defaults);

let fetchPromise: Promise<Assets> | null = null;

const loadAssets = (): Promise<Assets> => {
  if (!fetchPromise) {
    fetchPromise = fetch(apiUrl("/api/assets"))
      .then((r) => r.json())
      .then((data: Record<string, string>) => ({
        aboutTeam: data.asset_about_team || CLOUDINARY.aboutTeam,
        webShowcase: data.asset_web_showcase || CLOUDINARY.webShowcase,
        logo: data.asset_logo || CLOUDINARY.logo,
        heroSlide1: data.asset_hero_slide_1 || CLOUDINARY.heroSlide1,
        heroSlide2: data.asset_hero_slide_2 || CLOUDINARY.heroSlide2,
        heroSlide3: data.asset_hero_slide_3 || CLOUDINARY.heroSlide3,
        heroBg: data.asset_hero_bg || CLOUDINARY.heroBg,
        mobileShowcase: data.asset_mobile_showcase || CLOUDINARY.mobileShowcase,
        phoneEcommerce: data.asset_phone_ecommerce || CLOUDINARY.phoneEcommerce,
        phoneFintech: data.asset_phone_fintech || CLOUDINARY.phoneFintech,
        phoneFitness: data.asset_phone_fitness || CLOUDINARY.phoneFitness,
        phoneFood: data.asset_phone_food || CLOUDINARY.phoneFood,
        phoneHealth: data.asset_phone_health || CLOUDINARY.phoneHealth,
        phoneSocial: data.asset_phone_social || CLOUDINARY.phoneSocial,
      }))
      .catch(() => defaults);
  }
  return fetchPromise;
};

export const AssetsProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Assets>(defaults);

  useEffect(() => {
    loadAssets().then(setAssets);

    const refresh = () => {
      invalidateAssetsCache();
      loadAssets().then(setAssets);
    };
    window.addEventListener(ASSETS_INVALIDATE_EVENT, refresh);
    return () => window.removeEventListener(ASSETS_INVALIDATE_EVENT, refresh);
  }, []);

  return <AssetsContext.Provider value={assets}>{children}</AssetsContext.Provider>;
};

export const useAssetsContext = () => useContext(AssetsContext);

/** Clears cached fetch so admin uploads refresh assets */
export const invalidateAssetsCache = () => {
  fetchPromise = null;
};

export const ASSETS_INVALIDATE_EVENT = "assets-invalidate";
