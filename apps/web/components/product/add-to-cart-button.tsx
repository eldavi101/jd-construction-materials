"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";

type Props = {
  slug: string;
  name: string;
  sku: string;
  price: number;
  inStock: boolean;
};

export function AddToCartButton({ slug, name, sku, price, inStock }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      disabled={!inStock}
      onClick={() => {
        addItem({ slug, name, sku, price, currency: "USD" }, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className="mt-5 w-full bg-[#0071CE] hover:bg-[#002D62] disabled:bg-[#9CA3AF] text-white font-semibold h-11 rounded transition-colors"
    >
      {!inStock ? "Out of stock" : added ? "Added" : "Add to Cart"}
    </button>
  );
}
