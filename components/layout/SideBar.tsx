'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users,
  Package,
  ShoppingCart,
  ExternalLink,
  Box,
  LogOut,
  FolderOpen
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const customMenu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Fixed active link detection
  const isActive = (href: string) => {
    // Exact match for dashboard ("/admin")
    if (href === "/admin") {
      return pathname === "/admin";
    }
    
    // For other routes, check if pathname starts with href
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logout();
      // The useAuth hook will handle the redirect to /auth/login
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even on error
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-64 bg-white text-gray-800 h-screen flex flex-col border-r border-gray-200 sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <Box className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            {user && (
              <p className="text-xs text-gray-500">{user.username}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4">
        <nav className="space-y-1">
          {customMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-3 rounded-lg transition-none ${
                  isActive(item.href)
                    ? "bg-green-600 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-semibold text-sm">
                {user.firstName?.charAt(0) || user.username?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Links */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className={`flex items-center gap-4 w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span>{loading ? "Logging out..." : "Sign Out"}</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Go to Website</span>
        </Link>
      </div>
    </aside>
  );
}