export type CategorySeed = {
  slug: string;
  name: string;
  shortDescription: string;
  keywords: string[];
};

export type ProductSeed = {
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  price: number;
  currency: "USD";
  sku: string;
  brand: string;
  inStock: boolean;
};

export const BASE_URL = "https://jdconstructionmaterials.com";

export const categorySeeds: CategorySeed[] = [
  {
    slug: "structural",
    name: "Structural Materials",
    shortDescription: "Cement, concrete blocks, rebar, steel and core structural supplies.",
    keywords: ["structural materials", "cement", "rebar", "cmu blocks"],
  },
  {
    slug: "framing-lumber",
    name: "Framing & Lumber",
    shortDescription: "Lumber, studs, beams and framing fasteners for residential and commercial projects.",
    keywords: ["framing lumber", "2x4", "studs", "beams"],
  },
  {
    slug: "drywall",
    name: "Drywall & Interior",
    shortDescription: "Drywall boards, compounds, tapes and interior finishing systems.",
    keywords: ["drywall", "sheetrock", "joint compound", "interior materials"],
  },
  {
    slug: "roofing",
    name: "Roofing",
    shortDescription: "Shingles, membranes, flashing, sealers and roof installation accessories.",
    keywords: ["roofing materials", "shingles", "waterproof membrane", "flashing"],
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    shortDescription: "Pipes, valves, connectors and plumbing installation accessories.",
    keywords: ["plumbing supplies", "pvc", "pex", "valves"],
  },
  {
    slug: "electrical",
    name: "Electrical",
    shortDescription: "Cables, breakers, panels, outlets, conduit and electrical accessories.",
    keywords: ["electrical supplies", "romex", "breakers", "electrical panel"],
  },
  {
    slug: "hardware",
    name: "Hardware & Fasteners",
    shortDescription: "Screws, nails, anchors, adhesives, silicones and jobsite essentials.",
    keywords: ["fasteners", "screws", "anchors", "construction hardware"],
  },
  {
    slug: "tools",
    name: "Tools & Machinery",
    shortDescription: "Power tools, machinery and contractor-grade equipment.",
    keywords: ["power tools", "construction tools", "drills", "saws"],
  },
  {
    slug: "paint",
    name: "Paint & Finishes",
    shortDescription: "Interior and exterior paint, primers, sealers and application tools.",
    keywords: ["paint supplies", "primer", "finishes", "rollers"],
  },
  {
    slug: "flooring",
    name: "Flooring & Tile",
    shortDescription: "Ceramic, porcelain, vinyl flooring and installation systems.",
    keywords: ["flooring materials", "tile", "porcelain", "vinyl flooring"],
  },
  {
    slug: "insulation",
    name: "Insulation",
    shortDescription: "Thermal insulation and waterproofing systems for walls, roofs and floors.",
    keywords: ["insulation", "fiberglass insulation", "polyurethane foam", "waterproofing"],
  },
];

export const productSeeds: ProductSeed[] = [
  {
    slug: "portland-cement-94lb",
    name: "Portland Cement Type I/II (94 lb Bag)",
    categorySlug: "structural",
    description: "General-purpose Portland cement for concrete, mortar and masonry applications.",
    price: 14.99,
    currency: "USD",
    sku: "CEM-PORTLAND-94",
    brand: "J&D Pro",
    inStock: true,
  },
  {
    slug: "rebar-3-20ft",
    name: "#3 Rebar 20ft (3/8 in Steel Reinforcing Bar)",
    categorySlug: "structural",
    description: "Steel reinforcing bar for concrete reinforcement in slabs and footings.",
    price: 8.49,
    currency: "USD",
    sku: "REB-3-20",
    brand: "J&D Steel",
    inStock: true,
  },
  {
    slug: "osb-7-16-panel-4x8",
    name: "OSB 7/16 in Sheathing Panel 4x8 ft",
    categorySlug: "framing-lumber",
    description: "Structural OSB panel designed for wall and roof sheathing.",
    price: 22.99,
    currency: "USD",
    sku: "OSB-716-48",
    brand: "BuildCore",
    inStock: true,
  },
  {
    slug: "architectural-shingles-3tab",
    name: "Architectural Shingles 3-Tab (Bundle)",
    categorySlug: "roofing",
    description: "Durable shingles engineered for weather resistance and long service life.",
    price: 34.99,
    currency: "USD",
    sku: "ROOF-3TAB",
    brand: "StormGuard",
    inStock: true,
  },
  {
    slug: "drywall-half-inch-4x8",
    name: "1/2 in Drywall Panel 4x8 ft",
    categorySlug: "drywall",
    description: "Standard gypsum drywall panel for interior walls and ceilings.",
    price: 12.49,
    currency: "USD",
    sku: "DRY-12-48",
    brand: "InteriorPro",
    inStock: true,
  },
  {
    slug: "pvc-pipe-schedule40-half-10ft",
    name: "PVC Pipe Schedule 40 - 1/2 in x 10 ft",
    categorySlug: "plumbing",
    description: "Pressure-rated PVC pipe for residential and commercial plumbing lines.",
    price: 4.99,
    currency: "USD",
    sku: "PVC-S40-05-10",
    brand: "FlowLine",
    inStock: true,
  },
  {
    slug: "romex-12-2-250ft",
    name: "12/2 Romex Wire NM-B (250 ft Roll)",
    categorySlug: "electrical",
    description: "Copper NM-B cable suitable for branch circuits in dry locations.",
    price: 89.99,
    currency: "USD",
    sku: "ELC-ROMEX-122-250",
    brand: "ElectraSafe",
    inStock: true,
  },
  {
    slug: "makita-18v-lxt-combo",
    name: "Makita 18V LXT Cordless Drill Combo Kit",
    categorySlug: "tools",
    description: "Contractor-grade cordless drill and impact set for daily jobsite use.",
    price: 229.99,
    currency: "USD",
    sku: "TLS-MAK-LXT-18",
    brand: "Makita",
    inStock: true,
  },
];

export const getCategoryBySlug = (slug: string) =>
  categorySeeds.find((category) => category.slug === slug);

export const getProductBySlug = (slug: string) =>
  productSeeds.find((product) => product.slug === slug);
