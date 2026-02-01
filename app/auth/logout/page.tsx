// pages/auth/logout.tsx or app/auth/logout/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token"); // remove JWT
    router.push("/auth/login"); // redirect
  }, [router]);

  return <p>Logging out...</p>;
}
