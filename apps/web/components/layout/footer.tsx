import Link from "next/link";
import { Package, Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Structural Materials", href: "/category/structural" },
    { label: "Roofing", href: "/category/roofing" },
    { label: "Plumbing", href: "/category/plumbing" },
    { label: "Electrical", href: "/category/electrical" },
    { label: "Tools & Machinery", href: "/category/tools" },
    { label: "All Departments", href: "/catalog" },
  ],
  "Customer Service": [
    { label: "Track My Order", href: "/track-order" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  "For Professionals": [
    { label: "Pro Account", href: "/pro-account" },
    { label: "Bulk Orders", href: "/bulk" },
    { label: "Volume Discounts", href: "/volume" },
    { label: "Project Calculator", href: "/calculator" },
    { label: "Credit Application", href: "/credit" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Suppliers", href: "/suppliers" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white mt-auto">
      {/* Main footer */}
      <div className="container-xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-[#FFC220] rounded p-1.5">
                <Package size={20} className="text-[#002D62]" />
              </div>
              <div className="leading-tight">
                <span className="font-black text-base tracking-tight block">J&D</span>
                <span className="text-[10px] font-semibold text-[#FFC220] tracking-widest uppercase block -mt-0.5">
                  Construction Materials
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#9CA3AF] mb-5 leading-relaxed">
              Your trusted source for professional building materials. Serving contractors, builders and homeowners across the USA.
            </p>
            <div className="space-y-2 text-sm text-[#9CA3AF]">
              <a href="tel:+13055550100" className="flex items-center gap-2 hover:text-[#FFC220] transition-colors">
                <Phone size={14} />
                (305) 555-0100
              </a>
              <a href="mailto:info@jdconstructionmaterials.com" className="flex items-center gap-2 hover:text-[#FFC220] transition-colors">
                <Mail size={14} />
                info@jdconstructionmaterials.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>Miami, FL &mdash; Nationwide Delivery</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                  { label: "Facebook", href: "#", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                  { label: "Instagram", href: "#", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                  { label: "YouTube", href: "#", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg> },
                ].map(({ label, href, svg }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-[#374151] flex items-center justify-center hover:bg-[#0071CE] transition-colors"
                  >
                    {svg}
                  </a>
                ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-sm mb-4 text-white">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#9CA3AF] hover:text-[#FFC220] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#374151]">
        <div className="container-xl py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <p>&copy; {new Date().getFullYear()} J&D Construction Materials. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
          {/* Payment icons as text badges */}
          <div className="flex gap-2">
            {["VISA", "MC", "AMEX", "STRIPE"].map((p) => (
              <span key={p} className="border border-[#374151] rounded px-1.5 py-0.5 text-[10px] font-bold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
