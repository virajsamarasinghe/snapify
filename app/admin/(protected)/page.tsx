import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import ContactMessage from "@/models/ContactMessage";
import Product from "@/models/Product";
import {
    ArrowRight,
    FolderOpen,
    ImageIcon,
    Mail,
    MailOpen,
    MessageSquare,
    PlusCircle,
    ShoppingBag,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Ensure models are registered
import "@/models/Category";
import "@/models/Product";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await dbConnect();

  const [
    categoriesCount,
    productsCount,
    totalMessages,
    unreadMessages,
    recentMessages,
  ] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ read: false }),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Dashboard
        </h1>
        <p className="text-zinc-500 font-mono text-sm">Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Categories Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 hover:border-purple-500/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <FolderOpen size={16} /> Categories
              </h3>
              <p className="text-5xl font-bold text-white tracking-tight">
                {categoriesCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 hover:border-pink-500/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShoppingBag size={16} /> Products
              </h3>
              <p className="text-5xl font-bold text-white tracking-tight">
                {productsCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Total Messages Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 hover:border-blue-500/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <MessageSquare size={16} /> Total Messages
              </h3>
              <p className="text-5xl font-bold text-white tracking-tight">
                {totalMessages}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Mail size={24} />
            </div>
          </div>
        </div>

        {/* Unread Messages Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 hover:border-amber-500/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <MailOpen size={16} /> Unread
              </h3>
              <p className="text-5xl font-bold text-white tracking-tight">
                {unreadMessages}
              </p>
              {unreadMessages > 0 && (
                <Link
                  href="/admin/messages"
                  className="mt-2 inline-block text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  View unread →
                </Link>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${unreadMessages > 0 ? "bg-amber-500/20 text-amber-400" : "bg-zinc-800 text-zinc-600"}`}
            >
              <Mail size={24} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Mail size={16} className="text-blue-400" /> Recent Messages
            </h3>
            <Link
              href="/admin/messages"
              className="text-xs text-zinc-500 hover:text-purple-400 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="px-6 py-10 text-center text-zinc-600 text-sm">
              No messages yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {(recentMessages as any[]).map((msg) => (
                <Link
                  key={msg._id.toString()}
                  href="/admin/messages"
                  className="flex items-start gap-4 px-6 py-4 hover:bg-white/3 transition-colors group"
                >
                  <div
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${msg.read ? "bg-zinc-700" : "bg-blue-400"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className={`text-sm truncate ${msg.read ? "text-zinc-400" : "text-white font-semibold"}`}
                      >
                        {msg.name}
                      </span>
                      <span className="text-xs text-zinc-600 shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">
                      {msg.subject}
                    </p>
                  </div>
                  {!msg.read && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-medium">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="group relative rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/categories"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 border border-transparent hover:border-purple-500/30 transition-all duration-300 group/link"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <PlusCircle size={16} /> Add Category
              </span>
              <ArrowRight
                size={16}
                className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all"
              />
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-pink-600/20 hover:text-pink-300 border border-transparent hover:border-pink-500/30 transition-all duration-300 group/link"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <PlusCircle size={16} /> Add Product
              </span>
              <ArrowRight
                size={16}
                className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all"
              />
            </Link>
            <Link
              href="/admin/hero"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 border border-transparent hover:border-blue-500/30 transition-all duration-300 group/link"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon size={16} /> Manage Hero
              </span>
              <ArrowRight
                size={16}
                className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all"
              />
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-amber-600/20 hover:text-amber-300 border border-transparent hover:border-amber-500/30 transition-all duration-300 group/link"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Mail size={16} /> View Messages
              </span>
              {unreadMessages > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                  {unreadMessages} new
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
