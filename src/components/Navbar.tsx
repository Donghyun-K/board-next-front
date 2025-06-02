'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                게시판
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={logout}
              className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 