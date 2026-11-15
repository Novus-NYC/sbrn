import type { Metadata } from "next"
import PageHeader from "@/lib/components/page-header"
import { Btn } from "@/lib/components/ui"

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not here. Head back to the NYC Small Business Resource Network home page.",
}

export default function NotFound() {
  return (
    <>
      <PageHeader kicker="404" title={["Page not", "found"]} lead="The page you were looking for is not at this address." heroImage={{ src: "/media/brand/nyc-street-map.webp", alt: "Illustrated map of New York City streets" }} />
      <section className="lost-next section-pad" data-tone="day"><div className="wrap"><p>Head back to the block or connect with your borough Chamber.</p><div><Btn href="/">Back to the home page</Btn><Btn href="/connect" variant="ink">Connect with us</Btn></div></div></section>
    </>
  )
}
