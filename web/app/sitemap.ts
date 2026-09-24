import type { MetadataRoute } from "next";
import { LANGUAGES } from "../data/languages";

const siteUrl = "https://freecodebooks.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const languageEntries: MetadataRoute.Sitemap = LANGUAGES.map((lang) => ({
    url: `${siteUrl}/library?lang=${encodeURIComponent(lang.id)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/library`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...languageEntries,
  ];
}
