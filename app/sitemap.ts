import type { MetadataRoute } from "next";

import { ROUTES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}${ROUTES.home}`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}${ROUTES.test}`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}${ROUTES.dashboard}`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}${ROUTES.kvkk}`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}${ROUTES.privacy}`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}${ROUTES.cookies}`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
