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
    <div id='div_principal'>
      <div className='grid justify-items-center'>
        <h1 style={{fontSize: '3em'}}>Lista de Jogos Cadastrados</h1>
        <div id='tabela_jogos' className='grid grid-cols-10 gap-4 justify-items-center pb-3'>
          {carregando ? (
            <p>Carregando jogos...</p>
          ) : (
            jogos.map((jogo) => (
              <div key={jogo.name} className='w-40'>
                <img src={jogo.img_url} className="w-full h-50 object-cover"></img>
                <p className='capitalize text-center'>{jogo.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};