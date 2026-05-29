import { useEffect, useRef } from "react";
import { SITE_DATA_UPDATED, type SiteDataScope } from "@/lib/siteData";

// Minimum ms between focus-triggered refreshes (30 seconds)
const FOCUS_THROTTLE_MS = 30_000;

/** Refetch when admin saves. Focus-triggered refresh is throttled to avoid
 *  hammering the API every time the user switches tabs. */
export function useSiteDataRefresh(
  scopes: SiteDataScope[],
  onRefresh: () => void,
  deps: unknown[] = []
) {
  const lastFocusRefresh = useRef(0);

  useEffect(() => {
    const shouldRefresh = (scope: SiteDataScope) =>
      scope === "all" || scopes.includes(scope);

    const onUpdate = (e: Event) => {
      const scope = (e as CustomEvent<{ scope: SiteDataScope }>).detail?.scope ?? "all";
      if (shouldRefresh(scope)) onRefresh();
    };

    const onFocus = () => {
      const now = Date.now();
      if (now - lastFocusRefresh.current < FOCUS_THROTTLE_MS) return;
      lastFocusRefresh.current = now;
      onRefresh();
    };

    window.addEventListener(SITE_DATA_UPDATED, onUpdate);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener(SITE_DATA_UPDATED, onUpdate);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
