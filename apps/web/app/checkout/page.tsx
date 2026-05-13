"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/auth-client";
import { fetchApiProducts } from "@/lib/products-api";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const { items, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = useMemo(() => (subtotal >= 500 ? 0 : 25), [subtotal]);
  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const total = subtotal + shipping + tax;

  if (!loading && !isAuthenticated) {
    return (
      <section className="container-xl py-12">
        <div className="max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h1 className="text-3xl font-black text-[#1A1A1A]">Sign in required</h1>
          <p className="mt-3 text-[#6B7280]">
            Please sign in before completing checkout.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/auth/login">Go to Sign In</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-xl py-12">
        <div className="max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h1 className="text-3xl font-black text-[#1A1A1A]">No items to checkout</h1>
          <Button asChild className="mt-6" size="lg">
            <Link href="/cart">Back to Cart</Link>
          </Button>
        </div>
      </section>
    );
  }

  const startCheckout = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const apiProducts = await fetchApiProducts();
      const bySlug = new Map(apiProducts.map((product) => [product.slug, product]));

      const checkoutItems = items.map((item) => {
        const product = bySlug.get(item.slug);

        if (!product) {
          throw new Error(`Product not found in API: ${item.slug}`);
        }

        return {
          productId: product.id,
          quantity: item.quantity,
        };
      });

      const session = await createCheckoutSession({
        items: checkoutItems,
        shippingAmount: shipping,
        taxAmount: tax,
        currency: "USD",
      });

      if (!session.checkoutUrl) {
        throw new Error("Stripe checkout URL is missing.");
      }

      window.location.href = session.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-xl py-10">
      <h1 className="text-3xl font-black text-[#1A1A1A]">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h2 className="text-xl font-black">Order Items</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-[#6B7280]">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-white border border-[#E5E7EB] rounded-xl p-5 h-fit">
          <h2 className="text-xl font-black">Payment Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-[#E5E7EB] pt-2 font-black text-base">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded px-3 py-2">
              {error}
            </p>
          )}

          <Button onClick={() => void startCheckout()} size="lg" className="w-full mt-5" disabled={submitting}>
            {submitting ? "Redirecting..." : "Pay with Stripe"}
          </Button>

          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="mt-3 w-full text-sm text-[#6B7280] hover:underline"
          >
            Back to Cart
          </button>
        </aside>
      </div>
    </section>
  );
}
