import SessionProvider from "@/app/components/admin/SessionProvider";
import Sidebar from "@/app/components/admin/Sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-black text-white">
        <Sidebar />
        <main className="md:pl-64 min-h-screen pt-14 md:pt-0">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
