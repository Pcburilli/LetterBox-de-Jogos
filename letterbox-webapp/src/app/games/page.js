'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GamesPage() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);

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
    <div id="div_principal" className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col items-center">
        <div id="tabela_jogos" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full justify-items-center p-2">
          {carregando ? (
            <p className="col-span-full text-center">Carregando jogos...</p>
          ) : (
            jogos?.map((jogo) => (
              <div key={jogo?.id || jogo?.name} className="w-full flex flex-col items-center bg-slate-900 rounded-3xl p-2">
                <a href={`/games/${jogo?.name}`}>
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
    </div>
  );
};