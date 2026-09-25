'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header({ isLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const Logout = async (e) => {
    e?.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const dados = await response.json();
        router.replace('/');
        router.refresh(); 
      }
    } catch (error) {
      console.warn('Error:', error);
    }
  };

  return (
    <header className="w-full bg-primary-900 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-primary-300 hover:text-primary-100 transition-colors"
            >
              StockG
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {isLoggedIn ? (
              <>
                <Link href="/perfil" className="text-sm font-medium text-primary-200 hover:text-white transition-colors">
                  PERFIL
                </Link>
                <Link href="/games" className="text-sm font-medium text-primary-200 hover:text-white transition-colors">
                  GAMES
                </Link>
                <Link href="/admin" className="text-sm font-medium text-primary-200 hover:text-white transition-colors">
                  ADMIN
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  LOGIN
                </Link>
                <Link href="/register" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  CRIAR CONTA
                </Link>
                <Link href="/games" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  GAMES
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="w-35 h-7 bg-amber-200 rounded-4xl grid place-items-end">
                  <div className='bg-green-300 h-7 w-7 rounded-r-2xl'></div>
                </div>
                <button
                  onClick={Logout}
                  className="px-5 py-2 text-sm font-semibold text-primary-900 bg-primary-500 hover:bg-primary-700 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 focus:ring-offset-primary-900"
                >
                  SAIR
                </button>
              </>
            ) : (
              <div className="w-35 h-7 bg-amber-200 rounded-4xl grid place-items-end">
                <div className='bg-green-300 h-7 w-7 rounded-r-2xl'></div>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-2 rounded-md"
              aria-label="Abrir menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-primary-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/perfil"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1 text-base font-medium"
                >
                PERFIL
              </Link>
              <Link
                href="/games"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1 text-base font-medium"
                >
                GAMES
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1 text-base font-medium"
                >
                ADMIN
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1 text-base font-medium"
                >
                LOGIN
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1 text-base font-medium"
                >
                CRIAR CONTA
              </Link>
              <Link
                href="/games"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1 text-base font-medium"
                >
                GAMES
              </Link>
            </>
          )}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            {isLoggedIn ? (
              <button
                onClick={(e) => {
                  setIsMenuOpen(false);
                  Logout(e);
                }}
                className="block w-full text-center px-4 py-2 text-sm font-semibold text-primary-900 bg-primary-500 hover:bg-primary-700 rounded-lg transition-colors"
                >
                Sair
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </header>
  );
}