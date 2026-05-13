import type { MetadataRoute } from "next";
import { BASE_URL, categorySeeds, productSeeds } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pro-account`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySeeds.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSeeds.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
