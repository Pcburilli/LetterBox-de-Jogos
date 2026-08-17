'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold tracking-tight text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              LetterBox
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Início
            </Link>
            <Link href="/explorar" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {/* Explorar */}
            </Link>
            <Link href="/sobre" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {/* Sobre */}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-5 py-2 text-sm font-semibold text-slate-900 bg-indigo-400 hover:bg-indigo-300 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Login
            </Link>
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
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-4 space-y-3">
          <Link 
            href="/" 
            onClick={() => setIsMenuOpen(false)}
            className="block text-slate-300 hover:text-white py-1 text-base font-medium"
          >
            Início
          </Link>
          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center px-4 py-2 text-sm font-semibold text-slate-900 bg-indigo-400 hover:bg-indigo-300 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}