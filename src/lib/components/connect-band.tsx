import Link from "next/link"
import { connect, site } from "@/lib/data/site"
import { Btn } from "./ui"

/** A compact next step, with a direct route to the form and local contacts. */
export default function ConnectBand() {
  return (
    <section className="start-support" aria-labelledby="band-h">
      <div className="wrap start-support__inner">
        <div>
          <h2 id="band-h">Tell us what your business needs.</h2>
          <p>{connect.text}</p>
          <Link href="/connect" className="text-link">Or find your local Chamber contact</Link>
        </div>
        <Btn href={site.profileFormUrl} variant="ink">{connect.formLabel}</Btn>
      </div>
    </section>
  )
}
