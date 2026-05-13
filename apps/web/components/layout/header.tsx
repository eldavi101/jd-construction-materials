"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  Phone,
  ChevronDown,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";

const categories = [
  { label: "Structural Materials", href: "/category/structural" },
  { label: "Framing & Lumber", href: "/category/framing-lumber" },
  { label: "Roofing", href: "/category/roofing" },
  { label: "Drywall & Interior", href: "/category/drywall" },
  { label: "Plumbing", href: "/category/plumbing" },
  { label: "Electrical", href: "/category/electrical" },
  { label: "Tools & Machinery", href: "/category/tools" },
  { label: "Paint & Finishes", href: "/category/paint" },
  { label: "Flooring & Tile", href: "/category/flooring" },
  { label: "Hardware & Fasteners", href: "/category/hardware" },
  { label: "Insulation", href: "/category/insulation" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { itemCount, subtotal } = useCart();

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "Account";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-[#002D62] text-white text-xs">
        <div className="container-xl flex items-center justify-between h-9 gap-4">
          <div className="flex items-center gap-4">
            <a
              href="tel:+13055550100"
              className="flex items-center gap-1.5 hover:text-[#FFC220] transition-colors"
            >
              <Phone size={12} />
              <span>(305) 555-0100</span>
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-[#93C5FD]">
              <MapPin size={12} />
              <span>Miami, FL &mdash; Nationwide Shipping</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="hover:text-[#FFC220] transition-colors hidden sm:block">
              Track Order
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/account/orders" className="hover:text-[#FFC220] transition-colors hidden sm:block">
                  My Orders
                </Link>
                <Link href="/account/profile" className="hover:text-[#FFC220] transition-colors hidden sm:block">
                  My Profile
                </Link>
                  {user?.role === "ADMIN" && (
                    <div className="relative group">
                      <button className="hover:text-[#FFC220] transition-colors hidden sm:block">
                        Admin ▼
                      </button>
                      <div className="absolute right-0 mt-0 w-48 bg-white text-[#1A1A1A] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <Link href="/admin/orders" className="block px-4 py-2 text-sm hover:bg-[#E5F1FB]">
                          Orders
                        </Link>
                        <Link href="/admin/products" className="block px-4 py-2 text-sm hover:bg-[#E5F1FB]">
                          Products
                        </Link>
                        <Link href="/admin/inventory" className="block px-4 py-2 text-sm hover:bg-[#E5F1FB]">
                          Inventory
                        </Link>
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <Link href="/pro-account" className="hover:text-[#FFC220] transition-colors hidden sm:block">
                Pro Account
              </Link>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  void logoutUser();
                }}
                className="hover:text-[#FFC220] transition-colors flex items-center gap-1"
              >
                <User size={12} />
                Sign Out
              </button>
            ) : (
              <Link href="/auth/login" className="hover:text-[#FFC220] transition-colors flex items-center gap-1">
                <User size={12} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-[#0071CE] text-white shadow-md">
        <div className="container-xl">
          <div className="flex items-center gap-3 h-14">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded hover:bg-[#002D62] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
              <div className="bg-[#FFC220] rounded p-1.5">
                <Package size={20} className="text-[#002D62]" />
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="font-black text-base tracking-tight block">J&D</span>
                <span className="text-[10px] font-semibold text-[#FFC220] tracking-widest uppercase block -mt-0.5">
                  Construction Materials
                </span>
              </div>
            </Link>

            {/* Search bar */}
            <form
              className="flex-1 max-w-2xl"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
            >
              <div className="relative flex">
                <Input
                  type="search"
                  placeholder="Search materials, tools, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search size={16} />}
                  className="rounded-r-none border-0 h-11 text-[#1A1A1A] text-sm pr-3 focus:ring-2 focus:ring-[#FFC220]"
                />
                <button
                  type="submit"
                  className="bg-[#FFC220] hover:bg-[#E6A800] text-[#002D62] font-bold px-5 h-11 rounded-r border-0 transition-colors text-sm whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 hover:bg-[#002D62] rounded px-3 h-11 transition-colors shrink-0"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-[#FFC220] text-[#002D62] text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-[10px] text-[#93C5FD]">
                  {isAuthenticated ? displayName : "My Cart"}
                </div>
                <div className="text-sm font-bold leading-tight">${subtotal.toFixed(2)}</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="bg-[#002D62] border-b border-[#0071CE]/30 hidden lg:block">
        <div className="container-xl">
          <nav className="flex items-center gap-0 h-10 overflow-x-auto scrollbar-none">
            <Link
              href="/catalog"
              className="flex items-center gap-1.5 px-3 h-full text-xs font-bold text-[#FFC220] hover:bg-[#0071CE]/40 transition-colors whitespace-nowrap border-r border-[#0071CE]/30"
            >
              <Menu size={14} />
              All Departments
              <ChevronDown size={12} />
            </Link>
            {categories.slice(0, 9).map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-3 h-full flex items-center text-xs text-white/90 hover:bg-[#0071CE]/40 hover:text-white transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/deals"
              className="ml-auto px-3 h-full flex items-center text-xs font-bold text-[#FFC220] hover:bg-[#0071CE]/40 transition-colors whitespace-nowrap"
            >
              Deals & Clearance
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] shadow-xl">
          <div className="p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMobileOpen(false);
              }}
              className="mb-4"
            >
              <Input
                type="search"
                placeholder="Search products..."
                leftIcon={<Search size={16} />}
                className="h-11"
              />
            </form>
            <nav className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#E5F1FB] hover:text-[#0071CE] rounded transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex gap-2">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    void logoutUser();
                    setMobileOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <Button variant="outline" size="md" className="flex-1" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              )}
              <Button variant="primary" size="md" className="flex-1" asChild>
                <Link href="/cart">Cart ({itemCount})</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
