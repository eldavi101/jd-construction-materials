"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="container-xl py-14">
      <div className="max-w-2xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
        <h1 className="text-3xl font-black text-[#166534]">Payment successful</h1>
        <p className="mt-3 text-[#4B5563]">
          Your order has been created and payment was confirmed by Stripe.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          <Button asChild size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">View More Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
