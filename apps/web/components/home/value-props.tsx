import Link from "next/link";
import { ArrowRight, Truck, Clock, Headphones, ShieldCheck, BadgePercent, Star } from "lucide-react";

const valueProps = [
  {
    icon: Truck,
    title: "Free Shipping on Orders $500+",
    description: "Fast delivery to all 50 states. Most orders ship within 1-2 business days.",
    color: "text-[#0071CE]",
    bg: "bg-[#E5F1FB]",
  },
  {
    icon: Clock,
    title: "Same-Day Pickup in Miami",
    description: "Order before 2 PM and pick up at our Miami warehouse the same day.",
    color: "text-[#16A34A]",
    bg: "bg-[#DCFCE7]",
  },
  {
    icon: Headphones,
    title: "Expert Project Support",
    description: "Our construction specialists are available 7 days a week to help you plan your project.",
    color: "text-[#9333EA]",
    bg: "bg-[#F3E8FF]",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Safe Checkout",
    description: "All payments encrypted by Stripe. Your data is always protected.",
    color: "text-[#DC2626]",
    bg: "bg-[#FEE2E2]",
  },
  {
    icon: BadgePercent,
    title: "Pro Account Discounts",
    description: "Register as a contractor or builder and save up to 30% on every order.",
    color: "text-[#D97706]",
    bg: "bg-[#FEF3C7]",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    description: "All products are sourced from trusted manufacturers with full warranties.",
    color: "text-[#0891B2]",
    bg: "bg-[#CFFAFE]",
  },
];

export function ValueProps() {
  return (
    <section className="py-10 bg-white border-y border-[#E5E7EB]">
      <div className="container-xl">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-[#1A1A1A]">Why Choose J&D Construction Materials?</h2>
          <p className="text-[#6B7280] text-sm mt-2 max-w-xl mx-auto">
            We supply professional contractors, builders, and serious DIYers with top-quality materials at competitive prices.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {valueProps.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 rounded-xl border border-[#E5E7EB] hover:shadow-sm transition-shadow bg-white"
            >
              <div className={`${bg} rounded-xl p-3 shrink-0`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A] mb-1 leading-snug">{title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro account CTA */}
        <div className="mt-8 bg-[#002D62] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-xl font-black mb-2">
              Are you a Contractor or Builder?{" "}
              <span className="text-[#FFC220]">Join our Pro Program</span>
            </h3>
            <p className="text-[#93C5FD] text-sm max-w-lg">
              Get exclusive discounts up to 30%, dedicated account manager, net-30 terms, and priority order fulfillment.
            </p>
          </div>
          <Link
            href="/pro-account"
            className="flex items-center gap-2 bg-[#FFC220] text-[#002D62] font-black px-6 py-3 rounded-lg hover:bg-[#E6A800] transition-colors shrink-0 text-sm"
          >
            Apply for Pro Account
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
