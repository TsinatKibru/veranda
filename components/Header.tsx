import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Products', href: '/#products' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const dashboardHref = (session?.user as any)?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors">
              Veranda
            </span>
            <span className="ml-1.5 text-sm font-medium text-gray-400 group-hover:text-gray-500 transition-colors uppercase tracking-wider">
              Plastics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="h-4 w-px bg-gray-200"></div>

            {session ? (
              <div className="flex items-center space-x-6">
                <Link
                  href={dashboardHref}
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                {session ? (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 mt-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
