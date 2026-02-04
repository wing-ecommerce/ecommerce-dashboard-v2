"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "../components/layout/SideBar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're on a public route (login, logout in auth folder)
  const isPublicRoute = pathname.startsWith("/auth");

  // If public route, don't show sidebar and don't protect
  if (isPublicRoute) {
    return (
      <html lang="en">
        <body className="bg-gray-50">
          {children}
        </body>
      </html>
    );
  }

  // Protected routes with sidebar
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ProtectedRoute>
          <div className="flex min-h-screen">
            {/* Sidebar (Client Component) */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ProtectedRoute>
      </body>
    </html>
  );
}