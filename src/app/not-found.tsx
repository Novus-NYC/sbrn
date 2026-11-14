import type { Metadata } from "next"
import PageHeader from "@/lib/components/page-header"
import { Btn } from "@/lib/components/ui"

export const metadata: Metadata = { title: "Page not found", description: "Find your way back to the NYC Small Business Resource Network." }
export default function NotFound() {
  return <PageHeader kicker="Page not found" title={["We couldn’t find that page."]} lead="The address may have changed. Explore our services or return to the homepage."><div className="welcome__actions"><Btn href="/">Back to home</Btn><Btn href="/services" variant="ghost">Explore services</Btn></div></PageHeader>
}
