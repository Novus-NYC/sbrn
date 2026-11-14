import type { Metadata } from "next"
import LegalDoc, { type LegalData } from "@/lib/components/legal-doc"
import PageHeader from "@/lib/components/page-header"
import data from "@/lib/data/legal/terms.json"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern use of the NYC Small Business Resource Network website and services, including the agreement to arbitrate disputes.",
}

export default function TermsPage() {
  const doc = data as LegalData
  return (
    <>
      <PageHeader kicker="Fine print" title={["Terms of", "Service"]} lead={`${doc.dateLabel}: ${doc.date}`} />
      <LegalDoc data={doc} />
    </>
  )
}
