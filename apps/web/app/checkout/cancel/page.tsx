import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <section className="container-xl py-14">
      <div className="max-w-2xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
        <h1 className="text-3xl font-black text-[#1A1A1A]">Checkout canceled</h1>
        <p className="mt-3 text-[#4B5563]">
          No payment was captured. Your cart is still available if you want to try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          <Button asChild size="lg">
            <Link href="/checkout">Return to Checkout</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/cart">Back to Cart</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
