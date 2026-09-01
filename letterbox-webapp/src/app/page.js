'use client'

import { useState, useEffect } from 'react';

export default function Page() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const BuscarJogos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jogos');

      if (response.ok) {
        const dados = await response.json();
        console.log(dados)
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
    <div id="div_principal" className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Lista de Jogos Cadastrados
        </h1>

        <div id="tabela_jogos" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full justify-items-center">
          {carregando ? (
            <p className="col-span-full text-center">Carregando jogos...</p>
          ) : (
            jogos.map((jogo) => (
              <div key={jogo.id || jogo.name} className="w-full flex flex-col items-center">
                <img 
                  src={jogo.img_url} 
                  alt={jogo.name} 
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="capitalize text-center mt-2 text-sm font-medium">{jogo.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};