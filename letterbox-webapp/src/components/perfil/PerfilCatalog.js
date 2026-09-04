'use client';

import { useState, useEffect } from 'react';

export default function PerfilCatalog() {
  const [catalogo, setCatalogo] = useState(null)
  const [carregando, setCarregando] = useState(true)

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
            <img src={jogo?.img_url} className="w-full h-full object-cover rounded-md"/>
          </div>
        ))
      )}
    </div>
  )
};