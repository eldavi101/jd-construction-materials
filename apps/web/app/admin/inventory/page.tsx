"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  fetchProducts,
  adjustInventory,
  type Product,
} from "@/lib/products-client";

type AdjustmentForm = {
  productId: string;
  quantityAdjustment: number | string;
  warehouseCode: string;
};

export default function AdminInventoryPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdjustmentForm>({
    productId: "",
    quantityAdjustment: "",
    warehouseCode: "",
  });

  const loadProducts = async () => {
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products");
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === "ADMIN") {
      void loadProducts();
    }
  }, [loading, isAuthenticated, user?.role]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy("submit");

    try {
      if (!formData.productId || formData.quantityAdjustment === "") {
        setError("Please select a product and enter a quantity");
        setBusy(null);
        return;
      }

      const adjustment = parseInt(formData.quantityAdjustment.toString(), 10);
      if (isNaN(adjustment)) {
        setError("Invalid quantity");
        setBusy(null);
        return;
      }

      await adjustInventory(
        formData.productId,
        adjustment,
        formData.warehouseCode || undefined
      );

      setSuccess(
        `Inventory adjusted by ${adjustment > 0 ? "+" : ""}${adjustment}`
      );
      setFormData({
        productId: "",
        quantityAdjustment: "",
        warehouseCode: "",
      });

      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to adjust inventory");
    } finally {
      setBusy(null);
    }
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Adjustment Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sticky top-4">
            <h2 className="text-2xl font-black">Adjust Stock</h2>

            {error && (
              <p className="mt-4 text-sm text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="mt-4 text-sm text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] rounded px-3 py-2">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Product *
                </label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm"
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Current:{" "}
                      {product.inventoryItem
                        ? product.inventoryItem.quantityOnHand
                        : "N/A"}
                      )
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Quantity Adjustment *
                </label>
                <input
                  type="number"
                  required
                  value={formData.quantityAdjustment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantityAdjustment: e.target.value,
                    })
                  }
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm"
                  placeholder="e.g., +10 or -5"
                />
                <p className="mt-1 text-xs text-[#6B7280]">
                  Use positive numbers to add stock, negative to remove
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Warehouse Code
                </label>
                <input
                  type="text"
                  value={formData.warehouseCode}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouseCode: e.target.value })
                  }
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm"
                  placeholder="Optional warehouse code..."
                />
              </div>

              <button
                type="submit"
                disabled={busy === "submit"}
                className="w-full bg-[#1F2937] text-white font-semibold rounded px-4 py-2 disabled:opacity-50"
              >
                {busy === "submit" ? "Adjusting..." : "Adjust Inventory"}
              </button>
            </form>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black mb-4">Current Stock Levels</h2>

          {products.length === 0 ? (
            <p className="text-[#6B7280]">No products available.</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const inventory = product.inventoryItem;
                const available = inventory
                  ? inventory.quantityOnHand - inventory.quantityReserved
                  : 0;

                return (
                  <article
                    key={product.id}
                    className="bg-white border border-[#E5E7EB] rounded-xl p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black">{product.name}</h3>
                        <p className="text-sm text-[#6B7280]">SKU: {product.sku}</p>
                        {product.brand && (
                          <p className="text-sm text-[#6B7280]">
                            Brand: {product.brand}
                          </p>
                        )}
                      </div>

                      <div className="bg-[#F3F4F6] rounded px-4 py-3 min-w-fit">
                        <div className="text-xs text-[#6B7280] mb-1">
                          On Hand
                        </div>
                        <div className="text-2xl font-black">
                          {inventory ? inventory.quantityOnHand : "0"}
                        </div>

                        <div className="mt-2 text-xs text-[#6B7280] grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[#6B7280]">Reserved:</span>{" "}
                            {inventory ? inventory.quantityReserved : "0"}
                          </div>
                          <div>
                            <span className="text-[#6B7280]">Available:</span>{" "}
                            {available}
                          </div>
                          <div className="col-span-2">
                            <span className="text-[#6B7280]">Reorder:</span>{" "}
                            {inventory ? inventory.reorderLevel : "0"}
                          </div>
                        </div>

                        {available < (inventory?.reorderLevel || 0) && (
                          <div className="mt-2 text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] rounded px-2 py-1">
                            Low Stock
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
