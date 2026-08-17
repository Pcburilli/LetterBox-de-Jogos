import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/*Logo e Descrição*/}
          <div className="space-y-3 md:col-span-1">
            <Link 
              href="/" 
              className="text-xl font-bold tracking-tight text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              LetterBox
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sua plataforma para organização de Jogos
            </p>
          </div>

          {/*Navegação*/}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/explorar" className="hover:text-white transition-colors">
                  {/* Explorar */}
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  {/* Sobre */}
                </Link>
              </li>
            </ul>
          </div>
          {/*Redes Sociais*/}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Redes Sociais
            </h3>
            <div className="flex space-x-4">
              {/* GitHub */}
              <a 
                href="https://github.com/Pcburilli" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-indigo-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Linha de Copyright */}
        <div className="border-t border-slate-800 mt-2 pt-2 text-center text-xs text-slate-500">
          <p>&copy; {currentYear} Letterbox. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}