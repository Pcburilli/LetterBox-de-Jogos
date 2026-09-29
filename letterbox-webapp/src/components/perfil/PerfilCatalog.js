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
    <div className='flex flex-wrap justify-center gap-2'>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        catalogo?.map((jogo) => (
          <div key={jogo?.id} className='mb-2'>
            <a href={`/games/${jogo?.name_slug}`}>
              <img 
                src={jogo?.img_url}
                className="h-30 w-50 object-cover rounded-md"
              />
            </a>
          </div>
        ))
      )}
    </div>
  )
};