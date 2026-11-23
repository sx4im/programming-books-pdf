import type { MetadataRoute } from "next";
import { LANGUAGES } from "../data/languages";

const siteUrl = "https://freecodebooks.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const languageEntries: MetadataRoute.Sitemap = LANGUAGES.map((lang) => ({
    url: `${siteUrl}/library/${lang.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/library`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...languageEntries,
  ];
}
