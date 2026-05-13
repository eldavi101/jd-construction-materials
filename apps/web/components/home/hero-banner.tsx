import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";

const promoBanners = [
  {
    badge: "Pro Deals",
    title: "Up to 30% Off Roofing Materials",
    subtitle: "Hurricane season is coming. Stock up now.",
    cta: "Shop Roofing",
    href: "/category/roofing",
    bg: "bg-[#002D62]",
    accent: "text-[#FFC220]",
  },
  {
    badge: "New Arrivals",
    title: "Premium Power Tools In Stock",
    subtitle: "Milwaukee, DeWalt & Makita — ready to ship.",
    cta: "Shop Tools",
    href: "/category/tools",
    bg: "bg-[#0071CE]",
    accent: "text-[#FFC220]",
  },
];

export function HeroBanner() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="container-xl py-4">
        {/* Main hero */}
        <div className="relative bg-[#002D62] rounded-xl overflow-hidden mb-4">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #FFC220 0, #FFC220 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10 md:py-14">
            <div className="max-w-xl">
              <span className="inline-block bg-[#FFC220] text-[#002D62] text-xs font-black px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                Professional Grade Materials
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
                Build Smarter,{" "}
                <span className="text-[#FFC220]">Build Better</span>
              </h1>
              <p className="text-[#93C5FD] text-base md:text-lg mb-6 leading-relaxed">
                Thousands of construction materials, tools and supplies. Contractor prices, nationwide shipping, same-day pickup in Miami.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent" size="lg" asChild>
                  <Link href="/catalog" className="flex items-center gap-2">
                    Shop All Products
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link href="/pro-account">Pro Account</Link>
                </Button>
              </div>
            </div>
            {/* Stats card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white text-center grid grid-cols-2 gap-5 min-w-[240px]">
              {[
                { value: "10,000+", label: "Products" },
                { value: "50 States", label: "Shipping" },
                { value: "Same Day", label: "Pickup Miami" },
                { value: "5-Star", label: "Service" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-xl font-black text-[#FFC220]">{value}</div>
                  <div className="text-xs text-[#93C5FD] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo mini-banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {promoBanners.map((b) => (
            <div
              key={b.title}
              className={`${b.bg} rounded-lg px-6 py-5 flex items-center justify-between gap-4 group`}
            >
              <div>
                <span className={`text-xs font-bold ${b.accent} uppercase tracking-wide`}>
                  {b.badge}
                </span>
                <h2 className="text-white font-bold text-base mt-1 leading-tight">{b.title}</h2>
                <p className="text-[#93C5FD] text-xs mt-1">{b.subtitle}</p>
              </div>
              <Link
                href={b.href}
                className={`shrink-0 ${b.accent} font-bold text-sm hover:opacity-80 flex items-center gap-1 transition-opacity`}
              >
                {b.cta}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* Trust signals bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Truck,
              title: "Free Shipping Over $500",
              sub: "To all 50 states",
            },
            {
              icon: BadgePercent,
              title: "Pro Account Discounts",
              sub: "Up to 30% off list price",
            },
            {
              icon: ShieldCheck,
              title: "Secure Checkout",
              sub: "Stripe encrypted payments",
            },
            {
              icon: Truck,
              title: "Same-Day Pickup",
              sub: "Miami location in stock",
            },
          ].map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="bg-[#F2F2F2] rounded-lg px-4 py-3 flex items-center gap-3 border border-[#E5E7EB]"
            >
              <Icon size={22} className="text-[#0071CE] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#1A1A1A]">{title}</div>
                <div className="text-[11px] text-[#6B7280]">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
