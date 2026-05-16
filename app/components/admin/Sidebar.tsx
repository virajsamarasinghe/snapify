"use client";

import {
    ChevronDown,
    FolderOpen,
    Globe,
    Image,
    LayoutDashboard,
    Lock,
    LogOut,
    Mail,
    Menu,
    Settings,
    ShoppingBag,
    Trophy,
    User,
    X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  // Auto-expand settings sub-menu when on settings page
  useEffect(() => {
    if (pathname === "/admin/settings") setSettingsOpen(true);
  }, [pathname]);

  // Auto-expand products sub-menu when on products page
  useEffect(() => {
    if (pathname === "/admin/products") setProductsOpen(true);
  }, [pathname]);

  useEffect(() => {
    // Close sidebar on route change (mobile)
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function fetchUnread() {
      fetch("/api/contact")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUnreadCount(data.filter((m: any) => !m.read).length);
          }
        })
        .catch(() => {});
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 60_000);
    return () => clearInterval(interval);
  }, [pathname]);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/hero", label: "Hero Section", icon: Image },
    { href: "/admin/about", label: "About", icon: User },
    { href: "/admin/recognition", label: "Recognition", icon: Trophy },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: Mail,
      badge: unreadCount,
    },
  ];

  const productsSubLinks = [
    {
      href: "/admin/products?type=gallery",
      type: "gallery",
      label: "Gallery",
      icon: Image,
    },
    {
      href: "/admin/products?type=marketplace",
      type: "marketplace",
      label: "Marketplace",
      icon: ShoppingBag,
    },
  ];

  const settingsSubLinks = [
    {
      href: "/admin/settings?tab=account",
      tab: "account",
      label: "Account",
      icon: Lock,
    },
    {
      href: "/admin/settings?tab=features",
      tab: "features",
      label: "Site Features",
      icon: ShoppingBag,
    },
    {
      href: "/admin/settings?tab=contact",
      tab: "contact",
      label: "Contact & Social",
      icon: Globe,
    },
  ];

  const sidebarContent = (
    <aside
      className={`fixed top-0 left-0 bottom-0 w-64 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Brand */}
      <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
          SNAPIFY
          <span className="text-xs ml-2 text-zinc-500 font-mono tracking-widest uppercase">
            Admin
          </span>
        </h1>
        {/* Close button — mobile only */}
        <button
          className="md:hidden p-1 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={`transition-colors ${isActive ? "text-white" : "text-zinc-500 group-hover:text-purple-400"}`}
              />
              <span className="font-medium tracking-wide">{link.label}</span>
              {isActive && !("badge" in link && (link as any).badge > 0) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
              {"badge" in link && (link as any).badge > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs font-bold leading-none">
                  {(link as any).badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Categories */}
        <Link
          href="/admin/categories"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
            pathname === "/admin/categories"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <FolderOpen
            size={20}
            className={`transition-colors ${pathname === "/admin/categories" ? "text-white" : "text-zinc-500 group-hover:text-purple-400"}`}
          />
          <span className="font-medium tracking-wide">Categories</span>
          {pathname === "/admin/categories" && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          )}
        </Link>

        {/* Products with sub-menu */}
        <div>
          <button
            onClick={() => setProductsOpen((v) => !v)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              pathname === "/admin/products"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ShoppingBag
              size={20}
              className={`transition-colors ${pathname === "/admin/products" ? "text-white" : "text-zinc-500 group-hover:text-purple-400"}`}
            />
            <span className="font-medium tracking-wide">Products</span>
            <ChevronDown
              size={15}
              className={`ml-auto transition-transform duration-300 ${productsOpen ? "rotate-180" : ""} ${pathname === "/admin/products" ? "text-white/70" : "text-zinc-600 group-hover:text-zinc-400"}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              productsOpen ? "max-h-32 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 pl-4 border-l border-white/10 space-y-1">
              {productsSubLinks.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive =
                  pathname === "/admin/products" &&
                  (searchParams.get("type") ?? "gallery") === sub.type;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isSubActive
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/20"
                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <SubIcon
                      size={15}
                      className={`transition-colors ${isSubActive ? "text-purple-400" : "text-zinc-600 group-hover:text-purple-400"}`}
                    />
                    <span className="text-sm font-medium tracking-wide">
                      {sub.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings with sub-menu */}
        <div>
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              pathname === "/admin/settings"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings
              size={20}
              className={`transition-colors ${pathname === "/admin/settings" ? "text-white" : "text-zinc-500 group-hover:text-purple-400"}`}
            />
            <span className="font-medium tracking-wide">Settings</span>
            <ChevronDown
              size={15}
              className={`ml-auto transition-transform duration-300 ${settingsOpen ? "rotate-180" : ""} ${pathname === "/admin/settings" ? "text-white/70" : "text-zinc-600 group-hover:text-zinc-400"}`}
            />
          </button>

          {/* Sub-menu */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              settingsOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 pl-4 border-l border-white/10 space-y-1">
              {settingsSubLinks.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive =
                  pathname === "/admin/settings" &&
                  (searchParams.get("tab") ?? "account") === sub.tab;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isSubActive
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/20"
                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <SubIcon
                      size={15}
                      className={`transition-colors ${isSubActive ? "text-purple-400" : "text-zinc-600 group-hover:text-purple-400"}`}
                    />
                    <span className="text-sm font-medium tracking-wide">
                      {sub.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0">
            {session?.user?.email?.[0].toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.email}
            </p>
            <p className="text-xs text-zinc-500 capitalize">
              {session?.user?.role || "Administrator"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group"
        >
          <LogOut
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
          SNAPIFY <span className="text-zinc-500 text-xs font-mono">Admin</span>
        </h1>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold">
            {unreadCount}
          </span>
        )}
        {unreadCount === 0 && <div className="w-8" />}
      </header>

      {/* Overlay backdrop — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {sidebarContent}
    </>
  );
};

export default Sidebar;
