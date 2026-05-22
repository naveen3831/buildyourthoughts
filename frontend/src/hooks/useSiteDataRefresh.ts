import { useEffect } from "react";
import { SITE_DATA_UPDATED, type SiteDataScope } from "@/lib/siteData";

/** Refetch when admin saves or user returns to the tab */
export function useSiteDataRefresh(
  scopes: SiteDataScope[],
  onRefresh: () => void,
  deps: unknown[] = []
) {
  useEffect(() => {
    const shouldRefresh = (scope: SiteDataScope) =>
      scope === "all" || scopes.includes(scope);

    const onUpdate = (e: Event) => {
      const scope = (e as CustomEvent<{ scope: SiteDataScope }>).detail?.scope ?? "all";
      if (shouldRefresh(scope)) onRefresh();
    };

    const onFocus = () => onRefresh();

    window.addEventListener(SITE_DATA_UPDATED, onUpdate);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener(SITE_DATA_UPDATED, onUpdate);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
