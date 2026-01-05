"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Pass 'redirect: false' to handle errors manually if needed
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/admin",
    });

    if (result?.ok) {
      router.push("/admin");
    } else {
      alert("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
