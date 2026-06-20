import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = trpc.auth.login.useMutation({
    onSuccess: () => navigate("/admin"),
    onError: (e) => setError(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-cream text-center mb-2">SmokeHouse HK</h1>
        <p className="font-body text-sm text-smoke text-center mb-8">Admin Login</p>

        <div className="bg-charcoal-light border border-[rgba(196,148,58,0.15)] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-smoke block mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smokehousehk.com"
                className="input-dark"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-smoke block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-dark"
              />
            </div>

            {error && (
              <p className="font-body text-xs text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-3 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-[0.12em] hover:bg-burnt transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {login.isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
