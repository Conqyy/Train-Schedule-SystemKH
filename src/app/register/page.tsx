"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/controllers/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = register(name.trim(), email.trim(), password);
      setLoading(false);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      setTimeout(() => router.push("/login"), 1500);
    }, 600);
  };

  return (
    <div className="animate-fade-in-up flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4" style={{ filter: "drop-shadow(0 0 12px rgba(245,158,11,0.4))" }}>🎫</span>
          <h1
            className="text-3xl font-extrabold mb-2"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Account
          </h1>
          <p style={{ color: "#94a3b8" }}>Register to book train tickets across Saudi Arabia</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div
              className="rounded-xl p-3 text-sm font-medium text-center animate-slide-in"
              style={{ background: "rgba(239, 68, 68, 0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="rounded-xl p-3 text-sm font-medium text-center animate-slide-in"
              style={{ background: "rgba(34, 197, 94, 0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              {success}
            </div>
          )}

          <div>
            <label htmlFor="register-name" className="block text-sm font-semibold mb-2 text-white">
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="e.g. Khalid Al-Fahd"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-semibold mb-2 text-white">
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="e.g. khalid@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-semibold mb-2 text-white">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="At least 4 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="register-confirm" className="block text-sm font-semibold mb-2 text-white">
              Confirm Password
            </label>
            <input
              id="register-confirm"
              type="password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account 🚀"
            )}
          </button>

          <p className="text-center text-sm" style={{ color: "#94a3b8" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold no-underline" style={{ color: "#14b8a6" }}>
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
