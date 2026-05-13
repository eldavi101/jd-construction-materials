"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, loading, isAuthenticated } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);

    try {
      await registerUser({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        password,
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-xl py-10 sm:py-14">
      <div className="max-w-lg mx-auto bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-black text-[#002D62]">Create Account</h1>
        <p className="mt-2 text-sm text-[#4B5563]">
          Register to place orders and manage your account.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold mb-1.5">
                First name
              </label>
              <Input
                id="firstName"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold mb-1.5">
                Last name
              </label>
              <Input
                id="lastName"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </div>

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
            <label htmlFor="phone" className="block text-sm font-semibold mb-1.5">
              Phone (optional)
            </label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1.5">
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-5 text-sm text-[#4B5563]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#0071CE] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
