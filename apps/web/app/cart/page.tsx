"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="container-xl py-12">
        <div className="max-w-2xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h1 className="text-3xl font-black text-[#1A1A1A]">Your cart is empty</h1>
          <p className="mt-3 text-[#6B7280]">
            Add materials from the catalog to begin checkout.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/">Browse Products</Link>
          </Button>
        </div>
      </section>
    );
  }

  const shipping = subtotal >= 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <section className="container-xl py-10">
      <h1 className="text-3xl font-black text-[#1A1A1A]">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <article key={item.slug} className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#6B7280]">{item.sku}</p>
                  <h2 className="text-lg font-bold text-[#1A1A1A]">{item.name}</h2>
                  <p className="text-sm text-[#6B7280]">${item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    className="h-9 w-9 rounded border border-[#D1D5DB] font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    className="h-9 w-9 rounded border border-[#D1D5DB] font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="ml-3 text-sm text-[#B91C1C] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-[#B91C1C] hover:underline"
          >
            Clear cart
          </button>
        </div>

        <aside className="bg-white border border-[#E5E7EB] rounded-xl p-5 h-fit">
          <h2 className="text-xl font-black text-[#1A1A1A]">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-[#E5E7EB] pt-2 font-black text-base">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button asChild size="lg" className="w-full mt-5">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </aside>
      </div>
    </section>
  );
}
