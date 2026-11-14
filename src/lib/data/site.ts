/**
 * All business content for the NYC Small Business Resource Network site.
 * Every fact here comes from the scraped source in `raw messy data/`.
 * See README.md ("Content notes") for the handful of places where the
 * source was ambiguous and how each was resolved.
 */

export type BoroughId = "bronx" | "brooklyn" | "manhattan" | "queens" | "staten-island";

export type ImageAsset = { src: string; width: number; height: number; alt: string };

export const site = {
  name: "NYC Small Business Resource Network",
  shortName: "NYC SBRN",
  url: "https://www.nycsmallbusinessresourcenetwork.org",
  description:
    "Personalized guidance and resources for New York City small businesses, from on-the-ground specialists at the Chambers of Commerce of all five boroughs.",
  email: "info@nycsmallbusinessresourcenetwork.org",
  address: {
    careOf: "c/o Brooklyn Chamber of Commerce",
    street: "253 36th Street, Building 3 (4th Floor)",
    city: "Brooklyn, NY 11232",
  },
  /** External business profile form (the primary conversion on the original site). */
  profileFormUrl: "https://nyc-sbrn.formtitan.com/NYCSmallBusinessResourceNetwork#/",
  inquirySubject: "NYC Small Business Resource Network inquiry",
} as const;

export const nav = [
  { label: "About", href: "/about" },
  { label: "Open + Online", href: "/openandonline" },
  { label: "Stories", href: "/stories" },
  { label: "Media", href: "/media" },
] as const;

export const cta = { label: "Connect with us", href: "/connect" } as const;

export const hero = {
  question: "Are you a small business?",
  answer: "We are here to help you.",
  body: "Get personalized guidance & resources for your business.",
  /** Source line: "IF YOU ARE A NYC SMALL BUSINESS — WE CAN HELP". Broken into three lines for the finale. */
  promise: ["If you are a NYC", "small business,", "we can help."],
  /** The hero answer line as it appears on each translated version of the original site. */
  greetings: [
    { lang: "es", text: "Nosotros podemos ayudar." },
    { lang: "zh", text: "我们随时都能提供帮助。" },
    { lang: "ko", text: "저희가 도와드리겠습니다." },
    { lang: "ru", text: "Мы готовы помочь вам." },
    { lang: "ht", text: "Nou la pou nou ede ou." },
    { lang: "ur", text: "ہم آپ کی مدد کے لیے موجود ہیں۔", dir: "rtl" as const },
    { lang: "tl", text: "Nandito kami upang tulungan ka." },
    { lang: "el", text: "Είμαστε εδώ για να σας βοηθήσουμε." },
  ],
} as const;

export type Service = {
  id: string;
  name: string;
  /** How the sign is drawn on the block. */
  shop: "party" | "cafe" | "studio" | "corner" | "market";
  proof: string;
  storySlug?: string;
};

export const offer = {
  heading: "What we offer",
  intro:
    "As your business opens or reopens, our on-the-ground Small Business Support Specialists can help you grow your business.",
  services: [
    {
      id: "grants-loans",
      name: "Grants & loans",
      shop: "party",
      proof:
        "La Bomboniera Marylu in Astoria secured a $20,000 grant that paid all of its back-owed rent and kept the store open.",
      storySlug: "la-bomboniera-marylu",
    },
    {
      id: "digital-marketing",
      name: "Digital marketing",
      shop: "cafe",
      proof:
        "OurtBox Cafe in Manhattan secured a LinkNYC digital advertising spot at no cost.",
      storySlug: "ourtbox-cafe",
    },
    {
      id: "getting-online",
      name: "Getting online",
      shop: "studio",
      proof:
        "Pan-African Solutions Consulting in Brooklyn had lost access to its website. Within a few weeks, it had an entirely new one.",
      storySlug: "pan-african-solutions",
    },
    {
      id: "lease-negotiations",
      name: "Lease negotiations",
      shop: "corner",
      proof:
        "Bring your lease questions to the Small Business Support Specialist at your borough’s Chamber of Commerce.",
    },
    {
      id: "business-planning",
      name: "Business planning",
      shop: "market",
      proof:
        "The owners of Valid Vibes on Staten Island completed digital trainings and began MWBE certification to open new vending opportunities.",
      storySlug: "valid-vibes",
    },
  ] satisfies Service[],
} as const;

/** The one question preserved from the original homepage carousel. */
export const ask = {
  sector: "Restaurants",
  question: "How can I make my restaurant outdoor dining compliant?",
  answer: "We’ll help you find expert services through one of our partners.",
} as const;

export const about = {
  heading: "Who we are",
  statement: ["Serving the small businesses", "that make New York,", "New York."],
  paragraphs: [
    "The NYC Small Business Resource Network is a comprehensive approach to strengthening New York City’s economy and assisting small businesses. The Network was built to support small business resiliency by offering personalized guidance as you open and reopen.",
    "Launched in response to the crisis facing many of the city’s 230,000+ small businesses in the wake of COVID-19, we’ve assembled an extraordinary collaboration of New Yorkers who are committed to small business recovery in our communities.",
    "We are leveraging our relationships with the city’s corporate, financial and professional services sectors, as well as universities, philanthropies and expert volunteers to help small business owners gain access to a range of programs and services.",
    "Our public-private partnership was launched with a generous, multi-year grant from the New York City-based Peter G. Peterson Foundation. Additional funding was provided by the New York City Economic Development Corporation and in-kind contributions from other partners.",
  ],
  facts: [
    { value: 1, suffix: "", label: "Resource network" },
    { value: 230000, suffix: "+", label: "Small businesses" },
    { value: 5, suffix: "", label: "Boroughs" },
  ],
} as const;

export type Chamber = {
  id: BoroughId;
  borough: string;
  name: string;
  url: string;
  email: string;
  logo: ImageAsset;
  /** Marker position on the street map, in percent of the image box. */
  pin: { x: number; y: number };
};

export const chambers: Chamber[] = [
  {
    id: "bronx",
    borough: "Bronx",
    name: "Bronx Chamber of Commerce",
    url: "https://www.bronxchamber.org/",
    email: "helpdesk@bronxchamber.org",
    logo: { src: "/media/partners/bronx-chamber.webp", width: 212, height: 143, alt: "Bronx Chamber of Commerce" },
    pin: { x: 64.5, y: 9 },
  },
  {
    id: "brooklyn",
    borough: "Brooklyn",
    name: "Brooklyn Chamber of Commerce",
    url: "https://www.brooklynchamber.com/",
    email: "info@brooklynchamber.com",
    logo: { src: "/media/partners/brooklyn-chamber.webp", width: 900, height: 305, alt: "Brooklyn Chamber of Commerce" },
    pin: { x: 57, y: 74 },
  },
  {
    id: "manhattan",
    borough: "Manhattan",
    name: "Manhattan Chamber of Commerce",
    url: "https://www.manhattancc.org/",
    email: "helpdesk@manhattancc.org",
    logo: { src: "/media/partners/manhattan-chamber.webp", width: 900, height: 302, alt: "Manhattan Chamber of Commerce" },
    pin: { x: 53.4, y: 31 },
  },
  {
    id: "queens",
    borough: "Queens",
    name: "Queens Chamber of Commerce",
    url: "https://www.queenschamber.org/",
    email: "bizdev@queenschamber.org",
    logo: { src: "/media/partners/queens-chamber.webp", width: 900, height: 338, alt: "Queens Chamber of Commerce" },
    pin: { x: 73.5, y: 46 },
  },
  {
    id: "staten-island",
    borough: "Staten Island",
    name: "Staten Island Chamber of Commerce",
    url: "https://www.sichamber.com/",
    email: "businesshelp@sichamber.com",
    logo: { src: "/media/partners/staten-island-chamber.webp", width: 900, height: 459, alt: "Staten Island Chamber of Commerce" },
    pin: { x: 36.5, y: 88 },
  },
];

export const partners = {
  funding: [
    {
      name: "Peter G. Peterson Foundation",
      url: "https://www.pgpf.org/",
      role: "Launched the Network with a generous, multi-year grant.",
    },
    {
      name: "New York City Economic Development Corporation",
      url: "https://edc.nyc/",
      role: "Provided additional funding.",
    },
    {
      name: "Partnership Fund for New York City",
      url: "https://partnershipfundnyc.org/",
      role: "",
    },
  ],
  collaboration: [
    { name: "NYC Department of Small Business Services", url: "https://www1.nyc.gov/site/sbs/index.page" },
    { name: "Partnership for New York City", url: "https://pfnyc.org/" },
  ],
} as const;

export const openOnline = {
  name: "Open + Online",
  fullName: "NYC Small Biz: Open + Online",
  lead: "It’s crucial that your small business has a strong online presence to compete in today’s marketplace.",
  offer: "The Open + Online program offers free website building, logo & branding design, or expert SEO (search engine optimization) consulting.",
  status: "We are not accepting new applications at this time.",
  teaser: [
    "Many small businesses need a better online presence to compete in today’s marketplace.",
    "The NYC Small Biz: Open + Online program has created free quality websites (including e-commerce) and new logos for hundreds of small businesses, helping them compete in the digital economy.",
    "Please reach out to learn how a digital presence can help your business.",
  ],
  steps: [
    {
      title: "Project guidance",
      text: "A dedicated Project Manager will collect your materials and guide you through the program.",
      icon: "/media/icons/project-guidance.webp",
    },
    {
      title: "Design sessions",
      text: "You’ll have two sessions with your web designer to plan out and review your custom website.",
      icon: "/media/icons/design-sessions.webp",
    },
    {
      title: "Video tutorial",
      text: "We’ll set you up with a walkthrough video of your new site, showing you how to manage it.",
      icon: "/media/icons/video-tutorial.webp",
    },
    {
      title: "Specialist support",
      text: "A Tech Specialist will help you launch your site, and can assist you with advice & guidance going forward.",
      icon: "/media/icons/specialist-support.webp",
    },
  ],
  free: [
    { item: "Hosting", text: "We pay for your first full year of website hosting using the Squarespace.com builder & platform." },
    { item: "Domain", text: "After building, we can help register a domain name for your new website, if you don’t own one already." },
    { item: "Design", text: "Professional designers typically charge thousands for their services. We’ve got the design fees covered for you!" },
    { item: "Logo & branding", text: "For logo & branding projects, all designs are done from scratch and you’ll have full ownership of the final files." },
    { item: "SEO", text: "For SEO improvements, hiring a consultant can be expensive, but learning from our expert is absolutely free!" },
  ],
  projects: [
    // url is null where the live site no longer resolved when checked on 2026-11-14
    { name: "A Princess & An Heiress", url: null, slug: "a-princess-and-an-heiress", w: 921, h: 792 }, // was https://princessandheiress.com/
    { name: "Harlem’s Heaven Hats", url: "https://www.harlemsheaven.com/", slug: "harlems-heaven-hats", w: 921, h: 792 },
    { name: "Eleven Island Enterprises", url: "https://www.elevenislandenterprises.com/", slug: "eleven-island-enterprises", w: 921, h: 792 },
    { name: "Eat Soccer", url: "http://www.eatsoccer.com", slug: "eat-soccer", w: 1827, h: 865 },
    { name: "Simple Skin Spa", url: "https://www.simpleskinspa.com/", slug: "simple-skin-spa", w: 921, h: 794 },
    { name: "MoJazz Dance", url: "https://www.mojazzdance.com/", slug: "mojazz-dance", w: 2000, h: 1022 },
    { name: "Sankofa Learning Place", url: "https://sankofalearningplacellc.co/", slug: "sankofa-learning-place", w: 921, h: 792 },
    { name: "Mole Poblano Asuncion", url: "https://www.molepoblanoasuncionnyc.com/", slug: "mole-poblano-asuncion", w: 2000, h: 1067 },
    { name: "Xenia World Wide Travel", url: null, slug: "xenia-world-wide-travel", w: 2000, h: 1041 }, // was https://www.xeniatravels.com/
    { name: "Broadway Silk Store", url: "https://www.broadwayfabricsandgifts.com/", slug: "broadway-silk-store", w: 2000, h: 1041 },
    { name: "Casa Lu Art Space", url: "https://www.casaluartspace.com/", slug: "casa-lu-art-space", w: 2000, h: 1084 },
    { name: "Cornel’s Catering", url: "https://www.cornelscatering.com/", slug: "cornels-catering", w: 2000, h: 1041 },
  ],
  /** Grouped exactly as the original page groups them. */
  funders: [
    ["Wells Fargo"],
    ["Amazon", "Bank of America", "Crown Castle", "KKR", "Macy’s"],
    [
      "Capital One Bank",
      "Centerview Partners",
      "Chris Hughes",
      "Deanna Mulligan",
      "Deutsche Bank of Americas Foundation",
      "First Republic Bank",
      "Fiserv and Clover",
      "Medidata Solutions (a Dassault Systèmes Company)",
      "Meta",
      "Wachtell, Lipton, Rosen & Katz",
      "West Monroe",
    ],
    ["AlleyCorp", "Google", "IAC", "Kirkland & Ellis", "Silicon Valley Bank"],
  ],
} as const;

export type Story = {
  slug: string;
  borough: BoroughId;
  name: string;
  place?: string;
  url?: string;
  image: ImageAsset;
  /** A short fact lifted from the story text, used on cards. */
  fact: { figure: string; label: string };
  quote?: { text: string; by: string };
  body: string;
};

export const storiesIntro = {
  heading: "Our impact on small businesses",
  text: "Learn how the Small Business Resource Network assisted these businesses across the five boroughs by connecting them to resources and offering personalized support that helped them to grow and thrive.",
} as const;

export const stories: Story[] = [
  {
    slug: "pan-african-solutions",
    borough: "brooklyn",
    name: "Pan-African Solutions Consulting",
    // link removed: the address no longer resolved when checked on 2026-11-14 (original: https://www.pan-africansolutions.com/)
    image: {
      src: "/media/stories/pan-african-solutions.webp",
      width: 760,
      height: 539,
      alt: "Chevelle Dixon, owner of Pan-African Solutions Consulting, in a red blazer",
    },
    fact: { figure: "New website", label: "built within a few weeks through Open + Online" },
    body: "Chevelle Dixon, owner of Pan-African Solutions Consulting, was interested in updating her business website, but the person she worked with previously had become unreachable, leaving her completely without website access. An SBRN Specialist shared information about our Open + Online program and encouraged her to apply in order to get an entirely new website. Within a few weeks, her new website was created, it’s much better looking than her last site, easy for her to manage, and she’s received numerous compliments on it from current and prospective clients.",
  },
  {
    slug: "brooklyn-burgers-and-beer",
    borough: "brooklyn",
    name: "Brooklyn Burgers & Beer",
    place: "Park Slope",
    url: "https://www.brooklynburgersandbeer.com/",
    image: {
      src: "/media/stories/brooklyn-burgers-and-beer.webp",
      width: 971,
      height: 728,
      alt: "Six people standing outside the blue storefront of Brooklyn Burgers & Beer",
    },
    fact: { figure: "$2,500", label: "donated after the September 2023 flood" },
    body: "Brooklyn Burgers & Beer in Park Slope was severely impacted by flood waters in September 2023. With assistance from the SBRN team at the Brooklyn Chamber of Commerce, the business received a donation of $2,500 from Brooklyn Methodist Hospital - New York-Presbyterian. Additionally, the manager of the restaurant was interested in taking courses offered by the Business Solutions Center. Our team shared a list of upcoming courses with registration links so that he may further his education and run the business more effectively.",
  },
  {
    slug: "la-bomboniera-marylu",
    borough: "queens",
    name: "La Bomboniera Marylu",
    place: "Astoria",
    url: "https://www.labombonieramarylu.com/",
    image: {
      src: "/media/stories/la-bomboniera-marylu.webp",
      width: 888,
      height: 666,
      alt: "Three people standing together inside La Bomboniera Marylu, with party supplies on the wall behind them",
    },
    fact: { figure: "$20,000", label: "grant that paid all of the back-owed rent" },
    body: "La Bomboniera Marylu in Astoria is a neighborhood favorite for party supplies and decorations. The owner fell behind on rent during the pandemic due to slow business and caring for sick family members. With the assistance of the SBRN, they were able to secure a $20,000 grant which helped to pay all their back-owed rent and keep the store open. When flood waters from Tropical Storm Ida caused the loss of nearly $10,000 in goods and equipment, their SBRN Specialist assisted them once again with applying for additional FEMA funding.",
  },
  {
    slug: "madefresh-organic",
    borough: "queens",
    name: "MadeFresh Organic",
    place: "Rosedale",
    url: "https://madefreshorganic.com/",
    image: {
      src: "/media/stories/madefresh-organic.webp",
      width: 569,
      height: 427,
      alt: "A woman in a MadeFresh Organic shirt flexes her arm and holds a bottle of juice to her forehead",
    },
    fact: { figure: "New contracts", label: "with NYU Langone and the American Cancer Society" },
    body: "Juliana Rivera is the founder, CEO, and creative mind behind MadeFresh Organic, an organic juice company based in Rosedale. Our work with Juliana through the SBRN allowed her to participate in the Citi Field Business Expo and Queens Day in Albany, which led directly to the acquisition of new corporate contracts with NYU Langone and the American Cancer Society. Since working with the Small Business Resource Network, she has seen an increase in sales, has new product visibility, diversified revenue streams and overall huge business growth.",
  },
  {
    slug: "ourtbox-cafe",
    borough: "manhattan",
    name: "OurtBox Cafe",
    // link removed: the address no longer resolved when checked on 2026-11-14 (original: https://www.ourtboxcafe.com/)
    image: {
      src: "/media/stories/ourtbox-cafe.webp",
      width: 1238,
      height: 825,
      alt: "A smiling woman in front of a LinkNYC street screen showing an ad for OurtBox Cafe",
    },
    fact: { figure: "No cost", label: "for a LinkNYC digital advertising spot" },
    body: "OurtBox Cafe is a coffee shop and community space that reached out to the Manhattan Chamber of Commerce seeking marketing assistance. The Small Business Resource Network has access to an opportunity with LinkNYC, the freestanding digital signage structures placed across the city. Our team connected OurtBox Cafe with the LinkNYC resource, and they were able to secure a digital advertising spot at no cost. OurtBox Cafe will be featured on LinkNYC signage during the month of February, as part of a promotion for cafes and bakeries.",
  },
  {
    slug: "harlems-heaven-hats",
    borough: "manhattan",
    name: "Harlem’s Heaven Hats",
    place: "Harlem",
    url: "https://www.harlemsheaven.com/",
    image: {
      src: "/media/stories/harlems-heaven-hats.webp",
      width: 464,
      height: 348,
      alt: "Two people smiling inside Harlem’s Heaven Hats, holding an SBRN flyer in front of a wall of hats",
    },
    fact: { figure: "30+ years", label: "in Harlem, now with a brand-new website" },
    quote: {
      text: "My Harlem-based store has been in operation for more than 30 years. I was struggling with my outdated website and didn’t know what to do next until the Small Business Resource Network came by. I just received my brand-new website through the Open + Online program and cannot wait to speak with the business strategy consultant you connected me with about the next chapter for my business! Honey, you guys are stars!",
      by: "Evetta Petty, Owner of Harlem’s Heaven Hats",
    },
    body: "",
  },
  {
    slug: "valid-vibes",
    borough: "staten-island",
    name: "Valid Vibes",
    // link removed: the address no longer resolved when checked on 2026-11-14 (original: https://www.validvibes.org/)
    image: {
      src: "/media/stories/valid-vibes.webp",
      width: 1061,
      height: 796,
      alt: "The Valid Vibes website, showing its two owners posing in front of a banner",
    },
    fact: { figure: "MWBE", label: "certification under way, after digital trainings" },
    body: "The owners of Valid Vibes had been selling their merchandise out of a mall marketplace, and were looking for ways to expand. The SBRN team connected them with the Verizon Small Business Digital Ready program, and they completed digital trainings and courses to gain more business acumen. We also connected them with the Business Solutions Center to begin the process of gaining MWBE certification, to allow for new vending opportunities. Additionally, the owners went on to become mentors for the S.I. Chamber’s Young Entrepreneurs program.",
  },
  {
    slug: "vincents-barber-shop",
    borough: "staten-island",
    name: "Vincent’s Barber Shop",
    place: "Stapleton",
    image: {
      src: "/media/stories/vincents-barber-shop.webp",
      width: 1071,
      height: 803,
      alt: "The storefront of Vincent’s Barber Shop, with a blue awning and two barber poles",
    },
    fact: { figure: "$10,000", label: "LISC grant, then over $10,000 in ESD funding" },
    body: "Vincent’s Barber Shop has operated in the Stapleton area of Staten Island for over 20 years. After closing for several months of the pandemic, the owner, Emilio, reopened to find himself in need of business assistance. The SBRN team helped Emilio apply for and obtain a $10,000 grant from LISC. He tried to apply for ESD funding in 2021, but did not meet the eligibility requirements. When the grant requirements were lifted in 2022, our team reached back out to Emilio, and he was able to successfully apply and ultimately received over $10,000 in ESD funding.",
  },
  {
    slug: "chocobar-cortes",
    borough: "bronx",
    name: "Chocobar Cortes",
    url: "https://www.chocobarcortes.com/",
    image: {
      src: "/media/stories/chocobar-cortes.webp",
      width: 1147,
      height: 860,
      alt: "The Chocobar Cortes website, showing a bright dining room with a checkered floor",
    },
    fact: { figure: "Paid interns", label: "plus grant applications and MWBE certification" },
    body: "Chocobar Cortes traces its roots back to Puerto Rico, specializing in chocolate-infused dishes. Although he had some previous industry experience, the owner, Carlos, still faced challenges accessing resources. With the help of the SBRN, Carlos has applied for numerous grants, MWBE certification, and an exclusive program which places paid interns in local food service establishments. The SBRN team helped Carlos integrate into the greater Bronx business community, and Chocobar Cortes has become a trusted business and community stakeholder.",
  },
  {
    slug: "neat-dry-clean",
    borough: "bronx",
    name: "NEAT Dry Clean & Tailoring",
    place: "East Tremont",
    // link removed: the address no longer resolved when checked on 2026-11-14 (original: https://www.nycneat.com/)
    image: {
      src: "/media/stories/neat-dry-clean.webp",
      width: 566,
      height: 425,
      alt: "Two men taking a selfie inside NEAT Dry Clean & Tailoring, one wearing a Bronx Chamber of Commerce fleece",
    },
    fact: { figure: "$5,000", label: "awarded in ESD Pandemic Recovery funding" },
    body: "NEAT Dry Clean & Tailoring is located on the East Tremont business corridor in the Bronx. The owner, Luis, was interested in applying for the ESD Pandemic Recovery Grant. Our Small Business Resource Network team helped Luis prepare the necessary documents for his application. During the review phase of the application, Luis reached out to our Business Support Specialist for more guidance on how to move his application forward. A few weeks later, Luis learned he had been awarded $5,000 in funding, allowing him to further grow his business.",
  },
];

export const boroughOrder: BoroughId[] = ["brooklyn", "queens", "manhattan", "staten-island", "bronx"];

export const boroughName: Record<BoroughId, string> = {
  bronx: "Bronx",
  brooklyn: "Brooklyn",
  manhattan: "Manhattan",
  queens: "Queens",
  "staten-island": "Staten Island",
};

export const connect = {
  heading: "Connect with us",
  text: "To get started with us, submit your business profile and tell us what type of help you need.",
  formLabel: "Submit your business profile",
  chamberNote: "Please contact your local Chamber of Commerce for more information:",
} as const;

export function mailto(email: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(site.inquirySubject)}`;
}
