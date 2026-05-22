import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

const LOGO_SRC = "/logo.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("speshway_admin_token");
    if (token) navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("speshway_admin_token", data.token);
      localStorage.setItem("speshway_admin_user", JSON.stringify(data.admin));
      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(222,47%,9%)] via-[hsl(258,58%,22%)] to-[hsl(222,47%,11%)] p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/25 blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-8 sm:p-10">
        {/* Logo & brand — centered */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="rounded-2xl bg-white p-3 shadow-md mb-5 border border-[hsl(220,18%,92%)]">
            <img
              src={LOGO_SRC}
              alt="BUILD YOUR THOUGHTS"
              width={180}
              height={140}
              className="w-36 sm:w-40 h-auto object-contain mx-auto"
            />
          </div>
          <h1 className="font-heading font-black text-lg sm:text-xl uppercase tracking-wide text-[hsl(222,47%,12%)] leading-tight">
            BUILD YOUR THOUGHTS
          </h1>
          <p className="text-xs text-[hsl(258,56%,48%)] font-bold uppercase tracking-[0.2em] mt-1.5">
            Admin Panel
          </p>
        </div>

        <div className="text-center mb-7">
          <h2 className="text-xl font-heading font-bold text-[hsl(222,47%,12%)]">Welcome back</h2>
          <p className="text-sm text-[hsl(222,18%,45%)] mt-1">Sign in to your admin dashboard</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold text-[hsl(222,18%,40%)] uppercase tracking-wider mb-2"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(222,18%,55%)] pointer-events-none"
              />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourcompany.com"
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-[hsl(220,18%,85%)] bg-[hsl(220,30%,98%)] text-[hsl(222,47%,12%)] text-sm placeholder:text-[hsl(222,18%,60%)] focus:outline-none focus:border-[hsl(258,56%,48%)] focus:ring-2 focus:ring-[hsl(258,56%,48%/0.15)] transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-[hsl(222,18%,40%)] uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(222,18%,55%)] pointer-events-none"
              />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full pl-11 pr-11 py-3 rounded-lg border border-[hsl(220,18%,85%)] bg-[hsl(220,30%,98%)] text-[hsl(222,47%,12%)] text-sm placeholder:text-[hsl(222,18%,60%)] focus:outline-none focus:border-[hsl(258,56%,48%)] focus:ring-2 focus:ring-[hsl(258,56%,48%/0.15)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[hsl(222,18%,55%)] hover:text-[hsl(258,56%,48%)] transition-colors rounded"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-1 rounded-lg bg-[hsl(258,56%,48%)] text-white font-bold text-sm uppercase tracking-wider hover:bg-[hsl(258,56%,42%)] focus:outline-none focus:ring-2 focus:ring-[hsl(258,56%,48%/0.4)] focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[10px] text-[hsl(222,18%,50%)] mt-6 tracking-wide">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
