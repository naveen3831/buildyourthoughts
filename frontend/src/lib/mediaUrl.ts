import { API_BASE } from "@/lib/api";

/** Turn API-relative or partial URLs into absolute URLs the browser can load. */
export function resolveMediaUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const base = API_BASE || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base.replace(/\/$/, "")}${path}`;
}
