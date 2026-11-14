import type { MetadataRoute } from "next"
import { site } from "@/lib/data/site"

const ROUTES = ["/", "/about", "/openandonline", "/stories", "/media", "/connect", "/privacy-policy", "/terms-of-service"]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" || path === "/media" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : path.includes("policy") || path.includes("terms") ? 0.2 : 0.7,
  }))
}
