"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import authService from "@/services/auth.service";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call logout API to clear refresh token cookie
        await authService.logout();
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with local cleanup even if API call fails
      } finally {
        // Clear all local auth data
        authService.clearAuthData();
        
        // Redirect to login page
        router.push("/auth/login");
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <LogOut className="w-8 h-8 text-green-600 animate-pulse" />
        </div>
        <p className="text-xl font-semibold text-gray-700">Logging out...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait</p>
        
        {/* Loading spinner */}
        <div className="mt-6">
          <svg
            className="animate-spin h-8 w-8 text-green-600 mx-auto"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}