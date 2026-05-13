import { HeroBanner } from "@/components/home/hero-banner";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ValueProps } from "@/components/home/value-props";
import { FaqSection } from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <CategoriesGrid />
      <FeaturedProducts />
      <ValueProps />
      <FaqSection />
    </main>
  );
}
