"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do you ship construction materials to all 50 states?",
    a: "Yes. J&D Construction Materials ships to all 50 US states. Orders over $500 qualify for free standard shipping. We also offer expedited and LTL freight options for bulk orders of heavy materials such as cement, rebar, and CMU blocks.",
  },
  {
    q: "What is the minimum order for bulk contractor pricing?",
    a: "Bulk contractor pricing starts at $1,000 per order. Pro Account members receive automatic discounts of 10–30% depending on product category. You can apply for a Pro Account at no cost — approval typically takes 24–48 hours.",
  },
  {
    q: "Can I pick up my order in Miami the same day?",
    a: "Yes. We offer same-day pickup at our Miami, FL warehouse for orders placed before 2 PM Eastern time. You will receive a confirmation email with pickup instructions and the warehouse address.",
  },
  {
    q: "What brands of tools and building materials do you carry?",
    a: "We stock products from leading brands including Milwaukee, DeWalt, Makita, RIDGID, Bosch (tools), QUIKRETE, USG, James Hardie (building materials), Oatey, Charlotte Pipe (plumbing), and many more. We are continuously adding new brands based on contractor demand.",
  },
  {
    q: "What is your return policy for construction materials?",
    a: "Most unused, unopened materials can be returned within 30 days of purchase. Customized or cut-to-length materials are non-returnable. Defective products are covered by the manufacturer warranty and we will handle the replacement or refund process for you.",
  },
  {
    q: "Do you offer delivery for heavy materials like cement and rebar?",
    a: "Yes. Heavy bulk materials such as cement bags, CMU blocks, rebar, gravel, and sand ship via LTL freight with curbside or job-site delivery options. We work with specialized carriers experienced in construction site logistics.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-10 bg-[#F2F2F2]">
      <div className="container-xl max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-[#1A1A1A]">Frequently Asked Questions</h2>
          <p className="text-sm text-[#6B7280] mt-2">
            Everything you need to know about ordering construction materials online.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-bold text-[#1A1A1A] hover:bg-[#F9FAFB] transition-colors gap-3"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "shrink-0 text-[#0071CE] transition-transform duration-200",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-[#374151] leading-relaxed border-t border-[#F2F2F2]">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
