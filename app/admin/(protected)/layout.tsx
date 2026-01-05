import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/admin/Sidebar";
import SessionProvider from "@/app/components/admin/SessionProvider";
import { authOptions } from "@/lib/auth";

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
        <main className="pl-64 min-h-screen">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
