'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { FiltersGames } from '@/services/api';
import GamesFilter from '@/components/game/GamesFilter';

export default function GamesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const genres = searchParams.get('genres') || '';
  const tags = searchParams.get('tags') || '';
  const developer = searchParams.get('developer') || '';

  const filters = `genres=${genres}&tags=${tags}&developer=${developer}`

  const [jogos, setJogos] = useState([]);
  const [totalPage, setTotalPage] = useState([])
  const [carregando, setCarregando] = useState(true);
  
  useEffect(() => {
    FiltersGames(filters, page)
    .then((dados) => {setJogos(dados.games), setTotalPage(PagList(dados['total_page']))})
    .catch((error) => console.error('Erro ao buscar jogos:', error))
    .finally(() => setCarregando(false));
  }, [filters, page]);

  const TrocarPag = (NewPage) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', NewPage.toString());

    router.replace(`/games?${params.toString()}`);

  }

  const PagList = (total) => {
    let resultado = []
    for (let p = 1; p <= total; p++) {
      resultado.push(p)
    }
    return resultado
  }

  const [filterVisibility, setFilterVisibility] = useState(false)

  return (
    <div id="div_principal" className="flex flex-col md:flex-row w-full max-w-6xl mx-auto mt-2 md:mt-8 gap-2">
      <div id='filter' className='w-full h-fit md:max-w-60 bg-primary-800 rounded-2xl p-3'>
        <button className='w-full h-8 bg-primary-700 hover:bg-primary-500 rounded-2xl md:hidden cursor-pointer' onClick={() => setFilterVisibility(prev => !prev)}>Filtros</button>
        <div className={`${filterVisibility ? 'block' : 'hidden'} md:grid`}>
          <GamesFilter/>
        </div>
      </div>

      <div id="tabela_jogos" className="flex flex-col items-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full justify-items-center">
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

        <div className='flex justify-center gap-3'>
          {totalPage?.map((pag) => (
            <button key={pag} onClick={() => TrocarPag(pag)} className='text-2xl cursor-pointer text-primary-300 hover:text-primary-200'>●</button>
          ))}
        </div>
      </div>

    </div>
  );
};