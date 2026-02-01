'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import CartSidebar from '../cart/CartSideBar';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock cart count (replace later)
  const cartCount = 3;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Searching:', searchQuery);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="text-xl lg:text-2xl font-bold text-green-500">
              TeeSpace
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-semibold transition ${
                    pathname === link.href
                      ? 'text-green-500'
                      : 'text-gray-700 hover:text-green-500'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-6 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-purple-500 to-green-500" />
                  )}
                </Link>
              ))}
            </div>

            {/* Search (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border-2 border-purple-100 rounded-full focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-green-500"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </button>

              {/* Sign In */}
              <button
                // onClick={() => router.push('/auth/login')}
                className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md"
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:block font-semibold">Sign In</span>
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-green-500"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-purple-100">

              {/* Mobile Search */}
              <div className="px-2 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border-2 border-purple-100 rounded-full outline-none"
                  />
                </div>
              </div>

              {/* Mobile Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-full font-semibold ${
                      pathname === link.href
                        ? 'bg-gradient-to-r from-purple-50 to-green-50 text-green-500'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-green-500'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Sign In */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/auth/login');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
