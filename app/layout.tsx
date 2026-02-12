"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/SideBar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = pathname.startsWith("/auth");

  if (isPublicRoute) {
    return (
      <html lang="en">
        <body className="bg-gray-50" suppressHydrationWarning>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-gray-50 m-0 p-0" suppressHydrationWarning>
        <ProtectedRoute>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-h-screen bg-gray-50">
              {children}
            </main>
          </div>
        </ProtectedRoute>
      </body>
    </html>
  );
}