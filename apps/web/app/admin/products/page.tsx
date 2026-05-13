"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  type Product,
} from "@/lib/products-client";
import { fetchCategories, type Category } from "@/lib/categories-client";

export default function AdminProductsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    brand: "",
    price: "",
    categoryId: "",
  });

  const loadData = async () => {
    setError(null);

    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data");
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === "ADMIN") {
      void loadData();
    }
  }, [loading, isAuthenticated, user?.role]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy("submit");

    try {
      if (!formData.name || !formData.sku || !formData.price || !formData.categoryId) {
        setError("Please fill in all required fields");
        setBusy(null);
        return;
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        setError("Invalid price");
        setBusy(null);
        return;
      }

      if (editingId) {
        await updateProduct(editingId, {
          name: formData.name,
          description: formData.description || undefined,
          sku: formData.sku,
          brand: formData.brand || undefined,
          price,
          categoryId: formData.categoryId,
        });
        setSuccess("Product updated successfully");
      } else {
        await createProduct({
          name: formData.name,
          description: formData.description || undefined,
          sku: formData.sku,
          brand: formData.brand || undefined,
          price,
          categoryId: formData.categoryId,
        });
        setSuccess("Product created successfully");
      }

      setFormData({
        name: "",
        description: "",
        sku: "",
        brand: "",
        price: "",
        categoryId: "",
      });
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product");
    } finally {
      setBusy(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      sku: product.sku,
      brand: product.brand || "",
      price: product.price,
      categoryId: product.categoryId,
    });
  };

  const handleToggleStatus = async (product: Product) => {
    setError(null);
    setBusy(product.id);

    try {
      await updateProductStatus(product.id, !product.active);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status");
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
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sticky top-4">
            <h2 className="text-2xl font-black">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

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
                <label className="block text-sm font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm"
                  placeholder="e.g., Steel Pipe 2inch"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm h-20"
                  placeholder="Optional description..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">SKU *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm"
                  placeholder="e.g., STL-PIPE-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm"
                  placeholder="Optional brand..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Price (USD) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Category *</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm"
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={busy === "submit"}
                  className="flex-1 bg-[#1F2937] text-white font-semibold rounded px-4 py-2 disabled:opacity-50"
                >
                  {busy === "submit"
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update"
                      : "Create"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        name: "",
                        description: "",
                        sku: "",
                        brand: "",
                        price: "",
                        categoryId: "",
                      });
                      setError(null);
                    }}
                    className="flex-1 border border-[#D1D5DB] font-semibold rounded px-4 py-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Products List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black mb-4">Products ({products.length})</h2>

          {products.length === 0 ? (
            <p className="text-[#6B7280]">No products yet.</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="bg-white border border-[#E5E7EB] rounded-xl p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black">{product.name}</h3>
                      <p className="text-sm text-[#6B7280]">SKU: {product.sku}</p>
                      <p className="text-sm text-[#6B7280]">
                        Stock:{" "}
                        {product.inventoryItem
                          ? product.inventoryItem.quantityOnHand
                          : "N/A"}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <button
                        type="button"
                        disabled={busy === product.id}
                        onClick={() => handleEdit(product)}
                        className="px-3 py-2 border border-[#D1D5DB] rounded text-sm font-semibold disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busy === product.id}
                        onClick={() => handleToggleStatus(product)}
                        className={`px-3 py-2 rounded text-sm font-semibold disabled:opacity-50 ${
                          product.active
                            ? "bg-[#065F46] text-white"
                            : "bg-[#7C2D12] text-white"
                        }`}
                      >
                        {busy === product.id
                          ? "Updating..."
                          : product.active
                            ? "Active"
                            : "Inactive"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
