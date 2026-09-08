'use client';

import { useState, useEffect } from 'react';

export default function PerfilCatalog() {
  const [catalogo, setCatalogo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [jogoSelecionado, setJogoSelecionado] = useState(null)

  useEffect(() => {
    ObterCatalogo();
  }, []);

  const ObterCatalogo = async (e) => {
    try {
      const response = await fetch('http://localhost:5000/api/catalog', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if(response.ok) {
        const dados = await response.json();
        setCatalogo(dados)
      }
    } catch (error) {
      console.warn('Error:', error)
    } finally {
      setCarregando(false)
    }
  }
  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-items-center p-2'>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        catalogo?.map((jogo) => (
          <div key={jogo?.id} className=''>
            <img 
              src={jogo?.img_url}
              onClick={() => {setJogoSelecionado(jogo)}}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))
      )}
      {jogoSelecionado && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded-lg bg-gray-800 p-6 text-white shadow-xl'>
            <div className="flex items-center justify-between">
              <p className='capitalize'>{jogoSelecionado.name}</p>
              <button onClick={() => {setJogoSelecionado(null)}}>X</button>
            </div>
            <p>lorem</p>
          </div>
        </div>
      )}
    </div>
  )
};