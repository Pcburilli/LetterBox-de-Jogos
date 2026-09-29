'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  const BuscarJogos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jogos');

      if (response.ok) {
        const dados = await response.json();
        setJogos(dados)
      }
      } catch (error) {
      console.error('Erro ao buscar jogo:', error);
    } finally {
      setCarregando(false)
    }
  };
  useEffect(() => {
    BuscarJogos();
  }, []);

  return (
    <main className="home-page">
      <div className="flex flex-col items-center">
        <div className="w-full h-80 md:h-128 bg-cover bg-center bg-no-repeat rounded-4xl flex flex-col justify-end pb-8 relative" style={{ backgroundImage: `url(${jogos?.[jogos?.length -1]?.['img_url']})`}}>
          <div className="absolute inset-0 bg-linear-to-t from-primary-900 via-slate-950/1 justify-end pb-8 px-4"></div>
          <div className="absolute inset-0 bg-linear-to-r from-primary-900 via-slate-950/1 justify-end pb-8 px-4"></div>
          <div className="absolute inset-0 bg-linear-to-l from-primary-900 via-slate-950/1 justify-end pb-8 px-4"></div>
          <h1 className="relative z-10 text-2xl md:text-3xl font-bold text-center text-white drop-shadow-lg px-4">
            Avalie seus jogos preferidos.<br/>Salve aqueles que deseja jogar.<br/>Se divirta!
          </h1>
        </div>
        <div id="tabela_jogos" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full justify-items-center p-2">
          {carregando ? (
            <p className="col-span-full text-center">Carregando jogos...</p>
          ) : (
            jogos?.map((jogo) => (
              <div key={jogo?.id || jogo?.name} className="w-full flex flex-col items-center bg-primary-900 rounded-3xl">
                <a href={`/games/${jogo?.name_slug}`}>
                  <img
                    src={jogo?.img_url} 
                    alt={jogo?.name}
                    className="w-60 md:w-100 h-48 object-cover rounded-3xl"
                  />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};