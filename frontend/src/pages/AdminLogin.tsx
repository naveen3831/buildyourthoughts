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
    const token = localStorage.getItem("buildyourthoughts_admin_token");
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
      localStorage.setItem("buildyourthoughts_admin_token", data.token);
      localStorage.setItem("buildyourthoughts_admin_user", JSON.stringify(data.admin));
      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page min-h-screen flex items-center justify-center bg-[#1e1b2e] p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 rounded-full bg-purple-700/20 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 rounded-full bg-purple-500/15 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6" style={{ colorScheme: "light" }}>

        {/* Logo + brand */}
        <div className="flex flex-col items-center text-center mb-5">
          <img
            src={LOGO_SRC}
            alt="BUILD YOUR THOUGHTS"
            className="w-16 h-16 object-contain mb-3"
          />
          <h1 className="font-bold text-base uppercase tracking-wide text-gray-900 leading-tight">
            BUILD YOUR THOUGHTS
          </h1>
          <p className="text-[11px] text-purple-600 font-bold uppercase tracking-widest mt-1">
            Admin Panel
          </p>
        </div>

        <div className="text-center mb-5">
          <h2 className="text-lg font-bold text-gray-900">Welcome back</h2>
          <p className="text-xs text-gray-500 mt-0.5">Sign in to your admin dashboard</p>
        </div>

        {error && (
          <div role="alert" className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourcompany.com"
                required
                autoComplete="email"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-400 mt-4 tracking-wide">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
