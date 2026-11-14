import type { Service } from "@/lib/data/site"

const drawings: Record<Service["shop"], string> = {
  party: "M9 22h30v20H9z M15 16h18v6 M20 11h8v5 M24 28v9 M28 29c-5-3-10 2-4 4s1 5-4 3",
  cafe: "M10 21h9l19-10v28L19 29h-9z M16 29l4 12h7l-4-10 M40 21h5 M11 21v8",
  studio: "M7 10h34v27H7z M7 18h34 M12 14h1 M17 14h1 M24 24v17l5-6 8 3z",
  corner: "M7 20l4-11h26l4 11 M10 24v17h28V24 M19 41V29h10v12 M7 20v3c0 5 8 5 8 0 0 5 9 5 9 0 0 5 9 5 9 0 0 5 8 5 8 0v-3z",
  market: "M13 10h22v32H13z M19 7h10v7H19z M18 24l3 3 9-8 M19 33h10",
}

/** Small storefront-sign pictograms help visitors scan the five service categories. */
export default function ServiceMark({ shop }: { shop: Service["shop"] }) {
  return <svg className="service-mark" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={drawings[shop]} /></svg>
}
