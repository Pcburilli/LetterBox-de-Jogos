'use client';

import PerfilCard from '@/components/perfil/PerfilCard';
import PerfilCatalog from '@/components/perfil/PerfilCatalog';
import { useState, useEffect } from 'react';

export default function PerfilPage() {
  
  return (
    <div className='flex w-full min-h-screen mt-2'>
      <div id='aside' className='w-63 shrink-0'>
        <PerfilCard />
      </div>
      <div id='conteudo' className='flex flex-col flex-1 items-center min-w-0'>
        <h1 className='text-3xl md:text-4xl font-bold mb-6 text-center'>Catálogo</h1>
        <PerfilCatalog/>
      </div>
    </div>
  )
};