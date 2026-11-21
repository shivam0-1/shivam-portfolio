// The public address of the site, used for canonical URLs, the sitemap and
// Open Graph tags. Set NEXT_PUBLIC_SITE_URL once you have a custom domain;
// on Vercel the production URL is picked up automatically until then.
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
