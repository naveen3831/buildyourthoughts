/**
 * API base URL — uses Vite proxy in dev (/api/...), full URL in production.
 * Set VITE_API_URL in .env for production deployment.
 */
export const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Build a full API URL.
 * In dev: /api/settings → /api/settings (proxied by Vite to localhost:5000)
 * In prod: /api/settings → https://api.buildyourthoughts.com/api/settings
 */
export const apiUrl = (path: string) => `${API_BASE}${path}`;
