"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, loading, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await loginUser({ email, password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-xl py-10 sm:py-14">
      <div className="max-w-md mx-auto bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-black text-[#002D62]">Sign In</h1>
        <p className="mt-2 text-sm text-[#4B5563]">
          Access your account to place orders and track purchases.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-5 text-sm text-[#4B5563]">
          No account yet?{" "}
          <Link href="/auth/register" className="text-[#0071CE] font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
