'use client';

import PerfilCard from '@/components/perfil/PerfilCard';
import PerfilCatalog from '@/components/perfil/PerfilCatalog';
import Statistics from '@/components/perfil/Statistics';
import { useState, useEffect } from 'react';

export default function PerfilPage() {
  const [lenCatalogo, setLenCatalogo] = useState(null)
  
  return (
    <div className='w-full mt-8 gap-2'>
      <div className='w-full'>
        <PerfilCard lenCatalogo={lenCatalogo}/>
      </div>

      <div className='flex mb-2'>
        <div className='w-full md:w-9/12'>
          <PerfilCatalog setLenCatalogo={setLenCatalogo}/>
        </div>
        <div>
          <Statistics />
        </div>
      </div>
    </div>
  )
};