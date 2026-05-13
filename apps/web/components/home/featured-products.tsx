import Link from "next/link";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { formatPriceFromDollars } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  unit: string;
  category: string;
  categorySlug: string;
  badge?: string;
  badgeVariant?: "accent" | "success" | "primary" | "danger";
  rating: number;
  reviews: number;
  inStock: boolean;
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Portland Cement Type I/II (94 lb Bag)",
    slug: "portland-cement-94lb",
    price: 14.99,
    unit: "per bag",
    category: "Structural",
    categorySlug: "structural",
    badge: "Best Seller",
    badgeVariant: "accent",
    rating: 4.8,
    reviews: 312,
    inStock: true,
  },
  {
    id: "2",
    name: '#3 Rebar 20ft (3/8" Steel Reinforcing Bar)',
    slug: "rebar-3-20ft",
    price: 8.49,
    unit: "per bar",
    category: "Structural",
    categorySlug: "structural",
    rating: 4.7,
    reviews: 189,
    inStock: true,
  },
  {
    id: "3",
    name: "OSB 7/16\" Sheathing Panel 4x8 ft",
    slug: "osb-7-16-panel-4x8",
    price: 22.99,
    originalPrice: 28.5,
    unit: "per sheet",
    category: "Framing",
    categorySlug: "framing-lumber",
    badge: "On Sale",
    badgeVariant: "danger",
    rating: 4.6,
    reviews: 97,
    inStock: true,
  },
  {
    id: "4",
    name: "Architectural Shingles 3-Tab (Bundle)",
    slug: "architectural-shingles-3tab",
    price: 34.99,
    unit: "per bundle",
    category: "Roofing",
    categorySlug: "roofing",
    rating: 4.9,
    reviews: 221,
    inStock: true,
  },
  {
    id: "5",
    name: "1/2\" Drywall Panel 4x8 ft (Sheetrock)",
    slug: "drywall-half-inch-4x8",
    price: 12.49,
    unit: "per panel",
    category: "Drywall",
    categorySlug: "drywall",
    badge: "Most Popular",
    badgeVariant: "primary",
    rating: 4.8,
    reviews: 445,
    inStock: true,
  },
  {
    id: "6",
    name: "PVC Pipe Schedule 40 — 1/2\" x 10 ft",
    slug: "pvc-pipe-schedule40-half-10ft",
    price: 4.99,
    unit: "per piece",
    category: "Plumbing",
    categorySlug: "plumbing",
    rating: 4.7,
    reviews: 138,
    inStock: true,
  },
  {
    id: "7",
    name: "12/2 Romex Wire NM-B (250 ft Roll)",
    slug: "romex-12-2-250ft",
    price: 89.99,
    originalPrice: 109.99,
    unit: "per roll",
    category: "Electrical",
    categorySlug: "electrical",
    badge: "On Sale",
    badgeVariant: "danger",
    rating: 4.9,
    reviews: 203,
    inStock: true,
  },
  {
    id: "8",
    name: "Makita 18V LXT Cordless Drill Combo Kit",
    slug: "makita-18v-lxt-combo",
    price: 229.99,
    unit: "per kit",
    category: "Tools",
    categorySlug: "tools",
    badge: "New",
    badgeVariant: "success",
    rating: 4.9,
    reviews: 78,
    inStock: true,
  },
];

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= Math.floor(rating) ? "fill-[#FFC220] text-[#FFC220]" : "fill-[#E5E7EB] text-[#E5E7EB]"}
          />
        ))}
      </div>
      <span className="text-[11px] text-[#6B7280]">({reviews})</span>
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="py-8 bg-[#F2F2F2]">
      <div className="container-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-[#1A1A1A]">Best Sellers</h2>
            <p className="text-sm text-[#6B7280] mt-0.5">Top-rated materials trusted by contractors</p>
          </div>
          <Link
            href="/catalog?sort=bestsellers"
            className="flex items-center gap-1 text-sm text-[#0071CE] font-semibold hover:text-[#002D62] transition-colors"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="card-hover group">
              {/* Product image placeholder */}
              <div className="relative bg-[#F9FAFB] h-40 flex items-center justify-center border-b border-[#E5E7EB] overflow-hidden">
                <div className="text-5xl opacity-30">📦</div>
                {product.badge && (
                  <div className="absolute top-2 left-2">
                    <Badge variant={product.badgeVariant ?? "primary"} className="text-[10px]">
                      {product.badge}
                    </Badge>
                  </div>
                )}
              </div>

              <CardBody className="pb-2">
                <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wide mb-1">
                  {product.category}
                </p>
                <Link href={`/product/${product.slug}`} className="group-hover:text-[#0071CE] transition-colors">
                  <h3 className="text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>
                <StarRating rating={product.rating} reviews={product.reviews} />

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-black text-[#1A1A1A]">
                    {formatPriceFromDollars(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#9CA3AF] line-through">
                      {formatPriceFromDollars(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#6B7280]">{product.unit}</p>
              </CardBody>

              <CardFooter className="pt-3 pb-3">
                <Button variant="primary" size="sm" className="w-full gap-1.5">
                  <ShoppingCart size={14} />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
