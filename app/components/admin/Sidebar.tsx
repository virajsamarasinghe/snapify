"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  FolderOpen, 
  ShoppingBag, 
  LogOut, 
  User,
  Settings
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Categories", icon: FolderOpen },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 z-50 flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/10">
      {/* Brand */}
      <div className="p-8 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          SNAPIFY
          <span className="text-xs ml-2 text-zinc-500 font-mono tracking-widest uppercase">Admin</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">
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
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
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
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
