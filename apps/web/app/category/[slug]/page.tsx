import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BASE_URL, categorySeeds, getCategoryBySlug, productSeeds } from "@/lib/catalog";
import { Card, CardBody } from "@/components/ui/card";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categorySeeds.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${category.name} | J&D Construction Materials`;
  const description = `${category.shortDescription} Contractor pricing, nationwide shipping and professional support.`;
  const canonical = `${BASE_URL}/category/${category.slug}`;

  return {
    title,
    description,
    keywords: category.keywords,
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = productSeeds.filter((product) => product.categorySlug === category.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} - J&D Construction Materials`,
    description: category.shortDescription,
    url: `${BASE_URL}/category/${category.slug}`,
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
          name: category.name,
          item: `${BASE_URL}/category/${category.slug}`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${BASE_URL}/product/${product.slug}`,
        name: product.name,
      })),
    },
  };

  return (
    <section className="py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-xl">
        <div className="mb-6">
          <p className="text-sm text-[#6B7280]">
            <Link href="/" className="text-[#0071CE] hover:underline">
              Home
            </Link>{" "}
            / {category.name}
          </p>
          <h1 className="text-3xl font-black text-[#1A1A1A] mt-2">{category.name}</h1>
          <p className="text-[#6B7280] mt-2 max-w-3xl">{category.shortDescription}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.slug} className="card-hover">
              <CardBody>
                <p className="text-xs text-[#6B7280]">SKU: {product.sku}</p>
                <h2 className="text-lg font-bold text-[#1A1A1A] mt-1">{product.name}</h2>
                <p className="text-sm text-[#6B7280] mt-2">{product.description}</p>
                <p className="text-xl font-black text-[#1A1A1A] mt-4">${product.price.toFixed(2)}</p>
                <Link
                  href={`/product/${product.slug}`}
                  className="inline-flex mt-4 text-sm font-semibold text-[#0071CE] hover:text-[#002D62]"
                >
                  View product details
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
