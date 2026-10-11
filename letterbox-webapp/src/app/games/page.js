'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObterJogos } from '@/services/api';

export default function GamesPage() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  useEffect(() => {
    ObterJogos()
    .then(setJogos)
    .catch((error) => console.error('Erro ao buscar jogos:', error))
    .finally(setCarregando(false));
  }, []);

  return (
    <div id="div_principal" className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col items-center">
        <div id="tabela_jogos" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full justify-items-center p-2">
          {carregando ? (
            <p className="col-span-full text-center">Carregando jogos...</p>
          ) : (
            jogos?.map((jogo) => (
              <div key={jogo?.id || jogo?.name} className="relative w-full flex flex-col items-center rounded-3xl">
                <a href={`/games/${jogo?.name_slug}`}>
                  <div className='absolute opacity-0 hover:opacity-100 flex items-end justify-center bg-primary-900/50 border-2 border-primary-300 left-0 top-0 w-full h-full object-cover rounded-3xl text-center transition-opacity'>
                    <div>
                      <p className='p-2 font-semibold text-xl'>{jogo.name}</p>
                    </div>
                  </div>
                  <img
                    src={jogo?.cover_url} 
                    alt={jogo?.name} 
                    className="w-full h-48 object-cover rounded-3xl"
                  />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};