'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ObterJogosSearch } from '@/services/api';

export default function GamesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState('')

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pathname = searchParams.get('q');

  const [jogos, setJogos] = useState([]);
  const [totalPage, setTotalPage] = useState([])
  const [carregando, setCarregando] = useState(true);
  
  useEffect(() => {
    if (!search.trim()) {
      ObterJogosSearch('', page)
      .then((dados) => {setJogos(dados['games']), setTotalPage(PagList(dados['total_paginas']))})
      .catch((error) => console.error('Erro ao buscar jogos:', error))
      .finally(() => setCarregando(false));
      return;
    }

    setCarregando(true);

    ObterJogosSearch(pathname, page)
    .then((dados) => {setJogos(dados['games']), setTotalPage(PagList(dados['total_paginas']))})
    .catch((error) => console.error('Erro ao buscar jogos:', error))
    .finally(() => setCarregando(false));

  }, [pathname, page]);

  const TrocarPag = (NewPage) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', NewPage.toString());

    router.replace(`/admin/games?${params.toString()}`);

  }

  const PagList = (total) => {
    let resultado = []
    for (let p = 1; p <= total; p++) {
      resultado.push(p)
    }
    return resultado  
  }

  const SearchGame = (e) => {
    e.preventDefault();
    
    router.replace(`/admin/games?q=${encodeURIComponent(search.trim())}&page=1`);
  }


  return (
    <div id="div_principal" className="flex flex-col w-full max-w-6xl mx-auto mt-2 md:mt-8 gap-2">
      <div id='filter' className='w-full h-fit bg-primary-800 rounded-2xl p-3'>
        <div className=''>
          <form id='search' onSubmit={SearchGame} className='flex mr-4 md:mr-0 ml-auto md:ml-0 items-center w-full h-8 bg-primary-700 rounded-2xl focus-within:ring-2 focus-within:ring-primary-500 transition-all'>
            <input 
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-3 pr-1 text-xs text-primary-100 placeholder:text-primary-300 bg-transparent focus:outline-none'
            />
            <button 
              type="submit" 
              className='flex items-center justify-center w-8 h-full text-primary-300 hover:text-white rounded-r-2xl cursor-pointer transition-colors shrink-0'
            >
              🔍︎
            </button>
          </form>
        </div>
      </div>

      <div id="tabela_jogos" className="flex flex-col items-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full justify-items-center">
          {carregando ? (
            <p className="col-span-full text-center">Carregando jogos...</p>
          ) : (
            jogos?.map((jogo) => (
              <div key={jogo?.id || jogo?.name} className="relative w-full flex flex-col items-center rounded-3xl">
                <a href={`/admin/games/${jogo?.name_slug}`}>
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