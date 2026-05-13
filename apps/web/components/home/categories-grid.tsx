import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    label: "Structural Materials",
    slug: "structural",
    emoji: "🏗️",
    color: "bg-slate-100 hover:bg-slate-200",
    count: "Cement, Blocks, Rebar, Plywood",
  },
  {
    label: "Roofing",
    slug: "roofing",
    emoji: "🏠",
    color: "bg-orange-50 hover:bg-orange-100",
    count: "Shingles, Membranes, Flashing",
  },
  {
    label: "Plumbing",
    slug: "plumbing",
    emoji: "🔧",
    color: "bg-blue-50 hover:bg-blue-100",
    count: "PVC, PEX, Copper, Valves",
  },
  {
    label: "Electrical",
    slug: "electrical",
    emoji: "⚡",
    color: "bg-yellow-50 hover:bg-yellow-100",
    count: "Cables, Panels, Conduit, LEDs",
  },
  {
    label: "Drywall & Interior",
    slug: "drywall",
    emoji: "🧱",
    color: "bg-stone-100 hover:bg-stone-200",
    count: "Drywall, Joint Compound, Tape",
  },
  {
    label: "Tools & Machinery",
    slug: "tools",
    emoji: "🛠️",
    color: "bg-red-50 hover:bg-red-100",
    count: "Drills, Saws, Compressors",
  },
  {
    label: "Flooring & Tile",
    slug: "flooring",
    emoji: "🪵",
    color: "bg-amber-50 hover:bg-amber-100",
    count: "Ceramic, Porcelain, Vinyl, LVP",
  },
  {
    label: "Paint & Finishes",
    slug: "paint",
    emoji: "🎨",
    color: "bg-purple-50 hover:bg-purple-100",
    count: "Interior, Exterior, Primers",
  },
  {
    label: "Framing & Lumber",
    slug: "framing-lumber",
    emoji: "🪚",
    color: "bg-lime-50 hover:bg-lime-100",
    count: "2x4, OSB, Metal Studs, Trusses",
  },
  {
    label: "Insulation",
    slug: "insulation",
    emoji: "🌡️",
    color: "bg-cyan-50 hover:bg-cyan-100",
    count: "Foam, Fiberglass, Membranes",
  },
  {
    label: "Hardware & Fasteners",
    slug: "hardware",
    emoji: "🔩",
    color: "bg-zinc-100 hover:bg-zinc-200",
    count: "Screws, Anchors, Adhesives",
  },
  {
    label: "Safety & PPE",
    slug: "safety",
    emoji: "🦺",
    color: "bg-green-50 hover:bg-green-100",
    count: "Helmets, Gloves, Safety Glasses",
  },
];

export function CategoriesGrid() {
  return (
    <section className="py-8">
      <div className="container-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-[#1A1A1A]">Shop by Department</h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              Professional materials for every stage of construction
            </p>
          </div>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-sm text-[#0071CE] font-semibold hover:text-[#002D62] transition-colors"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`${cat.color} rounded-xl p-4 flex flex-col items-center text-center transition-all duration-150 group border border-transparent hover:border-[#0071CE]/20 hover:shadow-sm`}
            >
              <span className="text-3xl mb-2">{cat.emoji}</span>
              <span className="text-xs font-bold text-[#1A1A1A] leading-tight group-hover:text-[#0071CE] transition-colors">
                {cat.label}
              </span>
              <span className="text-[10px] text-[#9CA3AF] mt-1 line-clamp-1 hidden sm:block">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
