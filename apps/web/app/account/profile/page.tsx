"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export default function AccountProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (!loading && !isAuthenticated) {
    return (
      <section className="container-xl py-12">
        <div className="max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h1 className="text-3xl font-black text-[#1A1A1A]">Sign in required</h1>
          <p className="mt-3 text-[#6B7280]">You need an account to view your profile.</p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/auth/login">Go to Sign In</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-xl py-10">
      <h1 className="text-3xl font-black text-[#1A1A1A]">My Profile</h1>
      <p className="mt-2 text-[#6B7280]">Basic account information for your purchases.</p>

      <div className="mt-6 max-w-xl bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-3">
        <p><span className="text-[#6B7280]">Name:</span> <span className="font-semibold">{user ? `${user.firstName} ${user.lastName}` : "-"}</span></p>
        <p><span className="text-[#6B7280]">Email:</span> <span className="font-semibold">{user?.email ?? "-"}</span></p>
        <p><span className="text-[#6B7280]">Phone:</span> <span className="font-semibold">{user?.phone ?? "-"}</span></p>
        <p><span className="text-[#6B7280]">Role:</span> <span className="font-semibold">{user?.role ?? "-"}</span></p>
      </div>
    </section>
  );
}
