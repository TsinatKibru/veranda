'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">Veranda</span>
            <span className="ml-2 text-sm text-gray-500">Plastics</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Products
            </Link>
            <Link
              href="#about"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Contact
            </Link>

            {session ? (
              <>
                <Link
                  href={
                    (session.user as any).role === 'ADMIN'
                      ? '/admin'
                      : '/dashboard'
                  }
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
