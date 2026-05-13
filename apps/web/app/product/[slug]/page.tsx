import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { BASE_URL, getCategoryBySlug, getProductBySlug, productSeeds } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return productSeeds.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const category = getCategoryBySlug(product.categorySlug);
  const title = `${product.name} | J&D Construction Materials`;
  const description = `${product.description} Available at contractor pricing with nationwide US shipping.`;
  const canonical = `${BASE_URL}/product/${product.slug}`;

  return {
    title,
    description,
    keywords: [product.name, product.sku, category?.name ?? "construction materials"],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "J&D Construction Materials",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.categorySlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: category?.name,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "J&D Construction Materials",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${BASE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category?.name ?? "Category",
          item: category ? `${BASE_URL}/category/${category.slug}` : `${BASE_URL}/catalog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.name,
          item: `${BASE_URL}/product/${product.slug}`,
        },
      ],
    },
  };

  return (
    <section className="py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-xl max-w-5xl">
        <p className="text-sm text-[#6B7280] mb-3">
          <Link href="/" className="text-[#0071CE] hover:underline">
            Home
          </Link>{" "}
          /{" "}
          {category ? (
            <Link href={`/category/${category.slug}`} className="text-[#0071CE] hover:underline">
              {category.name}
            </Link>
          ) : (
            "Catalog"
          )}
          {" "}/ {product.name}
        </p>

        <article className="bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-8">
          <h1 className="text-3xl font-black text-[#1A1A1A]">{product.name}</h1>
          <p className="text-[#6B7280] mt-3">{product.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="md:col-span-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg min-h-[260px] flex items-center justify-center text-6xl">
              📦
            </div>
            <div className="border border-[#E5E7EB] rounded-lg p-4">
              <p className="text-sm text-[#6B7280]">SKU</p>
              <p className="font-semibold text-[#1A1A1A]">{product.sku}</p>

              <p className="text-sm text-[#6B7280] mt-4">Price</p>
              <p className="text-3xl font-black text-[#1A1A1A]">${product.price.toFixed(2)}</p>

              <p className="text-sm text-[#6B7280] mt-4">Availability</p>
              <p className="font-semibold text-[#16A34A]">
                {product.inStock ? "In stock" : "Out of stock"}
              </p>

              <AddToCartButton
                slug={product.slug}
                name={product.name}
                sku={product.sku}
                price={product.price}
                inStock={product.inStock}
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
