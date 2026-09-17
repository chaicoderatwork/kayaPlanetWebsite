const LIVE_HOSTS = new Set(["www.kayaplanet.com", "kayaplanet.com"]);

/** True only for real visitor traffic on the live salon domain. */
export function shouldCollectAnalytics(hostname?: string): boolean {
  if (typeof window === "undefined" && !hostname) return false;

  const host = (hostname ?? window.location.hostname).toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") {
    return false;
  }
  if (host.endsWith(".vercel.app") || host.endsWith(".local")) {
    return false;
  }
  return LIVE_HOSTS.has(host);
}
