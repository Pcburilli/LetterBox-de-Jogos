'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ObterJogosSearch } from '@/services/api';

export default function SearchGame() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('q') || '';
  const [jogos, setJogos] = useState(null)
  const [carregando, setCarregando] = useState(true);

  const [totalPag, setTotalPag] = useState([])
  console.log(totalPag)

  useEffect(() => {
      if (!search.trim()) {
        ObterJogosSearch('', page)
        .then((dados) => {setJogos(dados['games']), setTotalPag(PagList(dados['total_paginas']))})
        .catch((error) => console.error('Erro ao buscar jogos:', error))
        .finally(() => setCarregando(false));
        return;
      }

      setCarregando(true);

      ObterJogosSearch(search, page)
      .then((dados) => {setJogos(dados['games']), setTotalPag(PagList(dados['total_paginas']))})
      .catch((error) => console.error('Erro ao buscar jogos:', error))
      .finally(() => setCarregando(false));

    }, [search, page]);

    const TrocarPag = (NewPage) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set('page', NewPage.toString());

      router.replace(`/search?${params.toString()}`);

    }

    const PagList = (total) => {
      let resultado = []
      for (let p = 1; p <= total; p++) {
        resultado.push(p)
      }
      return resultado
    }

  return (
    <div id="div_principal" className="w-full max-w-6xl mx-auto mt-8">
      <h1 className='text-2xl font-medium'>Mostrando resultados para: "{search}"</h1>
      {jogos ? (
        <>
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
                        src={jogo?.img_url} 
                        alt={jogo?.name} 
                        className="w-full h-48 object-cover rounded-3xl"
                      />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <h1>Nenhum resultado.</h1>
      )}
      <div className='flex justify-center gap-3'>
        {totalPag?.map((pag) => (
          <button key={pag} onClick={() => TrocarPag(pag)} className='text-2xl cursor-pointer text-primary-300 hover:text-primary-200'>●</button>
        ))}
      </div>
    </div>
  );
}