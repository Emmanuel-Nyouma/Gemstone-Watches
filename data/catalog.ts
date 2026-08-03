import type { Brand, Category, Product } from "@/types/product";
import { imageManifest } from "./image-manifest";

const withImages = <T extends Omit<Product, "images" | "thumbnail">>(product: T): Product => {
  const images = imageManifest[product.imageFolder] ?? [];
  const fallback = "/images/tissot/prx-powermatic-80/1.webp";
  return { ...product, images: images.length ? images : [fallback], thumbnail: images[0] ?? fallback };
};

const additionalBrand = (name: string, slug: string, origin: string): Brand => ({
  name,
  slug,
  origin,
  introduction: `${name} propose une identité horlogère reconnaissable, avec des modèles pensés pour accompagner le quotidien, les grandes occasions et les styles personnels.`,
  seoCopy: `Découvrez la sélection évolutive de montres ${name} proposée par Gemstone Watches à Douala, avec livraison au Cameroun et expédition internationale.`,
});

const additionalBrands: Brand[] = [
  additionalBrand("Casio", "casio", "Tokyo, Japon"),
  additionalBrand("POEDAGAR", "poedagar", "Collection internationale"),
  additionalBrand("Successway", "successway", "Collection internationale"),
  additionalBrand("Audemars Piguet", "audemars-piguet", "Le Brassus, Suisse"),
  additionalBrand("Patek Philippe", "patek-philippe", "Genève, Suisse"),
  additionalBrand("Richard Mille", "richard-mille", "Les Breuleux, Suisse"),
  additionalBrand("Jacob & Co.", "jacob-and-co", "New York, États-Unis"),
  additionalBrand("Hislon", "hislon", "Istanbul, Turquie"),
  additionalBrand("Timekey", "timekey", "Collection internationale"),
  additionalBrand("IWC", "iwc", "Schaffhouse, Suisse"),
  additionalBrand("Gucci", "gucci", "Florence, Italie"),
  additionalBrand("Michael Kors", "michael-kors", "New York, États-Unis"),
  additionalBrand("Calvin Klein", "calvin-klein", "New York, États-Unis"),
  additionalBrand("Emporio Armani", "emporio-armani", "Milan, Italie"),
  additionalBrand("Vacheron Constantin", "vacheron-constantin", "Genève, Suisse"),
  additionalBrand("Baume & Mercier", "baume-et-mercier", "Genève, Suisse"),
  additionalBrand("St. Alexander", "st-alexander", "Collection internationale"),
  additionalBrand("Hublot", "hublot", "Nyon, Suisse"),
  additionalBrand("Curren", "curren", "Collection internationale"),
  additionalBrand("SKMEI", "skmei", "Collection internationale"),
  additionalBrand("G-SHOCK", "g-shock", "Tokyo, Japon"),
  additionalBrand("Hugo Boss", "hugo-boss", "Metzingen, Allemagne"),
  additionalBrand("BVLGARI", "bvlgari", "Rome, Italie"),
  additionalBrand("Hermès", "hermes", "Paris, France"),
  additionalBrand("Montblanc", "montblanc", "Hambourg, Allemagne"),
  additionalBrand("Movado", "movado", "La Chaux-de-Fonds, Suisse"),
  additionalBrand("Fossil", "fossil", "Richardson, États-Unis"),
  additionalBrand("Dior", "dior", "Paris, France"),
  additionalBrand("Daniel Wellington", "daniel-wellington", "Stockholm, Suède"),
];

export const brands: Brand[] = [
  {
    name: "Rolex",
    slug: "rolex",
    founded: "1905",
    origin: "Geneva, Switzerland",
    introduction: "Rolex watches pair enduring design with exacting Swiss engineering, created to be worn every day and passed between generations.",
    seoCopy: "Explore authenticated Rolex watches selected for condition, provenance and timeless appeal. Every piece is individually inspected before presentation.",
  },
  {
    name: "Omega",
    slug: "omega",
    founded: "1848",
    origin: "Biel/Bienne, Switzerland",
    introduction: "Omega has shaped modern watchmaking through precision timing, ocean exploration and six decades of lunar heritage.",
    seoCopy: "Discover Omega watches with celebrated movements, distinctive design and a record of performance from the racetrack to the Moon.",
  },
  {
    name: "Tudor",
    slug: "tudor",
    founded: "1926",
    origin: "Geneva, Switzerland",
    introduction: "Tudor builds robust Swiss tool watches with purposeful proportions and a confident, contemporary character.",
    seoCopy: "Shop carefully selected Tudor watches, including diving-inspired icons with manufacture movements and exceptional everyday versatility.",
  },
  {
    name: "Cartier",
    slug: "cartier",
    founded: "1847",
    origin: "Paris, France",
    introduction: "Cartier approaches the wristwatch as an object of design, balancing Parisian elegance with a century of horological craft.",
    seoCopy: "Browse Cartier watches distinguished by sculptural cases, Roman numerals and an unmistakable sense of proportion.",
  },
  {
    name: "TAG Heuer",
    slug: "tag-heuer",
    founded: "1860",
    origin: "La Chaux-de-Fonds, Switzerland",
    introduction: "TAG Heuer unites avant-garde watchmaking with an enduring connection to motorsport and split-second precision.",
    seoCopy: "Find TAG Heuer chronographs and sport watches selected for performance, legibility and dynamic Swiss design.",
  },
  {
    name: "Longines",
    slug: "longines",
    founded: "1832",
    origin: "Saint-Imier, Switzerland",
    introduction: "Longines expresses refined Swiss watchmaking through elegant complications and beautifully balanced design.",
    seoCopy: "Explore Longines automatic and dress watches that bring heritage finishing and versatile sophistication to the wrist.",
  },
  {
    name: "Tissot",
    slug: "tissot",
    founded: "1853",
    origin: "Le Locle, Switzerland",
    introduction: "Tissot makes Swiss innovation approachable, combining proven mechanics with designs that feel distinctly of the moment.",
    seoCopy: "Shop Tissot watches selected for strong value, dependable movements and refined everyday wear.",
  },
  {
    name: "Citizen",
    slug: "citizen",
    founded: "1918",
    origin: "Tokyo, Japan",
    introduction: "Citizen advances Japanese watchmaking through precise engineering, progressive materials and expressive mechanical design.",
    seoCopy: "Discover Citizen watches with modern finishing, reliable movements and innovative technology built for daily life.",
  },
  ...additionalBrands,
];

export const categories: Category[] = [
  { name: "Luxury Watches", slug: "luxury-watches", eyebrow: "The collection", description: "Exceptional timepieces chosen for enduring design, provenance and craft." },
  { name: "Automatic Watches", slug: "automatic-watches", eyebrow: "Powered by motion", description: "Self-winding movements that bring mechanical watchmaking to life." },
  { name: "Dress Watches", slug: "dress-watches", eyebrow: "Quiet refinement", description: "Slim profiles and considered details for the most polished occasions." },
  { name: "Sport Watches", slug: "sport-watches", eyebrow: "Built to perform", description: "Robust, legible watches engineered for life beyond the boardroom." },
  { name: "Chronographs", slug: "chronographs", eyebrow: "Measured precision", description: "Iconic stopwatch complications with purposeful, technical dials." },
  { name: "Skeleton Watches", slug: "skeleton-watches", eyebrow: "Mechanics revealed", description: "Open-worked dials that turn intricate movements into architecture." },
  { name: "Women's Watches", slug: "womens-watches", eyebrow: "Elegant proportions", description: "Fine watches selected for beauty, versatility and modern wearability." },
  { name: "Men's Watches", slug: "mens-watches", eyebrow: "Distinctive design", description: "Daily icons, modern classics and performance-led timepieces." },
];

export const products: Product[] = [
  withImages({
    id: "gw-1001", slug: "rolex-datejust-41-black-dial", title: "Datejust 41 Black Dial", brand: "Rolex", brandSlug: "rolex", model: "Datejust 41", referenceNumber: "126334", price: 14850, currency: "USD", condition: "Unworn", availability: "In stock", movement: "Automatic", caseMaterial: "Oystersteel and white gold", caseSize: 41, dialColor: "Black", strap: "Oystersteel bracelet", waterResistance: "100 m", gender: "Men", imageFolder: "/images/rolex/datejust-41", tags: ["fluted bezel", "date", "Swiss"], categories: ["luxury-watches", "automatic-watches", "dress-watches", "mens-watches"], featured: true, popular: 99, createdDate: "2026-07-24",
    description: "A modern expression of the definitive everyday Rolex, this Datejust 41 balances a deep black dial with a luminous white-gold fluted bezel. Its proportions feel assured without sacrificing the model's celebrated versatility.",
    specifications: { Calibre: "Rolex 3235", "Power reserve": "Approximately 70 hours", Crystal: "Scratch-resistant sapphire", Bezel: "Fluted, 18 ct white gold", Bracelet: "Oyster, three-piece solid links", Clasp: "Oysterclasp with Easylink" },
  }),
  withImages({
    id: "gw-1002", slug: "omega-speedmaster-moonwatch-professional", title: "Speedmaster Moonwatch Professional", brand: "Omega", brandSlug: "omega", model: "Speedmaster", referenceNumber: "310.30.42.50.01.001", price: 7800, currency: "USD", condition: "New", availability: "In stock", movement: "Manual", caseMaterial: "Stainless steel", caseSize: 42, dialColor: "Black", strap: "Stainless steel bracelet", waterResistance: "50 m", gender: "Men", imageFolder: "/images/omega/speedmaster-moonwatch", tags: ["chronograph", "Moonwatch", "Master Chronometer"], categories: ["luxury-watches", "sport-watches", "chronographs", "mens-watches"], featured: true, popular: 96, createdDate: "2026-07-18",
    description: "The legendary Moonwatch remains one of watchmaking's most recognizable chronographs. This current-generation reference preserves the stepped dial and dot-over-90 bezel while introducing a Master Chronometer movement.",
    specifications: { Calibre: "Omega 3861", "Power reserve": "50 hours", Crystal: "Hesalite", Bezel: "Anodised aluminium tachymeter", Bracelet: "Five-arched-links-per-row", Certification: "Master Chronometer" },
  }),
  withImages({
    id: "gw-1003", slug: "tudor-black-bay-fifty-eight-navy", title: "Black Bay Fifty-Eight Navy", brand: "Tudor", brandSlug: "tudor", model: "Black Bay 58", referenceNumber: "M79030B-0001", price: 4350, currency: "USD", condition: "Excellent", availability: "Limited availability", movement: "Automatic", caseMaterial: "Stainless steel", caseSize: 39, dialColor: "Navy blue", strap: "Stainless steel bracelet", waterResistance: "200 m", gender: "Unisex", imageFolder: "/images/tudor/black-bay-58", tags: ["diver", "snowflake hands", "manufacture calibre"], categories: ["luxury-watches", "automatic-watches", "sport-watches", "mens-watches"], featured: true, popular: 93, createdDate: "2026-06-29",
    description: "Compact proportions, a rich navy dial and Tudor's signature snowflake hands give the Black Bay Fifty-Eight a compelling vintage spirit. Beneath the surface is a modern manufacture calibre designed for dependable daily wear.",
    specifications: { Calibre: "Manufacture MT5402", "Power reserve": "Approximately 70 hours", Crystal: "Domed sapphire", Bezel: "60-minute unidirectional", Bracelet: "Riveted steel", Certification: "COSC" },
  }),
  withImages({
    id: "gw-1004", slug: "cartier-tank-must-large", title: "Tank Must Large", brand: "Cartier", brandSlug: "cartier", model: "Tank Must", referenceNumber: "WSTA0041", price: 3650, currency: "USD", condition: "New", availability: "Available to order", movement: "Quartz", caseMaterial: "Stainless steel", caseSize: 33, dialColor: "Silver", strap: "Black calfskin leather", waterResistance: "30 m", gender: "Unisex", imageFolder: "/images/cartier/tank-must", tags: ["Roman numerals", "cabochon", "Parisian"], categories: ["luxury-watches", "dress-watches", "womens-watches"], featured: true, popular: 91, createdDate: "2026-07-09",
    description: "The Tank Must distils one of Cartier's purest designs into a beautifully balanced everyday watch. Roman numerals, blued-steel hands and a sapphire cabochon create an identity that is unmistakable from across the room.",
    specifications: { Movement: "High-autonomy quartz", Crystal: "Mineral crystal", Crown: "Beaded with synthetic spinel", Strap: "Black calfskin", Buckle: "Steel ardillon", Shape: "Rectangular" },
  }),
  withImages({
    id: "gw-1005", slug: "tag-heuer-carrera-chronograph-glassbox", title: "Carrera Chronograph Glassbox", brand: "TAG Heuer", brandSlug: "tag-heuer", model: "Carrera", referenceNumber: "CBS2210.FC6534", price: 6450, currency: "USD", condition: "Unworn", availability: "In stock", movement: "Automatic", caseMaterial: "Stainless steel", caseSize: 39, dialColor: "Black", strap: "Black perforated leather", waterResistance: "100 m", gender: "Men", imageFolder: "/images/tag-heuer/carrera-chronograph", tags: ["glassbox", "chronograph", "motorsport"], categories: ["luxury-watches", "automatic-watches", "sport-watches", "chronographs", "mens-watches"], featured: false, popular: 88, createdDate: "2026-07-27",
    description: "A domed crystal flows over the dial's curved flange, giving this Carrera its distinctive glassbox profile. The panda layout is crisp, highly legible and rooted in the collection's celebrated racing heritage.",
    specifications: { Calibre: "TH20-00", "Power reserve": "80 hours", Crystal: "Domed sapphire", Functions: "Hours, minutes, seconds, chronograph", Strap: "Perforated calfskin", Clasp: "Folding steel" },
  }),
  withImages({
    id: "gw-1006", slug: "longines-master-collection-moonphase", title: "Master Collection Moonphase", brand: "Longines", brandSlug: "longines", model: "Master Collection", referenceNumber: "L2.919.4.78.3", price: 2950, currency: "USD", condition: "New", availability: "In stock", movement: "Automatic", caseMaterial: "Stainless steel", caseSize: 42, dialColor: "Silver barleycorn", strap: "Brown alligator leather", waterResistance: "30 m", gender: "Men", imageFolder: "/images/longines/master-collection", tags: ["moonphase", "calendar", "guilloché"], categories: ["luxury-watches", "automatic-watches", "dress-watches", "mens-watches"], featured: false, popular: 84, createdDate: "2026-05-17",
    description: "Longines brings calendar information and a poetic moonphase display together on a textured silver dial. The result is richly detailed yet composed, with classic blued hands and a warm leather strap.",
    specifications: { Calibre: "L899", "Power reserve": "72 hours", Crystal: "Scratch-resistant sapphire", Complication: "Moonphase and date", Strap: "Alligator leather", Buckle: "Triple safety folding clasp" },
  }),
  withImages({
    id: "gw-1007", slug: "tissot-prx-powermatic-80-blue", title: "PRX Powermatic 80 Blue", brand: "Tissot", brandSlug: "tissot", model: "PRX", referenceNumber: "T137.407.11.041.00", price: 775, currency: "USD", condition: "New", availability: "In stock", movement: "Automatic", caseMaterial: "Stainless steel", caseSize: 40, dialColor: "Ice blue", strap: "Integrated steel bracelet", waterResistance: "100 m", gender: "Unisex", imageFolder: "/images/tissot/prx-powermatic-80", tags: ["integrated bracelet", "waffle dial", "Swiss"], categories: ["automatic-watches", "sport-watches", "mens-watches"], featured: true, popular: 95, createdDate: "2026-07-30",
    description: "The PRX pairs a sharply faceted integrated case with an ice-blue waffle dial and a movement built for the pace of a full weekend. It is confident, versatile and one of modern Swiss watchmaking's strongest values.",
    specifications: { Calibre: "Powermatic 80.111", "Power reserve": "Up to 80 hours", Crystal: "Sapphire", Dial: "Embossed checkerboard", Bracelet: "Quick-release steel", Clasp: "Butterfly push-button" },
  }),
  withImages({
    id: "gw-1008", slug: "citizen-series-8-skeleton", title: "Series 8 Skeleton", brand: "Citizen", brandSlug: "citizen", model: "Series 8", referenceNumber: "NB6060-58L", price: 1595, currency: "USD", condition: "New", availability: "Limited availability", movement: "Automatic", caseMaterial: "Stainless steel", caseSize: 42, dialColor: "Open-worked blue", strap: "Stainless steel bracelet", waterResistance: "100 m", gender: "Men", imageFolder: "/images/citizen/series-8-skeleton", tags: ["skeleton", "anti-magnetic", "Japanese"], categories: ["automatic-watches", "sport-watches", "skeleton-watches", "mens-watches"], featured: false, popular: 79, createdDate: "2026-06-06",
    description: "Strong geometric bridges frame the Series 8's open-worked dial, revealing the rhythm of its automatic calibre. The integrated bracelet and layered blue architecture give it an energetic, distinctly modern presence.",
    specifications: { Calibre: "9054", "Power reserve": "42 hours", Crystal: "Sapphire with anti-reflective coating", Resistance: "16,000 A/m anti-magnetic", Bracelet: "Integrated steel", Frequency: "28,800 vph" },
  }),
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
export const getBrand = (slug: string) => brands.find((brand) => brand.slug === slug);
export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
export const getBrandProducts = (slug: string) => products.filter((product) => product.brandSlug === slug);
export const getCategoryProducts = (slug: string) => products.filter((product) => product.categories.includes(slug));
export const formatPrice = (price: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
