import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CartProvider } from "@/components/providers/cart-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jdconstructionmaterials.com"),
  title: {
    default: "J&D Construction Materials | Building Materials USA",
    template: "%s | J&D Construction Materials",
  },
  description:
    "Professional building materials and construction supplies. Cement, lumber, roofing, plumbing, electrical, tools and more. Serving Miami, Florida and the USA.",
  keywords: [
    "building materials",
    "construction supplies",
    "lumber",
    "cement",
    "roofing materials",
    "plumbing supplies",
    "electrical supplies",
    "Miami construction",
    "Florida building materials",
  ],
  authors: [{ name: "J&D Construction Materials" }],
  creator: "J&D Construction Materials",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jdconstructionmaterials.com",
    siteName: "J&D Construction Materials",
    title: "J&D Construction Materials | Building Materials USA",
    description:
      "Professional building materials and construction supplies. Serving Miami, Florida and nationwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "J&D Construction Materials",
    description: "Professional building materials and construction supplies.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-[#F2F2F2] text-[#1A1A1A] antialiased">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

