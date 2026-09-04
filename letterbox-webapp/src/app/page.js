'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
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

  const AdicionarJogo = async (e, jogo) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/catalog/add', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({'id_jogo':jogo.id}),
        credentials: 'include'
      });
      const resultado = await response.json();

      if (response.ok) {
        alert('Registro realizado.')
        console.log('Registro realizado:', resultado);
      }
      else if (response.status === 401) {
        alert('Precisa estar logado.')
        console.warn('Erro:', resultado);
        router.replace('/login')
      }
      else if (response.status === 409) {
        alert('Jogo já cadastrado.')
        console.warn('Erro:', resultado);
      }
    } catch (error) {
      console.error('Falha na conexão:', error);
    }
  }

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
            jogos?.map((jogo) => (
              <div key={jogo?.id || jogo?.name} className="w-full flex flex-col items-center bg-slate-900 rounded-3xl p-2">
                <p className="capitalize text-center text-sm font-medium">{jogo?.name}</p>
                <img 
                  src={jogo?.img_url} 
                  alt={jogo?.name} 
                  className="w-full h-48 object-cover rounded-t-3xl"
                />
                <button className='bg-emerald-700 hover:bg-emerald-500 w-full rounded-b-3xl' onClick={(e) => {AdicionarJogo(e, jogo)}}>Adicionar Jogo</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};