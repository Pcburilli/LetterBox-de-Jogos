'use client';

import { useState, useEffect } from 'react';
import { ObterCatalogo } from '@/services/api';

export default function PerfilCatalog() {
  const [catalogo, setCatalogo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [conteudo, setConteudo] = useState('Jogos')

  console.log(catalogo)
  useEffect(() => {
    ObterCatalogo()
    .then(setCatalogo)
    .catch((error) => console.warn('Error:', error))
    .finally(setCarregando(false));
  }, []);
  
  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div id='nav_bar_perfil' className='flex justify-evenly w-full h-8 bg-primary-800 rounded-2xl -mr-1 gap-2 overflow-x-auto overflow-y-visible scrollbar-none snap-x snap-mandatory'>
            <button onClick={() => setConteudo('Jogos')} className={`font-bold cursor-pointer hover:text-primary-100 ${conteudo === 'Jogos' ? 'text-primary-100' : 'text-primary-300'}`}>Jogos</button>
            <button onClick={() => setConteudo('Reviews')} className={`font-bold cursor-pointer hover:text-primary-100 ${conteudo === 'Reviews' ? 'text-primary-100' : 'text-primary-300'}`}>Reviews</button>
          </div>
          {conteudo === 'Jogos' && 
            <>
              <div id='na_fila' className='w-full'>
                <h1 className='font-bold text-xl ml-4'>Na Fila</h1>
                <div className='flex items-center gap-2 p-2 w-full overflow-x-auto overflow-y-visible scrollbar-none snap-x snap-mandatory'>
                  {catalogo?.filter((jogo) => jogo.status === 'Na Fila').map((jogo) => (
                      <a key={jogo?.id} href={`/games/${jogo?.name_slug}`} className='relative shrink-0 snap-start transition-transform hover:scale-105 focus:outline-none'>
                        <img key={jogo?.capa_url} src={jogo?.capa_url} className='object-cover h-45 w-30 md:h-50 md:w-35 rounded-xl'/>
                        {jogo?.nota ? (<div key={jogo?.nota} className='flex absolute right-0 top-0 mr-2 mt-2 w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center'>{jogo.nota}</div>) : null}
                      </a>
                  ))}
                </div>
              </div>
              <div id='jogando' className='w-full'>
                <h1 className='font-bold text-xl ml-4'>Jogando</h1>
                <div className='flex items-center gap-2 overflow-x-auto overflow-y-visible scrollbar-none p-2 w-full snap-x snap-mandatory'>
                  {catalogo?.filter((jogo) => jogo.status === 'Jogando').map((jogo) => (
                      <a key={jogo?.id} href={`/games/${jogo?.name_slug}`} className='relative shrink-0 snap-start transition-transform hover:scale-105 focus:outline-none'>
                        <img key={jogo?.capa_url} src={jogo?.capa_url} className='object-cover h-45 w-30 md:h-50 md:w-35 rounded-xl'/>
                        {jogo?.nota ? (<div key={jogo?.nota} className='flex absolute right-0 top-0 mr-2 mt-2 w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center'>{jogo.nota}</div>) : null}
                      </a>
                  ))}
                </div>
              </div>
              <div id='zerado' className='w-full'>
                <h1 className='font-bold text-xl ml-4'>Zerado</h1>
                <div className='flex items-center gap-2 overflow-x-auto overflow-y-visible scrollbar-none p-2 w-full snap-x snap-mandatory'>
                  {catalogo?.filter((jogo) => jogo.status === 'Zerado').map((jogo) => (
                      <a key={jogo?.id} href={`/games/${jogo?.name_slug}`} className='relative shrink-0 snap-start transition-transform hover:scale-105 focus:outline-none'>
                        <img key={jogo?.capa_url} src={jogo?.capa_url} className='object-cover h-45 w-30 md:h-50 md:w-35 rounded-xl'/>
                        {jogo?.nota ? (<div key={jogo?.nota} className='flex absolute right-0 top-0 mr-2 mt-2 w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center'>{jogo.nota}</div>) : null}
                      </a>
                  ))}
                </div>
              </div>
              <div id='abandonado' className='w-full'>
                <h1 className='font-bold text-xl ml-4'>Abandonado</h1>
                <div className='flex items-center gap-2 overflow-x-auto overflow-y-visible scrollbar-none p-2 w-full snap-x snap-mandatory'>
                  {catalogo?.filter((jogo) => jogo.status === 'Abandonado').map((jogo) => (
                      <a key={jogo?.id} href={`/games/${jogo?.name_slug}`} className='relative shrink-0 snap-start transition-transform hover:scale-105 focus:outline-none'>
                        <img key={jogo?.capa_url} src={jogo?.capa_url} className='object-cover h-45 w-30 md:h-50 md:w-35 rounded-xl'/>
                        {jogo?.nota ? (<div key={jogo?.nota} className='flex absolute right-0 top-0 mr-2 mt-2 w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center'>{jogo.nota}</div>) : null}
                      </a>
                  ))}
                </div>
              </div>
            </>
          }
          {conteudo === 'Reviews' && 
            <>
              {catalogo?.filter((jogo) => jogo.review && jogo.review.trim() !== '').map((jogo) => (
                <div key={jogo.id} className='flex w-full h-fit gap-2 p-1 rounded-2xl'>
                  <img key={jogo?.capa_url} src={jogo?.capa_url} className='object-cover h-25 w-15 rounded-xl'/>
                  <div className='flex flex-col p-3 wrap-anywhere gap-2'>
                    <h1 className='font-bold text-xl'>{jogo?.name}</h1>
                    {jogo?.nota ? (<div key={jogo?.nota} className='flex w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center'>{jogo.nota}</div>) : null}
                    <p className="rounded-xl">
                      {jogo?.review}
                    </p>
                  </div>
                </div>
              ))}
            </>
          }
        </>
      )}
    </div>
  )
};