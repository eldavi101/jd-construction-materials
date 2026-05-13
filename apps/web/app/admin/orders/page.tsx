"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  fetchMyOrders,
  type CustomerOrder,
  updateAdminOrderStatus,
} from "@/lib/orders-client";

const statuses = ["PROCESSING", "SHIPPED", "DELIVERED"] as const;

export default function AdminOrdersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setError(null);

    try {
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders");
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === "ADMIN") {
      void loadOrders();
    }
  }, [loading, isAuthenticated, user?.role]);

  if (!loading && !isAuthenticated) {
    return (
      <section className="container-xl py-12">
        <div className="max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h1 className="text-3xl font-black">Admin sign-in required</h1>
          <Button asChild className="mt-6" size="lg">
            <Link href="/auth/login">Go to Sign In</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <section className="container-xl py-12">
        <div className="max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h1 className="text-3xl font-black">Access denied</h1>
          <p className="mt-2 text-[#6B7280]">This section is for admin users only.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-xl py-10">
      <h1 className="text-3xl font-black">Admin Orders</h1>
      <p className="mt-2 text-[#6B7280]">Review and move order fulfillment statuses.</p>

      {error && (
        <p className="mt-5 text-sm text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-[#6B7280]">{new Date(order.createdAt).toLocaleString()}</p>
                <h2 className="text-lg font-black">{order.orderNumber}</h2>
                <p className="text-sm text-[#6B7280]">Current: {order.status}</p>
              </div>
              <p className="text-xl font-black">${Number(order.totalAmount).toFixed(2)}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={busyOrderId === order.id || order.status === status}
                  onClick={async () => {
                    setBusyOrderId(order.id);
                    setError(null);

                    try {
                      await updateAdminOrderStatus(order.id, status);
                      await loadOrders();
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Unable to update status");
                    } finally {
                      setBusyOrderId(null);
                    }
                  }}
                  className="h-9 px-3 rounded border border-[#D1D5DB] text-sm font-semibold disabled:opacity-50"
                >
                  {busyOrderId === order.id ? "Updating..." : `Set ${status}`}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
