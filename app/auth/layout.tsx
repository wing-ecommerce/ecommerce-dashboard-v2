'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>; // don't show Navbar/Footer until mounted

  const hideLayout = pathname === '/auth/login' || pathname === '/auth/signup';

   return (
    <>
      {!hideLayout && <Navbar />}
      <main>{children}</main>
    </>
  );
}
