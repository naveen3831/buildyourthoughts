const API = "/api";

export const getToken = () => localStorage.getItem("buildyourthoughts_admin_token");

export function clearAdminSession() {
  localStorage.removeItem("buildyourthoughts_admin_token");
  localStorage.removeItem("buildyourthoughts_admin_user");
}

/**
 * Fetch wrapper for admin API calls.
 * Automatically clears session and redirects to /admin on 401/403.
 */
export async function adminFetch(
  path: string,
  opts: RequestInit = {},
  onUnauthorized?: () => void
): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...((opts.headers as Record<string, string>) || {}),
    },
  });

  if (res.status === 401 || res.status === 403) {
    clearAdminSession();
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      window.location.href = "/admin";
    }
    throw new Error("Session expired. Please log in again.");
  }

  return res;
}
