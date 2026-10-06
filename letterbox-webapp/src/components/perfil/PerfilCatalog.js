'use client';

import { useState, useEffect } from 'react';
import { ObterCatalogo } from '@/services/api';

export default function PerfilCatalog() {
  const [catalogo, setCatalogo] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    ObterCatalogo()
    .then(setCatalogo)
    .catch((error) => console.warn('Error:', error))
    .finally(setCarregando(false));
  }, []);
  
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