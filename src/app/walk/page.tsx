import type { Metadata } from "next"
import Link from "next/link"
import Morning from "@/lib/components/home/morning"
import WalkExit from "@/lib/components/home/walk-exit"

export const metadata: Metadata = {
  title: "The optional neighborhood walk",
  description: "Explore an interactive neighborhood inspired by New York's small businesses, or go directly to our services.",
}

export default function WalkPage() {
  return <>
    <WalkExit />
    <Morning />
    <div className="walk-finish wrap"><h2>Ready for your next step?</h2><Link className="text-link" href="/connect">Get business support</Link></div>
  </>
}
