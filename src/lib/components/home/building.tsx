import type { ReactNode } from "react"

/**
 * One building on the block, drawn as a flat elevation in the brand's own
 * illustration language (see /media/brand/storefront-illustration.webp).
 *
 * Three stacked layers keep the night-to-morning change cheap to render:
 *   .b-base   the facade in daylight colors
 *   .b-shade  a solid night tint over the facade (opacity only)
 *   .b-front  everything that glows or moves: shop interior, gate, awning,
 *             lit sign, lit windows. It sits above the tint so light stays light.
 */

export type ShopKind = "party" | "cafe" | "studio" | "corner" | "market"
type Layout = "A" | "B" | "C"

type Palette = {
  wall: string
  mortar: string
  trim: string
  fascia: string
  frame: string
  door: string
  awning?: [string, string]
}

type Spec = {
  floors: 2 | 3
  layout: Layout
  palette: Palette
  windows: "rect" | "arch"
  fireEscape?: boolean
  roof?: "tower" | "chimney" | "tank"
  /** indices (row * 3 + col) of upper windows that are lit before dawn */
  awake: number[]
}

const W = 440
const H = 690
const FLOOR = 100
const FASCIA_Y = 362
const HOUSING_Y = 418
const OPEN_Y = 432
const OPEN_H = 192
const BASE_Y = 624
const WALK_Y = 640
const CURB_Y = 676

const INK = "#141c27"
const CREAM = "#f4ede0"
const CORAL = "#fc6251"
const HARBOR = "#2b5672"
const LAMP = "#ffc55c"
const SLATE = "#334255"

const SHOP: Record<ShopKind, Spec> = {
  party: {
    floors: 3,
    layout: "A",
    windows: "rect",
    palette: { wall: "#efe6d6", mortar: "#d9cdb8", trim: SLATE, fascia: "#1d2836", frame: SLATE, door: CORAL, awning: [CORAL, CREAM] },
    fireEscape: false,
    awake: [1, 5, 6],
  },
  cafe: {
    floors: 2,
    layout: "B",
    windows: "arch",
    palette: { wall: "#2f5f7e", mortar: "#27506b", trim: CREAM, fascia: "#16202c", frame: CREAM, door: "#1d2836", awning: [LAMP, "#f2b441"] },
    roof: "tower",
    awake: [0, 4],
  },
  studio: {
    floors: 3,
    layout: "C",
    windows: "rect",
    palette: { wall: "#e1654f", mortar: "#c9543f", trim: CREAM, fascia: "#1d2836", frame: CREAM, door: HARBOR },
    fireEscape: true,
    awake: [2, 3, 7],
  },
  corner: {
    floors: 2,
    layout: "A",
    windows: "rect",
    palette: { wall: "#dcc9a3", mortar: "#c7b38b", trim: "#1d2836", fascia: HARBOR, frame: "#1d2836", door: "#1d2836", awning: [HARBOR, "#e9eef3"] },
    roof: "chimney",
    awake: [1, 3],
  },
  market: {
    floors: 3,
    layout: "B",
    windows: "arch",
    palette: { wall: "#3d4d63", mortar: "#334255", trim: CREAM, fascia: "#16202c", frame: CREAM, door: CORAL, awning: [CORAL, "#e9513f"] },
    awake: [0, 4, 8],
  },
}

const FILLER: Spec[] = [
  {
    floors: 3,
    layout: "C",
    windows: "rect",
    palette: { wall: "#c9d2dc", mortar: "#b5c0cc", trim: SLATE, fascia: "#273444", frame: SLATE, door: SLATE },
    fireEscape: true,
    awake: [0, 5],
  },
  {
    floors: 2,
    layout: "B",
    windows: "arch",
    palette: { wall: "#b9553f", mortar: "#a34936", trim: CREAM, fascia: "#1d2836", frame: CREAM, door: "#1d2836", awning: [CREAM, "#e4dccb"] },
    roof: "tank",
    awake: [2],
  },
  {
    floors: 3,
    layout: "A",
    windows: "arch",
    palette: { wall: "#e9dcc2", mortar: "#d4c5a6", trim: HARBOR, fascia: HARBOR, frame: HARBOR, door: HARBOR },
    awake: [3, 7],
  },
  {
    floors: 2,
    layout: "C",
    windows: "rect",
    palette: { wall: "#46586f", mortar: "#3b4b60", trim: CREAM, fascia: "#16202c", frame: CREAM, door: LAMP, awning: [SLATE, "#46566b"] },
    roof: "chimney",
    awake: [1, 4],
  },
]

type Pane = { x: number; y: number; w: number; h: number }
type Geo = { windows: Pane[]; door: Pane; doorGlass: Pane }

function geometry(layout: Layout): Geo {
  if (layout === "B") {
    return {
      windows: [
        { x: 36, y: 446, w: 134, h: 148 },
        { x: 270, y: 446, w: 134, h: 148 },
      ],
      door: { x: 182, y: 442, w: 76, h: 182 },
      doorGlass: { x: 192, y: 454, w: 56, h: 120 },
    }
  }
  if (layout === "C") {
    return {
      windows: [{ x: 158, y: 446, w: 246, h: 148 }],
      door: { x: 34, y: 442, w: 108, h: 182 },
      doorGlass: { x: 46, y: 454, w: 84, h: 120 },
    }
  }
  return {
    windows: [{ x: 36, y: 446, w: 246, h: 148 }],
    door: { x: 298, y: 442, w: 108, h: 182 },
    doorGlass: { x: 310, y: 454, w: 84, h: 120 },
  }
}

function upperWindows(floors: number): Pane[] {
  const top = FASCIA_Y - floors * FLOOR
  const out: Pane[] = []
  for (let r = 0; r < floors; r++) {
    for (let c = 0; c < 3; c++) out.push({ x: 62 + c * 126, y: top + 22 + r * FLOOR, w: 64, h: 60 })
  }
  return out
}

function glassPath(p: Pane, arch: boolean): string {
  if (!arch) return `M${p.x} ${p.y}h${p.w}v${p.h}h${-p.w}z`
  const r = p.w / 2
  return `M${p.x} ${p.y + r}a${r} ${r} 0 0 1 ${p.w} 0v${p.h - r}h${-p.w}z`
}

/* ------------------------------------------------------------------ */

function Facade({ spec, sign, id }: { spec: Spec; sign?: string; id: string }) {
  const { palette: c, floors } = spec
  const top = FASCIA_Y - floors * FLOOR
  const arch = spec.windows === "arch"
  const ups = upperWindows(floors)
  const geo = geometry(spec.layout)
  return (
    <svg className="b-base" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-brick`} width="36" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 0.5h36M0 8.5h36M9 0v8M27 8v8" stroke={c.mortar} strokeWidth="1.4" fill="none" />
        </pattern>
      </defs>

      {/* roof furniture, always in silhouette */}
      {spec.roof === "tower" ? (
        <g fill="#1b2635" transform="translate(0 -12)">
          <path d="M286 174v-52M342 174v-52M300 174v-52M328 174v-52" stroke="#1b2635" strokeWidth="4" fill="none" />
          <path d="M282 150h64M286 128l56 44M342 128l-56 44" stroke="#1b2635" strokeWidth="2.4" fill="none" />
          <rect x="276" y="62" width="76" height="64" rx="3" />
          <path d="M270 64h88l-44-34z" />
          <path d="M276 82h76M276 104h76" stroke="#2a3849" strokeWidth="2.4" fill="none" />
        </g>
      ) : null}
      {spec.roof === "chimney" ? (
        <g fill="#1b2635" transform="translate(0 -12)">
          <rect x="70" y="128" width="34" height="48" />
          <rect x="64" y="120" width="46" height="10" />
          <path d="M330 176v-62M318 124h24M322 136h16" stroke="#1b2635" strokeWidth="3" fill="none" />
        </g>
      ) : null}
      {spec.roof === "tank" ? (
        <g fill="#1b2635" transform="translate(0 -12)">
          <rect x="96" y="132" width="92" height="44" rx="2" />
          <rect x="250" y="146" width="64" height="30" />
          <path d="M260 146v-18h44v18" stroke="#1b2635" strokeWidth="4" fill="none" />
        </g>
      ) : null}

      {/* wall */}
      <rect x="0" y={top} width={W} height={WALK_Y - top} fill={c.wall} />
      <rect x="0" y={top} width={W} height={FASCIA_Y - top} fill={`url(#${id}-brick)`} opacity="0.75" />
      <rect x={W - 5} y={top} width="5" height={WALK_Y - top} fill="#000" opacity="0.14" />

      {/* cornice */}
      <rect x="-2" y={top - 20} width={W + 4} height="22" fill={c.trim} />
      <rect x="0" y={top + 2} width={W} height="7" fill="#000" opacity="0.16" />
      {Array.from({ length: 15 }, (_, i) => (
        <rect key={i} x={10 + i * 29} y={top + 2} width="13" height="11" fill={c.trim} />
      ))}

      {/* upper windows */}
      {ups.map((p, i) => (
        <g key={i}>
          <rect x={p.x - 9} y={p.y + p.h + 5} width={p.w + 18} height="8" fill={c.trim} />
          {arch ? null : <rect x={p.x - 7} y={p.y - 14} width={p.w + 14} height="8" fill={c.trim} />}
          <path d={glassPath({ x: p.x - 5, y: p.y - 5, w: p.w + 10, h: p.h + 10 }, arch)} fill={c.trim} />
          <path d={glassPath(p, arch)} fill="#1a2636" />
          <path d={`M${p.x + p.w / 2} ${p.y}v${p.h}M${p.x} ${p.y + p.h * 0.46}h${p.w}`} stroke={c.trim} strokeWidth="3" fill="none" />
        </g>
      ))}

      {spec.fireEscape ? <FireEscape floors={floors} /> : null}

      {/* sign band */}
      <rect x="0" y={FASCIA_Y} width={W} height={HOUSING_Y - FASCIA_Y} fill={c.fascia} />
      <rect x="0" y={FASCIA_Y} width={W} height="4" fill={c.trim} />
      <rect x="0" y={HOUSING_Y - 4} width={W} height="4" fill="#000" opacity="0.3" />
      {sign ? (
        <text className="b-sign" x={W / 2} y={FASCIA_Y + 39} textAnchor="middle" fill="#7c8a9e">
          {sign}
        </text>
      ) : (
        <g fill="#7c8a9e" opacity="0.5">
          <rect x="150" y={FASCIA_Y + 22} width="140" height="5" />
          <rect x="182" y={FASCIA_Y + 33} width="76" height="5" />
        </g>
      )}
      {/* gooseneck lamps */}
      {[110, 220, 330].map((x) => (
        <g key={x}>
          <path d={`M${x} ${FASCIA_Y - 26}v8q0 8 8 8`} stroke="#10161f" strokeWidth="3" fill="none" />
          <path d={`M${x + 2} ${FASCIA_Y - 9}h16l-3 9h-10z`} fill="#10161f" />
        </g>
      ))}

      {/* shopfront surround and plinth */}
      <rect x="0" y={HOUSING_Y} width={W} height={WALK_Y - HOUSING_Y} fill={c.wall} />
      <rect x="14" y={HOUSING_Y} width={W - 28} height="14" fill="#232f3e" />
      <rect x="18" y={OPEN_Y - 4} width={W - 36} height={OPEN_H + 8} fill={c.frame} />
      <rect x="0" y={BASE_Y} width={W} height={WALK_Y - BASE_Y} fill="#232f3e" />
      <rect x={geo.door.x - 4} y={BASE_Y + 6} width={geo.door.w + 8} height="10" fill="#3a4a5f" />

      {/* sidewalk, curb */}
      <rect x="0" y={WALK_Y} width={W} height={CURB_Y - WALK_Y} fill="#cfd5dd" />
      <path d={`M0 ${WALK_Y + 1}h${W}M110 ${WALK_Y}l-14 ${CURB_Y - WALK_Y}M330 ${WALK_Y}l14 ${CURB_Y - WALK_Y}M220 ${WALK_Y}v${CURB_Y - WALK_Y}`} stroke="#aab3bf" strokeWidth="1.6" fill="none" />
      <rect x="0" y={CURB_Y} width={W} height={H - CURB_Y} fill="#8e99a7" />
      <rect x="0" y={CURB_Y} width={W} height="3" fill="#e6eaef" />
    </svg>
  )
}

function FireEscape({ floors }: { floors: number }) {
  const top = FASCIA_Y - floors * FLOOR
  const rows = Array.from({ length: floors }, (_, r) => top + 22 + r * FLOOR + 72)
  return (
    <g stroke="#10161f" fill="none" strokeLinecap="square">
      {rows.map((y, r) => (
        <g key={r}>
          <path d={`M40 ${y}h238M40 ${y - 30}h238`} strokeWidth="3.2" />
          <path d={Array.from({ length: 16 }, (_, i) => `M${44 + i * 15.4} ${y - 30}v30`).join("")} strokeWidth="1.6" />
          {r < floors - 1 ? (
            <path d={`M92 ${y}l92 ${FLOOR - 30}M104 ${y}l92 ${FLOOR - 30}${Array.from({ length: 7 }, (_, i) => `M${96 + i * 13} ${y + 4 + i * 11.6}h12`).join("")}`} strokeWidth="2" />
          ) : (
            <path d={`M150 ${y}v44M166 ${y}v44M150 ${y + 14}h16M150 ${y + 28}h16M150 ${y + 42}h16`} strokeWidth="2" />
          )}
        </g>
      ))}
    </g>
  )
}

/* ------------------------------------------------------------------ */

function Motif({ kind, geo }: { kind: ShopKind; geo: Geo }) {
  const a = geo.windows[0]
  const b = geo.windows[1] ?? geo.windows[0]
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  /** sill line: things in the window stand here */
  const by = a.y + a.h - 6

  if (kind === "party") {
    // bunting and wrapped gifts
    const flags = [CORAL, HARBOR, "#fff", CORAL, HARBOR, "#fff", CORAL]
    return (
      <g>
        <path d={`M${a.x + 6} ${a.y + 10}q${a.w / 2 - 6} 34 ${a.w - 12} 0`} stroke={INK} strokeWidth="2" fill="none" />
        {flags.map((f, i) => {
          const t = (i + 0.5) / flags.length
          const x = a.x + 6 + t * (a.w - 12)
          const y = a.y + 10 + 34 * 2 * t * (1 - t)
          return <path key={i} d={`M${x - 12} ${y}h24l-12 25z`} fill={f} stroke={INK} strokeWidth="1.5" />
        })}
        <g stroke={INK} strokeWidth="2">
          <rect x={ax - 92} y={by - 58} width="72" height="58" fill={CORAL} />
          <path d={`M${ax - 56} ${by - 58}v58M${ax - 92} ${by - 32}h72`} />
          <path d={`M${ax - 56} ${by - 58}c-22 -22 -30 2 0 0c30 2 22 -22 0 0`} fill="#fff" />
          <rect x={ax - 8} y={by - 38} width="52" height="38" fill={HARBOR} />
          <path d={`M${ax + 18} ${by - 38}v38`} stroke="#fff" />
          <rect x={ax + 56} y={by - 70} width="44" height="70" fill="#fff" />
          <path d={`M${ax + 56} ${by - 42}h44M${ax + 78} ${by - 70}v70`} stroke={CORAL} />
        </g>
      </g>
    )
  }

  if (kind === "cafe") {
    return (
      <g>
        {/* cup with steam */}
        <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
          <path className="b-steam" d={`M${ax - 16} ${ay - 12}q-8 -10 0 -20q8 -10 0 -20`} />
          <path className="b-steam b-steam--2" d={`M${ax + 2} ${ay - 12}q-8 -10 0 -20q8 -10 0 -20`} />
          <path className="b-steam b-steam--3" d={`M${ax + 20} ${ay - 12}q-8 -10 0 -20q8 -10 0 -20`} />
        </g>
        <path d={`M${ax - 34} ${ay - 2}h72v18a30 30 0 0 1 -30 30h-12a30 30 0 0 1 -30 -30z`} fill="#fff" stroke={INK} strokeWidth="2.4" />
        <path d={`M${ax + 38} ${ay + 4}h8a11 11 0 0 1 0 22h-12`} fill="none" stroke={INK} strokeWidth="2.4" />
        <path d={`M${ax - 46} ${ay + 50}h96`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
        {/* menu board */}
        <rect x={bx - 46} y={b.y + 22} width="92" height="104" fill="#1d2836" stroke={INK} strokeWidth="2" />
        <path d={`M${bx - 30} ${b.y + 46}h42M${bx - 30} ${b.y + 64}h60M${bx - 30} ${b.y + 80}h36M${bx - 30} ${b.y + 96}h52M${bx - 30} ${b.y + 110}h30`} stroke={CREAM} strokeWidth="4" strokeLinecap="round" />
        <circle cx={bx + 28} cy={b.y + 46} r="5.5" fill={CORAL} />
      </g>
    )
  }

  if (kind === "studio") {
    // a browser window with a page inside
    const x = ax - 92
    const y = a.y + 12
    return (
      <g transform={`translate(${ax} ${a.y + a.h / 2}) scale(1.2) translate(${-ax} ${-(a.y + 58)})`}>
        <rect x={x} y={y} width="184" height="92" rx="5" fill="#fff" stroke={INK} strokeWidth="2.4" />
        <path d={`M${x} ${y + 18}h184`} stroke={INK} strokeWidth="2" />
        <circle cx={x + 12} cy={y + 9} r="3" fill={CORAL} />
        <circle cx={x + 23} cy={y + 9} r="3" fill={LAMP} />
        <circle cx={x + 34} cy={y + 9} r="3" fill={HARBOR} />
        <rect x={x + 62} y={y + 5} width="108" height="8" rx="4" fill="#dfe5ec" />
        <rect className="b-page b-page--1" x={x + 12} y={y + 28} width="72" height="52" fill={CORAL} />
        <rect className="b-page b-page--2" x={x + 96} y={y + 30} width="74" height="8" fill={INK} />
        <rect className="b-page b-page--3" x={x + 96} y={y + 44} width="58" height="6" fill="#9aa7b7" />
        <rect className="b-page b-page--4" x={x + 96} y={y + 55} width="66" height="6" fill="#9aa7b7" />
        <rect className="b-page b-page--5" x={x + 96} y={y + 68} width="40" height="12" rx="2" fill={HARBOR} />
        <path d={`M${x + 150} ${y + 66}l0 26l7 -6l5 11l5 -2l-5 -11l9 -1z`} fill={INK} stroke="#fff" strokeWidth="1.6" />
      </g>
    )
  }

  if (kind === "corner") {
    // a signed lease and a set of keys
    return (
      <g transform="translate(0 20)">
        <g transform={`rotate(-5 ${ax - 44} ${ay})`}>
          <rect x={ax - 92} y={a.y + 10} width="92" height="98" fill="#fff" stroke={INK} strokeWidth="2.4" />
          <path d={`M${ax - 78} ${a.y + 28}h46`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d={`M${ax - 78} ${a.y + 44}h64M${ax - 78} ${a.y + 55}h64M${ax - 78} ${a.y + 66}h50`} stroke="#9aa7b7" strokeWidth="3.4" strokeLinecap="round" />
          <path className="b-sig" d={`M${ax - 78} ${a.y + 92}c8 -16 14 -16 14 -4c0 12 10 -22 16 -8c4 10 8 -8 14 0c4 6 10 2 20 -2`} stroke={CORAL} strokeWidth="3" fill="none" strokeLinecap="round" pathLength="1" />
        </g>
        <g stroke={INK} strokeWidth="2.4" fill={LAMP}>
          <circle cx={ax + 50} cy={ay - 16} r="19" />
          <circle cx={ax + 50} cy={ay - 22} r="5.5" fill="#fff5d8" />
          <path d={`M${ax + 44} ${ay + 1}h12v46l-6 6l-6 -6z`} />
          <path d={`M${ax + 56} ${ay + 18}h10v8h-10M${ax + 56} ${ay + 32}h7v7h-7`} />
        </g>
      </g>
    )
  }

  // market: a plan on the wall, a rising line and a checklist
  return (
    <g transform="translate(0 20)">
      <rect x={ax - 54} y={a.y + 12} width="108" height="88" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <path d={`M${ax - 42} ${a.y + 24}v62h84`} stroke={INK} strokeWidth="2.4" fill="none" />
      <path className="b-chart" d={`M${ax - 36} ${a.y + 76}l20 -12l16 6l18 -24l20 -14`} stroke={CORAL} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
      <circle cx={ax + 38} cy={a.y + 32} r="5.5" fill={CORAL} stroke={INK} strokeWidth="2" />
      <rect x={bx - 44} y={b.y + 12} width="88" height="88" fill="#fff" stroke={INK} strokeWidth="2.4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={bx - 32} y={b.y + 26 + i * 24} width="14" height="14" fill="none" stroke={INK} strokeWidth="2.2" />
          <path className={`b-tick b-tick--${i + 1}`} d={`M${bx - 30} ${b.y + 33 + i * 24}l4.5 4.5l8 -9`} stroke={HARBOR} strokeWidth="3" fill="none" strokeLinecap="round" pathLength="1" />
          <path d={`M${bx - 10} ${b.y + 33 + i * 24}h${[40, 30, 36][i]}`} stroke="#9aa7b7" strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

/** Things that step out onto the sidewalk once the shop is open. */
function Extras({ kind, geo }: { kind: ShopKind; geo: Geo }) {
  if (kind === "party") {
    const x = geo.door.x + geo.door.w + 6
    return (
      <g className="b-pop">
        <path d={`M${x} 624c0 -70 -8 -108 -14 -142M${x} 624c0 -84 4 -124 12 -172M${x} 624c2 -60 14 -98 24 -128`} stroke="#10161f" strokeWidth="1.6" fill="none" />
        <g className="b-bob">
          <ellipse cx={x - 16} cy="460" rx="20" ry="24" fill={CORAL} stroke={INK} strokeWidth="2" />
          <ellipse cx={x + 12} cy="428" rx="20" ry="24" fill={LAMP} stroke={INK} strokeWidth="2" />
          <ellipse cx={x + 26} cy="474" rx="18" ry="22" fill="#fff" stroke={INK} strokeWidth="2" />
        </g>
      </g>
    )
  }
  if (kind === "cafe") {
    return (
      <g className="b-pop">
        <path d="M22 640l16 -66h30l16 66" fill="#1d2836" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M38 590h30M35 604h36M32 618h42" stroke={CREAM} strokeWidth="3.4" strokeLinecap="round" />
      </g>
    )
  }
  if (kind === "studio") {
    return (
      <g className="b-pop">
        <path d="M440 398h-34" stroke="#10161f" strokeWidth="4" />
        <circle cx="404" cy="398" r="23" fill={HARBOR} stroke={INK} strokeWidth="2.4" />
        <path d="M381 398h46M404 375v46M389 383q15 15 30 0M389 413q15 -15 30 0" stroke="#fff" strokeWidth="2" fill="none" />
      </g>
    )
  }
  if (kind === "corner") {
    return (
      <g className="b-pop">
        <rect x="8" y="584" width="22" height="50" fill={HARBOR} stroke={INK} strokeWidth="2.2" />
        <path d="M-2 584c6 -26 14 -34 21 -34c7 0 15 8 21 34z" fill="#2f7a5b" stroke={INK} strokeWidth="2.2" />
      </g>
    )
  }
  return (
    <g className="b-pop">
      <rect x="400" y="560" width="40" height="74" fill={CREAM} stroke={INK} strokeWidth="2.4" />
      <path d="M408 574h24M408 586h24M408 598h16" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="426" cy="616" r="6" fill={CORAL} stroke={INK} strokeWidth="2" />
    </g>
  )
}

function Awning({ colors }: { colors: [string, string] }) {
  const n = 9
  const topL = 20
  const topR = W - 20
  const botL = 6
  const botR = W - 6
  const yT = HOUSING_Y
  const yB = HOUSING_Y + 46
  const stripes: ReactNode[] = []
  for (let i = 0; i < n; i++) {
    const t0 = i / n
    const t1 = (i + 1) / n
    const xt0 = topL + (topR - topL) * t0
    const xt1 = topL + (topR - topL) * t1
    const xb0 = botL + (botR - botL) * t0
    const xb1 = botL + (botR - botL) * t1
    const r = (xb1 - xb0) / 2
    stripes.push(
      <g key={i} fill={colors[i % 2]}>
        <path d={`M${xt0} ${yT}L${xt1} ${yT}L${xb1} ${yB}L${xb0} ${yB}z`} />
        <path d={`M${xb0} ${yB - 0.5}h${xb1 - xb0}v8a${r} ${r * 0.72} 0 0 1 ${-(xb1 - xb0)} 0z`} />
      </g>,
    )
  }
  return (
    <g className="b-awning">
      {stripes}
      <path d={`M${botL} ${yB}h${botR - botL}`} stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
    </g>
  )
}

function Front({ spec, kind, sign, id }: { spec: Spec; kind?: ShopKind; sign?: string; id: string }) {
  const { palette: c, floors } = spec
  const geo = geometry(spec.layout)
  const ups = upperWindows(floors)
  const arch = spec.windows === "arch"
  return (
    <svg className="b-front" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1c9" />
          <stop offset="0.55" stopColor="#ffd98a" />
          <stop offset="1" stopColor="#f9b866" />
        </linearGradient>
        <linearGradient id={`${id}-pool`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-lamp`} cx="0.5" cy="0.1" r="0.9">
          <stop offset="0" stopColor="#ffe3a6" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffd98a" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-slat`} width="20" height="12" patternUnits="userSpaceOnUse">
          <rect width="20" height="12" fill="#33415a" />
          <rect width="20" height="3" fill="#4a5b75" />
          <rect y="9" width="20" height="3" fill="#1e2939" />
        </pattern>
        <clipPath id={`${id}-open`}>
          <rect x="22" y={OPEN_Y} width={W - 44} height={OPEN_H} />
        </clipPath>
      </defs>

      {/* upper windows that are awake before dawn */}
      <g className="b-awake">
        {spec.awake.map((i) => {
          const p = ups[i]
          if (!p) return null
          return (
            <g key={i}>
              <path d={glassPath(p, arch)} fill={`url(#${id}-glow)`} />
              <path d={`M${p.x + p.w / 2} ${p.y}v${p.h}M${p.x} ${p.y + p.h * 0.46}h${p.w}`} stroke={c.trim} strokeWidth="3" fill="none" />
              <rect x={p.x} y={p.y + p.h * 0.46 + 2} width={p.w} height={p.h * 0.3} fill="#000" opacity="0.1" />
            </g>
          )
        })}
      </g>

      {/* the shop interior */}
      <rect x="22" y={OPEN_Y} width={W - 44} height={OPEN_H} fill="#101823" />
      {geo.windows.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill="#17212e" />
      ))}
      <rect x={geo.doorGlass.x} y={geo.doorGlass.y} width={geo.doorGlass.w} height={geo.doorGlass.h} fill="#17212e" />

      <g className="b-lit">
        {geo.windows.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={`url(#${id}-glow)`} />
        ))}
        <rect x={geo.doorGlass.x} y={geo.doorGlass.y} width={geo.doorGlass.w} height={geo.doorGlass.h} fill={`url(#${id}-glow)`} />
        {kind ? <Motif kind={kind} geo={geo} /> : null}
      </g>

      {/* frames over the glass */}
      {geo.windows.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="none" stroke={c.frame} strokeWidth="5" />
          <rect x={p.x - 2} y={p.y + p.h + 3} width={p.w + 4} height={BASE_Y - (p.y + p.h) - 3} fill={c.frame} />
          <rect x={p.x + 8} y={p.y + p.h + 9} width={p.w - 16} height={BASE_Y - (p.y + p.h) - 15} fill="#000" opacity="0.14" />
        </g>
      ))}
      <rect x={geo.door.x} y={geo.door.y} width={geo.door.w} height={geo.door.h} fill={c.door} />
      <rect x={geo.doorGlass.x} y={geo.doorGlass.y} width={geo.doorGlass.w} height={geo.doorGlass.h} fill="#17212e" />
      <rect className="b-lit" x={geo.doorGlass.x} y={geo.doorGlass.y} width={geo.doorGlass.w} height={geo.doorGlass.h} fill={`url(#${id}-glow)`} />
      <rect x={geo.door.x + 10} y={geo.doorGlass.y + geo.doorGlass.h + 10} width={geo.door.w - 20} height={geo.door.h - geo.doorGlass.h - 30} fill="#000" opacity="0.16" />
      <rect x={geo.door.x + geo.door.w - 18} y={geo.door.y + 96} width="6" height="30" rx="3" fill={CREAM} />

      {/* the sign on the door: lit in neon once the shop is open */}
      <g className="b-neon" transform={`translate(${geo.doorGlass.x + geo.doorGlass.w / 2} ${geo.doorGlass.y + 34})`}>
        <path d="M-12 -24l12 8l12 -8" stroke="#10161f" strokeWidth="1.6" fill="none" />
        <rect x="-27" y="-17" width="54" height="26" rx="4" fill={CORAL} opacity="0.22" />
        <rect x="-23" y="-13" width="46" height="18" rx="3" fill="#1a1216" stroke={CORAL} strokeWidth="2.4" />
        <text className="b-neon__text" x="0" y="1.4" textAnchor="middle" fill="#ffb3a8">
          OPEN
        </text>
      </g>

      {/* the roll-down gate */}
      <g clipPath={`url(#${id}-open)`}>
        <g className="b-gate">
          <rect x="22" y={OPEN_Y - 4} width={W - 44} height={OPEN_H + 4} fill={`url(#${id}-slat)`} />
          <rect x="22" y={OPEN_Y - 4} width="9" height={OPEN_H + 4} fill="#1e2939" />
          <rect x={W - 31} y={OPEN_Y - 4} width="9" height={OPEN_H + 4} fill="#1e2939" />
          <rect x="22" y={BASE_Y - 13} width={W - 44} height="13" fill="#56677f" />
          <rect x="22" y={BASE_Y - 13} width={W - 44} height="3" fill="#7d8ea6" />
          <rect x={W / 2 - 22} y={BASE_Y - 26} width="44" height="9" rx="2" fill="none" stroke="#7d8ea6" strokeWidth="3" />
          <rect x={W / 2 + 74} y={BASE_Y - 30} width="13" height="15" rx="2" fill={LAMP} stroke="#10161f" strokeWidth="1.6" />
          <path d={`M${W / 2 + 77} ${BASE_Y - 30}v-4a3.5 3.5 0 0 1 7 0v4`} stroke="#aab6c6" strokeWidth="2" fill="none" />
        </g>
      </g>

      {c.awning ? <Awning colors={c.awning} /> : null}

      {/* lit sign and the lamps above it */}
      <g className="b-signlit">
        {[110, 220, 330].map((x) => (
          <rect key={x} x={x - 62} y={FASCIA_Y + 2} width="144" height={HOUSING_Y - FASCIA_Y - 4} fill={`url(#${id}-lamp)`} />
        ))}
        {sign ? (
          <text className="b-sign" x={W / 2} y={FASCIA_Y + 39} textAnchor="middle" fill="#fff4dc">
            {sign}
          </text>
        ) : (
          <g fill="#fff4dc">
            <rect x="150" y={FASCIA_Y + 22} width="140" height="5" />
            <rect x="182" y={FASCIA_Y + 33} width="76" height="5" />
          </g>
        )}
        {[110, 220, 330].map((x) => (
          <path key={x} d={`M${x + 5} ${FASCIA_Y}h10l-2 -3h-6z`} fill="#fff1c9" />
        ))}
      </g>

      {/* light spilling onto the sidewalk */}
      <path className="b-pool" d={`M26 ${WALK_Y}h${W - 52}l34 ${CURB_Y - WALK_Y}h${-(W + 16)}z`} fill={`url(#${id}-pool)`} />

      {kind ? <Extras kind={kind} geo={geo} /> : null}
    </svg>
  )
}

export function Building({
  kind,
  filler,
  sign,
  index,
}: {
  kind?: ShopKind
  filler?: number
  sign?: string
  /** position of a real shop in the walk (0..4); fillers have none */
  index?: number
}) {
  const spec = kind ? SHOP[kind] : FILLER[(filler ?? 0) % FILLER.length]
  const id = kind ? `b-${kind}` : `f-${filler}`
  const top = FASCIA_Y - spec.floors * FLOOR - 20
  return (
    <div
      className={`b ${kind ? "b--shop" : "b--filler"}`}
      data-shop={index}
      data-filler={kind ? undefined : filler}
      style={{ ["--roof" as string]: `${(top / H) * 100}%` }}
    >
      <Facade spec={spec} sign={sign} id={id} />
      <div className="b-shade" />
      <Front spec={spec} kind={kind} sign={sign} id={id} />
    </div>
  )
}
