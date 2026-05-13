"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { fetchMyOrders, type CustomerOrder } from "@/lib/orders-client";

export default function AccountOrdersPage() {
  const { isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !isAuthenticated) {
      return;
    }

    const run = async () => {
      setFetching(true);
      setError(null);

      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load orders");
      } finally {
        setFetching(false);
      }
    };

    void run();
  }, [loading, isAuthenticated]);

  if (!loading && !isAuthenticated) {
    return (
      <section className="container-xl py-12">
        <div className="max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h1 className="text-3xl font-black text-[#1A1A1A]">Sign in required</h1>
          <p className="mt-3 text-[#6B7280]">You need an account to view your order history.</p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/auth/login">Go to Sign In</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-xl py-10">
      <h1 className="text-3xl font-black text-[#1A1A1A]">My Orders</h1>
      <p className="mt-2 text-[#6B7280]">Track your purchases and payment status.</p>

      {fetching && <p className="mt-6">Loading orders...</p>}

      {error && (
        <p className="mt-6 text-sm text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded px-3 py-2 max-w-xl">
          {error}
        </p>
      )}

      {!fetching && !error && orders.length === 0 && (
        <div className="mt-6 bg-white border border-[#E5E7EB] rounded-xl p-8">
          <p className="text-[#6B7280]">You do not have orders yet.</p>
          <Button asChild className="mt-4">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs text-[#6B7280]">{new Date(order.createdAt).toLocaleString()}</p>
                <h2 className="text-lg font-black">{order.orderNumber}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">Status: {order.status}</p>
                <p className="text-xl font-black">${Number(order.totalAmount).toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-[#F3F4F6] pt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold">{item.product?.name ?? "Product"}</span>
                    <span className="text-[#6B7280]"> x{item.quantity}</span>
                  </div>
                  <span>${Number(item.totalAmount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
