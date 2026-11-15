import type { Metadata } from "next"
import LegalDoc, { type LegalData } from "@/lib/components/legal-doc"
import PageHeader from "@/lib/components/page-header"
import data from "@/lib/data/legal/privacy.json"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How the NYC Small Business Resource Network collects, uses and protects information gathered through its website and social platforms.",
}

export default function PrivacyPage() {
  const doc = data as LegalData
  return (
    <>
      <PageHeader kicker="Fine print" title={["Privacy", "Policy"]} lead={`${doc.dateLabel}: ${doc.date}`} heroImage={{ src: "/media/brand/nyc-street-map.webp", alt: "Illustrated map of New York City streets" }} />
      <LegalDoc data={doc} />
    </>
  )
}
