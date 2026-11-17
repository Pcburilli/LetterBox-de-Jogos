'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PerfilCatalog({ catalogo }) {
  const [conteudo, setConteudo] = useState('Jogos')

  const jogosNaFila = catalogo?.filter((jogo) => jogo.status === 'Na Fila') || [];
  const jogosJogando = catalogo?.filter((jogo) => jogo.status === 'Jogando') || [];
  const jogosZerado = catalogo?.filter((jogo) => jogo.status === 'Zerado') || [];
  const jogosAbandonado = catalogo?.filter((jogo) => jogo.status === 'Abandonado') || [];

  const reviews = catalogo?.filter((jogo) => jogo.review && jogo.review.trim() !== '') || [];
  
  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <div id='nav_bar_perfil' className='flex justify-evenly w-full h-8 bg-primary-800 rounded-2xl -mr-1 gap-2 overflow-x-auto overflow-y-visible scrollbar-none snap-x snap-mandatory'>
        <button onClick={() => setConteudo('Jogos')} className={`font-bold cursor-pointer hover:text-primary-100 ${conteudo === 'Jogos' ? 'text-primary-100' : 'text-primary-300'}`}>Jogos</button>
        <button onClick={() => setConteudo('Reviews')} className={`font-bold cursor-pointer hover:text-primary-100 ${conteudo === 'Reviews' ? 'text-primary-100' : 'text-primary-300'}`}>Reviews</button>
      </div>
      {conteudo === 'Jogos' && 
        <div className='w-full transition-all animate-fadeIn duration-300'>
          <div id='na_fila' className='w-full'>
            <h1 className='font-bold text-xl ml-4 text-primary-100'>Na Fila</h1>
            <div className='flex items-center gap-2 overflow-x-auto overflow-y-visible scrollbar-none p-2 w-full snap-x snap-mandatory'>
            {jogosNaFila.length > 0 ? (
              jogosNaFila.map((jogo) => (
                <Link key={jogo.id} href={`/games/${jogo.name_slug}`} className='relative shrink-0 snap-start transition-transform hover:scale-105 focus:outline-none'>
                  <img src={jogo.cover_url} className='object-cover h-45 w-30 md:h-50 md:w-35 rounded-xl' />
                  {jogo.rate ? (
                    <div className='flex absolute right-0 top-0 mr-2 mt-2 w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center text-primary-200'>
                      {jogo.rate}
                    </div>
                  ) : null}
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-45 w-30 md:h-50 md:w-35 rounded-xl border-2 border-dashed border-primary-700/60 bg-primary-900/30 p-3 select-none">
                  <svg 
                    className="w-7 h-7 text-primary-400/70 mb-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  
                  <p className="text-xs md:text-sm font-medium text-primary-200/80 leading-snug">
                    Nenhum jogo "na fila"
                  </p>
                </div>
            )}
            </div>
          </div>
          <div id='jogando' className='w-full'>
            <h1 className='font-bold text-xl ml-4 text-primary-100'>Jogando</h1>
            <div className='flex items-center gap-2 overflow-x-auto overflow-y-visible scrollbar-none p-2 w-full snap-x snap-mandatory'>
              {jogosJogando.length > 0 ? (
                jogosJogando.map((jogo) => (
                  <Link key={jogo.id} href={`/games/${jogo.name_slug}`} className='relative shrink-0 snap-start transition-transform hover:scale-105 focus:outline-none'>
                    <img src={jogo.cover_url} className='object-cover h-45 w-30 md:h-50 md:w-35 rounded-xl' />
                    {jogo.rate ? (
                      <div className='flex absolute right-0 top-0 mr-2 mt-2 w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center text-primary-200'>
                        {jogo.rate}
                      </div>
                    ) : null}
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-45 w-30 md:h-50 md:w-35 rounded-xl border-2 border-dashed border-primary-700/60 bg-primary-900/30 p-3 select-none">
                  <svg 
                    className="w-7 h-7 text-primary-400/70 mb-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  
                  <p className="text-xs md:text-sm font-medium text-primary-200/80 leading-snug">
                    Nenhum jogo "jogando"
                  </p>
                </div>
              )}
            </div>
          </div>
          <div id='zerado' className='w-full'>
            <h1 className='font-bold text-xl ml-4 text-primary-100'>Zerado</h1>
            <div className='flex items-center gap-2 overflow-x-auto overflow-y-visible scrollbar-none p-2 w-full snap-x snap-mandatory'>
              {jogosZerado.length > 0 ? (
                jogosZerado.map((jogo) => (
                  <Link key={jogo.id} href={`/games/${jogo.name_slug}`} className='relative shrink-0 snap-start transition-transform hover:scale-105 focus:outline-none'>
                    <img src={jogo.cover_url} className='object-cover h-45 w-30 md:h-50 md:w-35 rounded-xl' />
                    {jogo.rate ? (
                      <div className='flex absolute right-0 top-0 mr-2 mt-2 w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center text-primary-200'>
                        {jogo.rate}
                      </div>
                    ) : null}
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-45 w-30 md:h-50 md:w-35 rounded-xl border-2 border-dashed border-primary-700/60 bg-primary-900/30 p-3 select-none">
                  <svg 
                    className="w-7 h-7 text-primary-400/70 mb-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  
                  <p className="text-xs md:text-sm font-medium text-primary-200/80 leading-snug">
                    Nenhum jogo "zerado"
                  </p>
                </div>
              )}
            </div>
          </div>
          <div id='abandonado' className='w-full'>
            <h1 className='font-bold text-xl ml-4 text-primary-100'>Abandonado</h1>
            <div className='flex items-center gap-2 overflow-x-auto overflow-y-visible scrollbar-none p-2 w-full snap-x snap-mandatory'>
              {jogosAbandonado.length > 0 ? (
                jogosAbandonado.map((jogo) => (
                  <Link key={jogo.id} href={`/games/${jogo.name_slug}`} className='relative shrink-0 snap-start transition-transform hover:scale-105 focus:outline-none'>
                    <img src={jogo.cover_url} className='object-cover h-45 w-30 md:h-50 md:w-35 rounded-xl' />
                    {jogo.rate ? (
                      <div className='flex absolute right-0 top-0 mr-2 mt-2 w-7 h-7 rounded-4xl bg-primary-800 font-bold justify-center items-center text-primary-200'>
                        {jogo.rate}
                      </div>
                    ) : null}
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-45 w-30 md:h-50 md:w-35 rounded-xl border-2 border-dashed border-primary-700/60 bg-primary-900/30 p-3 select-none">
                  <svg 
                    className="w-7 h-7 text-primary-400/70 mb-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  
                  <p className="text-xs md:text-sm font-medium text-primary-200/80 leading-snug">
                    Nenhum jogo "abandonado"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      }
      {conteudo === 'Reviews' && 
        <div className='w-full transition-all animate-fadeIn duration-300'>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className='flex w-full h-fit gap-2 p-1 rounded-2xl'>
                <img src={review?.cover_url} className='object-cover h-25 w-15 rounded-xl shrink-0' />
                <div className='flex flex-col p-3 wrap-anywhere gap-2'>
                  <h1 className='font-bold text-xl text-primary-100'>{review?.name}</h1>
                  {review?.rate ? (
                    <div className='flex w-fit font-bold justify-center items-center text-primary-50'>
                      ☆ {review.rate}
                    </div>
                  ) : null}
                  <p className="rounded-xl text-primary-50">
                    {review?.review}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-3 w-full rounded-2xl border-2 border-dashed border-primary-700/60 bg-primary-900/30 p-6 select-none">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-800/50 text-primary-300 shrink-0">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>

              <div>
                <p className="font-semibold text-sm md:text-base text-primary-100">
                  Nenhuma review escrita ainda
                </p>
                <p className="text-xs md:text-sm text-primary-300/80">
                  As avaliações adicionadas aos jogos aparecerão aqui.
                </p>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  )
};