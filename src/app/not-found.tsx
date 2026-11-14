import type { Metadata } from "next"
import { Btn, Lines } from "@/lib/components/ui"

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not here. Head back to the NYC Small Business Resource Network home page.",
}

/** The one gate on the site that stays down. */
export default function NotFound() {
  return (
    <section className="lost slats slats--night" aria-labelledby="lost-h">
      <div className="wrap lost__inner">
        <p className="label lost__code tnum" data-reveal="">
          404
        </p>
        <Lines id="lost-h" as="h1" className="display lost__h" lines={["This gate", "is down."]} />
        <p className="voice lost__line" data-reveal="" style={{ ["--d" as string]: "300ms" }}>
          The page you were looking for is not at this address.
        </p>
        <div className="lost__actions" data-reveal="" style={{ ["--d" as string]: "380ms" }}>
          <Btn href="/">Back to the block</Btn>
          <Btn href="/connect" variant="ghost">
            Connect with us
          </Btn>
        </div>
      </div>
      <span className="lost__lock" aria-hidden="true" />
      <span className="gatebar" aria-hidden="true" />
    </section>
  )
}
