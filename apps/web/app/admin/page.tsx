import Link from "next/link";

export default function AdminHomePage() {
  return (
    <section className="container-xl py-10">
      <h1 className="text-3xl font-black">Admin Panel</h1>
      <p className="mt-2 text-[#6B7280]">Manage core operations.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <Link
          href="/admin/orders"
          className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#0071CE] transition-colors"
        >
          <h2 className="text-xl font-black">Orders</h2>
          <p className="mt-2 text-sm text-[#6B7280]">Update fulfillment status.</p>
        </Link>
      </div>
    </section>
  );
}
