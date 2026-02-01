"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Invalid username or password");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.data.access_token);

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center mb-2">Login</h2>
          <p className="text-center text-gray-500 mb-6">
            Welcome back! Please login to your account
          </p>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {/* Username or Email */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username or Email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="text-right mb-6">
            <span className="text-sm text-gray-500 hover:text-green-500 cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* RIGHT SIDE - GREEN BRAND PANEL */}
      <div className="hidden md:flex w-1/2 bg-green-500 items-center justify-center">
        <div className="text-center text-white px-10">
          <h1 className="text-4xl font-bold mb-4">TeeSpace</h1>
          <p className="text-lg opacity-90">
            Discover amazing products <br />
            and enjoy seamless shopping
          </p>
        </div>
      </div>
    </div>
  );
}
