'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users,
  Package,
  ShoppingCart,
  UserPlus,
  ExternalLink,
  Box,
  LogOut
} from "lucide-react";
import { useState } from "react";

const customMenu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // added loading state

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/admin");

  const handleSignOut = () => {
    setLoading(true); // start loading
    setTimeout(() => {
      localStorage.removeItem("token"); // clear token
      router.push("/auth/logout"); // redirect to logout page
      setLoading(false); // reset loading
    }, 1000); // 1 second loading
  };

  return (
    <aside className="w-64 bg-white text-gray-800 h-screen flex flex-col border-r border-gray-200 sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <Box className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
      </div>

      {/* CUSTOM Section */}
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

      {/* Bottom Links */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={loading} // disable while loading
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
