"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Shield, AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is not authenticated
      if (!isAuthenticated) {
        console.log("❌ Not authenticated - redirecting to login");
        router.push("/auth/login");
        return;
      }

      // Check if user is not an admin
      if (!user || user.role !== "ADMIN") {
        console.log("❌ Not an admin - redirecting to login");
        router.push("/auth/login");
        return;
      }
    }
  }, [isAuthenticated, loading, user, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green-600 animate-pulse" />
          </div>
          <p className="text-xl font-semibold text-gray-700">Verifying access...</p>
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

  // Show unauthorized message if not authenticated or not admin
  if (!isAuthenticated || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Admin privileges required.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
}