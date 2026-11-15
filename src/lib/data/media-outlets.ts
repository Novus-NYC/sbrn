const pressMark = (file: string, width: number, height: number) => ({
  src: `/media/press/${file}`,
  width,
  height,
})

type OutletMark = {
  image: ReturnType<typeof pressMark>
  caption?: string
}

const abc7 = pressMark("abc7.svg", 1000, 732)
const news12 = pressMark("news12.svg", 78, 22)
const ny1 = pressMark("ny1.svg", 1543, 411)

export const outletMarks: Readonly<Partial<Record<string, OutletMark>>> = {
  "The New York Times": { image: pressMark("new-york-times.svg", 512, 86) },
  "ABC 7 NY": { image: abc7 },
  PIX11: { image: pressMark("pix11.svg", 3167, 1000) },
  "Spectrum News NY1": { image: ny1 },
  "News 12": { image: news12 },
  amNewYork: { image: pressMark("amnewyork.svg", 699, 107) },
  "Staten Island Advance": { image: pressMark("staten-island-advance.webp", 720, 142) },
  "Crain’s New York Business": { image: pressMark("crains.webp", 520, 26) },
  "Black Enterprise": { image: pressMark("black-enterprise.webp", 520, 131) },
  "NY Business Journal": { image: pressMark("ny-business-journal.webp", 520, 167) },
  "Queens Gazette": { image: pressMark("queens-gazette.webp", 470, 196) },
  "QNS.com": { image: pressMark("qns.webp", 170, 125) },
  "Harlem World Magazine": { image: pressMark("harlem-world.webp", 520, 174) },
  BronxNet: { image: pressMark("bronxnet.webp", 520, 68) },
  "Politics NY": { image: pressMark("politics-ny.webp", 520, 64) },
  "6sqft": { image: pressMark("6sqft.webp", 335, 200) },
  "El Diario NY": { image: pressMark("el-diario.webp", 520, 119) },
  "Next City": { image: pressMark("next-city.webp", 136, 120) },
  "WCBS Newsradio 880": { image: pressMark("wcbs.webp", 203, 200) },
  "News 12 The Bronx": { image: news12, caption: "The Bronx" },
  "News 12 Brooklyn": { image: news12, caption: "Brooklyn" },
  "Tiempo, ABC 7": { image: abc7, caption: "Tiempo" },
  NY1: { image: ny1, caption: "In Focus" },
  "New York City Council": { image: pressMark("city-council.webp", 186, 200), caption: "New York City Council" },
  "Tap Into Sutton Place/Lenox Hill": { image: pressMark("tapinto.webp", 500, 110), caption: "Sutton Place/Lenox Hill" },
  "NY1 Noticias": { image: pressMark("ny1-noticias.svg", 1539, 403) },
  NYCEDC: { image: pressMark("nycedc.webp", 244, 86) },
  "NYC Office of the Mayor": { image: pressMark("mayors-office.webp", 480, 160), caption: "NYC Office of the Mayor" },
  "Office of Senator Chuck Schumer": { image: pressMark("senator-schumer.webp", 480, 120) },
  "Manhattan Chamber of Commerce": { image: { src: "/media/partners/manhattan-chamber.webp", width: 900, height: 302 } },
  "Staten Island Chamber of Commerce": { image: { src: "/media/partners/staten-island-chamber.webp", width: 900, height: 459 } },
}

export const outletLanes: readonly (readonly string[])[] = [
  [
    "The New York Times", "ABC 7 NY", "PIX11", "Spectrum News NY1", "News 12",
    "amNewYork", "Staten Island Advance", "Crain’s New York Business", "Black Enterprise", "NY Business Journal",
  ],
  [
    "Queens Gazette", "QNS.com", "Harlem World Magazine", "BronxNet", "Politics NY",
    "Tap Into Sutton Place/Lenox Hill", "6sqft", "El Diario NY", "Next City", "WCBS Newsradio 880",
  ],
]
